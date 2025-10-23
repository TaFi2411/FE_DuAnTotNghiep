<template>
  <div class="container mt-4">
    <h3>Danh sách sản phẩm</h3>

    <div v-if="loading" class="text-center py-5">Đang tải dữ liệu...</div>

    <div v-else>
      <BaseTable :columns="columns" :rows="products">

        <!-- Ảnh sản phẩm -->
        <template #image="{ row }">
          <img :src="row.image" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
        </template>

        <!-- Trạng thái -->
        <template #status="{ row }">
          <span class="badge" :class="row.status ? 'bg-success' : 'bg-danger'">
            {{ row.status ? 'Đang bán' : 'Ngừng bán' }}
          </span>
        </template>

        <!-- Số biến thể -->
        <template #skus="{ row }">
          {{ row.skus?.length || 0 }} biến thể
        </template>

        <!-- Nút thao tác -->
        <template #actions="{ row }">
          <button class="btn btn-primary btn-sm me-2" @click="viewDetail(row)">
            Chi tiết
          </button>
          <button class="btn btn-warning btn-sm me-2" @click="editProduct(row.id)">
            Sửa
          </button>
          <button class="btn btn-danger btn-sm" @click="deleteProduct(row.id)">
            Xóa
          </button>
        </template>

      </BaseTable>

      <!-- Phân trang -->
      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 0 }">
            <button class="page-link" @click="changePage(currentPage - 1)">«</button>
          </li>

          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page - 1 }">
            <button class="page-link" @click="changePage(page - 1)">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
            <button class="page-link" @click="changePage(currentPage + 1)">»</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "@/composables/axios.js";
import BaseTable from "@/components/Table.vue";

const products = ref([]);
const loading = ref(true);
const currentPage = ref(0);
const totalPages = ref(1);

const columns = [
  { label: "Ảnh", field: "image", slot: "image" },
  { label: "Tên SP", field: "name" },
  { label: "Danh mục", field: "categoryName" },
  { label: "Trạng thái", field: "status", slot: "status" },
  { label: "Biến thể", field: "skus", slot: "skus" },
];

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/api/product?page=${currentPage.value}`);
    products.value = res.data.data;
    totalPages.value = res.data.totalPages;
  } catch (err) {
    console.error("Lỗi tải dữ liệu: ", err);
  }
  loading.value = false;
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchProducts();
  }
};

const viewDetail = (row) => {
  console.log("View detail:", row);
  // router.push(`/products/${row.id}`) nếu có router
};


const deleteProduct = async (id) => {
  const confirm = await Swal.fire({
    title: "Xóa sản phẩm?",
    text: "Không thể hoàn tác sau khi xóa!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (!confirm.isConfirmed) return;

  try {
    await axios.delete(`/api/product/${id}`);
    Swal.fire("Đã xóa!", "Sản phẩm đã được xóa", "success");
    fetchProducts();
  } catch (err) {
    Swal.fire("Lỗi!", "Không thể xóa sản phẩm", "error");
  }
};


onMounted(fetchProducts);
</script>
