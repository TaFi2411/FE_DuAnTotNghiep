<template>
  <div class="p-3">
    <!-- 🟢 Tiêu đề và nút thêm -->
   <div class="d-flex justify-content-between align-items-center mb-3">
  <h3 class="mb-0 fw-normal">Danh sách Category</h3>
  <button class="add-voucher-btn" @click="addCategory">
    <i class="bi bi-plus-lg"></i> Thêm danh mục
  </button>
</div>


    <!-- 🔄 Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>

    <!-- 📋 Bảng dữ liệu -->
    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="categories"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm danh mục...' }"
        theme="polar-bear"
      >
        <template #table-row="props">
          <!-- 🟢 Trạng thái -->
          <span v-if="props.column.field === 'status'">
            <span :class="['badge', props.row.status ? 'bg-success' : 'bg-secondary']">
              {{ props.row.status ? 'Hoạt động' : 'Ẩn' }}
            </span>
          </span>

          <!-- ⚙️ Hành động -->
          <span v-else-if="props.column.field === 'actions'">
            <div class="d-flex justify-content-center gap-1">
              <button
                class="btn btn-outline-warning btn-sm"
                @click="editCategory(props.row.id)"
                title="Sửa danh mục"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <button
                class="btn btn-outline-danger btn-sm"
                @click="confirmDelete(props.row.id)"
                title="Xóa danh mục"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </span>

          <!-- 🔤 Các cột khác -->
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/composables/axios.js'
import Swal from 'sweetalert2'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([])
const loading = ref(false)

const columns = ref([
  { label: 'ID', field: 'id', sortable: true, width: '80px' },
  { label: 'Tên danh mục', field: 'name', sortable: true },
  { label: 'Slug', field: 'slug', sortable: true },
  { label: 'Trạng thái', field: 'status', width: '150px' },
  { label: 'Hành động', field: 'actions', width: '120px' },
])

const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: 'Trang sau',
  prevLabel: 'Trang trước',
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/category', { params: { page: 0, size: 1000 } })
    categories.value = Array.isArray(res.data.data)
      ? res.data.data
      : res.data.content || res.data || []
  } catch (err) {
    console.error('❌ Lỗi tải danh mục:', err)
    Swal.fire('Lỗi', 'Không thể tải danh mục!', 'error')
  } finally {
    loading.value = false
  }
}

/* 🟢 Điều hướng */
const addCategory = () => router.push('/admin/categories/add')
const editCategory = (id) => router.push(`/admin/categories/update/${id}`)

/* 🗑️ Xóa */
const confirmDelete = async (id) => {
  const confirm = await Swal.fire({
    title: 'Xóa danh mục?',
    text: 'Bạn có chắc chắn muốn xóa không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  })
  if (!confirm.isConfirmed) return
  await deleteCategory(id)
}

const deleteCategory = async (id) => {
  try {
    await axios.delete(`/api/category/${id}`)
    Swal.fire('Đã xóa!', 'Danh mục đã bị xóa.', 'success')
    fetchCategories()
  } catch (err) {
    console.error('❌ Lỗi xoá danh mục:', err)
    Swal.fire('Lỗi', 'Không thể xóa danh mục!', 'error')
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
/* ✅ Tiêu đề */
h3 {
  font-size: 18px;
  font-weight: 400;
  color: #333;
}

/* ✅ Nút thêm voucher */
.add-voucher-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 400;
  font-size: 13px;
  padding: 5px 12px;
  border: 1px solid #198754;
  border-radius: 6px;
  background-color: #fff;
  color: #198754;
  height: 32px;
  line-height: 1;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.add-voucher-btn i {
  font-size: 13px;
  line-height: 1;
}

.add-voucher-btn:hover {
  background-color: #198754;
  color: #fff;
  box-shadow: 0 2px 5px rgba(25, 135, 84, 0.25);
  transform: translateY(-1px);
}

.add-voucher-btn:focus,
.add-voucher-btn:active,
.add-voucher-btn:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* ✅ Nút trong bảng */
.btn-sm {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 5px;
}
</style>


