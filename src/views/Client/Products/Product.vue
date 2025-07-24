<template>
  <div class="container mt-4">
     <!-- Bộ lọc ngang -->
   <div class="locngang d-flex flex-wrap gap-2 mb-4" >
    <button
    class="btn btn-dark-custom"
    :class="{ active: categoryFilter === '' }"
    @click="categoryFilter = ''"
  >
    <i class="bi bi-grid me-1"></i> Tất cả
  </button>

  <button
    class="btn btn-dark-custom"
    :class="{ active: categoryFilter === 'Điện thoại' }"
    @click="categoryFilter = 'Điện thoại'"
  >
    <i class="bi bi-phone me-1"></i> Điện thoại
  </button>

  <button
    class="btn btn-dark-custom"
    :class="{ active: categoryFilter === 'Laptop' }"
    @click="categoryFilter = 'Laptop'"
  >
    <i class="bi bi-laptop me-1"></i> Laptop
  </button>

  <button
    class="btn btn-dark-custom"
    :class="{ active: categoryFilter === 'iPad' }"
    @click="categoryFilter = 'iPad'"
  >
    <i class="bi bi-tablet me-1"></i> iPad
  </button>

  <button
    class="btn btn-dark-custom"
    :class="{ active: categoryFilter === 'AirPods' }"
    @click="categoryFilter = 'AirPods'"
  >
    <i class="bi bi-earbuds me-1"></i> AirPods
  </button>
 
</div>

    <div class="row">
      <!-- Bộ lọc bên trái -->
      <div class="col-md-3">
        <h5>Bộ lọc</h5>
        <form @submit.prevent="applyFilters">
          <!-- Dung lượng -->
          <div class="boloc mb-3">
            <label class="form-label">Dung lượng</label>
            <div class="form-check" v-for="option in capacities" :key="option">
              <input
                class="form-check-input"
                type="checkbox"
                :value="option"
                v-model="filters.capacity"
                :id="'capacity-' + option"
              />
              <label class="form-check-label" :for="'capacity-' + option">{{ option }}</label>
            </div>
          </div>

          <!-- Màu sắc -->
          <div class="boloc mb-3">
            <label class="form-label">Màu sắc</label>
            <div class="form-check" v-for="option in colors" :key="option">
              <input
                class="form-check-input"
                type="checkbox"
                :value="option"
                v-model="filters.color"
                :id="'color-' + option"
              />
              <label class="form-check-label" :for="'color-' + option">{{ option }}</label>
            </div>
          </div>

          <!-- Giá tiền -->
          <div class="boloc mb-3">
            <label class="form-label">Giá tiền</label>
            <div class="form-check" v-for="option in prices" :key="option.value">
              <input
                class="form-check-input"
                type="checkbox"
                :value="option.value"
                v-model="filters.price"
                :id="'price-' + option.value"
              />
              <label class="form-check-label" :for="'price-' + option.value">{{ option.label }}</label>
            </div>
          </div>

         
        </form>
      </div>

      <!-- Sản phẩm bên phải -->
      <div class="col-md-9">
        <div class="row">
          <div
            class="col-lg-3 col-md-4 col-sm-6 mb-4"
            v-for="product in displayedProducts"
            :key="product.id"
          >
            <RouterLink :to="`/sanpham/chitietsanpham/${product.id}`" class="text-decoration-none">
              <div class="card h-100 position-relative overflow-hidden product-card-hover">
                <!-- Badge mẫu mới -->
                <span class="badge bg-danger position-absolute top-0 start-0 m-2 badge-pulse">
                  Mẫu mới
                </span>

                <!-- Ảnh sản phẩm -->
                <div class="image-container p-2">
                  <img
                    :src="product.image"
                    class="card-img-top product-img"
                    :alt="product.name"
                  />
                </div>

                <!-- Nội dung -->
                <div class="card-body">
                  <h6 class="card-title text-dark">{{ product.name }}</h6>
               
                  <p class="card-text text-danger fw-bold">{{ formatPrice(product.price) }}</p>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Nút xem thêm -->
        <div class="text-center" v-if="filteredProducts.length > limit">
          <button class="btn custom-btn" @click="loadMore">Xem thêm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const filters = ref({
  capacity: [],
  color: [],
  price: []
})

const capacities = ['64GB', '128GB', '256GB']
const colors = ['Đen', 'Trắng', 'Vàng', 'Xanh']
const prices = [
  { value: 'duoi20', label: 'Dưới 20 triệu' },
  { value: '20-30', label: 'Từ 20 - 30 triệu' },
  { value: 'tren30', label: 'Trên 30 triệu' }
]

