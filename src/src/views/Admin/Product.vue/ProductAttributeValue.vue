<template>
  <div class="container">
    <h2 class="text-center mb-4">Quản lý Attribute Value</h2>

    <form @submit.prevent="isEditing ? updateValue() : addValue()" class="row g-3 align-items-end">
      <div class="col-md-6">
        <label class="form-label">Chọn thuộc tính</label>
        <select v-model="selectedAttributeId" class="form-select" required>
          <option disabled value="">-- Chọn attribute --</option>
          <option v-for="a in attributes" :key="a.id" :value="a.id.toString()">
            {{ a.name }}
          </option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Giá trị</label>
        <input v-model="value" type="text" class="form-control" placeholder="Nhập giá trị" required />
      </div>

      <div class="col-md-12 d-flex gap-2">
        <button class="btn btn-primary" type="submit">
          {{ isEditing ? 'Cập nhật' : 'Thêm' }}
        </button>
        <button v-if="isEditing" class="btn btn-secondary" type="button" @click="resetForm">Huỷ</button>
      </div>
    </form>

    <table class="table table-bordered mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Giá trị</th>
          <th>Thuộc tính</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in values" :key="v.id">
          <td>{{ v.id }}</td>
          <td>{{ v.value }}</td>
          <td>{{ getAttributeName(v.optionAttributeId) }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editValue(v)">Sửa</button>
            <button class="btn btn-sm btn-danger" @click="deleteValue(v.id)">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const ATTRIBUTE_API = 'http://localhost:8080/api/option-attribute'
const VALUE_API = 'http://localhost:8080/api/attribute-value'

const attributes = ref([])
const values = ref([])

const selectedAttributeId = ref('')
const value = ref('')
const id = ref(null)
const isEditing = ref(false)

const fetchAttributes = async () => {
  const res = await axios.get(ATTRIBUTE_API)
  attributes.value = res.data
}

const fetchValues = async () => {
  const res = await axios.get(VALUE_API)
  values.value = res.data
}

const getAttributeName = (id) => {
  const found = attributes.value.find(a => a.id === id)
  return found ? found.name : 'Không rõ'
}

const resetForm = () => {
  id.value = null
  value.value = ''
  selectedAttributeId.value = ''
  isEditing.value = false
}

const isDuplicate = () => {
  return values.value.some(
    v =>
      v.value.trim().toLowerCase() === value.value.trim().toLowerCase() &&
      v.optionAttributeId?.toString() === selectedAttributeId.value &&
      (!isEditing.value || v.id !== id.value)
  )
}

const addValue = async () => {
  if (isDuplicate()) {
    alert('Giá trị đã tồn tại.')
    return
  }
  const newValue = {
    value: value.value.trim(),
    optionAttributeId: parseInt(selectedAttributeId.value)
  }
  await axios.post(VALUE_API, newValue)
  await fetchValues()
  resetForm()
}

const editValue = (v) => {
  id.value = v.id
  value.value = v.value
  selectedAttributeId.value = v.optionAttributeId?.toString() ?? ''
  isEditing.value = true
}

const updateValue = async () => {
  if (isDuplicate()) {
    alert('Giá trị đã tồn tại.')
    return
  }
  const updated = {
    id: id.value,
    value: value.value.trim(),
    optionAttributeId: parseInt(selectedAttributeId.value)
  }
  await axios.put(`${VALUE_API}/${id.value}`, updated)
  await fetchValues()
  resetForm()
}

const deleteValue = async (deleteId) => {
  if (confirm('Bạn chắc chắn muốn xoá?')) {
    await axios.delete(`${VALUE_API}/${deleteId}`)
    await fetchValues()
  }
}

onMounted(async () => {
  await fetchAttributes()
  await fetchValues()
})
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
