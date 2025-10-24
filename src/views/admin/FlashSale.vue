<template>
  <div class="container mt-4">
    <!-- 🧾 Form thêm / sửa -->
    <div class="card mb-4 shadow-sm">
      <div class="card-header fw-bold">
        {{ editMode ? `Cập nhật Flash Sale #${editId}` : "Tạo Flash Sale mới" }}
      </div>

      <div class="card-body">
        <form @submit.prevent="editMode ? updateFlashSale() : createFlashSale()">
          <div class="row">
            <!-- Tiêu đề -->
            <div class="col-md-4 mb-3">
              <label class="form-label">Tiêu đề</label>
              <input v-model="form.title" type="text" class="form-control" />
              <small class="text-danger" v-if="errors.title">{{ errors.title }}</small>
            </div>

            <!-- Giảm giá -->
            <div class="col-md-2 mb-3">
              <label class="form-label">Giảm (%)</label>
              <input v-model.number="form.discount" type="number" class="form-control" />
              <small class="text-danger" v-if="errors.discount">{{ errors.discount }}</small>
            </div>

            <!-- Ngày bắt đầu -->
            <div class="col-md-3 mb-3">
              <label class="form-label">Ngày bắt đầu</label>
              <input v-model="form.started_date" type="datetime-local" class="form-control" />
              <small class="text-danger" v-if="errors.started_date">{{ errors.started_date }}</small>
            </div>

            <!-- Ngày kết thúc -->
            <div class="col-md-3 mb-3">
              <label class="form-label">Ngày kết thúc</label>
              <input v-model="form.ended_date" type="datetime-local" class="form-control" />
              <small class="text-danger" v-if="errors.ended_date">{{ errors.ended_date }}</small>
            </div>
          </div>

          <!-- Checkbox kích hoạt -->
          <div class="form-check mb-3">
            <input v-model="form.active" type="checkbox" class="form-check-input" id="activeCheck" />
            <label class="form-check-label" for="activeCheck">Kích hoạt</label>
          </div>

          <div>
            <button type="submit" class="btn btn-primary me-2">
              {{ editMode ? "Cập nhật" : "Tạo mới" }}
            </button>
            <button
              v-if="editMode"
              type="button"
              @click="cancelEdit"
              class="btn btn-secondary"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 📋 Danh sách Flash Sale -->
    <div class="card shadow-sm">
      <div class="card-header fw-bold d-flex justify-content-between align-items-center">
        <span>Danh sách Flash Sale</span>
        <small class="text-muted">Tổng: {{ flashSales.length }}</small>
      </div>
      <div class="card-body">
        <Table :columns="columns" :rows="flashSales">
          <!-- Cột tiêu đề -->
          <template #title="{ row }">
            <strong>{{ row.title }}</strong>
          </template>

          <!-- Cột giảm giá -->
          <template #discount="{ row }">
            <span class="text-danger fw-bold">{{ row.discount }}%</span>
          </template>

          <!-- Cột ngày bắt đầu -->
          <template #started_date="{ row }">
            {{ formatDateTime(row.started_date) }}
          </template>

          <!-- Cột ngày kết thúc -->
          <template #ended_date="{ row }">
            {{ formatDateTime(row.ended_date) }}
          </template>

          <!-- Cột trạng thái -->
          <template #active="{ row }">
            <span
              class="badge"
              :class="row.active ? 'bg-success' : 'bg-secondary'"
            >
              {{ row.active ? "Đang hoạt động" : "Ngưng" }}
            </span>
          </template>

          <!-- Cột hành động -->
          <template #actions="{ row }">
            <button
              class="btn btn-outline-warning btn-sm me-2"
              @click="editSale(row)"
              title="Sửa"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="deleteSale(row.id)"
              title="Xoá"
            >
              <i class="bi bi-trash"></i>
            </button>
          </template>
        </Table>

        <!-- 📄 Phân trang -->
        <nav class="mt-3" v-if="totalPages > 1">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <button class="page-link" @click="changePage(currentPage - 1)">«</button>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page - 1 }"
            >
              <button class="page-link" @click="changePage(page - 1)">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
              <button class="page-link" @click="changePage(currentPage + 1)">»</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Table from "@/components/Table.vue";

// --- State ---
const flashSales = ref([]);
const currentPage = ref(0);
const totalPages = ref(1);
const pageSize = ref(5);
const editMode = ref(false);
const editId = ref(null);

const form = reactive({
  title: "",
  discount: 0,
  started_date: "",
  ended_date: "",
  active: false,
});
const errors = reactive({});

