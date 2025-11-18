<template>
  <div class="store-page bg-white text-black py-5">
    <!-- 🏷️ Tiêu đề -->
    <div class="text-center mb-5">
      <h3 class="text-uppercase text-dark fw-bold section-subtitle">
        Sản phẩm của chúng tôi
      </h3>
      <h2 class="fw-bold text-black section-title">
        Khám phá các dòng sản phẩm nổi bật
      </h2>
    </div>

    <!-- 🧭 Tabs danh mục -->
    <div class="d-flex justify-content-center flex-wrap mb-5">
      <button v-for="category in categories" :key="category.id || 'all'" class="btn filter-btn mx-2 my-1"
        :class="{ active: activeCategory === category.id }" @click="setCategory(category.id)">
        {{ category.name }}
      </button>
    </div>

    <!-- 🛍️ Danh sách sản phẩm -->
    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-dark" role="status"></div>
        <p class="mt-2 fw-semibold">Đang tải sản phẩm...</p>
      </div>

      <div v-else>
        <div v-if="products.length > 0" class="product-grid">
          <div v-for="product in products" :key="product.id" class="product-item">
            <div class="card product-card h-100 text-center">
              <img :src="product.image" class="card-img-top mx-auto" alt="Ảnh sản phẩm" />

              <div class="card-body">
                <h6 class="fw-bold text-dark mb-2 product-name">
                  {{ product.name }}
                </h6>

                <p class="text-muted mb-1 fw-semibold price-text">
                  {{ formatPrice(getMinPrice(product)) }}
                </p>

                <div class="mb-2">
                  <span class="text-warning fs-6">★★★★★</span>
                </div>


                <button class="btn btn-buy-now px-3" @click="goToDetail(product.id)">
                  <i class="bi bi-bag me-1"></i> Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5 text-muted fw-semibold">
          Không có sản phẩm nào trong danh mục này.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();
const categories = ref([{ id: "all", name: "Tất cả" }]);
const products = ref([]);
const activeCategory = ref("all");
const loading = ref(false);


const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/category");
    const list = res.data.data || res.data.content || res.data || [];
    categories.value = [{ id: "all", name: "Tất cả" }, ...list];
  } catch (err) {
    console.error("❌ Lỗi lấy danh mục:", err);
  }
};


const fetchProducts = async (categoryId = "all") => {
  loading.value = true;
  try {
    const params =
      categoryId !== "all" ? { categoryId, page: 0, size: 100 } : { page: 0, size: 100 };
    const res = await axios.get("/api/product", { params });
    const data = res.data.data || res.data.content || res.data || [];
    products.value = data.sort((a, b) => b.id - a.id);
  } catch (err) {
    Swal.fire("Lỗi", "Không thể tải danh sách sản phẩm!", "error");
  } finally {
    loading.value = false;
  }
};

const setCategory = (id) => {
  activeCategory.value = id;
  fetchProducts(id);
};

const formatPrice = (price) =>
  price ? price.toLocaleString("vi-VN") + " VNĐ" : "Đang chờ hàng";

const getMinPrice = (product) =>
  !product.skus || !product.skus.length
    ? product.minPrice || 0
    : Math.min(...product.skus.map((s) => s.price));

const goToDetail = (id) => router.push(`/product/${id}`);

onMounted(async () => {
  await fetchCategories();
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

/* ===== Tabs danh mục ===== */
.filter-btn {
  border: 1px solid #000;
  color: #000;
  border-radius: 8px;
  font-weight: 500;
  background: transparent;
  padding: 8px 18px;
  letter-spacing: 0.4px;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background-color: #000;
  color: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

.product-item {
  display: flex;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  padding: 16px;
  flex: 1;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}

/* ===== Ảnh sản phẩm ===== */
.product-card img {
  width: 80%;
  height: 220px;
  object-fit: contain;
  margin: 0 auto 12px;
  transition: transform 0.3s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}

/* ===== Tên sản phẩm ===== */
.product-name {
  font-size: 20px;
  font-weight: 600;
  color: #111;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Giá ===== */
.price-text {
  color: #000 !important;
  font-weight: 600;
  font-size: 20px;
}

/* ===== Nút hành động ===== */
.btn-buy-now {
  background: #000;
  border: none;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  height: 42px;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
}

.btn-buy-now:hover {
  background: #333;
  transform: translateY(-2px);
}

/* ===== Text nhỏ ===== */
.text-muted {
  color: #666 !important;
  font-weight: 500;
}
</style>
