<template>
  <div class="container">
    <form @submit.prevent="saveProduct">
      <!-- Thông tin cơ bản -->
      <div class="row">
        <div class="col-lg-4">
          <label>Ảnh sản phẩm chung (nếu có)</label>
          <div class="mb-3 text-center">
            <!-- Khung chọn ảnh -->
            <div class="image-upload border rounded-4 position-relative bg-light border-dark-subtle"
              style="width: 100%; max-width: 280px; height: 280px; cursor: pointer; overflow: hidden; background-color: #f8f9fa;"
              @click="$refs.fileInput.click()">
              <!-- Ảnh preview -->
              <template v-if="imagePreview">
                <img :src="imagePreview" alt="Ảnh sản phẩm" class="position-absolute top-0 start-0 w-100 h-100 p-3"
                  style="object-fit: cover; object-position: center;" />
              </template>

              <!-- Khi chưa có ảnh -->
              <template v-else>
                <div class="text-muted d-flex flex-column align-items-center justify-content-center h-100">
                  <i class="bi bi-image fs-1 mb-2"></i>
                  <small>Bấm để chọn ảnh</small>
                </div>
              </template>
            </div>

            <!-- Input file ẩn -->
            <input type="file" accept="image/*" class="d-none" ref="fileInput" @change="handleImageUpload" />

            <!-- Loading -->
            <div v-if="isUploadingGlobal" class="mt-2 text-center">
              <div class="spinner-border text-primary"></div>
              <p class="text-muted mt-2 mb-0">Đang tải ảnh lên...</p>
            </div>

            <small class="text-danger" v-if="v$.image.$error">
              <span v-if="v$.image.required.$invalid">Ảnh không bỏ trống</span>
            </small>
          </div>
        </div>

        <div class="col-lg-8 mb-3">
          <div class="mb-3">
            <label>Tên sản phẩm</label>
            <input v-model="product.name" class="form-control" type="text" />

            <small class="text-danger" v-if="v$.name.$error">
              <span v-if="v$.name.required.$invalid">Tên không bỏ trống</span>
              <span v-else-if="v$.name.minLength.$invalid">Tên ít nhất 3 ký tự.</span>
            </small>

          </div>

          <div class="mb-3">
            <label>Slug</label>
            <input v-model="product.slug" class="form-control" type="text" disabled />
          </div>


          <div class="mb-3">
            <label>Danh mục</label>
            <select v-model="product.categoryId" class="form-select">
              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>

            <small class="text-danger" v-if="v$.categoryId.$error">
              <span v-if="v$.categoryId.required.$invalid">Vui lòng chọn danh mục</span>
            </small>

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
        <small class="text-danger" v-if="v$.description.$error">
          <span v-if="v$.description.required.$invalid">Mô tả không bỏ trống</span>
          <span v-else-if="v$.description.minLength.$invalid">Mô tả ít nhất 6 ký tự.</span>
        </small>

      </div>

      <hr />

      <!-- Danh sách SKU -->


      <div v-for="(sku, index) in product.skus" :key="index" class="border rounded p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5>Biến thể sản phẩm - {{ index + 1 }}</h5>
          <button type="button" class="btn btn-danger btn-sm" @click="removeSku(index)">
            Xóa biến thể
          </button>
        </div>

        <!-- Giá + Số lượng -->
        <div class="row mt-2">
          <div class="col-md-6 mb-3">
            <label>Giá</label>
            <input v-model.number="sku.price" class="form-control" type="text" placeholder="xxx.xxx.xxx" />

            <small v-if="v$.skus[index]?.price?.$error" class="text-danger">
              <span v-if="v$.skus[index].price.required.$invalid">Giá không được bỏ trống</span>
              <span v-else-if="v$.skus[index].price.numeric.$invalid">Giá phải là số</span>
            </small>




          </div>

          <div class="col-md-6 mb-3">
            <label>Số lượng</label>
            <input v-model.number="sku.quantity" class="form-control" type="number" />
            <small v-if="v$.skus[index]?.quantity?.$error" class="text-danger">
            <span v-if="v$.skus[index].quantity.required.$invalid">Số lượng không được bỏ trống</span>
            <span v-else-if="v$.skus[index].quantity.numeric.$invalid">Số lượng phải là số</span>
          </small>
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

        <!-- Ảnh SKU (Tự upload ngay khi chọn) -->
        <div class="mb-3">
          <label>Ảnh cho biến thể sản phẩm</label>

          <div class="d-flex flex-wrap gap-2 mt-2">
            <!-- Ảnh đã upload -->
            <div v-for="(img, i) in sku.skuImages" :key="'uploaded-' + i"
              class="image-upload border rounded-3 position-relative bg-light border-dark-subtle"
              style="width: 80px; height: 80px; cursor: pointer; overflow: hidden;">
              <img :src="img.url || img.path" alt="Ảnh SKU" class="position-absolute top-0 start-0 w-100 h-100"
                style="object-fit: cover; object-position: center;" />
              <button type="button" class="btn btn-sm btn-danger position-absolute"
                style="top: 2px; right: 2px; padding: 0 4px;" @click="removeSkuImage(index, i)">
                ×
              </button>
            </div>

            <!-- Nút chọn ảnh -->
            <div
              class="image-upload border rounded-3 d-flex flex-column align-items-center justify-content-center bg-light border-dark-subtle text-muted"
              style="width: 80px; height: 80px; cursor: pointer;" @click="openSkuFilePicker(index)">
              <i class="bi bi-plus-circle fs-5"></i>
            </div>

            <!-- Input file ẩn -->
            <input type="file" class="d-none" accept="image/*" multiple ref="skuFileInputs"
              @change="(e) => handleAutoUploadSkuImages(e, index)" />
          </div>

          <div v-if="skuUploading[index]" class="mt-2 small text-primary">
            Đang tải ảnh lên...
          </div>
        </div>
      </div>

      <button type="button" class="btn btn-outline-success mt-2" @click="addSku">
        + Thêm biến thể sản phẩm
      </button>

      <hr />

      <button type="submit" class="btn btn-primary">Lưu sản phẩm</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "@/composables/axios.js";
