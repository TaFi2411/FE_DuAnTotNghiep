<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light position-fixed top-0 end-0 start-0">
    <div class="container">
      <!-- Cột trái: Logo -->
      <router-link class="navbar-brand" to="/">
        <img src="/images/Logo.png" alt="Logo" height="40" width="120" />
      </router-link>

      <!-- Nút toggle (mobile) -->
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

      <!-- Cột giữa + phải (menu + user/cart) -->
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <div class="d-flex flex-column flex-lg-row justify-content-between w-100 align-items-lg-center">
          
          <!-- Menu giữa -->
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


          <!-- Bên phải: Giỏ hàng + User -->
          <div class="navbar-right d-lg-flex align-items-center gap-5 mb-2 mb-lg-0">
            <!-- Giỏ hàng -->
            <router-link to="/cart" class="nav-link d-lg-flex align-items-center">
                <span class="position-relative ">
                <i class="bi bi-cart3 fs-3"></i>
                <span class="badge bg-danger cart-badge position-absolute bottom-50  start-100 translate-middle rounded-pill" style="font-size: 10px;">
                    99+
                </span>
            </span>
            <span class="d-lg-none ms-1">Giỏ hàng</span>
            </router-link>


            <!-- User -->
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
                <span>Lương Thế Tài</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-start" aria-labelledby="userDropdown">
                <li>
                  <router-link class="dropdown-item" to="/profile">Tài khoản của tôi</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/auth/register">Đăng ký</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/auth/login">Đăng nhập</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/orders">Đơn hàng</router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#" @click="logout">Đăng xuất</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script setup>

</script>

<style  scoped>

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
  opacity: 1; /* KHÔNG dùng thấp hơn 1 */
  background-color: rgba(255, 255, 255, 0.8); /* dùng rgba để tạo cảm giác trong suốt */
  backdrop-filter: blur(10px);
}


.navbar {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(10px); /* chỉ mờ nền navbar */
  -webkit-backdrop-filter: saturate(180%) blur(10px); /* safari hỗ trợ */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
  z-index: 1030; /* vừa đủ */
}
</style>