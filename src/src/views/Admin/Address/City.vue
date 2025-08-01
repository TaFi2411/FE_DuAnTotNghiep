<template>
  <div class="container" style="width: 100%;">
    <div class="title d-flex justify-content-center">
      <h1>Quản lý Thành Phố</h1>
    </div>

    <div class="form-type">
      <form @submit.prevent="isEditing ? updateCity() : addCity()">
        <div class="mb-3">
          <label class="form-label">Tên thành phố</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Nhập tên thành phố"
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
            <th>Tên thành phố</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cities" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <button @click="editCity(item)" class="btn btn-sm btn-warning me-2">Sửa</button>
              <button @click="deleteCity(item.id)" class="btn btn-sm btn-danger">Xoá</button>
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

const API_URL = 'http://localhost:8080/api/city'

const cities = ref([])
const id = ref(null)
const name = ref('')
const isEditing = ref(false)

const fetchCities = async () => {
  try {
    const res = await axios.get(API_URL)
    cities.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách thành phố:', err)
  }
}

const addCity = async () => {
  try {
    const newCity = {
      name: name.value
    }
    await axios.post(API_URL, newCity)
    resetForm()
    await fetchCities()
  } catch (err) {
    console.error('Lỗi khi thêm thành phố:', err)
  }
}

const editCity = (city) => {
  id.value = city.id
  name.value = city.name
  isEditing.value = true
}

const updateCity = async () => {
  try {
    const updatedCity = {
      id: id.value,
      name: name.value
    }
    await axios.put(`${API_URL}/${id.value}`, updatedCity)
    resetForm()
    await fetchCities()
  } catch (err) {
    console.error('Lỗi khi cập nhật thành phố:', err)
  }
}

const deleteCity = async (cityId) => {
  if (confirm('Bạn có chắc chắn muốn xoá không?')) {
    try {
      await axios.delete(`${API_URL}/${cityId}`)
      await fetchCities()
    } catch (err) {
      console.error('Lỗi khi xoá thành phố:', err)
    }
  }
}

const resetForm = () => {
  id.value = null
  name.value = ''
  isEditing.value = false
}

onMounted(fetchCities)
</script>
