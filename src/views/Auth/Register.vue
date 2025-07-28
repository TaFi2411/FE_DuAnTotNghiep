<template>
  <section>
    <div class="formto">
      <h3 class="text-center font-bold"><strong>Đăng ký</strong></h3>
      <br />
      <form @submit.prevent="dangKy">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="name">Tên tài khoản</label>
            <input
              type="text"
              class="form-control"
              id="name"
              placeholder="Nhập tên tài khoản"
            />
          </div>
          <div class="col-md-6">
            <label for="email">Email</label>
            <input
              type="text"
              class="form-control"
              id="email"
              placeholder="Nhập email"
            />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="phone">Số điện thoại</label>
            <input
              type="text"
              class="form-control"
              id="phone"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div class="col-md-6">
            <label for="gender">Giới tính</label>
            <select id="gender" class="form-select">
              <option value="" disabled selected>Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              
            </select>
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
                placeholder="Nhập mật khẩu"
              />
              <i
                :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                class="eye-icon"
                @click="showPassword = !showPassword"
              ></i>
            </div>
          </div>
          <div class="col-md-6">
            <label for="cfpass">Xác nhận mật khẩu</label>
            <div class="input-group position-relative">
              <input
                :type="showCfPassword ? 'text' : 'password'"
                class="form-control pr-5 rounded-3"
                id="cfpass"
                placeholder="Nhập lại mật khẩu"
              />
              <i
                :class="showCfPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                class="eye-icon"
                @click="showCfPassword = !showCfPassword"
              ></i>
            </div>
          </div>
        </div>

        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="terms" />
          <label class="form-check-label" for="terms">
            Tôi đồng ý với <a href="#">các điều khoản</a>
          </label>
        </div>

        <button type="submit" class="btn btn-primary" id="btndangky">
          Đăng ký
        </button>
        <button class="btn mt-0" id="btndangnhap" @click="back">Hủy</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
const showPassword = ref(false);
const showCfPassword = ref(false);

const dangKy = () => {
  alert("Đăng ký thành công!");
};
const back = () => {
  alert("Quay lại");
};
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
</style>
