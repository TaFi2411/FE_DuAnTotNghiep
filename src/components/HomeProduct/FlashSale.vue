<template>
  <div class="flashsale-container">
    <!-- Header -->
    <div class="flashsale-header">
      <div class="flashsale-logo">⚡ FLASH <span>SALE</span></div>

      <div v-if="currentSlot" class="flashsale-status">
        <span v-if="isOngoing">ĐANG DIỄN RA</span>
        <span v-else-if="isUpcoming">SẮP DIỄN RA</span>
      </div>

      <div class="countdown-box" v-if="(isOngoing || isUpcoming) && currentSale">
        <span class="label">{{ isOngoing ? "KẾT THÚC TRONG" : "BẮT ĐẦU SAU" }}</span>
        <div class="countdown">
          <span>{{ countdown.hours }}</span> : <span>{{ countdown.minutes }}</span> :
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
        <div class="status">{{ slot.statusText }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <!-- SKU List -->
    <div v-else class="product-slider">
      <div
        v-for="sku in filteredSkus"
        :key="sku._uid"
        class="product-card"
        :class="{ disabled: isUpcoming }"
        @click="!isUpcoming && goToDetail(sku)"
      >
        <div class="product-img">
          <img
            :src="
              getImageUrl(
                typeof sku.images?.[0] === 'string'
                  ? sku.images[0]
                  : sku.images?.[0]?.path || sku.image
              )
            "
            @error="setDefaultImage"
            alt="SKU image"
          />

          <div class="discount-badge" v-if="sku.discount > 0">-{{ sku.discount }}%</div>
        </div>

        <div class="product-info">
          <h6 class="product-name">{{ sku.skuName || sku.name || sku.skuName }}</h6>
          <!-- Thuộc tính SKU -->
          <div
            v-if="Array.isArray(sku.skuAttributes) && sku.skuAttributes.length"
            class="sku-attributes"
          >
            <span v-for="attr in sku.skuAttributes" :key="attr.id" class="sku-attr-item">
              <strong>{{ attr.optionAttributeName }}:</strong>
              {{ attr.valueAttributeName }}
            </span>
          </div>

          <div class="product-prices">
            <span class="new-price">
              {{
                isUpcoming
                  ? getHiddenPrice((sku.price || 0) * (1 - (sku.discount || 0) / 100))
                  : formatPrice((sku.price || 0) * (1 - (sku.discount || 0) / 100))
              }}
            </span>
            <span class="old-price" v-if="!isUpcoming">{{
              formatPrice(sku.price || 0)
            }}</span>
          </div>

          <!-- Stock bar: CHỈ HIỆN KHI ĐANG DIỄN RA -->
          <div v-if="isOngoing" class="stock-bar mt-1">
            <div class="progress">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{
                  width:
                    sku.quantity && sku.quantity > 0
                      ? Math.max(
                          0,
                          Math.min(
                            100,
                            ((sku.quantity - (sku.purchased || 0)) / sku.quantity) * 100
                          )
                        ) + '%'
                      : '0%',
                }"
              ></div>
            </div>
            <small class="text-white">
              Còn {{ Math.max(0, sku.quantity - (sku.purchased || 0)) }}/{{
                sku.quantity ?? 0
              }}
            </small>
          </div>

          <button
            class="btn-detail"
            @click.stop="buyNow(sku)"
            :disabled="!isOngoing"
            :class="{ upcoming: isUpcoming, ongoing: isOngoing }"
          >
            <i class="bi bi-bag me-1"></i>
            {{ isUpcoming ? "Chưa mở bán" : "Thêm vào giỏ" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!loading && filteredSkus.length === 0" class="text-center py-4">
      <p>⚠️ Không có sản phẩm nào trong khung giờ này.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "@/composables/axios.js";

import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(true);
const flashSales = ref([]);
const flashSaleSkus = ref([]);

const computedTimeSlots = ref([]);
const currentSlot = ref(null);
const currentSale = ref(null);
const countdown = ref({ hours: "00", minutes: "00", seconds: "00" });
let countdownTimer = null;

const isOngoing = computed(() => {
  if (!currentSale.value) return false;
  const now = Date.now();
  const start = new Date(currentSale.value.started_date).getTime();
  const end = new Date(currentSale.value.ended_date).getTime();
  return now >= start && now <= end;
});
const isUpcoming = computed(() => {
  if (!currentSale.value) return false;
  const now = Date.now();
  const start = new Date(currentSale.value.started_date).getTime();
  return now < start;
});

function pad2(n) {
  return String(n).padStart(2, "0");
}
function formatHour(date) {
  const d = new Date(date);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function toStringDate(d) {
  if (!d) return null;
  if (typeof d === "string" && d.includes(" ") && !d.includes("T")) {
    return d.replace(" ", "T");
  }
  return d;
}

const formatPrice = (price) => {
  return price
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
    : "0₫";
};
const getHiddenPrice = (price) => {
  if (!price) return "???";
  return "???";
};

function getImageUrl(url) {
  if (!url) return "https://placehold.co/300x300?text=No+Image";
  return url.startsWith("http")
    ? url
    : `http://localhost:8080${url.startsWith("/") ? "" : "/"}${url}`;
}
function setDefaultImage(e) {
  e.target.src = "https://placehold.co/300x300?text=Error";
}

async function fetchAll() {
  loading.value = true;
  try {
    const [fsRes, fssRes] = await Promise.all([
      axios.get("/api/flash-sale").catch(() => ({ data: [] })),
      axios.get("/api/flash-sale-sku").catch(() => ({ data: [] })),
    ]);

    console.log("FLASH SALE JSON:", fsRes?.data);
    console.log("FLASH SALE SKU JSON:", fssRes?.data);

    const fsData = fsRes?.data?.data ?? fsRes?.data ?? [];
    const fssData = fssRes?.data?.data ?? fssRes?.data ?? [];

    flashSales.value = fsData
      .filter((f) => f.active !== false)
      .map((f) => ({
        ...f,
        started_date: toStringDate(f.started_date ?? f.startedDate ?? f.started),
        ended_date: toStringDate(f.ended_date ?? f.endedDate ?? f.ended),
      }));

    flashSaleSkus.value = (Array.isArray(fssData) ? fssData : []).map((s) => ({
      flashSaleId: s.flashSaleId,
      flashSaleSkuId: s.id,
      skuId: s.skuId,
      productId: s.productId || s.sku?.product?.id,
      skuName: s.skuName,

      // 🔥CÁCH ƯU TIÊN GIỮ DẠNG OBJECT, KHÔNG map(img => img.path)
      images: s.images ?? s.imageList ?? s.sku?.images ?? [],

      price: s.price,
      discount: s.discount,
      quantity: s.quantity,
      purchased: s.purchased ?? 0,

      // thuộc tính
      skuAttributes: s.skuAttributes ?? s.attributes ?? s.sku?.skuAttributes ?? [],

      _uid: `${s.id || s.skuId}`,
    }));

    buildTimeSlots();

    const running = computedTimeSlots.value.find((s) => s.status === "Đang diễn ra");
    const upcoming = computedTimeSlots.value.filter((s) => s.status === "Sắp diễn ra");
    if (running) selectSlot(running);
    else if (upcoming.length > 0) {
      upcoming.sort((a, b) => a.hour.localeCompare(b.hour));
      selectSlot(upcoming[0]);
    } else if (computedTimeSlots.value.length > 0) {
      selectSlot(computedTimeSlots.value[0]);
    } else {
      currentSlot.value = null;
      currentSale.value = null;
      clearInterval(countdownTimer);
      countdown.value = { hours: "00", minutes: "00", seconds: "00" };
    }
  } catch (err) {
    console.error("fetchAll error:", err);
  } finally {
    loading.value = false;
  }
}

function buildTimeSlots() {
  const now = Date.now();
  const slots = [];
  for (const fs of flashSales.value) {
    if (!fs.started_date) continue;
    const start = new Date(fs.started_date);
    const end = new Date(fs.ended_date);
    const hour = formatHour(start);
    let status = "Đã kết thúc";
    if (now >= start.getTime() && now <= end.getTime()) status = "Đang diễn ra";
    else if (now < start.getTime()) status = "Sắp diễn ra";
    if (status === "Đang diễn ra" || status === "Sắp diễn ra") {
      slots.push({
        hour,
        status,
        statusText: status,
        sale: fs,
        start,
        end,
      });
    }
  }
  const unique = [];
  const seen = new Set();
  for (const s of slots) {
    if (!seen.has(s.hour)) {
      unique.push(s);
      seen.add(s.hour);
    }
  }
  unique.sort((a, b) => {
    const order = { "Đang diễn ra": 0, "Sắp diễn ra": 1 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return a.hour.localeCompare(b.hour);
  });
  computedTimeSlots.value = unique;
}

function selectSlot(slot) {
  currentSlot.value = slot.hour;
  currentSale.value = slot.sale;
  startCountdown();
}

const filteredSkus = computed(() => {
  if (!currentSale.value) return [];
  const fsId = currentSale.value.id ?? currentSale.value.flashSaleId;

  return flashSaleSkus.value
    .filter((s) => Number(s.flashSaleId) === Number(fsId))
    .map((s) => ({
      ...s,
      skuId: s.skuId ?? s.sku?.id,
      skuName: s.skuName ?? s.name ?? s.sku?.name,
      price: s.price ?? s.sku?.price ?? 0,
      images: s.images ?? s.sku?.images ?? [],
      quantity: s.quantity ?? 0,
      purchased: s.purchased ?? 0,
      discount: s.discount ?? currentSale.value.discount ?? 0,
      skuAttributes: s.skuAttributes || s.attributes || s.sku?.skuAttributes || [], // 👈 thêm dòng này
      _uid: s._uid ?? `${s.id || s.skuId || Math.random()}`,
    }));
});

function startCountdown() {
  clearInterval(countdownTimer);
  if (!currentSale.value) return;

  const update = () => {
    const now = Date.now();
    const start = new Date(currentSale.value.started_date).getTime();
    const end = new Date(currentSale.value.ended_date).getTime();
    let target = now < start ? start : end;
    let diff = target - now;
    if (diff <= 0) {
      fetchAll();
      return;
    }
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    countdown.value = { hours: pad2(h), minutes: pad2(m), seconds: pad2(s) };
  };

  update();
  countdownTimer = setInterval(update, 1000);
}

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

const buyNow = async (sku) => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("Thông báo", "Vui lòng đăng nhập để mua hàng!", "info");
    router.push("/auth/login");
    return;
  }
  const payload = decodeJwtToken(token);
  const accountId = payload?.id;
  if (!accountId) return;

  try {
    await axios.post("http://localhost:8080/api/cart-details", {
      accountId,
      skuId: sku.skuId,
      quantity: 1,
    });
    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      showConfirmButton: false,
      timer: 1200,
    });
    router.push("/cart");
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể thêm vào giỏ hàng", "error");
  }
};
const goToDetail = (sku) => {
  console.log("PRODUCT ID", sku.productId);
  router.push({
    name: "ProductDetail",
    params: { id: sku.productId },
    query: {
      flashSku: sku.skuId,
      flashDiscount: sku.discount,
      flashPrice: (sku.price * (1 - sku.discount / 100)).toFixed(0),
    },
  });
};

onMounted(() => fetchAll());
onUnmounted(() => clearInterval(countdownTimer));
</script>

<style scoped>
/* CSS giữ nguyên như cũ */
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
  background: #fff; /* nền sáng cho ảnh nổi */
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 👈 quan trọng */
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

.sku-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-top: 4px;
}

.sku-attr-item {
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 12px;
  color: #f1f1f1;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: 0.2s;
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
.btn-detail:disabled {
  background: #555 !important;
  color: #999 !important;
  cursor: not-allowed !important;
  transform: none !important;
}
.btn-detail.upcoming {
  background: #888;
  color: #fff;
  cursor: not-allowed;
}
.btn-detail.ongoing {
  background: #ffcc00;
}
</style>