import router from "@/router";
import useVuelidate from '@vuelidate/core';
import { required, minLength, numeric, helpers } from '@vuelidate/validators';


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

function toSlug(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

watch(
  () => product.value.name,
  (newVal) => {
    product.value.slug = toSlug(newVal);
  }
);

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
    product.value.image = res.data;
    imagePreview.value = res.data;
  } catch (err) {
    alert("Upload ảnh thất bại!");
  } finally {
    isUploadingGlobal.value = false;
  }
};

// ======= Upload ảnh SKU tự động =======
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
  } catch (err) {
    console.error("❌ Lỗi upload ảnh SKU:", err);
    alert("Upload ảnh SKU thất bại!");
  } finally {
    skuUploading.value[index] = false;
    event.target.value = "";
  }
}

// ======= Xử lý SKU =======
function addSku() {
  product.value.skus.push({
    price: null,
    quantity: null,
    attributes: [],
    skuImages: [],
  });
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

function filteredValueAttributes(optionId) {
  return valueAttributes.value.filter((v) => v.optionAttributeId === optionId);
}


import { computed } from "vue";

const rules = computed(() => {
  const baseRules = {
    name: { required, minLength: minLength(3) },
    slug: { required },
    image: { required },
    categoryId: { required },
    description: { required, minLength: minLength(6) },
    skus: [],
  };

  // Tạo rule cho từng SKU theo index
  product.value.skus.forEach((sku, index) => {
    baseRules.skus[index] = {
      price: { required, numeric },
      quantity: { required, numeric },
      attributes: [],
    };

    // Tạo rule cho từng thuộc tính trong SKU
    sku.attributes.forEach((attr, aIndex) => {
      baseRules.skus[index].attributes[aIndex] = {
        optionAttributeId: { required },
        valueAttributeId: { required },
      };
    });
  });

  return baseRules;
});





// Sử dụng Vuelidate
const v$ = useVuelidate(rules, product);

// ======= Lưu sản phẩm =======
async function saveProduct() {
  v$.value.$validate();
  if (v$.value.$error) {
    return;
  }
  try {
    product.value.skus.forEach((sku) => {
      sku.attributes = sku.attributes
        .filter((attr) => attr.valueAttributeId)
        .map((attr) => ({ valueAttributeId: attr.valueAttributeId }));
    });

    const res = await axios.post("/api/product", product.value);
    alert("✅ Thêm sản phẩm thành công!");
    router.push("/admin/list-product");
    console.log("Response:", res.data);
  } catch (err) {
    console.error("❌ Lỗi khi lưu sản phẩm:", err.response?.data || err);
    alert("❌ Lỗi khi lưu sản phẩm!");
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
