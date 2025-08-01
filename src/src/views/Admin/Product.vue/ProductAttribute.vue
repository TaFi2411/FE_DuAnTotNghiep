<template>
  <div class="container" style="width: 100%;">
    <div class="title d-flex justify-content-center">
      <h1>Quản lý Thuộc tính Sản phẩm</h1>
    </div>

    <div class="form-type">
      <form @submit.prevent="isEditing ? updateAttribute() : addAttribute()">
        <div class="mb-3">
          <label class="form-label">Tên thuộc tính</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Nhập tên thuộc tính"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary mt-3">
          {{ isEditing ? 'Cập nhật' : 'Thêm' }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          @click="resetForm"
          class="btn btn-secondary mt-3 ms-2"
        >
          Huỷ
        </button>
      </form>

      <table class="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thuộc tính</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in attributes" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <button @click="editAttribute(item)" class="btn btn-sm btn-warning me-2">Sửa</button>
              <button @click="deleteAttribute(item.id)" class="btn btn-sm btn-danger">Xoá</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/option-attribute'

const attributes = ref([])
const id = ref(null)
const name = ref('')
const isEditing = ref(false)

const fetchAttributes = async () => {
  try {
    const res = await axios.get(API_URL)
    attributes.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách thuộc tính:', err)
  }
}

const addAttribute = async () => {
  try {
    const newAttr = { name: name.value }
    await axios.post(API_URL, newAttr)
    resetForm()
    await fetchAttributes()
  } catch (err) {
    console.error('Lỗi khi thêm thuộc tính:', err)
  }
}

const editAttribute = (attr) => {
  id.value = attr.id
  name.value = attr.name
  isEditing.value = true
}

const updateAttribute = async () => {
  try {
    const updatedAttr = { id: id.value, name: name.value }
    await axios.put(`${API_URL}/${id.value}`, updatedAttr)
    resetForm()
    await fetchAttributes()
  } catch (err) {
    console.error('Lỗi khi cập nhật thuộc tính:', err)
  }
}

const deleteAttribute = async (attrId) => {
  if (confirm('Bạn có chắc chắn muốn xoá không?')) {
    try {
      await axios.delete(`${API_URL}/${attrId}`)
      await fetchAttributes()
    } catch (err) {
      console.error('Lỗi khi xoá thuộc tính:', err)
    }
  }
}

const resetForm = () => {
  id.value = null
  name.value = ''
  isEditing.value = false
}

onMounted(fetchAttributes)
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
</style>
