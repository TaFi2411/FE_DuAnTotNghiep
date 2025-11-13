<template>
  <div class="container py-5 mt-5 order-page">
    <!-- BỘ LỌC -->
    <div class="filter-bar mb-4 d-flex justify-content-center flex-wrap gap-2">
      <button
        v-for="filter in filtersWithCount"
        :key="filter.value"
        class="btn btn-filter"
        :class="{ active: currentFilter === filter.value }"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
        <span v-if="filter.count > 0" class="count-badge">
          {{ filter.count }}
        </span>
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- KHÔNG CÓ ĐƠN -->
    <div
      v-else-if="filteredOrders.length === 0"
      class="alert alert-light border text-center"
    >
      Không có đơn hàng nào thuộc trạng thái này.
    </div>

    <!-- DANH SÁCH ĐƠN -->
    <div v-else class="order-list">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="card order-card mb-4"
      >
        <!-- HEADER -->
        <div
          class="card-header order-header d-flex justify-content-between align-items-center"
          @click="toggleOrder(order.id)"
        >
          <div class="d-flex align-items-center">
            <img
              v-if="order.items[0]?.productImage"
              :src="order.items[0].productImage"
              alt="Ảnh sản phẩm"
              class="me-3 rounded border p-1"
              style="width: 60px; height: 60px; object-fit: cover"
            />
            <div>
              <div class="fw-bold">Đơn hàng: {{ order.id }}</div>
              <small class="text-muted">
                Ngày đặt: {{ formatDate(order.created_date) }}
              </small>
            </div>
          </div>
          <div class="text-end">
            <span>{{ getStatusText(order.statusName) }}</span>
          </div>
        </div>

        <!-- CHI TIẾT -->
        <div v-if="expandedOrder === order.id" class="card-body fade-in">
          <div class="mb-3 info-box">
            <p><strong>Địa chỉ giao hàng:</strong> {{ order.addressName }}</p>
            <p>
              <strong>Phương thức thanh toán:</strong>
              {{ order.paymentMethodName }}
            </p>
            <p>
              <strong>Trạng thái thanh toán:</strong>
              <span>
                {{ order.payment_status ? "Đã thanh toán" : "Chưa thanh toán" }}
              </span>
            </p>
          </div>

          <!-- DANH SÁCH SẢN PHẨM -->
          <div class="product-list">
            <div
              v-for="item in order.items"
              :key="item.id || item.productName"
              class="product-item d-flex align-items-start mb-3 p-3 border rounded"
            >
              <img
                v-if="item.productImage"
                :src="item.productImage"
                alt="Ảnh sản phẩm"
                class="me-3 rounded border"
                style="width: 90px; height: 100px; object-fit: cover"
              />

              <div class="flex-grow-1">
                <div class="fw-bold mb-1">{{ item.productName }}</div>

                <!-- Thuộc tính SKU -->
                <div
                  v-if="item.skuAttributes && item.skuAttributes.length"
                  class="text-muted small mb-1"
                >
                  <div v-for="attr in item.skuAttributes" :key="attr.id">
                    <strong>{{ attr.optionAttributeName }}:</strong>
                    {{ attr.valueAttributeName }}
                  </div>
                </div>

                <div class="text-dark mb-1">Số lượng: {{ item.quantity }}</div>
                <div class="text-dark mb-1">
                  Giá: {{ formatCurrency(item.price) }}
                </div>
              </div>

              <div class="ms-3 text-end fw-bold">
                {{ formatCurrency((item.price || 0) * (item.quantity || 1)) }}
              </div>
            </div>
          </div>

          <div class="text-end fw-bold mb-3 fs-5">
            Tổng cộng: {{ formatCurrency(order.total) }}
          </div>

          <div class="text-end mt-3">
            <button
              v-if="order.statusName === 'PENDING'"
              class="btn btn-outline-danger me-2"
              @click="cancelOrder(order.id)"
            >
              Hủy đơn
            </button>

            <button
              v-if="order.statusName === 'SHIPPING'"
              class="btn btn-outline-success"
              @click="completeOrder(order.id)"
            >
              Đã nhận hàng
            </button>

            <button
              v-if="order.statusName === 'COMPLETED'"
              class="btn btn-dark ms-2"
              @click="openReviewModal(order.items[0].id)"
            >
              Đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL ĐÁNH GIÁ -->
    <div v-if="reviewModal" class="modal-backdrop">
      <div
        class="modal-content p-4 rounded-4 shadow-lg bg-white position-relative"
      >
        <button
          class="btn-close position-absolute top-0 end-0 m-3"
          @click="closeReviewModal"
        ></button>

        <h4 class="fw-bold mb-3 text-center">Đánh giá sản phẩm</h4>

        <!-- Chọn sao -->
        <div class="mb-3 text-center">
          <span
            v-for="n in 5"
            :key="n"
            @click="reviewForm.star = n"
            class="fs-3 mx-1"
            :class="n <= reviewForm.star ? 'text-warning' : 'text-secondary'"
            style="cursor: pointer"
            >★</span
          >
          <div class="small text-muted mt-1">Chọn số sao (1-5)</div>
        </div>

        <!-- Nhập mô tả -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Cảm nhận của bạn:</label>
          <textarea
            v-model="reviewForm.description"
            rows="3"
            class="form-control"
            placeholder="Viết cảm nhận của bạn..."
          ></textarea>
        </div>

        <!-- Upload ảnh -->
        <div class="mb-3">
          <label class="form-label fw-semibold"
            >Ảnh minh họa (tối đa 3 ảnh)</label
          >
          <div class="d-flex flex-wrap gap-2 mt-2">
            <div
              v-for="(img, i) in reviewForm.images"
              :key="i"
              class="image-upload border rounded-3 position-relative bg-light border-dark-subtle"
              style="
                width: 80px;
                height: 80px;
                cursor: pointer;
                overflow: hidden;
              "
            >
              <img
                :src="img.path"
                alt="Ảnh review"
                class="position-absolute top-0 start-0 w-100 h-100"
                style="object-fit: cover; object-position: center"
              />
              <button
                type="button"
                class="btn btn-sm btn-danger position-absolute"
                style="top: 2px; right: 2px; padding: 0 4px"
                @click="removeImage(i)"
              >
                ×
              </button>
            </div>

            <div
              v-if="reviewForm.images.length < 3"
              class="image-upload border rounded-3 d-flex flex-column align-items-center justify-content-center bg-light border-dark-subtle text-muted"
              style="width: 80px; height: 80px; cursor: pointer"
              @click="openFilePicker"
            >
              <i class="bi bi-plus-circle fs-5"></i>
            </div>
          </div>
          <div v-if="isUploading" class="mt-2 small text-primary">
            Đang tải ảnh lên...
          </div>
          <input
            type="file"
            class="d-none"
            ref="fileInput"
            accept="image/*"
            multiple
            @change="handleAutoUpload"
          />
        </div>

        <div class="text-center mt-4">
          <button class="btn btn-success px-4" @click="submitReview">
            Gửi đánh giá
          </button>
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

