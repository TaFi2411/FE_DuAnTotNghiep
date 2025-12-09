<template>
  <div class="tdt-store-page">
    <div class="header-spacer"></div>

    <div class="container py-5">
      <div class="row g-5">
        <div class="col-lg-3">
          <div class="sidebar-wrapper sticky-top">
            <div class="sidebar-header mb-4">
              <h5 class="filter-heading">BỘ LỌC TÌM KIẾM</h5>
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
                  :class="{ active: filter.categoryId === category.id }" @click="setCategory(category.id)">
                  <span class="nav-text">{{ category.name }}</span>
                  <i class="bi bi-chevron-right arrow"></i>
                </li>
              </ul>
            </div>

            <div class="filter-section">
              <h6 class="filter-title">KHOẢNG GIÁ</h6>
              
              <div class="price-presets mb-3">
                  <div v-for="(preset, index) in pricePresets" :key="index"
                       class="preset-tag"
                       :class="{ active: isPresetActive(preset) }"
                       @click="selectPreset(preset)">
                      {{ preset.label }}
                  </div>
              </div>

              <div class="range-slider-container mb-4">
                 <div class="slider-track-bg"></div>
                 <div class="slider-track-fill" :style="trackStyle"></div>
                 
                 <input type="range" min="0" :max="sliderLimit" step="100000"
                        v-model.number="tempPrice.min" @input="validateRange('min')"
                        class="range-input min-range">
                 
                 <input type="range" min="0" :max="sliderLimit" step="100000"
                        v-model.number="tempPrice.max" @input="validateRange('max')"
                        class="range-input max-range">
              </div>

              <div class="price-input-wrapper">
                <div class="input-group-tdt">
                  <span class="currency">₫</span>
                  <input type="text" 
                         :value="formatInput(tempPrice.min)" 
                         @input="e => updatePriceInput(e, 'min')"
                         @keyup.enter="applyFilters"
                         placeholder="Từ">
                </div>
                <span class="range-divider">-</span>
                <div class="input-group-tdt">
                  <span class="currency">₫</span>
                  <input type="text" 
                         :value="formatInput(tempPrice.max)" 
                         @input="e => updatePriceInput(e, 'max')"
                         @keyup.enter="applyFilters"
                         placeholder="Đến">
                </div>
              </div>
              
              <button class="btn-apply" @click="applyFilters">ÁP DỤNG</button>
            </div>

            <div class="filter-footer mt-4 pt-3 border-top">
              <button class="btn-clear-tdt w-100" @click="resetFilters">
                <i class="bi bi-arrow-counterclockwise me-2"></i>XÓA TẤT CẢ
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div class="d-flex flex-column flex-md-row align-items-end justify-content-between mb-5">
            <div>
              <h1 class="category-title">{{ getCurrentCategoryName() }}</h1>
              <p class="text-muted small mt-2">Hiển thị {{ filteredProducts.length }} kết quả</p>
            </div>
            <div class="d-flex align-items-center gap-3 mt-4 mt-md-0">
              <span class="text-muted small text-uppercase fw-bold ls-1">Sắp xếp:</span>
              <div class="dropdown">
                <button class="btn btn-sort dropdown-toggle" type="button" data-bs-toggle="dropdown">
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
            <div v-if="filteredProducts.length > 0">
              <div class="product-grid">
                <div v-for="product in filteredProducts" :key="product.id" class="product-item">
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
                     <li :class="{ disabled: currentPage === 0 }">
                         <button @click="changePage(currentPage - 1)">PREV</button>
                     </li>
                     <li v-for="page in visiblePages" :key="page" :class="{ active: currentPage === (page - 1) }">
                         <button @click="page !== '...' && changePage(page - 1)">{{ page }}</button>
                     </li>
                     <li :class="{ disabled: currentPage === totalPages - 1 }">
                         <button @click="changePage(currentPage + 1)">NEXT</button>
                     </li>
                  </ul>
              </div>
            </div>
            
            <div v-else class="text-center py-5">
              <h4 class="text-muted fw-light mb-3">Không tìm thấy sản phẩm nào</h4>
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
import { ref, onMounted, computed, watch } from "vue";
import axios from "@/composables/axios.js";
import { useRouter } from "vue-router";
// import AiChatBox from './AiChatBox.vue'; 

