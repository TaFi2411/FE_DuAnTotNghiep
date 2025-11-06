<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Quản lý Flash Sale</h3>
      <button class="btn btn-outline-primary" @click="goToFlashSaleSku">
        <i class="bi bi-lightning-charge"></i> Quản lý Flash Sale SKU
      </button>
    </div>

    <!-- Form thêm/sửa -->
    <div class="card mb-4">
      <div class="card-header fw-bold">
        {{ editMode ? `Cập nhật Flash Sale #${editId}` : "Tạo Flash Sale mới" }}
      </div>
      <div class="card-body">
        <form @submit.prevent="editMode ? updateFlashSale() : createFlashSale()">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Tiêu đề</label>
              <input v-model="form.title" type="text" class="form-control" />
              <small class="text-danger" v-if="errors.title">{{ errors.title }}</small>
            </div>

            <div class="col-md-2 mb-3">
              <label class="form-label">Giảm giá (%)</label>
              <input v-model.number="form.discount" type="number" class="form-control" />
              <small class="text-danger" v-if="errors.discount">{{ errors.discount }}</small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Ngày bắt đầu</label>
              <input v-model="form.started_date" type="datetime-local" class="form-control" />
              <small class="text-danger" v-if="errors.started_date">{{ errors.started_date }}</small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Ngày kết thúc</label>
              <input v-model="form.ended_date" type="datetime-local" class="form-control" />
              <small class="text-danger" v-if="errors.ended_date">{{ errors.ended_date }}</small>
            </div>
          </div>

          <div class="form-check mb-3">
            <input v-model="form.active" type="checkbox" class="form-check-input" id="activeCheck" />
            <label class="form-check-label" for="activeCheck">Kích hoạt</label>
          </div>

          <button type="submit" class="btn btn-primary me-2">
            {{ editMode ? "Cập nhật" : "Tạo mới" }}
          </button>
          <button v-if="editMode" @click="cancelEdit" type="button" class="btn btn-secondary">
            Hủy
          </button>
        </form>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <!-- Bảng danh sách -->
    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="flashSales"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm Flash Sale...' }"
        theme="polar-bear"
      >
        <template #table-row="props">
          <!-- Cột trạng thái -->
          <span v-if="props.column.field === 'status'">
            <span class="badge" :class="getStatusClass(props.row)">
              {{ getStatusLabel(props.row) }}
            </span>
          </span>

          <!-- Cột hành động -->
          <span v-else-if="props.column.field === 'actions'">
            <button
              class="btn btn-outline-warning btn-sm me-1"
              @click="editSale(props.row)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="confirmDelete(props.row.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </span>

          <!-- Cột ngày -->
          <span
            v-else-if="['created_date', 'started_date', 'ended_date'].includes(props.column.field)"
          >
            {{ formatDateTime(props.row[props.column.field]) }}
          </span>

          <!-- Cột mặc định -->
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from '@/composables/axios.js'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import 'vue-good-table-next/dist/vue-good-table-next.css'

const router = useRouter()
const flashSales = ref([])
const loading = ref(false)
const editMode = ref(false)
const editId = ref(null)

const form = reactive({
  title: '',
  discount: 0,
  started_date: '',
  ended_date: '',
  active: false
})

const errors = reactive({})

// 🧩 Cột hiển thị
const columns = ref([
  { label: 'ID', field: 'id', width: '80px', sortable: true },
  { label: 'Tiêu đề', field: 'title', sortable: true },
  { label: 'Giảm giá (%)', field: 'discount', width: '100px' },
  { label: 'Ngày tạo', field: 'created_date', width: '160px' },
  { label: 'Ngày bắt đầu', field: 'started_date', width: '160px' },
  { label: 'Ngày kết thúc', field: 'ended_date', width: '160px' },
  { label: 'Trạng thái', field: 'status', width: '120px' },
  { label: 'Hành động', field: 'actions', width: '130px' }
])

// 🧭 Phân trang frontend
const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: 'Trang sau',
  prevLabel: 'Trang trước'
})

// 📡 Fetch dữ liệu
const fetchFlashSales = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/flash-sale', {
      params: { page: 0, size: 1000 }
    })
    const data = res.data.data || res.data.content || res.data || []
    flashSales.value = data.sort((a, b) => b.id - a.id)
  } catch (err) {
    console.error('❌ Lỗi tải Flash Sale:', err)
    Swal.fire('Lỗi', 'Không thể tải danh sách Flash Sale!', 'error')
  } finally {
    loading.value = false
  }
}

