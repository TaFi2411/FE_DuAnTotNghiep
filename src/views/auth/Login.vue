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

    <button @click="loginWithGoogle">Đăng nhập với Google</button>
    <button @click="loginWithFacebook">Đăng nhập với Facebook</button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from '@/axios.js'

const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  try {
     const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    const token = res.data.token;

    if (token) {
<<<<<<< HEAD
      // 🧩 Giải mã token để lấy thông tin người dùng (nếu backend chưa trả về id)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roles = payload.roles || [];
      const role = roles[0];
      const userId = payload.id || payload.userId; // hoặc tùy backend cậu đặt tên
=======

      localStorage.setItem("token", token);
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles || [];
      const role = roles[0]; 

      localStorage.setItem("role", role);
>>>>>>> 891d36366d8d48307bcb4c1d4a9d3f5650d49136

      // 🧠 Lưu tất cả thông tin vào localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userId, // <--- id là số (ví dụ 1)
          email: email.value,
          role: role,
          token: token,
        })
      );

      console.log("Đã lưu user:", JSON.parse(localStorage.getItem("user")));

      window.location.href = "/";
    } else {
      error.value = "Không nhận được token từ server!";
    }
  } catch (err) {
    console.error(err);
    error.value = "Sai tài khoản hoặc mật khẩu!";
  }
};


// 🧠 Login với Google
const loginWithGoogle = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

// 🧠 Login với Facebook
const loginWithFacebook = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
};
</script>


<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
.login-container div {
  margin-bottom: 15px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
