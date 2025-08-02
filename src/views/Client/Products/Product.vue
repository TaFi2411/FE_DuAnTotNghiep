<template>
  <div class="container mt-4">
    <!-- BỘ LỌC DANH MỤC -->
    <div class="filter-buttons">
      <button
        v-for="cat in categories"
        :key="cat"
        class="btn-filter"
        :class="{ active: selectedCategory === cat }"
        @click="filterByCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <div class="row">
      <div
        v-for="product in displayedProducts"
        :key="product.id"
        class="col-md-3 mb-4"
      >
        <div class="card h-100">
          <router-link :to="`/sanpham/chitietsanpham/${product.id}`" class="image-wrapper">
            <img
              :src="getImageUrl(product.image)"
              class="card-img-top"
              alt="Ảnh sản phẩm"
            />
          </router-link>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <div class="button-row mt-auto">
              <router-link
                :to="`/sanpham/chitietsanpham/${product.id}`"
                class="btn btn-outline-primary btn-find"
              >
                Tìm hiểu thêm
              </router-link>
              <button class="btn btn-primary btn-buy">Mua ></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NÚT XEM THÊM -->
    <div class="text-center mt-4" v-if="displayedProducts.length < filteredProducts.length">
      <button class="btn xemthem" @click="visibleCount += 8">Xem thêm</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/utils/axios'

const products = ref([])
const selectedCategory = ref('Tất cả') // Mặc định chọn "Tất cả"
const visibleCount = ref(8)

// Thêm "Tất cả" vào danh sách
const categories = ['Tất cả', 'Điện thoại', 'iPad', 'Mac', 'AirPods', 'Smartwatch']

const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/200x200?text=No+Image'
  if (path.startsWith('http')) return path
  return `http://localhost:8080/images/${path}`
}

const getProducts = async () => {
  try {
    const res = await axios.get('/product')
    products.value = res.data
    visibleCount.value = 8
  } catch (err) {
    console.error('Lỗi gọi API:', err)
  }
}

const filterByCategory = (category) => {
  selectedCategory.value = category
  visibleCount.value = 4
}

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Tất cả') return products.value
  return products.value.filter((p) => {
    const productCategory = p.categoryName?.trim().toLowerCase()
    const selected = selectedCategory.value.trim().toLowerCase()
    return productCategory === selected
  })
})

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, visibleCount.value)
})

onMounted(() => {
  getProducts()
})
</script>

<style scoped>
.card {
  border: none;
}
.btn-outline-dark.active {
  background-color: #000;
  color: white;
  border-color: #000;
}

.image-wrapper {
  overflow: hidden;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.card-img-top {
  height: 100%;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.card:hover .card-img-top {
  transform: translateY(-4px) scale(1.0);
}

.card-title {
  font-size: 1.1rem;
  min-height: 50px;
  text-align: center;
  color: #333;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-find {
  flex: 7;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.btn-buy {
  flex: 3;
  background-color: transparent;
  color: #007bff;
  border: none;
  border-radius: 25px;
  transition: color 0.3s ease, text-decoration 0.3s ease;
  padding: 0.375rem 0.75rem;
}

.btn-buy:hover {
  text-decoration: underline;
  color: #0056b3;
  background-color: transparent;
}

@media (max-width: 768px) {
  .col-md-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
@media (max-width: 576px) {
  .col-md-3 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.filter-buttons .btn-filter {
  padding: 10px 20px;
  background-color: white;
  color: #000000;
  border: none;
}

.filter-buttons .btn-filter.active {
  text-decoration: underline;
}

.xemthem {
  flex: 7;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}
.xemthem:hover {
  background-color: #0056b3;
}
</style>
