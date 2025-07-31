<template>
  <div class="container mt-4">
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status"></div>
      <p>Đang tải sản phẩm...</p>
    </div>

    <div v-else-if="product" class="row">
      <div class="col-md-6">
        <img :src="getImageUrl(product.image)" class="img-fluid" alt="Ảnh sản phẩm" />
      </div>
      <div class="col-md-6">
        <h2>{{ product.name }}</h2>
        <p class="text-muted">{{ product.description }}</p>
        <p><strong>Giá:</strong> {{ product.price }} triệu</p>
        <router-link to="/" class="btn btn-secondary mt-3">Quay lại</router-link>
      </div>
    </div>

    <div v-else class="text-center text-danger">
      <p>Không tìm thấy sản phẩm.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'

const route = useRoute()
const product = ref(null)
const loading = ref(true)

const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/200x200?text=No+Image'
  if (path.startsWith('http')) return path
  return `http://localhost:8080/images/${path}`
}

const fetchProduct = async () => {
  try {
    const id = route.params.id
    const res = await axios.get(`/product/${id}`)
    product.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>
