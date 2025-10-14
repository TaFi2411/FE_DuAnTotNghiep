<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">Quản lý Category</h2>

    <!-- 🔍 Tìm kiếm + Lọc trạng thái + Nút thêm -->
    <div class="d-flex justify-content-between mb-3 align-items-center gap-2">
      <div class="d-flex gap-2 w-75">
        <input
          v-model="name"
          @input="fetchCategories"
          type="text"
          class="form-control"
          placeholder="Tìm theo tên..."
        />
        <input
          v-model="slug"
          @input="fetchCategories"
          type="text"
          class="form-control"
          placeholder="Tìm theo slug..."
        />
        <select v-model="status" @change="fetchCategories" class="form-select w-auto">
          <option value="">Tất cả</option>
          <option value="true">Hoạt động</option>
          <option value="false">Ẩn</option>
        </select>
      </div>

      <button class="btn btn-primary" @click="goAdd">+ Thêm Category</button>
    </div>

    <!-- 🧱 Bảng danh mục -->
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Slug</th>
          <th>Tên</th>
          <th>Trạng thái</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat.id">
          <td>{{ cat.id }}</td>
          <td>{{ cat.slug }}</td>
          <td>{{ cat.name }}</td>
          <td>
            <span class="badge" :class="cat.status ? 'bg-success' : 'bg-secondary'">
              {{ cat.status ? 'Hoạt động' : 'Ẩn' }}
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning me-2" @click="goEdit(cat.id)">
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="confirmDelete(cat.id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Khi không có dữ liệu -->
    <div v-if="categories.length === 0" class="text-center text-muted mt-3">
      Không có danh mục nào.
    </div>

    <!-- 📄 Phân trang -->
    <div
      v-if="totalPages > 1"
      class="d-flex justify-content-between align-items-center mt-3"
    >
      <div>Trang {{ currentPage + 1 }} / {{ totalPages }}</div>
      <div>
        <button
          class="btn btn-outline-primary me-2"
          :disabled="currentPage === 0"
          @click="changePage(currentPage - 1)"
        >
          &laquo; Trước
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="currentPage >= totalPages - 1"
          @click="changePage(currentPage + 1)"
        >
          Sau &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'

const router = useRouter()
const categories = ref([])

// 🔍 Bộ lọc
const name = ref('')
const slug = ref('')
const status = ref('')

// 📄 Phân trang
const currentPage = ref(0)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = 5

// 🚀 Lấy danh sách category có phân trang + tìm kiếm
const fetchCategories = async (page = currentPage.value) => {
  try {
    const res = await axios.get('/api/category', {
      params: {
        name: name.value,
        slug: slug.value,
        status: status.value !== '' ? status.value : null,
        page,
        size: pageSize
      }
    })

    categories.value = res.data.data || res.data.content || []
    totalPages.value = res.data.totalPages || 1
    totalItems.value = res.data.totalItems || categories.value.length
    currentPage.value = res.data.currentPage || 0
  } catch (err) {
    console.error('❌ Lỗi khi tải danh mục:', err)
  }
}

// 👉 Đổi trang
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchCategories(page)
  }
}

// ➕ Thêm, ✏️ Sửa, ❌ Xóa
const goAdd = () => router.push('/categories/add')
const goEdit = (id) => router.push(`/categories/edit/${id}`)

const confirmDelete = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa danh mục này không?')) return
  try {
    await axios.delete(`/category/${id}`)
    await fetchCategories(currentPage.value)
    alert('✅ Xóa thành công!')
  } catch (err) {
    console.error('❌ Lỗi khi xóa:', err)
    alert('Xóa thất bại, xem console để biết thêm chi tiết.')
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.card {
  border-radius: 10px;
}
.pagination .page-link {
  cursor: pointer;
}
</style>
