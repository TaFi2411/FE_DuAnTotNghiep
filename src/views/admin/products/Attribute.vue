<template>
  <div class="container mt-4">
    <h3>Quản lý Thuộc Tính & Giá Trị</h3>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'attribute' }"
          @click="activeTab = 'attribute'"
        >
          Thuộc tính
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'value' }"
          @click="activeTab = 'value'"
        >
          Giá trị thuộc tính
        </button>
      </li>
    </ul>

    <div v-if="activeTab === 'attribute'">
      <div class="d-flex gap-2 mb-1 flex-wrap">
        <div class="flex-grow-1">
          <input
            v-model.lazy="attributeForm.name"
            type="text"
            class="form-control"
            placeholder="Nhập tên thuộc tính..."
            :class="{ 'is-invalid': v_attr$.name.$error }"
            @blur="v_attr$.name.$touch()"
          />
          <small class="text-danger" v-if="v_attr$.name.$error">
            <span v-if="v_attr$.name.required.$invalid">Tên thuộc tính không được để trống</span>
            <span v-else-if="v_attr$.name.minLength.$invalid">Tên thuộc tính ít nhất 3 ký tự</span>
            <span v-else-if="v_attr$.name.duplicateAttributeName.$invalid">Tên thuộc tính đã tồn tại</span>
          </small>
        </div>
        <button class="add-attr-btn" @click="saveAttribute">
          <i class="bi" :class="isEditAttribute ? 'bi-check-lg' : 'bi-plus-lg'"></i>
          {{ isEditAttribute ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button
          v-if="isEditAttribute"
          class="cancel-btn"
          @click="cancelEditAttribute"
        >
          <i class="bi bi-x-lg"></i> Hủy
        </button>
      </div>

      <hr class="my-3" />

      <vue-good-table
        :columns="attrColumns"
        :rows="attributes"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm thuộc tính...' }"
        theme="polar-bear"
        :max-height="'60vh'"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'actions'">
            <div class="d-flex justify-content-center gap-1">
              <button
                class="btn btn-outline-warning btn-sm"
                @click="editAttribute(props.row)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="deleteAttribute(props.row.id)"
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

    <div v-else>
      <div class="d-flex gap-2 mb-1 flex-wrap">
        <div class="w-auto">
          <select
            v-model="valueForm.optionAttributeId"
            class="form-select"
            :class="{ 'is-invalid': v_val$.optionAttributeId.$error }"
            @blur="v_val$.optionAttributeId.$touch()"
          >
            <option value="">-- Chọn thuộc tính --</option>
            <option v-for="a in allAttributes" :key="a.id" :value="a.id">
              {{ a.name }}
            </option>
          </select>
          <small class="text-danger" v-if="v_val$.optionAttributeId.$error">
            <span>{{ v_val$.optionAttributeId.$errors[0].$message }}</span>
          </small>
        </div>
        <div class="flex-grow-1">
          <input
            v-model.lazy="valueForm.name"
            type="text"
            class="form-control"
            placeholder="Nhập giá trị..."
            :class="{ 'is-invalid': v_val$.name.$error }"
            @blur="v_val$.name.$touch()"
          />
          <small class="text-danger" v-if="v_val$.name.$error">
            <span v-if="v_val$.name.required.$invalid">Giá trị không được để trống</span>
            <span v-else-if="v_val$.name.duplicateValue.$invalid">Giá trị này đã tồn tại</span>
          </small>
        </div>
        <button class="add-attr-btn" @click="saveValue">
          <i class="bi" :class="isEditValue ? 'bi-check-lg' : 'bi-plus-lg'"></i>
          {{ isEditValue ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button
          v-if="isEditValue"
          class="cancel-btn"
          @click="cancelEditValue"
        >
          <i class="bi bi-x-lg"></i> Hủy
        </button>
      </div>

      <hr class="my-3" />

      <vue-good-table
        :columns="valColumns"
        :rows="values"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm giá trị...' }"
        theme="polar-bear"
        :max-height="'60vh'"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'attrName'">
            {{ findAttrName(props.row.optionAttributeId) }}
          </span>
          <span v-else-if="props.column.field === 'actions'">
            <div class="d-flex justify-content-center gap-1">
              <button
                class="btn btn-outline-warning btn-sm"
                @click="editValue(props.row)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="deleteValue(props.row.id)"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "@/composables/axios.js";
import useVuelidate from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import "vue-good-table-next/dist/vue-good-table-next.css";

const activeTab = ref("attribute");

/* ===== THUỘC TÍNH ===== */
const attributes = ref([]);
const allAttributes = ref([]);
const attributeForm = ref({ id: null, name: "" });
const isEditAttribute = ref(false);

const attrColumns = [
  { label: "ID", field: "id" },
  { label: "Tên thuộc tính", field: "name" },
  { label: "Hành động", field: "actions" },
];

/* ===== GIÁ TRỊ ===== */
const values = ref([]);
const valueForm = ref({ id: null, optionAttributeId: "", name: "" });
const isEditValue = ref(false);

const valColumns = [
  { label: "ID", field: "id" },
  { label: "Thuộc tính", field: "attrName" },
  { label: "Giá trị", field: "name" },
  { label: "Hành động", field: "actions" },
];

/* ===== PHÂN TRANG ===== */
const paginationOptions = {
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
};

/* ===== VUELIDATE ===== */
// 1. Rules cho Thuộc tính
const duplicateAttributeName = helpers.withMessage(
  "Tên thuộc tính đã tồn tại",
  (value) => {
    const name = (value || "").trim().toLowerCase();
    if (!name) return true;
    return !attributes.value.some(
      (a) =>
        a.name.trim().toLowerCase() === name &&
        a.id !== attributeForm.value.id
    );
  }
);

const attributeRules = {
  name: {
    required: helpers.withMessage("Tên thuộc tính không được để trống", required),
    minLength: helpers.withMessage("Tên thuộc tính ít nhất 3 ký tự", minLength(3)),
    duplicateAttributeName,
  },
};
const v_attr$ = useVuelidate(attributeRules, attributeForm);

// 2. Rules cho Giá trị
const duplicateValue = helpers.withMessage("Giá trị này đã tồn tại", (value) => {
  const name = (value || "").trim().toLowerCase();
  const attrId = valueForm.value.optionAttributeId;
  if (!name || !attrId) return true;

  return !values.value.some(
    (v) =>
      v.name.trim().toLowerCase() === name &&
      v.optionAttributeId === attrId &&
      v.id !== valueForm.value.id
  );
});

const valueRules = {
  optionAttributeId: {
    required: helpers.withMessage("Vui lòng chọn thuộc tính", required),
  },
  name: {
    required: helpers.withMessage("Giá trị không được để trống", required),
    duplicateValue,
  },
};
const v_val$ = useVuelidate(valueRules, valueForm);

/* ===== API ===== */
const fetchAttributes = async () => {
  const res = await axios.get("/api/option-attribute", { params: { page: 0, size: 1000 } });
  attributes.value = res.data.data || res.data.content || [];
  allAttributes.value = attributes.value;
};

const fetchValues = async () => {
  const res = await axios.get("/api/value-attribute", { params: { page: 0, size: 1000 } });
  values.value = res.data.data || res.data.content || [];
};

const findAttrName = (id) => {
  const attr = allAttributes.value.find((a) => a.id === id);
  return attr ? attr.name : "Không xác định";
};

/* ===== HÀNH ĐỘNG THUỘC TÍNH ===== */
const saveAttribute = async () => {
  const isValid = await v_attr$.value.$validate();
  if (!isValid) return;

  const { id, name } = attributeForm.value;
  try {
    if (isEditAttribute.value) {
      await axios.put(`/api/option-attribute/${id}`, { name });
      await Swal.fire({ icon: "success", title: "Cập nhật thành công", showConfirmButton: false, timer: 1500, timerProgressBar: true });
    } else {
      await axios.post(`/api/option-attribute`, { name });
      await Swal.fire({ icon: "success", title: "Thêm mới thành công", showConfirmButton: false, timer: 1500, timerProgressBar: true });
    }
    attributeForm.value = { id: null, name: "" };
    isEditAttribute.value = false;
    v_attr$.value.$reset();
    fetchAttributes();
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", err.response?.data?.message || "Đã có lỗi", "error");
  }
};

const editAttribute = (row) => {
  attributeForm.value = { id: row.id, name: row.name };
  isEditAttribute.value = true;
  v_attr$.value.$reset();
};

const cancelEditAttribute = () => {
  attributeForm.value = { id: null, name: "" };
  isEditAttribute.value = false;
  v_attr$.value.$reset();
};

const deleteAttribute = async (id) => {
  const confirm = await Swal.fire({
    title: "Xóa thuộc tính?",
    text: "Bạn có chắc muốn xóa thuộc tính này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (!confirm.isConfirmed) return;
  await axios.delete(`/api/option-attribute/${id}`);
  Swal.fire("Đã xóa!", "Thuộc tính đã được xóa", "success");
  fetchAttributes();
};

/* ===== HÀNH ĐỘNG GIÁ TRỊ ===== */
const saveValue = async () => {
  const isValid = await v_val$.value.$validate();
  if (!isValid) return;

  const { id, optionAttributeId, name } = valueForm.value;
  try {
    if (isEditValue.value) {
      await axios.put(`/api/value-attribute/${id}`, { optionAttributeId, name });
      await Swal.fire({ icon: "success", title: "Cập nhật thành công", showConfirmButton: false, timer: 1500, timerProgressBar: true });
    } else {
      await axios.post(`/api/value-attribute`, { optionAttributeId, name });
      await Swal.fire({ icon: "success", title: "Thêm mới thành công", showConfirmButton: false, timer: 1500, timerProgressBar: true });
    }
    valueForm.value = { id: null, optionAttributeId: "", name: "" };
    isEditValue.value = false;
    v_val$.value.$reset();
    fetchValues();
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", err.response?.data?.message || "Đã có lỗi", "error");
  }
};

const editValue = (row) => {
  valueForm.value = { id: row.id, optionAttributeId: row.optionAttributeId, name: row.name };
  isEditValue.value = true;
  v_val$.value.$reset();
};

const cancelEditValue = () => {
  valueForm.value = { id: null, optionAttributeId: "", name: "" };
  isEditValue.value = false;
  v_val$.value.$reset();
};

const deleteValue = async (id) => {
  const confirm = await Swal.fire({
    title: "Xóa giá trị?",
    text: "Bạn có chắc muốn xóa giá trị này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (!confirm.isConfirmed) return;
  await axios.delete(`/api/value-attribute/${id}`); // Đã sửa đường dẫn API cho đúng với create/update
  Swal.fire("Đã xóa!", "Giá trị đã được xóa", "success");
  fetchValues();
};

onMounted(() => {
  fetchAttributes();
  fetchValues();
});
</script>

<style scoped>
/* ===== Đường phân cách ===== */
hr {
  border: 0;
  border-top: 1px solid #e9ecef;
  opacity: 1;
}

/* ===== Buttons ===== */
.add-attr-btn, .cancel-btn {
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
.add-attr-btn:hover, .cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.add-attr-btn { background-color: #198754; color: #fff; border-color: #198754; }
.add-attr-btn:hover { background-color: #157347; border-color: #146c43; }
.cancel-btn { background-color: #6c757d; color: #fff; border-color: #6c757d; }
.cancel-btn:hover { background-color: #5c636a; border-color: #565e64; }

/* ===== Inputs ===== */
.form-control:focus, .form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
.form-control.is-invalid, .form-select.is-invalid {
  border-color: #dc3545;
}
/* Quan trọng: Style cho Lazy Validation khi focus vào lỗi */
.form-control.is-invalid:focus, .form-select.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.text-danger { font-size: 0.875rem; margin-top: 4px; display: block; }

/* ===== Table Scrollbar & Sticky Header ===== */
:deep(.vgt-table-wrapper) {
  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
}
:deep(.vgt-table thead th) {
  position: sticky !important;
  top: 0 !important;
  background: white !important;
  z-index: 10 !important;
}
</style>