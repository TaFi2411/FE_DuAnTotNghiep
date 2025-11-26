<template>
  <div class="store-page">

    <div class="hero-section d-flex align-items-center">
      <div class="hero-bg-overlay"></div>
      <div class="container position-relative z-2">
        <div class="row align-items-center">
          <div class="col-md-6 hero-content text-center text-md-start">
            <div class="badge-glass mb-4">
              <i class="bi bi-stars me-2"></i>NEW COLLECTION 2025
            </div>
            <h1 class="hero-title display-3 fw-bold mb-3 text-white tracking-tight">
              TITANIUM <br> 
              <span class="text-outline">GEN 15</span>
            </h1>
            <p class="hero-desc lead mb-5 text-white-50" style="max-width: 450px;">
              Sự kết hợp hoàn hảo giữa sức mạnh nguyên bản và thiết kế vượt thời gian.
            </p>
            <button class="btn btn-light rounded-pill fw-bold px-5 py-3 shadow-lg btn-hero">
              KHÁM PHÁ NGAY
            </button>
          </div>
          <div class="col-md-6 d-none d-md-block text-end position-relative">
            <div class="hero-glow-orb"></div>
            <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop"
              class="hero-phone-img" alt="Phone Banner">
          </div>
        </div>
      </div>
    </div>

    <div class="container py-5 main-content-container">
      <div class="row g-5">

        <div class="col-lg-3 mb-5">
          <div class="sidebar-wrapper sticky-top" style="top: 100px; z-index: 10;">
            
            <div class="modern-cat-card p-4">
              <div class="d-flex align-items-center justify-content-between mb-4 ps-2">
                <h5 class="fw-bolder text-black m-0 ls-1">DANH MỤC</h5>
                <span class="badge bg-light text-dark rounded-pill border">{{ categories.length }}</span>
              </div>

              <div class="d-flex flex-column gap-2">
                <div class="cat-item-premium" 
                     :class="{ active: filter.categoryId === 'all' }"
                     @click="setCategory('all')">
                    <div class="d-flex align-items-center">
                      <div class="cat-icon-wrapper"><i class="bi bi-grid-fill"></i></div>
                      <span class="cat-name-text">Tất cả sản phẩm</span>
                    </div>
                    <div class="arrow-indicator"><i class="bi bi-chevron-right"></i></div>
                </div>

                <div v-for="category in categories" :key="category.id" 
                     class="cat-item-premium"
                     :class="{ active: filter.categoryId === category.id }" 
                     @click="setCategory(category.id)">
                  
                  <div class="d-flex align-items-center">
                    <div class="cat-icon-wrapper">
                       <i :class="getCategoryIcon(category.name)"></i>
                    </div>
                    <span class="cat-name-text">{{ category.name }}</span>
                  </div>

                  <div class="arrow-indicator">
                     <i class="bi bi-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="col-lg-9">

          <div class="d-flex flex-wrap justify-content-between align-items-end mb-5 pb-3 border-bottom">
            <div>
              <h6 class="text-muted text-uppercase small fw-bold ls-1 mb-1">
                Bộ sưu tập
              </h6>
              <h2 class="m-0 fw-bolder text-dark display-6">
                {{ getCurrentCategoryName() }}
              </h2>
            </div>

            <div class="d-flex align-items-center gap-3 mt-3 mt-md-0">
              <span class="text-muted small fw-bold text-uppercase d-none d-md-block">Sắp xếp:</span>
              <div class="custom-select-wrapper">
                <select v-model="sortBy" @change="handleSort" class="form-select shadow-none border-0 fw-bold text-dark" style="cursor: pointer;">
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                </select>
                <i class="bi bi-chevron-down select-icon"></i>
              </div>
            </div>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-dark" role="status"></div>
          </div>

          <div v-else>
            <div v-if="products.length > 0">
              <div class="product-grid">
                <div v-for="product in products" :key="product.id" class="product-item">

                  <div class="card product-card h-100 text-center shadow-sm" @click="goToDetail(product.id)">
                    <div class="img-container">
                      <img :src="product.image" class="card-img-top" alt="Ảnh sản phẩm" />
                    </div>

                    <div class="card-body d-flex flex-column px-3 pb-3 pt-0">
                      <h6 class="product-name text-dark mb-2" :title="product.name">
                        {{ product.name }}
                      </h6>
                      <p class="price-text mb-1 text-primary fw-bold">
                        {{ formatPrice(getMinPrice(product)) }}
                      </p>
                      <div class="mb-2 small">
                        <span class="text-warning"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                            class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                            class="bi bi-star-half"></i></span>
                        <span class="text-muted ms-1">(4.8)</span>
                      </div>
                      <p class="text-muted small mb-3 fw-medium">
                        Đã bán {{ product.sold || 0 }}
                      </p>
                      <div class="mt-auto">
                        <button class="btn btn-buy-now w-100" @click.stop="goToDetail(product.id)">
                          <i class="bi bi-bag me-2"></i> Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
              </div>

              <div class="d-flex justify-content-center mt-5 pt-4" v-if="totalPages > 1">
                <nav aria-label="Page navigation">
                  <ul class="pagination pagination-modern">
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                      <button class="page-link" @click="changePage(currentPage - 1)">
                        <i class="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    <li v-for="(page, index) in visiblePages" :key="index" class="page-item"
                      :class="{ active: currentPage === (page - 1), disabled: page === '...' }">
                      <button class="page-link" @click="page !== '...' && changePage(page - 1)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
                      <button class="page-link" @click="changePage(currentPage + 1)">
                        <i class="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div v-else class="text-center py-5">
              <i class="bi bi-box-seam display-4 text-muted opacity-25 mb-3"></i>
              <p class="text-muted fw-medium">Chưa có sản phẩm nào trong danh mục này.</p>
              <button class="btn btn-dark rounded-pill px-4 mt-2" @click="setCategory('all')">
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/composables/axios.js";
import { useRouter } from "vue-router";