const router = useRouter();

/* ================= STATE ================= */
const categories = ref([]);
const products = ref([]); 
const loading = ref(false);
const filter = ref({ categoryId: "all" });

const sliderLimit = ref(50000000);
const tempPrice = ref({ min: 0, max: 50000000 });
const priceRange = ref({ min: null, max: null });

const sortBy = ref("newest");
const currentPage = ref(0);
const pageSize = ref(9);
const totalPages = ref(0);

// Cấu hình các mốc giá gợi ý
const pricePresets = [
    { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
    { label: '1 - 5 triệu', min: 1000000, max: 5000000 },
    { label: '5 - 15 triệu', min: 5000000, max: 15000000 },
    { label: 'Trên 15 triệu', min: 15000000, max: 100000000 } // Max tượng trưng
];

/* ================= UTILS & UX HELPERS ================= */
const formatPrice = (price) => price ? price.toLocaleString("vi-VN") + " ₫" : "Liên hệ";

// Format số trong input (VD: 1000 -> 1.000)
const formatInput = (val) => {
    if (val === null || val === undefined) return '';
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Xử lý khi gõ vào input (Xóa dấu chấm để lấy số)
const updatePriceInput = (event, type) => {
    let raw = event.target.value.replace(/\./g, ''); // Xóa dấu chấm
    let val = parseInt(raw);
    
    if (isNaN(val)) val = 0;
    
    // Giới hạn không vượt quá slider
    if (val > sliderLimit.value && type === 'min') val = sliderLimit.value; 
    
    tempPrice.value[type] = val;
};

const getMinPrice = (product) => {
  if (!product.skus || !product.skus.length) return product.minPrice || 0;
  return Math.min(...product.skus.map((s) => s.price));
};

const calculateSliderLimit = () => {
    if (products.value.length > 0) {
        const maxP = Math.max(...products.value.map(p => getMinPrice(p)));
        sliderLimit.value = Math.ceil(maxP / 1000000) * 1000000 + 1000000;
        if (priceRange.value.max === null) {
            tempPrice.value.max = sliderLimit.value;
        }
    }
};

const validateRange = (type) => {
    const minGap = 100000; 
    if (type === 'min') {
        if (tempPrice.value.min >= tempPrice.value.max) {
            tempPrice.value.min = tempPrice.value.max - minGap;
        }
    } else {
        if (tempPrice.value.max <= tempPrice.value.min) {
            tempPrice.value.max = tempPrice.value.min + minGap;
        }
    }
};

const trackStyle = computed(() => {
    const limit = sliderLimit.value || 10000000; // Fallback
    const percent1 = (tempPrice.value.min / limit) * 100;
    const percent2 = (tempPrice.value.max / limit) * 100;
    return {
        left: `${Math.max(0, percent1)}%`,
        width: `${Math.max(0, percent2 - percent1)}%`
    };
});

/* ================= PRESET LOGIC ================= */
const selectPreset = (preset) => {
    // 1. Cập nhật thanh trượt và ô input
    tempPrice.value.min = preset.min;
    // Nếu max của preset lớn hơn giới hạn slider, lấy giới hạn slider
    tempPrice.value.max = Math.min(preset.max, sliderLimit.value); 
    
    // 2. Tự động áp dụng bộ lọc luôn (UX tốt hơn)
    applyFilters();
};

const isPresetActive = (preset) => {
    // Highlight nút preset nếu giá trị hiện tại khớp
    return priceRange.value.min === preset.min && 
           (priceRange.value.max === preset.max || 
            (preset.max > sliderLimit.value && priceRange.value.max === sliderLimit.value));
};

const goToDetail = (id) => router.push(`/product/${id}`);

const getCurrentCategoryName = () => {
  if (filter.value.categoryId === 'all') return "Tất cả sản phẩm";
  const cat = categories.value.find(c => c.id === filter.value.categoryId);
  return cat ? cat.name : "Sản Phẩm";
};

const getSortLabel = () => {
    if(sortBy.value === 'newest') return "Mới nhất";
    if(sortBy.value === 'price_asc') return "Giá tăng dần";
    if(sortBy.value === 'price_desc') return "Giá giảm dần";
    return "Sắp xếp";
}

/* ================= FILTER LOGIC ================= */
const sortProducts = (list) => {
    if (sortBy.value === 'price_asc') {
        return list.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    } else if (sortBy.value === 'price_desc') {
        return list.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    } else {
        return list.sort((a, b) => b.id - a.id);
    }
};

const filteredProducts = computed(() => {
    let list = [...products.value]; 

    const min = priceRange.value.min;
    const max = priceRange.value.max;

    if (min !== null) list = list.filter(p => getMinPrice(p) >= min);
    if (max !== null) list = list.filter(p => getMinPrice(p) <= max);

    return sortProducts(list);
});

/* ================= API CALLS ================= */
const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/category");
    categories.value = res.data.data || res.data || [];
  } catch (err) { console.error(err); }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = { page: currentPage.value, size: pageSize.value };

    if (filter.value.categoryId !== "all") {
        params.categoryId = filter.value.categoryId;
    }
    if (priceRange.value.min !== null) params.minPrice = priceRange.value.min;
    if (priceRange.value.max !== null) params.maxPrice = priceRange.value.max;

    const res = await axios.get("/api/product", { params });
    const data = res.data;

    if (data.content) { 
        products.value = data.content; 
        totalPages.value = data.totalPages; 
    } else if (data.data) {
        const inner = data.data;
        if (inner.content) {
            products.value = inner.content;
            totalPages.value = inner.totalPages;
        } else {
            products.value = inner;
        }
    } else {
        products.value = Array.isArray(data) ? data : [];
    }
    calculateSliderLimit();

  } catch (err) { 
    console.error("Lỗi API:", err); 
    products.value = []; 
  } finally { 
    loading.value = false; 
  }
};

