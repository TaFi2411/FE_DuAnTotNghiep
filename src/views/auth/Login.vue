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

    <button @click="loginWithGoogle">Login with Google</button>
    <button @click="loginWithFacebook">Login with Facebook</button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>

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