const router = useRouter();

// --- State ---
const categories = ref([]);
const products = ref([]);
const loading = ref(false);
const filter = ref({ categoryId: "all" });
const sortBy = ref("newest");

// --- Pagination ---
const currentPage = ref(0);
const pageSize = ref(6);
const totalPages = ref(0);
const totalElements = ref(0);

// --- Computed Pages ---
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value + 1;
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
  else {
    if (current <= 4) pages.push(1, 2, 3, 4, 5, '...', total);
    else if (current >= total - 3) pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    else pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }
  return pages;
});

// --- Helpers ---
const getCategoryIcon = (name) => {
  const n = name ? name.toLowerCase() : '';
  if (n.includes('phone') || n.includes('điện thoại')) return 'bi bi-phone';
  if (n.includes('laptop')) return 'bi bi-laptop';
  if (n.includes('watch')) return 'bi bi-smartwatch';
  if (n.includes('tablet')) return 'bi bi-tablet';
  if (n.includes('sound') || n.includes('âm thanh')) return 'bi bi-headphones';
  return 'bi bi-grid';
};

const getCurrentCategoryName = () => {
  if (filter.value.categoryId === 'all') return "Tất Cả Sản Phẩm";
  const cat = categories.value.find(c => c.id === filter.value.categoryId);
  return cat ? cat.name : "Sản Phẩm";
};

const formatPrice = (price) => price ? price.toLocaleString("vi-VN") + " ₫" : "Liên hệ";
const getMinPrice = (product) => !product.skus || !product.skus.length ? product.minPrice || 0 : Math.min(...product.skus.map((s) => s.price));
const goToDetail = (id) => router.push(`/product/${id}`);

// --- API Calls ---
const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/category");
    categories.value = res.data.data || res.data.content || res.data || [];
  } catch (err) { console.error(err); }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };

    if (filter.value.categoryId !== "all") {
      params.categoryId = filter.value.categoryId;
    }

    // Xử lý Sort logic
    let sortParam = 'id,desc';
    if (sortBy.value === 'newest') sortParam = 'id,desc';
    if (sortBy.value === 'price_asc') sortParam = 'price,asc'; // (Giả sử BE đã có trường price)
    if (sortBy.value === 'price_desc') sortParam = 'price,desc';

    // Fallback nếu BE chưa sort được theo price thì sort theo id
    if (sortBy.value.includes('price')) {
        // params.sort = sortParam; // Mở dòng này khi BE OK
        params.sort = sortBy.value === 'price_asc' ? 'id,asc' : 'id,desc'; 
    } else {
        params.sort = sortParam;
    }

    const res = await axios.get("/api/product", { params });
    const data = res.data;

    // Mapping data an toàn
    if (data.content) {
      products.value = data.content;
      totalPages.value = data.totalPages;
      totalElements.value = data.totalElements;
    } else if (data.data) {
      const innerData = data.data;
      if (innerData.content) {
        products.value = innerData.content;
        totalPages.value = innerData.totalPages;
        totalElements.value = innerData.totalElements;
      } else {
        products.value = Array.isArray(innerData) ? innerData : [];
        totalPages.value = data.totalPages || 0;
        totalElements.value = data.totalElements || products.value.length;
      }
    } else {
      products.value = Array.isArray(data) ? data : [];
      totalPages.value = 0;
      totalElements.value = products.value.length;
    }
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    products.value = [];
  } finally { loading.value = false; }
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value && page !== currentPage.value) {
    currentPage.value = page;
    fetchProducts();
    const grid = document.querySelector('.product-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleSort = () => {
  currentPage.value = 0;
  fetchProducts();
};

const setCategory = (id) => { 
    filter.value.categoryId = id; 
    currentPage.value = 0; 
    fetchProducts(); 
};

onMounted(async () => { await fetchCategories(); await fetchProducts(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap');

/* --- 1. GLOBAL SETTINGS --- */
.store-page {
  background-color: #fff; /* Nền trắng hoàn toàn */
  min-height: 100vh;
  font-family: 'Manrope', sans-serif;
  color: #000;
}

.ls-1 { letter-spacing: 1px; }
.fw-bolder { font-weight: 800 !important; }

/* --- 2. HERO SECTION (DARK THEME) --- */
.hero-section {
  background: #000;
  padding: 100px 0;
  position: relative;
  overflow: hidden;
  color: #fff;
}
.hero-bg-overlay {
  position: absolute;
  inset: 0;
  /* Gradient đen xám nhẹ */
  background: radial-gradient(circle at 30% 50%, #1a1a1a 0%, #000 70%); 
  z-index: 1;
}
.text-outline {
  -webkit-text-stroke: 1px #fff;
  color: transparent;
}
.hero-title { font-weight: 800; letter-spacing: -1px; }

.badge-glass {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-size: 0.75rem;
  letter-spacing: 2px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  color: #fff;
}
.btn-hero {
  transition: transform 0.3s;
}
.btn-hero:hover { transform: translateY(-3px); }

.hero-phone-img {
  max-height: 580px;
  width: auto;
  object-fit: contain;
  position: relative;
  z-index: 2;
  transform: rotate(-12deg) translateY(30px);
  transition: transform 1s ease-out;
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.8));
}
.hero-section:hover .hero-phone-img {
  transform: rotate(0deg) translateY(0);
}
.hero-glow-orb {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  z-index: 1;
  border-radius: 50%;
  filter: blur(50px);
}

/* --- 3. SIDEBAR MỚI (LUXURY STYLE) --- */
.modern-cat-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0,0,0,0.03);
  position: relative;
}

.cat-item-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  background: transparent;
  color: #6c757d;
  border: 1px solid transparent;
}