/* ================= EVENTS ================= */
const setCategory = (id) => {
    filter.value.categoryId = id;
    currentPage.value = 0;
    fetchProducts();
};

const setSort = (type) => {
    sortBy.value = type;
};

const changePage = (page) => {
    if (page >= 0 && page < totalPages.value) {
        currentPage.value = page;
        fetchProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const applyFilters = () => {
    priceRange.value.min = tempPrice.value.min;
    priceRange.value.max = tempPrice.value.max;
    currentPage.value = 0;
    fetchProducts();
};

const resetFilters = () => {
    filter.value.categoryId = 'all';
    tempPrice.value = { min: 0, max: sliderLimit.value };
    priceRange.value = { min: null, max: null };
    sortBy.value = 'newest';
    currentPage.value = 0;
    fetchProducts();
};

const visiblePages = computed(() => {
  const pages = []; 
  const total = totalPages.value; 
  const current = currentPage.value + 1;
  if (total <= 7) { 
      for (let i = 1; i <= total; i++) pages.push(i); 
  } else { 
      if (current <= 4) pages.push(1, 2, 3, 4, 5, '...', total); 
      else if (current >= total - 3) pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total); 
      else pages.push(1, '...', current - 1, current, current + 1, '...', total); 
  }
  return pages;
});

onMounted(async () => {
    await fetchCategories();
    await fetchProducts();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
.tdt-store-page { font-family: 'Manrope', sans-serif; background-color: #f8f9fa; color: #111; min-height: 100vh; }
.header-spacer { height: 40px; }
.sidebar-wrapper { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); top: 30px; z-index: 10; }
.sidebar-header .filter-heading { font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; font-size: 1rem; margin: 0;}
.divider-gold { width: 40px; height: 3px; background: #C5A059; margin-top: 10px; }
.filter-title { font-size: 0.8rem; font-weight: 700; color: #999; margin-bottom: 15px; margin-top: 20px; text-transform: uppercase; letter-spacing: 0.5px;}
.tdt-nav { padding-left: 0; list-style: none; }
.tdt-nav li { display: flex; justify-content: space-between; padding: 8px 10px; cursor: pointer; color: #555; transition: 0.2s; border-radius: 6px; align-items: center;}
.tdt-nav li:hover { background-color: #f1f1f1; color: #000; }
.tdt-nav li.active { color: #000; font-weight: 700; background-color: #f1f1f1; }
.tdt-nav li.active .arrow { color: #C5A059; }

/* === PRESET TAGS (NEW) === */
.price-presets { display: flex; flex-wrap: wrap; gap: 8px; }
.preset-tag { 
    font-size: 0.8rem; padding: 6px 12px; border: 1px solid #eee; border-radius: 20px; 
    cursor: pointer; background: #fff; color: #555; transition: 0.2s;
}
.preset-tag:hover { background: #f8f9fa; border-color: #ddd; color: #000; }
.preset-tag.active { background: #000; color: #fff; border-color: #000; }

/* === CSS RANGE SLIDER === */
.range-slider-container { position: relative; width: 100%; height: 20px; margin-top: 10px; }
.slider-track-bg { position: absolute; width: 100%; height: 6px; background-color: #eee; top: 50%; transform: translateY(-50%); border-radius: 3px; }
.slider-track-fill { position: absolute; height: 6px; background-color: #C5A059; top: 50%; transform: translateY(-50%); border-radius: 3px; pointer-events: none; z-index: 1; }
.range-input { 
    position: absolute; width: 100%; top: 50%; transform: translateY(-50%); 
    background: none; pointer-events: none; 
    -webkit-appearance: none; appearance: none; z-index: 2; height: 0;
}
/* Thumb Styles (To hơn để dễ kéo) */
.range-input::-webkit-slider-thumb {
    -webkit-appearance: none; width: 20px; height: 20px; 
    background: #fff; border: 2px solid #C5A059; border-radius: 50%; 
    cursor: pointer; pointer-events: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-top: -9px; transition: transform 0.1s;
}
.range-input::-webkit-slider-thumb:active { transform: scale(1.2); }
.range-input::-moz-range-thumb {
    width: 20px; height: 20px; 
    background: #fff; border: 2px solid #C5A059; border-radius: 50%; 
    cursor: pointer; pointer-events: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.price-input-wrapper { display: flex; align-items: center; gap: 8px; margin-bottom: 15px; margin-top: 15px; }
.input-group-tdt { position: relative; width: 100%;}
.input-group-tdt input { width: 100%; border: 1px solid #ddd; border-radius: 4px; padding: 6px 0 6px 20px; outline: none; font-size: 0.9rem;}
.input-group-tdt input:focus { border-color: #000; }
.input-group-tdt .currency { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); font-size: 0.8rem; color: #888;}
.range-divider { color: #999; }

.btn-apply { width: 100%; background: #222; color: #fff; border: none; padding: 10px; font-weight: 700; font-size: 0.9rem; border-radius: 6px; transition: 0.3s; }
.btn-apply:hover { background: #C5A059; }

.btn-clear-tdt { background: transparent; color: #666; border: 1px solid #ddd; padding: 10px; font-weight: 600; font-size: 0.85rem; border-radius: 4px; transition: 0.3s; }
.btn-clear-tdt:hover { background: #f8d7da; color: #dc3545; border-color: #dc3545; }

.category-title { font-weight: 800; color: #000; font-size: 2.2rem; }
.btn-sort { border: none; font-weight: 700; font-size: 1rem; color: #000; padding: 0; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; }
.product-card { background-color: #fff; border: 1px solid #f1f3f5; border-radius: 16px; overflow: hidden; transition: all 0.3s ease; }
.product-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important; border-color: #e9ecef; }
.img-container { position: relative; padding: 20px; background: #fff; height: 220px; display: flex; align-items: center; justify-content: center; }
.card-img-top { width: 100%; height: 100%; object-fit: contain; transition: transform 0.4s ease; }
.product-card:hover .card-img-top { transform: scale(1.08); }
.product-name { font-size: 1rem; font-weight: 700; line-height: 1.4; height: 2.8em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.price-text { font-size: 1.1rem; }
.btn-buy-now { background: #212529; color: #fff; border: none; border-radius: 8px; font-weight: 700; padding: 10px; transition: all 0.3s ease; }
.pagination-tdt { display: flex; list-style: none; gap: 5px; padding: 0;}
.pagination-tdt li button { border: none; background: transparent; font-weight: 600; color: #999; padding: 5px 12px; transition: 0.2s; }
.pagination-tdt li.active button { color: #000; border-bottom: 2px solid #000; }
.pagination-tdt li.disabled button { opacity: 0.5; cursor: not-allowed; }
.pagination-tdt li:not(.active):not(.disabled) button:hover { color: #000; }
</style>