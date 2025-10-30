<template>
  <div class="flashsale-container">
    <!-- Header -->
    <div class="flashsale-header">
      <div class="flashsale-logo">⚡FLASH<span>SALE</span>
      <div class="flashsale-status">
  🔥 Đang diễn ra 
</div>

      </div>
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
    v-for="time in saleTimes"
    :key="time.label"
    :class="{ active: activeTime === time.hour }"
    @click="setActiveTime(time.hour)"
  >
    {{ time.label }}<br />
    <small>{{ time.status }}</small>
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
          <div class="discount-badge" v-if="getDiscountPercent(product.id) > 0">
            -{{ getDiscountPercent(product.id) }}%
          </div>
        </div>

        <div class="product-info">
          <h6 class="product-name">{{ product.name }}</h6>

          <!-- Giá sau giảm -->
          <div class="product-prices">
            <span class="new-price">
              {{ formatPrice(getDiscountedPrice(product.id)) }}₫
            </span>
            <span class="old-price">
              {{ formatPrice(getSkuPrice(product.id)) }}₫
            </span>
          </div>

          <!-- Thanh stock và số lượng còn lại -->
          <div class="stock-bar mt-1">
            <div class="progress">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{ width: (getRemainingStock(product.id)/getTotalStock(product.id))*100 + '%' }"
              ></div>
            </div>
            <small class="text-white">
              Còn {{ getRemainingStock(product.id) }}/{{ getTotalStock(product.id) }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && filteredProducts.length === 0"
      class="text-center py-4"
    >
      <p>⚠️ Hiện không có sản phẩm nào trong Flash Sale.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const loading = ref(true);
const activeSales = ref([]);
const products = ref([]);
const skus = ref([]);
const flashSaleSkus = ref([]);
const activeTab = ref("today");
const countdown = ref({ hours: "00", minutes: "00", seconds: "00" });
let countdownTimer = null;


// Flash Sale đang hoạt động
const currentSale = computed(() =>
  activeSales.value.length > 0 ? activeSales.value[0] : null
);

// Lọc sản phẩm theo flash sale
function getProductsByFlashSale(flashSaleId) {
  const activeSkuIds = flashSaleSkus.value
    .filter(fss => fss.flash_sale_id === flashSaleId || fss.flashSaleId === flashSaleId)
    .map(fss => fss.sku_id ?? fss.skuId)
    .filter(id => id != null);

  const productIds = skus.value
    .filter(sku => activeSkuIds.includes(sku.id))
    .map(sku => sku.productId);

  return products.value.filter(p => productIds.includes(p.id));
}

// Filter sản phẩm hiển thị
const filteredProducts = computed(() => {
  if (!activeSales.value.length) return [];

  if (activeTab.value === 'today') {
    // Flash sale đang diễn ra
    if (!currentSale.value) return [];
    return getProductsByFlashSale(currentSale.value.id);
  }

  if (activeTab.value === 'tomorrow') {
    // Flash sale sắp diễn ra theo khung giờ
    const upcomingHours = [19, 21]; // các khung giờ muốn hiển thị
    const now = new Date();
    const upcomingSales = activeSales.value.filter(s => {
      const start = new Date(s.started_date ?? s.startedDate);
      const hour = start.getHours();
      return upcomingHours.includes(hour) && start > now;
    });

    let result = [];
    upcomingSales.forEach(fs => {
      result.push(...getProductsByFlashSale(fs.id));
    });
    return result;
  }

  return [];
});


// Discount
function getDiscountPercent(productId) {
  const sku = skus.value.find((s) => s.productId === productId);
  if (!sku) return 0;

  const flashSaleSku = flashSaleSkus.value.find(
    (f) => f.sku_id === sku.id || f.skuId === sku.id
  );
  if (!flashSaleSku) return 0;

  const flashSale = activeSales.value.find(
    (fs) =>
      fs.id === flashSaleSku.flash_sale_id || fs.id === flashSaleSku.flashSaleId
  );
  const maxDiscount = flashSale?.discount || 0;
  const skuDiscount = flashSaleSku.discount || 0;

  return Math.min(skuDiscount, maxDiscount);
}

// Số lượng còn lại
function getRemainingStock(productId) {
  const sku = skus.value.find(s => s.productId === productId);
  if (!sku) return 0;

  const flashSaleSku = flashSaleSkus.value.find(
    f => f.sku_id === sku.id || f.skuId === sku.id
  );
  if (!flashSaleSku) return 0;

  const purchased = flashSaleSku.purchased ?? 0;
  const quantity = flashSaleSku.quantity ?? 10;

  return Math.max(quantity - purchased, 0);
}

// Tổng số lượng ban đầu
function getTotalStock(productId) {
  const sku = skus.value.find(s => s.productId === productId);
  if (!sku) return 0;

  const flashSaleSku = flashSaleSkus.value.find(
    f => f.sku_id === sku.id || f.skuId === sku.id
  );
  return flashSaleSku?.quantity ?? 10;
}

// Giá sau giảm
function getDiscountedPrice(productId) {
  const sku = skus.value.find((s) => s.productId === productId);
  if (!sku) return 0;

  const discount = getDiscountPercent(productId);
  return sku.price * (1 - discount / 100);
}

// URL ảnh
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

// Countdown
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

// Fetch APIs
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
    const start = new Date(s.started_date ?? s.startedDate);
    const end = new Date(s.ended_date ?? s.endedDate);
    return s.active && start <= now && end >= now;
  });

  if (activeSales.value.length > 0) {
    const end = activeSales.value[0].ended_date ?? activeSales.value[0].endedDate;
    updateCountdown(end);
    countdownTimer = setInterval(() => updateCountdown(end), 1000);
  }

  loading.value = false;
}

async function fetchFlashSaleSkus() {
  const res = await fetch("http://localhost:8080/api/flash-sale-sku");
  const data = await res.json();
  flashSaleSkus.value = data.content || data.data || data || [];
}

// Giá SKU tối thiểu
function getSkuPrice(productId) {
  const skuList = skus.value.filter((s) => s.productId === productId);
  if (skuList.length === 0) return 0;
  const minSku = skuList.reduce((min, s) => (s.price < min.price ? s : min));
  return minSku.price;
}

onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchSkus(),
    fetchFlashSaleSkus(),
    fetchFlashSales(),
  ]);
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
