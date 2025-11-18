<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Danh sách sản phẩm</h3>
      <button class="btn-add-product" @click="goToAddProduct">
        <i class="bi bi-plus-lg"></i> Thêm sản phẩm
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="products"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm sản phẩm...' }"
        theme="polar-bear"
        :max-height="'60vh'"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'image'">
            <img
              :src="props.row.image"
              class="rounded"
              style="width: 60px; height: 60px; object-fit: cover"
              alt="Ảnh sản phẩm"
            />
          </span>

          <span v-else-if="props.column.field === 'status'">
            <span
              class="badge"
              :class="props.row.status ? 'bg-success' : 'bg-secondary'"
            >
              {{ props.row.status ? "Đang bán" : "Ngừng bán" }}
            </span>
          </span>

          <span v-else-if="props.column.field === 'skus'">
            {{ props.row.skus?.length || 0 }} biến thể
          </span>

          <span v-else-if="props.column.field === 'actions'">
            <button
              class="btn btn-outline-primary btn-sm me-1"
              @click="viewDetail(props.row.id)"
            >
              <i class="bi bi-eye"></i>
            </button>
            <button
              class="btn btn-outline-warning btn-sm me-1"
              @click="editProduct(props.row.id)"
            >
              <i class="bi bi-pencil"></i>
            </button>
          </span>

          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
// ✅ BƯỚC 2: IMPORT CSS (Đã có sẵn)
import "vue-good-table-next/dist/vue-good-table-next.css";

const router = useRouter();
const products = ref([]);
const loading = ref(false);

// 🧩 Cấu hình cột
const columns = ref([
  { label: "Ảnh", field: "image", width: "100px" },
  { label: "Tên sản phẩm", field: "name", sortable: true },
  { label: "Danh mục", field: "categoryName", sortable: true },
  { label: "Trạng thái", field: "status", width: "120px" },
  { label: "Biến thể", field: "skus", width: "120px" },
  { label: "Hành động", field: "actions", width: "130px" },
]);

// 🧭 Phân trang ở frontend
const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
});

// 📡 Lấy toàn bộ dữ liệu (ví dụ tối đa 1000 bản ghi)
const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/product", {
      params: {
        page: 0,
        size: 1000, // ⚡ lấy tối đa 1000 sản phẩm
      },
    });
    // Lấy dữ liệu
    let data = res.data.data || res.data.content || res.data || [];

    // Sắp xếp giảm dần theo id
    products.value = data.sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error("❌ Lỗi tải sản phẩm:", err);
    Swal.fire("Lỗi", "Không thể tải danh sách sản phẩm!", "error");
  } finally {
    loading.value = false;
  }
};

// 📦 Hành động
const goToAddProduct = () => router.push("/admin/product/create");
const viewDetail = (id) => router.push(`/admin/product-detail/${id}`);
const editProduct = (id) => router.push(`/admin/product/update/${id}`);

// 🚀 Khi component mount
onMounted(fetchProducts);
</script>

<style scoped>
.p-3 {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.badge {
  font-size: 13px;
  padding: 5px 10px;
}

/* ===== ✅ NÚT THÊM (ĐÃ CẬP NHẬT) ===== */
.btn-add-product {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #198754;
  border-radius: 6px;
  background-color: #198754;
  color: #fff;
  height: 38px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.btn-add-product i {
  font-size: 14px;
}
.btn-add-product:hover {
  background-color: #157347;
  border-color: #146c43;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Nút trong bảng */
.btn-outline-primary,
.btn-outline-warning {
  padding: 4px 8px;
  font-size: 13px;
}


/* ===== ✅ BƯỚC 3: CSS CHO SCROLLBAR VÀ STICKY HEADER ===== */

/* 1. Style cho vùng cuộn (tbody) */
:deep(.vgt-table-wrapper) {
  /* Tùy chỉnh thanh cuộn cho mỏng và đẹp */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
}

/* 2. Ép header phải "dính" (sticky) */
:deep(.vgt-table thead th) {
  /* Sử dụng !important để đảm bảo
    ghi đè lên mọi style khác 
  */
  position: sticky !important;
  top: 0 !important;

  /* Thêm nền trắng (hoặc màu nền của bạn) 
    để tbody không bị "xuyên thấu" qua header khi cuộn
  */
  background: white !important;

  /* Đảm bảo header luôn nổi lên trên */
  z-index: 10 !important;
}
</style>