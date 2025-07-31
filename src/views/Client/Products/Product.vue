<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">Sản phẩm nổi bật</h2>
    <div class="row">
      <div v-for="product in products" :key="product.id" class="col-md-3 mb-4">
        <div class="card h-100 ">
          <img
            :src="getImageUrl(product.image)"
            class="card-img-top"
            alt="Ảnh sản phẩm"
          
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <!-- <p class="card-text text-muted">
              Màu: {{ product.color }} | Dung lượng: {{ product.capacity }}
            </p>
            <p class="fw-bold text-danger">{{ product.price }} triệu</p> -->
            <router-link
              :to="`/sanpham/chitietsanpham/${product.id}`"
              class="btn btn-primary mt-auto"
            >
              Xem 
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios' // Đã cấu hình sẵn baseURL

const products = ref([])

// Hàm xử lý ảnh nếu ảnh chỉ là đường dẫn tương đối
const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/200x200?text=No+Image'
  if (path.startsWith('http')) return path
return `http://localhost:8080/images/${path}`

}

const getProducts = async () => {
  try {
    const res = await axios.get('/product')
    console.log('Dữ liệu sản phẩm:', res.data)
    products.value = res.data

  } catch (err) {
    console.error('Lỗi gọi API:', err)
  }
}
// const getProducts = async () => {
//   try {
//     const res = await axios.get('/product')
//    products.value = res.data
//   } catch (err) {
//     console.error('Lỗi khi tải danh sách loại:', err)
//   }
// }
onMounted(() => {
  getProducts()
})
</script>

<style scoped>
.card-title {
  font-size: 1.1rem;
  min-height: 50px;
  text-align:center ;
}

.card {

 border: none;
  transition: transform 0.3s ease;
  
}

.card:hover {
  transform: translateY(-5px); /* nhẹ nhàng nâng card lên khi hover */
}

.card-img-top {
  height: 300px;
  object-fit: contain; /* Đổi từ cover sang contain */
  /* background-color: #f8f8f8;  */

}



.card-img-top:hover {
  transform: scale(1.05); /* phóng to ảnh nhẹ khi hover */
  z-index: 2;
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

</style>

