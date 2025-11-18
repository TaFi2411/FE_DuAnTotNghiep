<template>
  <header class="admin-header">
    <h1 class="title">Quản lý hệ thống cửa hàng</h1>

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
          <span class="fw-semibold">{{ accountName }}</span>
        </a>

        <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-2">
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
            <li><strong class="dropdown-header text-secondary">Xin chào, {{ accountName }}</strong></li>
            <li><hr class="dropdown-divider" /></li>
            <li><router-link class="dropdown-item" to="/orders">Đơn hàng của tôi</router-link></li>
            <li v-if="isAdmin"><router-link class="dropdown-item" to="/admin">Quản lý hệ thống</router-link></li>
            <li><router-link class="dropdown-item" to="/change-password">Đổi mật khẩu</router-link></li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item text-danger" href="#" @click.prevent="logoutHandler">
                <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
              </a>
            </li>
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
const isLoggedIn = ref(false);
const accountName = ref("Khách");
const isAdmin = ref(false);

// Giải mã JWT token
function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = decodeJwtToken(token);
    if (payload) {
      const roles = payload.roles || [];
      isLoggedIn.value = true;
      accountName.value = payload.accountName || payload.username || "Người dùng";
      isAdmin.value = roles.includes("ROLE_ADMIN");
    }
  }
});

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
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 1050;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-link {
  color: #222;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.nav-link:hover {
  color: #000;
}

/* Dropdown menu style (giống client) */
.dropdown-menu {
  background: #fff !important;
  color: #000 !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dropdown-menu .dropdown-item {
  color: #000 !important;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #f0f0f0 !important;
  color: #000 !important;
}

.dropdown-menu .dropdown-item.text-danger {
  color: #dc3545 !important;
}

.dropdown-divider {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.dropdown-header {
  color: #6c757d !important;
  font-size: 0.85rem;
}
</style>
