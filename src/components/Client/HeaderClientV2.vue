<template>
  <div>
    <nav class="navbar navbar-expand-sm navbar-light position-fixed top-0 end-0 start-0 z-3">
      <div class="container-fluid">
        <button
          class="navbar-toggler d-lg-none po"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="me-lg-5 d-flex justify-content-between">
        <router-link class="">
          <img src="/images/Logo.png" class="logo" />
        </router-link>
        </div>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
          <form class="search align-items-center d-none d-lg-flex">
            <input
              type="text"
              class="input-search form-control"
              id="exampleFormControlInput1"
              placeholder="Bạn muốn tìm gì ?"
            />
            <button class="button-search"><i class="bi bi-search"></i></button>
          </form>
          <ul class="navbar-nav me-auto ms-3 mt-2 mt-lg-0">
            <li class="nav-item">
              <router-link class="nav-link " to="/" aria-current="page"
                >Trang chủ
                <!-- <span class="visually-hidden">(current)</span> -->
                </router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="sanpham">Sản phẩm</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="gioithieu">Giới thiệu</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="hotro">Hỗ trợ</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="giohang">Giỏ hàng</router-link>
            </li>
          </ul>
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
                class="dropdown-menu dropdown-menu-start"
                style="width: 260px"
                aria-labelledby="dropdownMenuButton1"
              >
                <li class="dropdown-item"><strong>Chưa đăng nhập</strong></li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <router-link class="dropdown-item" to="/dangky">Đăng ký</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/dangnhap"
                    >Đăng nhập</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item" to=""
                    >Quên mật khẩu</router-link
                  >
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <router-link class="dropdown-item" to=""
                    >Thông tin tài khoản</router-link
                  >
                </li>
                <li>
                  <router-link to="/quanly/tongquan" class="dropdown-item"
                    >Quản lý hệ thống</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item" to=""
                    >Đổi mật khẩu</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item" to=""
                    >Đăng xuất</router-link
                  >
                </li>
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
.nav-link {
  font-size: 18px;
  color: #333;
  transition: transform 0.3s ease, opacity 0.2s, color 0.3s ease;
}

.nav-link:hover {
  color: #007ff7;             
  transform: translateY(-6px); 
          
}



.nav-link:focus {
    border-bottom: 2px solid #303233;
}

.navbar {
  background-color: #ffffff; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); 
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
