<template>
  <div class="container mt-3">
    <h2>Quản lý Thành Phố</h2>
    <br />

    <!-- NAV TABS -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#form">Thêm thành phố</a>
      </li>
    </ul>

    <div class="tab-content">
      <!-- DANH SÁCH -->
      <div id="list" class="container tab-pane active"><br />

        <!-- Form tìm kiếm -->
        <form class="row g-2 mb-3" @submit.prevent="searchCities">
          <div class="col-auto">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Nhập tên thành phố..."
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Tìm kiếm</button>
          </div>
        </form>

        <!-- Kết quả -->
        <span class="text-muted">Tìm thấy {{ filteredCities.length }} kết quả</span>

        <table class="table table-striped table-hover align-middle mt-2">
          <thead>
            <tr>
              <th style="width: 70px;">ID</th>
              <th>Tên thành phố</th>
              <th style="width: 150px;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedCities" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-1" @click="editCity(item)">Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteCity(item.id)">Xoá</button>
              </td>
            </tr>
            <tr v-if="paginatedCities.length === 0">
              <td colspan="3" class="text-center py-4">Không tìm thấy thành phố nào.</td>
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
              class="page-item" 
              v-for="page in totalPages" 
              :key="page" 
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

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Cập nhật' : 'Thêm' }}
            </button>
            <button
              v-if="isEditing"
              type="button"
              class="btn btn-secondary"
              @click="resetForm"
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://localhost:8080/api/city";

const cities = ref([]);
const id = ref(null);
const name = ref("");
const isEditing = ref(false);
const search = ref("");
const searchKeyword = ref("");

// phân trang
const currentPage = ref(1);
const itemsPerPage = ref(5); // số dòng mỗi trang

// Lọc theo searchKeyword
const filteredCities = computed(() => {
  if (!searchKeyword.value) return cities.value;
  return cities.value.filter((city) =>
    city.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

// Tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredCities.value.length / itemsPerPage.value);
});

// Thành phố hiển thị theo trang
const paginatedCities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCities.value.slice(start, end);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const fetchCities = async () => {
  try {
    const res = await axios.get(API_URL);
    cities.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách thành phố:", err);
  }
};

const searchCities = () => {
  searchKeyword.value = search.value.trim();
  currentPage.value = 1; // về trang 1 khi tìm kiếm
};

const addCity = async () => {
  try {
    await axios.post(API_URL, { name: name.value });
    resetForm();
    await fetchCities();
    switchToListTab();
  } catch (err) {
    console.error("Lỗi khi thêm thành phố:", err);
  }
};

const editCity = (city) => {
  id.value = city.id;
  name.value = city.name;
  isEditing.value = true;
  switchToFormTab();
};

const updateCity = async () => {
  try {
    await axios.put(`${API_URL}/${id.value}`, { id: id.value, name: name.value });
    resetForm();
    await fetchCities();
    switchToListTab();
  } catch (err) {
    console.error("Lỗi khi cập nhật thành phố:", err);
  }
};

const deleteCity = async (cityId) => {
  if (confirm("Bạn có chắc chắn muốn xoá không?")) {
    try {
      await axios.delete(`${API_URL}/${cityId}`);
      await fetchCities();
    } catch (err) {
      console.error("Lỗi khi xoá thành phố:", err);
    }
  }
};

const resetForm = () => {
  id.value = null;
  name.value = "";
  isEditing.value = false;
};

const switchToFormTab = () => {
  setTimeout(() => {
    document.querySelector('[href="#form"]')?.click();
  }, 100);
};

const switchToListTab = () => {
  setTimeout(() => {
    document.querySelector('[href="#list"]')?.click();
  }, 100);
};

onMounted(fetchCities);
</script>

<style scoped>
.pagination .page-link {
  cursor: pointer;
}
</style>
