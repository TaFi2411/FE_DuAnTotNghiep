<template>
  <div class="container py-5" style="max-width: 500px; margin: auto;">
    <h2 class="text-center mb-4">Khôi phục mật khẩu</h2>

    <!-- Bước 1: Nhập email -->
    <div v-if="step === 1">
      <form @submit.prevent="sendOtp">
        <input v-model="email" type="email" class="form-control mb-3" placeholder="Email của bạn" required />
        <button type="submit" class="btn btn-dark w-100" :disabled="sendOtpCooldown > 0 || sendingOtp">
          <span v-if="sendingOtp">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Đang gửi...
          </span>
          <span v-else>
            {{ sendOtpCooldown > 0 ? `Gửi lại sau ${sendOtpCooldown}s` : "Gửi OTP" }}
          </span>
        </button>
      </form>
    </div>

    <!-- Bước 2: Nhập OTP 6 ô + countdown -->
    <div v-if="step === 2" class="text-center">
      <div class="d-flex justify-content-between mb-2">
        <input
          v-for="(val, index) in otpDigits"
          :key="index"
          type="text"
          maxlength="1"
          class="form-control text-center mx-1"
          style="width: 50px; font-size: 24px;"
          v-model="otpDigits[index]"
          @input="onOtpInput(index, $event)"
          ref="otpRefs"
        />
      </div>
      <p class="mt-2">OTP còn hiệu lực: {{ otpCountdown }} giây</p>
      <button class="btn btn-link" @click="resendOtp" :disabled="sendOtpCooldown > 0 || sendingOtp">
        {{ sendOtpCooldown > 0 ? `Gửi lại sau ${sendOtpCooldown}s` : "Gửi lại OTP" }}
      </button>
    </div>

    <!-- Bước 3: Đặt mật khẩu mới -->
    <div v-if="step === 3">
      <form @submit.prevent="resetPassword">
        <input v-model="newPassword" type="password" class="form-control mb-3" placeholder="Mật khẩu mới" required />
        <button type="submit" class="btn btn-dark w-100">Đặt lại mật khẩu</button>
      </form>
    </div>

    <p v-if="message" class="text-center mt-3" :class="{'text-success': success, 'text-danger': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import api from "@/composables/axios.js";

const step = ref(1);
const email = ref("");
const otpDigits = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);
const newPassword = ref("");
const message = ref("");
const success = ref(true);

// Countdown timers
const sendOtpCooldown = ref(0);
const otpCountdown = ref(300); // OTP hiệu lực 5 phút
const sendingOtp = ref(false); // <-- trạng thái gửi OTP

let sendOtpInterval = null;
let otpInterval = null;

// Gửi OTP
const sendOtp = async () => {
  try {
    sendingOtp.value = true; // bắt đầu loading
    await api.post("/auth/send-otp", null, { params: { email: email.value } });
    step.value = 2;
    success.value = true;
    message.value = "OTP đã được gửi vào email!";
    startSendOtpCooldown();
    startOtpCountdown();
    nextTick(() => otpRefs.value[0].focus());
  } catch (err) {
    success.value = false;
    message.value = "Gửi OTP thất bại: " + (err.response?.data || err.message);
  } finally {
    sendingOtp.value = false; // kết thúc loading
  }
};

// Gửi lại OTP
const resendOtp = async () => {
  otpDigits.value = ["", "", "", "", "", ""];
  otpCountdown.value = 300;
  await sendOtp();
};

// Countdown gửi OTP
const startSendOtpCooldown = () => {
  sendOtpCooldown.value = 60;
  if (sendOtpInterval) clearInterval(sendOtpInterval);
  sendOtpInterval = setInterval(() => {
    sendOtpCooldown.value--;
    if (sendOtpCooldown.value <= 0) clearInterval(sendOtpInterval);
  }, 1000);
};

// Countdown OTP
const startOtpCountdown = () => {
  otpCountdown.value = 300;
  if (otpInterval) clearInterval(otpInterval);
  otpInterval = setInterval(() => {
    otpCountdown.value--;
    if (otpCountdown.value <= 0) {
      clearInterval(otpInterval);
      success.value = false;
      message.value = "OTP đã hết hạn. Vui lòng gửi lại.";
      step.value = 1;
    }
  }, 1000);
};

// Xử lý nhập OTP
const onOtpInput = async (index, event) => {
  const val = event.target.value;
  if (val.length > 1) otpDigits.value[index] = val.slice(-1);
  if (val.length === 1 && index < 5) otpRefs.value[index + 1].focus();

  if (otpDigits.value.every(d => d !== "")) {
    const otp = otpDigits.value.join("");
    try {
      await api.post("/auth/verify-otp", null, { params: { email: email.value, otp } });
      step.value = 3;
      success.value = true;
      message.value = "OTP hợp lệ! Vui lòng đặt mật khẩu mới.";
      clearInterval(otpInterval);
    } catch (err) {
      success.value = false;
      message.value = "OTP không hợp lệ hoặc đã hết hạn";
      otpDigits.value = ["", "", "", "", "", ""];
      nextTick(() => otpRefs.value[0].focus());
    }
  }
};

// Đặt mật khẩu mới
const resetPassword = async () => {
  try {
    const res = await api.post("/auth/reset-password", {
      email: email.value,
      newPassword: newPassword.value,
    });
    success.value = true;
    message.value = res.data || "Đặt lại mật khẩu thành công!";
    step.value = 1;
    email.value = "";
    otpDigits.value = ["", "", "", "", "", ""];
    newPassword.value = "";
    clearInterval(sendOtpInterval);
    clearInterval(otpInterval);
  } catch (err) {
    success.value = false;
    message.value = err.response?.data || "Đặt lại mật khẩu thất bại";
  }
};
</script>
