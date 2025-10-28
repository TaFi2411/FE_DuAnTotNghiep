<template>
  <div class="p-3">
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
              class="btn btn-outline-primary btn-sm"
              @click="updateCategory(props.row.id)"
              title="Sửa danh mục"
            >
              <i class="bi bi-pencil"></i>
            </button>

            <button
              class="btn btn-outline-success btn-sm"
              @click="addCategory"
              title="Thêm danh mục mới"
            >
              <i class="bi bi-plus-circle"></i>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/composables/axios.js'
import Swal from 'sweetalert2'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import router from '@/router'

const categories = ref([])
const loading = ref(false)

const columns = ref([
  { label: 'ID', field: 'id', sortable: true, width: '80px' },
  { label: 'Slug', field: 'slug', sortable: true },
  { label: 'Tên danh mục', field: 'name', sortable: true },
  { label: 'Trạng thái', field: 'status', width: '150px' },
  { label: 'Hành động', field: 'actions', width: '160px' },
])

// ✅ Phân trang xử lý phía frontend
const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: 'Trang sau',
  prevLabel: 'Trang trước',
})

// 📡 Lấy toàn bộ danh mục (ví dụ 1000 dòng)
const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/category', {
      params: { page: 0, size: 1000 }, // ⚡ Lấy tối đa 1000 danh mục
    })

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

const updateCategory = (id) => {
  router.push(`/admin/category/update/${id}`)
}

const addCategory = () => {
  router.push('/admin/categories/add')
}

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