// Modal đánh giá
const reviewModal = ref(false);
const reviewForm = ref({
  star: 0,
  description: "",
  orderDetailId: null,
  images: [],
});
const isUploading = ref(false);
const fileInput = ref(null);

const filters = [
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const filtersWithCount = computed(() =>
  filters.map((f) => ({
    ...f,
    count:
      f.value === "ALL"
        ? orders.value.length
        : orders.value.filter((o) => o.statusName === f.value).length,
  }))
);

const filteredOrders = computed(() =>
  currentFilter.value === "ALL"
    ? orders.value
    : orders.value.filter((o) => o.statusName === currentFilter.value)
);

function toggleOrder(id) {
  expandedOrder.value = expandedOrder.value === id ? null : id;
}

function getStatusText(status) {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "PROCESSING":
      return "Đang xử lý";
    case "SHIPPING":
      return "Đang giao hàng";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
}

function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "";
}

function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    return null;
  }
}

async function loadOrders() {
  loading.value = true;
  const token = localStorage.getItem("token");
  if (!token) {
    loading.value = false;
    return;
  }
  const payload = decodeJwtToken(token);
  const accountId = payload?.id;
  if (!accountId) {
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(`/api/order/account/${accountId}`);
    orders.value = (response.data || [])
      .map((o) => ({ ...o, items: o.items || [] }))
      .sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error("Lỗi khi tải đơn hàng:", err);
  } finally {
    loading.value = false;
  }
}

