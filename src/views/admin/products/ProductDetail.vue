<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Chi tiết sản phẩm</h3>
      <button class="btn btn-outline-secondary btn-sm" @click="router.back()">
        <i class="bi bi-arrow-left"></i> Quay lại
      </button>
    </div>


    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="product" class="content-box">

      <div class="row">
        <div class="col-lg-4 text-center mb-4">
          <img :src="product.image" class="main-image" alt="Ảnh sản phẩm" />
        </div>

        <div class="col-lg-8">
          <div class="row">
            <h4 class="fw-bold mb-2">{{ product.name }}</h4>
            <div class="col-lg-6">
              

              <div class="info-row">
                <strong>Slug:</strong> {{ product.slug }}
              </div>

              <div class="info-row">
                <strong>Danh mục:</strong> {{ product.categoryName }}
              </div>
            </div>
            <div class="col-lg-6">
                        <div class="info-row">
            <strong>Giá:</strong>
            <span class="text-primary fw-bold">
              {{ minPrice && maxPrice ? formatCurrency(minPrice) + ' - ' + formatCurrency(maxPrice) : '—' }}
            </span>
          </div>

          <div class="info-row">
            <strong>Tổng tồn kho:</strong>
            <span class="text-info fw-bold">{{ totalStock }}</span>
          </div>

          <div class="info-row">
            <strong>Trạng thái:</strong>
            <span class="badge-status">
              {{ product.status ? 'Đang bán' : 'Ngừng bán' }}
            </span>
          </div>

          <div class="mt-3">
            <strong>Mô tả sản phẩm:</strong>
            <p class="mt-1">{{ product.description || 'Không có mô tả' }}</p>
          </div>
            </div>
          </div>



        </div>
      </div>

      <hr />

      <!-- ====== DANH SÁCH SKU ====== -->
      <h5 class="fw-bold mb-3">Danh sách biến thể </h5>

      <div v-for="sku in product.skus" :key="sku.id" class="sku-card">

        <div class="row">

          <div class="col-lg-3">
            <div class="d-flex flex-wrap gap-2 mt-2">
              <img v-for="img in sku.skuImages" :key="img.id" :src="img.path" class="sku-image"
                @click="openImage(img.path)" />
            </div>
          </div>

          <span class="col-lg-3" v-for="attr in sku.skuAttributes" :key="attr.id">
            {{ attr.optionAttributeName }}:<strong>{{ attr.valueAttributeName }}</strong>
          </span>

          <div class="col-lg-3">
            <div>
              <strong>Giá:</strong> {{ formatCurrency(sku.price) }}
            </div>
            <div>
              <strong>Tồn kho:</strong> {{ sku.quantity }}
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- KHÔNG TÌM THẤY -->
    <div v-else class="text-center py-5 text-muted">
      <p>Không tìm thấy sản phẩm.</p>
    </div>

    <!-- POPUP XEM ẢNH -->
    <div v-if="previewImage" class="image-popup" @click="previewImage = null">
      <img :src="previewImage" class="popup-img" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/composables/axios.js'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const loading = ref(false)
const previewImage = ref(null)

const minPrice = ref(null)
const maxPrice = ref(null)
const totalStock = ref(0)

onMounted(async () => {
  const id = route.params.id
  loading.value = true

  try {
    const res = await axios.get(`/api/product/${id}`)
    product.value = res.data

    const prices = product.value.skus.map(s => s.price)
    minPrice.value = Math.min(...prices)
    maxPrice.value = Math.max(...prices)

    totalStock.value = product.value.skus.reduce((sum, s) => sum + s.quantity, 0)
  } catch (err) {
    console.error('❌ Lỗi khi tải sản phẩm:', err)
    alert('Không thể tải chi tiết sản phẩm!')
  } finally {
    loading.value = false
  }
})

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

function openImage(url) {
  previewImage.value = url
}
</script>

<style scoped>
.p-3 {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.content-box {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.main-image {
  max-width: 320px;
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #eee;
}

.info-row {
  margin-bottom: 6px;
}

.sku-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #eee;
  margin-bottom: 15px;
}

.badge-status {
  background: #eaeaea;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #000;
}

.sku-image {
  width: 70px;
  height: 70px;
  border: 1px solid #ddd;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
}

.image-popup {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.popup-img {
  max-width: 80%;
  max-height: 80%;
  border-radius: 12px;
}
</style>
