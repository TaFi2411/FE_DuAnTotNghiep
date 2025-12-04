<template>
  <div class="p-3">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Quản lý Flash Sale</h3>
      <button class="btn-header-action" @click="goToFlashSaleSku">
        <i class="bi bi-lightning-charge"></i> Quản lý Flash Sale SKU
      </button>
    </div>

    <!-- Form tạo/cập nhật Flash Sale -->
    <div class="card mb-4">
      <div class="card-header fw-bold">
        {{ editMode ? `Cập nhật Flash Sale #${editId}` : "Tạo Flash Sale mới" }}
      </div>
      <div class="card-body">
        <form @submit.prevent="editMode ? updateFlashSale() : createFlashSale()">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Tiêu đề</label>
              <input
                v-model.lazy="form.title"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.title.$error }"
                @blur="v$.title.$touch()"
              />
              <small class="text-danger" v-if="v$.title.$error">
                {{ v$.title.$errors[0].$message }}
              </small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Ngày bắt đầu</label>
              <input
                v-model.lazy="form.started_date"
                type="datetime-local"
                class="form-control"
                :class="{ 'is-invalid': v$.started_date.$error }"
                @blur="v$.started_date.$touch()"
              />
              <small class="text-danger" v-if="v$.started_date.$error">
                {{ v$.started_date.$errors[0].$message }}
              </small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Ngày kết thúc</label>
              <input
                v-model.lazy="form.ended_date"
                type="datetime-local"
                class="form-control"
                :class="{ 'is-invalid': v$.ended_date.$error }"
                @blur="v$.ended_date.$touch()"
              />
              <small class="text-danger" v-if="v$.ended_date.$error">
                {{ v$.ended_date.$errors[0].$message }}
              </small>
            </div>
          </div>

          <div class="form-check mb-3">
            <input
              v-model="form.active"
              type="checkbox"
              class="form-check-input"
              id="activeCheck"
            />
            <label class="form-check-label" for="activeCheck">Kích hoạt</label>
          </div>

          <button type="submit" class="btn-save me-2">
            <i class="bi" :class="editMode ? 'bi-check-lg' : 'bi-plus-lg'"></i>
            {{ editMode ? "Cập nhật" : "Tạo mới" }}
          </button>
          <button
            v-if="editMode"
            @click="cancelEdit"
            type="button"
            class="btn-back"
          >
            <i class="bi bi-x-lg"></i> Hủy
          </button>
        </form>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <!-- Table Flash Sale -->
    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="flashSales"
        :pagination-options="{ enabled: true, perPage: 10, perPageDropdown: [5,10,20,50], nextLabel:'Trang sau', prevLabel:'Trang trước' }"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm Flash Sale...' }"
        theme="polar-bear"
        :max-height="'60vh'"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'status'">
            <span class="badge" :class="getStatusClass(props.row)">
              {{ getStatusLabel(props.row) }}
            </span>
          </span>
          <span v-else-if="props.column.field === 'actions'">
            <button class="btn btn-outline-warning btn-sm me-1" @click="editSale(props.row)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="confirmDelete(props.row.id)">
              <i class="bi bi-trash"></i>
            </button>
          </span>
          <span v-else-if="['created_date','started_date','ended_date'].includes(props.column.field)">
            {{ formatDateTime(props.row[props.column.field]) }}
          </span>
          <span v-else>{{ props.formattedRow[props.column.field] }}</span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import "vue-good-table-next/dist/vue-good-table-next.css";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const router = useRouter();
const flashSales = ref([]);
const loading = ref(false);
const editMode = ref(false);
const editId = ref(null);

const form = reactive({
  title: "",
  started_date: "",
  ended_date: "",
  active: false,
});

// --- Vuelidate ---
const afterStart = helpers.withMessage(
  "Ngày kết thúc phải lớn hơn ngày bắt đầu",
  (value) => {
    if (!value || !form.started_date) return false;
    return new Date(value) > new Date(form.started_date);
  }
);

// Kiểm tra trùng thời gian với flash sale khác
const notOverlap = helpers.withMessage(
  "Khoảng thời gian trùng với Flash Sale khác",
  (value) => {
    if (!form.started_date || !value) return true;
    const newStart = new Date(form.started_date).getTime();
    const newEnd = new Date(value).getTime();
    return !flashSales.value.some(s => {
      if (editId.value && s.id === editId.value) return false;
      const start = new Date(s.started_date).getTime();
      const end = new Date(s.ended_date).getTime();
      return newStart < end && newEnd > start;
    });
  }
);

const rules = {
  title: { required: helpers.withMessage("Tiêu đề không được để trống", required) },
  started_date: { required: helpers.withMessage("Ngày bắt đầu không được để trống", required) },
  ended_date: { required: helpers.withMessage("Ngày kết thúc không được để trống", required), afterStart, notOverlap }
};

const v$ = useVuelidate(rules, form);

// --- Columns ---
const columns = ref([
  { label: "ID", field: "id", width: "80px" },
  { label: "Tiêu đề", field: "title" },
  { label: "Ngày tạo", field: "created_date", width: "160px" },
  { label: "Ngày bắt đầu", field: "started_date", width: "160px" },
  { label: "Ngày kết thúc", field: "ended_date", width: "160px" },
  { label: "Trạng thái", field: "status", width: "120px" },
  { label: "Hành động", field: "actions", width: "130px" },
]);

