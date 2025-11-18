<template>
  <div class="container py-4">
    <h3 class="fw-bold mb-4">Cập nhật sản phẩm</h3>

    <form @submit.prevent="updateProduct">
      <!-- Thông tin cơ bản -->
      <div class="row">
        <div class="col-lg-4">
          <label>Ảnh sản phẩm chung</label>
          <div class="mb-3 text-center">
            <div
              class="image-upload border rounded-4 bg-light border-dark-subtle"
              style="width: 100%; max-width: 280px; height: 280px; cursor: pointer; overflow: hidden;"
              @click="$refs.fileInput.click()"
            >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Ảnh sản phẩm"
                class="w-100 h-100 object-fit-cover"
              />
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
        <label class="fw-bold">Mô tả sản phẩm</label>
        <textarea id="descEditor"></textarea>
      </div>

      <hr />

      <!-- SKU LIST -->
      <div
        v-for="(sku, index) in product.skus"
        :key="sku.id || index"
        class="border rounded p-3 mb-3"
      >
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

        <!-- Attributes -->
        <div class="mb-3">
          <label>Thuộc tính</label>

          <div
            v-for="(attr, aIndex) in sku.attributes"
            :key="attr.id || aIndex"
            class="d-flex gap-2 mb-2"
          >
            <select
              v-model="attr.optionAttributeId"
              class="form-select w-25"
              @change="attr.valueAttributeId = ''"
            >
              <option disabled value="">Chọn loại</option>
              <option v-for="opt in optionAttributes" :key="opt.id" :value="opt.id">
                {{ opt.name }}
              </option>
            </select>

            <select
              v-model="attr.valueAttributeId"
              class="form-select w-50"
              :disabled="!attr.optionAttributeId"
            >
              <option disabled value="">Chọn giá trị</option>
              <option
                v-for="val in filteredValueAttributes(attr.optionAttributeId)"
                :key="val.id"
                :value="val.id"
              >
                {{ val.name }}
              </option>
            </select>

            <button
              class="btn btn-sm btn-outline-danger"
              type="button"
              @click="removeAttribute(index, aIndex)"
            >
              X
            </button>
          </div>

          <button class="btn btn-sm btn-outline-primary" type="button" @click="addAttribute(index)">
            + Thêm thuộc tính
          </button>
        </div>

        <!-- SKU Images -->
        <div class="mb-3">
          <label>Ảnh biến thể</label>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <div
              v-for="(img, i) in sku.skuImages"
              :key="img.id || i"
              class="position-relative border rounded overflow-hidden"
              style="width: 80px; height: 80px;"
            >
              <img :src="img.path" class="w-100 h-100 object-fit-cover" />
              <button
                type="button"
                class="btn btn-sm btn-danger position-absolute"
                style="top: 2px; right: 2px;"
                @click="removeSkuImage(index, i)"
              >
                ×
              </button>
            </div>

            <div
              class="border rounded d-flex align-items-center justify-content-center text-muted"
              style="width: 80px; height: 80px; cursor: pointer;"
              @click="openSkuFilePicker(index)"
            >
              <i class="bi bi-plus-circle fs-5"></i>
            </div>

            <input
              type="file"
              class="d-none"
              multiple
              accept="image/*"
              :ref="(el) => (skuFileInputs[index] = el)"
              @change="(e) => handleAutoUploadSkuImages(e, index)"
            />
          </div>
        </div>
      </div>

      <button type="button" class="btn btn-outline-success" @click="addSku">
        + Thêm biến thể
      </button>

      <hr />

      <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/composables/axios.js";
import { useCkeditor } from "@/composables/useCkeditor";

// CKEditor
const { content: descContent, setData: setDescData } = useCkeditor("descEditor", {
  height: 300,
});

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

const categories = ref([]);
const optionAttributes = ref([]);
const valueAttributes = ref([]);
const imagePreview = ref(null);

// Ref cho từng input SKU
const skuFileInputs = ref([]);

onMounted(async () => {
  const res = await axios.get(`/api/product/${id}`);
  const p = res.data;

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
      attributes:
        sku.skuAttributes?.map((a) => ({
          id: a.id,
          optionAttributeId: a.optionAttributeId,
          valueAttributeId: a.valueAttributeId,
        })) || [],
      skuImages:
        sku.skuImages?.map((img) => ({
          id: img.id,
          path: img.path,
        })) || [],
    })),
  };

  imagePreview.value = p.image;

  await nextTick();
  setDescData(p.description);

  // Load danh mục + thuộc tính
  const [cate, opt, val] = await Promise.all([
    axios.get("/api/category"),
    axios.get("/api/option-attribute"),
    axios.get("/api/value-attribute"),
  ]);

  categories.value = cate.data.data;
  optionAttributes.value = opt.data.data;
  valueAttributes.value = val.data.data;
});

// Helpers
function filteredValueAttributes(optionId) {
  return valueAttributes.value.filter((v) => v.optionAttributeId === optionId);
}

function openSkuFilePicker(index) {
  skuFileInputs.value[index]?.click();
}

// Upload ảnh chính
async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("file", file);

  const res = await axios.post("/api/upload", fd);
  product.value.image = res.data;
  imagePreview.value = res.data;
}

// Upload ảnh SKU
async function handleAutoUploadSkuImages(e, index) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  for (const f of files) {
    const fd = new FormData();
    fd.append("file", f);
    const res = await axios.post("/api/upload", fd);

    product.value.skus[index].skuImages.push({
      id: null,
      path: res.data,
    });
  }
}

function addSku() {
  product.value.skus.push({
    id: null,
    price: 0,
    quantity: 0,
    attributes: [],
    skuImages: [],
  });
}

function removeSku(i) {
  product.value.skus.splice(i, 1);
}

function addAttribute(i) {
  product.value.skus[i].attributes.push({
    id: null,
    optionAttributeId: "",
    valueAttributeId: "",
  });
}

function removeAttribute(i, j) {
  product.value.skus[i].attributes.splice(j, 1);
}

function removeSkuImage(i, j) {
  product.value.skus[i].skuImages.splice(j, 1);
}

// Update
async function updateProduct() {
  const payload = JSON.parse(JSON.stringify(product.value));

  payload.description = descContent.value;

  payload.skus = payload.skus.map((sku) => ({
    id: sku.id,
    price: sku.price,
    quantity: sku.quantity,
    skuImages: sku.skuImages.map((i) => ({
      id: i.id,
      path: i.path,
    })),
    attributes: sku.attributes.map((a) => ({
      id: a.id,
      valueAttributeId: a.valueAttributeId,
    })),
  }));

  await axios.put(`/api/product/${product.value.id}`, payload);

  alert("Update thành công!");
  router.push("/admin/list-product");
}
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