const route = useRoute();
const router = useRouter();

// 🧱 Cấu hình cột bảng
const columns = [
  { label: "Tiêu đề", field: "title", slot: "title" },
  { label: "Giảm (%)", field: "discount", slot: "discount" },
  { label: "Ngày bắt đầu", field: "started_date", slot: "started_date" },
  { label: "Ngày kết thúc", field: "ended_date", slot: "ended_date" },
  { label: "Trạng thái", field: "active", slot: "active" },
];

// 🕒 Format hiển thị thời gian
function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

// 🧩 Format datetime gửi lên server
function formatDateToServer(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  const vnDate = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  return vnDate.toISOString().slice(0, 19).replace("T", " ");
}

// --- API ---
async function fetchSales(page = 0) {
  try {
    const res = await fetch(`http://localhost:8080/api/flash-sale?page=${page}&size=${pageSize.value}`);
    const data = await res.json();
    flashSales.value = data.content || data.data || [];
    totalPages.value = data.totalPages || 1;
    currentPage.value = data.number || 0;
  } catch (err) {
    console.error("❌ Lỗi tải danh sách:", err);
  }
}

function changePage(page) {
  if (page < 0 || page >= totalPages.value) return;
  fetchSales(page);
}

// --- CRUD ---
async function createFlashSale() {
  clearErrors();
  if (!validateForm()) return;

  try {
    const body = {
      ...form,
      started_date: formatDateToServer(form.started_date),
      ended_date: formatDateToServer(form.ended_date),
    };

    const res = await fetch("http://localhost:8080/api/flash-sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Tạo mới thất bại");
    alert("✅ Tạo Flash Sale thành công!");
    resetForm();
    fetchSales(currentPage.value);
  } catch (err) {
    console.error(err.message);
  }
}

async function updateFlashSale() {
  clearErrors();
  if (!validateForm()) return;

  try {
    const body = {
      ...form,
      started_date: formatDateToServer(form.started_date),
      ended_date: formatDateToServer(form.ended_date),
    };

    const res = await fetch(`http://localhost:8080/api/flash-sale/${editId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Cập nhật thất bại");
    alert("✅ Cập nhật Flash Sale thành công!");
    resetForm();
    fetchSales(currentPage.value);
  } catch (err) {
    console.error(err.message);
  }
}

async function deleteSale(id) {
  if (!confirm("Bạn có chắc chắn muốn xoá Flash Sale này?")) return;
  try {
    const res = await fetch(`http://localhost:8080/api/flash-sale/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Xoá thất bại");
    alert("🗑️ Xoá thành công!");
    fetchSales(currentPage.value);
  } catch (err) {
    console.error(err.message);
  }
}

// --- Helpers ---
function resetForm() {
  form.title = "";
  form.discount = 0;
  form.started_date = "";
  form.ended_date = "";
  form.active = false;
  editMode.value = false;
  editId.value = null;
  clearErrors();
}

function clearErrors() {
  for (let k in errors) errors[k] = "";
}

function validateForm() {
  let valid = true;
  if (!form.title) { errors.title = "Tiêu đề không được để trống"; valid = false; }
  if (form.discount < 0 || form.discount > 100) { errors.discount = "Giảm giá phải từ 0–100"; valid = false; }
  if (!form.started_date) { errors.started_date = "Ngày bắt đầu không được để trống"; valid = false; }
  if (!form.ended_date) { errors.ended_date = "Ngày kết thúc không được để trống"; valid = false; }
  return valid;
}

// --- Router logic ---
function editSale(sale) {
  router.push({ name: "FlashSale", params: { id: sale.id } });
}

function cancelEdit() {
  router.push({ name: "FlashSale" });
  resetForm();
}

watch(() => route.params.id, async (id) => {
  if (id) {
    editMode.value = true;
    editId.value = id;
    try {
      const res = await fetch(`http://localhost:8080/api/flash-sale/${id}`);
      const sale = await res.json();
      form.title = sale.title;
      form.discount = sale.discount;
      form.started_date = sale.started_date?.replace(" ", "T").slice(0, 16) || "";
      form.ended_date = sale.ended_date?.replace(" ", "T").slice(0, 16) || "";
      form.active = sale.active;
    } catch (err) {
      console.error(err);
    }
  } else {
    resetForm();
  }
});

onMounted(fetchSales);
</script>

<style scoped>
.text-danger { font-size: 0.875rem; }
.page-link { cursor: pointer; }
</style>
