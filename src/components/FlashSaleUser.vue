<template>
  <div class="flashsale-container">
    <!-- Header -->
    <div class="flashsale-header">
      <div class="flashsale-logo">
        ⚡ FLASH <span>SALE</span>
      </div>

      <div v-if="currentSlot" class="flashsale-status">
        <span v-if="isOngoing">ĐANG DIỄN RA</span>
        <span v-else-if="isUpcoming">SẮP DIỄN RA</span>
      </div>

      <div class="countdown-box" v-if="(isOngoing || isUpcoming) && currentSale">
        <span class="label">
          {{ isOngoing ? 'KẾT THÚC TRONG' : 'BẮT ĐẦU SAU' }}
        </span>
        <div class="countdown">
          <span>{{ countdown.hours }}</span> :
          <span>{{ countdown.minutes }}</span> :
          <span>{{ countdown.seconds }}</span>
        </div>
      </div>
    </div>

    <!-- Timebar -->
    <div class="flashsale-timebar">
      <div
        v-for="(slot, index) in computedTimeSlots"
        :key="index"
        class="time-slot"
        :class="{ selected: currentSlot === slot.hour }"
        @click="selectSlot(slot)"
      >
        <div class="time">{{ slot.hour }}</div>
        <div class="status">{{ slot.status }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <!-- Product List -->
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
          <div
            class="discount-badge"
            v-if="getDiscountPercent(product.id) > 0"
          >
            -{{ getDiscountPercent(product.id) }}%
          </div>
        </div>

        <div class="product-info">
          <h6 class="product-name">{{ product.name }}</h6>

          <div class="product-prices">
            <span class="new-price">
              {{
                isUpcoming
                  ? getHiddenPrice(getDiscountedPrice(product.id))
                  : formatPrice(getDiscountedPrice(product.id))
              }}₫
            </span>
            <span class="old-price" v-if="!isUpcoming">
              {{ formatPrice(getSkuPrice(product.id)) }}₫
            </span>
          </div>

          <div class="stock-bar mt-1">
            <div class="progress">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{
                  width:
                    (getRemainingStock(product.id) /
                      getTotalStock(product.id)) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
            <small class="text-white">
              Còn
              {{ getRemainingStock(product.id) }}/{{
                getTotalStock(product.id)
              }}
            </small>
          </div>

          <router-link
            :to="`/san-pham/${product.id}`"
            class="btn-detail"
          >
            Xem chi tiết
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-if="!loading && filteredProducts.length === 0"
      class="text-center py-4"
    >
      <p>⚠️ Không có sản phẩm nào trong khung giờ này.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const loading = ref(true);
const products = ref([]);
const skus = ref([]);
const flashSales = ref([]);
const flashSaleSkus = ref([]);
const currentSlot = ref(null);
const currentSale = ref(null);
const countdown = ref({ hours: "00", minutes: "00", seconds: "00" });
let countdownTimer = null;

// --- Cấu hình khung giờ ---
const timeSlots = ref([
  { hour: "12:00" },
  { hour: "15:00" },
  { hour: "18:00" },
  { hour: "21:00" },
]);

// --- Fetch dữ liệu ---
async function fetchData() {
  const [p, s, fss, fs] = await Promise.all([
    fetch("http://localhost:8080/api/product").then((r) => r.json()),
    fetch("http://localhost:8080/api/sku").then((r) => r.json()),
    fetch("http://localhost:8080/api/flash-sale-sku").then((r) => r.json()),
    fetch("http://localhost:8080/api/flash-sale").then((r) => r.json()),
  ]);

  products.value = p.content || p.data || p || [];
  skus.value = s.content || s.data || s || [];
  flashSaleSkus.value = fss.content || fss.data || fss || [];

  // ✅ Lọc chỉ lấy flash sale active
  const now = new Date();
flashSales.value = (fs.content || fs.data || fs || []).filter(fs => {
  if (!fs.active) return false;
  const start = new Date(fs.started_date ?? fs.startedDate);
  const end = new Date(fs.ended_date ?? fs.endedDate);
  // Chỉ lấy flash sale còn hiệu lực hoặc sắp tới
  return end >= now;
});
}

// --- Tạo danh sách khung giờ với trạng thái ---
const computedTimeSlots = computed(() => {
  const now = new Date();
  const currentHour = now.getHours();

  return timeSlots.value.map((slot) => {
    const slotHour = parseInt(slot.hour.split(":")[0], 10);
    const nextSlot = slotHour + 3;

    if (currentHour >= slotHour && currentHour < nextSlot) {
      return { ...slot, status: "Đang diễn ra" };
    } else if (currentHour < slotHour) {
      return { ...slot, status: "Sắp diễn ra" };
    }
    return { ...slot, status: "Đã kết thúc" };
  });
});

// --- Chọn slot ---
function selectSlot(slot) {
  currentSlot.value = slot.hour;

  const matchedSale = flashSales.value.find((fs) => {
    if (!fs.active) return false;
    const start = new Date(fs.started_date ?? fs.startedDate);
    const hour = start.getHours().toString().padStart(2, "0") + ":00";
    return hour === slot.hour;
  });

  currentSale.value = matchedSale || null;
  if (currentSale.value) startCountdown();
}

// --- Tính trạng thái ---
const isOngoing = computed(() => {
  if (!currentSale.value) return false;
  const now = new Date();
  const start = new Date(currentSale.value.started_date ?? currentSale.value.startedDate);
  const end = new Date(currentSale.value.ended_date ?? currentSale.value.endedDate);
  return now >= start && now <= end;
});

const isUpcoming = computed(() => {
  if (!currentSale.value) return false;
  const now = new Date();
  const start = new Date(currentSale.value.started_date ?? currentSale.value.startedDate);
  return now < start;
});

// --- Countdown ---
function startCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    if (!currentSale.value) return;
    const now = new Date();
    const start = new Date(currentSale.value.started_date ?? currentSale.value.startedDate);
    const end = new Date(currentSale.value.ended_date ?? currentSale.value.endedDate);
    const target = now < start ? start : end;
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(countdownTimer);
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
  }, 1000);
}

