<template>
  <div class="container py-5">
    <div class="text-center mb-4">
      <h5 class="text-uppercase text-dark fw-bold">Sản phẩm của chúng tôi</h5>
      <h2 class="fw-bold text-black">Khám phá các dòng sản phẩm nổi bật</h2>
    </div>

    <!-- Bộ lọc -->
    <div class="d-flex justify-content-center mb-4 flex-wrap">
      <button
        v-for="filter in filters"
        :key="filter.key"
        class="btn filter-btn mx-2 my-1"
        :class="{ active: activeFilter === filter.key }"
        @click="setFilter(filter.key)"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-dark" role="status"></div>
      <p class="mt-2">Đang tải sản phẩm...</p>
    </div>

    <!-- Danh sách sản phẩm -->
    <swiper
      v-else
      :modules="[Navigation, Autoplay]"
      navigation
      loop
      :autoplay="{ delay: 3500, disableOnInteraction: false }"
      :slides-per-view="4"
      :space-between="20"
      :breakpoints="{
        320: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
      }"
      class="py-3 product-swiper"
    >
      <swiper-slide v-for="product in filteredProducts" :key="product.id">
        <div class="card product-card h-100 text-center">
          <img
            :src="product.image"
            class="card-img-top mx-auto"
            alt="Ảnh sản phẩm"
          />

          <div class="card-body">
            <!-- ✅ Giới hạn tên 2 dòng và có dấu ... -->
            <h6 class="fw-bold text-dark mb-2 product-name">{{ product.name }}</h6>

            <!-- ✅ Giá thấp nhất -->
            <p class="text-muted mb-1 fw-semibold">
              {{ formatPrice(getMinPrice(product)) }}
            </p>

            <!-- ✅ Hiển thị toàn bộ thuộc tính giống trang chi tiết -->
            <div
              v-if="product.groupedAttributes && Object.keys(product.groupedAttributes).length"
              class="product-attributes mb-2"
            >
              <div
                v-for="(values, type) in product.groupedAttributes"
                :key="type"
                class="attributes mb-1"
              >
                <strong class="attr-type">{{ formatAttrType(type) }}:</strong>
                <span
                  v-for="(val, idx) in values.slice(0,3)" 
                  :key="idx"
                  class="attr-square"
                >
                  {{ val }}
                </span>
                <span v-if="values.length > 3" class="attr-more">+{{ values.length - 3 }}</span>
              </div>
            </div>

            <div class="mb-2">
              <span class="text-warning fs-6">★★★★★</span>
            </div>

            <p class="text-muted small mb-3">Đã bán {{ product.sold || 0 }}</p>

            <!-- ✅ Nút hành động -->
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-square btn-cart" @click="addToCart(product)">
                <i class="bi bi-cart3"></i>
              </button>
              <button class="btn btn-buy-now px-3" @click="goToDetail(product.id)">
                <i class="bi bi-bag me-1"></i> Mua ngay
              </button>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import axios from "@/composables/axios.js";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const router = useRouter();
const products = ref([]);
const loading = ref(false);
const activeFilter = ref("all");

const filters = [
  { key: "all", label: "Tất cả sản phẩm" },
  { key: "new", label: "Hàng mới về" },
  { key: "featured", label: "Nổi bật" },
  { key: "bestseller", label: "Bán chạy nhất" },
];

// 📦 Lấy sản phẩm từ API
const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/product", { params: { page: 0, size: 100 } });
    const data = res.data.data || res.data.content || res.data || [];

    products.value = data.map((p) => {
      const grouped = {};
      if (Array.isArray(p.attributes)) {
        p.attributes.forEach((attr) => {
          if (!grouped[attr.type]) grouped[attr.type] = [];
          grouped[attr.type].push(attr.value || attr.name);
        });
      }
      return {
        ...p,
        groupedAttributes: grouped,
      };
      
    }) .sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error("❌ Lỗi tải sản phẩm:", err);
    Swal.fire("Lỗi", "Không thể tải danh sách sản phẩm!", "error");
  } finally {
    loading.value = false;
  }
};

// ✅ Lấy giá thấp nhất trong các biến thể
const getMinPrice = (product) => {
  if (!product.skus || !product.skus.length) return product.minPrice || 0;
  return Math.min(...product.skus.map((s) => s.price));
};

// Bộ lọc
const filteredProducts = computed(() => {
  switch (activeFilter.value) {
    case "new":
      return products.value.filter((p) => p.isNew || p.newProduct === true);
    case "featured":
      return products.value.filter((p) => p.featured || p.noiBat === true);
    case "bestseller":
      return products.value.filter((p) => p.sold > 50).sort((a, b) => b.sold - a.sold);
    default:
      return products.value;
  }
  return list.sort((a, b) => b.id - a.id);
});

const setFilter = (key) => (activeFilter.value = key);

// Định dạng giá
const formatPrice = (price) =>
  price ? price.toLocaleString("vi-VN") + " VND" : "Liên hệ";

// ✅ Mở trang chi tiết
const goToDetail = (id) => router.push(`/san-pham/${id}`);

// ✅ Thêm vào giỏ hàng
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

// Chuyển tên type thành dễ đọc
const formatAttrType = (type) => {
  const map = {
    color: "Màu sắc",
    capacity: "Dung lượng",
    ram: "RAM",
    size: "Kích thước",
  };
  return map[type] || type;
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
