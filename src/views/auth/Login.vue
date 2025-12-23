<template>
  <div class="login-page container py-5 mt-5">
    <h2 class="text-center fw-bold mb-4">Đăng nhập</h2>

    <!-- FORM -->
    <form @submit.prevent="login" class="mx-auto" style="max-width: 400px;">
      <!-- EMAIL -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" placeholder="Nhập email" />
        <small v-if="v$.email.$error" class="text-danger">
          Email không được để trống hoặc không hợp lệ
        </small>
        <small v-if="serverErrors.email" class="text-danger">
          {{ serverErrors.email }}
        </small>
      </div>

      <!-- PASSWORD -->
      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <div class="position-relative">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control pe-5"
            placeholder="Nhập mật khẩu" />
          <i class="bi position-absolute end-0 top-50 translate-middle-y me-3"
            :class="showPassword ? 'bi-eye-slash' : 'bi-eye'" @click="togglePassword"
            style="cursor: pointer; color: #777;"></i>
        </div>
        <small v-if="v$.password.$error" class="text-danger">
          Mật khẩu không được để trống
        </small>
        <small v-if="serverErrors.password" class="text-danger">
          {{ serverErrors.password }}
        </small>
      </div>

      <!-- OPTIONS -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="form-check">
          
        </div>
        <RouterLink to="/auth/forgot-password" class="text-decoration-none small text-primary">
          Quên mật khẩu?
        </RouterLink>
      </div>

      <!-- LOGIN BUTTON -->
      <button type="submit" class="btn btn-dark w-100 py-2 fw-semibold">
        Đăng nhập
      </button>
    </form>

    <!-- OR DIVIDER -->
    <div class="text-center position-relative my-4" style="max-width: 400px; margin: 0 auto;">
      <span class="bg-white px-3 text-muted small">hoặc</span>
      <hr class="position-absolute top-50 start-0 w-100 translate-middle-y border-secondary-subtle" />
    </div>

    <!-- SOCIAL LOGIN -->
    <div class="d-flex flex-column flex-md-row gap-2 mb-3 mx-auto" style="max-width: 400px;">
      <button class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
        @click="loginWithFacebook" type="button">
        <i class="bi bi-facebook"></i> Facebook
      </button>
      <button class="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
        @click="loginWithGoogle" type="button">
        <i class="bi bi-google"></i> Google
      </button>
    </div>

    <!-- REGISTER LINK -->
    <p class="text-center small text-muted mb-0">
      Bạn chưa có tài khoản?
      <RouterLink to="/auth/register" class="text-decoration-none fw-semibold text-primary">
        Đăng ký
      </RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, email as emailValidator } from "@vuelidate/validators";
import api from "@/composables/axios.js";
import Swal from "sweetalert2";

// Form data
const email = ref("");
const password = ref("");
const showPassword = ref(false);

// Server errors
const serverErrors = ref({
  email: "",
  password: ""
});

// Validation rules
const rules = {
  email: { required, email: emailValidator },
  password: { required }
};

const v$ = useVuelidate(rules, { email, password });

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Login function
const login = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  // Reset server errors
  serverErrors.value.email = "";
  serverErrors.value.password = "";

  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    const token = res.data.token;
    if (!token) throw new Error("Không nhận được token từ server");

    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles = payload.roles || [];
    const role = roles.length > 0 ? roles[0] : null;
    if (role) localStorage.setItem("role", role);


    await Swal.fire({
      icon: "success",
      title: "Đăng nhập thành công",
      showConfirmButton: false,
      timer: 1500
    });

    if (role === "ROLE_ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

  } catch (err) {
    const errMsg = err.response?.data || err.message || "Đăng nhập thất bại";

    // Phân loại lỗi
    if (errMsg.toLowerCase().includes("email")) {
      serverErrors.value.email = errMsg;
    } else if (errMsg.toLowerCase().includes("mật khẩu")) {
      serverErrors.value.password = errMsg;
    } else {
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errMsg
      });
    }
  }
};

const loginWithGoogle = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

const loginWithFacebook = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
};
</script>

<style scoped>
.login-page {
  max-width: 600px;
}
</style>