// --- Lọc sản phẩm ---
const filteredProducts = computed(() => {
  if (!currentSale.value) return [];
  const flashSaleId = currentSale.value.id;

  const activeSkuIds = flashSaleSkus.value
    .filter(
      (fss) =>
        fss.flash_sale_id === flashSaleId || fss.flashSaleId === flashSaleId
    )
    .map((fss) => fss.sku_id ?? fss.skuId);

  const productIds = skus.value
    .filter((sku) => activeSkuIds.includes(sku.id))
    .map((sku) => sku.productId);

  return products.value.filter((p) => productIds.includes(p.id));
});

// --- Các hàm tiện ích ---
function getDiscountPercent(productId) {
  if (!currentSale.value) return 0;
  const sku = skus.value.find((s) => s.productId === productId);
  const flashSaleSku = flashSaleSkus.value.find(
    (f) =>
      (f.sku_id === sku.id || f.skuId === sku.id) &&
      (f.flash_sale_id === currentSale.value.id ||
        f.flashSaleId === currentSale.value.id)
  );
  if (!flashSaleSku) return 0;
  return flashSaleSku.discount || currentSale.value.discount || 0;
}
function getDiscountedPrice(productId) {
  const sku = skus.value.find((s) => s.productId === productId);
  const discount = getDiscountPercent(productId);
  return sku ? sku.price * (1 - discount / 100) : 0;
}
function getSkuPrice(productId) {
  const skuList = skus.value.filter((s) => s.productId === productId);
  if (!skuList.length) return 0;
  return Math.min(...skuList.map((s) => s.price));
}
function getHiddenPrice(price) {
  if (!price) return "?";
  const str = formatPrice(price);
  const parts = str.split(".");
  const first = parts[0];
  if (first.length === 1) return "?" + "." + parts.slice(1).join(".");
  else if (first.length === 2) return first[0] + "?." + parts.slice(1).join(".");
  else return "?" + "." + parts.slice(1).join(".");
}
function getRemainingStock(productId) {
  const sku = skus.value.find((s) => s.productId === productId);
  const flashSaleSku = flashSaleSkus.value.find(
    (f) =>
      (f.sku_id === sku.id || f.skuId === sku.id) &&
      (f.flash_sale_id === currentSale.value.id ||
        f.flashSaleId === currentSale.value.id)
  );
  if (!flashSaleSku) return 0;
  const quantity = flashSaleSku.quantity ?? 10;
  const purchased = flashSaleSku.purchased ?? 0;
  return Math.max(quantity - purchased, 0);
}
function getTotalStock(productId) {
  const sku = skus.value.find((s) => s.productId === productId);
  const flashSaleSku = flashSaleSkus.value.find(
    (f) =>
      (f.sku_id === sku.id || f.skuId === sku.id) &&
      (f.flash_sale_id === currentSale.value.id ||
        f.flashSaleId === currentSale.value.id)
  );
  return flashSaleSku?.quantity ?? 10;
}
function getImageUrl(image) {
  if (!image) return "https://placehold.co/300x300?text=No+Image";
  return image.startsWith("http") ? image : `http://localhost:8080/images/${image}`;
}
function setDefaultImage(e) { e.target.src = "https://placehold.co/300x300?text=Error"; }
function formatPrice(price) { return price ? price.toLocaleString("vi-VN") : "0"; }

