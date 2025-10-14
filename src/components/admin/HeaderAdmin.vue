<template>
  <header class="admin-header">
    <h1 class="title">Admin Dashboard</h1>

    <div class="right">

<div class="dropdown">
              <a
                class="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
               <i class="bi bi-person-circle fs-2 me-1"></i>
                <span>{{ accountName }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-start" aria-labelledby="userDropdown">
                <!-- Chưa đăng nhập -->
                <template v-if="!isLoggedIn">
                  <li class="dropdown-item"><strong>Chưa đăng nhập</strong></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><router-link class="dropdown-item" to="/auth/register">Đăng ký</router-link></li>
                  <li><router-link class="dropdown-item" to="/auth/login">Đăng nhập</router-link></li>
                  <li><router-link class="dropdown-item" to="/auth/login">Quên mật khẩu</router-link></li>
                </template>

                <!-- Đã đăng nhập -->
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Biến reactive
const isLoggedIn = ref(false);
const accountName = ref("Khách");
const isAdmin = ref(false);

// Khi component được mount, kiểm tra token
onMounted(() => {
  const token = sessionStorage.getItem("token");
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roles = payload.roles || [];
      const role = roles[0];
      const email = payload.sub; 
      
      // Gán giá trị reactive
      isLoggedIn.value = true;
      accountName.value = email;
      isAdmin.value = roles.includes("ROLE_ADMIN");

      console.log("✅ Đăng nhập với role:", role);
    } catch (e) {
      console.error("❌ Token không hợp lệ:", e);
      sessionStorage.removeItem("token");
    }
  }
});

// Hàm đăng xuất
function logoutHandler() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
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
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 5px 10px;
}

.search-box i {
  color: #888;
  margin-right: 6px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.notification {
  font-size: 20px;
  color: #555;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
</style>
