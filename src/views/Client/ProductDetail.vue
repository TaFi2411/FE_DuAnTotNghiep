<template>
  <div class="container my-5" style="margin-top: 500px;">
    <div class="row g-4">
      <!-- Hình ảnh sản phẩm -->
      <div class="col-md-6 text-center border-end">
        <img 
          :src="selectedImage" 
          :alt="product.name" 
          class="img-fluid rounded shadow mb-3"
          style="max-width: 400px; height: auto;"
        />
        <!-- Hình ảnh nhỏ -->
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <img
            v-for="(img, index) in product.images"
            :key="index"
            :src="img"
            class="img-thumbnail"
            style="width: 70px; height: 70px; cursor: pointer; object-fit: cover;"
            :class="{ 'border-primary': img === selectedImage }"
            @click="selectedImage = img"
          />
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="col-md-6">
        <h1 class="mb-3 fw-bold">{{ product.name }}</h1>
        <p class="text-muted">{{ product.description }}</p>

        <!-- Giá -->
        <div class="bg-light rounded p-3 mb-3 d-inline-block">
          <h3 class="text-danger fw-semibold mb-0">
            {{ formatCurrency(product.price) }}
          </h3>
        </div>

        <!-- Trạng thái -->
        <p :class="product.inStock ? 'text-success' : 'text-danger'">
          {{ product.inStock ? 'Còn hàng' : 'Hết hàng' }}
        </p>

        <!-- Chọn màu -->
        <div class="mt-3">
          <label class="form-label fw-semibold">Màu sắc:</label>
          <div class="d-flex gap-3 flex-wrap">
            <div
              v-for="color in product.colors"
              :key="color.name"
              class="color-circle"
              :style="{ backgroundColor: color.code, border: selectedColor === color.name ? '3px solid #000' : '1px solid #ccc' }"
              @click="selectedColor = color.name"
              :title="color.name"
            ></div>
          </div>
        </div>

        <!-- Chọn dung lượng -->
        <div class="mt-3">
          <label class="form-label fw-semibold">Dung lượng:</label>
          <div class="d-flex gap-2 flex-wrap">
            <div
              v-for="size in product.sizes"
              :key="size"
              @click="selectedSize = size"
              class="bg-light px-3 py-2 rounded border"
              :class="selectedSize === size ? 'border-dark fw-bold' : 'border-secondary'"
              style="cursor: pointer;"
            >
              {{ size }}
            </div>
          </div>
        </div>

        <!-- Chọn số lượng -->
        <div class="mt-3">
          <label class="form-label fw-semibold d-block">Số lượng:</label>
          <div class="input-group" style="max-width: 200px;">
            <button class="btn btn-outline-secondary" @click="decreaseQty">-</button>
            <input 
              type="number" 
              class="form-control text-center"
              style="width: 15px;" 
              v-model.number="quantity" 
              min="1"
            />
            <button class="btn btn-outline-secondary" @click="increaseQty">+</button>
          </div>
        </div>

        <!-- Nút thao tác -->
        <div class="mt-4 d-flex gap-3 flex-wrap">
          <button
            class="btn btn-primary btn-lg"
            :disabled="!product.inStock"
            @click="addToCart"
          >
            <i class="bi bi-cart-plus"></i> Thêm vào giỏ hàng
          </button>

          <button
            class="btn btn-danger btn-lg"
            :disabled="!product.inStock"
            @click="buyNow"
          >
            <i class="bi bi-lightning-charge"></i> Mua ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = route.params.id

const product = ref({
  id: productId,
  name: 'iPhone 15 Pro Max',
  description: 'Chip A17 Pro, thiết kế titan nhẹ hơn, camera chuyên nghiệp 48MP.',
  price: 36990000,
  inStock: true,
  image: '/images/Ip16prm-1tb.png',
  images: [
    '/images/Ip16prm-1tb.png',
    '/images/Ip16prm-1tb.png',
    '/images/Ip16prm-1tb.png',
  ],
  colors: [
    { name: 'Titan Tự nhiên', code: '#D6D3CE' },
    { name: 'Titan Xanh', code: '#5B6C8F' },
    { name: 'Titan Đen', code: '#2E2E2E' },
    { name: 'Titan Trắng', code: '#FFFFFF' }
  ],
  sizes: ['256GB', '512GB', '1TB']
})

const selectedColor = ref(product.value.colors[0].name)
const selectedSize = ref(product.value.sizes[0])
const selectedImage = ref(product.value.image)
const quantity = ref(1)

const increaseQty = () => quantity.value++
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

function addToCart() {
  alert(`\u0110\u00e3 th\u00eam: ${product.value.name}\nM\u00e0u: ${selectedColor.value}\nDung l\u01b0\u1ee3ng: ${selectedSize.value}\nS\u1ed1 l\u01b0\u1ee3ng: ${quantity.value}`)
}

function buyNow() {
  alert(`Mua ngay: ${product.value.name}\nM\u00e0u: ${selectedColor.value}\nDung l\u01b0\u1ee3ng: ${selectedSize.value}\nS\u1ed1 l\u01b0\u1ee3ng: ${quantity.value}`)
}
</script>

<style scoped>
.color-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}
.color-circle:hover {
  transform: scale(1.1);
}
.img-thumbnail.border-primary {
  border: 2px solid #007bff !important;
}
</style>
