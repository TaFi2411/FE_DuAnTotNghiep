<template>
  <div class="container mt-4">
    <h2>Chi tiết sản phẩm</h2>
    <hr />

    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#add">Thêm</a>
      </li>
    </ul>

    <div class="tab-content">
      
      <div id="list" class="container tab-pane active"><br />
        <div class="input-group mb-3 w-100">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Tìm kiếm ..."
          />
          <button class="btn btn-primary" @click="doSearch">
            <i class="bi bi-search"></i> Tìm
          </button>
        </div>

        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thuộc tính</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
           
              

          </tbody>
        </table>

        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="prevPage" :disabled="currentPage === 1">
                Trước
              </button>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="goToPage(page)">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
                Sau
              </button>
            </li>
          </ul>
        </nav>
      </div>
     <div id="add" class="container tab-pane fade"><br />

  <form @submit.prevent="addSku">
    <div class="mb-3">
      <label class="form-label">Sản phẩm</label>
      <select class="form-select" required>
        <option disabled selected>-- Chọn sản phẩm --</option>

      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Tên chi tiết</label>
      <input  type="text" v-model="name" class="form-control" required />
    </div>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label">Giá</label>
        <input  type="number" v-model="price" class="form-control" required />
      </div>
      <div class="col-md-6">
        <label class="form-label">Số lượng</label>
        <input  type="number" v-model="quantity" class="form-control" required />
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Ảnh</label>
      <input @change="handleImageUpload" v-model="image" type="file" class="form-control" accept="image/*" />
    </div>

   
     <div class="mb-3">
      <label class="form-label">Mô tả</label>
    <CustomTextArea/>
    </div>

    <button type="submit" class="btn btn-success mt-5">Lưu biến thể</button>
  </form>
</div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CustomTextArea from "@/components/CustomTextArea/CustomTextArea.vue";

const API_URL = 'http://localhost:8080/api/sku'
const Sku = ref([])
const Products = ref([])

const SkuRequest = ref({
  name: '',
  description: '',     
  image: '',
  price: 0,
  quantity: 0,
  product_id: null
})

const fetchProduct = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/product')
    Products.value = response.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách sản phẩm:', err)
  }
}

async function themSKU() {
  try {
    const response = await axios.post('http://localhost:8080/api/sku', SkuRequest.value)
    console.log('Thêm SKU thành công:', response.data)
  } catch (error) {
    console.error('Lỗi khi thêm SKU:', error)
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.table-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>
