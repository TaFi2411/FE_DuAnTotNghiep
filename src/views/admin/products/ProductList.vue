<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Danh sách sản phẩm</h3>
      <button class="btn btn-outline-success" @click="goToAddProduct">
        <i class="bi bi-plus-lg"></i> Thêm sản phẩm
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <!-- Bảng -->
    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="products"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm sản phẩm...' }"
        theme="polar-bear"
      >
        <template #table-row="props">
          <!-- Cột ảnh -->
          <span v-if="props.column.field === 'image'">
            <img
              :src="props.row.image"
              class="rounded"
              style="width: 60px; height: 60px; object-fit: cover;"
              alt="Ảnh sản phẩm"
            />
          </span>

          <!-- Cột trạng thái -->
          <span v-else-if="props.column.field === 'status'">
            <span class="badge">
              {{ props.row.status ? 'Đang bán' : 'Ngừng bán' }}
            </span>
          </span>

          <!-- Cột số biến thể -->
          <span v-else-if="props.column.field === 'skus'">
            {{ props.row.skus?.length || 0 }} biến thể
          </span>

          <!-- Cột hành động -->
          <span v-else-if="props.column.field === 'actions'">
            <button
              class="btn btn-outline-primary btn-sm me-1"
              @click="viewDetail(props.row.id)"
            >
              <i class="bi bi-eye"></i>
            </button>
            <button
              class="btn btn-outline-warning btn-sm me-1"
              @click="editProduct(props.row.id)"
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
import { ref, onMounted } from 'vue'
import axios from '@/composables/axios.js'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import 'vue-good-table-next/dist/vue-good-table-next.css'

const router = useRouter()
const products = ref([])
const loading = ref(false)

// 🧩 Cấu hình cột
const columns = ref([
  { label: 'Ảnh', field: 'image', width: '100px' },
  { label: 'Tên sản phẩm', field: 'name', sortable: true },
  { label: 'Danh mục', field: 'categoryName', sortable: true },
  { label: 'Trạng thái', field: 'status', width: '120px' },
  { label: 'Biến thể', field: 'skus', width: '120px' },
  { label: 'Hành động', field: 'actions', width: '130px' },
])

// 🧭 Phân trang ở frontend
const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: 'Trang sau',
  prevLabel: 'Trang trước',
})

// 📡 Lấy toàn bộ dữ liệu (ví dụ tối đa 1000 bản ghi)
const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/product', {
      params: {
        page: 0,
        size: 1000, // ⚡ lấy tối đa 1000 sản phẩm
      },
    })
     // Lấy dữ liệu
    let data = res.data.data || res.data.content || res.data || []

    // Sắp xếp giảm dần theo id
    products.value = data.sort((a, b) => b.id - a.id)
  } catch (err) {
    console.error('❌ Lỗi tải sản phẩm:', err)
    Swal.fire('Lỗi', 'Không thể tải danh sách sản phẩm!', 'error')
  } finally {
    loading.value = false
  }
}

// 📦 Hành động
const goToAddProduct = () => router.push('/admin/product/create')
const viewDetail = (id) => router.push(`/admin/product-detail/${id}`)
const editProduct = (id) => router.push(`/admin/product/update/${id}`)

const confirmDelete = async (id) => {
  const confirm = await Swal.fire({
    title: 'Xóa sản phẩm?',
    text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  })
  if (!confirm.isConfirmed) return

  try {
    await axios.delete(`/api/product/${id}`)
    Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa.', 'success')
    fetchProducts()
  } catch (err) {
    console.error('❌ Lỗi xóa sản phẩm:', err)
    Swal.fire('Lỗi', 'Không thể xóa sản phẩm!', 'error')
  }
}

// 🚀 Khi component mount
onMounted(fetchProducts)
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
