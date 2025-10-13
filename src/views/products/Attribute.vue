<template>
  <div class="container">
    <h2>Quản lý Thuộc Tính Và Giá Trị</h2>

    <!-- Tabs -->
    <div class="tabs">
      <button
        :class="{ active: activeTab === 'attribute' }"
        @click="activeTab = 'attribute'"
      >
        Thuộc Tính
      </button>
      <button
        :class="{ active: activeTab === 'value' }"
        @click="activeTab = 'value'"
      >
        Giá Trị Thuộc Tính
      </button>
    </div>

    <!-- 🔹 Thuộc Tính -->
    <div v-if="activeTab === 'attribute'">
      <form @submit.prevent="handleAttributeSubmit" class="form-box">
        <input
          v-model="attributeForm.name"
          type="text"
          placeholder="Nhập tên thuộc tính (VD: Màu sắc, RAM...)"
          required
        />
        <button type="submit">
          {{ isEditAttribute ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button
          v-if="isEditAttribute"
          type="button"
          @click="cancelEditAttribute"
          class="cancel"
        >
          Hủy
        </button>
      </form>

      <p v-if="errorAttribute" class="error">{{ errorAttribute }}</p>

      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thuộc tính</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedAttributes" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <button @click="editAttribute(item)" class="edit">Sửa</button>
              <button @click="deleteAttribute(item.id)" class="delete">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="totalPagesAttr > 1">
        <button :disabled="currentPageAttr === 1" @click="prevPageAttr">« Trước</button>
        <button
          v-for="page in totalPagesAttr"
          :key="page"
          :class="{ active: currentPageAttr === page }"
          @click="goToPageAttr(page)"
        >
          {{ page }}
        </button>
        <button :disabled="currentPageAttr === totalPagesAttr" @click="nextPageAttr">Sau »</button>
      </div>
    </div>

    <!-- 🔹 Giá Trị Thuộc Tính -->
    <div v-if="activeTab === 'value'">
      <form @submit.prevent="handleValueSubmit" class="form-box">
        <select v-model="valueForm.optionAttributeId" required>
          <option value="">-- Chọn thuộc tính --</option>
          <option
            v-for="opt in listAttributes"
            :key="opt.id"
            :value="opt.id"
          >
            {{ opt.name }}
          </option>
        </select>

        <input
          v-model="valueForm.name"
          type="text"
          placeholder="Nhập giá trị (VD: Đỏ, 8GB, 256GB)"
          required
        />

        <button type="submit">
          {{ isEditValue ? "Cập nhật" : "Thêm mới" }}
        </button>

        <button v-if="isEditValue" type="button" @click="cancelEditValue" class="cancel">
          Hủy
        </button>
      </form>

      <p v-if="errorValue" class="error">{{ errorValue }}</p>

      <div class="search-box">
        <select v-model="searchOptionId">
          <option value="">-- Tất cả thuộc tính --</option>
          <option v-for="opt in listAttributes" :key="opt.id" :value="opt.id">
            {{ opt.name }}
          </option>
        </select>
        <button @click="handleSearch">Tìm kiếm</button>
        <button @click="resetSearch" class="cancel">Hiển thị tất cả</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Thuộc tính</th>
            <th>Giá trị</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedValues" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ getAttributeName(item.optionAttributeId) }}</td>
            <td>{{ item.name }}</td>
            <td>
              <button @click="editValue(item)" class="edit">Sửa</button>
              <button @click="deleteValue(item.id)" class="delete">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="totalPagesVal > 1">
        <button :disabled="currentPageVal === 1" @click="prevPageVal">« Trước</button>
        <button
          v-for="page in totalPagesVal"
          :key="page"
          @click="goToPageVal(page)"
          :class="{ active: currentPageVal === page }"
        >
          {{ page }}
        </button>
        <button :disabled="currentPageVal === totalPagesVal" @click="nextPageVal">Sau »</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/axios";

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

// Fetch attributes
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
  if (!name) {
    errorAttribute.value = "Tên thuộc tính không được để trống.";
    return;
  }

  const dup = attributeList.value.some(
    (a) =>
      a.name.trim().toLowerCase() === name.toLowerCase() &&
      a.id !== attributeForm.value.id
  );
  if (dup) {
    errorAttribute.value = "Thuộc tính này đã tồn tại.";
    return;
  }

  const payload = { name };
  if (isEditAttribute.value) {
    await api.put(`${BASE_ATTR}/${attributeForm.value.id}`, payload);
  } else {
    await api.post(BASE_ATTR, payload);
  }
  await fetchAttributes();
  cancelEditAttribute();
};

const editAttribute = (item) => {
  attributeForm.value = { id: item.id, name: item.name };
  isEditAttribute.value = true;
};

const deleteAttribute = async (id) => {
  const used = valueList.value.some(
    (v) => String(v.optionAttributeId) === String(id)
  );
  if (used) {
    errorAttribute.value =
      "Không thể xóa thuộc tính vì còn giá trị liên quan.";
    return;
  }
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

// Fetch values
const fetchValueList = async (optionId = "") => {
  let url = BASE_VAL;
  if (optionId) url += `?optionAttributeId=${optionId}`;
  const res = await api.get(url);
  listValues.value = res.data.data?.content || res.data.data || res.data;
  currentPageVal.value = 1;
};

// Search
const handleSearch = async () => {
  await fetchValueList(searchOptionId.value);
};
const resetSearch = async () => {
  searchOptionId.value = "";
  await fetchValueList();
};

const handleValueSubmit = async () => {
  const name = valueForm.value.name.trim();
  if (!valueForm.value.optionAttributeId) {
    errorValue.value = "Vui lòng chọn thuộc tính cha.";
    return;
  }
  if (!name) {
    errorValue.value = "Giá trị không được để trống.";
    return;
  }

  const dup = listValues.value.some(
    (v) =>
      String(v.optionAttributeId) === String(valueForm.value.optionAttributeId) &&
      v.name.trim().toLowerCase() === name.toLowerCase() &&
      v.id !== valueForm.value.id
  );
  if (dup) {
    errorValue.value = "Giá trị này đã tồn tại cho thuộc tính đã chọn.";
    return;
  }

  const payload = {
    optionAttributeId: valueForm.value.optionAttributeId,
    name,
  };

  if (isEditValue.value) {
    await api.put(`${BASE_VAL}/${valueForm.value.id}`, payload);
  } else {
    await api.post(BASE_VAL, payload);
  }

  await fetchValueList(searchOptionId.value);
  cancelEditValue();
};

const editValue = (item) => {
  valueForm.value = {
    id: item.id,
    optionAttributeId: item.optionAttributeId,
    name: item.name,
  };
  isEditValue.value = true;
  errorValue.value = "";
};

const deleteValue = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa giá trị này không?")) return;
  await api.delete(`${BASE_VAL}/${id}`);
  await fetchValueList(searchOptionId.value);
};

const cancelEditValue = () => {
  isEditValue.value = false;
  valueForm.value = { id: null, optionAttributeId: "", name: "" };
  errorValue.value = "";
};

const getAttributeName = (id) => {
  const a = listAttributes.value.find((x) => String(x.id) === String(id));
  return a ? a.name : "Không xác định";
};

// Mount
onMounted(async () => {
  await Promise.all([fetchAttributes(), fetchValues(), fetchValueList()]);
});
</script>

<style scoped>
.container {
  width: 900px;
  margin: 40px auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.tabs button {
  padding: 10px 20px;
  border: none;
  background: #eee;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 6px;
}
.tabs button.active {
  background: #007bff;
  color: white;
}
.form-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.form-box input,
.form-box select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.form-box button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.cancel {
  background: #999;
}
.error {
  color: #f33;
  text-align: center;
  margin-bottom: 10px;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.edit {
  background: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
}
.delete {
  background: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 15px;
}
.pagination button {
  padding: 6px 10px;
  border: 1px solid #ccc;
  background: #f8f8f8;
  border-radius: 5px;
  cursor: pointer;
}
.pagination button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin: 20px 0;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Dropdown */
.search-box select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  transition: 0.2s;
}
.search-box select:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
  outline: none;
}

/* Buttons */
.search-box button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.search-box button:first-of-type {
  background-color: #007bff;
  color: white;
}

.search-box button:first-of-type:hover {
  background-color: #0056b3;
}

.search-box .cancel {
  background-color: #6c757d;
  color: white;
}

.search-box .cancel:hover {
  background-color: #5a6268;
}

</style>