.cat-item-premium:hover {
  background: #f9f9f9;
  color: #000;
  transform: translateX(5px);
}

/* ACTIVE STATE: MÀU ĐEN */
.cat-item-premium.active {
  background: #000;
  color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transform: scale(1.02);
}

.cat-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-right: 15px;
  transition: 0.3s;
}

.cat-name-text {
  font-weight: 600;
  font-size: 0.95rem;
}

.arrow-indicator {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.cat-item-premium.active .arrow-indicator {
  opacity: 1;
  transform: translateX(0);
  color: #fff;
}

/* --- 4. SORT SELECTOR --- */
.custom-select-wrapper {
  position: relative;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  padding: 0;
  min-width: 180px;
  overflow: hidden;
}
.custom-select-wrapper select {
  width: 100%;
  padding: 8px 15px;
  background-color: transparent !important;
  cursor: pointer;
  appearance: none;
  position: relative;
  z-index: 2;
}
.select-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  color: #000;
  pointer-events: none;
}

/* --- 5. PRODUCT GRID & CARD (GIỮ NGUYÊN THEO YÊU CẦU) --- */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 30px;
}

/* CARD CSS GỐC - KHÔNG SỬA */
.product-card {
  background-color: #fff;
  border: 1px solid #f1f3f5;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
  border-color: #e9ecef;
}
.img-container {
  position: relative;
  padding: 20px;
  background: #fff;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.4s ease;
}
.product-card:hover .card-img-top {
  transform: scale(1.08);
}
.product-name {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8em;
}
.price-text {
  font-size: 1.1rem;
}
.btn-buy-now {
  background: #212529;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  padding: 10px;
  transition: all 0.3s ease;
}
.btn-buy-now:hover {
  background: #495057;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
/* END CARD CSS GỐC */

/* --- 6. PAGINATION (BLACK & WHITE) --- */
.pagination-modern {
  gap: 8px;
  align-items: center;
}
.pagination-modern .page-link {
  width: 42px; height: 42px;
  display: flex;
  align-items: center; justify-content: center;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #000;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.2s;
}
.pagination-modern .page-link:hover {
  background: #f8f9fa;
  border-color: #000;
}
.pagination-modern .page-item.active .page-link {
  background: #000;
  color: #fff;
  border-color: #000;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.pagination-modern .page-item.disabled .page-link {
  opacity: 0.4;
  cursor: not-allowed;
}

/* --- 7. RESPONSIVE --- */
@media (max-width: 768px) {
  .hero-section { padding: 60px 0; text-align: center; }
  .hero-phone-img { display: none; }
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .img-container { height: 160px; padding: 10px; }
  .product-name { font-size: 0.9rem; height: auto; -webkit-line-clamp: 1; }
  .btn-buy-now { font-size: 0.8rem; padding: 8px; }
  .card-body { padding: 10px !important; }
}
</style>