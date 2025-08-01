<template>
  <div class="container">
    <h2 class="text-center mb-4">Loại sản phẩm</h2>

    <!-- Tabs -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#form">
          {{ isEditing ? 'Cập nhật loại' : 'Thêm loại' }}
        </a>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <!-- DANH SÁCH -->
      <div id="list" class="tab-pane fade show active">
        <!-- Form tìm kiếm -->
        <form class="row g-2 mb-3" @submit.prevent="doSearch">
          <div class="col-md-5">
            <input
              v-model="searchNameInput"
              type="text"
              class="form-control"
              placeholder="Nhập tên loại..."
            />
          </div>
          <div class="col-md-4">
            <select v-model="searchStatusInput" class="form-select">
              <option value="">-- Tất cả trạng thái --</option>
              <option value="true">Hoạt động</option>
              <option value="false">Ngừng hoạt động</option>
            </select>
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary w-100" type="submit">Tìm kiếm</button>
          </div>
        </form>

        <span class="text-muted">Tìm thấy {{ filteredCategories.length }} kết quả</span>

        <table class="table table-striped table-hover align-middle mt-2">
          <thead class="table-light">
            <tr>
              <th style="width:80px;">ID</th>
              <th style="width:300px;">Tên loại</th>
              <th style="width:200px;">Trạng thái</th>
              <th style="width:180px;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedCategories" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>
                <span :class="item.status ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ item.status ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="editCategory(item)">Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteCategory(item.id)">Xoá</button>
              </td>
            </tr>
            <tr v-if="paginatedCategories.length === 0">
              <td colspan="4" class="text-center py-4">Không tìm thấy loại sản phẩm.</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="mt-3">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">«</button>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">»</button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- FORM -->
      <div id="form" class="tab-pane fade">
        <form @submit.prevent="isEditing ? updateCategory() : addCategory()" class="mt-3">
          <div class="mb-3">
            <label class="form-label">Tên loại</label>
            <input v-model="name" type="text" class="form-control" placeholder="Nhập tên loại" required />
          </div>

          <div class="mb-3">
            <label class="form-label d-block">Trạng thái</label>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="true" v-model="status" id="hoatdong" />
              <label class="form-check-label" for="hoatdong">Hoạt động</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="false" v-model="status" id="ngunghoatdong" />
              <label class="form-check-label" for="ngunghoatdong">Ngừng hoạt động</label>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">{{ isEditing ? 'Cập nhật' : 'Thêm loại' }}</button>
            <button v-if="isEditing" type="button" class="btn btn-secondary" @click="resetForm">Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/category'

const categories = ref([])
const id = ref(null)
const name = ref('')
const status = ref('true')
const isEditing = ref(false)

// State tìm kiếm
const searchNameInput = ref('')
const searchStatusInput = ref('')
const searchName = ref('')
const searchStatus = ref('')

// Pagination state
const currentPage = ref(1)
const pageSize = 5

// Computed lọc dữ liệu
const filteredCategories = computed(() => {
  return categories.value.filter(cat => {
    const matchName = !searchName.value || cat.name.toLowerCase().includes(searchName.value.toLowerCase())
    const matchStatus = !searchStatus.value || String(cat.status) === searchStatus.value
    return matchName && matchStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredCategories.value.length / pageSize))

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCategories.value.slice(start, start + pageSize)
})

// Gọi API lấy categories
const fetchCategories = async () => {
  try {
    const res = await axios.get(API_URL)
    categories.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách loại:', err)
  }
}

// Thêm loại sản phẩm
const addCategory = async () => {
  try {
    // Kiểm tra trùng tên
    const exists = categories.value.some(cat => cat.name.toLowerCase() === name.value.trim().toLowerCase())
    if (exists) {
      alert('Tên loại đã tồn tại!')
      return
    }
    const newCategory = { name: name.value, status: status.value === 'true' }
    await axios.post(API_URL, newCategory)
    resetForm()
    await fetchCategories()
    setTimeout(() => { document.querySelector('[href="#list"]').click() }, 100)
  } catch (err) {
    console.error('Lỗi khi thêm loại sản phẩm:', err)
  }
}

// Sửa loại
const editCategory = (cat) => {
  id.value = cat.id
  name.value = cat.name
  status.value = String(cat.status)
  isEditing.value = true
  setTimeout(() => { document.querySelector('[href="#form"]').click() }, 100)
}

// Cập nhật loại
const updateCategory = async () => {
  try {
    // Kiểm tra trùng tên (trừ chính nó)
    const exists = categories.value.some(
      cat => cat.name.toLowerCase() === name.value.trim().toLowerCase() && cat.id !== id.value
    )
    if (exists) {
      alert('Tên loại đã tồn tại!')
      return
    }
    const updatedCategory = { id: id.value, name: name.value, status: status.value === 'true' }
    await axios.put(`${API_URL}/${id.value}`, updatedCategory)
    resetForm()
    await fetchCategories()
    setTimeout(() => { document.querySelector('[href="#list"]').click() }, 100)
  } catch (err) {
    console.error('Lỗi khi cập nhật loại sản phẩm:', err)
  }
}

// Xoá loại
const deleteCategory = async (catId) => {
  if (!confirm('Bạn có chắc chắn muốn xoá loại sản phẩm này?')) return
  try {
    await axios.delete(`${API_URL}/${catId}`)
    await fetchCategories()
  } catch (err) {
    console.error('Lỗi khi xoá loại sản phẩm:', err)
  }
}

// Reset form
const resetForm = () => {
  id.value = null
  name.value = ''
  status.value = 'true'
  isEditing.value = false
}

// Tìm kiếm
const doSearch = () => {
  searchName.value = searchNameInput.value.trim()
  searchStatus.value = searchStatusInput.value
  currentPage.value = 1
}

// Chuyển trang
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.container {
  max-width: 100%;
  width: 95%;
  margin: auto;
}

.table {
  font-size: 16px;
}

.table th,
.table td {
  padding: 14px;
}
</style>
