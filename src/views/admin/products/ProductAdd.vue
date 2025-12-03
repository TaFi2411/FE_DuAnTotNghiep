<template>
  <div class="container">
    <form @submit.prevent="saveProduct">

      <div class="row">
        <div class="col-lg-4">
          <label>Ảnh sản phẩm chung (nếu có)</label>
          <div class="mb-3 text-center">
            <div class="image-upload border rounded-4 position-relative bg-light border-dark-subtle" style="
                width: 100%;
                max-width: 280px;
                height: 280px;
                cursor: pointer;
                overflow: hidden;
                background-color: #f8f9fa;
              " @click="$refs.fileInput.click()">
              <template v-if="imagePreview">
                <img :src="imagePreview" alt="Ảnh sản phẩm" class="position-absolute top-0 start-0 w-100 h-100 p-3"
                  style="object-fit: cover; object-position: center" />
              </template>

              <template v-else>
                <div class="text-muted d-flex flex-column align-items-center justify-content-center h-100">
                  <i class="bi bi-image fs-1 mb-2"></i>
                  <small>Bấm để chọn ảnh</small>
                </div>
              </template>
            </div>

            <input type="file" accept="image/*" class="d-none" ref="fileInput" @change="handleImageUpload" />

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
              <option value="" disabled>-- Chọn danh mục --</option>
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
              <input class="form-check-input" type="radio" id="active" :value="true" v-model="product.status" />
              <label class="form-check-label" for="active">Hoạt động</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="inactive" :value="false" v-model="product.status" />
              <label class="form-check-label" for="inactive">Ngưng hoạt động</label>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label>Mô tả</label>

        <!-- CKEditor -->
        <textarea id="descEditor"></textarea>

        <small class="text-danger" v-if="v$.description.$error">
          <span v-if="v$.description.required.$invalid">Mô tả không bỏ trống</span>
          <span v-else-if="v$.description.minLength.$invalid">Mô tả ít nhất 6 ký tự.</span>
        </small>
      </div>



      <hr />


      <div class="mb-3 border rounded p-3 mb-4">
        <h5>Chọn thuộc tính để sinh biến thể</h5>
        <small class="text-muted">Ví dụ: Màu, Size, Dung lượng...</small>

        <div class="d-flex flex-wrap gap-2 mb-3 mt-2">
          <label v-for="opt in optionAttributes" :key="opt.id" class="btn btn-outline-secondary btn-sm">
            <input type="checkbox" :value="opt.id" v-model="selectedOptionIds" class="me-1" />
            {{ opt.name }}
          </label>
        </div>

        <div v-for="optId in selectedOptionIds" :key="optId" class="mb-2">
          <div class="fw-bold">{{ findOptionName(optId) }}</div>
          <div class="d-flex flex-wrap gap-2 mt-1">
            <label v-for="val in filteredValueAttributes(optId)" :key="val.id" class="btn btn-sm border">
              <input type="checkbox" :value="val.id" v-model="selectedValues[optId]" class="me-1" />
              {{ val.name }}
            </label>
          </div>
        </div>

        <div class="mt-3">
          <button type="button" class="btn btn-dark btn-sm me-2" @click="generateSkusFromSelections">
            Sinh biến thể
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="clearSelections">
            Xóa lựa chọn
          </button>
          <p class="small text-muted mt-2">
            Chọn các giá trị cho từng loại, rồi bấm “Sinh biến thể”.
          </p>
        </div>
      </div>


      <div v-if="product.skus.length" class="bulk-actions my-3 d-flex flex-wrap align-items-center gap-2">
        <input v-model.number="bulkPrice" type="number" placeholder="Giá chung" class="form-control w-auto" />
        <input v-model.number="bulkQuantity" type="number" placeholder="Số lượng chung" class="form-control w-auto" />
        <button type="button" class="btn btn-success btn-sm" @click="applyBulk">
          Áp dụng cho tất cả
        </button>
      </div>


      <div v-for="(sku, index) in product.skus" :key="index" class="border rounded p-3 mb-3 shadow-sm">
        <div class="d-flex justify-content-between align-items-center">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="sku.selectedForBulk" :id="'bulk-' + index" />
            <label class="form-check-label" :for="'bulk-' + index">Chọn</label>
          </div>
          <h6 class="fw-bold mb-0">
            🔹 Biến thể {{ index + 1 }}
            <small class="text-muted">({{ skuLabel(sku) }})</small>
          </h6>
          <div>
            <button type="button" class="btn btn-outline-secondary btn-sm me-2" @click="duplicateSku(index)">
              Sao chép
            </button>
            <button type="button" class="btn btn-danger btn-sm" @click="removeSku(index)">
              Xóa
            </button>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-md-3">

            <div class="col-md mb-3">
              <label>Giá</label>
              <input v-model.number="sku.price" class="form-control" type="text" placeholder="0" />
            </div>

            <div class="col-md mb-3">
              <label>Số lượng</label>
              <input v-model.number="sku.quantity" class="form-control" type="text" placeholder="0" />
            </div>


          </div>
          <div class="col-md-9">
            <div class="mb-3">
              <label>Ảnh biến thể</label>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="(img, i) in sku.skuImages" :key="i"
                  class="image-upload border rounded-3 position-relative bg-light border-dark-subtle"
                  style="width: 110px; height: 110px; overflow: hidden">
                  <img :src="img.url || img.path" class="position-absolute top-0 start-0 w-100 h-100"
                    style="object-fit: cover" />
                  <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0"
                    @click="removeSkuImage(index, i)">
                    ×
                  </button>
                </div>
                <div class="border rounded-3 d-flex align-items-center justify-content-center bg-light text-muted"
                  style="width: 110px; height: 110px; cursor: pointer" @click="openSkuFilePicker(index)">
                  <i class="bi bi-plus-circle fs-5"></i>
                </div>
                <input type="file" class="d-none" accept="image/*" multiple :ref="(el) => assignSkuInputRef(el, index)"
                  @change="(e) => handleAutoUploadSkuImages(e, index)" />
              </div>
              <div v-if="skuUploading[index]" class="mt-2 small text-primary">
                Đang tải ảnh...
              </div>
            </div>
          </div>
        </div>


      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Thêm ảnh cho nhiều biến thể</label>
        <input type="file" multiple accept="image/*" @change="bulkUploadSkuImages" class="form-control" />
        <small class="text-muted">Chọn các biến thể muốn thêm ảnh, rồi chọn file ảnh.</small>
      </div>

      <div class="mb-3">
        <!-- <button type="button" class="btn btn-outline-dark mt-2 me-2" @click="addSku">
          + Thêm biến thể
        </button> -->
        <button type="button" class="btn btn-danger mt-2" @click="clearAllSkus">
          Xóa tất cả biến thể
        </button>
      </div>

      <hr />
      <button type="submit" class="btn btn-dark">Lưu sản phẩm</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "@/composables/axios.js";
