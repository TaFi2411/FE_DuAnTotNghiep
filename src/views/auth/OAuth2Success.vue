<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h2 class="text-xl font-semibold">Đang xử lý đăng nhập...</h2>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    // ✅ Lưu token vào localStorage (để đồng nhất với login thường)
    localStorage.setItem("token", token);

    // ✅ Giải mã token để lấy role
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles = payload.roles || [];
    const role = roles[0];
    const email = payload.sub;

    console.log("✅ OAuth2 login thành công:");
    console.log("Email:", email);
    console.log("Role:", role);

    localStorage.setItem("role", role);

    // ✅ Điều hướng theo quyền
    if (roles.includes("ROLE_ADMIN")) {
      window.location.href = "/"; 
    } else {
      window.location.href = "/"; 
    }
  } else {
    router.push("/auth/login");
  }
});

</script>
