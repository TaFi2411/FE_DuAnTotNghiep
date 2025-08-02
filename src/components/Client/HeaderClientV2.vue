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
.nav-link {
  font-size: 18px;
  color: #000000;
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
  background-color: #fbfbfb; 
 
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

.dropdown-menu {
  background-color: #fff !important;
  backdrop-filter: none !important; /* loại bỏ hiệu ứng mờ */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid rgba(0,0,0,0.05);
  z-index: 1060 !important; /* phải cao hơn navbar */
  position: absolute !important;
}



</style>
