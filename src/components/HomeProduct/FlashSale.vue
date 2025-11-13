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

    <!-- Timebar: giờ tự động từ flash sale -->
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
              {{ formatPrice(getSkuPrice(product.id)) }}
            </span>
          </div>

          <div class="stock-bar mt-1">
            <div class="progress">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{
                  width:
                    (getRemainingStock(product.id) / getTotalStock(product.id)) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
            <small class="text-white">
              Còn {{ getRemainingStock(product.id) }}/{{ getTotalStock(product.id) }}
            </small>
          </div>

        <button class="btn-detail" @click="buyNow(product)">
  Mua ngay
</button>

        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!loading && filteredProducts.length === 0" class="text-center py-4">
      <p>⚠️ Không có sản phẩm nào trong khung giờ này.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from '@/composables/axios.js';
import Swal from "sweetalert2"; 

const accountId = ref(null);
const router = useRouter();
const loading = ref(true);
const products = ref([]);
const skus = ref([]);
const flashSales = ref([]);
const flashSaleSkus = ref([]);
const currentSlot = ref(null);
const currentSale = ref(null);
const countdown = ref({ hours: "00", minutes: "00", seconds: "00" });
let countdownTimer = null;



function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}


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
  flashSales.value = (fs.content || fs.data || fs || []).filter(fs => fs.active);
}

// --- Tạo danh sách giờ từ flash sale ---
const computedTimeSlots = computed(() => {
  const now = new Date();

  const slots = [...new Set(flashSales.value.map(fs => {
    const start = new Date(fs.started_date ?? fs.startedDate);
    const h = start.getHours().toString().padStart(2, "0");
    const m = start.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`; // ✅ Lấy cả phút
  }))];

  return slots.map(hour => {
    const matchedSale = flashSales.value.find(fs => {
      const start = new Date(fs.started_date ?? fs.startedDate);
      const h = start.getHours().toString().padStart(2, "0");
      const m = start.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}` === hour; // ✅ So sánh cả giờ và phút
    });
    if (!matchedSale) return null;

    const start = new Date(matchedSale.started_date ?? matchedSale.startedDate);
    const end = new Date(matchedSale.ended_date ?? matchedSale.endedDate);

    if (now >= start && now <= end) return { hour, status: "Đang diễn ra" };
    if (now < start) return { hour, status: "Sắp diễn ra" };
    return null;
  }).filter(Boolean);
});


