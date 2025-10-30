<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light position-fixed top-0 end-0 start-0">
    <div class="container">
      <!-- Logo -->
      <router-link class="navbar-brand" to="/">
        <img src="/images/Logo.png" alt="Logo" height="40" width="120" />
      </router-link>

      <!-- Toggle (mobile) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu & User/Cart -->
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <div class="d-flex flex-column flex-lg-row justify-content-between w-100 align-items-lg-center">

          <!-- Menu chính -->
          <ul class="navbar-nav mx-lg-auto mb-2 mb-lg-0 fs-5">
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact-active-class="active-link">Trang chủ</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/store" exact-active-class="active-link">Cửa hàng</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/introduce" exact-active-class="active-link">Giới thiệu</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/support" exact-active-class="active-link">Hỗ trợ</router-link>
            </li>
          </ul>

          <!-- Giỏ hàng + User -->
          <div class="navbar-right d-lg-flex align-items-center gap-5 mb-2 mb-lg-0">

            <!-- Giỏ hàng -->
            <router-link to="/cart" class="nav-link d-lg-flex align-items-center position-relative">
              <i class="bi bi-cart3 fs-3"></i>

              <!-- Badge số lượng loại sản phẩm -->
              <span
                v-if="cartCount > 0"
                class="badge bg-danger cart-badge position-absolute bottom-50 start-100 translate-middle rounded-pill"
                style="font-size: 10px;"
              >
                {{ cartCount > 99 ? "99+" : cartCount }}
              </span>

              <span class="d-lg-none ms-1">Giỏ hàng</span>
            </router-link>

            <!-- User Dropdown -->
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
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Biến reactive
const isLoggedIn = ref(false);
const accountName = ref("Khách");
const isAdmin = ref(false);

// Biến lưu số loại sản phẩm trong giỏ hàng
const cartCount = ref(0);

// 👉 Hàm cập nhật số lượng sản phẩm trong giỏ hàng (tính theo số loại)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cartCount.value = cart.length;
}

// 👉 Lắng nghe sự kiện từ Cart.vue
onMounted(() => {
  // Cập nhật ban đầu khi load trang
  updateCartCount();

  // Khi localStorage thay đổi (Cart.vue phát event)
  window.addEventListener("cart-updated", updateCartCount);

  // Kiểm tra đăng nhập
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

// 👉 Khi component bị hủy
onBeforeUnmount(() => {
  window.removeEventListener("cart-updated", updateCartCount);
});

// 👉 Giải mã JWT token
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
      console.log(token);
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
.active-link {
  color: #0d6efd !important;
  font-weight: 600;
  position: relative;
}
.active-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 2px;
  background-color: #0d6efd;
  border-radius: 2px;
}

.navbar {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
  z-index: 1030;
}
</style>
