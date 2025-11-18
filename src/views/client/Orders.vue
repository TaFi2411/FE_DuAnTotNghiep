<template>
  <div class="orders-page container-fluid py-5">
    <div class="row gx-4">
      <!-- SIDEBAR -->
      <aside class="col-lg-3 mb-4">
        <div class="profile-card p-4 rounded shadow-sm bg-white">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
              <span class="fs-4">{{ userInitials }}</span>
            </div>
            <div>
              <div class="fw-bold">{{ userName }}</div>
              <div class="text-muted small">{{ userEmail }}</div>
            </div>
          </div>

          <nav class="mt-4">
            <ul class="list-unstyled mb-0">
              <li v-for="(m, idx) in menu" :key="idx" :class="{ active: m.active }" class="mb-2">
                <a href="#" class="d-flex align-items-center gap-2 p-2 rounded-3 text-decoration-none"
                   @click.prevent="selectMenu(m)">
                  <i :class="m.icon"></i>
                  <span>{{ m.label }}</span>
                </a>
              </li>
            </ul>
          </nav>

          <button class="btn btn-logout mt-3 w-100" @click="logout">Đăng xuất</button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="col-lg-9">
        <div class="main-card p-4 rounded shadow-sm bg-white">
          
          <!-- THÔNG TIN CÁ NHÂN -->
          <div v-if="currentMenu === 'Thông tin cá nhân'">
            <h5>Thông tin cá nhân</h5>
            <p><strong>Họ và tên:</strong> {{ userName }}</p>
            <p><strong>Email:</strong> {{ userEmail }}</p>
            <p><strong>Số điện thoại:</strong> {{ userPhone }}</p>
          </div>

          <!-- ĐƠN HÀNG -->
          <div v-else-if="currentMenu === 'Đơn hàng của tôi'">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Đơn hàng của tôi</h5>
              <small class="text-muted">Tổng: {{ orders.length }} đơn</small>
            </div>

            <!-- FILTER TABS -->
            <div class="filter-tabs mb-3">
              <button
                v-for="filter in filtersWithCount"
                :key="filter.value"
                :class="['tab-btn', { active: currentFilter === filter.value }]"
                @click="currentFilter = filter.value"
              >
                <span>{{ filter.label }}</span>
                <span v-if="filter.count > 0" class="badge-count">{{ filter.count }}</span>
              </button>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="py-5 text-center">
              <div class="spinner-border" role="status"></div>
            </div>

            <!-- NO ORDERS -->
            <div v-else-if="filteredOrders.length === 0" class="alert alert-light border text-center">
              Không có đơn hàng nào thuộc trạng thái này.
            </div>

            <!-- ORDER LIST -->
            <div v-else class="order-list">
              <div v-for="order in filteredOrders" :key="order.id" class="order-card mb-4 rounded">
                <div class="order-top d-flex align-items-center justify-content-between p-3" @click="toggleOrder(order.id)">
                  <div class="d-flex align-items-center gap-3">
                    <img v-if="order.items[0]?.productImage" :src="order.items[0].productImage" alt="thumb" class="thumb" />
                    <div>
                      <div class="order-title">Đơn hàng {{ order.id }}</div>
                      <div class="small text-muted">Ngày đặt: {{ formatDate(order.created_date) }}</div>
                    </div>
                  </div>

                  <div class="d-flex align-items-center gap-3">
                    <div class="status-pill">
                      <i class="bi bi-truck me-1"></i>
                      {{ getStatusText(order.statusName) }}
                    </div>
                    <i :class="expandedOrder === order.id ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                  </div>
                </div>

                <!-- body (expand) -->
                <transition name="slide-fade">
                  <div v-if="expandedOrder === order.id" class="order-body p-3 border-top">
                    <div class="row">
                      <div class="col-md-8">
                        <div v-for="item in order.items" :key="item.id || item.productName" class="d-flex mb-3">
                          <img v-if="item.productImage" :src="item.productImage" class="product-img me-3" />
                          <div class="flex-grow-1">
                            <div class="fw-bold">{{ item.productName }}</div>
                            <div v-if="item.skuAttributes && item.skuAttributes.length" class="small text-muted">
                              <div v-for="attr in item.skuAttributes" :key="attr.id">
                                <strong>{{ attr.optionAttributeName }}:</strong> {{ attr.valueAttributeName }}
                              </div>
                            </div>
                            <div class="small text-dark">Số lượng: {{ item.quantity }}</div>
                            <div class="small text-dark">Giá: {{ formatCurrency(item.price) }}</div>
                            <div class="small text-dark">Phí vận chuyển: {{ formatCurrency(order.feeship) }}</div>
                          </div>
                          <div class="fw-bold text-end">{{ formatCurrency((item.price || 0) * (item.quantity || 1)) }}</div>
                        </div>

                        <div class="mt-2">
                          <div class="small text-muted">Địa chỉ giao hàng:</div>
                          <div class="fw-semibold">{{ order.shipping_address }}</div>
                          <div class="small text-muted mt-2">SĐT:</div>
                          <div>{{ order.shippingPhone }}</div>
                          <div class="small text-muted mt-2">Phương thức:</div>
                          <div>{{ order.paymentMethodName }}</div>
                          <div class="small text-muted mt-2">Trạng thái thanh toán:</div>
                          <div>{{ order.payment_status ? 'Đã thanh toán' : 'Chưa thanh toán' }}</div>
                        </div>
                      </div>

                      <div class="col-md-4 d-flex flex-column justify-content-between">
                        <div class="text-end">
                          <div class="total-label small text-muted">Tổng cộng</div>
                          <div class="total-amount fw-bold">{{ formatCurrency(order.total) }}</div>
                        </div>

                        <div class="text-end mt-3">
                          <button v-if="order.statusName === 'PENDING'" class="btn btn-cancel me-2" @click.stop="cancelOrder(order.id)">
                            × Hủy đơn
                          </button>

                       <button 
  v-if="order.statusName === 'DELIVERED'" 
  class="btn btn-success me-2" 
  @click.stop="completeOrder(order.id)"