import router from "@/router";
import useVuelidate from "@vuelidate/core";
import { required, minLength, numeric } from "@vuelidate/validators";
import Swal from "sweetalert2";
import { useCkeditor } from "@/composables/useCkeditor";

const { content: descContent, setData: setDescData } = useCkeditor("descEditor", {
  height: 300,
});


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
const selectedOptionIds = ref([]);
const selectedValues = ref({});

watch(selectedOptionIds, (newIds) => {
  for (const id of newIds) {
    if (!Array.isArray(selectedValues.value[id])) {
      selectedValues.value[id] = [];
    }
  }
});

watch(descContent, (val) => {
  product.value.description = val;
});


watch(
  () => product.value.description,
  (val) => {
    if (val !== descContent.value) {
      setData(val);
    }
  }
);
function assignSkuInputRef(el, index) {
  if (!el) return;
  skuFileInputs.value[index] = el;
}

function openSkuFilePicker(index) {
  const input = skuFileInputs.value[index];
  if (input) input.click();
}

function toSlug(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

watch(
  () => product.value.name,
  (newVal) => {
    product.value.slug = toSlug(newVal);
  }
);

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
    Swal.fire("Lỗi", "Upload ảnh thất bại!", "error");
  } finally {
    isUploadingGlobal.value = false;
  }
};

