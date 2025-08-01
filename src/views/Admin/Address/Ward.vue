<template>
  <div class="container mt-3">
    <h2 class="text-center mb-4">Quản lý Phường</h2>

    <!-- NAV TABS -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#form">Thêm phường</a>
      </li>
    </ul>

    <div class="tab-content">
      <!-- DANH SÁCH -->
      <div id="list" class="container tab-pane active"><br />

        <!-- Form tìm kiếm -->
        <form class="row g-2 mb-3" @submit.prevent="searchWards">
          <div class="col-auto">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Nhập tên phường..."
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Tìm kiếm</button>
          </div>
        </form>

        <span class="text-muted">Tìm thấy {{ filteredWards.length }} kết quả</span>

        <table class="table table-striped table-hover align-middle mt-2">
          <thead>
            <tr>
              <th style="width: 70px;">ID</th>
              <th>Tên phường</th>
              <th>Thành phố</th>
              <th style="width: 150px;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedWards" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ getCityName(item.cityId) }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-1" @click="editWard(item)">Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteWard(item.id)">Xoá</button>
              </td>
            </tr>
            <tr v-if="paginatedWards.length === 0">
              <td colspan="4" class="text-center py-4">Không tìm thấy phường nào.</td>
            </tr>
          </tbody>
        </table>

        <!-- PHÂN TRANG -->
        <nav v-if="totalPages > 1" class="mt-3">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">«</a>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">»</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- FORM -->
      <div id="form" class="container tab-pane fade"><br />
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

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? "Cập nhật" : "Thêm" }}
            </button>
            <button v-if="isEditing" type="button" class="btn btn-secondary" @click="resetForm">
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "axios"

const WARD_API = "http://localhost:8080/api/ward"
const CITY_API = "http://localhost:8080/api/city"

const wards = ref([])
const cities = ref([])

const id = ref(null)
const name = ref("")
const cityId = ref("")
const isEditing = ref(false)

// Tìm kiếm
const search = ref("")
const searchKeyword = ref("")

// Phân trang
const currentPage = ref(1)
const itemsPerPage = ref(5) // mỗi trang 5 dòng

const filteredWards = computed(() => {
  if (!searchKeyword.value) return wards.value
  return wards.value.filter(w =>
    w.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredWards.value.length / itemsPerPage.value)
)

const paginatedWards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredWards.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const searchWards = () => {
  searchKeyword.value = search.value.trim()
  currentPage.value = 1
}

// Tải dữ liệu
const fetchCities = async () => {
  try {
    const res = await axios.get(CITY_API)
    cities.value = res.data
  } catch (err) {
    console.error("Lỗi tải thành phố:", err)
  }
}

const fetchWards = async () => {
  try {
    const res = await axios.get(WARD_API)
    wards.value = res.data
  } catch (err) {
    console.error("Lỗi tải phường:", err)
  }
}

const isDuplicateName = (nameToCheck) => {
  return wards.value.some(
    ward =>
      ward.name.trim().toLowerCase() === nameToCheck.trim().toLowerCase() &&
      (!isEditing.value || ward.id !== id.value)
  )
}

const resetForm = () => {
  id.value = null
  name.value = ""
  cityId.value = ""
  isEditing.value = false
}

const addWard = async () => {
  if (isDuplicateName(name.value)) {
    alert("Tên phường đã tồn tại.")
    return
  }

  try {
    const newWard = { name: name.value.trim(), cityId: cityId.value }
    await axios.post(WARD_API, newWard)
    await fetchWards()
    resetForm()
    switchToListTab()
  } catch (err) {
    console.error("Lỗi thêm phường:", err)
  }
}

const editWard = (ward) => {
  id.value = ward.id
  name.value = ward.name
  cityId.value = ward.cityId
  isEditing.value = true
  switchToFormTab()
}

const updateWard = async () => {
  try {
    const updatedWard = { id: id.value, name: name.value.trim(), cityId: cityId.value }
    await axios.put(`${WARD_API}/${id.value}`, updatedWard)
    await fetchWards()
    resetForm()
    switchToListTab()
  } catch (err) {
    if (err.response?.status === 400) {
      alert(err.response.data)
    } else {
      console.error("Lỗi cập nhật phường:", err)
    }
  }
}

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

const getCityName = (id) => {
  const city = cities.value.find(c => c.id === id)
  return city ? city.name : "Không rõ"
}

const switchToFormTab = () => {
  setTimeout(() => {
    document.querySelector('[href="#form"]')?.click()
  }, 100)
}

const switchToListTab = () => {
  setTimeout(() => {
    document.querySelector('[href="#list"]')?.click()
  }, 100)
}

onMounted(async () => {
  await fetchCities()
  await fetchWards()
})
</script>

<style scoped>
.pagination .page-link {
  cursor: pointer;
}
</style>
