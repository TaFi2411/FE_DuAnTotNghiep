<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center text-md-start">Quản lý đơn hàng</h2>

    <div v-if="loading" class="text-center">Đang tải đơn hàng...</div>
    <div v-else-if="orders.length === 0" class="text-center">Chưa có đơn hàng nào.</div>

    <div v-else class="order-list">
      <div v-for="order in orders" :key="order.id" class="card mb-4">
        <div class="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div>
            <strong>Mã đơn hàng:</strong> {{ order.code || 'DH-' + order.id }} <br />
            <small>Ngày đặt: {{ formatDate(order.createDate) }}</small>
          </div>

          <div class="text-md-end mt-2 mt-md-0">
            <div class="mt-2">
              <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)" class="form-select form-select-sm">
               <option 
                    v-for="s in statusOptions" 
                    :key="s.value" 
                    :value="s.value" 
                    :disabled="s.value < order.status">
                    {{ s.label }}
                    </option>
              </select>
            </div>

            <strong>Tổng tiền:</strong> {{ formatCurrency(order.total) }} <br />

            
          </div>
        </div>

        <div class="card-body">
          <ul class="list-group">
            <li v-for="item in order.items" :key="item.id" class="list-group-item">
              <div class="d-flex flex-column flex-md-row justify-content-between">
                <div class="d-flex">
                  <img :src="item.skuImage" class="img-thumbnail me-3" alt="Ảnh sản phẩm" />
                  <div>
                    <strong>{{ item.skuName }}</strong><br />
                    <div v-for="(attr, index) in item.attributes" :key="index" class="text-muted small">
                      {{ attr.optionAttributeName }}: {{ attr.attributeValue }}
                    </div>
                  </div>
                </div>
                <div class="text-end">
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

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/order')
    orders.value = response.data.sort((a, b) => b.id - a.id)

  } catch (error) {
    console.error("Lỗi khi tải đơn hàng:", error)
  } finally {
    loading.value = false
  }
})

function updateOrderStatus(orderId, status) {
    console.log(orderId,status)
  axios.put(`http://localhost:8080/api/order/${orderId}`, {
    status: status
  })
    .then(() => {
      alert('Cập nhật trạng thái thành công!')
    })
    .catch((error) => {
      alert('Cập nhật thất bại!')
      console.error(error)
    })
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}


const statusOptions = [
  { value: 0, label: 'Chờ xác nhận' },
  { value: 1, label: 'Đã xác nhận' },
  { value: 2, label: 'Đang giao hàng' },
  { value: 3, label: 'Đã giao' },
  { value: 4, label: 'Đã hủy' }
]
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
</style>
