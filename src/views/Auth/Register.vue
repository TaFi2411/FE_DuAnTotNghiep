<template>
  <section>
    <div class="formto">
      <h3 class="text-center font-bold"><strong>Đăng ký</strong></h3>
      <br />
      <form @submit.prevent="Register">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="name">Tên tài khoản</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="fullname"
              placeholder="Nhập tên tài khoản"
            />
            <small class="text-danger">{{ errors.fullname }}</small>
          </div>
          <div class="col-md-6">
            <label for="email">Email</label>
            <input
              type="text"
              class="form-control"
              id="email"
              v-model="email"
              placeholder="Nhập email"
            />
            <small class="text-danger">{{ errors.email }}</small>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="phone">Số điện thoại</label>
            <input
              type="text"
              class="form-control"
              id="phone"
              v-model="phone"
              placeholder="Nhập số điện thoại"
            />
            <small class="text-danger">{{ errors.phone }}</small>
          </div>
          <div class="col-md-6">
            <label for="gender">Giới tính</label>
            <select id="gender" class="form-select" v-model="gender">
              <option value="" disabled>Chọn giới tính</option>
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
            <small class="text-danger">{{ errors.gender }}</small>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="pass">Mật khẩu</label>
            <div class="input-group position-relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control pr-5 rounded-3"
                id="pass"
                v-model="password"
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
          <div class="col-md-6">
            <label for="cfpass">Xác nhận mật khẩu</label>
            <div class="input-group position-relative">
              <input
                :type="showCfPassword ? 'text' : 'password'"
                class="form-control pr-5 rounded-3"
                id="cfpass"
                v-model="confirmPassword"
                placeholder="Nhập lại mật khẩu"
              />
              <i
                :class="showCfPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                class="eye-icon"
                @click="showCfPassword = !showCfPassword"
              ></i>
            </div>
            <small class="text-danger">{{ errors.confirmPassword }}</small>
          </div>
        </div>

        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="terms" v-model="agreeTerms" />
          <label class="form-check-label" for="terms">
            Tôi đồng ý với <a href="#">các điều khoản</a>
          </label>
          <br />
          <small class="text-danger">{{ errors.terms }}</small>
        </div>

        <button type="submit" class="btn btn-primary" id="btndangky">Đăng ký</button>
        <button class="btn mt-0" id="btndangnhap" @click="back">Hủy</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import validator from 'validator'
import { useRouter } from 'vue-router';
const router = useRouter();
const API_URL = 'http://localhost:8080/api/account'

const email = ref('')
const fullname = ref('')
const gender = ref('')
const password = ref('')
const confirmPassword = ref('')
const phone = ref('')
const role = ref('false')
const status = ref('true')
const agreeTerms = ref(false)

const showPassword = ref(false)
const showCfPassword = ref(false)

const errors = ref({})


const validateForm = () => {
  errors.value = {}

  if (validator.isEmpty(fullname.value.trim())) {
    errors.value.fullname = 'Không được bỏ trống'
  } else if (fullname.value.length > 20) {
    errors.value.fullname = 'Tên không quá 20 ký tự'
  }

  if (validator.isEmpty(email.value.trim())) {
    errors.value.email = 'Không được bỏ trống'
  } else if (!validator.isEmail(email.value)) {
    errors.value.email = 'Email không đúng định dạng'
  }

  if (validator.isEmpty(phone.value.trim())) {
    errors.value.phone = 'Không được bỏ trống'
  } else if (!validator.isNumeric(phone.value)) {
    errors.value.phone = 'Số điện thoại phải là số'
  } else if (phone.value.length !== 10) {
    errors.value.phone = 'Số điện thoại phải 10 số'
  }

  if (validator.isEmpty(password.value.trim())) {
    errors.value.password = 'Không được bỏ trống'
  }

  if (validator.isEmpty(confirmPassword.value.trim())) {
    errors.value.confirmPassword = 'Không được bỏ trống'
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Mật khẩu không khớp'
  }
  if (validator.isEmpty(gender.value)) {
    errors.value.gender = "Phải chọn giới tính";
  }
  if (!agreeTerms.value) {
    errors.value.terms = 'Bạn phải đồng ý với điều khoản'
  }

  return Object.keys(errors.value).length === 0
}

const Register = async () => {
  if (!validateForm()) {
    return
  }

  try {
    const newAccount = {
      email: email.value,
      fullname: fullname.value,
      gender: gender.value,
      password: password.value,
      phone: phone.value,
      role: role.value,
      status: status.value === 'true'
    }

    const response = await axios.post(API_URL, newAccount)
    console.log('Đăng ký thành công:', response.data)

    email.value = ''
    fullname.value = ''
    gender.value = ''
    password.value = ''
    confirmPassword.value = ''
    phone.value = ''
    role.value = 'false'
    status.value = 'true'
    agreeTerms.value = false

    await fetchAcount()
  } catch (err) {
    console.error('Lỗi khi đăng ký tài khoản:', err)
  }
}

const back = async () => {
       
       router.push("/dangnhap");
   
}

</script>

<style scoped>
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
section {
  display: flex;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
}
.formto {
  width: 600px;
  border: 1px solid black;
  padding: 40px;
  padding-top: 20px;
  background-color: white;
  border-radius: 20px;
}
#btndangnhap {
  margin: 10px 10px 0px 10px;
  background-color: #fd475a;
  width: 100%;
  height: 36px;
  border: none;
  font-weight: bold;
}
#btndangnhap:hover {
  cursor: pointer;
  background-color: #a12935;
}
#btndangky {
  margin: 10px;
  width: 100%;
  height: 36px;
  border: none;
  font-weight: bold;
}
#btndangky:hover {
  cursor: pointer;
}
.text-danger {
  color: red;
  font-size: 13px;
}
</style>
