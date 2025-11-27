<template>
  <div class="register-page container py-5 mt-5">
    <h2 class="text-center fw-bold mb-4">Đăng ký tài khoản</h2>

    <form @submit.prevent="handleRegister" class="mx-auto register-form">


      <div class="mb-3">
        <label for="fullname" class="form-label">Họ và tên</label>
        <input type="text" class="form-control" id="fullname" v-model="form.fullname" placeholder="Nguyễn Văn A"
         />
        <small v-if="v$.fullname.$error" class="text-danger">
          Họ tên không được để trống
        </small>
        <small v-if="serverErrors.fullname" class="text-danger">
          {{ serverErrors.fullname }}
        </small>
      </div>


      <div class="mb-3">
        <label>Email</label>
        <input type="text" v-model="form.email" class="form-control" placeholder="Email" />
        <small v-if="v$.email.$error" class="text-danger">
          Email không được để trống hoặc không hợp lệ
        </small>
        <small v-if="serverErrors.email" class="text-danger">
          {{ serverErrors.email }}
        </small>
      </div>


      <div class="mb-3">
        <label for="phone" class="form-label">Số điện thoại</label>
        <input type="text" class="form-control" id="phone" v-model="form.phone" placeholder="0123456789" maxlength="10"
         />
        <small v-if="v$.phone.$error" class="text-danger">
          Số điện thoại không được để trống và phải đúng 10 số
        </small>
        <small v-if="serverErrors.phone" class="text-danger">
          {{ serverErrors.phone }}
        </small>
      </div>


      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <div class="position-relative">
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-control pe-5"
            placeholder="Nhập mật khẩu"  />
          <i class="bi position-absolute end-0 top-50 translate-middle-y me-3"
            :class="showPassword ? 'bi-eye-slash' : 'bi-eye'" @click="togglePassword"
            style="cursor: pointer; color: #777;"></i>
        </div>
        <small v-if="v$.password.$error" class="text-danger">
          Mật khẩu không được để trống và tối thiểu 6 ký tự
        </small>
        <small v-if="serverErrors.password" class="text-danger">
          {{ serverErrors.password }}
        </small>
      </div>

      
      <div class="mb-3">
        <label class="form-label">Giới tính</label>
        <div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="male" name="gender" :value="true" v-model="form.gender" />
            <label class="form-check-label" for="male">Nam</label>
          </div>

          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="female" name="gender" :value="false"
              v-model="form.gender" />
            <label class="form-check-label" for="female">Nữ</label>
          </div>
        </div>
      </div>

     
      <div class="mb-3">
        <label>Mã OTP</label>
        <div class="input-group">
          <input type="text" v-model="otp" class="form-control" placeholder="Nhập mã OTP" maxlength="6" />
          <button class="btn btn-outline-primary" type="button" @click="sendOtp" :disabled="sendingOtp">
            {{ sendingOtp ? "Đang gửi..." : "Gửi OTP" }}
          </button>
        </div>
      </div>

      
      <button type="submit" class="btn btn-dark w-100 py-2 fw-semibold">
        Đăng ký
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";

const router = useRouter();


const API_SEND_OTP = "http://localhost:8080/auth/send-otp";
const API_VERIFY_REGISTER = "http://localhost:8080/auth/verify-otp-register";


const form = reactive({
  fullname: "",
  email: "",
  phone: "",
  password: "",
  gender: true,
  role: false,
  active: true,
});


const serverErrors = reactive({
  fullname: "",
  email: "",
  phone: "",
  password: "",
});


const otp = ref("");
const sendingOtp = ref(false);


const showPassword = ref(false);
const togglePassword = () => (showPassword.value = !showPassword.value);

const rules = {
  fullname: { required },
  email: { required, email },
  phone: {
    required
  },
  password: { required, minLength: minLength(6) }
};

const v$ = useVuelidate(rules, form);

const sendOtp = async () => {
  serverErrors.email = "";
  v$.value.email.$touch();

  if (!form.email || v$.value.email.$invalid) return;

  try {
    sendingOtp.value = true;
    await axios.post(`${API_SEND_OTP}?email=${form.email}`);

    Swal.fire({
      icon: "success",
      title: "OTP đã được gửi!",
      text: "Hãy kiểm tra email của bạn.",
    });
  } catch (err) {
    const msg = err.response?.data || "Lỗi gửi OTP";
    if (msg.toLowerCase().includes("email")) serverErrors.email = msg;
    else Swal.fire({ icon: "error", title: "Gửi OTP thất bại", text: msg });
  } finally {
    sendingOtp.value = false;
  }
};



// -------------------
// 2️⃣ HOÀN TẤT ĐĂNG KÝ
// -------------------
const handleRegister = async () => {
  // touch tất cả field
  v$.value.$touch();

  // Nếu có lỗi validation thì dừng
  if (v$.value.$invalid) return;

  // reset lỗi server
  Object.keys(serverErrors).forEach(k => serverErrors[k] = "");

  if (otp.value.length !== 6) {
    Swal.fire({ icon: "warning", title: "OTP không hợp lệ", text: "Mã OTP phải gồm 6 số!" });
    return;
  }

  try {
    await axios.post(`${API_VERIFY_REGISTER}?otp=${otp.value}`, form);

    await Swal.fire({
      icon: "success",
      title: "Đăng ký thành công!",
      text: "Bạn có thể đăng nhập ngay bây giờ.",
      confirmButtonText: "Đi đến đăng nhập",
    });

    router.push("/auth/login");
  } catch (err) {
    const msg = err.response?.data || "Đăng ký thất bại";

    if (msg.toLowerCase().includes("email")) serverErrors.email = msg;
    else if (msg.toLowerCase().includes("phone")) serverErrors.phone = msg;
    else if (msg.toLowerCase().includes("password")) serverErrors.password = msg;
    else if (msg.toLowerCase().includes("name")) serverErrors.fullname = msg;
    else Swal.fire({ icon: "error", title: "Lỗi đăng ký", text: msg });
  }
};

</script>

<style scoped>
.register-form {
  max-width: 480px;
}

.password-toggle {
  cursor: pointer;
  color: #777;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

@media (max-width: 576px) {
  .register-form {
    max-width: 100%;
    padding: 0 15px;
  }
}
</style>