onMounted(async () => {
  await fetchData();
  loading.value = false;

  const now = new Date();

  // ✅ Flash sale đang diễn ra
  const current = flashSales.value.find(fs => {
    if (!fs.active) return false;
    const start = new Date(fs.started_date ?? fs.startedDate);
    const end = new Date(fs.ended_date ?? fs.endedDate);
    return now >= start && now <= end;
  });

  if (current) {
    currentSale.value = current;
    const hour = new Date(current.started_date ?? current.startedDate)
      .getHours()
      .toString()
      .padStart(2, "0") + ":00";
    currentSlot.value = hour;
    startCountdown();
  } else {
    const upcoming = flashSales.value
      .filter(fs => fs.active)
      .map(fs => ({ fs, start: new Date(fs.started_date ?? fs.startedDate) }))
      .filter(x => x.start > now)
      .sort((a, b) => a.start - b.start)[0];

    if (upcoming) {
      currentSale.value = upcoming.fs;
      const hour = upcoming.start
        .getHours()
        .toString()
        .padStart(2, "0") + ":00";
      currentSlot.value = hour;
      startCountdown();
    }
  }
});

onUnmounted(() => clearInterval(countdownTimer));
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
.flashsale-status {
  font-size: 22px;
  font-weight: 700;
  color: #ffcc00;
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
.flashsale-timebar {
  display: flex;
  justify-content: space-between;
  margin: 25px 0 15px;
  background: #1f1f1f;
  border-radius: 8px;
  overflow: hidden;
}
.time-slot {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  background: #333;
  color: #fff;
  transition: 0.3s;
  border-right: 1px solid #444;
  cursor: pointer;
}
.time-slot:last-child {
  border-right: none;
}
.time-slot.selected {
  background: #ffcc00 !important;
  color: #000 !important;
  font-weight: bold;
}
.time-slot .time {
  font-size: 22px;
  font-weight: bold;
}
.time-slot .status {
  font-size: 14px;
  opacity: 0.9;
}
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
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px; /* 👈 tạo khoảng cách đều giữa các phần con */
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}

.product-prices {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 6px;
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

.stock-bar {
  width: 100%;
  margin-top: 6px;
}

.progress {
  height: 6px;
  background-color: #555;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.4s ease;
}

.btn-detail {
  margin-top: 14px; /* 👈 tăng khoảng cách để nhìn thoáng hơn */
  background: #ffcc00;
  color: #000;
  font-weight: bold;
  padding: 6px 14px;
  border: none;
  border-radius: 20px; /* 👈 bo tròn hơn cho đẹp */
  cursor: pointer;
  transition: 0.25s;
  text-decoration: none;
}

.btn-detail:hover {
  background: #ff9900;
  transform: translateY(-2px);
}

</style>
