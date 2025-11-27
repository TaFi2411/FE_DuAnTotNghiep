<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
    <div class="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-lg">
      <div class="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>


  <h2 class="text-2xl font-semibold text-gray-700">Đang xử lý đăng nhập...</h2>
  <p class="text-gray-500 text-center">Vui lòng chờ trong giây lát, bạn sẽ được chuyển hướng tự động.</p>
</div>


  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);

    try {
      const payload = JSON.parse(base64UrlDecode(token.split(".")[1]));
      const roles = payload.roles || [];
      const role = roles[0];
      const email = payload.sub;

      console.log("✅ OAuth2 login thành công:");
      console.log("Email:", email);
      console.log("Role:", role);

      localStorage.setItem("role", role);

      if (roles.includes("ROLE_ADMIN")) {
        window.location.href = "/";
        
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("❌ Lỗi khi giải mã token:", err);
      router.push("/auth/login");
    }
  } else {
    router.push("/auth/login");
  }
});
</script>

<style scoped>

</style>
