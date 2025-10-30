<template>
  <div class="container py-4">
    <h3 class="fw-bold mb-4">Cập nhật sản phẩm</h3>

    <form @submit.prevent="updateProduct">
      <!-- Thông tin cơ bản -->
      <div class="row">
        <div class="col-lg-4">
          <label>Ảnh sản phẩm chung</label>
          <div class="mb-3 text-center">
            <div class="image-upload border rounded-4 bg-light border-dark-subtle"
              style="width: 100%; max-width: 280px; height: 280px; cursor: pointer; overflow: hidden;"
              @click="$refs.fileInput.click()">
              <img v-if="imagePreview" :src="imagePreview" alt="Ảnh sản phẩm" class="w-100 h-100 object-fit-cover" />
              <div v-else class="text-muted d-flex flex-column align-items-center justify-content-center h-100">
                <i class="bi bi-image fs-1 mb-2"></i>
                <small>Bấm để chọn ảnh</small>
              </div>
            </div>
            <input type="file" class="d-none" ref="fileInput" accept="image/*" @change="handleImageUpload" />
          </div>
        </div>

        <div class="col-lg-8">
          <div class="mb-3">
            <label>Tên sản phẩm</label>
            <input v-model="product.name" class="form-control" type="text" />
          </div>

          <div class="mb-3">
            <label>Slug</label>
            <input v-model="product.slug" class="form-control" type="text" disabled />
          </div>

          <div class="mb-3">
            <label>Danh mục</label>
            <select v-model="product.categoryId" class="form-select">
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Trạng thái</label><br />
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="true" v-model="product.status" /> Hoạt động
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="false" v-model="product.status" /> Ngưng hoạt động
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label>Mô tả</label>
        <textarea v-model="product.description" class="form-control"></textarea>
      </div>

      <hr />

      <!-- DANH SÁCH SKU -->
      <div v-for="(sku, index) in product.skus" :key="sku.id || index" class="border rounded p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5>Biến thể sản phẩm {{ index + 1 }}</h5>
          <button type="button" class="btn btn-danger btn-sm" @click="removeSku(index)">Xóa</button>
        </div>

        <div class="row">
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
          <div v-for="(attr, aIndex) in sku.attributes" :key="attr.id || aIndex" class="d-flex gap-2 mb-2">
            <select v-model="attr.optionAttributeId" class="form-select w-25" @change="attr.valueAttributeId = ''">
              <option disabled value="">Chọn loại</option>
              <option v-for="opt in optionAttributes" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
            </select>

            <select v-model="attr.valueAttributeId" class="form-select w-50" :disabled="!attr.optionAttributeId">
              <option disabled value="">Chọn giá trị</option>
              <option v-for="val in filteredValueAttributes(attr.optionAttributeId)" :key="val.id" :value="val.id">
                {{ val.name }}
              </option>
            </select>

            <button class="btn btn-sm btn-outline-danger" type="button"
              @click="removeAttribute(index, aIndex)">X</button>
          </div>

          <button class="btn btn-sm btn-outline-primary" type="button" @click="addAttribute(index)">
            + Thêm thuộc tính
          </button>
        </div>

        <!-- Ảnh SKU -->
        <div class="mb-3">
          <label>Ảnh biến thể</label>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <div v-for="(img, i) in sku.skuImages" :key="img.id || i"
              class="position-relative border rounded overflow-hidden" style="width: 80px; height: 80px;">
              <img :src="img.url || img.path" class="w-100 h-100 object-fit-cover" />
              <button type="button" class="btn btn-sm btn-danger position-absolute" style="top: 2px; right: 2px;"
                @click="removeSkuImage(index, i)">
                ×
              </button>
            </div>

            <div class="border rounded d-flex align-items-center justify-content-center text-muted"
              style="width: 80px; height: 80px; cursor: pointer;" @click="openSkuFilePicker(index)">
              <i class="bi bi-plus-circle fs-5"></i>
            </div>
            <input type="file" multiple class="d-none" accept="image/*" ref="skuFileInputs"
              @change="(e) => handleAutoUploadSkuImages(e, index)" />
          </div>
        </div>
      </div>

      <button type="button" class="btn btn-outline-success" @click="addSku">+ Thêm biến thể</button>

      <hr />
      <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/composables/axios.js";
