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
            placeholder="Nhập tên thuộc tính (VD: Màu sắc, Kích thước, RAM)..."
            :class="{ 'is-invalid': v_attr$.name.$error }"
            @blur="v_attr$.name.$touch()"
          />
          <small class="text-danger" v-if="v_attr$.name.$error">
            {{ v_attr$.name.$errors[0].$message }}
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
            {{ v_val$.name.$errors[0].$message }}
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

/* ===== DATA SOURCES ===== */
const attributes = ref([]);
const allAttributes = ref([]);
const values = ref([]);

/* ===== FORMS ===== */
const attributeForm = ref({ id: null, name: "" });
const valueForm = ref({ id: null, optionAttributeId: "", name: "" });

/* ===== STATES ===== */
const isEditAttribute = ref(false);
const isEditValue = ref(false);

/* ===== TABLE COLUMNS ===== */
const attrColumns = [
  { label: "ID", field: "id" },
  { label: "Tên thuộc tính", field: "name" },
  { label: "Hành động", field: "actions" },
];
const valColumns = [
  { label: "ID", field: "id" },
  { label: "Thuộc tính", field: "attrName" },
  { label: "Giá trị", field: "name" },
  { label: "Hành động", field: "actions" },
];

/* ===== PAGINATION ===== */
const paginationOptions = {
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
};

/* ===== VALIDATION RULES (SMART LOGIC FIXED) ===== */

// 1. Check trùng tên thuộc tính
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

// 2. Check trùng giá trị trong cùng 1 thuộc tính
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

