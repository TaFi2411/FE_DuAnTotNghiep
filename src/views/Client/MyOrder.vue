<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center text-md-start">Đơn hàng của tôi</h2>

    <div v-if="loading" class="text-center">Đang tải đơn hàng...</div>
    <div v-else-if="orders.length === 0" class="text-center">Bạn chưa có đơn hàng nào.</div>

    <div v-else class="order-list">
      <div v-for="order in orders" :key="order.id" class="card mb-4">
        <div class="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div>
            <strong>Mã đơn hàng:</strong> {{ order.code || 'DH-' + order.id }} <br />
            <small>Ngày đặt: {{ formatDate(order.createDate) }}</small>
          </div>
          <div class="text-md-end mt-2 mt-md-0">
            <span :class="['badge', getStatusBadgeClass(order.status)]">
              {{ getStatusText(order.status) }}
            </span><br />
            <strong>Tổng tiền:</strong> {{ formatCurrency(order.total) }}
          </div>
        </div>

        <div class="card-body">
  <ul class="list-group">
    <li
      v-for="item in order.items"
      :key="item.id"
      class="list-group-item py-3"
    >
      <div class="row align-items-center">
        <!-- Cột 1: Ảnh -->
        <div class="col-12 col-md-2 text-center mb-2 mb-md-0">
          <img
            :src="item.skuImage"
            alt="Ảnh sản phẩm"
            class="img-thumbnail"
          />
        </div>

        <!-- Cột 2: Tên sản phẩm -->
        <div class="col-12 col-md-3">
          <strong>{{ item.skuName }}</strong>
        </div>

        <!-- Cột 3: Thuộc tính -->
        <div class="col-12 col-md-4">
          <div v-if="item.attributes">
            <div
              v-for="(attr, index) in item.attributes"
              :key="index"
              class="text-muted small"
            >
              {{ attr.optionAttributeName }}: {{ attr.attributeValue }}
            </div>
          </div>
        </div>

        <!-- Cột 4: Số lượng + Giá -->
        <div class="col-12 col-md-3 text-md-end text-start">
          <div>Số lượng: {{ item.quantity }}</div>
          <div>{{ formatCurrency(item.price * item.quantity) }}</div>
        </div>
      </div>
    </li>
  </ul>
</div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orders = ref([])
const loading = ref(true)

const accountId = sessionStorage.getItem('accountId')

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/orders/account/${accountId}`)
    orders.value = response.data.sort((a, b) => b.id - a.id)
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng:", error)
  } finally {
    loading.value = false
  }
})

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}

function getStatusText(status) {
  switch (status) {
    case 0: return "Chờ xác nhận"
    case 1: return "Đã xác nhận"
    case 2: return "Đang giao hàng"
    case 3: return "Đã giao"
    case 4: return "Đã hủy"
    default: return "Không xác định"
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 0: return 'bg-secondary'
    case 1: return 'bg-info'
    case 2: return 'bg-warning text-dark'
    case 3: return 'bg-success'
    case 4: return 'bg-danger'
    default: return 'bg-dark'
  }
}
</script>

<style scoped>
.order-list .card {
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.img-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: none;
}

@media (max-width: 576px) {
  .img-thumbnail {
    width: 100%;
    height: auto;
  }
}
</style>
