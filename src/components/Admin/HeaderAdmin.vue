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
                <i class="bi bi-person-circle me-2" style="font-size: 32px"></i>
                <div class="noLogin" v-if="isLoggedIn">
                  {{ accountName }}
                </div>
                <div class="hasLogin" v-else>
                  {{ accountName }}
                </div>
              </button>
              <ul
                class="dropdown-menu dropdown-menu-start"
                style="width: 260px"
                aria-labelledby="dropdownMenuButton1">
                <div class="noLogin" v-if="isLoggedIn">
                  <li class="dropdown-item"><strong>Xin chào bạn</strong></li>
                </div>
                <div class="hasLogin" v-else>
                  <li class="dropdown-item"><strong>Chưa đăng nhập</strong></li>
                </div>
                  
                  <li><hr class="dropdown-divider" /></li>

              <!-- Nếu chưa đăng nhập -->
                <div class="noLogin" v-if="!isLoggedIn">
                  <li>
                    <router-link class="dropdown-item" to="/dangky">Đăng ký</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" to="/dangnhap">Đăng nhập</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" to="/quenmatkhau">Quên mật khẩu</router-link>
                  </li>
                </div>

                <!-- Nếu đã đăng nhập -->
                <div class="hasLogin" v-else>
                  <li>
                    <router-link class="dropdown-item" to="">Thông tin tài khoản</router-link>
                  </li>
                   
                  <li v-if="isAdmin">
                    <router-link to="/quanly/tongquan" class="dropdown-item">Quản lý hệ thống</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" to="">Đổi mật khẩu</router-link>
                  </li>
                  <li>
                    <a class="dropdown-item" @click.prevent="logout">Đăng xuất</a>
                  </li>
                </div>

              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'           
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/account'
const accountName = ref('Khách hàng') 
const isAdmin = ref(false);


const fetchAccountName = async () => {
  try {
    const token = sessionStorage.getItem('token')
    if (!token) return

    const response = await axios.get(`${API_URL}/info`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    accountName.value = response.data.fullname;
    isAdmin.value = response.data.role;
  } catch (err) {
    console.error('Lỗi khi lấy thông tin tài khoản:', err)
  }
}


const router = useRouter()
const isLoggedIn = ref(false)

onMounted(() => {
  const token = sessionStorage.getItem('token')
  isLoggedIn.value = !!token
})

const logout = () => {
  sessionStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
  window.dispatchEvent(new Event('logout'))
  
  router.push('/')
  setTimeout(() => {
      
      location.reload(); 
      
    }, 100)
}



onMounted(() => {
const checkToken = () => {
  const token = sessionStorage.getItem('token')
  isLoggedIn.value = !!token
  if (isLoggedIn.value) {
    fetchAccountName()
  }
}

  checkToken()

  window.addEventListener('login', checkToken)
  window.addEventListener('logout', checkToken)
})

</script>

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