// --- Chọn slot ---
function selectSlot(slot) {
  currentSlot.value = slot.hour;

  const matchedSale = flashSales.value.find(fs => {
    const start = new Date(fs.started_date ?? fs.startedDate);
    const h = start.getHours().toString().padStart(2, "0");
    const m = start.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}` === slot.hour; // ✅ So sánh đúng định dạng giờ:phút
  });

  currentSale.value = matchedSale || null;
  if (currentSale.value) startCountdown();
}

// --- Trạng thái ---
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
    .filter(fss => fss.flash_sale_id === flashSaleId || fss.flashSaleId === flashSaleId)
    .map(fss => fss.sku_id ?? fss.skuId);

  const productIds = skus.value
    .filter(sku => activeSkuIds.includes(sku.id))
    .map(sku => sku.productId);

  return products.value.filter(p => productIds.includes(p.id));
});

// --- Hàm tiện ích ---
function getDiscountPercent(productId) {
  if (!currentSale.value) return 0;
  const sku = skus.value.find(s => s.productId === productId);
  const flashSaleSku = flashSaleSkus.value.find(f =>
    (f.sku_id === sku.id || f.skuId === sku.id) &&
    (f.flash_sale_id === currentSale.value.id || f.flashSaleId === currentSale.value.id)
  );
  if (!flashSaleSku) return 0;
  return flashSaleSku.discount || currentSale.value.discount || 0;
}

function getDiscountedPrice(productId) {
  const sku = skus.value.find(s => s.productId === productId);
  const discount = getDiscountPercent(productId);
  return sku ? sku.price * (1 - discount / 100) : 0;
}

function getSkuPrice(productId) {
  const skuList = skus.value.filter(s => s.productId === productId);
  if (!skuList.length) return 0;
  return Math.min(...skuList.map(s => s.price));
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
  const sku = skus.value.find(s => s.productId === productId);
  const flashSaleSku = flashSaleSkus.value.find(f =>
    (f.sku_id === sku.id || f.skuId === sku.id) &&
    (f.flash_sale_id === currentSale.value.id || f.flashSaleId === currentSale.value.id)
  );
  if (!flashSaleSku) return 0;
  const quantity = flashSaleSku.quantity ?? 10;
  const purchased = flashSaleSku.purchased ?? 0;
  return Math.max(quantity - purchased, 0);
}





async function buyNow(product) {
  try {
    console.log("➡️ Mua ngay:", product);

    // Kiểm tra đăng nhập
    if (!accountId.value) {
      Swal.fire("Chưa đăng nhập", "Vui lòng đăng nhập để mua hàng", "info");
      router.push("/auth/login");
      return;
    }

    // Lấy SKU
    const sku = skus.value.find(s => s.productId === product.id);
    if (!sku) {
      console.error("❌ Không tìm thấy SKU cho productId:", product.id);
      Swal.fire("Lỗi!", "Không tìm thấy biến thể sản phẩm!", "error");
      return;
    }

    // Kiểm tra flash sale
    const flashStock = getRemainingStock(product.id);
    const isInFlashSale = flashStock > 0 && isOngoing.value;
    const price = isInFlashSale
      ? getDiscountedPrice(product.id)
      : getSkuPrice(product.id);

    console.log({
      flashStock,
      isInFlashSale,
      price,
      skuId: sku.id,
      accountId: accountId.value,
    });

    // Gọi API
    await axios.post("/api/cart-details", {
      accountId: accountId.value,
      skuId: sku.id,
      quantity: 1,
      price,
    });

    // Hiển thị Swal
    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      text: isInFlashSale
        ? "Sản phẩm được tính giá Flash Sale."
        : "Sản phẩm được tính giá gốc.",
      showConfirmButton: false,
      timer: 1500,
    });

    window.dispatchEvent(new Event("cart-updated"));
    setTimeout(() => router.push("/cart"), 1500);

  } catch (err) {
    console.error("💥 Lỗi trong buyNow():", err);
    Swal.fire("Lỗi!", "Đã xảy ra sự cố khi mua sản phẩm.", "error");
  }
}



function getTotalStock(productId) {
  const sku = skus.value.find(s => s.productId === productId);
  const flashSaleSku = flashSaleSkus.value.find(f =>
    (f.sku_id === sku.id || f.skuId === sku.id) &&
    (f.flash_sale_id === currentSale.value.id || f.flashSaleId === currentSale.value.id)
  );
  return flashSaleSku?.quantity ?? 10;
}

function getImageUrl(image) {
  if (!image) return "https://placehold.co/300x300?text=No+Image";
  return image.startsWith("http") ? image : `http://localhost:8080/images/${image}`;
}

function setDefaultImage(e) {
  e.target.src = "https://placehold.co/300x300?text=Error";
}

function formatPrice(price) {
  // return price ? price.toLocaleString("vi-VN") : "0";
  return price ? price.toLocaleString("vi-VN") + " VNĐ" : "Đang chờ hàng";
}

// --- Mounted ---
onMounted(async () => {
  await fetchData();
  loading.value = false;
   const token = localStorage.getItem("token");
  if (token) {
    const decoded = decodeJwtToken(token);
    accountId.value = decoded?.accountId || decoded?.id || null;
    console.log("🔐 accountId:", accountId.value);
  }
  
  const nextSlot = computedTimeSlots.value.find(s => s.status === "Sắp diễn ra") 
                   || computedTimeSlots.value[0];
  if (nextSlot) selectSlot(nextSlot);
});

onUnmounted(() => {
  clearInterval(countdownTimer);
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
  gap: 8px;
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
  margin-top: 14px;
  background: #ffcc00;
  color: #000;
  font-weight: bold;
  padding: 6px 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.25s;
  text-decoration: none;
}

.btn-detail:hover {
  background: #ff9900;
  transform: translateY(-2px);
}
</style>
