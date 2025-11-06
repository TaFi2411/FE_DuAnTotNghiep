<template>
  <div>
    <div v-for="category in categories" :key="category.key" class="container py-5">
      <div class="text-center mb-4">
        <h5 class="text-uppercase text-primary fw-bold">{{ category.name }}</h5>
        <h2 class="fw-bold">{{ category.subtitle }}</h2>
      </div>

      <!-- Banner -->
      <div class="container-fluid category-banner mb-5">
        <div class="position-relative rounded-4 overflow-hidden">
          <img :src="category.banner" :alt="category.name + ' Banner'" class="w-100 rounded-4" />
          <div class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center overlay-bg">
            <h2 class="fw-bold mb-2">{{ category.name }} Series</h2>
            <p class="fs-5 mb-3">{{ category.description }}</p>
            <router-link :to="category.link" class="btn btn-light rounded-pill px-4 py-2">Khám phá ngay</router-link>
          </div>
        </div>
      </div>

      <!-- Slider sản phẩm -->
      <swiper v-if="category.products.length" :modules="[Navigation, Autoplay]" navigation loop
        :autoplay="{ delay: 3000, disableOnInteraction: false }" :slides-per-view="4" :space-between="20"
        :breakpoints="{320:{slidesPerView:1},576:{slidesPerView:2},768:{slidesPerView:3},992:{slidesPerView:4}}"
        class="py-3 product-swiper">
        
        <swiper-slide v-for="product in category.products" :key="product.id">
          <div class="card product-card h-100 text-center">
            <img :src="product.image" class="card-img-top mx-auto" alt="Ảnh sản phẩm" />

            <div class="card-body d-flex flex-column justify-content-between">
              <h6 class="fw-bold text-dark mb-2 product-name">{{ product.name }}</h6>

              <!-- Giá thấp nhất -->
              <p class="text-muted mb-1 fw-semibold">
                {{ formatPrice(product.price) }}
              </p>

              <!-- Thuộc tính -->
              <div v-if="product.groupedAttributes && Object.keys(product.groupedAttributes).length" class="product-attributes mb-2">
                <div v-for="(values, type) in product.groupedAttributes" :key="type" class="attributes mb-1">
                  <strong class="attr-type">{{ formatAttrType(type) }}:</strong>
                  <span v-for="(val, idx) in values.slice(0,3)" :key="idx" class="attr-square">{{ val }}</span>
                  <span v-if="values.length > 3" class="attr-more">+{{ values.length - 3 }}</span>
                </div>
              </div>

              <!-- 5 sao và số lượng đã bán -->
              <div class="mb-2">
                <span class="text-warning fs-6">★★★★★</span>
              </div>
              <p class="text-muted small mb-3">Đã bán {{ product.sold || 0 }}</p>

              <!-- Nút hành động -->
              <div class="d-flex justify-content-center gap-2 mt-2">
                <button class="btn btn-square btn-cart" @click="addToCart(product)">
                  <i class="bi bi-cart3"></i>
                </button>
                <router-link :to="`/product/${product.id}`" class="btn btn-buy-now px-3">
                  <i class="bi bi-bag me-1"></i> Mua ngay
                </router-link>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <p v-else class="text-center text-muted py-4">Không có sản phẩm nào.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";

const categories = ref([
  { key: 'iphone', name: 'iPhone', subtitle: 'Khám phá iPhone mới nhất', banner: '/images/banner-home-iphone.png', description: 'Hiệu năng vượt trội. Thiết kế đột phá.', link: '/category/iphone', products: [] },
  { key: 'ipad', name: 'iPad', subtitle: 'Trải nghiệm iPad tuyệt vời', banner: '/images/banner-home-ipad.png', description: 'Màn hình lớn. Hiệu năng mạnh mẽ.', link: '/category/ipad', products: [] },
  { key: 'macbook', name: 'MacBook', subtitle: 'Sức mạnh vượt trội cho công việc', banner: '/images/banner-home-macbook.png', description: 'Thiết kế sang trọng. Hiệu năng tối ưu.', link: '/category/macbook', products: [] },
  { key: 'airpods', name: 'AirPods', subtitle: 'Âm thanh sống động', banner: '/images/banner-home-ipod.png', description: 'Thiết kế tiện lợi. Chất lượng âm thanh tuyệt hảo.', link: '/category/airpods', products: [] },
  { key: 'applewatch', name: 'Apple Watch', subtitle: 'Đồng hồ thông minh', banner: '/images/banner-home-watch.png', description: 'Theo dõi sức khỏe. Tích hợp mọi tính năng.', link: '/category/applewatch', products: [] },
]);