async function handleAutoUploadSkuImages(event, index) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;


  if (!product.value.skus[index].skuImages) {
    product.value.skus[index].skuImages = [];
  }

  const currentCount = product.value.skus[index].skuImages.length;
  const maxImages = 6;


  if (currentCount + files.length > maxImages) {
    Swal.fire(
      "Quá số lượng ảnh",
      `Mỗi biến thể chỉ được tối đa ${maxImages} ảnh. Bạn đang có ${currentCount} ảnh.`,
      "warning"
    );
    event.target.value = "";
    return;
  }

  skuUploading.value = { ...skuUploading.value, [index]: true };

  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      product.value.skus[index].skuImages.push({
        path: res.data
      });
    }
  } catch (err) {
    console.error("❌ Lỗi upload ảnh SKU:", err);
    Swal.fire("Lỗi", "Upload ảnh SKU thất bại!", "error");
  } finally {
    skuUploading.value = { ...skuUploading.value, [index]: false };
    event.target.value = "";
  }
}



// function addSku() {
//   product.value.skus.push({
//     price: null,
//     quantity: null,
//     attributes: [],
//     skuImages: [],
//   });
// }
function removeSku(index) {
  product.value.skus.splice(index, 1);
}
function clearAllSkus() {
  product.value.skus = [];
}

function duplicateSku(index) {
  const sku = product.value.skus[index];
  const newSku = JSON.parse(JSON.stringify(sku));
  product.value.skus.push(newSku);
}

function removeSkuImage(skuIndex, imgIndex) {
  product.value.skus[skuIndex].skuImages.splice(imgIndex, 1);
}

function filteredValueAttributes(optionId) {
  return valueAttributes.value.filter((v) => v.optionAttributeId === optionId);
}

function findOptionName(id) {
  return optionAttributes.value.find((o) => o.id === id)?.name || "";
}
function findValueName(id) {
  return valueAttributes.value.find((v) => v.id === id)?.name || "";
}

function skuLabel(sku) {
  if (!sku || !sku.attributes || !sku.attributes.length)
    return "(chưa đặt thuộc tính)";
  return sku.attributes
    .map((a) => findValueName(a.valueAttributeId))
    .filter(Boolean)
    .join(" - ");
}

function generateCombinations(obj) {
  const entries = Object.entries(obj)
    .map(([k, v]) => [k, Array.isArray(v) ? v.slice() : [v]])
    .filter(([_, vals]) => Array.isArray(vals) && vals.length > 0);

  if (!entries.length) return [];
  const combine = (i = 0) => {
    if (i >= entries.length) return [[]];
    const [optId, vals] = entries[i];
    const rest = combine(i + 1);
    const result = [];
    for (const val of vals) {
      for (const r of rest) {
        result.push([
          { optionAttributeId: Number(optId), valueAttributeId: Number(val) },
          ...r,
        ]);
      }
    }
    return result;
  };

  return combine();
}

function generateSkusFromSelections() {
  const sel = {};
  for (const optId of selectedOptionIds.value) {
    const val = selectedValues.value[optId];
    sel[optId] = Array.isArray(val) ? val.slice() : val ? [val] : [];
  }

  for (const optId of Object.keys(sel)) {
    if (!sel[optId] || sel[optId].length === 0) {
      Swal.fire(
        "Thiếu lựa chọn",
        "Vui lòng chọn ít nhất 1 giá trị cho: " + findOptionName(Number(optId)),
        "info"
      );
      return;
    }
  }

  const combos = generateCombinations(sel);
  if (!combos.length) {
    Swal.fire("Thông báo", "Không có tổ hợp nào để tạo", "info");
    return;
  }

  const newSkus = combos.map((c) => ({
    price: null,
    quantity: null,
    attributes: c.sort((a, b) => a.optionAttributeId - b.optionAttributeId),
    skuImages: [],
  }));

  const keyOf = (attrs) =>
    attrs
      .map((a) => a.valueAttributeId)
      .sort((x, y) => x - y)
      .join("-");
  const oldMap = new Map();
  for (const s of product.value.skus) {
    const k = keyOf(s.attributes || []);
    oldMap.set(k, s);
  }

  product.value.skus = newSkus.map((s) => {
    const k = keyOf(s.attributes);
    if (oldMap.has(k)) {
      const exist = oldMap.get(k);
      return {
        price: exist.price,
        quantity: exist.quantity,
        attributes: s.attributes,
        skuImages: exist.skuImages || [],
      };
    }
    return s;
  });
}

