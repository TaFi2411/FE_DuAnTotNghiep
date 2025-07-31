<template>
  <div>
    <div class="container mt-3">
      <h2>Sản phẩm</h2>
      <br />

      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item">
          <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-black" data-bs-toggle="tab" href="#form">Thêm sản phẩm</a>
        </li>
      </ul>

      <div class="tab-content">
        <!-- DANH SÁCH -->
        <div id="list" class="container tab-pane active"><br />
          <table class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th style="width: 70px;">ID</th>
                <th style="width: 110px;">Ảnh</th>
                <th>Tên sản phẩm</th>
                <th style="width: 160px;">Thương hiệu</th>
                <th style="width: 180px;">Loại</th>
                <th style="width: 150px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sp in products" :key="sp.id">
                <td>{{ sp.id }}</td>
                <td>
                  <img class="table-img" :src="firstImage(sp)" :alt="sp.name" @error="onImgError" />
                </td>
                <td>{{ sp.name }}</td>
                <td>{{ sp.brand || 'Apple' }}</td>
                <td>{{ getCategoryName(sp.categoryId) }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-1" @click="editProduct(sp)">Sửa</button>
                  <button class="btn btn-sm btn-danger" @click="deleteProduct(sp.id)">Xoá</button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="6" class="text-center py-4">Chưa có sản phẩm.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- FORM -->
        <div id="form" class="container tab-pane fade"><br />
          <form @submit.prevent="addOrUpdateProduct">
            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label">Tên sản phẩm</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>

              <div class="col-md-4">
                <label class="form-label">Thương hiệu</label>
                <input type="text" class="form-control" value="Apple" disabled />
              </div>

              <div class="col-md-6">
                <label class="form-label">Loại sản phẩm</label>
                <select v-model="form.categoryId" class="form-select" required>
                  <option disabled value="">-- Chọn loại sản phẩm --</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">Ảnh sản phẩm</label>
                <input type="file" class="form-control" accept="image/*" @change="handleImageFile" />
              </div>

              <div class="col-12" v-if="imagePreview">
                <label class="form-label d-block">Xem trước ảnh</label>
                <img :src="imagePreview" class="preview-img" alt="preview" @error="onImgError" />
              </div>

              <div class="col-12 d-flex gap-2">
                <button type="submit" class="btn btn-primary" :disabled="submitting">
                  {{ form.id ? 'Cập nhật' : submitting ? 'Đang lưu...' : 'Thêm sản phẩm' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="resetForm" :disabled="submitting">Huỷ</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/deiqvfmm0/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'kaijun_upload';

const CATEGORY_API = "http://localhost:8080/api/category";
const PRODUCT_API = "http://localhost:8080/api/product";

const categories = ref([]);
const products = ref([]);

const form = ref({
  id: null,
  name: "",
  brand: "Apple",
  categoryId: "",
  imageFile: null,
  imageUrl: null
});

const imagePreview = ref(null);
const submitting = ref(false);

const placeholderDataUrl =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
      <rect width='100%' height='100%' fill='#eee'/>
      <text x='50%' y='50%' font-size='10' fill='#888' text-anchor='middle' dominant-baseline='central'>No Image</text>
    </svg>`
  );

const fetchCategories = async () => {
  const res = await axios.get(CATEGORY_API);
  categories.value = res.data || [];
};

const fetchProducts = async () => {
  const res = await axios.get(PRODUCT_API);
  products.value = (res.data || []).sort((a, b) => b.id - a.id);
};

const handleImageFile = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  form.value.imageFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await axios.post(CLOUDINARY_URL, formData);
  return res.data.secure_url;
};

const addOrUpdateProduct = async () => {
  try {
    submitting.value = true;

    let imageUrl = form.value.imageUrl;

    if (form.value.imageFile) {
      imageUrl = await uploadToCloudinary(form.value.imageFile);
    }

    const payload = {
      name: form.value.name,
      brand: form.value.brand,
      categoryId: form.value.categoryId,
      image: imageUrl
    };

    if (form.value.id) {
      await axios.put(`${PRODUCT_API}/${form.value.id}`, payload);
      alert("Đã cập nhật sản phẩm!");
    } else {
      await axios.post(PRODUCT_API, payload);
      alert("Đã thêm sản phẩm!");
    }

    await fetchProducts();
    resetForm();
  } catch (err) {
    console.error(err);
    alert("Lỗi khi xử lý sản phẩm.");
  } finally {
    submitting.value = false;
  }
};

const resetForm = () => {
  form.value = {
    id: null,
    name: "",
    brand: "Apple",
    categoryId: "",
    imageFile: null,
    imageUrl: null
  };
  imagePreview.value = null;
};

const editProduct = (sp) => {
  form.value = {
    id: sp.id,
    name: sp.name,
    brand: sp.brand,
    categoryId: sp.categoryId,
    imageFile: null,
    imageUrl: sp.image || null
  };
  imagePreview.value = sp.image || null;

  // Chuyển tab sang form
  setTimeout(() => {
    const tab = document.querySelector('[href="#form"]');
    if (tab) tab.click();
  }, 100);
};

const deleteProduct = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;

  try {
    await axios.delete(`${PRODUCT_API}/${id}`);
    await fetchProducts();
    alert("Đã xoá sản phẩm.");
  } catch (err) {
    console.error(err);
    alert("Lỗi khi xoá sản phẩm.");
  }
};

const firstImage = (sp) => {
  return sp?.image || placeholderDataUrl;
};

const getCategoryName = (id) => {
  return categories.value.find((cat) => cat.id === id)?.name || "Không rõ";
};

const onImgError = (e) => {
  e.target.onerror = null;
  e.target.src = placeholderDataUrl;
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<style scoped>
.table-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: .5rem;
  border: 1px solid #e9ecef;
}
.preview-img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: .75rem;
  border: 1px solid #e9ecef;
}
</style>
