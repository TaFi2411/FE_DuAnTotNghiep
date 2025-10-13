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
  </header>
</template>

<script setup>
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
