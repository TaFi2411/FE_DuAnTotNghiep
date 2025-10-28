<template>
  <div class="store-page text-dark min-vh-100">
    <!-- 🎥 Video Banner -->
    <section class="banner-section position-relative overflow-hidden">
      <video autoplay muted loop playsinline class="w-100 h-100 object-fit-cover">
        <source src="/images/banner-iphone.mp4" type="video/mp4" />
      </video>
      <div
        class="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center"
      >
        <h2 class="fw-bold mb-3">Khám phá sản phẩm Apple mới nhất</h2>
        <p class="mb-4 fs-6">
          Trải nghiệm công nghệ đỉnh cao cùng iPhone, iPad, MacBook và hơn thế nữa.
        </p>
        <button class="btn btn-primary px-4 py-2 rounded-pill fw-semibold">
          Mua ngay
        </button>
      </div>
    </section>

    <!-- 🧭 Navbar Danh mục -->
    <nav class="navbar navbar-expand-lg bg-none">
      <div class="container mt-3 mb-1">
        <div class="collapse navbar-collapse justify-content-center">
          <ul
            class="navbar-nav category-nav text-uppercase fw-semibold small rounded-pill px-3 py-2"
          >
            <li
              v-for="cat in categories"
              :key="cat.display"
              class="nav-item"
            >
              <a
                href="#"
                class="nav-link"
                :class="{ active: selectedCategory === cat.display }"
                @click.prevent="selectCategory(cat.display)"
              >
                {{ cat.display }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 🛍️ Danh sách sản phẩm -->
    <div class="container py-5">
      <div class="row g-4">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          v-for="product in filteredProducts"
          :key="product.id"
        >
          <div
            class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-center"
          >
            <!-- Ảnh sản phẩm -->
            <div class="product-image-wrapper">
              <img
                :src="product.image"
                class="product-image"
                :alt="product.name"
              />
            </div>

            <!-- Nội dung sản phẩm -->
            <div class="card-body">
              <h5 class="fw-bold mb-2">{{ product.name }}</h5>
              <p class="text-muted mb-1">
                {{ getMemory(product) || "Không có thông tin bộ nhớ" }}
              </p>
              <p class="fw-semibold text-primary mb-2">
                {{
                  getPrice(product)
                    ? getPrice(product).toLocaleString("vi-VN") + "₫"
                    : "Giá: Liên hệ"
                }}
              </p>
              <router-link
                :to="`/san-pham/${product.id}`"
                class="btn btn-primary rounded-pill px-4 py-2"
              >
                Mua ngay
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// 📦 Danh mục hiển thị và ánh xạ tên trong DB
const categories = [
  { display: "iPhone", db: "điện thoại" },
  { display: "iPad", db: "ipad" },
  { display: "MacBook", db: "mac" },
  { display: "Watch", db: "apple watch" },
  { display: "AirPods", db: "ipod" },
];

// ✅ Danh mục mặc định (hiển thị khi load trang)
const selectedCategory = ref("iPhone");

// 📦 Dữ liệu sản phẩm
const products = ref([]);

// 🧠 Lấy danh sách sản phẩm từ API
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/product");
    products.value = res.data.data || [];
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
});

// 🔍 Lọc sản phẩm theo danh mục đang chọn
const filteredProducts = computed(() => {
  const cat = categories.find((c) => c.display === selectedCategory.value);
  if (!cat) return [];

  const dbCategory = cat.db.toLowerCase();

  return products.value.filter(
    (p) =>
      p.categoryName &&
      p.categoryName.toLowerCase().includes(dbCategory)
  );
});

// 🎯 Khi người dùng chọn danh mục
const selectCategory = (category) => {
  selectedCategory.value = category;
};

// 💰 Lấy giá đầu tiên khác 0 trong danh sách SKU
const getPrice = (product) => {
  if (!product.skus || product.skus.length === 0) return null;
  const skuWithPrice = product.skus.find((sku) => sku.price > 0);
  return skuWithPrice ? skuWithPrice.price : null;
};

// 📱 Lấy đầy đủ dung lượng (RAM / ROM), bỏ qua màu sắc
const getMemory = (product) => {
  if (!product.skus || product.skus.length === 0) return null;

  const memorySet = new Set();

  for (const sku of product.skus) {
    for (const attr of sku.skuAttributes || []) {
      if (
        attr.optionAttributeName &&
        ["ram", "bộ nhớ", "rom", "dung lượng"].includes(
          attr.optionAttributeName.toLowerCase()
        )
      ) {
        memorySet.add(attr.valueAttributeName);
      }
    }
  }

  return Array.from(memorySet).join(" / ");
};
</script>

<style scoped>
/* 🖼️ Ảnh sản phẩm */
.product-image-wrapper {
  width: 100%;
  height: 220px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* 🌈 Navbar danh mục */
.category-nav .nav-link {
  color: #555;
  margin: 0 10px;
  transition: all 0.3s;
}

.category-nav .nav-link:hover {
  color: #007bff;
}

.category-nav .nav-link.active {
  color: #fff;
  background-color: #007bff;
  border-radius: 20px;
  padding: 5px 15px;
}

/* 🧩 Banner video */
.banner-section {
  height: 400px;
  position: relative;
}

.banner-section video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.banner-overlay {
  background: rgba(0, 0, 0, 0.4);
}

/* 🔳 Card sản phẩm */
.card-body {
  padding: 15px;
}
</style>
