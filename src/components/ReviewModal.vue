<template>
  <div>
    <!-- Nút mở form -->
    <button class="btn btn-outline-primary" @click="openModal">
      📝 Đánh giá sản phẩm
    </button>

    <!-- Modal đánh giá -->
    <div v-if="show" class="modal-backdrop">
      <div class="modal-content p-4 rounded-4 shadow-lg bg-white position-relative">
        <button class="btn-close position-absolute top-0 end-0 m-3" @click="closeModal"></button>

        <h4 class="fw-bold mb-3 text-center">Đánh giá sản phẩm</h4>

        <!-- Chọn sao -->
        <div class="mb-3 text-center">
          <span
            v-for="n in 5"
            :key="n"
            @click="form.star = n"
            class="fs-3 mx-1"
            :class="n <= form.star ? 'text-warning' : 'text-secondary'"
            style="cursor:pointer"
          >★</span>
          <div class="small text-muted mt-1">Chọn số sao (1–5)</div>
        </div>

        <!-- Nhập mô tả -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Cảm nhận của bạn:</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="form-control"
            placeholder="Viết cảm nhận của bạn..."
          ></textarea>
        </div>

        <!-- Upload ảnh -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Ảnh minh họa (tối đa 3 ảnh)</label>

          <div class="d-flex flex-wrap gap-2 mt-2">
            <!-- Ảnh đã upload -->
            <div
              v-for="(img, i) in form.images"
              :key="i"
              class="image-upload border rounded-3 position-relative bg-light border-dark-subtle"
              style="width: 80px; height: 80px; cursor: pointer; overflow: hidden;"
            >
              <img
                :src="img.path"
                alt="Ảnh review"
                class="position-absolute top-0 start-0 w-100 h-100"
                style="object-fit: cover; object-position: center;"
              />
              <button
                type="button"
                class="btn btn-sm btn-danger position-absolute"
                style="top: 2px; right: 2px; padding: 0 4px;"
                @click="removeImage(i)"
              >
                ×
              </button>
            </div>

            <!-- Nút chọn ảnh -->
            <div
              v-if="form.images.length < 3"
              class="image-upload border rounded-3 d-flex flex-column align-items-center justify-content-center bg-light border-dark-subtle text-muted"
              style="width: 80px; height: 80px; cursor: pointer;"
              @click="openFilePicker"
            >
              <i class="bi bi-plus-circle fs-5"></i>
            </div>

            <!-- Input file ẩn -->
            <input
              type="file"
              class="d-none"
              accept="image/*"
              multiple
              ref="fileInput"
              @change="handleAutoUpload"
            />
          </div>

          <div v-if="isUploading" class="mt-2 small text-primary">
            Đang tải ảnh lên...
          </div>
        </div>

        <!-- Nút hành động -->
        <div class="text-center mt-4">
          <button class="btn btn-success px-4" @click="submitReview">Gửi đánh giá</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";

const props = defineProps({
  orderDetailId: { type: Number, required: true },
});

const show = ref(false);
const isUploading = ref(false);
const fileInput = ref(null);

const form = ref({
  star: 0,
  description: "",
  orderDetailId: props.orderDetailId,
  images: [],
});

const openModal = () => {
  show.value = true;
  document.body.style.overflow = "hidden";
};
const closeModal = () => {
  show.value = false;
  document.body.style.overflow = "";
};

function openFilePicker() {
  if (form.value.images.length >= 3) {
    Swal.fire("Giới hạn ảnh", "Bạn chỉ được chọn tối đa 3 ảnh", "info");
    return;
  }
  fileInput.value?.click();
}

async function handleAutoUpload(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  isUploading.value = true;
  try {
    for (const file of files.slice(0, 3 - form.value.images.length)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const path = res.data?.url || res.data?.path || res.data;
      form.value.images.push({ path });
    }
  } catch (err) {
    console.error("❌ Lỗi upload ảnh:", err);
    Swal.fire("Lỗi", "Không thể tải ảnh lên", "error");
  } finally {
    isUploading.value = false;
    event.target.value = null;
  }
}

function removeImage(index) {
  form.value.images.splice(index, 1);
}

async function submitReview() {
  if (form.value.star === 0) {
    return Swal.fire("Thiếu thông tin", "Vui lòng chọn số sao!", "warning");
  }
  if (!form.value.description.trim()) {
    return Swal.fire("Thiếu thông tin", "Vui lòng nhập nhận xét!", "warning");
  }

  try {
    const res = await axios.post("/api/review", form.value);
        console.log(form.value);
    Swal.fire("🎉 Thành công", "Cảm ơn bạn đã đánh giá!", "success");


    form.value = {
      star: 0,
      description: "",
      orderDetailId: props.orderDetailId,
      images: [],
    };

    closeModal();
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi 😥", err.response?.data?.message || "Không thể gửi đánh giá", "error");
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-content {
  width: 100%;
  max-width: 500px;
}
</style>
