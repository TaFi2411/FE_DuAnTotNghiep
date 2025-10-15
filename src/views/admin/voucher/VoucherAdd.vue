<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm rounded-4">
          <div class="card-header bg-primary text-white">
            <h2 class="mb-0">Tạo Voucher mới</h2>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="title" class="form-label fw-semibold">Tiêu đề Voucher</label>
                <input type="text" id="title" class="form-control" v-model="voucher.title" placeholder="Ví dụ: Giảm giá mừng lễ 30/4" required />
              </div>

              <div class="mb-3">
                <label for="code" class="form-label fw-semibold">Mã Voucher</label>
                <input type="text" id="code" class="form-control" v-model="voucher.code" placeholder="Ví dụ: MUNGLE304" required />
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
                  <input type="number" id="quantity" class="form-control" v-model="voucher.quantity" min="1" required />
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

              <div v-if="errorMessage" class="alert alert-danger mt-4">
                {{ errorMessage }}
              </div>

              <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="submit" class="btn btn-primary rounded-pill px-4" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span role="status">{{ isLoading ? 'Đang lưu...' : 'Lưu Voucher' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/axios.js';

const router = useRouter();

const voucher = ref({
  title: '',
  code: '',
  description: '',
  discount: null,
  quantity: null,
  discount_max: null,
  type: true, // true = Sản phẩm, false = Vận chuyển
  usage_condition: null,
  started_date: '',
  ended_date: '',
  active: true
});

const isLoading = ref(false);
const errorMessage = ref(null);

// ✅ Hàm định dạng về giờ Việt Nam, dạng "yyyy-MM-dd HH:mm:ss"
function formatDateToVN(date) {
  if (!date) return null;
  const d = new Date(date);
  const offsetMs = 7 * 60 * 60 * 1000; // GMT+7
  const vnDate = new Date(d.getTime());
  // Nếu trình duyệt đã trả về giờ địa phương VN thì không cộng thêm offset
  const formatted = vnDate.toISOString().slice(0, 19).replace('T', ' ');
  return formatted;
}

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    if (new Date(voucher.value.ended_date) <= new Date(voucher.value.started_date)) {
      errorMessage.value = "Ngày kết thúc phải sau ngày bắt đầu!";
      isLoading.value = false;
      return;
    }

    const payload = { ...voucher.value };
    payload.started_date = formatDateToVN(payload.started_date);
    payload.ended_date = formatDateToVN(payload.ended_date);

    await apiClient.post('/api/voucher', payload);

    alert('🎉 Tạo voucher mới thành công!');
    router.push('/admin/voucher/list-voucher');
  } catch (error) {
    console.error("Lỗi khi tạo voucher:", error.response?.data || error.message);
    errorMessage.value = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.card-header h2 {
  font-size: 1.5rem;
}
.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
