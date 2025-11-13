<template>
  <div class="container mt-4">
    <h3>Quản lý Thuộc Tính & Giá Trị</h3>

    <!-- Tabs -->
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

    <!-- ===================== BẢNG THUỘC TÍNH ===================== -->
    <div v-if="activeTab === 'attribute'">
      <div class="d-flex gap-2 mb-1 flex-wrap">
        <input
          v-model="attributeForm.name"
          type="text"
          class="form-control w-auto flex-grow-1"
          placeholder="Nhập tên thuộc tính..."
        />
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
      <small class="text-danger" v-if="attributeError">{{ attributeError }}</small>

      <vue-good-table
        :columns="attrColumns"
        :rows="attributes"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm thuộc tính...' }"
        theme="polar-bear"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'actions'">
            <button
              class="btn btn-warning btn-sm me-2"
              @click="editAttribute(props.row)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteAttribute(props.row.id)"
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

    <!-- ===================== BẢNG GIÁ TRỊ ===================== -->
    <div v-else>
      <div class="d-flex gap-2 mb-1 flex-wrap">
        <select v-model="valueForm.optionAttributeId" class="form-select w-auto">
          <option value="">-- Chọn thuộc tính --</option>
          <option v-for="a in allAttributes" :key="a.id" :value="a.id">
            {{ a.name }}
          </option>
        </select>

        <input
          v-model="valueForm.name"
          type="text"
          class="form-control w-auto flex-grow-1"
          placeholder="Nhập giá trị..."
        />

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
      <small class="text-danger" v-if="valueError">{{ valueError }}</small>

      <vue-good-table
        :columns="valColumns"
        :rows="values"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm giá trị...' }"
        theme="polar-bear"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'attrName'">
            {{ findAttrName(props.row.optionAttributeId) }}
          </span>
          <span v-else-if="props.column.field === 'actions'">
            <button
              class="btn btn-warning btn-sm me-2"
              @click="editValue(props.row)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteValue(props.row.id)"
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
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "@/composables/axios.js";

const activeTab = ref("attribute");

/* ===== THUỘC TÍNH ===== */
const attributes = ref([]);
const allAttributes = ref([]);
const attributeForm = ref({ id: null, name: "" });
const isEditAttribute = ref(false);
const attributeError = ref("");

// Columns
const attrColumns = [
  { label: "ID", field: "id" },
  { label: "Tên thuộc tính", field: "name" },
  { label: "Hành động", field: "actions" },
];

/* ===== GIÁ TRỊ ===== */
const values = ref([]);
const valueForm = ref({ id: null, optionAttributeId: "", name: "" });
const isEditValue = ref(false);
const valueError = ref("");

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

/* ===== THUỘC TÍNH ===== */
const saveAttribute = async () => {
  const name = attributeForm.value.name.trim();
  if (!name) return (attributeError.value = "Tên thuộc tính không được để trống");

  if (attributes.value.some(a => a.name.toLowerCase() === name.toLowerCase() && a.id !== attributeForm.value.id)) {
    return (attributeError.value = "Tên thuộc tính đã tồn tại");
  }

  attributeError.value = "";

  if (isEditAttribute.value) {
    await axios.put(`/api/option-attribute/${attributeForm.value.id}`, { name });
   await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
  } else {
    await axios.post(`/api/option-attribute`, { name });
   await Swal.fire({
        icon: "success",
        title: "Thêm mới thành công",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
  }

  attributeForm.value = { id: null, name: "" };
  isEditAttribute.value = false;
  fetchAttributes();
};

const editAttribute = (row) => {
  attributeForm.value = { id: row.id, name: row.name };
  isEditAttribute.value = true;
  attributeError.value = "";
};

const cancelEditAttribute = () => {
  attributeForm.value = { id: null, name: "" };
  isEditAttribute.value = false;
  attributeError.value = "";
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

/* ===== GIÁ TRỊ ===== */
const saveValue = async () => {
  const { optionAttributeId, name } = valueForm.value;
  if (!optionAttributeId || !name.trim()) return (valueError.value = "Vui lòng nhập đầy đủ thông tin");

  if (values.value.some(v => v.name.toLowerCase() === name.trim().toLowerCase() && v.optionAttributeId === optionAttributeId && v.id !== valueForm.value.id)) {
    return (valueError.value = "Giá trị đã tồn tại");
  }

  valueError.value = "";

  if (isEditValue.value) {
    await axios.put(`/api/value-attribute/${valueForm.value.id}`, { optionAttributeId, name });
    await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
  } else {
    await axios.post(`/api/value-attribute`, { optionAttributeId, name });
    await Swal.fire({
        icon: "success",
        title: "Thêm mới thành công",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
  }

  valueForm.value = { id: null, optionAttributeId: "", name: "" };
  isEditValue.value = false;
  fetchValues();
};

const editValue = (row) => {
  valueForm.value = { id: row.id, optionAttributeId: row.optionAttributeId, name: row.name };
  isEditValue.value = true;
  valueError.value = "";
};

const cancelEditValue = () => {
  valueForm.value = { id: null, optionAttributeId: "", name: "" };
  isEditValue.value = false;
  valueError.value = "";
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
  await axios.delete(`/api/value-attribute/${id}`);
  Swal.fire("Đã xóa!", "Giá trị đã được xóa", "success");
  fetchValues();
};

/* ===== MOUNT ===== */
onMounted(() => {
  fetchAttributes();
  fetchValues();
});
</script>

<style scoped>
.btn-sm {
  padding: 3px 6px;
  font-size: 13px;
}

/* ✅ Nút thêm / cập nhật giống voucher */
.add-attr-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 5px 12px;
  border: 1px solid #198754;
  border-radius: 6px;
  background-color: #fff;
  color: #198754;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-attr-btn i {
  font-size: 13px;
}

.add-attr-btn:hover {
  background-color: #198754;
  color: #fff;
  box-shadow: 0 2px 5px rgba(25, 135, 84, 0.25);
  transform: translateY(-1px);
}

/* ✅ Nút hủy tinh tế, đồng bộ */
.cancel-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 5px 12px;
  border: 1px solid #6c757d;
  border-radius: 6px;
  background-color: #fff;
  color: #6c757d;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn i {
  font-size: 13px;
}

.cancel-btn:hover {
  background-color: #6c757d;
  color: #fff;
  box-shadow: 0 2px 5px rgba(108, 117, 125, 0.25);
  transform: translateY(-1px);
}
</style>
