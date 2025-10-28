<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">Quản lý Status</h2>

    <!-- 🔍 Tìm kiếm + Nút thêm -->
    <div class="d-flex justify-content-between mb-3 align-items-center gap-2">
      <div class="d-flex gap-2 w-75">
        <input
          v-model="keyword"
          @input="fetchStatuses"
          type="text"
          class="form-control"
          placeholder="Tìm kiếm theo tên..."
        />
        <input
          v-model="idFilter"
          @input="fetchStatuses"
          type="number"
          min="1"
          class="form-control"
          placeholder="Tìm theo ID..."
        />
      </div>
      <button class="btn btn-primary" @click="goAdd">+ Thêm Status</button>
    </div>

    <!-- 🧾 Bảng -->
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Tên trạng thái</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="status in statuses" :key="status.id">
          <td>{{ status.id }}</td>
          <td>{{ status.name }}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning me-2" @click="goEdit(status.id)">
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="confirmDelete(status.id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Không có dữ liệu -->
    <div v-if="statuses.length === 0" class="text-center text-muted mt-3">
      Không có trạng thái nào.
    </div>

    <!-- 📄 Phân trang -->
    <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-3">
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
import axios from '@/composables/axios'

const router = useRouter()
const statuses = ref([])

const keyword = ref('')
const idFilter = ref(null)

const currentPage = ref(0)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = 5

// 🧩 Lấy danh sách Status
const fetchStatuses = async (page = currentPage.value) => {
  try {
    const res = await axios.get('/api/status', {
      params: {
        keyword: keyword.value,
        id: idFilter.value,
        page,
        size: pageSize
      }
    })
    statuses.value = res.data.data || res.data.content || []
    totalPages.value = res.data.totalPages || 1
    totalItems.value = res.data.totalItems || statuses.value.length
    currentPage.value = res.data.currentPage || 0
  } catch (err) {
    console.error('❌ Lỗi khi tải status:', err)
  }
}

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchStatuses(page)
  }
}

const goAdd = () => router.push('/status/add')
const goEdit = (id) => router.push(`/status/edit/${id}`)

const confirmDelete = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa status này không?')) return
  try {
    await axios.delete(`/api/status/${id}`)
    await fetchStatuses(currentPage.value)
    alert('✅ Xóa thành công!')
  } catch (err) {
    console.error('❌ Lỗi khi xóa:', err)
    alert('Xóa thất bại!')
  }
}

onMounted(fetchStatuses)
</script>

<style scoped>
.card {
  border-radius: 10px;
}
</style>
