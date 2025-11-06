  <template>
    <div class="container py-5 mt-5 order-page">
      <h2 class="fw-bold mb-4 text-center text-primary">🧾 Đơn hàng của tôi</h2>

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
          <span v-if="filter.count > 0" class="count-badge">{{ filter.count }}</span>
        </button>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <!-- KHÔNG CÓ ĐƠN -->
      <div v-else-if="filteredOrders.length === 0" class="alert alert-light border text-center">
        😕 Không có đơn hàng nào thuộc trạng thái này.
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
            <div>
              <div class="fw-bold">Mã đơn: #{{ order.id }}</div>
              <small class="text-muted">Ngày đặt: {{ formatDate(order.created_date) }}</small>
            </div>
            <div class="text-end">
              <span :class="['badge', getStatusClass(order.statusName), 'me-2']">
                {{ getStatusText(order.statusName) }}
              </span>
              <span class="fw-bold text-primary">{{ formatCurrency(order.total) }}</span>
            </div>
          </div>

          <!-- CHI TIẾT -->
          <div v-if="expandedOrder === order.id" class="card-body fade-in">
            <div class="mb-3 info-box">
              <p><strong>📍 Địa chỉ giao hàng:</strong> {{ order.addressName }}</p>
              <p><strong>💳 Phương thức thanh toán:</strong> {{ order.paymentMethodName }}</p>
              <p>
                <strong>💰 Trạng thái thanh toán:</strong>
                <span :class="['badge', order.payment_status ? 'bg-success' : 'bg-secondary']">
                  {{ order.payment_status ? "Đã thanh toán" : "Chưa thanh toán" }}
                </span>
              </p>
            </div>

            <!-- DANH SÁCH SẢN PHẨM -->
            <div class="table-responsive">
              <table class="table align-middle">
                <thead class="table-light">
                  <tr>
                    <th style="width: 60%">Sản phẩm</th>
                    <th class="text-end">Số lượng</th>
                    <th class="text-end">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.id || item.productName">
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          v-if="item.productImage"
                          :src="item.productImage"
                          alt="Ảnh sản phẩm"
                          class="me-3 rounded border"
                          style="width: 60px; height: 60px; object-fit: cover"
                        />
                        <div>{{ item.productName }}</div>
                      </div>
                    </td>
                    <td class="text-end">{{ item.quantity }}</td>
                    <td class="text-end">{{ formatCurrency(item.price) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="text-end fw-bold mb-3 fs-5">
              Tổng cộng: {{ formatCurrency(order.total) }}
            </div>

            <!-- NÚT HÀNH ĐỘNG -->
            <div class="text-end mt-3">
              <button
                v-if="order.statusName === 'PENDING'"
                class="btn btn-outline-danger me-2"
                @click="cancelOrder(order.id)"
              >
                ❌ Hủy đơn
              </button>

              <button
                v-if="order.statusName === 'SHIPPING'"
                class="btn btn-outline-success"
                @click="completeOrder(order.id)"
              >
                ✅ Đã nhận hàng
              </button>

              <span
                v-if="['COMPLETED', 'CANCELLED', 'PROCESSING'].includes(order.statusName)"
                class="text-muted fst-italic"
              >
                Không thể thao tác
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";

  const orders = ref([]);
  const loading = ref(true);
  const expandedOrder = ref(null);
  const currentFilter = ref("ALL");

  const filters = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ xác nhận", value: "PENDING" },
    { label: "Đang xử lý", value: "PROCESSING" },
    { label: "Đang giao", value: "SHIPPING" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELLED" },
  ];

  // ✅ Tính số lượng từng trạng thái
  const filtersWithCount = computed(() =>
    filters.map(f => ({
      ...f,
      count:
        f.value === "ALL"
          ? orders.value.length
          : orders.value.filter(o => o.statusName === f.value).length,
    }))
  );

  const filteredOrders = computed(() => {
    if (currentFilter.value === "ALL") return orders.value;
    return orders.value.filter(o => o.statusName === currentFilter.value);
  });

  function toggleOrder(id) {
    expandedOrder.value = expandedOrder.value === id ? null : id;
  }

  function getStatusClass(status) {
    switch (status) {
      case "PENDING": return "bg-warning text-dark";
      case "PROCESSING": return "bg-info text-dark";
      case "SHIPPING": return "bg-primary text-white";
      case "COMPLETED": return "bg-success";
      case "CANCELLED": return "bg-danger";
      default: return "bg-secondary";
    }
  }

  function getStatusText(status) {
    switch (status) {
      case "PENDING": return "Chờ xác nhận";
      case "PROCESSING": return "Đang xử lý";
      case "SHIPPING": return "Đang giao hàng";
      case "COMPLETED": return "Hoàn thành";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
  }

  function formatDate(dateStr) {
    return dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "";
  }

  function decodeJwtToken(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
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
      const response = await axios.get(
        `http://localhost:8080/api/order/account/${accountId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      orders.value = (response.data || []).map(o => ({ ...o, items: o.items || [] }));
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      loading.value = false;
    }
  }

  // ❌ Hủy đơn
  async function cancelOrder(orderId) {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:8080/api/order/${orderId}/status`,
        { status: "CANCELLED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = orders.value.find(o => o.id === orderId);
      if (order) order.statusName = "CANCELLED";
      alert("Đơn hàng đã được hủy thành công!");
    } catch (err) {
      console.error("Lỗi khi hủy đơn:", err);
      alert("Không thể hủy đơn hàng!");
    }
  }

  // ✅ Hoàn thành đơn
  async function completeOrder(orderId) {
    if (!confirm("Xác nhận bạn đã nhận được hàng?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:8080/api/order/${orderId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = orders.value.find(o => o.id === orderId);
      if (order) order.statusName = "COMPLETED";
      alert("Cảm ơn bạn! Đơn hàng đã hoàn tất.");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái!");
    }
  }

  onMounted(loadOrders);
  </script>

  <style scoped>
  .order-page {
    background: linear-gradient(180deg, #dedede 0%, #ffffff 100%);
    border-radius: 16px;
    min-height: 100vh;
    padding-bottom: 60px;
    animation: fadeInBg 0.8s ease-in-out;
  }
  @keyframes fadeInBg {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* 🎯 Bộ lọc */
  .filter-bar {
    position: sticky;
    top: 70px;
    z-index: 5;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 50px;
    padding: 12px 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    transition: all 0.4s ease;
  }

  .btn-filter {
  
  
    padding: 10px 22px;
  
    font-weight: 600;
    color: #020202;
    font-size: 15px;
    letter-spacing: 0.3px;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  
  }
  .btn-filter:hover {
    background: linear-gradient(145deg, #fefefe, #ffffff);
    color: #000000;
    transform: translateY(-1px);
  }
  .btn-filter.active {
    
    color: #000000;
    box-shadow: 0 6px 15px rgba(0, 102, 255, 0.25);
    transform: translateY(-2px);
  }
  .count-badge {
    background-color: #ff0202;
    color: #ffffff;
    border-radius: 20px;
    font-size: 0.8rem;
    padding: 2px 8px;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  .btn-filter.active .count-badge {
    background-color: rgb(255, 255, 255);
    color: #ff0000;
  }

  /* 🧾 Thẻ đơn hàng */
  .order-card {
    border: none;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.35s ease;
  }
  .order-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(0, 123, 255, 0.1);
  }

  /* HEADER */
  .order-header {
    background: linear-gradient(90deg, #f9fbff 0%, #f1f4ff 100%);
    padding: 16px 20px;
    cursor: pointer;
    border-bottom: 1px solid #eef1f7;
    transition: all 0.3s ease;
  }
  .order-header:hover {
    background: linear-gradient(90deg, #f0f6ff 0%, #e8f0ff 100%);
  }
  .order-header small {
    font-size: 0.85rem;
    color: #777;
  }

  /* CHI TIẾT */
  .fade-in {
    animation: fadeIn 0.35s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* THÔNG TIN */
  .info-box {
    background: linear-gradient(145deg, #f9fbfd, #ffffff);
    border: 1px solid #eef2f6;
    border-radius: 14px;
    padding: 12px 18px;
    margin-bottom: 15px;
    color: #444;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.03);
  }

  /* BẢNG SẢN PHẨM */
  .table {
    margin-top: 10px;
    font-size: 0.95rem;
  }
  .table thead {
    background-color: #f6f8fb;
    color: #333;
  }
  .table img {
    border-radius: 12px;
    border: 1px solid #e8e8e8;
  }

  /* TỔNG CỘNG */
  .text-end.fw-bold {
    color: #111;
    font-weight: 700 !important;
  }

  /* BADGES */
  .badge {
    font-size: 0.85rem;
    padding: 6px 12px;
    border-radius: 20px;
    letter-spacing: 0.3px;
    font-weight: 500;
  }

  /* NÚT */
  .btn {
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  .btn-outline-danger:hover {
    background-color: #dc3545;
    color: white;
    transform: translateY(-1px);
  }
  .btn-outline-success:hover {
    background-color: #198754;
    color: white;
    transform: translateY(-1px);
  }

  /* HIỆU ỨNG NHẸ */
  .order-list {
    animation: slideUp 0.5s ease-in-out;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>
