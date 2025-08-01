<template>
  <div class="container">
    <h2 class="text-center mb-4">Quản lý Phường</h2>

    <form @submit.prevent="isEditing ? updateWard() : addWard()">
      <div class="mb-3">
        <label class="form-label">Tên phường</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
          placeholder="Nhập tên phường"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Thành phố</label>
        <select class="form-select" v-model="cityId" required>
          <option disabled value="">-- Chọn thành phố --</option>
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
      </div>

      <div class="mt-3">
        <button type="submit" class="btn btn-primary me-2">
          {{ isEditing ? "Cập nhật" : "Thêm" }}
        </button>
        <button v-if="isEditing" type="button" class="btn btn-secondary" @click="resetForm">Huỷ</button>
      </div>
    </form>

    <table class="table table-bordered mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên phường</th>
          <th>Thành phố</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in wards" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ getCityName(item.cityId) }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editWard(item)">Sửa</button>
            <button class="btn btn-sm btn-danger" @click="deleteWard(item.id)">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const WARD_API = "http://localhost:8080/api/ward"
const CITY_API = "http://localhost:8080/api/city"

const wards = ref([])
const cities = ref([])

const id = ref(null)
const name = ref("")
const cityId = ref("")
const isEditing = ref(false)

// Tải thành phố
const fetchCities = async () => {
  try {
    const res = await axios.get(CITY_API)
    cities.value = res.data
  } catch (err) {
    console.error("Lỗi tải thành phố:", err)
  }
}

// Tải phường
const fetchWards = async () => {
  try {
    const res = await axios.get(WARD_API)
    wards.value = res.data
  } catch (err) {
    console.error("Lỗi tải phường:", err)
  }
}

// Kiểm tra tên trùng
const isDuplicateName = (nameToCheck) => {
  return wards.value.some(
    ward =>
      ward.name.trim().toLowerCase() === nameToCheck.trim().toLowerCase() &&
      (!isEditing.value || ward.id !== id.value)
  )
}

// Reset form
const resetForm = () => {
  id.value = null
  name.value = ""
  cityId.value = ""
  isEditing.value = false
}

// Thêm phường
const addWard = async () => {
  if (isDuplicateName(name.value)) {
    alert("Tên phường đã tồn tại.")
    return
  }

  try {
    const newWard = {
      name: name.value.trim(),
      cityId: cityId.value
    }
    await axios.post(WARD_API, newWard)
    await fetchWards()
    resetForm()
  } catch (err) {
    console.error("Lỗi thêm phường:", err)
  }
}

// Sửa phường
const editWard = (ward) => {
  id.value = ward.id
  name.value = ward.name
  cityId.value = ward.cityId
  isEditing.value = true
}

// Cập nhật phường
const updateWard = async () => {
  try {
    const updatedWard = {
      id: id.value,
      name: name.value.trim(),
      cityId: cityId.value
    }
    await axios.put(`${WARD_API}/${id.value}`, updatedWard)
    await fetchWards()
    resetForm()
  } catch (err) {
    if (err.response?.status === 400) {
      alert(err.response.data)
    } else {
      console.error("Lỗi cập nhật phường:", err)
    }
  }
}

// Xoá phường
const deleteWard = async (wardId) => {
  if (confirm("Bạn có chắc muốn xoá phường này?")) {
    try {
      await axios.delete(`${WARD_API}/${wardId}`)
      await fetchWards()
    } catch (err) {
      console.error("Lỗi xoá phường:", err)
    }
  }
}

// Lấy tên thành phố theo ID
const getCityName = (id) => {
  const city = cities.value.find(c => c.id === id)
  return city ? city.name : "Không rõ"
}

// Khởi tạo
onMounted(async () => {
  await fetchCities()
  await fetchWards()
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
