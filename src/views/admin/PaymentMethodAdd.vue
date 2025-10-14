<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">
      {{ isEdit ? "Cập nhật phương thức thanh toán" : "Thêm phương thức thanh toán" }}
    </h2>

    <div class="card shadow-sm p-4">
      <form @submit.prevent="savePaymentMethod">
        <!-- Tên phương thức -->
        <div class="mb-3">
          <label class="form-label">Tên phương thức thanh toán</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            placeholder="Nhập tên phương thức (VD: Thanh toán khi nhận hàng)"
            @input="validateName"
          />
          <!-- ⚠️ Hiển thị lỗi -->
          <div v-if="errors.name" class="text-danger mt-1 small">
            {{ errors.name }}
          </div>
        </div>

        <!-- Trạng thái -->
        <div class="form-check mb-3">
          <input
            v-model="form.status"
            type="checkbox"
            class="form-check-input"
            id="status"
          />
          <label class="form-check-label" for="status">Hoạt động</label>
        </div>

        <!-- Nút hành động -->
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-secondary me-2"
            @click="goBack"
          >
            Quay lại
          </button>
          <button type="submit" class="btn btn-success">
            {{ isEdit ? "Cập nhật" : "Thêm mới" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/axios";

const route = useRoute();
const router = useRouter();

const form = ref({
  id: null,
  name: "",
  status: true,
});

const errors = ref({
  name: "",
});

const isEdit = computed(() => !!route.params.id);

/**
 * ✅ Validate Tên phương thức thanh toán
 */
function validateName() {
  const name = form.value.name.trim();
  errors.value.name = "";

  if (!name) {
    errors.value.name = "Tên phương thức không được để trống!";
  } else if (/^\d+$/.test(name)) {
    errors.value.name = "Tên phương thức không được chỉ gồm số!";
  } else if (/[^a-zA-Z0-9À-ỹ\s]/.test(name)) {
    errors.value.name = "Tên phương thức không được chứa ký tự đặc biệt!";
  } else if (name.length < 3) {
    errors.value.name = "Tên phương thức phải có ít nhất 3 ký tự!";
  }

  return !errors.value.name;
}

/**
 * 💾 Lưu (thêm hoặc cập nhật)
 */
async function savePaymentMethod() {
  if (!validateName()) return;

  try {
    const payload = {
      name: form.value.name.trim(),
      status: form.value.status,
    };

    if (isEdit.value) {
      await axios.put(`/api/payment-method/${form.value.id}`, payload);
      alert("✅ Cập nhật thành công!");
    } else {
      await axios.post("/api/payment-method", payload);
      alert("✅ Thêm mới thành công!");
    }

    router.push("/payment-method");
  } catch (err) {
    console.error("❌ Lỗi khi lưu:", err);
    alert("Lưu thất bại. Kiểm tra console để xem chi tiết.");
  }
}

/**
 * 🔄 Tải khi edit
 */
async function loadPaymentMethod(id) {
  try {
    const res = await axios.get(`/api/payment-method/${id}`);
    form.value = { ...res.data, id: res.data.id ?? id };
  } catch (err) {
    console.error("❌ Không tải được phương thức:", err);
    alert("Không tìm thấy phương thức thanh toán.");
    router.push("payment-method");
  }
}

const goBack = () => router.push("/payment-method");

onMounted(() => {
  if (isEdit.value) loadPaymentMethod(route.params.id);
});
</script>

<style scoped>
.card {
  border-radius: 10px;
  max-width: 700px;
  margin: 0 auto;
}
.text-danger {
  font-size: 0.9rem;
}
</style>
