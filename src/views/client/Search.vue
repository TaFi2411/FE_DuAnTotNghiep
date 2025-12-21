<template>
  <div class="search-page-wrapper">
    <div class="header-spacer"></div>

    <div class="container py-5">
      <div class="text-center mb-5 search-header">
        <h5 class="text-uppercase text-muted fw-bold ls-2 subheading">
          {{ isSearching ? 'KẾT QUẢ TÌM KIẾM' : 'KHÁM PHÁ CỬA HÀNG' }}
        </h5>
        
        <h2 class="fw-800 text-black display-5 mt-2">
          <span v-if="isSearching">
            Từ khóa: "<span class="highlight-keyword">{{ searchKeyword }}</span>"
          </span>
          <span v-else>Tất cả sản phẩm</span>
        </h2>

        <div v-if="!loading" class="mt-3">
          <span class="text-muted">
            Tìm thấy <strong>{{ filteredProducts.length }}</strong> sản phẩm phù hợp
          </span>
        </div>

        <div v-if="isSearching" class="mt-4">
          <button @click="clearSearch" class="btn-clear-search">
            <i class="bi bi-arrow-left me-2"></i>Xem tất cả
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-secondary" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3 text-muted fw-500">Đang tìm kiếm dữ liệu...</p>
      </div>

      <div v-else>
        <div v-if="filteredProducts.length > 0" class="product-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-item">
            <div class="card product-card h-100 text-center shadow-sm" @click="goToDetail(product.id)">
              
              <div class="img-container">
                <img :src="product.image || '/images/placeholder.png'" class="card-img-top" alt="Ảnh sản phẩm" />
                <span v-if="product.skus && product.skus.length > 1" class="badge-variant">
                   {{ product.skus.length }} phiên bản
                </span>
              </div>

              <div class="card-body d-flex flex-column px-3 pb-3 pt-0">
                <h6 class="product-name text-dark mb-2" :title="product.name">
                  {{ product.name }}
                </h6>
                
                <p class="price-text mb-1 text-primary fw-bold">
                  {{ formatPrice(getMinPrice(product)) }}
                </p>

                <div class="mb-2 small">
                  <span class="text-warning">
                    <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
                  </span>
                  <span class="text-muted ms-1">(4.8)</span>
                </div>

                <div class="mt-auto">
                  <button class="btn btn-buy-now w-100">
                    <i class="bi bi-bag me-2"></i> Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state text-center py-5">
          <div class="mb-4">
            <div class="bg-light rounded-circle d-inline-flex p-4">
                <i class="bi bi-search" style="font-size: 3rem; color: #adb5bd;"></i>
            </div>
          </div>
          <h4 class="fw-bold text-dark mb-2">Không tìm thấy sản phẩm nào</h4>
          <p class="text-muted mb-4 mx-auto" style="max-width: 500px;">
            Rất tiếc, hệ thống không tìm thấy sản phẩm nào khớp với từ khóa 
            <strong class="text-danger">"{{ searchKeyword }}"</strong>.
          </p>
          <button @click="clearSearch" class="btn btn-dark rounded-pill px-4">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/composables/axios.js";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute(); 

// === STATE ===
const allProducts = ref([]); 
const loading = ref(false);

// === COMPUTED ===
const searchKeyword = computed(() => route.query.search || "");
const isSearching = computed(() => !!searchKeyword.value);

// === UTILS: XÓA DẤU TIẾNG VIỆT ===
function removeVietnameseTones(str) {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^a-z0-9\s]/g, ''); 
    return str.trim();
}

// === 🔥 BỘ LỌC TỪ KHÓA APPLE (QUAN TRỌNG) ===
const cleanKeyword = (query) => {
    let rawQuery = query.toLowerCase();
    
    // Danh sách từ thừa chuyên dụng cho Apple Store
    const stopWords = [
        // 1. Từ ngữ chung
        "màu", "bản", "phiên bản", "loại", "dòng", "cái", "chiếc", "máy", 
        "giá", "khoảng", "tầm", "với", "là", "của", "mua", "bán", "chính hãng",

        // 2. iPhone / iPad (Dung lượng, Bộ nhớ)
        // Xóa 'gb' giúp tìm '128gb' khớp với '128' trong data
        "dung lượng", "bộ nhớ", "rom", "ram", "gb", "tb", 
        "sim", "esim", "vật lý", "quốc tế", "lock",

        // 3. MacBook / Mac (Cấu hình)
        "chip", "vi xử lý", "cpu", "gpu", "ssd", "hdd", "ổ cứng", 
        "inch", "màn hình", "retina", "đời", "năm",

        // 4. Apple Watch (Kích thước, dây đeo)
        // Xóa 'mm' giúp tìm '45mm' khớp với '45' trong data
        "size", "kích thước", "mm", 
        "viền", "khung", "vỏ", "dây", "đeo",

        // 5. AirPods (Phụ kiện)
        "tai nghe", "hộp", "sạc", "cổng", "lightning", "magsafe", "type c",
        "chống ồn", "xuyên âm"
    ];
    
    // Sắp xếp từ dài xóa trước để tránh lỗi cắt chữ
    stopWords.sort((a, b) => b.length - a.length);

    stopWords.forEach(word => {
        // Regex xóa từ đứng riêng lẻ hoặc cụm từ (\b là ranh giới từ)
        const regex = new RegExp(`\\b${word}\\b`, 'gi'); 
        rawQuery = rawQuery.replace(regex, " ");
    });

    // Xóa khoảng trắng thừa do việc replace tạo ra
    return rawQuery.replace(/\s+/g, ' ').trim();
};

