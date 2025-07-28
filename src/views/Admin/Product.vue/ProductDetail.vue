<template>
  <div class="container mt-4">
    <h2>Chi tiết sản phẩm</h2>
    <hr />

    <!-- Tabs -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#add">Thêm</a>
      </li>
    </ul>

    <div class="tab-content">
      <!-- Danh sách SKU -->
      <div id="list" class="container tab-pane active"><br />
        <div class="input-group mb-3 w-100">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Tìm kiếm ..."
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
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thuộc tính</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sku in paginatedSkus" :key="sku.id">
              <td>{{ sku.id }}</td>
              <td><img class="table-img" :src="sku.image" /></td>
              <td>{{ sku.name }}</td>
              <td>{{ sku.price.toLocaleString() }} ₫</td>
              <td>{{ sku.quantity }}</td>
              <td>
                <span v-for="attr in sku.attributes" :key="attr.name">
                  {{ attr.name }}: {{ attr.value }}<br />
                </span>
              </td>
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
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
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
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
                Sau
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Thêm SKU -->
     <div id="add" class="container tab-pane fade"><br />
  <form @submit.prevent="addSku">
    <!-- Chọn sản phẩm -->
    <div class="mb-3">
      <label class="form-label">Sản phẩm</label>
      <select class="form-select" required>
        <option disabled selected>-- Chọn sản phẩm --</option>
        <option  value="">iPhone 16 Promax</option>
        <option  value="">iPhone 16 Promax</option>
        <option  value="">iPhone 16 Promax</option>
        <option  value="">iPhone 16 Promax</option>
        <option  value="">iPhone 16 Promax</option>
        


      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Tên chi tiết</label>
      <input v-model="newSku.name" type="text" class="form-control" required />
    </div>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label">Giá</label>
        <input v-model.number="newSku.price" type="number" class="form-control" required />
      </div>
      <div class="col-md-6">
        <label class="form-label">Số lượng</label>
        <input v-model.number="newSku.quantity" type="number" class="form-control" required />
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Ảnh</label>
      <input @change="handleImageUpload" type="file" class="form-control" accept="image/*" />
    </div>

    <div class="mb-3">
      <label class="form-label">Thuộc tính</label>
      <div v-for="(attr, index) in newSku.attributes" :key="index" class="row g-2 mb-2">
        <div class="col-md-5">
          <select v-model="attr.name" class="form-select" required>
            <option disabled value="">-- Chọn thuộc tính --</option>
            <option v-for="attrType in attributeTypes" :key="attrType" :value="attrType">
              {{ attrType }}
            </option>
          </select>
        </div>
        <div class="col-md-5">
          <!-- Đổ giá trị theo loại thuộc tính -->
          <select v-if="predefinedValues[attr.name]" v-model="attr.value" class="form-select" required>
            <option disabled value="">-- Chọn {{ attr.name }} --</option>
            <option v-for="val in predefinedValues[attr.name]" :key="val" :value="val">{{ val }}</option>
          </select>
          <input v-else v-model="attr.value" type="text" class="form-control" placeholder="Giá trị" required />
        </div>
        <div class="col-md-2">
          <button type="button" class="btn btn-danger w-100" @click="removeAttribute(index)">
            Xóa
          </button>
        </div>
      </div>
      <button type="button" class="btn btn-secondary" @click="addAttribute">
        + Thêm thuộc tính
      </button>
    </div>
    
    <CustomTextArea/>
    

    <button type="submit" class="btn btn-success mt-5">Lưu biến thể</button>
  </form>
</div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CustomTextArea from "@/components/CustomTextArea/CustomTextArea.vue";
const product = ref({
  id: 1,
  name: "iPhone 16 Pro Max",
});

const skus = ref([
  {
    id: 1,
    name: "iPhone 16 Pro Max - Đỏ - 128GB",
    image: "/images/Ip16prm-1tb.png",
    price: 29990000,
    quantity: 10,
    attributes: [
      { name: "Màu sắc", value: "Đỏ" },
      { name: "Dung lượng", value: "128GB" },
    ],
  },
]);

const searchQuery = ref("");
const doSearchQuery = ref("");

const doSearch = () => {
  doSearchQuery.value = searchQuery.value.trim();
};

const filteredSkus = computed(() => {
  return skus.value
    .filter(
      (sku) =>
        sku.name.toLowerCase().includes(doSearchQuery.value.toLowerCase()) ||
        sku.attributes.some((a) =>
          a.value.toLowerCase().includes(doSearchQuery.value.toLowerCase())
        )
    )
    .sort((a, b) => b.id - a.id);
});

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(filteredSkus.value.length / itemsPerPage));

const paginatedSkus = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredSkus.value.slice(start, start + itemsPerPage);
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

const newSku = ref({
  name: "",
  price: null,
  quantity: null,
  image: null,
  attributes: [],
});

const attributeTypes = ["Màu sắc", "Dung lượng", "Kích thước"];
const predefinedValues = {
  "Màu sắc": ["Đỏ", "Xanh", "Đen", "Trắng", "Vàng"],
  "Dung lượng": ["64GB", "128GB", "256GB", "512GB", "1TB"],
  "Kích thước": ["Nhỏ", "Vừa", "Lớn"]
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newSku.value.image = file;
  }
};

const addAttribute = () => {
  newSku.value.attributes.push({ name: "", value: "" });
};

const removeAttribute = (index) => {
  newSku.value.attributes.splice(index, 1);
};

const addSku = () => {
  const newId = skus.value.length + 1;
  skus.value.push({ id: newId, ...newSku.value, image: "/images/Ip16prm-1tb.png" });
  alert("SKU đã được thêm!");
  newSku.value = { name: "", price: null, quantity: null, image: null, attributes: [] };
};
</script>

<style scoped>
.table-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>
