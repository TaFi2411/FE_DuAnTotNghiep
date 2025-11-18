<template>
  <div class="p-3">
    <h3 class="mb-3">Quản lý Category</h3>

    <div class="d-flex gap-2 mb-3 flex-wrap align-items-center">
      <div class="flex-grow-1">
        <input
          v-model="form.name"
          type="text"
          class="form-control"
          placeholder="Nhập tên danh mục..."
          @input="onNameInput"
          :class="{ 'is-invalid': v$.name.$error }"
        />
        <small class="text-danger" v-if="v$.name.$error">
          <span v-if="v$.name.required.$invalid"
            >Tên danh mục không được để trống</span
          >
          <span v-else-if="v$.name.minLength.$invalid"
            >Tên danh mục ít nhất 3 ký tự</span
          >
          <span v-else-if="v$.name.duplicateName.$invalid"
            >Tên danh mục đã tồn tại</span
          >
        </small>
      </div>

      <div class="w-auto">
        <input
          v-model="form.slug"
          type="text"
          class="form-control"
          placeholder="Slug tự tạo"
          disabled
          :class="{ 'is-invalid': v$.slug.$error }"
        />
        <small class="text-danger" v-if="v$.slug.$error">
          <span v-if="v$.slug.required.$invalid"
            >Slug không được bỏ trống</span
          >
          <span v-else-if="v$.slug.duplicateSlug.$invalid"
            >Slug đã tồn tại</span
          >
        </small>
      </div>

      <div class="form-check">
        <input
          v-model="form.status"
          type="checkbox"
          class="form-check-input"
          id="status"
        />
        <label class="form-check-label" for="status">Hoạt động</label>
      </div>

      <button class="add-category-btn" @click="saveCategory">
        <i class="bi" :class="isEdit ? 'bi-check-lg' : 'bi-plus-lg'"></i>
        {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
      </button>

      <button v-if="isEdit" class="cancel-btn" @click="cancelEdit">
        <i class="bi bi-x-lg"></i> Hủy
      </button>
    </div>

    <hr class="my-3" />

    <vue-good-table
      :columns="columns"
      :rows="categories"
      :pagination-options="paginationOptions"
      :search-options="{ enabled: true, placeholder: 'Tìm kiếm danh mục...' }"
      theme="polar-bear"
      :max-height="'60vh'"
    >
      <template #table-row="props">
        <span v-if="props.column.field === 'status'">
          <span
            :class="['badge', props.row.status ? 'bg-success' : 'bg-secondary']"
          >
            {{ props.row.status ? 'Hoạt động' : 'Ẩn' }}
          </span>
        </span>

        <span v-else-if="props.column.field === 'actions'">
          <div class="d-flex justify-content-center gap-1">
            <button
              class="btn btn-outline-warning btn-sm"
              @click="editCategory(props.row)"
              title="Sửa danh mục"
            >
              <i class="bi bi-pencil"></i>
            </button>

            <button
              class="btn btn-outline-danger btn-sm"
              @click="confirmDelete(props.row.id)"
              title="Xóa danh mục"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </span>

        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";
import useVuelidate from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";

// ✅ BƯỚC 2: IMPORT CSS CỦA THƯ VIỆN
// (Bắt buộc để 'max-height' hoạt động đúng và cố định header)
import "vue-good-table-next/dist/vue-good-table-next.css";

const categories = ref([]);
const isEdit = ref(false);
const form = ref({ id: null, name: "", slug: "", status: true });

const columns = ref([
  { label: "ID", field: "id", sortable: true, width: "80px" },
  { label: "Slug", field: "slug", sortable: true },
  { label: "Tên danh mục", field: "name", sortable: true },
  { label: "Trạng thái", field: "status", width: "150px" },
  { label: "Hành động", field: "actions", width: "120px" },
]);

const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
});

// 🔹 Load danh mục
const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/category", {
      params: { page: 0, size: 1000 },
    });
    categories.value =
      (Array.isArray(res.data.data)
        ? res.data.data
        : res.data.content || res.data) || [];
  } catch (err) {
    console.error("❌ Lỗi tải danh mục:", err);
    Swal.fire("Lỗi", "Không thể tải danh mục!", "error");
  }
};

