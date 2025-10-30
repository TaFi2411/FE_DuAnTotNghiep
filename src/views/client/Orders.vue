<template>
  <div class="container py-5 mt-5">
    <h2 class="fw-bold mb-4">🧾 Đơn hàng của tôi</h2>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- KHÔNG CÓ ĐƠN -->
    <div v-else-if="orders.length === 0" class="alert alert-info">
      Bạn chưa có đơn hàng nào.
    </div>

    <!-- DANH SÁCH ĐƠN -->
    <div v-else>
      <div
        v-for="order in orders"
        :key="order.id"
        class="card mb-4 shadow-sm order-card"
      >
        <!-- HEADER -->
        <div
          class="card-header d-flex justify-content-between align-items-center"
          @click="toggleOrder(order.id)"
          style="cursor: pointer"
        >
          <div>
            <strong>Mã đơn:</strong> {{ order.id }} <br />
            <small>Ngày đặt: {{ formatDate(order.created_date) }}</small>
          </div>
          <div class="text-end">
            <span
              :class="['badge', getStatusClass(order.statusName), 'me-2']"
            >
              {{ order.statusName }}
            </span>
            <span class="fw-bold text-primary">
              {{ formatCurrency(order.total) }}
            </span>
          </div>
        </div>

        <!-- CHI TIẾT ĐƠN -->
        <div v-if="expandedOrder === order.id" class="card-body fade-in">
          <div class="mb-3">
            <p><strong>Địa chỉ giao hàng:</strong> {{ order.addressName }}</p>
            <p>
              <strong>Phương thức thanh toán:</strong>
              {{ order.paymentMethodName }}
            </p>
            <p>
              <strong>Trạng thái thanh toán:</strong>
              <span
                :class="['badge', order.payment_status ? 'bg-success' : 'bg-secondary']"
              >
                {{ order.payment_status ? "Đã thanh toán" : "Chưa thanh toán" }}
              </span>
            </p>
          </div>

          <!-- DANH SÁCH SẢN PHẨM -->
          <table class="table table-sm align-middle">
            <thead>
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
                      class="me-3 rounded"
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

          <div class="text-end fw-bold">
            Tổng cộng: {{ formatCurrency(order.total) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const orders = ref([]);
const loading = ref(true);
const expandedOrder = ref(null);

function toggleOrder(id) {
  expandedOrder.value = expandedOrder.value === id ? null : id;
}

function getStatusClass(status) {
  switch (status) {
    case "PENDING":
      return "bg-warning text-dark";
    case "SHIPPED":
      return "bg-info text-dark";
    case "COMPLETED":
      return "bg-success";
    case "CANCELLED":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN");
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

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    loading.value = false;
    return;
  }

  const payload = decodeJwtToken(token);
  const accountId = payload?.accountId;

  if (accountId) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/orders/account/${accountId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      orders.value = (response.data || []).map((o) => ({
        ...o,
        items: o.items || [],
      }));
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
.badge {
  font-size: 0.9rem;
  padding: 6px 10px;
}

.order-card {
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: scale(1.01);
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
</style>
