<template>
  <div class="container mt-5" v-if="sku">
    <div class="row">
      <div class="col-md-5">
        <img :src="getImageUrl(sku.skuImage)" class="img-fluid rounded shadow" />
      </div>

      <div class="col-md-7">
        <h2>{{ sku.skuName }}</h2>
    
        <p>Mô tả: {{ sku.skuDiscriptione }}</p>
        <p>Giá: <strong class="text-danger">{{ formatCurrency(sku.skuPrice) }}</strong></p>
        <p>Số lượng còn: {{ sku.skuQuantity }}</p>
        <!-- <p>Ngày tạo: {{ formatDate(sku.skuCreatedate) }}</p> -->
        <p v-if="sku.optionAttributeName">
          {{ sku.optionAttributeName }}: <strong>{{ sku.attributeName }}</strong>
        </p>
      </div>
    </div>
  
  </div>
  <div v-else class="text-center mt-5">Đang tải dữ liệu...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'

const sku = ref(null)
const route = useRoute()

const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/400x400?text=No+Image'
  if (path.startsWith('http')) return path
  return `http://localhost:8080/images/${path}`
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

onMounted(async () => {
  try {
    const { id } = route.params
    const res = await axios.get(`/skuAttribute/${id}`)
    sku.value = res.data
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', err)
  }
})
</script>

<style scoped>
img {
  max-height: 400px;
  object-fit: contain;
}
</style>
