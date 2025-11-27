<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Quản lý Flash Sale SKU</h3>
      <button class="btn-header-action" @click="goToFlashSaleAdmin">
        <i class="bi bi-arrow-left"></i> Quản lý Flash Sale
      </button>
    </div>

    <div class="card mb-4">
      <div class="card-header fw-bold">
        {{ editModeSku ? "Cập nhật Flash Sale SKU" : "Thêm Flash Sale SKU mới" }}
      </div>
      <div class="card-body">
        <form @submit.prevent="editModeSku ? updateSku() : createSku()">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">Flash Sale</label>
              <select
                v-model="skuForm.flashSaleId"
                class="form-select"
                :class="{ 'is-invalid': v$.flashSaleId.$error }"
                @blur="v$.flashSaleId.$touch()"
              >
                <option value="">-- Chọn Flash Sale --</option>
                <option v-for="f in flashSales" :key="f.id" :value="f.id">
                  {{ f.title }}
                </option>
              </select>
              <small class="text-danger" v-if="v$.flashSaleId.$error">
                {{ v$.flashSaleId.$errors[0].$message }}
              </small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">SKU</label>
              <select
                v-model="skuForm.skuId"
                class="form-select"
                :class="{ 'is-invalid': v$.skuId.$error }"
                @blur="v$.skuId.$touch()"
              >
                <option value="">-- Chọn SKU --</option>
                <option v-for="s in skus" :key="s.id" :value="s.id">
                  {{ s.id }} - {{ s.productName }}
                </option>
              </select>
              <small class="text-danger" v-if="v$.skuId.$error">
                {{ v$.skuId.$errors[0].$message }}
              </small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Giảm giá (%)</label>
              <input
                v-model.lazy.number="skuForm.discount"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': v$.discount.$error }"
                @blur="v$.discount.$touch()"
              />
              <small class="text-danger" v-if="v$.discount.$error">
                {{ v$.discount.$errors[0].$message }}
              </small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Số lượng</label>
              <input
                v-model.lazy.number="skuForm.quantity"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': v$.quantity.$error }"
                @blur="v$.quantity.$touch()"
              />
              <small class="text-danger" v-if="v$.quantity.$error">
                {{ v$.quantity.$errors[0].$message }}
              </small>
            </div>
          </div>

          <button type="submit" class="btn-save me-2">
            <i class="bi" :class="editModeSku ? 'bi-check-lg' : 'bi-plus-lg'"></i>
            {{ editModeSku ? "Cập nhật" : "Thêm mới" }}
          </button>
          <button
            v-if="editModeSku"
            type="button"
            class="btn-back"
            @click="cancelEditSku"
          >
            <i class="bi bi-x-lg"></i> Hủy
          </button>
        </form>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="skuList"
        :pagination-options="paginationOptions"
        :search-options="{
          enabled: true,
          placeholder: 'Tìm kiếm Flash Sale SKU...',
        }"
        theme="polar-bear"
        :max-height="'60vh'"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'flashSaleName'">
            {{ props.row.flashSaleName }}
          </span>

          <span v-else-if="props.column.field === 'skuName'">
            {{ props.row.skuName }}
          </span>

          <span v-else-if="props.column.field === 'actions'">
            <button
              class="btn btn-outline-warning btn-sm me-1"
              @click="editSku(props.row)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="deleteSku(props.row.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </span>

          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";
import "vue-good-table-next/dist/vue-good-table-next.css";
import useVuelidate from "@vuelidate/core";
import { required, numeric, between, minValue, helpers } from "@vuelidate/validators";

const router = useRouter();
const flashSales = ref([]);
const skus = ref([]);
const skuList = ref([]);
const loading = ref(false);
const editModeSku = ref(false);

const skuForm = reactive({
  id: null,
  flashSaleId: "",
  skuId: "",
  discount: "",
  quantity: "",
});

// --- VUELIDATE SETUP ---
const checkDiscountAgainstFlashSale = helpers.withMessage(
  "Giảm giá SKU không được vượt quá Flash Sale",
  (value) => {
    const d = Number(value);
    const flashSaleId = Number(skuForm.flashSaleId);
    if (!flashSaleId || isNaN(d) || value === "") return true;

    const flashSale = flashSales.value.find((f) => f.id === flashSaleId);
    if (flashSale) {
      return d <= Number(flashSale.discount);
    }
    return true;
  }
);

const checkQuantityAgainstStock = helpers.withMessage(
  "Số lượng SKU không được vượt quá tồn kho",
  (value) => {
    const q = Number(value);
    const skuId = Number(skuForm.skuId);
    if (!skuId || isNaN(q) || value === "") return true;

    const sku = skus.value.find((s) => s.id === skuId);
    if (sku) {
      return q <= Number(sku.quantity);
    }
    return true;
  }
);

const rules = {
  flashSaleId: { required: helpers.withMessage("Vui lòng chọn Flash Sale", required) },
  skuId: { required: helpers.withMessage("Vui lòng chọn SKU", required) },
  discount: {
    required: helpers.withMessage("Vui lòng nhập giảm giá", required),
    numeric: helpers.withMessage("Phải là số", numeric),
    between: helpers.withMessage("Giảm giá phải từ 0 - 100", between(0, 100)),
    checkDiscountAgainstFlashSale,
  },
  quantity: {
    required: helpers.withMessage("Vui lòng nhập số lượng", required),
    numeric: helpers.withMessage("Phải là số", numeric),
    minValue: helpers.withMessage("Số lượng phải lớn hơn 0", minValue(1)),
    checkQuantityAgainstStock,
  },
};

const v$ = useVuelidate(rules, skuForm);

// ⚙️ Cột bảng
const columns = ref([
  { label: "ID", field: "id", width: "80px" },
  { label: "Flash Sale", field: "flashSaleName" },
  { label: "SKU", field: "skuName" },
  { label: "Giảm giá (%)", field: "discount" },
  { label: "Số lượng", field: "quantity" },
  { label: "Hành động", field: "actions", width: "130px" },
]);

// 📄 Phân trang
const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
});

