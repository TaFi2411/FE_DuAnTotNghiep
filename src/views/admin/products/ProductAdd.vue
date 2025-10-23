<template>
  <div class="container">
    <h2>Thêm sản phẩm mới</h2>

    <form @submit.prevent="saveProduct">
      <!-- Thông tin cơ bản -->
      <div class="mb-3">
        <label>Tên sản phẩm</label>
        <input v-model="product.name" class="form-control" />
      </div>

      <div class="mb-3">
        <label>Slug</label>
        <input v-model="product.slug" class="form-control" />
      </div>

      <div class="mb-3">
        <label>Mô tả</label>
        <textarea v-model="product.description" class="form-control"></textarea>
      </div>

      <div class="mb-3">
        <label>Ảnh sản phẩm chung (nếu có)</label>
        <input type="file" class="form-control" accept="image/*" @change="handleImageUpload" />
        <div v-if="isUploadingGlobal" class="mt-2 text-center">
          <div class="spinner-border text-primary"></div>
          <p class="text-muted mt-2 mb-0">Đang tải ảnh lên...</p>
        </div>
        <div v-if="imagePreview" class="mt-3 text-center border rounded p-2">
          <img :src="imagePreview" class="img-fluid rounded" alt="Preview" />
        </div>
      </div>

      <div class="mb-3">
        <label>Danh mục</label>
        <select v-model="product.categoryId" class="form-select">
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div class="form-check mb-3">
        <input type="checkbox" v-model="product.status" class="form-check-input" id="status" />
        <label class="form-check-label" for="status">Hoạt động</label>
      </div>

      <hr />

      <!-- Danh sách SKU -->
      <h4>Biến thể (SKU)</h4>

      <div v-for="(sku, index) in product.skus" :key="index" class="border rounded p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5>SKU #{{ index + 1 }}</h5>
          <button type="button" class="btn btn-danger btn-sm" @click="removeSku(index)">
            Xóa SKU
          </button>
        </div>

        <!-- Giá + Số lượng -->
        <div class="row mt-2">
          <div class="col-md-6 mb-3">
            <label>Giá</label>
            <input v-model.number="sku.price" class="form-control" type="number" />
          </div>

          <div class="col-md-6 mb-3">
            <label>Số lượng</label>
            <input v-model.number="sku.quantity" class="form-control" type="number" />
          </div>
        </div>

        <!-- Thuộc tính -->
        <div class="mb-3">
          <label>Thuộc tính</label>
          <div v-for="(attr, aIndex) in sku.attributes" :key="aIndex" class="d-flex align-items-center gap-2 mb-2">
            <select v-model="attr.optionAttributeId" class="form-select w-25" @change="attr.valueAttributeId = null">
              <option disabled value="">Chọn loại</option>
              <option v-for="opt in optionAttributes" :key="opt.id" :value="opt.id">
                {{ opt.name }}
              </option>
            </select>

            <select v-model="attr.valueAttributeId" class="form-select w-50" :disabled="!attr.optionAttributeId">
              <option disabled value="">Chọn giá trị</option>
              <option v-for="val in filteredValueAttributes(attr.optionAttributeId)" :key="val.id" :value="val.id">
                {{ val.name }}
              </option>
            </select>

            <button type="button" class="btn btn-sm btn-outline-danger" @click="removeAttribute(index, aIndex)">
              Xóa
            </button>
          </div>

          <button type="button" class="btn btn-outline-primary btn-sm" @click="addAttribute(index)">
            + Thêm thuộc tính
          </button>
        </div>

        <!-- Ảnh SKU -->
        <div class="mb-3">
          <label>Ảnh cho SKU</label>

          <!-- Input chọn file -->
          <input type="file" class="form-control mb-2" accept="image/*" multiple
            @change="(e) => handleSelectSkuImages(e, index)" />

          <!-- Hiển thị preview ảnh -->
          <div v-if="selectedSkuImages[index]?.length" class="d-flex gap-2 flex-wrap mt-2">
            <div v-for="(file, i) in selectedSkuImages[index]" :key="i" class="position-relative border rounded p-1"
              style="width:120px">
              <img :src="file.preview" style="width:100%; height:80px; object-fit:cover" />
              <button type="button" class="btn btn-sm btn-danger position-absolute" style="top:4px; right:4px"
                @click="removeSelectedImage(index, i)">
                x
              </button>
            </div>
          </div>

          <!-- Nút upload -->
          <button type="button" class="btn btn-outline-primary btn-sm mt-2" @click="uploadSelectedSkuImages(index)"
            :disabled="!selectedSkuImages[index]?.length || skuUploading[index]">
            <span v-if="skuUploading[index]">Đang tải...</span>
            <span v-else>📤 Thêm ảnh SKU</span>
          </button>

          <!-- Ảnh SKU đã upload -->
          <div class="d-flex gap-2 flex-wrap mt-3">
            <div v-for="(img, i) in sku.skuImages" :key="i" class="position-relative border rounded p-1"
              style="width:120px">
              <img :src="img.url" style="width:100%; height:80px; object-fit:cover" />
              <button type="button" class="btn btn-sm btn-danger position-absolute" style="top:4px; right:4px"
                @click="removeSkuImage(index, i)">
                x
              </button>
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="btn btn-outline-success mt-2" @click="addSku">+ Thêm SKU</button>

      <hr />

      <button type="submit" class="btn btn-primary">Lưu sản phẩm</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/composables/axios.js";

