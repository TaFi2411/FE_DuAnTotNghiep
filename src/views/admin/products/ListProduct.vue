<template>
  <div class="container my-5">
    <h2 class="mb-4">Danh sách Sản phẩm</h2>

    <div class="d-flex justify-content-end align-items-center mb-3">
      <input
        v-model="keyword"
        type="text"
        class="form-control w-50"
        placeholder="Tìm kiếm sản phẩm..."
        @keyup.enter="applySearch"
      />
      <button class="btn btn-primary ms-2" @click="applySearch">Tìm</button>
    </div>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="text-muted mt-2">Đang tải dữ liệu sản phẩm...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger">
      <p><strong>Đã xảy ra lỗi:</strong> {{ errorMessage }}</p>
      <button class="btn btn-primary" @click="fetchProducts">Thử lại</button>
    </div>

    <div v-else-if="products.length === 0" class="alert alert-info text-center">
      <p class="mb-0">Không có sản phẩm nào để hiển thị.</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Hình ảnh</th>

            <th scope="col" @click="changeSort('name')" class="sortable-header">
              Tên sản phẩm
              <span v-if="sortField === 'name'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>

            <th scope="col" @click="changeSort('category.name')" class="sortable-header">
              Danh mục
              <span v-if="sortField === 'category.name'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>

            <th scope="col" @click="changeSort('status')" class="sortable-header">
              Trạng thái
              <span v-if="sortField === 'status'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>

            <th scope="col" class="text-end">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(product, index) in products" :key="product.id">
            <td>{{ (page * size) + index + 1 }}</td>
            <td>
              <img
                :src="getImageUrl(product.image)"
                alt="Ảnh sản phẩm"
                class="product-thumbnail"
                @error="setDefaultImage"
              />
            </td>
            <td>
              <strong>{{ product.name }}</strong><br />
              <small class="text-muted">{{ product.slug }}</small>
            </td>
            <td>{{ product.categoryName }}</td>
            <td>
              <span :class="['badge', product.status ? 'bg-success' : 'bg-danger']">
                {{ product.status ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </td>
            <td class="text-end">
              <button
                class="btn btn-outline-primary btn-sm me-2"
                @click="editProduct(product.id)"
                title="Sửa sản phẩm"
              >
                <i class="bi bi-pencil-square"></i>
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="deleteProduct(product.id)"
                title="Xóa sản phẩm"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <button
          class="btn btn-outline-secondary"
          :disabled="page === 0"
          @click="changePage(page - 1)"
        >
          ← Trang trước
        </button>

        <span>Trang {{ page + 1 }} / {{ totalPages }}</span>

        <button
          class="btn btn-outline-secondary"
          :disabled="page >= totalPages - 1"
          @click="changePage(page + 1)"
        >
          Trang sau →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/axios.js';

const router = useRouter();

const products = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);

// TÌM KIẾM + PHÂN TRANG
const keyword = ref('');
const page = ref(0);
const size = ref(5);
const totalPages = ref(0);

// SẮP XẾP
const sortField = ref('id');
const sortDirection = ref('asc');

const fetchProducts = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await apiClient.get('/api/product', {
      params: {
        page: page.value,
        size: size.value,
        keyword: keyword.value || '',
        sort: `${sortField.value},${sortDirection.value}`,
      },
    });

    const data = response.data;
    products.value = data.data;
    totalPages.value = data.totalPages;
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu sản phẩm:', error);
    errorMessage.value = 'Không thể tải danh sách sản phẩm.';
  } finally {
    isLoading.value = false;
  }
};

const changeSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  fetchProducts();
};

const applySearch = () => {
  page.value = 0;
  fetchProducts();
};

const changePage = (newPage) => {
  page.value = newPage;
  fetchProducts();
};

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://placehold.co/80x80?text=No+Image';
  return imageUrl.startsWith('http')
    ? imageUrl
    : `http://localhost:8080/images/${imageUrl}`;
};

const setDefaultImage = (event) => {
  event.target.src = 'https://placehold.co/80x80?text=Error';
};

const editProduct = (id) => router.push({ name: 'UpdateProduct', params: { id } });

const deleteProduct = async (id) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm có ID: ${id} không?`)) {
    try {
      await apiClient.delete(`/api/product/${id}`);
      alert('Xóa sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      errorMessage.value = `Xóa thất bại: ${error.message}`;
    }
  }
};

onMounted(fetchProducts);
</script>

<style scoped>
.table thead th.text-end {
  text-align: right;
}

.product-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #dee2e6;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.product-thumbnail:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sortable-header {
  cursor: pointer;
  user-select: none;
}

.sortable-header:hover {
  background-color: #e9ecef;
}
</style>
