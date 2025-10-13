<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="login">
      <div>
        <label>Email:</label>
        <input v-model="email" type="text" required />
      </div>
      <div>
        <label>Mật khẩu:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Đăng nhập</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  error.value = ''
  try {
    const res = await axios.post('http://localhost:8080/auth/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.token)

    alert('Đăng nhập thành công!')
    window.location.href = '/'
  } catch (err) {
    console.error(err)
    error.value = 'Sai tài khoản hoặc mật khẩu!'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
