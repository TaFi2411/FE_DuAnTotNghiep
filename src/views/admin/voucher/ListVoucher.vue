<template>
<div class="container my-5">
   <div class="d-flex justify-content-between align-items-center mb-4">
<h2 class="mb-0 fw-bold">Danh sách Voucher</h2>

 
</div>

 </div>
    
    <div class="d-flex align-items-center mb-3">
      <input 
        v-model="keyword" 
        type="text" 
        class="form-control w-50" 
        placeholder="Tìm kiếm theo tiêu đề, mã voucher..."
        @keyup.enter="applySearch"
      />
      <button class="btn btn-primary ms-2 px-4" @click="applySearch">Tìm</button>
      
      <router-link to="add-voucher" class="btn btn-primary">
      <i class="bi bi-plus-circle me-2"></i>Thêm Voucher mới
      </router-link>
     
    </div>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="text-muted mt-2">Đang tải dữ liệu voucher...</p>
    </div>
    
    <div v-else-if="errorMessage" class="alert alert-danger">
      <p><strong>Đã xảy ra lỗi:</strong> {{ errorMessage }}</p>
      <button class="btn btn-primary" @click="fetchVouchers">Thử lại</button>
    </div>

    <div v-else-if="vouchers.length === 0" class="alert alert-info text-center">
      <p class="mb-0">Không có voucher nào để hiển thị. Hãy thêm voucher mới!</p>
    </div>

    <div v-else class="table-responsive shadow-sm rounded-3">
      <table class="table table-striped table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tiêu đề</th>
            <th scope="col">Mức giảm</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Loại Voucher</th>
            <th scope="col">Trạng thái</th>
            <th scope="col" class="text-end">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(voucher, index) in vouchers" :key="voucher.id">
            <td>{{ (page * size) + index + 1 }}</td>
            
            <td>
              <strong>{{ voucher.title }}</strong><br>
              <small class="text-muted">Mã: {{ voucher.code }}</small>
            </td>

            <td class="text-danger fw-semibold">{{ voucher.discount }} %</td>

            <td>{{ voucher.quantity }}</td>

            <td>
              <span :class="['badge', voucher.type ? 'bg-info-subtle text-info-emphasis' : 'bg-warning-subtle text-warning-emphasis']">
                {{ voucher.type ? 'Sản Phẩm' : 'Vận Chuyển' }}
              </span>
            </td>

            <td>
              <span :class="['badge', voucher.active ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis']">
                {{ voucher.active ? 'Kích hoạt' : 'Vô hiệu hóa' }}
              </span>
            </td>

            <td class="text-end">
                <button class="btn btn-outline-secondary btn-sm me-2" @click="viewVoucher(voucher.id)" title="Xem chi tiết">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-primary btn-sm me-2" @click="editVoucher(voucher.id)" title="Sửa">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="deleteVoucher(voucher.id)" title="Xóa">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center p-3" v-if="totalPages > 1">
        <button 
          class="btn btn-outline-secondary" 
          :disabled="page === 0" 
          @click="changePage(page - 1)"
        >
          ← Trang trước
        </button>
        <span>Trang {{ page + 1 }} / {{ totalPages }}</span>
        <button 
          class="btn btn-outline-secondary" 
          :disabled="page >= totalPages - 1" 
          @click="changePage(page + 1)"
        >
          Trang sau →
        </button>
      </div>
    </div>

    <VoucherDetailModal
      v-if="isModalVisible"
      :voucher-id="selectedVoucherId"
      @close="closeModal"
    />

 
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/axios.js';
import VoucherDetailModal from '@/components/admin/VoucherDetailModal.vue'; 

const router = useRouter();
const vouchers = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const keyword = ref('');
const page = ref(0);
const size = ref(5);
const totalPages = ref(0);

const isModalVisible = ref(false);
const selectedVoucherId = ref(null);

const fetchVouchers = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const response = await apiClient.get('/api/voucher', {
      params: {
        page: page.value,
        size: size.value,
        keyword: keyword.value || ''
      }
    });
    const data = response.data;
    vouchers.value = data.data; 
    totalPages.value = data.totalPages;
  } catch (error) {
    console.error("Lỗi khi tải danh sách voucher:", error);
    errorMessage.value = "Không thể tải được dữ liệu. Vui lòng thử lại.";
  } finally {
    isLoading.value = false;
  }
};

const applySearch = () => {
  page.value = 0;
  fetchVouchers();
};

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    page.value = newPage;
    fetchVouchers();
  }
};

const viewVoucher = (id) => {
  selectedVoucherId.value = id;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  selectedVoucherId.value = null;
};

const editVoucher = (id) => {
  router.push({ name: 'VoucherUpdate', params: { id } });
};

const deleteVoucher = async (id) => {
  if (confirm(`Bạn có chắc chắn muốn xóa voucher có ID: ${id} không?`)) {
    try {
      await apiClient.delete(`/api/voucher/${id}`);
      alert('Xóa voucher thành công!');
      if (vouchers.value.length === 1 && page.value > 0) {
        page.value--;
      }
      fetchVouchers();
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
      alert(`Xóa thất bại: ${error.message}`);
    }
  }
};

onMounted(fetchVouchers);
</script>

<style scoped>
.table thead th {
  font-weight: 600;
}
.btn-sm i {
  font-size: 0.9rem;
}
.badge {
  padding: 0.5em 0.75em;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>