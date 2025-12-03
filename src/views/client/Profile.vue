<template>
  <div class="profile-page container py-5">
    <h2 class="text-center mb-4 fw-bold">Thông tin cá nhân</h2>

    <form @submit.prevent="updateProfile" class="profile-form mx-auto">
      <div class="text-center mb-4">
        <div class="avatar-wrapper" @click="openFilePicker">
          <img
            :src="previewAvatar || defaultAvatar"
            class="avatar"
            alt="Avatar"
          />
          <div class="overlay">Chọn ảnh</div>
        </div>
        <input
          type="file"
          accept="image/*"
          class="d-none"
          ref="fileInput"
          @change="handleImageUpload"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Họ và tên</label>
        <input
          v-model="form.fullname"
          type="text"
          class="form-control"
          placeholder="Nhập họ và tên"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          :value="profile?.email"
          class="form-control"
          disabled
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input
          v-model="form.phone"
          type="text"
          class="form-control"
          maxlength="10"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <div class="mb-4">
        <label class="form-label">Giới tính</label>
        <select v-model="form.gender" class="form-select">
          <option :value="true">Nam</option>
          <option :value="false">Nữ</option>
        </select>
      </div>

      <div class="d-flex gap-2">
        <button
          class="btn btn-primary flex-grow-1"
          type="submit"
          :disabled="!isModified"
        >
          Cập nhật
        </button>
        <button
          class="btn btn-outline-secondary flex-grow-1"
          type="button"
          @click="resetForm"
        >
          Hủy
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";

const profile = ref(null);
const defaultAvatar = "/userDefault.jpg";

const form = ref({
  avatar: null,
  fullname: "",
  phone: "",
  gender: true,
});

const previewAvatar = ref(null);
const fileInput = ref(null);

const openFilePicker = () => {
  fileInput.value.click();
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    form.value.avatar = res.data;
    previewAvatar.value = res.data;
  } catch (err) {
    Swal.fire("Lỗi", "Upload ảnh thất bại!", "error");
  }
};

function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    return JSON.parse(atob(base64Url));
  } catch {
    return null;
  }
}

const token = localStorage.getItem("token");
const payload = token ? decodeJwtToken(token) : null;
const accountId = payload?.id;

const fetchProfile = async () => {
  try {
    const res = await axios.get(`/api/account/${accountId}`);
    profile.value = res.data;

    form.value.fullname = res.data.fullname;
    form.value.phone = res.data.phone;
    form.value.gender = res.data.gender;
    form.value.avatar = res.data.avatar;

    previewAvatar.value = res.data.avatar || defaultAvatar;
  } catch {
    Swal.fire("Lỗi", "Không thể tải thông tin!", "error");
  }
};

const updateProfile = async () => {
  try {
    const payload = {
      fullname: form.value.fullname,
      email: profile.value.email,
      password: profile.value.password,
      active: profile.value.active,
      role: profile.value.role,
      phone: form.value.phone,
      gender: form.value.gender,
    };

    if (form.value.avatar) payload.avatar = form.value.avatar;

    const res = await axios.put(`/api/account/${accountId}`, payload);

    Swal.fire("Thành công", "Cập nhật thông tin thành công!", "success");

    profile.value = res.data;
    previewAvatar.value = res.data.avatar || defaultAvatar;
    window.dispatchEvent(new CustomEvent('avatar-updated', { detail: res.data.avatar }));

  } catch (err) {
    Swal.fire("Lỗi", "Cập nhật thất bại!", "error");
  }
};

const resetForm = () => {
  if (!profile.value) return;
  form.value.fullname = profile.value.fullname;
  form.value.phone = profile.value.phone;
  form.value.gender = profile.value.gender;
  form.value.avatar = profile.value.avatar;
  previewAvatar.value = profile.value.avatar || defaultAvatar;
};

const isModified = computed(() => {
  if (!profile.value) return false;
  return (
    form.value.fullname !== profile.value.fullname ||
    form.value.phone !== profile.value.phone ||
    form.value.gender !== profile.value.gender ||
    form.value.avatar !== profile.value.avatar
  );
});

onMounted(fetchProfile);

</script>

<style scoped>
.profile-page {
  max-width: 600px;
}

.avatar-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #000000;
}

.avatar-wrapper img.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.3s;
}

.avatar-wrapper:hover img.avatar {
  transform: scale(1.05);
}

.avatar-wrapper .overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 0.8rem;
  padding: 4px 0;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .overlay {
  opacity: 1;
}

.profile-form input,
.profile-form select {
  border-radius: 8px;
}

.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