const product = ref({
  name: "",
  slug: "",
  description: "",
  image: "",
  status: true,
  categoryId: null,
  skus: [],
});

const imagePreview = ref(null);
const categories = ref([]);
const optionAttributes = ref([]);
const valueAttributes = ref([]);
const isUploadingGlobal = ref(false);
const skuUploading = ref({});
const selectedSkuImages = ref({});

// ======= Load dữ liệu =======
onMounted(async () => {
  const [catRes, optRes, valRes] = await Promise.all([
    axios.get("/api/category"),
    axios.get("/api/option-attribute"),
    axios.get("/api/value-attribute"),
  ]);

  categories.value = catRes.data.data ?? catRes.data;
  optionAttributes.value = optRes.data.data ?? optRes.data;
  valueAttributes.value = valRes.data.data ?? valRes.data;
});

// ======= Upload ảnh sản phẩm chính =======
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploadingGlobal.value = true;

  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    product.value.image = res.data; // backend nhận image là string
    imagePreview.value = res.data;
  } catch (err) {
    alert("Upload ảnh thất bại!");
  } finally {
    isUploadingGlobal.value = false;
  }
};

// ======= Chọn ảnh SKU (preview trước khi upload) =======
function handleSelectSkuImages(event, index) {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  selectedSkuImages.value[index] = files.map((f) => ({
    file: f,
    preview: URL.createObjectURL(f),
  }));
}

// ======= Xóa ảnh chưa upload =======
function removeSelectedImage(skuIndex, imgIndex) {
  selectedSkuImages.value[skuIndex].splice(imgIndex, 1);
  if (!selectedSkuImages.value[skuIndex].length)
    delete selectedSkuImages.value[skuIndex];
}

// ======= Upload ảnh SKU thật =======
async function uploadSelectedSkuImages(index) {
  if (!selectedSkuImages.value[index]?.length) return;
  skuUploading.value[index] = true;

  try {
    for (const img of selectedSkuImages.value[index]) {
      const formData = new FormData();
      formData.append("file", img.file);

      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ BE yêu cầu "path" chứ không phải "url"
      if (!product.value.skus[index].skuImages)
        product.value.skus[index].skuImages = [];

      product.value.skus[index].skuImages.push({ path: res.data });
    }

    delete selectedSkuImages.value[index];
  } catch (err) {
    console.error("❌ Lỗi upload ảnh SKU:", err);
    alert("Upload ảnh SKU thất bại!");
  } finally {
    skuUploading.value[index] = false;
  }
}

// ======= Xử lý SKU =======
function addSku() {
  product.value.skus.push({
    price: 0,
    quantity: 0,
    attributes: [],
    skuImages: [],
  });
}
function removeSku(index) {
  product.value.skus.splice(index, 1);
}
function addAttribute(skuIndex) {
  // ✅ BE chỉ cần valueAttributeId
  product.value.skus[skuIndex].attributes.push({
    valueAttributeId: null,
  });
}
function removeAttribute(skuIndex, attrIndex) {
  product.value.skus[skuIndex].attributes.splice(attrIndex, 1);
}
function removeSkuImage(skuIndex, imgIndex) {
  product.value.skus[skuIndex].skuImages.splice(imgIndex, 1);
}

// ======= Filter value theo option =======
function filteredValueAttributes(optionId) {
  return valueAttributes.value.filter((v) => v.optionAttributeId === optionId);
}

// ======= Lưu sản phẩm =======
async function saveProduct() {
  try {
    // 🧠 Xử lý trước khi gửi để chỉ giữ valueAttributeId
    product.value.skus.forEach((sku) => {
      sku.attributes = sku.attributes
        .filter((attr) => attr.valueAttributeId)
        .map((attr) => ({ valueAttributeId: attr.valueAttributeId }));
    });

    const res = await axios.post("/api/product", product.value);
    alert("✅ Thêm sản phẩm thành công!");
    console.log("Response:", res.data);
  } catch (err) {
    console.error("❌ Lỗi khi lưu sản phẩm:", err.response?.data || err);
    alert("❌ Lỗi khi lưu sản phẩm! Xem console để biết chi tiết.");
  }
}
</script>


<style scoped>
.container {
  max-width: 800px;
}
</style>
