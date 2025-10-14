<template>
  <div class="container my-5">
    
    <div class="mb-5">
      <h3 class="fw-bold mb-1">Chỉnh Sửa Sản Phẩm</h3>
      <p class="text-muted">Cập nhật thông tin chi tiết cho sản phẩm.</p>
    </div>

    <div v-if="successMessage" class="alert alert-success" role="alert">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="pageLoading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="mt-2">Đang tải dữ liệu sản phẩm...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit">
      <div class="row gx-4">
        <div class="col-lg-8">
          <div class="mb-3">
            <label for="name" class="form-label">Tên sản phẩm</label>
            <input type="text" class="form-control" id="name" v-model="product.name" required>
          </div>
          <div class="mb-3">
            <label for="slug" class="form-label">Đường dẫn (Slug)</label>
            <input type="text" class="form-control" id="slug" v-model="product.slug">
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Mô tả sản phẩm</label>
            <textarea class="form-control" id="description" rows="10" v-model="product.description"></textarea>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="mb-3">
            <label for="category" class="form-label">Danh mục</label>
            <select class="form-select" id="category" v-model="product.categoryId" required>
              <option disabled value="">-- Chọn danh mục --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="image" class="form-label">Thay đổi ảnh sản phẩm</label>
            <input class="form-control" type="file" id="image" @change="handleImageUpload" accept="image/*">
            <div v-if="imagePreview" class="mt-3 text-center border rounded p-2">
              <p class="text-muted small mb-1">Ảnh hiện tại:</p>
              <img :src="imagePreview" class="img-fluid rounded" alt="Xem trước ảnh" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Trạng thái</label>
            <div class="form-check form-switch p-0">
              <label class="d-flex justify-content-between align-items-center border rounded p-2">
                <span class="ms-2">{{ product.status ? "Hoạt động" : "Tạm ẩn" }}</span>
                <input class="form-check-input mx-2" type="checkbox" role="switch" id="status" v-model="product.status" style="width: 3rem; height: 1.5rem">
              </label>
            </div>
          </div>
        </div>
      </div>

      <hr class="my-4" />

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">Hủy</button>
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          {{ isSaving ? " Đang cập nhật..." : "Cập nhật Sản Phẩm" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router'; // Import hook của router
import apiClient from "@/axios.js";

const route = useRoute(); // Để lấy thông tin từ URL (params, query,...)
const router = useRouter(); // Để điều hướng trang (push, back,...)

const productId = ref(route.params.id); // Lấy ID sản phẩm từ URL, ví dụ: /.../update/123

const pageLoading = ref(true); // Trạng thái tải dữ liệu ban đầu của trang
const isSaving = ref(false);    // Trạng thái khi nhấn nút lưu
const errorMessage = ref(null);
const successMessage = ref(null);
const categories = ref([]);
const imagePreview = ref(null);

// Dữ liệu sản phẩm, ban đầu là rỗng
const product = ref({
  name: "",
  slug: "",
  description: "",
  image: "", // base64 string
  status: true,
  categoryId: "",
});

// Hàm lấy danh sách danh mục (giữ nguyên từ form Thêm mới)
const fetchCategories = async () => {
  try {
    const res = await apiClient.get("/api/category");
    categories.value = res.data.data || [];
  } catch (error) {
    console.error("Lỗi tải danh mục:", error);
    errorMessage.value = "Không thể tải danh mục.";
  }
};

// HÀM MỚI: Tải dữ liệu của sản phẩm cần sửa
const fetchProductData = async () => {
  try {
    const response = await apiClient.get(`/api/product/${productId.value}`);
    product.value = response.data; // Điền dữ liệu lấy được vào form
    imagePreview.value = response.data.image; // Hiển thị ảnh cũ (dưới dạng base64 hoặc URL)
  } catch (error) {
    console.error("Lỗi tải dữ liệu sản phẩm:", error);
    errorMessage.value = "Không thể tìm thấy sản phẩm hoặc có lỗi xảy ra.";
  }
};

// Khi component được tạo, gọi cả 2 hàm fetch để lấy dữ liệu cần thiết
onMounted(async () => {
    pageLoading.value = true;
    // Dùng Promise.all để 2 tác vụ chạy song song, giúp tăng tốc độ tải trang
    await Promise.all([
        fetchCategories(),
        fetchProductData()
    ]);
    pageLoading.value = false;
});

// Chuyển ảnh mới sang base64 (giữ nguyên)
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    product.value.image = e.target.result; // Cập nhật ảnh mới (dạng base64)
    imagePreview.value = e.target.result; // Cập nhật ảnh xem trước
  };
  reader.readAsDataURL(file);
};

// SỬA LẠI HÀM SUBMIT: Dùng phương thức PUT để cập nhật
// SỬA LẠI HÀM SUBMIT: Dùng phương thức PUT để cập nhật
const handleSubmit = async () => {
  isSaving.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  // TẠO MỘT ĐỐI TƯỢNG MỚI (payload) CHỈ CHỨA CÁC TRƯỜNG MÀ ProductRequestDTO CẦN
  const payload = {
    name: product.value.name,
    slug: product.value.slug,
    description: product.value.description,
    image: product.value.image, // base64 string
    status: product.value.status,
    categoryId: product.value.categoryId,
  };

  try {
    // Gọi API PUT, chỉ gửi đi đối tượng payload đã được làm sạch
    const response = await apiClient.put(`/api/product/${productId.value}`, payload);
    successMessage.value = `Sản phẩm "${response.data.name}" đã được cập nhật thành công!`;
     router.push("/admin/list-product");
    // Cập nhật lại dữ liệu trên form sau khi thành công để đồng bộ
    product.value = response.data;
    imagePreview.value = response.data.image;

  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data || error.message);
    errorMessage.value = error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
  } finally {
    isSaving.value = false;
  }
};

// HÀM MỚI: Xử lý nút Hủy
const cancelEdit = () => {
  router.back(); // Quay lại trang trước đó (thường là trang danh sách)
};
</script>

<style scoped>
/* CSS giữ nguyên, không cần thay đổi */
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