// 🔄 Fetch dữ liệu
async function fetchFlashSales() {
  const res = await axios.get("/api/flash-sale");
  flashSales.value = res.data.data || res.data.content || res.data || [];
}

async function fetchSkus() {
  const res = await axios.get("/api/sku");
  skus.value = res.data.data || res.data.content || res.data || [];
}

async function fetchFlashSaleSku() {
  loading.value = true;
  try {
    const res = await axios.get("/api/flash-sale-sku");
    const list = res.data.data || res.data.content || res.data || [];

    skuList.value = list.map((sku) => ({
      ...sku,
      flashSaleName: getFlashSaleName(sku.flashSaleId),
      skuName: getSkuName(sku.skuId),
    }));
  } catch (err) {
    Swal.fire("Lỗi", "Không thể tải danh sách SKU!", "error");
  } finally {
    loading.value = false;
  }
}

// 🧱 CRUD (Đã cập nhật Vuelidate)
async function createSku() {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    // 🔥 Load dữ liệu mới nhất từ server (không dùng table)
    const res = await axios.get("/api/flash-sale-sku");
    const list = res.data.data || res.data.content || res.data || [];

    const flashId = Number(skuForm.flashSaleId);
    const skuId = Number(skuForm.skuId);
    const newQuantityInput = Number(skuForm.quantity);
    const newDiscountInput = Number(skuForm.discount);

    // 🔥 Kiểm tra xem đã có bản ghi trùng hay chưa
    const existing = list.find(
      (item) => item.flashSaleId === flashId && item.skuId === skuId
    );

    if (existing) {
      // 👉 Lấy số lượng cũ + mới
      const totalQuantity = existing.quantity + newQuantityInput;

      // 👉 Check tồn kho
      const skuStock = skus.value.find((x) => x.id === skuId)?.quantity || 0;
      if (totalQuantity > skuStock) {
        Swal.fire(
          "Lỗi",
          `Số lượng cộng dồn (${totalQuantity}) vượt quá tồn kho (${skuStock})!`,
          "error"
        );
        return;
      }

      // 👉 Lấy giảm giá lớn hơn
      const finalDiscount = Math.max(existing.discount, newDiscountInput);

      // 👉 UPDATE thay vì thêm mới
      await axios.put(`/api/flash-sale-sku/${existing.id}`, {
        flashSaleId: flashId,
        skuId: skuId,
        discount: finalDiscount,
        quantity: totalQuantity,
      });

      Swal.fire("Đã cập nhật", "Đã cộng dồn số lượng cho SKU!", "success");
    } else {
      // 👉 Nếu chưa tồn tại → thêm mới
      await axios.post("/api/flash-sale-sku", {
        flashSaleId: flashId,
        skuId: skuId,
        discount: newDiscountInput,
        quantity: newQuantityInput,
      });

      Swal.fire("Thành công", "Thêm SKU mới thành công!", "success");
    }

    await fetchFlashSaleSku();
    cancelEditSku();

  } catch (err) {
    Swal.fire(
      "Lỗi",
      err.response?.data?.message || "Không thể xử lý yêu cầu!",
      "error"
    );
  }
}


