<template>
  <section>
    <div class="container-banner">
      <div class="banner">
        <div class="banner-left">
          <img src="/images/banner-home-left.png" alt="" />
        </div>

        <div class="banner-center">
          <div class="formto">
            <h3 class="text-center font-bold">Đăng nhập</h3>
             
                 <h5 class="text-danger text-center fw-bold" v-if="erroremailormatkhau">Tài khoản hoặc mặt khẩu sai</h5>
                <h5 class="text-danger text-center fw-bold" v-if="errorMessage">{{ errorMessage }}</h5>

               
            <br />
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email">Email</label>
                <input
                  v-model="email"
                  type="text"
                  class="form-control"
                  id="email"
                  placeholder="Nhập email"
                />
                <small class="text-danger">{{ errors.email }}</small>
              </div>

              <div class="mb-3">
                <label for="pass">Mật khẩu</label>
                <div class="input-group position-relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control pr-5 rounded-3"
                    id="pass"
                    placeholder="Nhập mật khẩu"
                  />
                  <i
                    :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                    class="eye-icon"
                    @click="showPassword = !showPassword"
                  ></i>
                </div>
                <small class="text-danger">{{ errors.password }}</small>
              </div>

              <div class="nhomatkhau mt-2">
                <p>
                  <input type="checkbox" /> Nhớ mật khẩu
                </p>
                <router-link to="/quenmatkhau" style="text-decoration: none;">Quên mật khẩu?</router-link>
              </div>

              <button type="submit" class="btn" id="btndangnhap">Đăng nhập</button>

              <h5 class="text-center">or</h5>
              <div class="fg">
                <button type="button" id="facebook" @click="dangNhapFacebook">
                  <i class="bi bi-facebook"></i> Facebook
                </button>
                <button type="button" id="google" @click="dangNhapGoogle">
                  <i class="bi bi-google"></i> Google
                </button>
              </div>
              <p id="dangky">
                Bạn chưa có tài khoản? <a href="dangky">Đăng ký</a>
              </p>
            </form>
          </div>
        </div>

        <div class="banner-right">
          <img src="/images/banner-home-right.png" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import validator from 'validator'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const errors = ref({})
const erroremailormatkhau = ref(false);
const errorMessage = ref('')
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token') 
      router.push('/dangnhap')
    }
    return Promise.reject(error)
  }
)
const validateForm = () => {
  errors.value = {}
  if (validator.isEmpty(email.value.trim())) {
    errors.value.email = 'Vui lòng nhập email'
  } else if (!validator.isEmail(email.value)) {
    errors.value.email = 'Email không đúng định dạng'
  }
    if (validator.isEmpty(password.value.trim())) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
  } 

  return Object.keys(errors.value).length === 0
}
const login = async () => {
  if (!validateForm()) {
    return
  }

  try {
    const response = await axios.post('http://localhost:8080/api/dangnhap', {
      email: email.value,
      password: password.value
    })

    

    const token = response.data.token
    if (token) {
      sessionStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
       Swal.fire({
      icon: 'success',
      title: 'Đăng nhập thành công!',
      showConfirmButton: false,
      timer: 1000
    })
     
    setTimeout(() => {
      
      router.push('/')
      
    }, 1000)
    setTimeout(() => {
      
      location.reload(); 
      
    }, 1000)


    } else {
      alert('Đăng nhập không thành công, token không hợp lệ!')
    }
  } catch (error) {
     if (error.response && error.response.status === 403) {
    errorMessage.value = 'Tài khoản bị khóa, không thể đăng nhập'
    erroremailormatkhau.value = false;
  } else {
    erroremailormatkhau.value = true;
  }
    
  }
}



</script>


<style scoped>
.banner {
  position: relative;
  height: 700px;
  color: #000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-left {
  position: absolute;
  z-index: 1;
  left: 0px;
  bottom: 0px;
}

.banner-center {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.banner-right {
  position: absolute;
  z-index: 1;
  right: 0px;
  bottom: 0px;
}

section {
  font-family: Arial, Helvetica, sans-serif;
  height: 700px;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #6c757d;
}

.eye-icon:hover {
  color: #000;
}

.formto {
  width: 500px;
  padding: 40px;
  padding-top: 20px;
  border-radius: 20px;
  max-height: 493px;
  color: rgb(0, 0, 0);
}

.nhomatkhau {
  display: flex;
  justify-content: space-between;
}

#btndangnhap {
  background-color: #000000;
  color: white;
  width: 100%;
  height: 36px;
  border: none;
  font-weight: bold;
  border: 1px solid #ffffff;
}

#btndangnhap:hover {
  cursor: pointer;
  background-color: white;
  color: #000;
  border: 2px solid black;
}

.fg {
  text-align: center;
  margin: 10px;
}

#facebook {
  border: none;
  width: 143px;
  height: 30px;
  background-color: #4285F4;
  color: white;
  margin-right: 5px;
}

#facebook:hover {
  cursor: pointer;
  background-color: rgb(32, 89, 182);
}

#google {
  border: none;
  width: 145px;
  height: 30px;
  background-color: #EA4335;
  color: white;
  margin-left: 4px;
}

#google:hover {
  cursor: pointer;
  background-color: #c12f22;
}

#dangky {
  text-align: center;
}
</style>