const route = useRoute();
const router = useRouter();
const id = route.params.id;

const product = ref({
  id: null,
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
const skuFileInputs = ref([]);
const skuUploading = ref({});
console.log(categories)
onMounted(async () => {
  try {
    // --- Lấy sản phẩm ---
    const response = await axios.get(`/api/product/${id}`);
    const p = response.data;

    // Map dữ liệu từ backend -> FE
    product.value = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      image: p.image,
      status: p.status,
      categoryId: p.categoryId,
      skus: p.skus.map((sku) => ({
        id: sku.id,
        price: sku.price,
        quantity: sku.quantity,

        attributes: sku.skuAttributes?.map((attr) => ({
          id: attr.id,
          optionAttributeId: attr.optionAttributeId,
          valueAttributeId: attr.valueAttributeId,
          optionAttributeName: attr.optionAttributeName,
          valueAttributeName: attr.valueAttributeName,
        })) || [],
        skuImages: sku.skuImages?.map((img) => ({
          id: img.id,
          path: img.path,
        })) || [],
      })),
    };

    imagePreview.value = p.image;

    const [ cateRes,optionRes, valueRes] = await Promise.all([
      
      axios.get("/api/category"),
      axios.get("/api/option-attribute"),
      axios.get("/api/value-attribute"),
    ]);
    
    categories.value = cateRes.data.data;
    optionAttributes.value = optionRes.data.data;
    valueAttributes.value = valueRes.data.data;

    console.log(categories.value, optionAttributes.value, valueAttributes.value);
  } catch (err) {
    console.error("❌ Lỗi khi tải sản phẩm:", err);
  }
});

// -------------------- HÀM PHỤ TRỢ --------------------
function filteredValueAttributes(optionId) {
  return valueAttributes.value.filter((v) => v.optionAttributeId === optionId);
}

function openSkuFilePicker(index) {
  const input = skuFileInputs.value[index];
  if (input) input.click();
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  product.value.image = res.data;
  imagePreview.value = res.data;
}

async function handleAutoUploadSkuImages(event, index) {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  skuUploading.value[index] = true;
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      product.value.skus[index].skuImages.push({ path: res.data });
    }
  } finally {
    skuUploading.value[index] = false;
  }
}

function addSku() {
  product.value.skus.push({ price: 0, quantity: 0, attributes: [], skuImages: [] });
}
function removeSku(index) {
  product.value.skus.splice(index, 1);
}
function addAttribute(skuIndex) {
  product.value.skus[skuIndex].attributes.push({ optionAttributeId: "", valueAttributeId: "" });
}
function removeAttribute(skuIndex, attrIndex) {
  product.value.skus[skuIndex].attributes.splice(attrIndex, 1);
}
function removeSkuImage(skuIndex, imgIndex) {
  product.value.skus[skuIndex].skuImages.splice(imgIndex, 1);
}

// -------------------- UPDATE PRODUCT --------------------
async function updateProduct() {
  try {
    const payload = JSON.parse(JSON.stringify(product.value));

    // ⚠️ Xóa field id ở payload nếu backend không có trong ProductRequestDTO
    delete payload.id;

    // Map lại sku -> đúng cấu trúc backend
    payload.skus = payload.skus.map((sku) => ({
      id: sku.id, // Giữ id SKU để update
      price: sku.price,
      quantity: sku.quantity,
      skuImages: sku.skuImages.map((img) => ({
        id: img.id,
        path: img.path,
      })),
      attributes: sku.attributes.map((attr) => ({
        id: attr.id,
        skuId: attr.skuId,
        valueAttributeId: attr.valueAttributeId,
      })),
    }));

    console.log("📦 Payload gửi đi:", payload);

    await axios.put(`/api/product/${product.value.id}`, payload);
    alert("✅ Cập nhật sản phẩm thành công!");
    router.push("/admin/list-product");
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật:", err.response?.data || err);
    alert("❌ Lỗi khi cập nhật sản phẩm!");
  }
}
</script>


<style scoped>
.container {
  max-width: 1000px;
}
</style>
