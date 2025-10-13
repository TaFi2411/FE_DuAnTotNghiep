<template>
  <div class="container my-5">
    <div class="mb-5">
      <h3 class="fw-bold mb-1">Thêm Sản Phẩm Mới</h3>
      <p class="text-muted">Điền thông tin chi tiết cho sản phẩm của bạn.</p>
    </div>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="row gx-4">
        <div class="col-lg-8">
          <div class="mb-3">
            <label for="name" class="form-label">Tên sản phẩm</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="product.name"
              placeholder="Ví dụ: Áo Sơ Mi Trắng"
              required
            />
          </div>

          <div class="mb-3">
            <label for="slug" class="form-label">Đường dẫn (Slug)</label>
            <input
              type="text"
              class="form-control"
              id="slug"
              v-model="product.slug"
              placeholder="vi-du-ao-so-mi-trang"
            />
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Mô tả sản phẩm</label>
            <textarea
              class="form-control"
              id="description"
              rows="10"
              v-model="product.description"
              placeholder="Mô tả chi tiết về sản phẩm..."
            ></textarea>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="mb-3">
            <label for="category" class="form-label">Danh mục</label>
            <select
              id="category"
              class="form-select"
              v-model="product.categoryId"
              required
            >
              <option disabled value="">
                {{ categories.length > 0 ? "-- Chọn danh mục --" : "Đang tải danh mục..." }}
              </option>
              <option
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="image" class="form-label">Ảnh sản phẩm</label>
            <input
              class="form-control"
              type="file"
              id="image"
              @change="handleImageUpload"
              accept="image/*"
            />
            <div v-if="imagePreview" class="mt-3 text-center border rounded p-2">
              <img :src="imagePreview" class="img-fluid rounded" alt="Xem trước ảnh" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Trạng thái</label>
            <div class="form-check form-switch p-0">
              <label
                class="d-flex justify-content-between align-items-center border rounded p-2"
              >
                <span class="ms-2">{{ product.status ? "Hoạt động" : "Tạm ẩn" }}</span>
                <input
                  class="form-check-input mx-2"
                  type="checkbox"
                  role="switch"
                  id="status"
                  v-model="product.status"
                  style="width: 3rem; height: 1.5rem"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <hr class="my-4" />

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-secondary" @click="resetForm">
          Hủy
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            aria-hidden="true"
          ></span>
          {{ isLoading ? " Đang lưu..." : "Lưu Sản Phẩm" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/axios.js";

const isLoading = ref(false);
const errorMessage = ref(null);
const categories = ref([]);
const imagePreview = ref(null);

const getInitialProductState = () => ({
  name: "",
  slug: "",
  description: "",
  image: "", // base64 string
  status: true,
  categoryId: "",
});

const product = ref(getInitialProductState());

// ✅ Lấy danh mục từ API
const fetchCategories = async () => {
  try {
    const res = await apiClient.get("/api/category");
    categories.value = res.data.data || [];
  } catch (error) {
    console.error("Lỗi tải danh mục:", error);
    errorMessage.value = "Không thể tải danh mục. Vui lòng thử lại sau.";
  }
};
onMounted(fetchCategories);

// ✅ Chuyển ảnh sang base64
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    product.value.image = e.target.result; // base64 string
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

// ✅ Gửi JSON chứ không dùng FormData
const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await apiClient.post("/api/product", product.value);
    console.log("Sản phẩm đã được tạo:", response.data);
    alert("Tạo sản phẩm thành công!");
    resetForm();
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩmdđ:", error.response?.data || error.message);
    errorMessage.value =
      error.response?.data?.message || "Tạo sản phẩm thất bại. Vui lòng thử lại.";
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  product.value = getInitialProductState();
  imagePreview.value = null;
  const imageInput = document.getElementById("image");
  if (imageInput) imageInput.value = "";
};
</script>

<style scoped>
.form-label {
  font-weight: 500;
  color: #495057;
}

.form-control:focus,
.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.img-fluid {
  max-height: 200px;
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}
</style>
