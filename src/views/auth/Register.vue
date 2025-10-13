<template>
  <div class="container mt-5" style="max-width: 600px;">
    <h3 class="text-center mb-4">Đăng ký tài khoản</h3>

    <form @submit.prevent="handleRegister">
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
        <label for="password" class="form-label">Mật khẩu</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="form.password"
          placeholder="••••••••"
          minlength="6"
          required
        />
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
      <div class="d-grid">
        <button type="submit" class="btn btn-primary">Đăng ký</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = 'http://localhost:8080/auth/register'

const form = ref({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  gender: true,
  role: false,
  active: true
})

const handleRegister = async () => {
  try {
    await axios.post(API_URL, form.value)

    alert('🎉 Đăng ký thành công! Hãy đăng nhập.')
    router.push('/login') // chuyển sang trang đăng nhập

    // reset form
    form.value = {
      fullname: '',
      email: '',
      phone: '',
      password: '',
      gender: true,
      role: false,
      active: true
    }
  } catch (err) {
    console.error('Lỗi khi đăng ký tài khoản:', err)
    alert('⚠️ Đăng ký thất bại! Kiểm tra lại thông tin.')
  }
}
</script>

<style scoped>
.container {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
