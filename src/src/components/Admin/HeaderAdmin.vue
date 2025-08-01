<template>
  <div>
    <nav class="navbar navbar-expand-sm navbar-light  position-fixed top-0 end-0 start-0 z-3">
      <div class="container-fluid justify-content-between">
        <!-- Logo bên trái -->
        <router-link to="/" class="navbar-brand">
          <img src="/images/Logo.png" class="logo" />
        </router-link>

        <!-- Nút toggle cho mobile -->
        <button
          class="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- User info bên phải -->
        <div class="collapse navbar-collapse justify-content-end" id="collapsibleNavId">
          <div class="information">
            <div class="dropdown">
              <button
                class="btn dropdown-toggle d-flex align-items-center"
                type="button"
                style="border: none"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle me-2" style="font-size: 32px"></i>Lương Thế Tài
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end"
                style="width: 260px"
                aria-labelledby="dropdownMenuButton1"
              >
                <li class="dropdown-item"><strong>Chưa đăng nhập</strong></li>
                <li><hr class="dropdown-divider" /></li>
                <li><router-link class="dropdown-item" to="">Đăng ký</router-link></li>
                <li><router-link class="dropdown-item" to="">Đăng nhập</router-link></li>
                <li><router-link class="dropdown-item" to="">Quên mật khẩu</router-link></li>
                <li><hr class="dropdown-divider" /></li>
                <li><router-link class="dropdown-item" to="">Thông tin tài khoản</router-link></li>
                <li><router-link to="/quanly/tongquan" class="dropdown-item">Quản lý hệ thống</router-link></li>
                <li><router-link class="dropdown-item" to="">Đổi mật khẩu</router-link></li>
                <li><router-link class="dropdown-item" to="">Đăng xuất</router-link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>


<script setup></script>

<style scoped>
.navbar{
    background-color: white;
     box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.search {
  position: relative;
}
.search > .input-search {
  border-radius: 20px;
  width: 260px;
}
.search > .button-search {
  background-color: transparent;
  border: none;
  position: absolute;
  right: 6px;
}
.dropdown-menu {
  left: auto !important;
  right: 0 !important;
  transform: translateX(-10%);
}
.logo {
  margin-left: 50px;
  width: 10rem;
  height: 50px;
  color: black;
  text-decoration: none;
  font-weight: bold;
}
</style>
