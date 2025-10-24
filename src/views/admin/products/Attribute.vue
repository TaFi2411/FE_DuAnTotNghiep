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

    <!-- 🔹 Thuộc tính -->
    <div v-if="activeTab === 'attribute'">
     <form @submit.prevent="handleAttributeSubmit" class="d-flex flex-wrap gap-2 mb-3">
  <input
    v-model="attributeForm.name"
    type="text"
    class="form-control flex-grow-1"
    placeholder="Nhập tên thuộc tính (VD: Màu sắc, RAM...)"
  />
  <div class="d-flex gap-2">
    <button class="btn btn-primary" type="submit">
      {{ isEditAttribute ? "Cập nhật" : "Thêm mới" }}
    </button>
    <button
      v-if="isEditAttribute"
      type="button"
      @click="cancelEditAttribute"
      class="btn btn-secondary"
    >
      Hủy
    </button>
  </div>
</form>


      <div v-if="errorAttribute" class="alert alert-danger py-2">
        {{ errorAttribute }}
      </div>

      <Table :columns="attrColumns" :rows="paginatedAttributes">
        <template #actions="{ row }">
          <button class="btn btn-warning btn-sm me-2" @click="editAttribute(row)">
            Sửa
          </button>
          <button class="btn btn-danger btn-sm" @click="deleteAttribute(row.id)">
            Xóa
          </button>
        </template>
      </Table>

      <!-- 📄 Phân trang -->
      <nav class="mt-3" v-if="totalPagesAttr > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPageAttr === 1 }">
            <button class="page-link" @click="prevPageAttr">«</button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPagesAttr"
            :key="page"
            :class="{ active: currentPageAttr === page }"
          >
            <button class="page-link" @click="goToPageAttr(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPageAttr === totalPagesAttr }">
            <button class="page-link" @click="nextPageAttr">»</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 🔹 Giá trị -->
    <div v-else>
      <form @submit.prevent="handleValueSubmit" class="d-flex gap-2 mb-3 flex-wrap">
        <select v-model="valueForm.optionAttributeId" class="form-select w-auto">
          <option value="">-- Chọn thuộc tính --</option>
          <option v-for="opt in listAttributes" :key="opt.id" :value="opt.id">
            {{ opt.name }}
          </option>
        </select>
        <input
          v-model="valueForm.name"
          type="text"
          class="form-control"
          placeholder="Nhập giá trị (VD: Đỏ, 8GB, 256GB)"
        />
        <button class="btn btn-primary" type="submit">
          {{ isEditValue ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button
          v-if="isEditValue"
          type="button"
          @click="cancelEditValue"
          class="btn btn-secondary"
        >
          Hủy
        </button>
      </form>

      <div v-if="errorValue" class="alert alert-danger py-2">
        {{ errorValue }}
      </div>

      <!-- 🔍 Tìm kiếm -->
      <div class="d-flex gap-2 mb-3">
        <select v-model="searchOptionId" class="form-select w-auto">
          <option value="">-- Tất cả thuộc tính --</option>
          <option v-for="opt in listAttributes" :key="opt.id" :value="opt.id">
            {{ opt.name }}
          </option>
        </select>
        <button class="btn btn-outline-primary" @click="handleSearch">Tìm kiếm</button>
        <button class="btn btn-outline-secondary" @click="resetSearch">Hiển thị tất cả</button>
      </div>

      <Table :columns="valColumns" :rows="paginatedValues">
        <template #actions="{ row }">
          <button class="btn btn-warning btn-sm me-2" @click="editValue(row)">
            Sửa
          </button>
          <button class="btn btn-danger btn-sm" @click="deleteValue(row.id)">
            Xóa
          </button>
        </template>
      </Table>

      <!-- 📄 Phân trang -->
      <nav class="mt-3" v-if="totalPagesVal > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPageVal === 1 }">
            <button class="page-link" @click="prevPageVal">«</button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPagesVal"
            :key="page"
            :class="{ active: currentPageVal === page }"
          >
            <button class="page-link" @click="goToPageVal(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPageVal === totalPagesVal }">
            <button class="page-link" @click="nextPageVal">»</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "@/composables/axios";
import Table from "@/components/Table.vue";

const BASE_ATTR = "/api/option-attribute";
const BASE_VAL = "/api/value-attribute";
const activeTab = ref("attribute");

/* ------------------ THUỘC TÍNH ------------------ */
const attributeList = ref([]);
const valueList = ref([]);
const attributeForm = ref({ id: null, name: "" });
const isEditAttribute = ref(false);
const errorAttribute = ref("");
const currentPageAttr = ref(1);
const pageSizeAttr = 5;

const attrColumns = [
  { label: "ID", field: "id" },
  { label: "Tên thuộc tính", field: "name" }
];

const totalPagesAttr = computed(() =>
  Math.ceil(attributeList.value.length / pageSizeAttr)
);
const paginatedAttributes = computed(() => {
  const start = (currentPageAttr.value - 1) * pageSizeAttr;
  return attributeList.value.slice(start, start + pageSizeAttr);
});
const goToPageAttr = (p) => (currentPageAttr.value = p);
const nextPageAttr = () => currentPageAttr.value++;
const prevPageAttr = () => currentPageAttr.value--;

const fetchAttributes = async () => {
  const res = await api.get(BASE_ATTR);
  attributeList.value = res.data.data || res.data;
};
const fetchValues = async () => {
  const res = await api.get(BASE_VAL);
  valueList.value = res.data.data?.content || res.data.data || res.data;
};

const handleAttributeSubmit = async () => {
  const name = attributeForm.value.name.trim();
  if (!name) return (errorAttribute.value = "Tên thuộc tính không được để trống.");

  const dup = attributeList.value.some(
    (a) =>
      a.name.trim().toLowerCase() === name.toLowerCase() &&
      a.id !== attributeForm.value.id
  );
  if (dup) return (errorAttribute.value = "Thuộc tính này đã tồn tại.");

  const payload = { name };
  if (isEditAttribute.value)
    await api.put(`${BASE_ATTR}/${attributeForm.value.id}`, payload);
  else await api.post(BASE_ATTR, payload);

  await fetchAttributes();
  cancelEditAttribute();
};

const editAttribute = (item) => {
  attributeForm.value = { id: item.id, name: item.name };
  isEditAttribute.value = true;
};

const deleteAttribute = async (id) => {
  const used = valueList.value.some((v) => String(v.optionAttributeId) === String(id));
  if (used)
    return Swal.fire("Không thể xóa", "Thuộc tính đang được sử dụng!", "warning");
  await api.delete(`${BASE_ATTR}/${id}`);
  await fetchAttributes();
};

const cancelEditAttribute = () => {
  attributeForm.value = { id: null, name: "" };
  isEditAttribute.value = false;
  errorAttribute.value = "";
};

/* ------------------ GIÁ TRỊ ------------------ */
const listValues = ref([]);
const listAttributes = attributeList;
const valueForm = ref({ id: null, optionAttributeId: "", name: "" });
const isEditValue = ref(false);
const errorValue = ref("");
const searchOptionId = ref("");
const currentPageVal = ref(1);
const pageSizeVal = 5;

const valColumns = [
  { label: "ID", field: "id" },
  { label: "Thuộc tính", field: "optionAttributeId", slot: "attrName" },
  { label: "Giá trị", field: "name" }
];

const totalPagesVal = computed(() =>
  Math.ceil(listValues.value.length / pageSizeVal)
);
const paginatedValues = computed(() => {
  const start = (currentPageVal.value - 1) * pageSizeVal;
  return listValues.value.slice(start, start + pageSizeVal);
});
const goToPageVal = (p) => (currentPageVal.value = p);
const nextPageVal = () => currentPageVal.value++;
const prevPageVal = () => currentPageVal.value--;

const fetchValueList = async (optionId = "") => {
  let url = BASE_VAL;
  if (optionId) url += `?optionAttributeId=${optionId}`;
  const res = await api.get(url);
  listValues.value = res.data.data?.content || res.data.data || res.data;
  currentPageVal.value = 1;
};
const handleSearch = async () => await fetchValueList(searchOptionId.value);
const resetSearch = async () => {
  searchOptionId.value = "";
  await fetchValueList();
};

const handleValueSubmit = async () => {
  const name = valueForm.value.name.trim();
  if (!valueForm.value.optionAttributeId)
    return (errorValue.value = "Vui lòng chọn thuộc tính.");
  if (!name) return (errorValue.value = "Giá trị không được để trống.");

  const dup = listValues.value.some(
    (v) =>
      String(v.optionAttributeId) === String(valueForm.value.optionAttributeId) &&
      v.name.trim().toLowerCase() === name.toLowerCase() &&
      v.id !== valueForm.value.id
  );
  if (dup)
    return (errorValue.value = "Giá trị này đã tồn tại cho thuộc tính đã chọn.");

  const payload = { optionAttributeId: valueForm.value.optionAttributeId, name };
  if (isEditValue.value)
    await api.put(`${BASE_VAL}/${valueForm.value.id}`, payload);
  else await api.post(BASE_VAL, payload);

  await fetchValueList(searchOptionId.value);
  cancelEditValue();
};

const editValue = (item) => {
  valueForm.value = {
    id: item.id,
    optionAttributeId: item.optionAttributeId,
    name: item.name
  };
  isEditValue.value = true;
  errorValue.value = "";
};

const deleteValue = async (id) => {
  const confirm = await Swal.fire({
    title: "Xóa giá trị?",
    text: "Bạn có chắc muốn xóa giá trị này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy"
  });
  if (!confirm.isConfirmed) return;
  await api.delete(`${BASE_VAL}/${id}`);
  await fetchValueList(searchOptionId.value);
};

const cancelEditValue = () => {
  isEditValue.value = false;
  valueForm.value = { id: null, optionAttributeId: "", name: "" };
  errorValue.value = "";
};

onMounted(async () => {
  await Promise.all([fetchAttributes(), fetchValues(), fetchValueList()]);
});
</script>