// 📆 Định dạng thời gian
const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
}

// ⚡ Trạng thái hiển thị
const isActiveNow = (sale) => {
  const now = new Date()
  const start = new Date(sale.started_date)
  const end = new Date(sale.ended_date)
  return now >= start && now <= end
}

const getStatusLabel = (sale) => {
  if (!sale.active) return 'Ngưng'
  if (isActiveNow(sale)) return 'Đang hoạt động'
  if (new Date() < new Date(sale.started_date)) return 'Chưa bắt đầu'
  return 'Ngưng'
}

const getStatusClass = (sale) => {
  if (!sale.active) return 'bg-secondary'
  if (isActiveNow(sale)) return 'bg-success'
  if (new Date() < new Date(sale.started_date)) return 'bg-warning'
  return 'bg-secondary'
}

// 🧱 CRUD
const goToFlashSaleSku = () => router.push('/admin/flash-sale-sku')

const clearErrors = () => {
  for (let key in errors) errors[key] = ''
}

const validateForm = () => {
  clearErrors()
  let valid = true
  if (!form.title) {
    errors.title = 'Tiêu đề không được để trống'
    valid = false
  }
  if (form.discount < 0 || form.discount > 100) {
    errors.discount = 'Giảm giá phải từ 0–100'
    valid = false
  }
  if (!form.started_date) {
    errors.started_date = 'Ngày bắt đầu không được để trống'
    valid = false
  }
  if (!form.ended_date) {
    errors.ended_date = 'Ngày kết thúc không được để trống'
    valid = false
  } else if (new Date(form.ended_date) <= new Date(form.started_date)) {
    errors.ended_date = 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
    valid = false
  }
  return valid
}

const formatDateToServer = (dateString) => {
  if (!dateString) return null
  const localDate = new Date(dateString)
  const vnDate = new Date(localDate.getTime() + 7 * 3600 * 1000)
  return vnDate.toISOString().slice(0, 19).replace('T', ' ')
}

const createFlashSale = async () => {
  if (!validateForm()) return
  const body = {
    ...form,
    started_date: formatDateToServer(form.started_date),
    ended_date: formatDateToServer(form.ended_date)
  }
  try {
    await axios.post('/api/flash-sale', body)
    Swal.fire('Thành công', 'Thêm Flash Sale thành công!', 'success')
    fetchFlashSales()
    resetForm()
  } catch {
    Swal.fire('Lỗi', 'Không thể thêm Flash Sale!', 'error')
  }
}

const updateFlashSale = async () => {
  if (!validateForm()) return
  const body = {
    ...form,
    started_date: formatDateToServer(form.started_date),
    ended_date: formatDateToServer(form.ended_date)
  }
  try {
    await axios.put(`/api/flash-sale/${editId.value}`, body)
    Swal.fire('Thành công', 'Cập nhật thành công!', 'success')
    fetchFlashSales()
    resetForm()
  } catch {
    Swal.fire('Lỗi', 'Không thể cập nhật!', 'error')
  }
}

const confirmDelete = async (id) => {
  const confirm = await Swal.fire({
    title: 'Xóa Flash Sale?',
    text: 'Bạn có chắc chắn muốn xóa Flash Sale này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  })
  if (!confirm.isConfirmed) return

  try {
    await axios.delete(`/api/flash-sale/${id}`)
    Swal.fire('Đã xóa!', 'Flash Sale đã được xóa.', 'success')
    fetchFlashSales()
  } catch {
    Swal.fire('Lỗi', 'Không thể xóa Flash Sale!', 'error')
  }
}

const editSale = (sale) => {
  Object.assign(form, {
    title: sale.title,
    discount: sale.discount,
    started_date: sale.started_date ? sale.started_date.substring(0, 16) : '',
    ended_date: sale.ended_date ? sale.ended_date.substring(0, 16) : '',
    active: sale.active
  })
  editMode.value = true
  editId.value = sale.id
}

const cancelEdit = () => resetForm()

const resetForm = () => {
  Object.assign(form, {
    title: '',
    discount: 0,
    started_date: '',
    ended_date: '',
    active: false
  })
  editMode.value = false
  editId.value = null
}

// 🚀 Khi component mount
onMounted(fetchFlashSales)
</script>

<style scoped>
.p-3 {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.badge {
  font-size: 13px;
  padding: 5px 10px;
}

.btn {
  padding: 4px 8px;
  font-size: 13px;
}
</style>
