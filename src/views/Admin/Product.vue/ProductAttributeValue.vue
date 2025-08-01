<template>
  <div class="container">
    <h2 class="text-center mb-4">Giá trị Thuộc tính</h2>

    <!-- Tabs -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#form">Thêm giá trị</a>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <!-- DANH SÁCH -->
      <div id="list" class="tab-pane fade show active">
        <!-- Tìm kiếm -->
        <form class="row g-2 mb-3" @submit.prevent="doSearch">
          <div class="col-md-4">
            <input
              v-model="searchInput"
              type="text"
              class="form-control"
              placeholder="Nhập giá trị cần tìm..."
            />
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-primary w-100">Tìm kiếm</button>
          </div>
        </form>

        <span class="text-muted">
          Tìm thấy {{ filteredValues.length }} kết quả
        </span>

        <table class="table table-striped table-hover align-middle mt-2">
          <thead class="table-light">
            <tr>
              <th style="width:70px;">ID</th>
              <th>Giá trị</th>
              <th>Thuộc tính</th>
              <th style="width:180px;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in paginatedValues" :key="v.id">
              <td>{{ v.id }}</td>
              <td>{{ v.value }}</td>
              <td>{{ getAttributeName(v.optionAttributeId) }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="editValue(v)">Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteValue(v.id)">Xoá</button>
              </td>
            </tr>
            <tr v-if="paginatedValues.length === 0">
              <td colspan="4" class="text-center py-4">Không tìm thấy giá trị nào.</td>
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
        <form @submit.prevent="isEditing ? updateValue() : addValue()" class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Chọn thuộc tính</label>
            <select v-model="selectedAttributeId" class="form-select" required>
              <option disabled value="">-- Chọn attribute --</option>
              <option v-for="a in attributes" :key="a.id" :value="a.id.toString()">
                {{ a.name }}
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">Giá trị</label>
            <input v-model="value" type="text" class="form-control" placeholder="Nhập giá trị" required />
          </div>

          <div class="col-12 d-flex gap-2">
            <button class="btn btn-primary" type="submit">
              {{ isEditing ? 'Cập nhật' : 'Thêm giá trị' }}
            </button>
            <button v-if="isEditing" class="btn btn-secondary" type="button" @click="resetForm">Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const ATTRIBUTE_API = 'http://localhost:8080/api/option-attribute'
const VALUE_API = 'http://localhost:8080/api/attribute-value'

const attributes = ref([])
const values = ref([])

const selectedAttributeId = ref('')
const value = ref('')
const id = ref(null)
const isEditing = ref(false)

const searchInput = ref('')
const search = ref('')

// phân trang
const currentPage = ref(1)
const itemsPerPage = ref(5) // số bản ghi / trang

// Danh sách lọc theo từ khóa
const filteredValues = computed(() => {
  if (!search.value.trim()) return values.value
  return values.value.filter(v =>
    v.value.toLowerCase().includes(search.value.trim().toLowerCase())
  )
})

// Tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredValues.value.length / itemsPerPage.value)
})

// Lấy dữ liệu hiển thị trong trang hiện tại
const paginatedValues = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredValues.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Khi bấm nút tìm kiếm
const doSearch = () => {
  search.value = searchInput.value
  currentPage.value = 1
}

// Load dữ liệu
const fetchAttributes = async () => {
  const res = await axios.get(ATTRIBUTE_API)
  attributes.value = res.data
}

const fetchValues = async () => {
  const res = await axios.get(VALUE_API)
  values.value = res.data
}

// Lấy tên attribute
const getAttributeName = (id) => {
  const found = attributes.value.find(a => a.id === id)
  return found ? found.name : 'Không rõ'
}

// Reset form
const resetForm = () => {
  id.value = null
  value.value = ''
  selectedAttributeId.value = ''
  isEditing.value = false
}

// Check trùng giá trị
const isDuplicate = () => {
  return values.value.some(
    v =>
      v.value.trim().toLowerCase() === value.value.trim().toLowerCase() &&
      v.optionAttributeId?.toString() === selectedAttributeId.value &&
      (!isEditing.value || v.id !== id.value)
  )
}

// Thêm
const addValue = async () => {
  if (isDuplicate()) {
    alert('Giá trị đã tồn tại.')
    return
  }
  const newValue = {
    value: value.value.trim(),
    optionAttributeId: parseInt(selectedAttributeId.value)
  }
  await axios.post(VALUE_API, newValue)
  await fetchValues()
  resetForm()
}

// Edit
const editValue = (v) => {
  id.value = v.id
  value.value = v.value
  selectedAttributeId.value = v.optionAttributeId?.toString() ?? ''
  isEditing.value = true
  setTimeout(() => {
    document.querySelector('[href="#form"]')?.click()
  }, 100)
}

// Update
const updateValue = async () => {
  if (isDuplicate()) {
    alert('Giá trị đã tồn tại.')
    return
  }
  const updated = {
    id: id.value,
    value: value.value.trim(),
    optionAttributeId: parseInt(selectedAttributeId.value)
  }
  await axios.put(`${VALUE_API}/${id.value}`, updated)
  await fetchValues()
  resetForm()
}

// Delete
const deleteValue = async (deleteId) => {
  if (confirm('Bạn chắc chắn muốn xoá?')) {
    await axios.delete(`${VALUE_API}/${deleteId}`)
    await fetchValues()
  }
}

onMounted(async () => {
  await fetchAttributes()
  await fetchValues()
})
</script>

<style scoped>
.pagination .page-link {
  cursor: pointer;
}
</style>
