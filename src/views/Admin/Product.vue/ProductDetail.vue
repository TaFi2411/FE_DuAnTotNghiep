
<template>
  <div class="container mt-4">
    <h2>Chi tiết sản phẩm</h2>
    <hr />

    <!-- Tabs -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#add">Thêm</a>
      </li>
    </ul>

    <!-- Nội dung tabs -->
    <div class="tab-content">
      <!-- Danh sách SKU -->
      <div id="list" class="container tab-pane active"><br />
        <div class="mb-3">
          <input v-model="searchKeyword" type="text" class="form-control" placeholder="Tìm kiếm theo tên chi tiết sản phẩm..." />
        </div>

        <table class="table table-bordered table-hover">
          <thead>
            <tr class="table-secondary text-center">
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sku) in filteredSkus" :key="sku.id" class="align-middle">
              <td class="text-center">{{ sku.id }}</td>
              <td class="text-center">
                <img :src="sku.image" alt="Ảnh" class="table-img rounded" />
              </td>
              <td>{{ sku.name }}</td>
              <td class="text-end">{{ sku.price.toLocaleString() }}</td>
              <td class="text-center">{{ sku.quantity }}</td>
              <td><div v-html="sku.discriptione"></div></td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning me-1" @click="editSku(sku)">Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteSku(sku.id)">Xoá</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Form thêm / sửa SKU -->
      <div id="add" class="container tab-pane fade"><br />
        <form @submit.prevent="addSku">
          <div class="mb-3">
            <label class="form-label">Sản phẩm</label>
            <select v-model="SkuRequest.productId" class="form-select" required>
              <option disabled value="">-- Chọn sản phẩm --</option>
              <option v-for="product in Products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Tên chi tiết</label>
            <input type="text" v-model="SkuRequest.name" class="form-control" required />
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Giá</label>
              <input type="number" v-model="SkuRequest.price" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Số lượng</label>
              <input type="number" v-model="SkuRequest.quantity" class="form-control" required />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Ảnh</label>
            <input type="file" class="form-control" accept="image/*" @change="handleImageFile" />
          </div>
          <div class="col-12" v-if="imagePreview">
                <label class="form-label d-block">Xem trước ảnh</label>
                <img :src="imagePreview" class="preview-img" alt="preview" @error="onImgError" width="200px" height="200px"/>
              </div>

          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <CustomTextArea v-model="SkuRequest.discriptione" />
          </div>

          <button type="submit" class="btn btn-success mt-5">Lưu biến thể</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import thư viện và component cần thiết
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import CustomTextArea from "@/components/CustomTextArea/CustomTextArea.vue";
const API_URL = 'http://localhost:8080/api/sku'

// Khai báo hằng số cấu hình Cloudinary
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/deiqvfmm0/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'kaijun_upload';

// Trạng thái và biến toàn cục
const isEditing = ref(false);
const editingId = ref(null);
const imagePreview = ref(null);
const searchKeyword = ref("");

// Danh sách sản phẩm và SKU
const Products = ref([]);
const skuList = ref([]);

// Model form SKU
const SkuRequest = ref({
  name: '',
  discriptione: '',
  imageUrl: null,
  price: 0,
  quantity: 0,
  productId: '',
   imageFile: null,
});

// Hàm upload ảnh lên Cloudinary
const handleImageFile = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Hiển thị preview ảnh
  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result;
  };
  reader.readAsDataURL(file);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(CLOUDINARY_URL, formData);
    SkuRequest.value.image = res.data.secure_url;
  } catch (err) {
    console.error("Lỗi upload Cloudinary:", err);
  }
};

// Lấy danh sách sản phẩm
const fetchProduct = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/product');
    Products.value = response.data;
  } catch (err) {
    console.error('Lỗi khi tải danh sách sản phẩm:', err);
  }
};

// Lấy danh sách SKU
const fetchSkuList = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/sku");
    skuList.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách SKU:", err);
  }
};

// Thêm
const addSku = async () => {
  let imageUrl = SkuRequest.value.image;
    if (SkuRequest.value.imageFile) {
      const formData = new FormData();
      formData.append("file", SkuRequest.value.imageFile);
      formData.append("upload_preset", "kaijun_upload");
      const res = await axios.post("https://api.cloudinary.com/v1_1/deiqvfmm0/image/upload", formData);
      imageUrl = res.data.secure_url;
    }
    const formSkuAdd = {
      name: SkuRequest.value.name,
      discriptione: SkuRequest.value.discriptione,
      image: imageUrl,
      price: SkuRequest.value.price,
      quantity: SkuRequest.value.quantity,
      productId: SkuRequest.value.productId
    }
    await axios.post(API_URL, formSkuAdd)
    ResetForm();
    await fetchSkuList()
    setTimeout(() => { document.querySelector('[href="#list"]').click() }, 100)
};


// Chỉnh sửa SKU

const editSku = (sku) => {
  isEditing.value = true;
  editingId.value = sku.id;

  SkuRequest.value = {
    name: sku.name,
    discriptione: sku.discriptione,
    image: sku.image || null,
    imageUrl: sku.image || null,
    price: sku.price,
    quantity: sku.quantity,
    productId: sku.productId,
    imageFile: null
  };
  imagePreview.value = sku.image || null;

  setTimeout(() => {
    document.querySelector('[href="#add"]')?.click();
  }, 100);
};
const updateSku    = async () => {

     const formSkuAdd = {
      name: SkuRequest.value.name,
      discriptione: SkuRequest.value.discriptione,
      image: imageUrl,
      price: SkuRequest.value.price,
      quantity: SkuRequest.value.quantity,
      productId: SkuRequest.value.productId
    }
    await axios.put(`${API_URL}/${id.value}`, updateSku)
    ResetForm()
    await fetchSkuList()
    setTimeout(() => { document.querySelector('[href="#list"]').click() }, 100)

}

// Xoá SKU
const deleteSku = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xoá SKU này không?")) return;
  try {
    await axios.delete(`http://localhost:8080/api/sku/${id}`);
    alert("Xoá thành công!");
    fetchSkuList();
  } catch (err) {
    console.error("Lỗi khi xoá SKU:", err);
    alert("Xoá thất bại!");
  }
};

// Lọc kết quả tìm kiếm
const filteredSkus = computed(() => {
  return skuList.value.filter(sku =>
    sku.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

const ResetForm = () => {
  SkuRequest.value = {
    name: '',
    description: '',
    image: '',
    price: 0,
    quantity: 0,
    productId: ''
  };
  imagePreview.value = null; 
};


// Khi component mount
onMounted(() => {
  fetchProduct();
  fetchSkuList();
});
</script>

<style scoped>
.table-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>
Đang hiển thị 149812384754486176.