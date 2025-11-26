<template>
  <div class="store-page bg-white text-black py-5">
    <div class="text-center mb-5">
      <h3 class="text-uppercase text-dark fw-bold section-subtitle">
        {{ isSearching ? 'Kết quả tìm kiếm' : 'Sản phẩm của chúng tôi' }}
      </h3>
      
      <h2 class="fw-bold text-black section-title">
        <span v-if="isSearching">
          Từ khóa: "<span class="text-primary">{{ searchKeyword }}</span>"
        </span>
        <span v-else>Khám phá tất cả sản phẩm</span>
      </h2>

      <div v-if="!loading" class="mt-2">
        <span class="text-muted fs-5">
          Đã tìm thấy <strong class="text-dark">{{ products.length }}</strong> sản phẩm
        </span>
      </div>

      <div v-if="isSearching" class="mt-3">
        <button @click="clearSearch" class="btn btn-outline-dark rounded-pill px-4">
          <i class="bi bi-arrow-left me-2"></i>Xem tất cả sản phẩm
        </button>
      </div>
    </div>

    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-dark" role="status"></div>
        <p class="mt-2 fw-semibold">Đang tải dữ liệu...</p>
      </div>

      <div v-else>
        <div v-if="products.length > 0" class="product-grid">
          <div v-for="product in products" :key="product.id" class="product-item">
            <div class="card product-card h-100 text-center" @click="goToDetail(product.id)">
              <img :src="product.image || '/images/placeholder.png'" class="card-img-top mx-auto" alt="Ảnh sản phẩm" />

              <div class="card-body d-flex flex-column">
                <h6 class="fw-bold text-dark mb-2 product-name" :title="product.name">
                  {{ product.name }}
                </h6>

                <p class="text-muted mb-1 fw-semibold price-text">
                  {{ formatPrice(getMinPrice(product)) }}
                </p>

                <div class="mb-2">
                  <span class="text-warning fs-6">★★★★★</span>
                </div>

                <button class="btn btn-buy-now px-3 mt-auto w-100">
                  <i class="bi bi-bag me-1"></i> Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
          <h4 class="fw-bold text-muted">Không tìm thấy sản phẩm nào</h4>
          <p class="text-secondary" v-if="isSearching">
            Thử tìm với từ khóa khác.
          </p>
          <button v-if="isSearching" @click="clearSearch" class="btn btn-dark mt-3">
            Về trang cửa hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute(); 

const products = ref([]);
const loading = ref(false);

// Computed: Kiểm tra xem có đang ở chế độ tìm kiếm không
const searchKeyword = computed(() => route.query.search || "");
const isSearching = computed(() => !!searchKeyword.value);

// Lấy sản phẩm (Chỉ xử lý logic tìm kiếm hoặc lấy tất cả)
const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = {
      page: 0,
      size: 100 // Bạn có thể tăng số này lên nếu muốn lấy nhiều hơn
    };

    // Nếu có từ khóa tìm kiếm -> thêm params keyword
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value;
    } 
    
    const res = await axios.get("/api/product", { params });
    const data = res.data.data || res.data.content || res.data || [];
    
    // Sắp xếp ID giảm dần (mới nhất lên đầu)
    products.value = data.sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error(err);
    if(products.value.length > 0) { 
        Swal.fire("Lỗi", "Không thể tải danh sách sản phẩm!", "error");
    }
  } finally {
    loading.value = false;
  }
};

// Xóa tìm kiếm
const clearSearch = () => {
  router.push({ path: '/store' }); // Xóa query params
};

const formatPrice = (price) =>
  price ? price.toLocaleString("vi-VN") + " VNĐ" : "Đang chờ hàng";

const getMinPrice = (product) =>
  !product.skus || !product.skus.length
    ? product.minPrice || 0
    : Math.min(...product.skus.map((s) => s.price));

const goToDetail = (id) => router.push(`/product/${id}`);

// Watcher: Theo dõi URL thay đổi để load lại dữ liệu
watch(
  () => route.query.search,
  () => {
    fetchProducts(); 
  }
);

onMounted(async () => {
  await fetchProducts();
});
</script>

<style scoped>
.section-subtitle {
  letter-spacing: 1.5px;
  font-size: 1rem;
  color: #555;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Responsive grid */
  gap: 28px;
}

.product-card {
  border: none; 
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); 
  transition: all 0.3s ease;
  padding: 16px;
  cursor: pointer; 
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

/* ===== Ảnh sản phẩm ===== */
.product-card img {
  width: 100%;
  height: 220px;
  object-fit: contain; 
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}

/* ===== Tên sản phẩm ===== */
.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  height: 48px; 
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ===== Giá ===== */
.price-text {
  color: #d32f2f !important; 
  font-weight: 700;
  font-size: 18px;
}

/* ===== Nút hành động ===== */
.btn-buy-now {
  background: #000;
  border: none;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  height: 40px;
  transition: all 0.3s ease;
}

.btn-buy-now:hover {
  background: #333;
}
</style>