// --- Hàm ---
const formatDateTime = (date) => date ? new Date(date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "";

const isActiveNow = (sale) => {
  const now = new Date();
  const start = new Date(sale.started_date);
  const end = new Date(sale.ended_date);
  return now >= start && now <= end;
};

const getStatusLabel = (sale) => {
  if (!sale.active) return "Ngưng";
  if (isActiveNow(sale)) return "Đang hoạt động";
  if (new Date() < new Date(sale.started_date)) return "Chưa bắt đầu";
  return "Ngưng";
};

const getStatusClass = (sale) => {
  if (!sale.active) return "bg-secondary";
  if (isActiveNow(sale)) return "bg-success";
  if (new Date() < new Date(sale.started_date)) return "bg-warning";
  return "bg-secondary";
};

const goToFlashSaleSku = () => router.push("/admin/flash-sale-sku");

const formatDateToServer = (dateString) => {
  if (!dateString) return null;
  const localDate = new Date(dateString);
  const vnDate = new Date(localDate.getTime() + 7*3600*1000);
  return vnDate.toISOString().slice(0,19).replace("T"," ");
};

// --- CRUD ---
const fetchFlashSales = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/flash-sale", { params: { page:0, size:1000 } });
    const data = res.data.data || res.data.content || res.data || [];
    flashSales.value = data.sort((a,b) => b.id - a.id);
  } catch {
    Swal.fire("Lỗi","Không thể tải danh sách Flash Sale!","error");
  } finally { loading.value = false; }
};

const createFlashSale = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const body = { ...form, started_date: formatDateToServer(form.started_date), ended_date: formatDateToServer(form.ended_date) };
  try {
    await axios.post("/api/flash-sale", body);
    Swal.fire("Thành công","Thêm Flash Sale thành công!","success");
    fetchFlashSales(); resetForm();
  } catch { Swal.fire("Lỗi","Không thể thêm Flash Sale!","error"); }
};

const updateFlashSale = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const body = { ...form, started_date: formatDateToServer(form.started_date), ended_date: formatDateToServer(form.ended_date) };
  try {
    await axios.put(`/api/flash-sale/${editId.value}`, body);
    Swal.fire("Thành công","Cập nhật thành công!","success");
    fetchFlashSales(); resetForm();
  } catch { Swal.fire("Lỗi","Không thể cập nhật!","error"); }
};

const confirmDelete = async (id) => {
  const confirm = await Swal.fire({
    title:"Xóa Flash Sale?", text:"Bạn có chắc chắn muốn xóa Flash Sale này?",
    icon:"warning", showCancelButton:true, confirmButtonText:"Xóa", cancelButtonText:"Hủy"
  });
  if (!confirm.isConfirmed) return;
  try { await axios.delete(`/api/flash-sale/${id}`); Swal.fire("Đã xóa!","Flash Sale đã được xóa.","success"); fetchFlashSales(); }
  catch { Swal.fire("Lỗi","Không thể xóa Flash Sale!","error"); }
};

const editSale = (sale) => {
  Object.assign(form,{
    title: sale.title,
    started_date: sale.started_date ? sale.started_date.substring(0,16) : "",
    ended_date: sale.ended_date ? sale.ended_date.substring(0,16) : "",
    active: sale.active
  });
  editMode.value = true; editId.value = sale.id; v$.value.$reset();
};

const cancelEdit = () => resetForm();

const resetForm = () => {
  Object.assign(form,{ title:"", started_date:"", ended_date:"", active:false });
  editMode.value = false; editId.value = null; v$.value.$reset();
};

onMounted(fetchFlashSales);
</script>

<style scoped>
.p-3 { background:#fff; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.05); }
.badge{ font-size:13px; padding:5px 10px; }
.btn-header-action{ display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:500; padding:8px 16px; border:1px solid #0d6efd; border-radius:6px; height:38px; cursor:pointer; transition:all 0.2s ease; box-shadow:0 2px 4px rgba(0,0,0,0.05); background-color:#fff; color:#0d6efd; }
.btn-header-action:hover{ transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.1); background-color:#0d6efd; color:#fff; }
.btn-save, .btn-back{ display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:500; padding:8px 16px; border:1px solid transparent; border-radius:6px; height:38px; cursor:pointer; transition:all 0.2s ease; box-shadow:0 2px 4px rgba(0,0,0,0.05); }
.btn-save:hover, .btn-back:hover{ transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.1); }
.btn-save{ background-color:#198754; color:#fff; border-color:#198754; }
.btn-save:hover{ background-color:#157347; border-color:#146c43; }
.btn-back{ background-color:#6c757d; color:#fff; border-color:#6c757d; }
.btn-back:hover{ background-color:#5c636a; border-color:#565e64; }
.form-control.is-invalid, .form-check-input.is-invalid{ border-color:#dc3545; }
.form-control.is-invalid:focus, .form-check-input.is-invalid:focus{ border-color:#dc3545; box-shadow:0 0 0 0.25rem rgba(220,53,69,0.25); }
.form-control:focus{ border-color:#0d6efd; box-shadow:0 0 0 0.25rem rgba(13,110,253,0.25); }
.text-danger{ font-size:0.875rem; margin-top:4px; display:block; }
:deep(.vgt-table-wrapper){ &::-webkit-scrollbar{ width:6px; height:6px; } &::-webkit-scrollbar-track{ background:#f1f1f1; border-radius:10px; } &::-webkit-scrollbar-thumb{ background:#c1c1c1; border-radius:10px; } &::-webkit-scrollbar-thumb:hover{ background:#a1a1a1; } }
:deep(.vgt-table thead th){ position:sticky !important; top:0 !important; background:white !important; z-index:10 !important; }
</style>
