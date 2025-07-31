<template>
  <div class="container" style="width: 100%;">
    <div class="title d-flex justify-content-center">
      <h1>Thêm loại sản phẩm</h1>
    </div>

    <div class="form-type">
      <form @submit.prevent="addCategory">
        <div class="mb-3">
          <label class="form-label">Tên loại</label>
          <input v-model="name" type="text" class="form-control" placeholder="Nhập tên loại" required>
        </div>

        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" value="true" v-model="status" id="hoatdong">
          <label class="form-check-label" for="hoatdong">Hoạt động</label>
        </div>

        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" value="false" v-model="status" id="ngunghoatdong">
          <label class="form-check-label" for="ngunghoatdong">Ngừng hoạt động</label>
        </div>

        <button type="submit" class="btn btn-primary mt-3">Thêm</button>
      </form>

      <table class="table mt-4">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tên loại</th>
            <th scope="col">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.status ? 'Hoạt động' : 'Ngừng hoạt động' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// API URL – bạn thay bằng link thật sau
const API_URL = 'http://localhost:8080/api/category'


// Dữ liệu
const categories = ref([])
const name = ref('')
const status = ref('true') // mặc định là hoạt động

// Gọi API lấy danh sách loại sản phẩm
const fetchCategories = async () => {
  try {
    const res = await axios.get(API_URL)
    categories.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách loại:', err)
  }
}

// Gọi API thêm loại sản phẩm mới
const addCategory = async () => {
  try {
    const newCategory = {
      name: name.value,
      status: status.value === 'true' // ép kiểu chuỗi thành boolean
    }

    await axios.post(API_URL, newCategory)

    // Clear input
    name.value = ''
    status.value = 'true'

    // Reload danh sách
    await fetchCategories()
  } catch (err) {
    console.error('Lỗi khi thêm loại sản phẩm:', err)
  }
}

// Gọi khi trang được load
onMounted(() => {
  fetchCategories()
})
</script>