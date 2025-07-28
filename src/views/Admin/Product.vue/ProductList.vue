<template>
  <div>
    <div class="container mt-3">
      <h2>Sản phẩm</h2>
      <br />

      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item">
          <a class="nav-link active text-black" data-bs-toggle="tab" href="#home"
            >Danh sách</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link text-black" data-bs-toggle="tab" href="#menu1"
            >Thêm sản phẩm</a
          >
        </li>
      </ul>

      <div class="tab-content">
        <div id="home" class="container tab-pane active"><br />
          
          <div class="input-group mb-3 w-100">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control"
              placeholder="Tìm kiếm sản phẩm..."
            />
            <button class="btn btn-primary" @click="doSearch">
              <i class="bi bi-search"></i> Tìm
            </button>
          </div>

          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Loại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sp in paginatedProducts" :key="sp.id">
                <td style="width: 20px; ">{{ sp.id }}</td>
                <td style="width: 100px;"><img class="table-img" :src="sp.image" /></td>
                <td>{{ sp.name }}</td>
                <td>{{ sp.category }}</td>
                <td>
                  <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-warning text-white">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          
          <nav>
            <ul class="pagination justify-content-center">
              <li
                class="page-item"
                :class="{ disabled: currentPage === 1 }"
              >
                <button class="page-link" @click="prevPage" :disabled="currentPage === 1">
                  Trước
                </button>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
                  Sau
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div id="menu1" class="container tab-pane fade"><br />
           <div class="container mt-3">
    <form @submit.prevent="addProduct" enctype="multipart/form-data">
      <div class="mb-3">
        <label class="form-label">Tên sản phẩm</label>
        <input v-model="product.name" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Ảnh đại diện</label>
        <input @change="handleImageUpload" type="file" class="form-control" accept="image/*" />
      </div>

      <div class="mb-3">
        <label class="form-label">Thương hiệu</label>
        <input type="text" class="form-control" value="Apple" disabled/>
      </div>

      <div class="mb-3">
        <label class="form-label">Loại sản phẩm</label>
        <select v-model="product.typeId" class="form-select" required>
          <option disabled value="">-- Chọn loại sản phẩm --</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary">Thêm sản phẩm</button>
    </form>
  </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const doSearchQuery = ref("");

const products = ref([
  { id: 1, name: "iPhone 16 Promax", category: "Điện thoại", image: "/images/Ip16prm-1tb.png" },
  { id: 2, name: "MacBook Pro", category: "Laptop", image: "/images/Ip16prm-1tb.png" },
  { id: 3, name: "iPad Air", category: "Máy tính bảng", image: "/images/Ip16prm-1tb.png" },
  { id: 4, name: "Apple Watch", category: "Đồng hồ", image: "/images/Ip16prm-1tb.png" },
  { id: 5, name: "iPod Touch", category: "Âm nhạc", image: "/images/Ip16prm-1tb.png" },
  { id: 6, name: "iPhone 15", category: "Điện thoại", image: "/images/Ip16prm-1tb.png" },
  { id: 7, name: "iPad Pro", category: "Máy tính bảng", image: "/images/Ip16prm-1tb.png" },
  { id: 8, name: "iPhone 16 Promax", category: "Điện thoại", image: "/images/Ip16prm-1tb.png" },
  { id: 9, name: "MacBook Pro", category: "Laptop", image: "/images/Ip16prm-1tb.png" },
  { id: 10, name: "iPad Air", category: "Máy tính bảng", image: "/images/Ip16prm-1tb.png" },
  { id: 11, name: "Apple Watch", category: "Đồng hồ", image: "/images/Ip16prm-1tb.png" },
  { id: 12, name: "iPod Touch", category: "Âm nhạc", image: "/images/Ip16prm-1tb.png" },
  { id: 13, name: "iPhone 15", category: "Điện thoại", image: "/images/Ip16prm-1tb.png" },
  { id: 14, name: "iPad Pro", category: "Máy tính bảng", image: "/images/Ip16prm-1tb.png" },
  { id: 15, name: "iPhone 16 Promax", category: "Điện thoại", image: "/images/Ip16prm-1tb.png" },
  { id: 16, name: "MacBook Pro", category: "Laptop", image: "/images/Ip16prm-1tb.png" },
  { id: 17, name: "iPad Air", category: "Máy tính bảng", image: "/images/Ip16prm-1tb.png" },
  { id: 18, name: "Apple Watch", category: "Đồng hồ", image: "/images/Ip16prm-1tb.png" },
  { id: 19, name: "iPod Touch", category: "Âm nhạc", image: "/images/Ip16prm-1tb.png" },
  { id: 20, name: "iPhone 15", category: "Điện thoại", image: "/images/Ip16prm-1tb.png" },
  { id: 21, name: "iPad Pro", category: "Máy tính bảng", image: "/images/Ip16prm-1tb.png" },
  { id: 22, name: "iPhone 16 Promax", category: "Điện thoại", image: "/images/Ip16prm-1tb.png" },
  { id: 23, name: "MacBook Pro", category: "Laptop", image: "/images/Ip16prm-1tb.png" },
  { id: 24, name: "iPad Air", category: "Máy tính bảng", image: "/images/Ip16prm-1tb.png" },
  { id: 25, name: "Apple Watch", category: "Đồng hồ", image: "/images/Ip16prm-1tb.png" },
  { id: 26, name: "iPod Touch", category: "Âm nhạc", image: "/images/Ip16prm-1tb.png" },
  { id: 27, name: "iPhone 15", category: "Điện thoại", image: "/images/Ip16prm-1tb.png" },
  { id: 28, name: "iPad Pro", category: "Máy tính bảng", image: "/images/Ip16prm-1tb.png" },
]);

const doSearch = () => {
  doSearchQuery.value = searchQuery.value.trim();
};

const filteredProducts = computed(() => {
  return products.value.filter(
    (sp) =>
      sp.name.toLowerCase().includes(doSearchQuery.value.toLowerCase()) ||
      sp.category.toLowerCase().includes(doSearchQuery.value.toLowerCase())
  ).sort((a, b) => b.id - a.id);
   
});


const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const goToPage = (page) => {
  currentPage.value = page;
};


const product = ref({
  name: "",
  brand: "",
  typeId: "",
  image: null,
});

const categories = ref([
  { id: 1, name: "Điện thoại" },
  { id: 2, name: "Laptop" },
  { id: 3, name: "Phụ kiện" },
]);

const handleImageUpload = (event) => {
  product.value.image = event.target.files[0];
};

const addProduct = () => {
  console.log("Sản phẩm mới:", product.value);
  alert("Đã thêm sản phẩm!");
};
</script>

<style scoped>
.table-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>
