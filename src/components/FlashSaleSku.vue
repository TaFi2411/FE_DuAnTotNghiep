<template>
  <div class="flashsale-container">
    <!-- Header -->
    <div class="flashsale-header">
      <div class="flashsale-logo">⚡FLASH<span>SALE</span></div>
      <div class="countdown-box">
        <span class="label">KẾT THÚC TRONG</span>
        <div class="countdown">
          <span>{{ countdown.hours }}</span> :
          <span>{{ countdown.minutes }}</span> :
          <span>{{ countdown.seconds }}</span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flashsale-tabs">
      <button
        :class="{ active: activeTab === 'today' }"
        @click="activeTab = 'today'"
      >
        Đang diễn ra<br />
        <small>{{ todayTime }}</small>
      </button>
      <button
        :class="{ active: activeTab === 'tomorrow' }"
        @click="activeTab = 'tomorrow'"
      >
        Ngày mai<br />
        <small>{{ tomorrowTime }}</small>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <!-- Danh sách Flash Sale -->
    <div v-else class="product-slider">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <div class="product-img">
          <img
            :src="getImageUrl(product.image)"
            @error="setDefaultImage"
            alt="Ảnh sản phẩm"
          />
          <div class="discount-badge">-{{ currentSale?.discount }}%</div>
        </div>
        <div class="product-info">
          <h6 class="product-name">{{ product.name }}</h6>

          <!-- ✅ Hiển thị giá lấy từ SKU -->
          <div class="product-prices">
            <span class="new-price">
              {{
                formatPrice(
                  getSkuPrice(product.id) * (1 - currentSale.discount / 100)
                )
              }}₫
            </span>
            <span class="old-price">
              {{ formatPrice(getSkuPrice(product.id)) }}₫
            </span>
          </div>

          <div class="stock-bar mt-1">
            <div class="progress">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{ width: randomStock(product.id) + '%' }"
              ></div>
            </div>
            <small class="text-white">
              Còn {{ Math.floor(randomStock(product.id) / 10) }}/10
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const loading = ref(true);
const activeSales = ref([]);
const products = ref([]);
const skus = ref([]); // ✅ thêm danh sách SKU
const activeTab = ref("today");
const countdown = ref({ hours: "00", minutes: "00", seconds: "00" });
let countdownTimer = null;

const todayTime = "09:00 - 23:59";
const tomorrowTime = "09:00 - 23:59";

const currentSale = computed(() =>
  activeSales.value.length > 0 ? activeSales.value[0] : null
);

const filteredProducts = computed(() => products.value);

function getImageUrl(image) {
  if (!image) return "https://placehold.co/300x300?text=No+Image";
  return image.startsWith("http")
    ? image
    : `http://localhost:8080/images/${image}`;
}

function setDefaultImage(event) {
  event.target.src = "https://placehold.co/300x300?text=Error";
}

function formatPrice(price) {
  return price ? price.toLocaleString("vi-VN") : "0";
}

function randomStock(id) {
  return (id * 13) % 90 + 5;
}

function updateCountdown(endDate) {
  const now = new Date();
  const diff = new Date(endDate) - now;
  if (diff <= 0) {
    countdown.value = { hours: "00", minutes: "00", seconds: "00" };
    return;
  }

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  countdown.value = {
    hours: h.toString().padStart(2, "0"),
    minutes: m.toString().padStart(2, "0"),
    seconds: s.toString().padStart(2, "0"),
  };
}

async function fetchProducts() {
  const res = await fetch("http://localhost:8080/api/product");
  const data = await res.json();
  products.value = data.content || data.data || data || [];
}

async function fetchSkus() {
  const res = await fetch("http://localhost:8080/api/sku");
  const data = await res.json();
  skus.value = data.content || data.data || data || [];
}

async function fetchFlashSales() {
  const res = await fetch("http://localhost:8080/api/flash-sale");
  const data = await res.json();
  const list = data.content || data.data || data || [];

  const now = new Date();
  activeSales.value = list.filter((s) => {
    const start = new Date(s.started_date);
    const end = new Date(s.ended_date);
    return s.active && start <= now && end >= now;
  });

  if (activeSales.value.length > 0) {
    const end = activeSales.value[0].ended_date;
    updateCountdown(end);
    countdownTimer = setInterval(() => updateCountdown(end), 1000);
  }

  loading.value = false;
}

// ✅ Hàm lấy giá SKU theo product_id
function getSkuPrice(productId) {
  const skuList = skus.value.filter((s) => s.productId === productId);
  if (skuList.length === 0) return 0;
  const minSku = skuList.reduce((min, s) => (s.price < min.price ? s : min));
  return minSku.price;
}
// ✅ Lấy số lượng tồn theo SKU rẻ nhất
function getSkuQuantity(productId) {
  const skuList = skus.value.filter((s) => s.productId === productId);
  if (skuList.length === 0) return 0;
  const minSku = skuList.reduce((min, s) => (s.price < min.price ? s : min));
  return minSku.quantity || 0;
}

onMounted(async () => {
  await fetchProducts();
  await fetchSkus();
  await fetchFlashSales();
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style scoped>
.flashsale-container {
  background: #2b2b2b;
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin: 30px auto;
  max-width: 1280px;
}

/* Header */
.flashsale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flashsale-logo {
  font-size: 52px;
  font-weight: 900;
  color: #ffcc00;
}
.flashsale-logo span {
  color: #ff6600;
}
.countdown-box {
  text-align: right;
}
.countdown-box .label {
  display: block;
  font-size: 14px;
  color: #ccc;
}
.countdown {
  background: #000;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
}

/* Tabs */
.flashsale-tabs {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 20px;
}
.flashsale-tabs button {
  background: none;
  border: none;
  color: #bbb;
  font-size: 16px;
  text-align: center;
  padding: 8px 16px;
  border-bottom: 3px solid transparent;
  cursor: pointer;
}
.flashsale-tabs button.active {
  color: #fff;
  border-bottom: 3px solid #ffcc00;
}

/* Product Slider */
.product-slider {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 10px 0;
  scroll-behavior: smooth;
}
.product-card {
  background: #1f1f1f;
  border-radius: 12px;
  width: 220px;
  flex-shrink: 0;
  padding: 10px;
  transition: transform 0.2s ease;
  position: relative;
}
.product-card:hover {
  transform: translateY(-4px);
}
.product-img {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
}
.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: red;
  color: white;
  font-size: 13px;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 6px;
}
.product-info {
  text-align: center;
  margin-top: 8px;
}
.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}
.new-price {
  color: #ff6600;
  font-weight: bold;
  font-size: 16px;
}
.old-price {
  color: #aaa;
  text-decoration: line-through;
  font-size: 13px;
}
.progress {
  height: 6px;
  background-color: #555;
}
.progress-bar {
  transition: width 0.4s ease;
}
</style>