const allProducts = ref([
  { id: 1, name: 'Điện thoại iPhone 16 Pro Max 256GB', capacity: '128GB', color: 'Đen', price: 24, image: '/images/Ip16prm-1tb.png' },
  { id: 2, name: 'iPhone 14', capacity: '256GB', color: 'Trắng', price: 28, image: '/images/Ip16plus.png' },
  { id: 3, name: 'iPhone 15 Pro', capacity: '128GB', color: 'Xanh', price: 35, image: '/images/Ip16.png' },
  { id: 4, name: 'iPhone 13 Mini', capacity: '64GB', color: 'Vàng', price: 18, image: '/images/Ip16prm-1tb.png' },
  { id: 5, name: 'iPhone 14 Pro', capacity: '256GB', color: 'Đen', price: 30, image: '/images/Ip16prm-1tb.png' },
  { id: 6, name: 'iPhone 15', capacity: '128GB', color: 'Trắng', price: 27, image: '/images/Ip16prm-1tb.png' },
  { id: 7, name: 'iPhone 12', capacity: '64GB', color: 'Xanh', price: 20, image: '/images/Ip16prm-1tb.png' },
  { id: 8, name: 'iPhone 15 Pro Max', capacity: '256GB', color: 'Vàng', price: 38, image: '/images/Ip16prm-1tb.png' },
  { id: 9, name: 'iPhone 12', capacity: '64GB', color: 'Xanh', price: 20, image: '/images/Ip16prm-1tb.png' },
  { id: 10, name: 'iPhone 15 Pro Max', capacity: '256GB', color: 'Vàng', price: 38, image: '/images/Ip16prm-1tb.png' }
])

const limit = ref(8)

const filteredProducts = computed(() => {
  return allProducts.value.filter(p => {
    const matchCapacity = filters.value.capacity.length === 0 || filters.value.capacity.includes(p.capacity)
    const matchColor = filters.value.color.length === 0 || filters.value.color.includes(p.color)
    const matchPrice =
      filters.value.price.length === 0 ||
      filters.value.price.some(price => {
        if (price === 'duoi20') return p.price < 20
        if (price === '20-30') return p.price >= 20 && p.price <= 30
        if (price === 'tren30') return p.price > 30
        return true
      })
    return matchCapacity && matchColor && matchPrice
  })
})

const displayedProducts = computed(() => filteredProducts.value.slice(0, limit.value))

function loadMore() {
  limit.value += 6
}

function applyFilters() {
  limit.value = 6
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price * 1_000_000) + ' đ'
}
</script>

<style scoped>
.product-img {
  height: 200px;
  object-fit: contain;
  
  transition: transform 0.3s ease;
  margin-top: 10px;
}

.card:hover .product-img {
  transform: translateY(-10px);
}

.badge-pulse {
  animation: pulse 1.5s infinite;
  font-size: 0.7rem;
  z-index: 2;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.custom-btn {
  background-color: #186ceb;
  color: white;
  border: none;
  width: 200px;
}

.custom-btn:hover {
  background-color: #115fbe;
  color: white;
}

.btn-dark-custom {
  background-color: #000;
  color: #fff;
  border: 1px solid #333;
  border-radius: 50rem;
  transition: 0.3s;
}

.btn-dark-custom:hover {
  background-color: #ededed;
  color: #000000;
}

.btn-dark-custom.active {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #fff !important;
}
.boloc {
    border-bottom: 0.5px solid #e0dfdf;
}
.boloc {
  background-color: #fff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.boloc:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

.boloc .form-label {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  display: block;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.form-check {
  margin-bottom: 0.5rem;
}

.form-check-input {
  cursor: pointer;
  accent-color: #007bff; /* màu xanh chủ đạo */
}

.form-check-label {
  margin-left: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #555;
  transition: color 0.2s;
}

.form-check-label:hover {
  color: #000;
}

.col-md-3 h5 {
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #222;
}
.btn-glow {
  background-color: #111; /* đen ánh kim */
  color: #fff;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.btn-glow i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.btn-glow:hover {
  color: #fff;
  background-color: #1f1f1f;
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(0, 123, 255, 0.4);
}

.btn-glow:hover i {
  transform: scale(1.2);
}

.btn-glow.active {
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: #fff;
  border: none;
  font-weight: bold;
  box-shadow: 0 0 16px rgba(0, 174, 255, 0.5);
}

.btn-glow.active i {
  transform: scale(1.3);
}


</style>
