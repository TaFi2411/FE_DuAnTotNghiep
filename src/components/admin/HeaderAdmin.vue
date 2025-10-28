<template>
  <header class="admin-header">
    <h1 class="title">Admin Dashboard</h1>

    <div class="right">

      <!-- Dropdown người dùng -->
      <div class="dropdown">
        <a
          class="nav-link dropdown-toggle d-flex align-items-center"
          href="#"
          id="userDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-person-circle fs-4 me-2"></i>
          <span>{{ accountName }}</span>
        </a>

        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <!-- Nếu chưa đăng nhập -->
          <template v-if="!isLoggedIn">
                  <li class="dropdown-item"><strong>Chưa đăng nhập</strong></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><router-link class="dropdown-item" to="/auth/register">Đăng ký</router-link></li>
                  <li><router-link class="dropdown-item" to="/auth/login">Đăng nhập</router-link></li>
                  <li><router-link class="dropdown-item" to="/auth/login">Quên mật khẩu</router-link></li>
                </template>

          <!-- Nếu đã đăng nhập -->
          <template v-else>
                  <li class="dropdown-item"><strong>Thông tin cá nhân</strong></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><router-link class="dropdown-item" to="/orders">Đơn hàng của tôi</router-link></li>
                  <li v-if="isAdmin"><router-link class="dropdown-item" to="/admin">Quản lý hệ thống</router-link></li>
                  <li><router-link class="dropdown-item" to="/change-password">Đổi mật khẩu</router-link></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="logoutHandler">Đăng xuất</a></li>
          </template>
        </ul>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Biến reactive
const isLoggedIn = ref(false);
const accountName = ref("Khách");
const isAdmin = ref(false);



// 👉 Hàm giải mã token an toàn với Unicode
function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Lỗi khi decode JWT:", error);
    return null;
  }
}

// Khi component mount
onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = decodeJwtToken(token);
    if (payload) {
      const roles = payload.roles || [];
      isLoggedIn.value = true;
      accountName.value = payload.accountName || "Người dùng";
      isAdmin.value = roles.includes("ROLE_ADMIN");
      console.log("✅ Đăng nhập:", accountName.value, "Roles:", roles);
    } else {
      console.warn("❌ Token không hợp lệ, xoá token...");
      localStorage.removeItem("token");
    }
  }
});

// Đăng xuất
function logoutHandler() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  isLoggedIn.value = false;
  isAdmin.value = false;
  accountName.value = "Khách";
  router.push("/auth/login");
}


</script>

<style scoped>
.admin-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #333;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}


</style>