async function cancelOrder(orderId) {
  if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
  try {
    await axios.put(`/api/order/${orderId}/cancel`, { status: "CANCELLED" });
    const order = orders.value.find((o) => o.id === orderId);
    if (order) order.statusName = "CANCELLED";
    alert("Đơn hàng đã được hủy thành công! Chúng tôi đã gửi email xác nhận đến bạn.");
  } catch (err) {
    console.error(err);
    alert("Không thể hủy đơn hàng!");
  }
}

async function completeOrder(orderId) {
  if (!confirm("Xác nhận bạn đã nhận được hàng?")) return;
  try {
    await axios.put(`/api/order/${orderId}/complete`);
    const order = orders.value.find((o) => o.id === orderId);
    if (order) order.statusName = "COMPLETED";
    alert("Cảm ơn bạn! Đơn hàng đã hoàn tất.");
  } catch (err) {
    console.error(err);
    alert("Không thể cập nhật trạng thái!");
  }
}

// Review modal
function openReviewModal(orderDetailId) {
  reviewForm.value = { star: 0, description: "", orderDetailId, images: [] };
  reviewModal.value = true;
}
function closeReviewModal() {
  reviewModal.value = false;
}

function openFilePicker() {
  fileInput.value?.click();
}

async function handleAutoUpload(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  isUploading.value = true;
  try {
    for (const file of files.slice(0, 3 - reviewForm.value.images.length)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      reviewForm.value.images.push({ path: res.data });
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể tải ảnh lên", "error");
  } finally {
    isUploading.value = false;
    event.target.value = "";
  }
}

function removeImage(index) {
  reviewForm.value.images.splice(index, 1);
}

async function submitReview() {
  if (reviewForm.value.star === 0) {
    return Swal.fire("Thiếu thông tin", "Vui lòng chọn số sao!", "warning");
  }
  try {
    await axios.post("/api/review", reviewForm.value);
    Swal.fire("🎉 Thành công", "Cảm ơn bạn đã đánh giá!", "success");
    closeReviewModal();
  } catch (err) {
    console.error(err);
    Swal.fire(
      "Lỗi 😥",
      err.response?.data?.message || "Không thể gửi đánh giá",
      "error"
    );
  }
}

onMounted(loadOrders);
</script>

<style scoped>
/* giữ nguyên CSS cũ */
.order-page {
  min-height: 100vh;
  padding-bottom: 60px;
  animation: fadeInBg 0.8s ease-in-out;
}
@keyframes fadeInBg {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-bar {
  position: sticky;
  top: 70px;
  z-index: 5;
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.btn-filter {
  padding: 8px 16px;
  font-weight: 600;
  color: #555;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: transparent;

}

.btn-filter:hover {
  background: #f5f5f5;

}

.btn-filter.active {
  color: #ffffff;
  background-color: #000;
  font-weight: 700;
  border-color: #000;

}

.count-badge {
  background-color: #525252;
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 6px;
}

.order-card {
  border: 1px solid #cacacaaa;
  margin-bottom: 10px;
  background: white;
}
.order-header {
  padding: 12px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.order-header:hover {
  background: #f5f5f5;
}
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.info-box {
  padding: 8px 12px;
  margin-bottom: 12px;
  color: #222;
  background: transparent;
}
.product-item img {
  width: 90px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ccc;
}
.text-end.fw-bold {
  color: #111;
  font-weight: 700 !important;
}
.btn {
  border-radius: 8px;
  border: 1px solid #111;
  color: #111;
  padding: 6px 12px;
  background: transparent;
  transition: all 0.2s ease;
}
.btn-outline-danger:hover,
.btn-outline-success:hover {
  background-color: #111;
  color: #fff;
}

/* Modal review */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-content {
  width: 100%;
  max-width: 500px;
}
</style>
