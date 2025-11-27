<template>
  <div class="tdt-store-page">
    
    <div class="header-spacer"></div>

    <div class="container py-5">
      <div class="row g-5">
         <div class="col-lg-3">
             <div class="sidebar-wrapper sticky-top" style="top: 30px; z-index: 10;">
                <div class="sidebar-header mb-4">
                   <h5 class="fw-bolder ls-2 text-uppercase m-0">Bộ Lọc</h5>
                   <div class="divider-gold"></div>
                </div>
                <div class="filter-section">
                   <h6 class="filter-title">DANH MỤC</h6>
                   <ul class="tdt-nav">
                     <li :class="{ active: filter.categoryId === 'all' }" @click="setCategory('all')">
                       <span class="nav-text">Tất cả sản phẩm</span>
                       <i class="bi bi-chevron-right arrow"></i>
                     </li>
                     <li v-for="category in categories" :key="category.id" 
                         :class="{ active: filter.categoryId === category.id }"
                         @click="setCategory(category.id)">
                       <span class="nav-text">{{ category.name }}</span>
                       <i class="bi bi-chevron-right arrow"></i>
                     </li>
                   </ul>
                </div>

                 <div class="filter-section">
                    <h6 class="filter-title">KHOẢNG GIÁ</h6>
                    <div class="price-input-wrapper">
                        <div class="input-group-tdt">
                           <span class="currency">₫</span>
                           <input type="number" v-model="priceRange.min" placeholder="TỪ">
                        </div>
                        <span class="range-line"></span>
                        <div class="input-group-tdt">
                           <span class="currency">₫</span>
                           <input type="number" v-model="priceRange.max" placeholder="ĐẾN">
                        </div>
                     </div>
                     <button class="btn-apply" @click="applyFilters">ÁP DỤNG</button>
                 </div>
                 
                 <div class="filter-footer mt-4 pt-4 border-top">
                   <button class="btn-clear-tdt w-100" @click="resetFilters">XÓA TẤT CẢ</button>
                 </div>
             </div>
         </div>

         <div class="col-lg-9">
             <div class="d-flex flex-column flex-md-row align-items-end justify-content-between mb-5">
                <div>
                   <h1 class="display-6 fw-bolder text-dark m-0">{{ getCurrentCategoryName() }}</h1>
                   <p class="text-muted small mt-2">Hiển thị {{ products.length }} kết quả</p>
                </div>
                <div class="d-flex align-items-center gap-3 mt-4 mt-md-0">
                    <span class="text-muted small text-uppercase ls-1 fw-bold">Sắp xếp:</span>
                    <div class="dropdown">
                       <button class="btn btn-link text-dark fw-bold text-decoration-none dropdown-toggle p-0 ls-1" type="button" data-bs-toggle="dropdown">
                         {{ getSortLabel() }}
                       </button>
                       <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 rounded-0">
                         <li><a class="dropdown-item py-2" href="#" @click.prevent="setSort('newest')">Mới nhất</a></li>
                         <li><a class="dropdown-item py-2" href="#" @click.prevent="setSort('price_asc')">Giá tăng dần</a></li>
                         <li><a class="dropdown-item py-2" href="#" @click.prevent="setSort('price_desc')">Giá giảm dần</a></li>
                       </ul>
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
                               <h6 class="product-name text-dark mb-2" :title="product.name">{{ product.name }}</h6>
                               <p class="price-text mb-1 text-primary fw-bold">{{ formatPrice(getMinPrice(product)) }}</p>
                               <div class="mb-2 small">
                                 <span class="text-warning"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i></span>
                                 <span class="text-muted ms-1">(4.8)</span>
                               </div>
                               <div class="mt-auto">
                                 <button class="btn btn-buy-now w-100" @click.stop="goToDetail(product.id)">
                                   <i class="bi bi-bag me-2"></i> Mua ngay
                                 </button>
                               </div>
                             </div>
                           </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center mt-5 pt-5" v-if="totalPages > 1">
                        <ul class="pagination-tdt">
                           <li :class="{ disabled: currentPage === 0 }"><button @click="changePage(currentPage - 1)">PREV</button></li>
                           <li v-for="page in visiblePages" :key="page" :class="{ active: currentPage === (page - 1) }"><button @click="page !== '...' && changePage(page - 1)">{{ page }}</button></li>
                           <li :class="{ disabled: currentPage === totalPages - 1 }"><button @click="changePage(currentPage + 1)">NEXT</button></li>
                        </ul>
                    </div>
                </div>
                <div v-else class="text-center py-5">
                   <h4 class="text-muted fw-light mb-3">Chưa có sản phẩm</h4>
                   <button class="btn-clear-tdt px-4 py-2" @click="resetFilters" style="width: auto;">Xóa bộ lọc</button>
                </div>
             </div>
         </div>
      </div>
    </div>

    <AiChatBox />
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/composables/axios.js";
import { useRouter } from "vue-router";
 // Import Component ChatBox

const router = useRouter();

/* ================= STORE LOGIC ================= */
const categories = ref([]);
const products = ref([]);
const loading = ref(false);
const filter = ref({ categoryId: "all" });
const priceRange = ref({ min: null, max: null });
const sortBy = ref("newest");
const currentPage = ref(0);
const pageSize = ref(9);
const totalPages = ref(0);

