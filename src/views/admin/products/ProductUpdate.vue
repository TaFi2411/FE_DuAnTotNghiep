<template>
  <div class="container">
    <form @submit.prevent="updateProduct">
      <!-- Thông tin cơ bản -->
      <div class="row">
        <div class="col-lg-4">
          <label>Ảnh sản phẩm chung</label>
          <div class="mb-3 text-center">
            <div
              class="image-upload border rounded-4 position-relative bg-light border-dark-subtle"
              style="width: 100%; max-width: 280px; height: 280px; cursor: pointer; overflow: hidden;"
              @click="$refs.fileInput.click()"
            >
              <template v-if="imagePreview">
                <img
                  :src="imagePreview"
                  alt="Ảnh sản phẩm"
                  class="position-absolute top-0 start-0 w-100 h-100 p-3"
                  style="object-fit: cover; object-position: center;"
                />
              </template>
              <template v-else>
                <div class="text-muted d-flex flex-column align-items-center justify-content-center h-100">
                  <i class="bi bi-image fs-1 mb-2"></i>
                  <small>Bấm để chọn ảnh</small>
                </div>
              </template>
            </div>

            <input
              type="file"
              accept="image/*"
              class="d-none"
              ref="fileInput"
              @change="handleImageUpload"
            />

            <div v-if="isUploadingGlobal" class="mt-2 text-center">
              <div class="spinner-border text-primary"></div>
              <p class="text-muted mt-2 mb-0">Đang tải ảnh lên...</p>
            </div>
          </div>
        </div>

        <div class="col-lg-8 mb-3">
          <div class="mb-3">
            <label>Tên sản phẩm</label>
            <input v-model="product.name" class="form-control" />
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
            <label class="form-label fw-bold d-block mb-2">Trạng thái</label>

            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="active" value="true" v-model="product.status" />
              <label class="form-check-label" for="active">Hoạt động</label>
            </div>

            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="inactive" value="false" v-model="product.status" />
              <label class="form-check-label" for="inactive">Ngưng hoạt động</label>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label>Mô tả</label>
        <textarea v-model="product.description" class="form-control"></textarea>
      </div>

      <hr />

      <!-- Danh sách SKU -->
      <div
        v-for="(sku, index) in product.skus"
        :key="sku.id || index"
        class="border rounded p-3 mb-3"
      >
        <div class="d-flex justify-content-between align-items-center">
          <h5>Biến thể sản phẩm - {{ index + 1 }}</h5>
          <button type="button" class="btn btn-danger btn-sm" @click="removeSku(index)">
            Xóa biến thể
          </button>
        </div>

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

        <div class="mb-3">
          <label>Thuộc tính</label>
          <div
            v-for="(attr, aIndex) in sku.attributes"
            :key="attr.id || aIndex"
            class="d-flex align-items-center gap-2 mb-2"
          >
            <select v-model="attr.optionAttributeId" class="form-select w-25" @change="attr.valueAttributeId = null">
              <option disabled value="">Chọn loại</option>
              <option v-for="opt in optionAttributes" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
            </select>

            <select v-model="attr.valueAttributeId" class="form-select w-50" :disabled="!attr.optionAttributeId">
              <option disabled value="">Chọn giá trị</option>
              <option
                v-for="val in filteredValueAttributes(attr.optionAttributeId)"
                :key="val.id"
                :value="val.id"
              >
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
          <label>Ảnh SKU</label>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <div
              v-for="(img, i) in sku.skuImages"
              :key="img.id || 'img-' + i"
              class="image-upload border rounded-3 position-relative bg-light border-dark-subtle"
              style="width: 80px; height: 80px; overflow: hidden;"
            >
              <img
                :src="img.url || img.path"
                alt="Ảnh SKU"
                class="position-absolute top-0 start-0 w-100 h-100"
                style="object-fit: cover;"
              />
              <button
                type="button"
                class="btn btn-sm btn-danger position-absolute"
                style="top: 2px; right: 2px; padding: 0 4px;"
                @click="removeSkuImage(index, i)"
              >
                ×
              </button>
            </div>

            <div
              class="image-upload border rounded-3 d-flex flex-column align-items-center justify-content-center bg-light border-dark-subtle text-muted"
              style="width: 80px; height: 80px; cursor: pointer;"
              @click="openSkuFilePicker(index)"
            >
              <i class="bi bi-plus-circle fs-5"></i>
            </div>

            <input
              type="file"
              class="d-none"
              accept="image/*"
              multiple
              ref="skuFileInputs"
              @change="(e) => handleAutoUploadSkuImages(e, index)"
            />
          </div>

          <div v-if="skuUploading[index]" class="mt-2 small text-primary">Đang tải ảnh lên...</div>
        </div>
      </div>

      <button type="button" class="btn btn-outline-success mt-2" @click="addSku">
        + Thêm biến thể sản phẩm
      </button>

      <hr />

      <button type="submit" class="btn btn-primary">💾 Cập nhật sản phẩm</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/composables/axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const productId = route.params.id;

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
const skuFileInputs = ref([]);

