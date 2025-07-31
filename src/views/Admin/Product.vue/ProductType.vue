<template>
  <div class="container" style="width: 100%;">
    <div class="title d-flex justify-content-center">
      <h1>Thêm loại sản phẩm</h1>
    </div>

    <div class="form-type">
      <form @submit.prevent="isEditing ? updateCategory() : addCategory()">
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

        <button type="submit" class="btn btn-primary mt-3">
          {{ isEditing ? 'Cập nhật' : 'Thêm' }}
        </button>
        <button v-if="isEditing" @click="cancelEdit" class="btn btn-secondary mt-3 ms-2">Hủy</button>
      </form>

      <table class="table mt-4">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tên loại</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.status ? 'Hoạt động' : 'Ngừng hoạt động' }}</td>
            <td>
              <button @click="editCategory(item)" class="btn btn-warning btn-sm me-2">Sửa</button>
              <button @click="deleteCategory(item.id)" class="btn btn-danger btn-sm">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/category'

const categories = ref([])
const name = ref('')
const status = ref('true')
const isEditing = ref(false)
const editingId = ref(null)

// Lấy danh sách
const fetchCategories = async () => {
  try {
    const res = await axios.get(API_URL)
    categories.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách loại:', err)
  }
}

// Thêm mới
const addCategory = async () => {
  try {
    const newCategory = {
      name: name.value,
      status: status.value === 'true'
    }
    await axios.post(API_URL, newCategory)
    name.value = ''
    status.value = 'true'
    await fetchCategories()
  } catch (err) {
    console.error('Lỗi khi thêm loại sản phẩm:', err)
  }
}

// Bắt đầu sửa
const editCategory = (item) => {
  name.value = item.name
  status.value = item.status ? 'true' : 'false'
  isEditing.value = true
  editingId.value = item.id
}

// Hủy sửa
const cancelEdit = () => {
  name.value = ''
  status.value = 'true'
  isEditing.value = false
  editingId.value = null
}

// Cập nhật
const updateCategory = async () => {
  try {
    const updated = {
      name: name.value,
      status: status.value === 'true'
    }
    await axios.put(`${API_URL}/${editingId.value}`, updated)
    cancelEdit()
    await fetchCategories()
  } catch (err) {
    console.error('Lỗi khi cập nhật loại sản phẩm:', err)
  }
}

// Xóa
const deleteCategory = async (id) => {
  if (confirm('Bạn có chắc muốn xóa không?')) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      await fetchCategories()
    } catch (err) {
      console.error('Lỗi khi xóa loại sản phẩm:', err)
    }
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
