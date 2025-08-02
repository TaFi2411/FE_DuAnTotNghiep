<template>
  <div class="container mt-5" v-if="sku">
    <div class="row">
      <div class="col-md-5">
        <img :src="getImageUrl(sku.image)" class="img-fluid rounded shadow" />
      </div>

      <div class="col-md-7">
        <h2>{{ sku.name }}</h2>

        <p>Mô tả: <span v-html="sku.discriptione"></span></p>

        <p>Giá: <strong class="text-danger">{{ formatCurrency(sku.price) }}</strong></p>

        <p>Số lượng còn: {{ sku.quantity }}</p>

        <!-- Hiển thị các thuộc tính -->
        <div v-if="sku.attributes && sku.attributes.length">
          <div v-for="(attr, index) in sku.attributes" :key="index">
            <p>{{ attr.attributeName }}: <strong>{{ attr.attributeValue }}</strong></p>
          </div>
        </div>
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

// Xử lý ảnh
const getImageUrl = (path) => {
  return path || 'https://via.placeholder.com/400x400?text=No+Image'
}

// Định dạng tiền
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

// Gọi API khi trang tải
onMounted(async () => {
  try {
    const { id } = route.params
    const res = await axios.get(`/skuAttribute/${id}`)

    if (res.data) {
      const data = res.data
      sku.value = {
        name: data.skuName,
        discriptione: data.skuDiscriptione,
        price: data.skuPrice,
        quantity: data.skuQuantity,
        image: data.skuImage,
        attributes: [
          {
            attributeName: data.optionAttributeName, // Ví dụ: Màu sắc
            attributeValue: data.attributeName       // Ví dụ: Đỏ
          }
        ]
      }
    }
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', err)
  }
})
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  margin-bottom: 12px;
}

strong {
  font-weight: 600;
}

.text-danger {
  font-size: 20px;
}

img {
  max-height: 400px;
  width: 100%;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #eee;
  background-color: #f9f9f9;
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.02);
}

.attribute-label {
  font-weight: 500;
  color: #444;
}

.attribute-value {
  color: #2c3e50;
  font-weight: 600;
}

/* Responsive cải thiện hiển thị trên thiết bị nhỏ */
@media (max-width: 768px) {
  .container {
    padding: 20px 15px;
  }

  h2 {
    font-size: 24px;
  }

  .text-danger {
    font-size: 18px;
  }

  img {
    max-height: 300px;
  }
}
</style>