>
  Đã nhận hàng
</button>


                          <button v-if="order.statusName === 'COMPLETED'" class="btn btn-dark" @click.stop="openReviewModal(order.items[0].id)">
                            Đánh giá
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- REVIEW MODAL -->
    <div v-if="reviewModal" class="review-modal-backdrop">
      <div class="review-modal rounded-4 p-4 bg-white shadow-lg">
        <button class="btn-close float-end" @click="closeReviewModal"></button>
        <h5 class="text-center mb-3">Đánh giá sản phẩm</h5>

        <div class="text-center mb-3">
          <span v-for="n in 5" :key="n" @click="reviewForm.star = n" class="star" :class="{ active: n <= reviewForm.star }">★</span>
          <div class="small text-muted mt-1">Chọn số sao (1-5)</div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Cảm nhận của bạn:</label>
          <textarea v-model="reviewForm.description" rows="3" class="form-control" placeholder="Viết cảm nhận của bạn..."></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Ảnh minh họa (tối đa 3 ảnh)</label>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <div v-for="(img, i) in reviewForm.images" :key="i" class="img-box position-relative">
              <img :src="img.path" class="w-100 h-100" style="object-fit:cover" />
              <button type="button" class="btn-remove" @click="removeImage(i)">×</button>
            </div>

            <div v-if="reviewForm.images.length < 3" class="img-add d-flex align-items-center justify-content-center" @click="openFilePicker">
              <i class="bi bi-plus-circle fs-4"></i>
            </div>
          </div>

          <div v-if="isUploading" class="small text-primary mt-2">Đang tải ảnh lên...</div>
          <input type="file" class="d-none" ref="fileInput" accept="image/*" multiple @change="handleAutoUpload" />
        </div>

        <div class="text-center mt-3">
          <button class="btn btn-primary px-4" @click="submitReview">Gửi đánh giá</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";

const orders = ref([]);
const loading = ref(true);
const expandedOrder = ref(null);
const currentFilter = ref("ALL");
const reviewModal = ref(false);
const reviewForm = ref({ star: 0, description: "", orderDetailId: null, images: [] });
const isUploading = ref(false);
const fileInput = ref(null);
const currentMenu = ref("Đơn hàng của tôi");

const userName = ref("");
const userEmail = ref("");
const userPhone = ref("");
const userInitials = computed(() =>
  userName.value
    ? userName.value.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase()
    : ""
);

