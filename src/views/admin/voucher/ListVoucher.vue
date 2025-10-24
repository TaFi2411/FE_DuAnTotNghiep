<template>
  <div class="container mt-4">
    <h3 class="mb-3 fw-bold text-center">Danh sách Voucher</h3>

    <!-- 🔍 Ô tìm kiếm -->
    <div class="d-flex align-items-center mb-3 justify-content-center gap-2">
      <input
        v-model="keyword"
        type="text"
        class="form-control w-50"
        placeholder="Tìm kiếm theo tiêu đề hoặc mã voucher..."
        @keyup.enter="applySearch"
      />
      <button class="btn btn-primary px-4" @click="applySearch">Tìm</button>

      <router-link to="add-voucher" class="btn btn-success ms-3">
        <i class="bi bi-plus-circle me-2"></i>Thêm Voucher mới
      </router-link>
    </div>

    <!-- 🌀 Loading -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2">Đang tải dữ liệu voucher...</p>
    </div>

    <!-- ⚠️ Lỗi -->
    <div v-else-if="errorMessage" class="alert alert-danger text-center">
      <p><strong>Lỗi:</strong> {{ errorMessage }}</p>
      <button class="btn btn-primary" @click="fetchVouchers">Thử lại</button>
    </div>

    <!-- ℹ️ Không có dữ liệu -->
    <div v-else-if="vouchers.length === 0" class="alert alert-info text-center">
      Không có voucher nào để hiển thị.
    </div>

    <!-- 🧾 Bảng voucher -->
    <div v-else>
      <Table :columns="columns" :rows="vouchers">
        <!-- Cột tiêu đề + mã -->
        <template #title="{ row }">
          <div>
            <strong>{{ row.title }}</strong><br />
            <small class="text-muted">Mã: {{ row.code }}</small>
          </div>
        </template>

        <!-- Cột mức giảm -->
        <template #discount="{ row }">
          <span class="text-danger fw-bold">{{ row.discount }}%</span>
        </template>

        <!-- Cột loại voucher -->
        <template #type="{ row }">
          <span
            class="badge"
            :class="row.type ? 'bg-info' : 'bg-warning text-dark'"
          >
            {{ row.type ? 'Sản phẩm' : 'Vận chuyển' }}
          </span>
        </template>

        <!-- Cột trạng thái -->
        <template #active="{ row }">
          <span
            class="badge"
            :class="row.active ? 'bg-success' : 'bg-danger'"
          >
            {{ row.active ? 'Kích hoạt' : 'Vô hiệu hóa' }}
          </span>
        </template>

        <!-- 🔧 Thao tác -->
        <template #actions="{ row }">
          <button
            class="btn btn-outline-secondary btn-sm me-2"
            @click="viewVoucher(row.id)"
            title="Xem chi tiết"
          >
            <i class="bi bi-eye"></i>
          </button>
          <button
            class="btn btn-outline-primary btn-sm me-2"
            @click="editVoucher(row.id)"
            title="Sửa"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            class="btn btn-outline-danger btn-sm"
            @click="deleteVoucher(row.id)"
            title="Xóa"
          >
            <i class="bi bi-trash"></i>
          </button>
        </template>
      </Table>

      <!-- 📄 Phân trang -->
      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 0 }">
            <button class="page-link" @click="changePage(page - 1)">«</button>
          </li>

          <li
            class="page-item"
            v-for="p in totalPages"
            :key="p"
            :class="{ active: page === p - 1 }"
          >
            <button class="page-link" @click="changePage(p - 1)">
              {{ p }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: page >= totalPages - 1 }">
            <button class="page-link" @click="changePage(page + 1)">»</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 🪟 Modal chi tiết -->
    <VoucherDetailModal
      v-if="isModalVisible"
      :voucher-id="selectedVoucherId"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/composables/axios.js'
import Table from '@/components/Table.vue'
import VoucherDetailModal from '@/components/admin/VoucherDetailModal.vue'

const router = useRouter()

const vouchers = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)
const keyword = ref('')
const page = ref(0)
const size = ref(5)
const totalPages = ref(0)
const isModalVisible = ref(false)
const selectedVoucherId = ref(null)

// 🧱 Cấu hình cột
const columns = [
  { label: 'Tiêu đề', field: 'title', slot: 'title' },
  { label: 'Giảm (%)', field: 'discount', slot: 'discount' },
  { label: 'Số lượng', field: 'quantity' },
  { label: 'Loại', field: 'type', slot: 'type' },
  { label: 'Trạng thái', field: 'active', slot: 'active' },
]

const fetchVouchers = async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    const res = await apiClient.get('/api/voucher', {
      params: {
        page: page.value,
        size: size.value,
        keyword: keyword.value || '',
      },
    })
    vouchers.value = res.data.data
    totalPages.value = res.data.totalPages
  } catch (err) {
    console.error('❌ Lỗi tải voucher:', err)
    errorMessage.value = 'Không thể tải dữ liệu voucher.'
  } finally {
    isLoading.value = false
  }
}

const applySearch = () => {
  page.value = 0
  fetchVouchers()
}

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    page.value = newPage
    fetchVouchers()
  }
}

const viewVoucher = (id) => {
  selectedVoucherId.value = id
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
  selectedVoucherId.value = null
}

const editVoucher = (id) => {
  router.push({ name: 'VoucherUpdate', params: { id } })
}

const deleteVoucher = async (id) => {
  if (!confirm(`Bạn có chắc muốn xóa voucher ID: ${id}?`)) return
  try {
    await apiClient.delete(`/api/voucher/${id}`)
    alert('✅ Xóa voucher thành công!')
    fetchVouchers()
  } catch (err) {
    console.error('❌ Lỗi khi xóa voucher:', err)
    alert('Xóa thất bại, vui lòng thử lại.')
  }
}

onMounted(fetchVouchers)
</script>

<style scoped>
.pagination .page-link {
  cursor: pointer;
}
</style>