// 3. LOGIC FORMAT THÔNG MINH (Đã sửa lỗi tham số undefined)
const smartFormat = helpers.withMessage(
  // A. Hàm tạo thông báo lỗi động
  () => { // Không cần tham số đầu vào nữa, lấy trực tiếp từ valueForm
    const attrId = valueForm.value.optionAttributeId;
    const attr = allAttributes.value.find((a) => a.id === attrId);
    
    if (!attr) return "Định dạng không hợp lệ";
    
    const name = (attr.name || "").toLowerCase();
    
    if (name.includes("màu")) return "Màu sắc không được chứa số (VD: Xanh, Đỏ, Titan)";
    
    if (["ram", "rom", "dung lượng", "bộ nhớ"].some(k => name.includes(k))) {
      return "Dung lượng phải là số + GB/TB (VD: 8GB, 256GB)";
    }
    
    if (name.includes("màn hình")) {
      return "Màn hình phải là số + inch (VD: 6.1 inch, 15.6\")";
    }

    if (name.includes("kích thước")) {
      return "Kích thước sai định dạng (VD: 147x71x7 mm)";
    }
    
    return "Giá trị không đúng định dạng";
  },
  
  // B. Hàm kiểm tra logic (Regex)
  (value) => { // Chỉ lấy value, còn attrId lấy từ valueForm.value
    const attrId = valueForm.value.optionAttributeId;
    if (!value || !attrId) return true;
    
    const attr = allAttributes.value.find((a) => a.id === attrId);
    if (!attr) return true;

    const name = (attr.name || "").toLowerCase();
    const val = value.trim();

    // RULE 1: KÍCH THƯỚC (Điện thoại/Lap/Tai nghe)
    if (name.includes("kích thước")) {
        // Format: 147.6x71.6x7.8mm HOẶC có khoảng trắng
        return /^\d+(\.\d+)?\s*[xX]\s*\d+(\.\d+)?\s*[xX]\s*\d+(\.\d+)?\s*(mm|cm)$/i.test(val);
    }

    // RULE 2: RAM / ROM / DUNG LƯỢNG
    if (["ram", "rom", "dung lượng", "bộ nhớ"].some(k => name.includes(k))) {
       return /^\d+\s*(GB|TB|MB)$/i.test(val);
    }

    // RULE 3: MÀN HÌNH
    if (name.includes("màn hình")) {
       return /^\d+(\.\d+)?\s*(inch|in|("|”))$/i.test(val);
    }

    // RULE 4: MÀU SẮC
    if (name.includes("màu")) {
       return !/\d/.test(val);
    }

    return true; 
  }
);

/* ===== KHỞI TẠO VUELIDATE ===== */
const attributeRules = {
  name: {
    required: helpers.withMessage("Tên thuộc tính không được để trống", required),
    minLength: helpers.withMessage("Tên thuộc tính ít nhất 3 ký tự", minLength(3)),
    duplicateAttributeName,
  },
};
const v_attr$ = useVuelidate(attributeRules, attributeForm);

const valueRules = {
  optionAttributeId: {
    required: helpers.withMessage("Vui lòng chọn thuộc tính", required),
  },
  name: {
    required: helpers.withMessage("Giá trị không được để trống", required),
    duplicateValue,
    smartFormat, // <-- Đã sửa lỗi
  },
};
const v_val$ = useVuelidate(valueRules, valueForm);

/* ===== API CALLS ===== */
const fetchAttributes = async () => {
  try {
      const res = await axios.get("/api/option-attribute", { params: { page: 0, size: 1000 } });
      attributes.value = res.data.data || res.data.content || [];
      allAttributes.value = attributes.value;
  } catch (err) { console.error(err); }
};

const fetchValues = async () => {
  try {
      const res = await axios.get("/api/value-attribute", { params: { page: 0, size: 1000 } });
      values.value = res.data.data || res.data.content || [];
  } catch (err) { console.error(err); }
};

const findAttrName = (id) => {
  const attr = allAttributes.value.find((a) => a.id === id);
  return attr ? attr.name : "Không xác định";
};

/* ===== ACTIONS: ATTRIBUTE ===== */
const saveAttribute = async () => {
  const isValid = await v_attr$.value.$validate();
  if (!isValid) return;

  const { id, name } = attributeForm.value;
  try {
    if (isEditAttribute.value) {
      await axios.put(`/api/option-attribute/${id}`, { name });
      Swal.fire({ icon: "success", title: "Thành công", showConfirmButton: false, timer: 1200 });
    } else {
      await axios.post(`/api/option-attribute`, { name });
      Swal.fire({ icon: "success", title: "Thành công", showConfirmButton: false, timer: 1200 });
    }
    cancelEditAttribute();
    fetchAttributes();
  } catch (err) { Swal.fire("Lỗi", err.response?.data?.message || "Lỗi hệ thống", "error"); }
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
    title: "Xác nhận xóa?",
    text: "Hành động này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (confirm.isConfirmed) {
      try {
          await axios.delete(`/api/option-attribute/${id}`);
          Swal.fire("Đã xóa!", "", "success");
          fetchAttributes();
      } catch (err) { Swal.fire("Lỗi", "Không thể xóa (có thể đang được sử dụng)", "error"); }
  }
};

/* ===== ACTIONS: VALUE ===== */
const saveValue = async () => {
  const isValid = await v_val$.value.$validate();
  if (!isValid) return;

  const { id, optionAttributeId, name } = valueForm.value;
  try {
    if (isEditValue.value) {
      await axios.put(`/api/value-attribute/${id}`, { optionAttributeId, name });
      Swal.fire({ icon: "success", title: "Thành công", showConfirmButton: false, timer: 1200 });
    } else {
      await axios.post(`/api/value-attribute`, { optionAttributeId, name });
      Swal.fire({ icon: "success", title: "Thành công", showConfirmButton: false, timer: 1200 });
    }
    cancelEditValue();
    fetchValues();
  } catch (err) { Swal.fire("Lỗi", err.response?.data?.message || "Lỗi hệ thống", "error"); }
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
    title: "Xác nhận xóa?",
    text: "Hành động này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (confirm.isConfirmed) {
      try {
          await axios.delete(`/api/value-attribute/${id}`);
          Swal.fire("Đã xóa!", "", "success");
          fetchValues();
      } catch (err) { Swal.fire("Lỗi", "Không thể xóa", "error"); }
  }
};

onMounted(() => {
  fetchAttributes();
  fetchValues();
});
</script>

<style scoped>
/* ===== STYLE GIỮ NGUYÊN ===== */
hr { border: 0; border-top: 1px solid #e9ecef; opacity: 1; }
.add-attr-btn, .cancel-btn {
  display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500;
  padding: 8px 16px; border: 1px solid transparent; border-radius: 6px; height: 38px;
  cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.add-attr-btn:hover, .cancel-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
.add-attr-btn { background-color: #198754; color: #fff; border-color: #198754; }
.add-attr-btn:hover { background-color: #157347; border-color: #146c43; }
.cancel-btn { background-color: #6c757d; color: #fff; border-color: #6c757d; }
.cancel-btn:hover { background-color: #5c636a; border-color: #565e64; }

.form-control:focus, .form-select:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); }
.form-control.is-invalid, .form-select.is-invalid { border-color: #dc3545; }
.form-control.is-invalid:focus, .form-select.is-invalid:focus { border-color: #dc3545; box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25); }
.text-danger { font-size: 0.875rem; margin-top: 4px; display: block; }

:deep(.vgt-table-wrapper) {
  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
}
:deep(.vgt-table thead th) { position: sticky !important; top: 0 !important; background: white !important; z-index: 10 !important; }
</style>