const menu = [
  { label: "Thông tin cá nhân", icon: "bi bi-person", active: false },
  { label: "Đơn hàng của tôi", icon: "bi bi-bag-fill", active: true },
  { label: "Đổi mật khẩu", icon: "bi bi-key", active: false },
];

const filters = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" }, // mới
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const filtersWithCount = computed(() =>
  filters.map(f => ({
    ...f,
    count: f.value === "ALL" ? orders.value.length : orders.value.filter(o => o.statusName === f.value).length,
  }))
);

  const filteredOrders = computed(() => {
    if (currentFilter.value === "ALL") return orders.value;
    return orders.value.filter(o => o.statusName === currentFilter.value);
  });
const filteredOrders = computed(() =>
  currentFilter.value === "ALL" ? orders.value : orders.value.filter(o => o.statusName === currentFilter.value)
);

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
}
function formatDate(dateStr) { return dateStr ? new Date(dateStr).toLocaleString("vi-VN") : ""; }
function getStatusText(status) {
  switch (status) {
    case "PENDING": return "Chờ xác nhận";
    case "PROCESSING": return "Đang xử lý";
    case "SHIPPING": return "Đang giao hàng";
    case "DELIVERED": return "Đã giao"; // mới
    case "COMPLETED": return "Hoàn thành";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
}

function toggleOrder(id) { expandedOrder.value = expandedOrder.value === id ? null : id; }
function selectMenu(item) { currentMenu.value = item.label; menu.forEach(m => m.active = m.label === item.label); }

function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
  } catch { return null; }
}

async function loadUserProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const payload = decodeJwtToken(token);
    const accountId = payload?.id;
    if (!accountId) return;

    const res = await axios.get(`/api/account/${accountId}`);
    const data = res.data;
    userName.value = data.fullname || "";
    userEmail.value = data.email || "";
    userPhone.value = data.phone || "";
  } catch (err) { console.error("Không thể tải thông tin người dùng:", err); }
}

async function loadOrders() {
  loading.value = true;
  const token = localStorage.getItem("token");
  if (!token) { loading.value = false; return; }
  const payload = decodeJwtToken(token);
  const accountId = payload?.id;
  if (!accountId) { loading.value = false; return; }

  try {
    const res = await axios.get(`/api/order/account/${accountId}`);
    orders.value = (res.data || []).map(o => ({ ...o, items: o.items || [] })).sort((a, b) => b.id - a.id);
  } catch (err) { console.error("Lỗi khi tải đơn hàng:", err); } 
  finally { loading.value = false; }
}

async function cancelOrder(orderId) {
  if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
  try {
    await axios.put(`/api/order/${orderId}/cancel`, { status: "CANCELLED" });
    const order = orders.value.find(o => o.id === orderId);
    if (order) order.statusName = "CANCELLED";
    alert("Đơn hàng đã được hủy thành công!");
  } catch (err) { console.error(err); alert("Không thể hủy đơn hàng!"); }
}

async function completeOrder(orderId) {
  if (!confirm("Xác nhận bạn đã nhận được hàng?")) return;
  try {
    await axios.put(`/api/order/${orderId}/complete`);
    const order = orders.value.find(o => o.id === orderId);
    if (order) order.statusName = "COMPLETED";
    alert("Đơn hàng đã hoàn tất.");
  } catch (err) { console.error(err); alert("Không thể cập nhật trạng thái!"); }
}

function openReviewModal(orderDetailId) {
  reviewForm.value = { star: 0, description: "", orderDetailId, images: [] };
  reviewModal.value = true;
}
function closeReviewModal() { reviewModal.value = false; }
function openFilePicker() { fileInput.value?.click(); }

async function handleAutoUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  isUploading.value = true;
  try {
    for (const file of files.slice(0, 3 - reviewForm.value.images.length)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      reviewForm.value.images.push({ path: res.data });
    }
  } catch (err) { console.error(err); Swal.fire("Lỗi", "Không thể tải ảnh lên", "error"); } 
  finally { isUploading.value = false; event.target.value = ""; }
}

function removeImage(index) { reviewForm.value.images.splice(index, 1); }

