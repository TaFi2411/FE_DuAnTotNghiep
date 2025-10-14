<template>
  <div class="container mt-4">
    <!-- Form thêm / sửa -->
    <div class="card mb-4">
      <div class="card-header">
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
              <label class="form-label">Giảm giá (%)</label>
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

          <button type="submit" class="btn btn-primary me-2">
            {{ editMode ? "Cập nhật" : "Tạo mới" }}
          </button>
          <button v-if="editMode" @click="cancelEdit" type="button" class="btn btn-secondary">
            Hủy
          </button>
        </form>
      </div>
    </div>

    <!-- Bảng danh sách -->
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
                <span class="badge" :class="sale.active ? 'bg-success' : 'bg-secondary'">
                  {{ sale.active ? "Đang hoạt động" : "Ngưng" }}
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
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page - 1 }"
            >
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
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// State
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
  active: false
});

const errors = reactive({});
const route = useRoute();
const router = useRouter();

// --- Format hiển thị giờ VN ---
function formatDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
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
    console.error("Lỗi tải danh sách:", err);
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
    const res = await fetch("http://localhost:8080/api/flash-sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form) // gửi trực tiếp
    });
    if (!res.ok) {
      const errData = await res.json();
      Object.assign(errors, errData);
      throw new Error("Tạo mới thất bại");
    }
    alert("Tạo Flash Sale thành công!");
    fetchSales(currentPage.value);
    resetForm();
  } catch (err) {
    console.error(err.message);
  }
}

async function updateFlashSale() {
  clearErrors();
  if (!validateForm()) return;

  try {
    const res = await fetch(`http://localhost:8080/api/flash-sale/${editId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form) // gửi trực tiếp
    });
    if (!res.ok) {
      const errData = await res.json();
      Object.assign(errors, errData);
      throw new Error("Cập nhật thất bại");
    }
    alert("Cập nhật Flash Sale thành công!");
    fetchSales(currentPage.value);
    resetForm();
  } catch (err) {
    console.error(err.message);
  }
}

async function deleteSale(id) {
  if (!confirm("Bạn có chắc chắn muốn xoá flash sale này?")) return;

  try {
    const res = await fetch(`http://localhost:8080/api/flash-sale/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Xoá thất bại");
    alert("Xoá thành công!");
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
  for (let key in errors) errors[key] = "";
}

function validateForm() {
  let valid = true;
  if (!form.title) { errors.title = "Tiêu đề không được để trống"; valid = false; }
  if (form.discount < 0 || form.discount > 100) { errors.discount = "Giảm giá phải từ 0-100"; valid = false; }
  if (!form.started_date) { errors.started_date = "Ngày bắt đầu không được để trống"; valid = false; }
  if (!form.ended_date) { errors.ended_date = "Ngày kết thúc không được để trống"; valid = false; }
  return valid;
}

// --- Khi nhấn sửa, push URL ---
function editSale(sale) {
  router.push({ name: 'FlashSale', params: { id: sale.id } });
}

// --- Hủy sửa ---
function cancelEdit() {
  router.push({ name: 'FlashSale' });
  resetForm();
}

// --- Watch URL param ---
watch(() => route.params.id, async (id) => {
  if (id) {
    editMode.value = true;
    editId.value = id;
    try {
      const res = await fetch(`http://localhost:8080/api/flash-sale/${id}`);
      const sale = await res.json();
      form.title = sale.title;
      form.discount = sale.discount;
      form.started_date = sale.started_date ? sale.started_date.replace(" ", "T").slice(0,16) : '';
      form.ended_date = sale.ended_date ? sale.ended_date.replace(" ", "T").slice(0,16) : '';
      form.active = sale.active;
    } catch (err) {
      console.error(err);
    }
  } else {
    resetForm();
  }
});

// --- Mounted ---
onMounted(() => {
  fetchSales();
});
</script>

<style scoped>
.card { box-shadow: 0 0 8px rgba(0,0,0,0.05); }
.text-danger { font-size: 0.875rem; }
.page-item.active .page-link { background-color: #0d6efd; border-color: #0d6efd; }
.page-link { cursor: pointer; }
</style>
