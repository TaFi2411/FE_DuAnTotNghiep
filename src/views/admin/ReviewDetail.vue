<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">
      Chi tiết đánh giá
    </h2>

    <div class="card shadow-sm p-4">
      <form @submit.prevent="saveReview">
        <!-- Số sao -->
        <div class="mb-3">
          <label class="form-label">Số sao (1–5)</label>
          <input
            v-model.number="form.star"
            type="number"
            class="form-control"
            min="1"
            max="5"
            required
            @input="validateStar"
          />
          <div v-if="errors.star" class="text-danger small">{{ errors.star }}</div>
        </div>

        <!-- Mô tả -->
        <div class="mb-3">
          <label class="form-label">Mô tả đánh giá</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="form-control"
            placeholder="Nhập nội dung đánh giá"
            @input="validateDescription"
          ></textarea>
          <div v-if="errors.description" class="text-danger small">
            {{ errors.description }}
          </div>
        </div>

        <!-- Account ID -->
        <div class="mb-3">
          <label class="form-label">ID tài khoản</label>
          <input v-model.number="form.accountId" type="number" class="form-control" required />
        </div>

        <!-- Order Detail ID -->
        <div class="mb-3">
          <label class="form-label">ID chi tiết đơn hàng</label>
          <input v-model.number="form.orderDetailId" type="number" class="form-control" required />
        </div>

        <!-- Nút hành động -->
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-secondary me-2" @click="goBack">
            Quay lại
          </button>
          <button type="submit" class="btn btn-danger">
            Xóa
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/composables/axios";

const route = useRoute();
const router = useRouter();

const form = ref({
  star: null,
  description: "",
  accountId: null,
  orderDetailId: null,
});

const errors = ref({
  star: "",
  description: "",
});

const isEdit = computed(() => !!route.params.id);

// ✅ Validation
function validateStar() {
  if (!form.value.star || form.value.star < 1 || form.value.star > 5) {
    errors.value.star = "Số sao phải nằm trong khoảng 1–5!";
    return false;
  }
  errors.value.star = "";
  return true;
}

function validateDescription() {
  if (!form.value.description.trim()) {
    errors.value.description = "Mô tả không được để trống!";
    return false;
  }
  errors.value.description = "";
  return true;
}

// ✅ Save
async function saveReview() {
  if (!validateStar() || !validateDescription()) return;

  try {
    const payload = { ...form.value };
    if (isEdit.value) {
      await axios.put(`/api/review/${route.params.id}`, payload);
      alert("✅ Cập nhật thành công!");
    } else {
      await axios.post("/api/review", payload);
      alert("✅ Thêm mới thành công!");
    }
    router.push("/review");
  } catch (err) {
    console.error("❌ Lỗi khi lưu:", err);
    alert("Lưu thất bại!");
  }
}

// ✅ Load khi sửa
async function loadReview(id) {
  try {
    const res = await axios.get(`/api/review/${id}`);
    form.value = { ...res.data };
  } catch (err) {
    console.error("❌ Không tải được review:", err);
    alert("Không tìm thấy đánh giá!");
    router.push("/review");
  }
}

const goBack = () => router.push("/review");

onMounted(() => {
  if (isEdit.value) loadReview(route.params.id);
});
</script>

<style scoped>
.card {
  border-radius: 10px;
  max-width: 700px;
  margin: 0 auto;
}
</style>
