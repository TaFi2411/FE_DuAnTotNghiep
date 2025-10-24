<template>
  <div class="container mt-4">
    <h3>Danh sách danh mục</h3>

    <!-- 🔍 Bộ lọc -->
    <div class="d-flex justify-content-between mb-3 align-items-center gap-2">
      <div class="d-flex gap-2 flex-wrap w-75">
        <input
          v-model="filters.name"
          @input="fetchCategories"
          type="text"
          class="form-control"
          placeholder="Tìm theo tên..."
        />
        <input
          v-model="filters.slug"
          @input="fetchCategories"
          type="text"
          class="form-control"
          placeholder="Tìm theo slug..."
        />
        <select v-model="filters.status" @change="fetchCategories" class="form-select w-auto">
          <option value="">Tất cả</option>
          <option value="true">Hoạt động</option>
          <option value="false">Ẩn</option>
        </select>
      </div>

      <button class="btn btn-primary" @click="goAdd">+ Thêm Category</button>
    </div>

    <!-- ⏳ Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <!-- 🧱 Bảng -->
    <div v-else>
      <Table :columns="columns" :rows="categories">
        <!-- Trạng thái -->
        <template #status="{ row }">
          <span class="badge" :class="row.status ? 'bg-success' : 'bg-secondary'">
            {{ row.status ? 'Hoạt động' : 'Ẩn' }}
          </span>
        </template>

        <!-- Hành động -->
        <template #actions="{ row }">
          <button class="btn btn-sm btn-warning me-2" @click="goEdit(row.id)">
            Sửa
          </button>
          <button class="btn btn-sm btn-danger" @click="confirmDelete(row.id)">
            Xóa
          </button>
        </template>
      </Table>

      <!-- 📄 Phân trang -->
      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 0 }">
            <button class="page-link" @click="changePage(currentPage - 1)">«</button>
          </li>

          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page - 1 }"
          >
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
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "@/composables/axios.js";
import Table from "@/components/Table.vue";

const router = useRouter();
const categories = ref([]);
const loading = ref(true);

// Bộ lọc
const filters = ref({
  name: "",
  slug: "",
  status: ""
});

// Phân trang
const currentPage = ref(0);
const totalPages = ref(1);
const pageSize = 5;

// Cấu hình cột
const columns = [
  { label: "ID", field: "id" },
  { label: "Slug", field: "slug" },
  { label: "Tên danh mục", field: "name" },
  { label: "Trạng thái", field: "status", slot: "status" }
];

// Gọi API
const fetchCategories = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/category", {
      params: {
        name: filters.value.name,
        slug: filters.value.slug,
        status: filters.value.status || null,
        page: currentPage.value,
        size: pageSize
      }
    });
    categories.value = res.data.data || res.data.content || [];
    totalPages.value = res.data.totalPages || 1;
  } catch (err) {
    console.error("❌ Lỗi tải danh mục:", err);
    Swal.fire("Lỗi", "Không thể tải danh mục!", "error");
  }
  loading.value = false;
};

// Chuyển trang
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchCategories();
  }
};

// Hành động
const goAdd = () => router.push("/categories/add");
const goEdit = (id) => router.push(`/categories/edit/${id}`);

const confirmDelete = async (id) => {
  const confirm = await Swal.fire({
    title: "Xóa danh mục?",
    text: "Bạn có chắc chắn muốn xóa không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy"
  });

  if (!confirm.isConfirmed) return;

  try {
    await axios.delete(`/api/category/${id}`);
    Swal.fire("Đã xóa!", "Danh mục đã bị xóa.", "success");
    fetchCategories();
  } catch (err) {
    console.error("❌ Lỗi khi xóa:", err);
    Swal.fire("Lỗi", "Không thể xóa danh mục!", "error");
  }
};

onMounted(fetchCategories);
</script>
