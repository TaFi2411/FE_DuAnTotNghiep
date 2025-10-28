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
      <div class="d-flex gap-2 mb-3 flex-wrap">
        <input
          v-model="attributeForm.name"
          type="text"
          class="form-control w-auto flex-grow-1"
          placeholder="Nhập tên thuộc tính..."
        />
        <button class="btn btn-primary" @click="saveAttribute">
          {{ isEditAttribute ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button
          v-if="isEditAttribute"
          class="btn btn-secondary"
          @click="cancelEditAttribute"
        >
          Hủy
        </button>
      </div>

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
      <div class="d-flex gap-2 mb-3 flex-wrap">
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

        <button class="btn btn-primary" @click="saveValue">
          {{ isEditValue ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button
          v-if="isEditValue"
          class="btn btn-secondary"
          @click="cancelEditValue"
        >
          Hủy
        </button>
      </div>

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

/* =====================================================
   =============== QUẢN LÝ THUỘC TÍNH ==================
===================================================== */
const attributes = ref([]);
const allAttributes = ref([]);
const attributeForm = ref({ id: null, name: "" });
const isEditAttribute = ref(false);

const attrColumns = [
  { label: "ID", field: "id" },
  { label: "Tên thuộc tính", field: "name" },
  { label: "Hành động", field: "actions" },
];

// ✅ Phân trang frontend chung cho cả 2 bảng
const paginationOptions = {
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
};

const fetchAttributes = async () => {
  const res = await axios.get("/api/option-attribute", {
    params: { page: 0, size: 1000 }, // ✅ Lấy tối đa 1000 bản ghi
  });
  attributes.value = res.data.data || res.data.content || [];
  allAttributes.value = attributes.value;
};

const saveAttribute = async () => {
  const name = attributeForm.value.name.trim();
  if (!name)
    return Swal.fire("Lỗi!", "Tên thuộc tính không được để trống", "error");

  if (isEditAttribute.value) {
    await axios.put(`/api/option-attribute/${attributeForm.value.id}`, { name });
    Swal.fire("Thành công!", "Cập nhật thuộc tính thành công", "success");
  } else {
    await axios.post(`/api/option-attribute`, { name });
    Swal.fire("Thành công!", "Thêm mới thuộc tính thành công", "success");
  }

  attributeForm.value = { id: null, name: "" };
  isEditAttribute.value = false;
  fetchAttributes();
};

const editAttribute = (row) => {
  attributeForm.value = { id: row.id, name: row.name };
  isEditAttribute.value = true;
};

const cancelEditAttribute = () => {
  attributeForm.value = { id: null, name: "" };
  isEditAttribute.value = false;
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

/* =====================================================
   =============== QUẢN LÝ GIÁ TRỊ ======================
===================================================== */
const values = ref([]);
const valueForm = ref({ id: null, optionAttributeId: "", name: "" });
const isEditValue = ref(false);

const valColumns = [
  { label: "ID", field: "id" },
  { label: "Thuộc tính", field: "attrName" },
  { label: "Giá trị", field: "name" },
  { label: "Hành động", field: "actions" },
];

const fetchValues = async () => {
  const res = await axios.get("/api/value-attribute", {
    params: { page: 0, size: 1000 }, // ✅ Lấy tối đa 1000 giá trị
  });
  values.value = res.data.data || res.data.content || [];
};

const findAttrName = (id) => {
  const attr = allAttributes.value.find((a) => a.id === id);
  return attr ? attr.name : "Không xác định";
};

const saveValue = async () => {
  const { optionAttributeId, name } = valueForm.value;
  if (!optionAttributeId || !name.trim())
    return Swal.fire("Lỗi!", "Vui lòng nhập đầy đủ thông tin", "error");

  if (isEditValue.value) {
    await axios.put(`/api/value-attribute/${valueForm.value.id}`, {
      optionAttributeId,
      name,
    });
    Swal.fire("Thành công!", "Cập nhật giá trị thành công", "success");
  } else {
    await axios.post(`/api/value-attribute`, { optionAttributeId, name });
    Swal.fire("Thành công!", "Thêm mới giá trị thành công", "success");
  }

  valueForm.value = { id: null, optionAttributeId: "", name: "" };
  isEditValue.value = false;
  fetchValues();
};

const editValue = (row) => {
  valueForm.value = {
    id: row.id,
    optionAttributeId: row.optionAttributeId,
    name: row.name,
  };
  isEditValue.value = true;
};

const cancelEditValue = () => {
  valueForm.value = { id: null, optionAttributeId: "", name: "" };
  isEditValue.value = false;
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

/* =====================================================
   =============== KHỞI CHẠY ===========================
===================================================== */
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
</style>
