<template>
  <div class="container my-5">
    <div class="mb-4">
      <h2 class="fw-bold">Tạo Voucher mới</h2>
    </div>

    <div class="card border-0 shadow-sm rounded-4">
      <div class="card-body p-4">
        <form @submit.prevent="handleSubmit">
          <!-- Tiêu đề -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Tiêu đề Voucher</label>
            <input type="text" class="form-control" v-model="voucher.title" placeholder="Ví dụ: Giảm giá mừng lễ 30/4" />
            <small class="text-danger" v-if="v$.title.$error">
              <span v-if="v$.title.required.$invalid">Phải nhập tiêu đề</span>
              <span v-else-if="v$.title.minLength.$invalid">Tiêu đề ít nhất 3 ký tự</span>
            </small>
          </div>

          <!-- Mã Voucher -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Mã Voucher</label>
            <input type="text" class="form-control" v-model="voucher.code" readonly disabled />
          </div>

          <!-- Mô tả -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Mô tả</label>
            <textarea class="form-control" v-model="voucher.description" rows="3"></textarea>
            <small class="text-danger" v-if="v$.description.$error">
              <span v-if="v$.description.required.$invalid">Phải nhập mô tả</span>
              <span v-else-if="v$.description.minLength.$invalid">Mô tả ít nhất 10 ký tự</span>
            </small>
          </div>

          <hr class="my-4" />

          <!-- Loại Voucher -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Loại Voucher</label>
            <div class="d-flex gap-4">
              <div class="form-check">
                <input type="radio" class="form-check-input" :value="true" v-model="voucher.type" />
                <label class="form-check-label">Sản phẩm</label>
              </div>
              <div class="form-check">
                <input type="radio" class="form-check-input" :value="false" v-model="voucher.type" />
                <label class="form-check-label">Vận chuyển</label>
              </div>
            </div>
            <small class="text-danger" v-if="v$.type.$error">Phải chọn loại voucher</small>
          </div>

          <!-- Giảm giá & tối đa -->
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Giảm theo phần trăm</label>
              <input type="text" class="form-control" v-model="voucher.discount" placeholder="Nhập số %" />
              <small class="text-danger" v-if="v$.discount.$error">
                <span v-if="v$.discount.required.$invalid">Phải nhập giảm %</span>
                <span v-else-if="v$.discount.numeric.$invalid">Phải là số</span>
                <span v-else-if="v$.discount.positiveNumber.$invalid">Phải là số dương</span>
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Giảm tối đa</label>
              <input type="text" class="form-control" v-model="voucher.discount_max" placeholder="Nhập số tiền" />
              <small class="text-danger" v-if="v$.discount_max.$error">
                <span v-if="v$.discount_max.numeric.$invalid">Phải là số</span>
                <span v-else-if="v$.discount_max.positiveNumber.$invalid">Phải là số dương</span>
              </small>
            </div>
          </div>

          <hr class="my-4" />

          <!-- Số lượng & điều kiện -->
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Số lượng</label>
              <input type="text" class="form-control" v-model="voucher.quantity" placeholder="Nhập số lượng" />
              <small class="text-danger" v-if="v$.quantity.$error">
                <span v-if="v$.quantity.required.$invalid">Phải nhập số lượng</span>
                <span v-else-if="v$.quantity.numeric.$invalid">Phải là số</span>
                <span v-else-if="v$.quantity.positiveNumber.$invalid">Phải là số dương</span>
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Điều kiện sử dụng</label>
              <input type="text" class="form-control" v-model="voucher.usage_condition" placeholder="Bỏ trống nếu không có" />
              <small class="text-danger" v-if="v$.usage_condition.$error">
                <span v-if="v$.usage_condition.numeric.$invalid">Phải là số</span>
                <span v-else-if="v$.usage_condition.positiveNumber.$invalid">Phải là số dương</span>
              </small>
            </div>
          </div>

          <!-- Ngày bắt đầu & kết thúc -->
          <div class="row g-3 mt-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Ngày bắt đầu</label>
              <input type="datetime-local" class="form-control" v-model="voucher.started_date" />
              <small class="text-danger" v-if="v$.started_date.$error">
                <span v-if="v$.started_date.required.$invalid">Phải chọn ngày bắt đầu</span>
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Ngày kết thúc</label>
              <input type="datetime-local" class="form-control" v-model="voucher.ended_date" />
              <small class="text-danger" v-if="v$.ended_date.$error">
                <span v-if="v$.ended_date.required.$invalid">Phải chọn ngày kết thúc</span>
                <span v-else-if="v$.ended_date.afterStart.$invalid">Phải lớn hơn ngày bắt đầu</span>
              </small>
            </div>
          </div>

          <!-- Trạng thái -->
          <div class="form-check form-switch mt-4">
            <input type="checkbox" class="form-check-input" v-model="voucher.active" />
            <label class="form-check-label fw-semibold">Kích hoạt voucher</label>
          </div>

          <!-- Submit -->
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="submit" class="btn btn-primary rounded-pill px-4" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm"></span>
              <span>{{ isSubmitting ? 'Đang lưu...' : 'Lưu Voucher' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, numeric, helpers } from '@vuelidate/validators';
import Swal from 'sweetalert2';
import apiClient from '@/composables/axios.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSubmitting = ref(false);

const voucher = reactive({
  title: '',
  code: '',
  description: '',
  discount: '',
  discount_max: '',
  type: true,
  quantity: '',
  usage_condition: '',
  started_date: '',
  ended_date: '',
  active: true,
});

// ✅ Validator số dương cho text
const positiveNumber = helpers.withMessage('Phải là số dương', (value) => {
  if (value === '' || value === null || value === undefined) return true;
  return !isNaN(Number(value)) && Number(value) >= 0;
});

// ✅ Validator ngày kết thúc > ngày bắt đầu
const afterStart = helpers.withMessage('Phải lớn hơn ngày bắt đầu', (value) => {
  if (!value || !voucher.started_date) return false;
  return new Date(value) > new Date(voucher.started_date);
});

// Rules
const rules = {
  title: { required: helpers.withMessage('Phải nhập tiêu đề', required), minLength: minLength(3) },
  description: { required: helpers.withMessage('Phải nhập mô tả', required), minLength: minLength(10) },
  discount: { required: helpers.withMessage('Phải nhập giảm %', required), numeric: helpers.withMessage('Phải là số', numeric), positiveNumber },
  discount_max: { numeric: helpers.withMessage('Phải là số', numeric), positiveNumber },
  type: { required: helpers.withMessage('Phải chọn loại voucher', required) },
  quantity: { required: helpers.withMessage('Phải nhập số lượng', required), numeric: helpers.withMessage('Phải là số', numeric), positiveNumber },
  usage_condition: { numeric: helpers.withMessage('Phải là số', numeric), positiveNumber },
  started_date: { required: helpers.withMessage('Phải chọn ngày bắt đầu', required) },
  ended_date: { required: helpers.withMessage('Phải chọn ngày kết thúc', required), afterStart },
};

const v$ = useVuelidate(rules, voucher);

function formatDateToVN(date) {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Gửi form tạo voucher
 */
const handleSubmit = async () => {
  isSubmitting.value = true;
  const valid = await v$.value.$validate();
  if (!valid) {
    isSubmitting.value = false;
    return;
  }

  try {
    const payload = { ...voucher };
    payload.discount = Number(payload.discount);
    payload.discount_max = Number(payload.discount_max) || 0;
    payload.quantity = Number(payload.quantity);
    payload.usage_condition = Number(payload.usage_condition) || 0;
    payload.started_date = formatDateToVN(payload.started_date);
    payload.ended_date = formatDateToVN(payload.ended_date);

    await apiClient.post('/api/voucher', payload);

    await Swal.fire({
        icon: "success",
        title: "Thêm mới thành công",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

    router.push('/admin/list-voucher');
  } catch (error) {
    console.error(error);
    await Swal.fire({
      icon: 'error',
      title: 'Đã có lỗi xảy ra',
      text: error.response?.data?.message || 'Vui lòng thử lại',
      confirmButtonColor: '#dc3545',
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Tự sinh mã voucher
function generateVoucherCode(length = 14) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += charset[Math.floor(Math.random() * charset.length)];
  voucher.code = result;
}

generateVoucherCode();
</script>

<style scoped>
.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