function openSkuFilePicker(index) {
  const input = skuFileInputs.value[index];
  if (input) input.click();
}

function filteredValueAttributes(optionId) {
  return valueAttributes.value.filter((v) => v.optionAttributeId === optionId);
}

// ======= LOAD DATA =======
onMounted(async () => {
  const [catRes, optRes, valRes, prodRes] = await Promise.all([
    axios.get("/api/category"),
    axios.get("/api/option-attribute"),
    axios.get("/api/value-attribute"),
    axios.get(`/api/product/${productId}`),
  ]);

  categories.value = catRes.data.data ?? catRes.data;
  optionAttributes.value = optRes.data.data ?? optRes.data;
  valueAttributes.value = valRes.data.data ?? valRes.data;

  product.value = prodRes.data;

  // ✅ Đảm bảo tất cả SKU có mảng attributes và skuImages
  product.value.skus = product.value.skus?.map((sku) => ({
    ...sku,
    attributes: sku.attributes || [],
    skuImages: sku.skuImages || [],
  })) || [];

  imagePreview.value = product.value.image;
});

// ======= UPLOAD ẢNH SẢN PHẨM =======
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  isUploadingGlobal.value = true;
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    product.value.image = res.data;
    imagePreview.value = res.data;
  } catch {
    alert("❌ Upload ảnh thất bại!");
  } finally {
    isUploadingGlobal.value = false;
  }
}

// ======= UPLOAD ẢNH SKU =======
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

      if (!product.value.skus[index].skuImages)
        product.value.skus[index].skuImages = [];

      product.value.skus[index].skuImages.push({ path: res.data });
    }
  } finally {
    skuUploading.value[index] = false;
  }
}

// ======= SKU + ATTRIBUTES =======
function addSku() {
  product.value.skus.push({ price: 0, quantity: 0, attributes: [], skuImages: [] });
}
function removeSku(index) {
  product.value.skus.splice(index, 1);
}
function addAttribute(skuIndex) {
  product.value.skus[skuIndex].attributes.push({ valueAttributeId: null });
}
function removeAttribute(skuIndex, attrIndex) {
  product.value.skus[skuIndex].attributes.splice(attrIndex, 1);
}
function removeSkuImage(skuIndex, imgIndex) {
  product.value.skus[skuIndex].skuImages.splice(imgIndex, 1);
}

// ======= CẬP NHẬT SẢN PHẨM =======
async function updateProduct() {
  try {
    product.value.skus.forEach((sku) => {
      // ✅ Đảm bảo luôn có mảng attributes
      if (!Array.isArray(sku.attributes)) sku.attributes = [];

      sku.attributes = sku.attributes
        .filter((attr) => attr.valueAttributeId)
        .map((attr) => ({
          id: attr.id,
          valueAttributeId: attr.valueAttributeId,
        }));
    });

    const res = await axios.put(`/api/product/${productId}`, product.value);
    alert("✅ Cập nhật sản phẩm thành công!");
    router.push("/admin/list-product");
    console.log("Response:", res.data);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật sản phẩm:", err.response?.data || err);
    alert("❌ Lỗi khi cập nhật sản phẩm!");
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
