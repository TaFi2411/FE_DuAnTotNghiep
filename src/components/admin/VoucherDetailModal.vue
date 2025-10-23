<template>
  <div class="modal-backdrop fade show"></div>
  
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">Chi tiết Voucher</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <div v-if="isLoading" class="text-center p-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>

          <div v-else-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div v-else-if="voucher" class="details-grid">
            <dt>ID</dt>
            <dd>{{ voucher.id }}</dd>

            <dt>Tiêu đề</dt>
            <dd>{{ voucher.title }}</dd>

            <dt>Mã Voucher</dt>
            <dd><span class="badge bg-secondary">{{ voucher.code }}</span></dd>
            
            <dt>Mức giảm</dt>
            <dd class="text-danger fw-bold">{{ formatDiscount(voucher.discount, voucher.type) }}</dd>

            <dt>Số lượng</dt>
            <dd>{{ voucher.quantity }}</dd>

            <dt>Loại Voucher</dt>
            <dd>
              <span :class="['badge', voucher.type ? 'bg-info-subtle text-info-emphasis' : 'bg-warning-subtle text-warning-emphasis']">
                {{ voucher.type ? 'Sản Phẩm' : 'Vận Chuyển' }}
              </span>
            </dd>

            <dt>Trạng thái</dt>
            <dd>
              <span :class="['badge', voucher.active ? 'bg-success' : 'bg-danger']">
                {{ voucher.active ? 'Kích hoạt' : 'Vô hiệu hóa' }}
              </span>
            </dd>

            <dt>Ngày tạo</dt>
            <dd>{{ voucher.created_date }}</dd>
            
            <dt>Ngày bắt đầu</dt>
            <dd>{{ voucher.started_date}}</dd>

            <dt>Ngày kết thúc</dt>
            <dd>{{ voucher.ended_date}}</dd>

            <dt>Điều kiện hóa đơn trên</dt>
            <dd>{{ voucher.usage_condition}}</dd>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-dark rounded-pill px-4" @click="closeModal">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
import apiClient from '@/composables/axios.js';

// Props để nhận voucherId từ component cha
const props = defineProps({
  voucherId: {
    type: [Number, String],
    required: true,
  },
});

// Emit sự kiện 'close' để báo cho component cha đóng modal
const emit = defineEmits(['close']);

const voucher = ref(null);
const isLoading = ref(false);
const error = ref(null);

const fetchVoucherDetails = async (id) => {
  isLoading.value = true;
  error.value = null;
  voucher.value = null;
  try {
    const response = await apiClient.get(`/api/voucher/${id}`);
    voucher.value = response.data;
  } catch (err) {
    console.error("Lỗi khi fetch chi tiết voucher:", err);
    error.value = "Không thể tải được chi tiết voucher. Vui lòng thử lại.";
  } finally {
    isLoading.value = false;
  }
};

// Theo dõi sự thay đổi của props.voucherId và gọi API
watch(() => props.voucherId, (newId) => {
  if (newId) {
    fetchVoucherDetails(newId);
  }
}, { immediate: true }); // immediate: true để gọi ngay lần đầu tiên

const closeModal = () => {
  emit('close');
};

const formatDiscount = (value, type) => {
  if (type) { // Giảm theo %
    return `${value}%`;
  }
  // Giảm theo tiền cố định
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('vi-VN');
};

</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5;
}
.details-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 20px;
}
.details-grid dt {
  font-weight: 600;
  color: #555;
}
.details-grid dd {
  margin-bottom: 0;
}
</style>