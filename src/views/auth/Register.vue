<template>
  <div class="register-page container py-5 mt-5">
    <h2 class="text-center fw-bold mb-4">Đăng ký tài khoản</h2>

    <form @submit.prevent="handleRegister" class="mx-auto register-form">
      <!-- Họ tên -->

      <div class="mb-3">
        <label for="fullname" class="form-label">Họ và tên</label>
        <input
          type="text"
          class="form-control"
          id="fullname"
          v-model="form.fullname"
          placeholder="Nguyễn Văn A"
          required
        />
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label">Địa chỉ Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="form.email"
          placeholder="name@example.com"
          required
        />
      </div>

      <!-- Số điện thoại -->
      <div class="mb-3">
        <label for="phone" class="form-label">Số điện thoại</label>
        <input
          type="text"
          class="form-control"
          id="phone"
          v-model="form.phone"
          placeholder="0123456789"
          maxlength="10"
          required
        />
      </div>

      <!-- Mật khẩu -->
      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <div class="position-relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-control pe-5"
            placeholder="Nhập mật khẩu"
          />
          <i
            class="bi position-absolute end-0 top-50 translate-middle-y me-3"
            :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
            @click="togglePassword"
            style="cursor: pointer; color: #777;"
          ></i>
        </div>
      </div>

      <!-- Giới tính -->
      <div class="mb-3">
        <label class="form-label">Giới tính</label>
        <div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              id="male"
              name="gender"
              :value="true"
              v-model="form.gender"
            />
            <label class="form-check-label" for="male">Nam</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              id="female"
              name="gender"
              :value="false"
              v-model="form.gender"
            />
            <label class="form-check-label" for="female">Nữ</label>
          </div>
        </div>
      </div>

      <!-- Nút đăng ký -->
      <button type="submit" class="btn btn-dark w-100 py-2 fw-semibold">
        Đăng ký
      </button>

     
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter} from "vue-router";

const router = useRouter();
const API_URL = "http://localhost:8080/auth/register";

const form = ref({
  fullname: "",
  email: "",
  phone: "",
  password: "",
  gender: true,
  role: false,
  active: true,
});


const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleRegister = async () => {
  try {
    await axios.post(API_URL, form.value);
    alert("🎉 Đăng ký thành công! Hãy đăng nhập.");
    router.push("/auth/login");
    form.value = {
      fullname: "",
      email: "",
      phone: "",
      password: "",
      gender: true,
      role: false,
      active: true,
    };
  } catch (err) {
    console.error("Lỗi khi đăng ký tài khoản:", err);
    alert("⚠️ Đăng ký thất bại! Kiểm tra lại thông tin.");
  }
};
</script>

<style scoped>
.register-form {
  max-width: 480px;
}

/* Giúp icon con mắt nằm chính giữa đẹp hơn */
.password-toggle {
  cursor: pointer;
  color: #777;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 576px) {
  .register-form {
    max-width: 100%;
    padding: 0 15px;
  }
}
</style>
