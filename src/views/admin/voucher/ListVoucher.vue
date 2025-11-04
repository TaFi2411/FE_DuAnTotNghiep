<template>
  <div class="voucher-page p-3">
    <!-- ✅ Header -->
    <div class="header-bar">
      <h3 class="page-title mb-0">Danh sách Voucher</h3>
      <button class="add-voucher-btn" @click="addVoucher">
        <i class="bi bi-plus-lg"></i> Thêm voucher
      </button>
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
      <vue-good-table
        :columns="columns"
        :rows="vouchers"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm voucher...' }"
        theme="polar-bear"
      >
        <template #table-row="props">
          <!-- 🏷️ Tiêu đề + mã -->
          <span v-if="props.column.field === 'title'">
            <strong>{{ props.row.title }}</strong><br />
            <small class="text-muted">Mã: {{ props.row.code }}</small>
          </span>

          <!-- 💰 Giảm giá -->
          <span v-else-if="props.column.field === 'discount'">
            <span class="text-danger fw-bold">{{ props.row.discount }}%</span>
          </span>

          <!-- 🧩 Loại -->
          <span v-else-if="props.column.field === 'type'">
            <span
              class="badge"
              :class="props.row.type ? 'bg-info' : 'bg-warning text-dark'"
            >
              {{ props.row.type ? 'Sản phẩm' : 'Vận chuyển' }}
            </span>
          </span>

          <!-- ⚙️ Trạng thái -->
          <span v-else-if="props.column.field === 'active'">
            <span
              class="badge"
              :class="props.row.active ? 'bg-success' : 'bg-danger'"
            >
              {{ props.row.active ? 'Kích hoạt' : 'Vô hiệu hóa' }}
            </span>
          </span>

          <!-- 🔧 Hành động -->
          <span v-else-if="props.column.field === 'actions'">
            <div class="d-flex justify-content-center gap-1">
              <button
                class="btn btn-outline-secondary btn-sm"
                @click="viewVoucher(props.row.id)"
                title="Xem chi tiết"
              >
                <i class="bi bi-eye"></i>
              </button>

              <button
                class="btn btn-outline-primary btn-sm"
                @click="editVoucher(props.row.id)"
                title="Sửa"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <button
                class="btn btn-outline-danger btn-sm"
                @click="deleteVoucher(props.row.id)"
                title="Xóa"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </span>

          <!-- Mặc định -->
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
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
import VoucherDetailModal from '@/components/admin/VoucherDetailModal.vue'
import 'vue-good-table-next/dist/vue-good-table-next.css'

const router = useRouter()

const vouchers = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)
const isModalVisible = ref(false)
const selectedVoucherId = ref(null)

const columns = [
  { label: 'Tiêu đề', field: 'title', sortable: true },
  { label: 'Giảm (%)', field: 'discount', sortable: true },
  { label: 'Số lượng', field: 'quantity', sortable: true },
  { label: 'Loại', field: 'type' },
  { label: 'Trạng thái', field: 'active' },
  { label: 'Hành động', field: 'actions', sortable: false, width: '140px' },
]

const paginationOptions = {
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: 'Trang sau',
  prevLabel: 'Trang trước',
}

const fetchVouchers = async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    const res = await apiClient.get('/api/voucher', {
      params: { page: 0, size: 1000 },
    })
    vouchers.value = res.data.data || res.data.content || []
  } catch (err) {
    console.error('❌ Lỗi tải voucher:', err)
    errorMessage.value = 'Không thể tải dữ liệu voucher.'
  } finally {
    isLoading.value = false
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

const addVoucher = () => {
  router.push({ name: 'VoucherAdd' })
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
.voucher-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

/* ✅ Header fix chính xác */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* ✅ Nút thêm voucher */
/* ✅ Nút thêm voucher — nhỏ gọn hơn */
.add-voucher-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  padding: 4px 10px;
  border: 1px solid #198754;
  border-radius: 5px;
  background-color: #fff;
  color: #198754;
  height: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-voucher-btn i {
  font-size: 12px;
}

.add-voucher-btn:hover {
  background-color: #198754;
  color: #fff;
  box-shadow: 0 2px 4px rgba(25, 135, 84, 0.2);
  transform: translateY(-1px);
}


/* Nút hành động nhỏ trong bảng */
.d-flex button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.d-flex i {
  font-size: 14px;
}
</style>
