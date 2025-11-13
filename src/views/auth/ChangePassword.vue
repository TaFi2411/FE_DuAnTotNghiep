<template>
  <div class="container py-5" style="max-width: 400px; margin: auto;">
    <h3 class="text-center mb-4">Đổi mật khẩu</h3>
    <form @submit.prevent="changePassword">
      <!-- Mật khẩu cũ -->
      <div class="mb-3 position-relative">
        <input
          :type="showOld ? 'text' : 'password'"
          v-model="oldPassword"
          class="form-control"
          placeholder="Mật khẩu cũ"
        />
        <i
          :class="showOld ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
          @click="showOld = !showOld"
          style="position:absolute; right:10px; top:50%; transform:translateY(-50%); cursor:pointer;"
        ></i>
        <small v-if="v$.oldPassword.$error" class="text-danger">
          Mật khẩu cũ không được để trống
        </small>
        <small v-if="serverErrors.oldPassword" class="text-danger">
          {{ serverErrors.oldPassword }}
        </small>
      </div>

      <!-- Mật khẩu mới -->
      <div class="mb-3 position-relative">
        <input
          :type="showNew ? 'text' : 'password'"
          v-model="newPassword"
          class="form-control"
          placeholder="Mật khẩu mới"
        />
        <i
          :class="showNew ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
          @click="showNew = !showNew"
          style="position:absolute; right:10px; top:50%; transform:translateY(-50%); cursor:pointer;"
        ></i>
        <small v-if="v$.newPassword.$error" class="text-danger">
          Mật khẩu mới ít nhất 6 ký tự
        </small>
        <small v-if="serverErrors.newPassword" class="text-danger">
          {{ serverErrors.newPassword }}
        </small>
      </div>

      <!-- Xác nhận mật khẩu -->
      <div class="mb-3 position-relative">
        <input
          :type="showConfirm ? 'text' : 'password'"
          v-model="confirmPassword"
          class="form-control"
          placeholder="Xác nhận mật khẩu mới"
        />
        <i
          :class="showConfirm ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
          @click="showConfirm = !showConfirm"
          style="position:absolute; right:10px; top:50%; transform:translateY(-50%); cursor:pointer;"
        ></i>
        <small v-if="v$.confirmPassword.$error" class="text-danger">
          Xác nhận mật khẩu phải trùng mật khẩu mới
        </small>
      </div>

      <button type="submit" class="btn btn-dark w-100">Xác nhận</button>
    </form>

    <p v-if="message" class="text-center mt-3" :class="{'text-success': success, 'text-danger': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength, sameAs } from "@vuelidate/validators";
import Swal from "sweetalert2";
import api from "@/composables/axios.js";

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const message = ref("");
const success = ref(true);

const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

// Lỗi từ server
const serverErrors = ref({
  oldPassword: "",
  newPassword: ""
});

// Cấu hình validation
const rules = {
  oldPassword: { required },
  newPassword: { required, minLength: minLength(6) },
  confirmPassword: { required, sameAsNew: sameAs(newPassword, "Mật khẩu mới") }
};

const v$ = useVuelidate(rules, { oldPassword, newPassword, confirmPassword });

const changePassword = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  serverErrors.value.oldPassword = "";
  serverErrors.value.newPassword = "";
  message.value = "";

  try {
    const res = await api.post("/auth/change-password", {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    });

    success.value = true;
    // Hiển thị Swal khi đổi mật khẩu thành công
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: res.data || "Đổi mật khẩu thành công!",
      confirmButtonColor: '#3085d6'
    });

    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    v$.value.$reset();

  } catch (err) {
    success.value = false;
    const errMsg = err.response?.data || "Đổi mật khẩu thất bại.";

    if (errMsg.includes("cũ")) {
      serverErrors.value.oldPassword = errMsg;
    } else if (errMsg.includes("mới")) {
      serverErrors.value.newPassword = errMsg;
    } else {
      message.value = errMsg;
    }
  }
};
</script>