// 🔹 Chuyển name sang slug
const onNameInput = () => {
  form.value.slug = (form.value.name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// 🧩 Vuelidate rules
const duplicateName = helpers.withMessage(
  "Tên danh mục đã tồn tại",
  (value) => {
    if (!value) return true;
    return !categories.value.some(
      (c) =>
        c.name.trim().toLowerCase() === value.trim().toLowerCase() &&
        c.id !== form.value.id
    );
  }
);
const duplicateSlug = helpers.withMessage("Slug đã tồn tại", (value) => {
  if (!value) return true;
  return !categories.value.some(
    (c) =>
      c.slug.trim().toLowerCase() === value.trim().toLowerCase() &&
      c.id !== form.value.id
  );
});

const rules = {
  name: { required, minLength: minLength(3), duplicateName },
  slug: { required, duplicateSlug },
};
const v$ = useVuelidate(rules, form);

// 🔹 Thêm / cập nhật
const saveCategory = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    if (isEdit.value) {
      await axios.put(`/api/category/${form.value.id}`, form.value);
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      await axios.post("/api/category", form.value);
      Swal.fire({
        icon: "success",
        title: "Thêm mới thành công",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    form.value = { id: null, name: "", slug: "", status: true };
    v$.value.$reset();
    isEdit.value = false;

    fetchCategories();
  } catch (err) {
    console.error(err);
    Swal.fire(
      "Lỗi",
      err.response?.data?.message || "Đã có lỗi xảy ra",
      "error"
    );
  }
};

// 🔹 Chỉnh sửa
const editCategory = (row) => {
  form.value = { ...row };
  isEdit.value = true;
};

// 🔹 Hủy
const cancelEdit = () => {
  form.value = { id: null, name: "", slug: "", status: true };
  v$.value.$reset();
  isEdit.value = false;
};

// 🔹 Xóa
const confirmDelete = async (id) => {
  const confirm = await Swal.fire({
    title: "Xóa danh mục?",
    text: "Bạn có chắc chắn muốn xóa không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (!confirm.isConfirmed) return;
  try {
    await axios.delete(`/api/category/${id}`);
    Swal.fire("Đã xóa!", "Danh mục đã bị xóa.", "success");
    fetchCategories();
  } catch (err) {
    console.error("❌ Lỗi xoá danh mục:", err);
    Swal.fire("Lỗi", "Không thể xóa danh mục!", "error");
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
/* ===== Đường phân cách ===== */
hr {
  border: 0;
  border-top: 1px solid #e9ecef; /* Màu xám nhạt hiện đại */
  opacity: 1; /* Ghi đè opacity mặc định của Bootstrap */
}

/* ===== Nút Thêm / Hủy ===== */
/* Style cơ bản cho cả 2 nút */
.add-category-btn,
.cancel-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 6px;
  height: 38px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.add-category-btn:hover,
.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Nút Thêm (Xanh) */
.add-category-btn {
  background-color: #198754;
  color: #fff;
  border-color: #198754;
}
.add-category-btn:hover {
  background-color: #157347;
  border-color: #146c43;
}

/* Nút Hủy (Xám) */
.cancel-btn {
  background-color: #6c757d;
  color: #fff;
  border-color: #6c757d;
}
.cancel-btn:hover {
  background-color: #5c636a;
  border-color: #565e64;
}

/* ===== Form Controls (Input, Checkbox) ===== */
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}
.form-check-input:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

/* ===== Validation ===== */
.is-invalid {
  border-color: #dc3545;
}
.text-danger {
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
}

/* ===== ✅ CSS TÙY CHỈNH SCROLLBAR (ĐÃ THÊM) ===== */
/* Khi bạn dùng prop :max-height và import CSS,
  thư viện sẽ tự tạo ra 1 div wrapper 
  cho tbody với class '.vgt-table-wrapper'.
  Chúng ta chỉ cần style thanh cuộn của div đó.
*/
/* ===== Cố định header và cho tbody cuộn ===== */
:deep(.vgt-table-wrapper) {
  overflow-y: auto !important; /* Bắt buộc để scrollbar hiển thị */
  max-height: 60vh !important; /* Hoặc giá trị bạn muốn */
}

/* Giữ cố định thead */
:deep(.vgt-table thead tr) {
  position: sticky;
  top: 0;
  z-index: 5;
  background: white; /* Giữ nền để không bị trùng chữ khi cuộn */
}

/* ===== Scrollbar đẹp chỉ cho tbody ===== */
:deep(.vgt-table-wrapper::-webkit-scrollbar) {
  width: 8px;
}

:deep(.vgt-table-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 10px;
}

:deep(.vgt-table-wrapper::-webkit-scrollbar-thumb) {
  background: #bfbfbf;
  border-radius: 10px;
}

:deep(.vgt-table-wrapper::-webkit-scrollbar-thumb:hover) {
  background: #999;
}
</style>