const getMinPrice = (product) => {
  if (!product.skus || !product.skus.length) return product.minPrice || 0;
  return Math.min(...product.skus.map((s) => s.price));
};

// === LOGIC LỌC SẢN PHẨM ===
const filteredProducts = computed(() => {
  let products = allProducts.value;

  if (searchKeyword.value) {
    // 1. Làm sạch từ khóa (Xóa chip, gb, màu...)
    const cleanedQuery = cleanKeyword(searchKeyword.value);

    // 2. Chuẩn hóa không dấu
    const normalizedKeyword = removeVietnameseTones(cleanedQuery);
    const searchTokens = normalizedKeyword.split(/\s+/).filter(t => t.length > 0);

    // 3. Lọc: Token phải có trong Tên HOẶC Thuộc tính
    if (searchTokens.length > 0) {
        products = products.filter(product => {
            const normalizedName = removeVietnameseTones(product.name);
            
            // Gom tất cả thuộc tính SKU (Value) thành 1 chuỗi
            const attrValues = product.skus?.flatMap(sku => 
                sku.skuAttributes?.map(attr => attr.valueAttributeName)
            ).join(" ") || "";
            const normalizedAttrs = removeVietnameseTones(attrValues);

            // Kiểm tra từng từ khóa
            return searchTokens.every(token => 
                normalizedName.includes(token) || normalizedAttrs.includes(token)
            );
        });
    }
  }

  return products;
});

// === API ===
const fetchAllProducts = async () => {
  loading.value = true;
  try {
    const params = { page: 0, size: 2000 }; 
    const res = await axios.get("/api/product", { params });
    const data = res.data.data || res.data.content || res.data || [];
    allProducts.value = data.sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error("Lỗi API:", err);
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => {
  router.push({ path: '/search' }); 
};

const formatPrice = (price) =>
  price ? price.toLocaleString("vi-VN") + " ₫" : "Liên hệ";

const goToDetail = (id) => router.push(`/product/${id}`);

onMounted(async () => {
  await fetchAllProducts();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');

.search-page-wrapper {
    font-family: 'Manrope', sans-serif;
    background-color: #f8f9fa;
    min-height: 100vh;
    color: #111;
}

.header-spacer { height: 60px; }

/* === HEADER === */
.subheading { letter-spacing: 2px; font-size: 0.85rem; }
.fw-800 { font-weight: 800; }
.fw-500 { font-weight: 500; }
.highlight-keyword { color: #C5A059; text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 4px; }

.btn-clear-search {
    background: transparent;
    border: 1px solid #111;
    color: #111;
    padding: 8px 24px;
    border-radius: 30px;
    font-weight: 600;
    transition: all 0.3s ease;
}
.btn-clear-search:hover { background: #111; color: #fff; }

/* === GRID & CARDS === */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 30px;
}

.product-card {
    background-color: #fff;
    border: 1px solid #f1f3f5;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
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

.product-card:hover .card-img-top { transform: scale(1.08); }

.badge-variant {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.05);
    color: #666;
    font-size: 0.7rem;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
    backdrop-filter: blur(5px);
}

.product-name {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.4;
    height: 2.8em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.price-text { font-size: 1.1rem; color: #111 !important; }

/* === BUTTONS === */
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
    background: #C5A059;
    color: #fff;
}

@media (max-width: 768px) {
    .display-5 { font-size: 1.8rem; }
    .product-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .img-container { height: 160px; padding: 10px; }
}

@media (max-width: 576px) {
    .product-grid { grid-template-columns: 1fr; }
}
</style>