function clearSelections() {
  selectedOptionIds.value = [];
  selectedValues.value = {};
}


const rules = computed(() => {
  const base = {
    name: { required, minLength: minLength(3) },
    slug: { required },
    image: { required },
    categoryId: { required },
    description: { required, minLength: minLength(6) },
    skus: {},
  };

  base.skus = {
    $each: {
      price: { required, numeric },
      quantity: { required, numeric },
      attributes: {
        $each: {
          optionAttributeId: { required },
          valueAttributeId: { required },
        },
      },
    },
  };

  return base;
});

const v$ = useVuelidate(rules, product);


async function saveProduct() {

  await v$.value.$validate();
  if (v$.value.$invalid) {
    Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin sản phẩm", "error");
    return;
  }

  const seen = new Set();
  for (const sku of product.value.skus) {
    const key = (sku.attributes || [])
      .map((a) => a.valueAttributeId)
      .sort((x, y) => x - y)
      .join("-");

    if (!key) {
      Swal.fire("Lỗi", "Có SKU chưa chọn đầy đủ thuộc tính!", "error");
      return;
    }

    if (seen.has(key)) {
      Swal.fire("Lỗi", "Có SKU bị trùng thuộc tính!", "error");
      return;
    }

    seen.add(key);
  }


  const payload = {
    ...product.value,
    skus: product.value.skus.map((s) => ({
      price: s.price,
      quantity: s.quantity,
      skuImages: (s.skuImages || []).map((i) => ({ path: i.path })),
      attributes: (s.attributes || []).map((a) => ({
        valueAttributeId: a.valueAttributeId,
      })),
    })),
  };


  const slugToCheck = product.value.slug;
  if (slugToCheck) {
    try {
      const checkRes = await axios.get("/api/product/exists", {
        params: { slug: slugToCheck },
      });
      if (checkRes?.data?.exists) {
        Swal.fire("Lỗi", "Tên hoặc slug sản phẩm đã tồn tại!", "error");
        return;
      }
    } catch (errCheck) {
      console.warn("⚠ Không check trùng slug được:", errCheck);
    }
  }


  try {
    const res = await axios.post("/api/product", payload);

    Swal.fire("Thành công", "Thêm sản phẩm thành công!", "success");
    router.push("/admin/list-product");
    console.log("Response:", res.data);

  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;

    console.error("❌ Error:", data || err);

   
    if (status === 409) {
      Swal.fire("Lỗi", data?.message || "Sản phẩm đã tồn tại!", "error");
      return;
    }

   
    if (data?.errors) {
      const msg = data.errors[0]?.message || "Dữ liệu không hợp lệ";
      Swal.fire("Lỗi", msg, "error");
      return;
    }

    Swal.fire("Lỗi", "Không thể lưu sản phẩm", "error");
  }
}


const bulkPrice = ref(null);
const bulkQuantity = ref(null);

function applyBulk() {
  if (!product.value.skus.length) {
    Swal.fire("Thông báo", "Chưa có biến thể nào để áp dụng", "info");
    return;
  }
  product.value.skus.forEach((s) => {
    if (bulkPrice.value) s.price = bulkPrice.value;
    if (bulkQuantity.value) s.quantity = bulkQuantity.value;
  });
  Swal.fire(
    "Thành công",
    "Đã áp dụng giá & tồn cho tất cả biến thể!",
    "success"
  );
}

async function bulkUploadSkuImages(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const selectedSkus = product.value.skus.filter((sku) => sku.selectedForBulk);
  if (!selectedSkus.length) {
    Swal.fire("Thông báo", "❗ Vui lòng chọn ít nhất 1 SKU để gán ảnh", "info");
    return;
  }

  try {
    Swal.fire({
      title: "Đang upload ảnh...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      selectedSkus.forEach((sku) => {
        if (!sku.skuImages) sku.skuImages = [];
        sku.skuImages.push({ path: res.data });
      });
    }

    Swal.close();
    Swal.fire(
      "Thành công",
      "Ảnh đã gán cho các biến thể được chọn",
      "success"
    );


    event.target.value = "";
  } catch (err) {
    Swal.close();
    console.error(err);
    Swal.fire("Lỗi", "❌ Upload ảnh thất bại", "error");
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