const formatPrice = (price) => price ? price.toLocaleString("vi-VN") + " ₫" : "Liên hệ";
const getMinPrice = (product) => !product.skus || !product.skus.length ? product.minPrice || 0 : Math.min(...product.skus.map((s) => s.price));
const goToDetail = (id) => router.push(`/product/${id}`);
const getCurrentCategoryName = () => {
  if (filter.value.categoryId === 'all') return "Tất cả sản phẩm";
  const cat = categories.value.find(c => c.id === filter.value.categoryId);
  return cat ? cat.name : "Sản Phẩm";
};
const getSortLabel = () => {
    if(sortBy.value === 'newest') return "Mới nhất";
    if(sortBy.value === 'price_asc') return "Giá thấp - cao";
    if(sortBy.value === 'price_desc') return "Giá cao - thấp";
    return "Sắp xếp";
}

const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/category");
    categories.value = res.data.data || res.data.content || res.data || [];
  } catch (err) { console.error(err); }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = { page: currentPage.value, size: pageSize.value };
    if (filter.value.categoryId !== "all") params.categoryId = filter.value.categoryId;
    if (priceRange.value.min) params.minPrice = priceRange.value.min;
    if (priceRange.value.max) params.maxPrice = priceRange.value.max;
    let sortParam = 'id,desc';
    if (sortBy.value === 'newest') sortParam = 'id,desc';
    if (sortBy.value.includes('price')) params.sort = sortBy.value === 'price_asc' ? 'price,asc' : 'price,desc';
    else params.sort = sortParam;
    const res = await axios.get("/api/product", { params });
    const data = res.data;
    if (data.content) { products.value = data.content; totalPages.value = data.totalPages; } 
    else if (data.data) { const inner = data.data; if(inner.content) { products.value = inner.content; totalPages.value = inner.totalPages; } else { products.value = inner; } } 
    else { products.value = Array.isArray(data) ? data : []; }
  } catch (err) { console.error(err); products.value = []; } 
  finally { loading.value = false; }
};

const setCategory = (id) => { filter.value.categoryId = id; currentPage.value = 0; fetchProducts(); };
const setSort = (type) => { sortBy.value = type; currentPage.value = 0; fetchProducts(); };
const changePage = (page) => { if(page >= 0 && page < totalPages.value) { currentPage.value = page; fetchProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
const applyFilters = () => { currentPage.value = 0; fetchProducts(); };
const resetFilters = () => { filter.value.categoryId = 'all'; priceRange.value = {min:null,max:null}; fetchProducts(); };
const visiblePages = computed(() => {
  const pages = []; const total = totalPages.value; const current = currentPage.value + 1;
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
  else { if (current <= 4) pages.push(1, 2, 3, 4, 5, '...', total); else if (current >= total - 3) pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total); else pages.push(1, '...', current - 1, current, current + 1, '...', total); }
  return pages;
});

onMounted(async () => { await fetchCategories(); await fetchProducts(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');

.tdt-store-page { font-family: 'Manrope', sans-serif; background-color: #fff; color: #111; min-height: 100vh; }
.header-spacer { height: 40px; }
.text-gold { color: #C5A059 !important; }

/* SIDEBAR & CARD STYLES */
.sidebar-wrapper { background: #fff; padding-right: 20px; }
.divider-gold { width: 50px; height: 3px; background: #C5A059; margin-top: 10px; }
.filter-title { font-size: 0.8rem; font-weight: 700; color: #999; margin-bottom: 15px; }
.tdt-nav li { display: flex; justify-content: space-between; padding: 10px 0; cursor: pointer; color: #555; transition: 0.3s; }
.tdt-nav li:hover, .tdt-nav li.active { color: #000; font-weight: 700; }
.tdt-nav li.active .arrow { color: #C5A059; }
.price-input-wrapper { display: flex; gap: 10px; margin-bottom: 15px; }
.input-group-tdt input { width: 100%; border: none; border-bottom: 1px solid #ddd; padding: 8px 0 8px 15px; outline: none; }
.range-line { width: 10px; height: 1px; background: #999; margin-top: 15px; }
.btn-apply { width: 100%; border: 1px solid #000; background: transparent; padding: 10px; font-weight: 700; transition: 0.3s; }
.btn-apply:hover { background: #000; color: #fff; }
.btn-clear-tdt { width: 100%; background: #000; color: #fff; border: none; padding: 14px; font-weight: 700; transition: 0.3s; }
.btn-clear-tdt:hover { background: #C5A059; }

/* Product Card */
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; }
.product-card { background-color: #fff; border: 1px solid #f1f3f5; border-radius: 16px; overflow: hidden; transition: all 0.3s ease; }
.product-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important; border-color: #e9ecef; }
.img-container { position: relative; padding: 20px; background: #fff; height: 220px; display: flex; align-items: center; justify-content: center; }
.card-img-top { width: 100%; height: 100%; object-fit: contain; transition: transform 0.4s ease; }
.product-card:hover .card-img-top { transform: scale(1.08); }
.product-name { font-size: 1rem; font-weight: 700; line-height: 1.4; height: 2.8em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.price-text { font-size: 1.1rem; }
.btn-buy-now { background: #212529; color: #fff; border: none; border-radius: 8px; font-weight: 700; padding: 10px; transition: all 0.3s ease; }
.pagination-tdt li button { border: none; background: transparent; font-weight: 600; color: #999; padding: 5px 10px; }
.pagination-tdt li.active button { color: #000; border-bottom: 2px solid #000; }
</style>