const formatPrice = (price) => price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) : "Liên hệ";

const getMinPrice = (product) => {
  if (!product.skus || !product.skus.length) return product.minPrice || 0;
  return Math.min(...product.skus.map(s => s.price));
};

const getProductImage = (product) => {
  if (product.skus?.length && product.skus[0].skuImages?.length) return product.skus[0].skuImages[0].path;
  return product.image || '/images/no-image.png';
};

const formatAttrType = (type) => {
  const map = { color: "Màu sắc", capacity: "Dung lượng", ram: "RAM", size: "Kích thước" };
  return map[type] || type;
};

const fetchProducts = async () => {
  try {
    const res = await axios.get("/api/product", { params: { page: 0, size: 1000 } });
    const allProducts = res.data.data || res.data.content || res.data || [];

    categories.value.forEach(cat => {
      cat.products = allProducts
        .filter(p => p.categoryName && p.categoryName.toLowerCase().includes(cat.key.toLowerCase()))
        .map(p => {
          const grouped = {};
          if (Array.isArray(p.attributes)) {
            p.attributes.forEach(attr => {
              if (!grouped[attr.type]) grouped[attr.type] = [];
              grouped[attr.type].push(attr.value || attr.name);
            });
          }
          return {
            ...p,
            groupedAttributes: grouped,
            price: getMinPrice(p),
            image: getProductImage(p),
            sold: p.sold || 0
          };
        });
    });
  } catch (err) {
    console.error("❌ Lỗi tải sản phẩm:", err);

  }
};

const addToCart = async (product) => {
  try {
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) {
      return Swal.fire("Thông báo", "Vui lòng đăng nhập để thêm vào giỏ hàng", "info");
    }

    await axios.post(`/api/cart/add`, {
      accountId,
      productId: product.id,
      quantity: 1,
    });

    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("❌ Lỗi thêm vào giỏ hàng:", error);
    Swal.fire("Lỗi", "Không thể thêm vào giỏ hàng!", "error");
  }
};

onMounted(fetchProducts);
</script>

<style scoped>
.container {
  background-color: #fff;
  color: #000;
}

/* ===== Bộ lọc ===== */
.filter-btn {
  border: 1px solid #000;
  color: #000;
  border-radius: 8px;
  font-weight: 500;
  background: transparent;
  transition: 0.3s;
}
.filter-btn:hover,
.filter-btn.active {
  background-color: #000;
  color: #fff;
}

/* ===== Swiper ===== */
.product-swiper {
  padding-bottom: 30px;
}
.swiper-slide {
  display: flex;
  height: auto !important;
}

/* ===== Card sản phẩm ===== */
.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  flex: 1;
  width: 100%;
  min-height: 440px;
  border: 1px solid #eee;
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  padding: 16px;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}

/* ===== Ảnh ===== */
.product-card img {
  width: 80%;
  height: 200px;
  object-fit: contain;
  margin: 0 auto 12px;
  transition: transform 0.3s ease;
}
.product-card:hover img {
  transform: scale(1.05);
}

/* ✅ Giới hạn tên sản phẩm 2 dòng + dấu ... */
.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 15px;
  line-height: 1.4;
  margin-bottom: 6px;
}

/* ===== Thuộc tính ===== */
.product-attributes {
  font-size: 13px;
}
.attr-type {
  margin-right: 6px;
  color: #333;
  font-weight: 600;
}
.attributes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-bottom: 4px;
}
.attr-square {
  border: 1px solid #000;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: default;
}
.attr-square:hover {
  background: #000;
  color: #fff;
}
.attr-more {
  font-size: 12px;
  color: #666;
  margin-left: 4px;
}

/* ===== Nút hành động ===== */
.btn-square {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.btn-cart {
  background: #fff;
  border: 1px solid #000;
  color: #000;
}
.btn-cart:hover {
  background: #000;
  color: #fff;
  transform: translateY(-2px);
}
.btn-buy-now {
  background: #000;
  border: none;
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  gap: 6px;
  transition: all 0.3s;
  height: 42px;
}
.btn-buy-now:hover {
  background: #333;
  transform: translateY(-2px);
}
</style>