async function updateSku() {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    await axios.put(`/api/flash-sale-sku/${skuForm.id}`, {
      flashSaleId: Number(skuForm.flashSaleId),
      skuId: Number(skuForm.skuId),
      discount: Number(skuForm.discount),
      quantity: Number(skuForm.quantity),
    });
    Swal.fire("Thành công", "Cập nhật SKU thành công!", "success");
    await fetchFlashSaleSku();
    cancelEditSku();
  } catch (err) {
    Swal.fire("Lỗi", err.response?.data?.message || "Không thể cập nhật SKU!", "error");
  }
}

async function deleteSku(id) {
  const confirm = await Swal.fire({
    title: "Xóa SKU?",
    text: "Bạn có chắc muốn xóa SKU này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (!confirm.isConfirmed) return;

  try {
    await axios.delete(`/api/flash-sale-sku/${id}`);
    Swal.fire("Đã xóa!", "SKU đã được xóa thành công.", "success");
    await fetchFlashSaleSku();
  } catch {
    Swal.fire("Lỗi", "Không thể xóa SKU!", "error");
  }
}

function editSku(s) {
  Object.assign(skuForm, s);
  v$.value.$reset();
  editModeSku.value = true;
}

function cancelEditSku() {
  Object.assign(skuForm, {
    id: null,
    flashSaleId: "",
    skuId: "",
    discount: "",
    quantity: "",
  });
  v$.value.$reset();
  editModeSku.value = false;
}

function getFlashSaleName(id) {
  const f = flashSales.value.find((x) => x.id === id);
  return f ? f.title : "Không xác định";
}

function getSkuName(id) {
  const s = skus.value.find((x) => x.id === id);
  return s ? `${s.id} - ${s.productName}` : id;
}

function goToFlashSaleAdmin() {
  router.push("/admin/flash-sale-admin");
}

onMounted(async () => {
  await fetchSkus();
  await fetchFlashSales();
  await fetchFlashSaleSku();
});
</script>

<style scoped>
.p-3 {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Header Action Button */
.btn-header-action {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 14px; font-weight: 500; padding: 8px 16px;
  border: 1px solid #0d6efd; border-radius: 6px; height: 38px;
  cursor: pointer; transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); background-color: #fff; color: #0d6efd;
}
.btn-header-action:hover {
  transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #0d6efd; color: #fff;
}

/* Buttons */
.btn-save, .btn-back {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 14px; font-weight: 500; padding: 8px 16px;
  border: 1px solid transparent; border-radius: 6px; height: 38px;
  cursor: pointer; transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.btn-save:hover, .btn-back:hover {
  transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.btn-save { background-color: #198754; color: #fff; border-color: #198754; }
.btn-save:hover { background-color: #157347; border-color: #146c43; }
.btn-back { background-color: #6c757d; color: #fff; border-color: #6c757d; }
.btn-back:hover { background-color: #5c636a; border-color: #565e64; }

/* Validation Focus */
.form-control.is-invalid, .form-select.is-invalid { border-color: #dc3545; }
.form-control.is-invalid:focus, .form-select.is-invalid:focus {
  border-color: #dc3545; box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
.form-control:focus, .form-select:focus {
  border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
.text-danger { font-size: 0.875rem; margin-top: 4px; display: block; }

/* Scrollbar & Sticky Header */
:deep(.vgt-table-wrapper) {
  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
}
:deep(.vgt-table thead th) {
  position: sticky !important; top: 0 !important;
  background: white !important; z-index: 10 !important;
}
</style>
