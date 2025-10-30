<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Chi tiết sản phẩm</h3>
      <button class="btn btn-outline-secondary" @click="router.back()">
        <i class="bi bi-arrow-left"></i> Quay lại
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="product" class="bg-white p-4 rounded shadow-sm">
      <!-- THÔNG TIN SẢN PHẨM -->
      <div class="row">
        <div class="col-lg-4 text-center mb-4">
          <img
            :src="product.image"
            class="rounded-4 shadow-sm border"
            style="width: 100%; max-width: 300px; height: 300px; object-fit: cover;"
            alt="Ảnh sản phẩm"
          />
        </div>

        <div class="col-lg-8">
          <h4 class="fw-bold">{{ product.name }}</h4>
          <p><strong>Slug:</strong> {{ product.slug }}</p>
          <p><strong>Danh mục:</strong> {{ product.categoryName }}</p>
          <p>
            <strong>Trạng thái:</strong>
            <span
              class="badge"
              :class="product.status ? 'bg-success' : 'bg-danger'"
            >
              {{ product.status ? 'Đang bán' : 'Ngừng bán' }}
            </span>
          </p>
          <p><strong>Mô tả:</strong></p>
          <p>{{ product.description || 'Không có mô tả' }}</p>
        </div>
      </div>

      <hr />

      <!-- DANH SÁCH SKU -->
      <div>
        <h5 class="fw-bold mb-3">Danh sách biến thể (SKU)</h5>

        <div
          v-for="sku in product.skus"
          :key="sku.id"
          class="border rounded p-3 mb-3 bg-light"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0">SKU #{{ sku.id }}</h6>
          </div>

          <div class="row mb-2">
            <div class="col-md-6">
              <strong>Giá:</strong> {{ formatCurrency(sku.price) }}
            </div>
            <div class="col-md-6">
              <strong>Số lượng:</strong> {{ sku.quantity }}
            </div>
          </div>

          <!-- ẢNH SKU -->
          <div class="mb-3">
            <strong>Ảnh biến thể:</strong>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <img
                v-for="img in sku.skuImages"
                :key="img.id"
                :src="img.path"
                class="rounded border"
                style="width: 80px; height: 80px; object-fit: cover; cursor: pointer;"
                @click="openImage(img.path)"
              />
            </div>
          </div>

          <!-- THUỘC TÍNH SKU -->
          <div>
            <strong>Thuộc tính:</strong>
            <ul class="mt-2 mb-0">
              <li
                v-for="attr in sku.skuAttributes"
                :key="attr.id"
              >
                {{ attr.optionAttributeName }}:
                <strong>{{ attr.valueAttributeName }}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5 text-muted">
      <p>Không tìm thấy sản phẩm.</p>
    </div>

    <!-- POPUP XEM ẢNH -->
    <div
      v-if="previewImage"
      class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
      style="z-index: 9999;"
      @click="previewImage = null"
    >
      <img
        :src="previewImage"
        class="rounded shadow-lg"
        style="max-width: 80%; max-height: 80%; object-fit: contain;"
      />
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




onMounted(async () => {
  const id = route.params.id
  loading.value = true
  try {
    const res = await axios.get(`/api/product/${id}`)
    product.value = res.data
  } catch (err) {
    console.error('❌ Lỗi khi tải sản phẩm:', err)
    alert('Không thể tải chi tiết sản phẩm!')
  } finally {
    loading.value = false
  }
})

function formatCurrency(value) {
  if (value == null) return '—'
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
.container {
  max-width: 1000px;
}

/* ----------- TIÊU ĐỀ & THANH TRÊN ----------- */
h3.fw-bold {
  font-size: 1.75rem;
  color: #2c3e50;
}

/* ----------- ẢNH SẢN PHẨM CHÍNH ----------- */
.main-image {
  width: 100%;
  max-width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 1rem;
  border: 1px solid #dee2e6;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.03);
}

/* ----------- KHỐI SKU ----------- */
.bg-light {
  background-color: #f8f9fa !important;
}

.sku-card {
  border: 1px solid #e3e6ea;
  border-radius: 12px;
  background-color: #fdfdfd;
  transition: all 0.2s ease-in-out;
}

.sku-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}

/* ----------- ẢNH SKU ----------- */
.sku-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sku-image:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* ----------- THUỘC TÍNH ----------- */
ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

li {
  padding: 4px 0;
  border-bottom: 1px dashed #e2e2e2;
}

li:last-child {
  border-bottom: none;
}

/* ----------- TRẠNG THÁI ----------- */
.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.8em;
  border-radius: 8px;
}

/* ----------- POPUP ẢNH ----------- */
.position-fixed img {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.position-fixed img:hover {
  transform: scale(1.02);
}

/* ----------- TEXT ----------- */
p {
  margin-bottom: 0.5rem;
  color: #555;
}

strong {
  color: #2d3436;
}
</style>

