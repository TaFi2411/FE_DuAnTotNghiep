<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Quản lý Flash Sale và Flash Sale SKU</h2>

    <!-- Tabs -->
    <div class="tabs mb-4">
      <button :class="{ active: activeTab === 'flashSale' }" @click="activeTab = 'flashSale'">
        Flash Sale
      </button>
      <button :class="{ active: activeTab === 'sku' }" @click="activeTab = 'sku'">
        Flash Sale SKU
      </button>
    </div>

    <!-- TAB 1️⃣: FLASH SALE -->
    <div v-if="activeTab === 'flashSale'">
      <!-- Form thêm/sửa Flash Sale -->
      <div class="card mb-4">
        <div class="card-header">
          {{ editMode ? `Cập nhật Flash Sale #${editId}` : "Tạo Flash Sale mới" }}
        </div>
        <div class="card-body">
          <form @submit.prevent="editMode ? updateFlashSale() : createFlashSale()">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Tiêu đề</label>
                <input v-model="form.title" type="text" class="form-control" />
                <small class="text-danger" v-if="errors.title">{{ errors.title }}</small>
              </div>

              <div class="col-md-2 mb-3">
                <label class="form-label">Giảm giá (%)</label>
                <input v-model.number="form.discount" type="number" class="form-control" />
                <small class="text-danger" v-if="errors.discount">{{ errors.discount }}</small>
              </div>

              <div class="col-md-3 mb-3">
                <label class="form-label">Ngày bắt đầu</label>
                <input v-model="form.started_date" type="datetime-local" class="form-control" />
                <small class="text-danger" v-if="errors.started_date">{{ errors.started_date }}</small>
              </div>

              <div class="col-md-3 mb-3">
                <label class="form-label">Ngày kết thúc</label>
                <input v-model="form.ended_date" type="datetime-local" class="form-control" />
                <small class="text-danger" v-if="errors.ended_date">{{ errors.ended_date }}</small>
              </div>
            </div>

            <div class="form-check mb-3">
              <input v-model="form.active" type="checkbox" class="form-check-input" id="activeCheck" />
              <label class="form-check-label" for="activeCheck">Kích hoạt</label>
            </div>

            <button type="submit" class="btn btn-primary me-2">
              {{ editMode ? "Cập nhật" : "Tạo mới" }}
            </button>
            <button v-if="editMode" @click="cancelEdit" type="button" class="btn btn-secondary">
              Hủy
            </button>
          </form>
        </div>
      </div>

      <!-- Danh sách Flash Sale -->
      <div class="card">
        <div class="card-header fw-bold">Danh sách Flash Sale</div>
        <div class="card-body">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Giảm giá</th>
                <th>Ngày tạo</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Trạng thái</th>
                <th class="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in flashSales" :key="sale.id">
                <td>{{ sale.id }}</td>
                <td>{{ sale.title }}</td>
                <td>{{ sale.discount }}%</td>
                <td>{{ formatDateTime(sale.created_date) }}</td>
                <td>{{ formatDateTime(sale.started_date) }}</td>
                <td>{{ formatDateTime(sale.ended_date) }}</td>
                <td>
                  <span class="badge" :class="getStatusClass(sale)">
                    {{ getStatusLabel(sale) }}
                  </span>
                </td>

                <td class="text-center">
                  <button class="btn btn-sm btn-warning me-2" @click="editSale(sale)">Sửa</button>
                  <button class="btn btn-sm btn-danger" @click="deleteSale(sale.id)">Xoá</button>
                </td>
              </tr>
              <tr v-if="flashSales.length === 0">
                <td colspan="8" class="text-center">Không có Flash Sale nào</td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav class="mt-3">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 0 }">
                <button class="page-link" @click="changePage(currentPage - 1)">« Trước</button>
              </li>
              <li v-for="page in totalPages" :key="page" class="page-item"
                :class="{ active: currentPage === page - 1 }">
                <button class="page-link" @click="changePage(page - 1)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
                <button class="page-link" @click="changePage(currentPage + 1)">Sau »</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- TAB 2️⃣: FLASH SALE SKU -->
    <div v-if="activeTab === 'sku'">
      <!-- Form Flash Sale SKU -->
      <!-- Form Flash Sale SKU -->
      <div class="card mb-4">
        <div class="card-header">Thêm / Sửa Flash Sale SKU</div>
        <div class="card-body">
          <form @submit.prevent="editModeSku ? updateSku() : createSku()">
            <div class="row">
              <div class="col-md-3 mb-3">
                <label class="form-label">Flash Sale</label>
                <select v-model="skuForm.flashSaleId" class="form-select">
                  <option value="">-- Chọn Flash Sale --</option>
                  <option v-for="f in flashSaleInData" :key="f.id" :value="f.id">{{ f.title }}</option>
                </select>
                <small class="text-danger" v-if="skuErrors.flashSaleId">{{ skuErrors.flashSaleId }}</small>
              </div>

              <div class="col-md-3 mb-3">
                <label class="form-label">SKU</label>
                <select v-model="skuForm.skuId" class="form-select" @change="validateQuantity(); validateDiscount();">
                  <option value="">-- Chọn SKU --</option>
                  <option v-for="s in skus" :key="s.id" :value="s.id">{{ s.id }} - {{ s.productName }}</option>
                </select>
                <small class="text-danger" v-if="skuErrors.skuId">{{ skuErrors.skuId }}</small>
              </div>

              <div class="col-md-3 mb-3">
                <label class="form-label">Giảm giá (%)</label>
                <input v-model.number="skuForm.discount" type="number" class="form-control" @input="validateDiscount" />
                <small class="text-danger" v-if="skuErrors.discount">{{ skuErrors.discount }}</small>
              </div>

              <div class="col-md-3 mb-3">
                <label class="form-label">Số lượng</label>
                <input v-model.number="skuForm.quantity" type="number" class="form-control" @input="validateQuantity" />
                <small class="text-danger" v-if="skuErrors.quantity">{{ skuErrors.quantity }}</small>
              </div>
            </div>

            <button type="submit" class="btn btn-primary me-2">
              {{ editModeSku ? "Cập nhật" : "Thêm mới" }}
            </button>
            <button v-if="editModeSku" type="button" class="btn btn-secondary" @click="cancelEditSku">
              Hủy
            </button>
          </form>
        </div>
      </div>


      <!-- Danh sách Flash Sale SKU -->
      <div class="card">
        <div class="card-header fw-bold">Danh sách Flash Sale SKU</div>
        <div class="card-body">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Flash Sale</th>
                <th>SKU</th>
                <th>Giảm giá</th>
                <th>Số lượng</th>
                <th class="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sku in skuList" :key="sku.id">
                <td>{{ sku.id }}</td>
                <td>{{ getFlashSaleName(sku.flashSaleId) }}</td>
                <td>{{ getSkuName(sku.skuId) }}</td>
                <td>{{ sku.discount }}%</td>
                <td>{{ sku.quantity }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-warning me-2" @click="editSku(sku)">Sửa</button>
                  <button class="btn btn-sm btn-danger" @click="deleteSku(sku.id)">Xóa</button>
                </td>
              </tr>
              <tr v-if="skuList.length === 0">
                <td colspan="6" class="text-center">Không có SKU nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";


// Tabs
const activeTab = ref("flashSale");

// Flash Sale
const flashSales = ref([]);
const flashSaleInData = ref([]);
const currentPage = ref(0);
const totalPages = ref(1);
const pageSize = ref(5);
const editMode = ref(false);
const editId = ref(null);
const form = reactive({ title: "", discount: 0, started_date: "", ended_date: "", active: false });
const errors = reactive({});

// SKU
const skus = ref([]);
const skuList = ref([]);
const skuForm = reactive({ id: null, flashSaleId: "", skuId: "", discount: "", quantity: "" });
const skuErrors = reactive({});
const editModeSku = ref(false);

// --- Helper ---
function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

// --- Fetch API ---
async function fetchSales(page = 0) {
  const res = await fetch(`http://localhost:8080/api/flash-sale?page=${page}&size=${pageSize.value}`);
  const data = await res.json();
  flashSales.value = data.content || data.data || data || [];
  totalPages.value = data.totalPages || 1;
  currentPage.value = data.number || 0;
}
async function fetchflashSaleInData() {
  const res = await fetch(`http://localhost:8080/api/flash-sale`);
  const data = await res.json();
  flashSaleInData.value = data.content || data.data || data || [];

}

async function fetchSkus() {
  const res = await fetch("http://localhost:8080/api/sku");
  const data = await res.json();
  skus.value = data.content || data.data || data || [];
}

async function fetchFlashSaleSku() {
  const res = await fetch("http://localhost:8080/api/flash-sale-sku");
  const data = await res.json();
  skuList.value = data.content || data.data || data || [];
}

function isActiveNow(sale) {
  const now = new Date();
  const start = new Date(sale.started_date);
  const end = new Date(sale.ended_date);
  return now >= start && now <= end;
}

function getStatusLabel(sale) {
  // ⚡ Ưu tiên kiểm tra active trước
  if (!sale.active) return "Ngưng";

  // Nếu đang trong khung giờ
  if (isActiveNow(sale)) return "Đang hoạt động";

  // Nếu chưa tới thời gian bắt đầu
  if (new Date() < new Date(sale.started_date)) return "Chưa bắt đầu";

  // Nếu đã qua thời gian kết thúc
  return "Ngưng";
}

function getStatusClass(sale) {
  // ⚡ Nếu bị tắt kích hoạt
  if (!sale.active) return "bg-secondary";

  // Đang hoạt động
  if (isActiveNow(sale)) return "bg-success";

  // Chưa bắt đầu
  if (new Date() < new Date(sale.started_date)) return "bg-warning";

  // Đã kết thúc
  return "bg-secondary";
}

// --- CRUD Flash Sale ---
function clearErrors() { for (let key in errors) errors[key] = ""; }
function validateForm() {
  clearErrors();
  let valid = true;
  const now = new Date();

  if (!form.title) {
    errors.title = "Tiêu đề không được để trống";
    valid = false;
  }

  if (form.discount < 0 || form.discount > 100) {
    errors.discount = "Giảm giá phải từ 0–100";
    valid = false;
  }

  if (!form.started_date) {
    errors.started_date = "Ngày bắt đầu không được để trống";
    valid = false;
  } else {
    const start = new Date(form.started_date);

  }

  if (!form.ended_date) {
    errors.ended_date = "Ngày kết thúc không được để trống";
    valid = false;
  } else {
    const start = new Date(form.started_date);
    const end = new Date(form.ended_date);
    if (end <= start) {
      errors.ended_date = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
      valid = false;
    }
  }

  return valid;
}

function formatDateToServer(dateString) {
  if (!dateString) return null;
  const localDate = new Date(dateString);
  const vnDate = new Date(localDate.getTime() + 7 * 3600 * 1000);
  return vnDate.toISOString().slice(0, 19).replace("T", " ");
}

async function createFlashSale() {
  if (!validateForm()) return;
  const body = { ...form, started_date: formatDateToServer(form.started_date), ended_date: formatDateToServer(form.ended_date) };
  const res = await fetch("http://localhost:8080/api/flash-sale", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (res.ok) { await fetchSales(currentPage.value); resetForm(); alert("Thêm Flash Sale thành công!"); }
}

async function updateFlashSale() {
  if (!validateForm()) return;
  const body = { ...form, started_date: formatDateToServer(form.started_date), ended_date: formatDateToServer(form.ended_date) };
  const res = await fetch(`http://localhost:8080/api/flash-sale/${editId.value}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (res.ok) { await fetchSales(currentPage.value); resetForm(); alert("Cập nhật thành công!"); }
}

async function deleteSale(id) {
  if (confirm("Bạn có chắc chắn muốn xoá flash sale này?")) {
    await fetch(`http://localhost:8080/api/flash-sale/${id}`, { method: "DELETE" });
    await fetchSales(currentPage.value);
  }
}

function editSale(sale) {
  form.title = sale.title;
  form.discount = sale.discount;
  form.started_date = sale.started_date ? sale.started_date.substring(0, 16) : "";
  form.ended_date = sale.ended_date ? sale.ended_date.substring(0, 16) : "";
  form.active = sale.active;
  editMode.value = true;
  editId.value = sale.id;
}

function cancelEdit() { resetForm(); }
function resetForm() { Object.assign(form, { title: "", discount: 0, started_date: "", ended_date: "", active: false }); editMode.value = false; editId.value = null; }
function changePage(page) { if (page < 0 || page >= totalPages.value) return; fetchSales(page); }

// --- CRUD Flash Sale SKU ---
function validateSku() {
  skuErrors.flashSaleId = skuForm.flashSaleId ? "" : "Chưa chọn Flash Sale";
  skuErrors.skuId = skuForm.skuId ? "" : "Thiếu SKU";
  skuErrors.discount = skuForm.discount !== "" ? "" : "Thiếu giảm giá";
  skuErrors.quantity = skuForm.quantity !== "" ? "" : "Thiếu số lượng";
  return !(skuErrors.flashSaleId || skuErrors.skuId || skuErrors.discount || skuErrors.quantity);
}
function validateDiscount() {
  const flashSale = flashSales.value.find(f => f.id === Number(skuForm.flashSaleId));
  const maxDiscount = flashSale ? Number(flashSale.discount) : 0;

  if (skuForm.discount === "" || skuForm.discount === null) {
    skuErrors.discount = "Vui lòng nhập giảm giá";
  } else if (Number(skuForm.discount) > maxDiscount) {
    skuErrors.discount = `Giảm giá SKU (${skuForm.discount}%) không được vượt quá Flash Sale (${maxDiscount}%)`;
  } else if (skuForm.discount < 0) {
    skuErrors.discount = "Giảm giá không được nhỏ hơn 0%";
  } else {
    skuErrors.discount = "";
  }
}

function validateQuantity() {
  const sku = skus.value.find(s => s.id === Number(skuForm.skuId));
  const maxQuantity = sku ? Number(sku.quantity) : 0;

  if (skuForm.quantity === "" || skuForm.quantity === null) {
    skuErrors.quantity = "Vui lòng nhập số lượng";
  } else if (Number(skuForm.quantity) > maxQuantity) {
    skuErrors.quantity = `Số lượng SKU (${skuForm.quantity}) không được vượt quá tồn kho (${maxQuantity})`;
  } else if (Number(skuForm.quantity) <= 0) {
    skuErrors.quantity = "Số lượng phải lớn hơn 0";
  } else {
    skuErrors.quantity = "";
  }
}

async function createSku() {
  validateDiscount();
  validateQuantity();
  if (!validateSku()) return;





  const body = {
    flashSaleId: Number(skuForm.flashSaleId),
    skuId: Number(skuForm.skuId),
    discount: Number(skuForm.discount),
    quantity: Number(skuForm.quantity),
  };

  const res = await fetch("http://localhost:8080/api/flash-sale-sku", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    await fetchFlashSaleSku();
    cancelEditSku();
    alert("Thêm SKU thành công!");
  }
}


async function updateSku() {
  validateDiscount();
  validateQuantity();
  if (!validateSku()) return;



  const body = {
    flashSaleId: Number(skuForm.flashSaleId),
    skuId: Number(skuForm.skuId),
    discount: Number(skuForm.discount),
    quantity: Number(skuForm.quantity),
  };

  const res = await fetch(`http://localhost:8080/api/flash-sale-sku/${skuForm.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    await fetchFlashSaleSku();
    cancelEditSku();
    alert("Cập nhật SKU thành công!");
  }
}


async function deleteSku(id) { if (confirm("Bạn có chắc muốn xóa SKU?")) { await fetch(`http://localhost:8080/api/flash-sale-sku/${id}`, { method: "DELETE" }); await fetchFlashSaleSku(); } }
function editSku(s) { Object.assign(skuForm, s); editModeSku.value = true; }
function cancelEditSku() { editModeSku.value = false; Object.assign(skuForm, { id: null, flashSaleId: "", skuId: "", discount: "", quantity: "" }); }

function getFlashSaleName(id) { const f = flashSales.value.find(x => x.id === id); return f ? f.title : "Không xác định"; }
function getSkuName(id) { const s = skus.value.find(x => x.id === id); return s ? `${s.id} - ${s.productName}` : id; }

onMounted(async () => { 
await fetchSales();
await fetchflashSaleInData();
 await fetchSkus(); 
 await fetchFlashSaleSku(); });
</script>

<style scoped>
.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: #eee;
  cursor: pointer;
  border-radius: 6px;
}

.tabs button.active {
  background: #007bff;
  color: white;
}

.card {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.text-danger {
  font-size: 0.875rem;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.page-link {
  cursor: pointer;
}
</style>
