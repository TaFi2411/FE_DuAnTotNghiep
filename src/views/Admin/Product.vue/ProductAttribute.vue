<template>
  <div class="container mt-3">
    <h2 class="text-center mb-4">Quản lý Thuộc tính Sản phẩm</h2>

    <div class="row">
      <!-- Form thuộc tính -->
      <div class="col-lg-4">
        <form @submit.prevent="isEditingAttr ? updateAttribute() : addAttribute()">
          <div class="mb-3">
            <label class="form-label">Tên thuộc tính</label>
            <input v-model="attrName" type="text" class="form-control" placeholder="Nhập tên thuộc tính" required />
          </div>
          <div class="mt-3 d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              {{ isEditingAttr ? "Cập nhật" : "Thêm mới" }}
            </button>
            <button v-if="isEditingAttr" type="button" class="btn btn-secondary" @click="resetAttrForm">Huỷ</button>
          </div>
          
        </form>
        <button class="btn btn-info mt-2" data-bs-toggle="modal" data-bs-target="#exampleModal">Quản lý Giá trị</button>

        
      </div>

      <!-- Danh sách thuộc tính -->
      <div class="col-lg-8">
        <table class="table table-striped table-hover align-middle mt-2">
          <thead class="table-light">
            <tr>
              <th style="width: 70px;">ID</th>
              <th>Tên thuộc tính</th>
              <th>Giá trị</th>
              <th style="width: 20px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in attributes" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>
                <span v-if="getValuesByAttrId(item.id).length">
                  {{ getValuesByAttrId(item.id).join(', ') }}
                </span>
                <span v-else class="text-muted fst-italic">Không có</span>
              </td>
              <td>
                    <div class="btn-group dropstart d-flex justify-content-center">
                      <button type="button" class="btn btn-light icon-btn " data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu p-3">
                        <li>
                          <button @click="editAttribute(item)" class="btn btn-sm btn-warning w-100 mb-2">Sửa</button>
                        </li>
                        <li>
                          <button @click="deleteAttribute(item.id)" class="btn btn-sm btn-danger w-100">Xoá</button>
                        </li>
                      </ul>
                    </div>

                   
                   
                
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    </div>

    <!-- Modal giá trị thuộc tính -->
    <div class="modal fade" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Giá trị thuộc tính</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Form -->
            <form @submit.prevent="isEditingValue ? updateValue() : addValue()" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Chọn thuộc tính</label>
                <select v-model="selectedAttrId" class="form-select" required>
                  <option disabled value="">-- Chọn thuộc tính --</option>
                  <option v-for="a in attributes" :key="a.id" :value="a.id">{{ a.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Giá trị</label>
                <input v-model="valueText" type="text" class="form-control" placeholder="Nhập giá trị" required />
              </div>
              <div class="col-12 d-flex gap-2">
                <button class="btn btn-primary" type="submit">
                  {{ isEditingValue ? 'Cập nhật' : 'Thêm giá trị' }}
                </button>
                <button v-if="isEditingValue" class="btn btn-secondary" type="button" @click="resetValueForm">Huỷ</button>
              </div>
            </form>

            <!-- Danh sách giá trị -->
            <hr />
            <div class="mb-3">
              <input v-model="searchValue" class="form-control" placeholder="Tìm giá trị..." />
            </div>
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th style="width: 70px;">ID</th>
                  <th>Giá trị</th>
                  <th>Thuộc tính</th>
                  <th style="width: 20px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="v in filteredValues" :key="v.id">
                  <td>{{ v.id }}</td>
                  <td>{{ v.value }}</td>
                  <td>{{ getAttributeName(v.optionAttributeId) }}</td>
                  <td>
                    
                    <div class="btn-group dropstart d-flex justify-content-center">
                      <button type="button" class="btn btn-light icon-btn " data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu p-3">
                        <li>
                         <button class="btn btn-sm btn-warning me-2 mb-2" @click="editValue(v)">Sửa</button>
                        </li>
                        <li>
                          <button class="btn btn-sm btn-danger" @click="deleteValue(v.id)">Xoá</button>
                        </li>
                      </ul>
                    </div>
                    
                    
                  </td>
                </tr>
                <tr v-if="filteredValues.length === 0">
                  <td colspan="4" class="text-center py-4">Không tìm thấy giá trị nào.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const ATTR_API = 'http://localhost:8080/api/option-attribute'
const VALUE_API = 'http://localhost:8080/api/attribute-value'

// Thuộc tính
const attributes = ref([])
const attrId = ref(null)
const attrName = ref('')
const isEditingAttr = ref(false)

// Giá trị thuộc tính
const values = ref([])
const valueId = ref(null)
const valueText = ref('')
const selectedAttrId = ref('')
const isEditingValue = ref(false)
const searchValue = ref('')

// --- CRUD thuộc tính ---
const fetchAttributes = async () => {
  const res = await axios.get(ATTR_API)
  attributes.value = res.data
}
const addAttribute = async () => {
  await axios.post(ATTR_API, { name: attrName.value })
  await fetchAttributes()
  resetAttrForm()
}
const editAttribute = (attr) => {
  attrId.value = attr.id
  attrName.value = attr.name
  isEditingAttr.value = true
}
const updateAttribute = async () => {
  await axios.put(`${ATTR_API}/${attrId.value}`, { name: attrName.value })
  await fetchAttributes()
  resetAttrForm()
}
const deleteAttribute = async (id) => {
  if (confirm('Xoá thuộc tính này?')) {
    await axios.delete(`${ATTR_API}/${id}`)
    await fetchAttributes()
  }
}
const resetAttrForm = () => {
  attrId.value = null
  attrName.value = ''
  isEditingAttr.value = false
}

// --- CRUD giá trị thuộc tính ---
const fetchValues = async () => {
  const res = await axios.get(VALUE_API)
  values.value = res.data
}
const addValue = async () => {
  await axios.post(VALUE_API, {
    value: valueText.value,
    optionAttributeId: parseInt(selectedAttrId.value),
  })
  await fetchValues()
  resetValueForm()
}
const editValue = (v) => {
  valueId.value = v.id
  valueText.value = v.value
  selectedAttrId.value = v.optionAttributeId
  isEditingValue.value = true
}
const updateValue = async () => {
  await axios.put(`${VALUE_API}/${valueId.value}`, {
    value: valueText.value,
    optionAttributeId: parseInt(selectedAttrId.value),
  })
  await fetchValues()
  resetValueForm()
}
const deleteValue = async (id) => {
  if (confirm('Xoá giá trị này?')) {
    await axios.delete(`${VALUE_API}/${id}`)
    await fetchValues()
  }
}
const resetValueForm = () => {
  valueId.value = null
  valueText.value = ''
  selectedAttrId.value = ''
  isEditingValue.value = false
}

// --- Tìm kiếm giá trị ---
const filteredValues = computed(() =>
  values.value.filter((v) =>
    v.value.toLowerCase().includes(searchValue.value.trim().toLowerCase())
  )
)

// --- Hiển thị ---
const getAttributeName = (id) => {
  const attr = attributes.value.find((a) => a.id === id)
  return attr ? attr.name : ''
}
const getValuesByAttrId = (attrId) => {
  return values.value
    .filter((v) => v.optionAttributeId === attrId)
    .map((v) => v.value)
}

onMounted(() => {
  fetchAttributes()
  fetchValues()
})
</script>

<style scoped>
.icon-btn {
  border: none;
  background: transparent;
  padding: 5px 10px;
}
.icon-btn:hover {
  background-color: #f0f0f0;
}

.container {
  max-width: 1200px;
}
h2 {
  font-weight: 600;
  color: #333;
}
form {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

}
.table {
  font-size: 15px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}
.table th {
  background-color: #f1f1f1;
  font-weight: 600;
  color: #555;
}
.table td {
  vertical-align: middle;
}
.btn {
  width: 100%;
  font-size: 14px;
  padding: 6px 12px;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}
.btn-primary:hover {
  background-color: #0069d9;
}
.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000;
}
.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}
</style>
