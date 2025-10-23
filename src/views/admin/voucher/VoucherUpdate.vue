<template>
  <div class="container my-5">
    <div class="mb-4">
      <h2 class="fw-bold">Cập nhật Voucher</h2>
    </div>

    <div v-if="isLoading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải dữ liệu...</span>
      </div>
      <p class="mt-3 text-muted">Đang tải dữ liệu voucher...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger">
      <h4 class="alert-heading">Đã xảy ra lỗi!</h4>
      <p>{{ errorMessage }}</p>
      <hr />
      <router-link :to="{ name: 'VoucherList' }" class="btn btn-primary">Quay lại danh sách</router-link>
    </div>

    <div v-else-if="voucher" class="card border-0 shadow-sm rounded-4">
      <div class="card-body p-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="title" class="form-label fw-semibold">Tiêu đề Voucher</label>
            <input type="text" id="title" class="form-control" v-model="voucher.title" placeholder="Ví dụ: Giảm giá mừng lễ 30/4" required />
          </div>

          <div class="mb-3">
            <label for="code" class="form-label fw-semibold">Mã Voucher</label>
            <input type="text" id="code" class="form-control" v-model="voucher.code" readonly disabled />
            <small class="form-text text-muted">Mã voucher không thể thay đổi.</small>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label fw-semibold">Mô tả</label>
            <textarea id="description" class="form-control" v-model="voucher.description" rows="3"></textarea>
          </div>

          <hr class="my-4" />

          <div class="mb-3">
            <label class="form-label fw-semibold">Loại Voucher</label>
            <div class="d-flex gap-4">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="typeProduct" :value="true" v-model="voucher.type" />
                <label class="form-check-label" for="typeProduct">Sản phẩm</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="typeShipping" :value="false" v-model="voucher.type" />
                <label class="form-check-label" for="typeShipping">Vận chuyển</label>
              </div>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <label for="discount" class="form-label fw-semibold">Giảm theo phần trăm</label>
              <div class="input-group">
                <input type="number" id="discount" class="form-control" v-model="voucher.discount" min="0" max="100" placeholder="Nhập số %" required />
                <span class="input-group-text">%</span>
              </div>
            </div>
            <div class="col-md-6">
              <label for="discount_max" class="form-label fw-semibold">Giảm tối đa</label>
              <div class="input-group">
                <input type="number" id="discount_max" class="form-control" v-model="voucher.discount_max" min="0" placeholder="Nhập số tiền" />
                <span class="input-group-text">VND</span>
              </div>
            </div>
          </div>

          <hr class="my-4" />

          <div class="row g-3">
            <div class="col-md-6">
              <label for="quantity" class="form-label fw-semibold">Số lượng</label>
              <input type="number" id="quantity" class="form-control" v-model="voucher.quantity" min="0" required />
            </div>
            <div class="col-md-6">
              <label for="usage_condition" class="form-label fw-semibold">Điều kiện sử dụng (đơn tối thiểu)</label>
              <div class="input-group">
                <input type="number" id="usage_condition" class="form-control" v-model="voucher.usage_condition" min="0" placeholder="Bỏ trống nếu không có" />
                <span class="input-group-text">VND</span>
              </div>
            </div>
          </div>

          <div class="row g-3 mt-3">
            <div class="col-md-6">
              <label for="started_date" class="form-label fw-semibold">Ngày bắt đầu</label>
              <input type="datetime-local" id="started_date" class="form-control" v-model="voucher.started_date" required />
            </div>
            <div class="col-md-6">
              <label for="ended_date" class="form-label fw-semibold">Ngày kết thúc</label>
              <input type="datetime-local" id="ended_date" class="form-control" v-model="voucher.ended_date" required />
            </div>
          </div>

          <div class="form-check form-switch mt-4">
            <input class="form-check-input" type="checkbox" role="switch" id="active" v-model="voucher.active" />
            <label class="form-check-label fw-semibold" for="active">Kích hoạt voucher</label>
          </div>

          <div v-if="submitError" class="alert alert-danger mt-4">
            {{ submitError }}
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="submit" class="btn btn-success rounded-pill px-4" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span role="status">{{ isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/composables/axios.js';

const router = useRouter();
const route = useRoute();
const voucherId = route.params.id;

const voucher = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);
const isSubmitting = ref(false);
const submitError = ref(null);

/**
 * ✅ CHUẨN: Luôn hiển thị giờ Việt Nam (GMT+7) trên input.
 * Chuyển đổi chuỗi ISO UTC từ server thành chuỗi YYYY-MM-DDTHH:mm theo giờ VN.
 */
const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const vietnamOffsetMillis = 7 * 60 * 60 * 1000;
  const vietnamDate = new Date(date.getTime() + vietnamOffsetMillis);
  return vietnamDate.toISOString().slice(0, 16);
};

/**
 * ✅ CHUẨN: Luôn gửi đi giờ Việt Nam (GMT+7) dưới dạng UTC.
 */
function formatDateToUTC(localDateTimeString) {
  if (!localDateTimeString) return null;
  const dateWithTimezone = new Date(`${localDateTimeString}+07:00`);
  return dateWithTimezone.toISOString();
}

const fetchVoucherData = async () => {
  try {
    const response = await apiClient.get(`/api/voucher/${voucherId}`);
    const data = response.data;
    data.started_date = formatDateForInput(data.started_date);
    data.ended_date = formatDateForInput(data.ended_date);
    voucher.value = data;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu voucher:", error);
    errorMessage.value = "Không tìm thấy voucher hoặc đã có lỗi xảy ra.";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitError.value = null;

  try {
    if (new Date(voucher.value.ended_date) <= new Date(voucher.value.started_date)) {
        submitError.value = "Ngày kết thúc phải sau ngày bắt đầu!";
        isSubmitting.value = false;
        return;
    }
    const payload = { ...voucher.value };
    // Sử dụng hàm chuẩn để gửi đi
    payload.started_date = formatDateToUTC(payload.started_date);
    payload.ended_date = formatDateToUTC(payload.ended_date);
    
    delete payload.id;
    delete payload.created_date;
    
    await apiClient.put(`/api/voucher/${voucherId}`, payload);

    alert('🎉 Cập nhật voucher thành công!');
    router.push({ name: 'VoucherList' }); // Điều hướng về danh sách

  } catch (error) {
    console.error("Lỗi khi cập nhật voucher:", error);
    submitError.value = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchVoucherData);
</script>

<style scoped>
.form-check-input:checked {
  background-color: #198754; /* Màu xanh lá cho form update */
  border-color: #198754;
}
</style>