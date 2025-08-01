<template>
  <div class="container mt-3">
    <h2 class="text-center mb-4">Quản lý Thuộc tính Sản phẩm</h2>

    <!-- NAV TABS -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#form">Thêm thuộc tính</a>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <!-- DANH SÁCH -->
      <div id="list" class="tab-pane fade show active">
        
        <!-- Thanh tìm kiếm -->
        <form class="row g-2 mb-3" @submit.prevent="searchAttributes">
          <div class="col-md-4">
            <input 
              v-model="search" 
              type="text" 
              class="form-control" 
              placeholder="Nhập tên thuộc tính..." 
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Tìm kiếm</button>
          </div>
        </form>

        <span class="text-muted">Tìm thấy {{ filteredAttributes.length }} kết quả</span>

        <table class="table table-striped table-hover align-middle mt-2">
          <thead class="table-light">
            <tr>
              <th style="width: 70px;">ID</th>
              <th>Tên thuộc tính</th>
              <th style="width: 180px;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedAttributes" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>
                <button @click="editAttribute(item)" class="btn btn-sm btn-warning me-2">Sửa</button>
                <button @click="deleteAttribute(item.id)" class="btn btn-sm btn-danger">Xoá</button>
              </td>
            </tr>
            <tr v-if="paginatedAttributes.length === 0">
              <td colspan="3" class="text-center py-4">Không có thuộc tính nào.</td>
            </tr>
          </tbody>
        </table>

        <!-- PHÂN TRANG -->
        <nav v-if="totalPages > 1" class="mt-3">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">«</a>
            </li>
            <li 
              class="page-item" 
              v-for="page in totalPages" 
              :key="page" 
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="goToPage(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">»</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- FORM -->
      <div id="form" class="tab-pane fade">
        <form @submit.prevent="isEditing ? updateAttribute() : addAttribute()">
          <div class="mb-3">
            <label class="form-label">Tên thuộc tính</label>
            <input
              v-model="name"
              type="text"
              class="form-control"
              placeholder="Nhập tên thuộc tính"
              required
            />
          </div>

          <div class="mt-3 d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? "Cập nhật" : "Thêm mới" }}
            </button>
            <button v-if="isEditing" type="button" class="btn btn-secondary" @click="resetForm">
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/option-attribute'

const attributes = ref([])
const id = ref(null)
const name = ref('')
const isEditing = ref(false)

const search = ref('')
const searchKeyword = ref('')

// phân trang
const currentPage = ref(1)
const itemsPerPage = ref(5) // số item mỗi trang

// Lọc danh sách theo từ khoá
const filteredAttributes = computed(() => {
  if (!searchKeyword.value) return attributes.value
  return attributes.value.filter(attr =>
    attr.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// Tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredAttributes.value.length / itemsPerPage.value)
})

// Lấy danh sách hiển thị trong trang hiện tại
const paginatedAttributes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAttributes.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const searchAttributes = () => {
  searchKeyword.value = search.value.trim()
  currentPage.value = 1 // reset về trang 1 khi tìm kiếm
}

const fetchAttributes = async () => {
  try {
    const res = await axios.get(API_URL)
    attributes.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách thuộc tính:', err)
  }
}

const addAttribute = async () => {
  try {
    const newAttr = { name: name.value }
    await axios.post(API_URL, newAttr)
    resetForm()
    await fetchAttributes()
  } catch (err) {
    console.error('Lỗi khi thêm thuộc tính:', err)
  }
}

const editAttribute = (attr) => {
  id.value = attr.id
  name.value = attr.name
  isEditing.value = true
  setTimeout(() => {
    const tab = document.querySelector('[href="#form"]')
    if (tab) tab.click()
  }, 100)
}

const updateAttribute = async () => {
  try {
    const updatedAttr = { id: id.value, name: name.value }
    await axios.put(`${API_URL}/${id.value}`, updatedAttr)
    resetForm()
    await fetchAttributes()
  } catch (err) {
    console.error('Lỗi khi cập nhật thuộc tính:', err)
  }
}

const deleteAttribute = async (attrId) => {
  if (confirm('Bạn có chắc chắn muốn xoá không?')) {
    try {
      await axios.delete(`${API_URL}/${attrId}`)
      await fetchAttributes()
    } catch (err) {
      console.error('Lỗi khi xoá thuộc tính:', err)
    }
  }
}

const resetForm = () => {
  id.value = null
  name.value = ''
  isEditing.value = false
}

onMounted(fetchAttributes)
</script>

<style scoped>
.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.table {
  font-size: 15px;
}

.pagination .page-link {
  cursor: pointer;
}
</style>