async function submitReview() {
  if (reviewForm.value.star === 0) return Swal.fire("Thiếu thông tin", "Vui lòng chọn số sao!", "warning");
  try {
    await axios.post("/api/review", reviewForm.value);
    Swal.fire("🎉 Thành công", "Cảm ơn bạn đã đánh giá!", "success");
    closeReviewModal();
  } catch (err) { console.error(err); Swal.fire("Lỗi 😥", err.response?.data?.message || "Không thể gửi đánh giá", "error"); }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/login"; // hoặc trang login của bạn
}

onMounted(() => {
  loadUserProfile();
  loadOrders();
});
</script>

<style scoped>
/* ---------------- layout ---------------- */
.orders-page { min-height: 80vh; padding-top: 30px; padding-bottom: 60px; background: #f6f7f9; }
.profile-card { position: sticky; top: 90px; }
.avatar { width:56px; height:56px; font-weight:700; border-radius:50%; }
.profile-card .btn-logout { background: transparent; border:1px solid #f3f3f3; color:#d9534f; font-weight:600; cursor:pointer; }

/* filter tabs */
.filter-tabs { display:flex; gap:12px; flex-wrap:wrap; border-bottom:1px solid #eee; padding-bottom:12px; margin-bottom:18px; }
.tab-btn { border:none; background:transparent; padding:10px 16px; border-radius:6px; font-weight:600; color:#555; display:flex; align-items:center; gap:8px; position:relative; cursor:pointer; }
.tab-btn:hover { background:#fafafa; }
.tab-btn.active { background:#fff; color:#000; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #eee; }
.badge-count { background:#525252; color:#fff; font-size:0.7rem; padding:2px 7px; border-radius:12px; margin-left:6px; }

/* order card */
.order-card { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(18,24,31,0.04); border:1px solid rgba(0,0,0,0.04); }
.order-top { cursor:pointer; padding:16px; display:flex; justify-content:space-between; align-items:center; }
.order-title { font-weight:700; color:#111; display:flex; align-items:center; gap:12px; }
.thumb { width:68px; height:68px; object-fit:cover; border-radius:8px; border:1px solid #eee; padding:4px; background:#fff; }
.status-pill { background: linear-gradient(90deg,#f3e9ff,#f7efff); color:#7b3dd6; padding:6px 12px; border-radius:20px; font-weight:600; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 6px rgba(123,61,214,0.08); font-size:14px; }
.status-pill i { font-size:16px; }
.order-body { background:#fff; padding:16px 18px; border-top:1px solid #f2f2f2; }
.product-img { width:86px; height:86px; object-fit:cover; border:1px solid #eee; border-radius:8px; }
.total-label { color:#666; font-size:14px; }
.total-amount { color:#e43f3f; font-size:1.15rem; font-weight:700; }
.btn-cancel { background: transparent; border:1px solid #e43f3f; color:#e43f3f; padding:8px 12px; border-radius:10px; font-weight:700; cursor:pointer; }
.btn-cancel:hover { background:#e43f3f; color:#fff; }
.btn-success { border-radius:10px; padding:8px 12px; font-weight:700; }
.btn-dark { border-radius:10px; padding:8px 12px; font-weight:700; }
.review-modal-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:2000; }
.review-modal { width:100%; max-width:520px; position:relative; }
.star { font-size:28px; margin:0 6px; cursor:pointer; color:#cfcfcf; }
.star.active { color:#ffb400; }
.img-box { width:80px; height:80px; border-radius:8px; overflow:hidden; position:relative; }
.btn-remove { position:absolute; top:6px; right:6px; background:rgba(0,0,0,0.6); color:#fff; border:none; width:22px; height:22px; border-radius:6px; cursor:pointer; }
.img-add { width:80px; height:80px; border-radius:8px; border:1px dashed #ddd; color:#999; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.slide-fade-enter-active, .slide-fade-leave-active { transition: all .18s ease; }
.slide-fade-enter-from { transform: translateY(-6px); opacity:0; }
.slide-fade-enter-to { transform: translateY(0); opacity:1; }
.slide-fade-leave-from { transform: translateY(0); opacity:1; }
.slide-fade-leave-to { transform: translateY(-6px); opacity:0; }
@media (max-width: 991px) { .profile-card { position: static; } .tab-btn { padding:8px 10px; font-size:14px; } }
</style>
