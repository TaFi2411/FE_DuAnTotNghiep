<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">Quản lý Phương thức Thanh toán</h2>

    <!-- 🔍 Bộ lọc tìm kiếm -->
    <div class="d-flex justify-content-between mb-3 align-items-center gap-2">
      <div class="d-flex gap-2 w-75">
        <input
          v-model="keyword"
          @input="fetchData"
          type="text"
          class="form-control"
          placeholder="Tìm theo tên..."
        />
        <select v-model="status" @change="fetchData" class="form-select w-auto">
          <option value="">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Ngưng hoạt động</option>
        </select>
      </div>

      <button class="btn btn-primary" @click="goAdd">+ Thêm phương thức</button>
    </div>

    <!-- 🧱 Bảng dữ liệu -->
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Tên phương thức</th>
          <th>Trạng thái</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>
            <span class="badge" :class="item.status ? 'bg-success' : 'bg-secondary'">
              {{ item.status ? 'Hoạt động' : 'Ngưng hoạt động' }}
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning me-2" @click="goEdit(item.id)">
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="confirmDelete(item.id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Khi không có dữ liệu -->
    <div v-if="list.length === 0" class="text-center text-muted mt-3">
      Không có phương thức thanh toán nào.
    </div>

    <!-- 📄 Phân trang -->
    <div
      v-if="totalPages > 1"
      class="d-flex justify-content-between align-items-center mt-3"
    >
      <div>Trang {{ currentPage + 1 }} / {{ totalPages }}</div>
      <div>
        <button
          class="btn btn-outline-primary me-2"
          :disabled="currentPage === 0"
          @click="changePage(currentPage - 1)"
        >
          &laquo; Trước
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="currentPage >= totalPages - 1"
          @click="changePage(currentPage + 1)"
        >
          Sau &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios";

const router = useRouter();
const list = ref([]);

// 🔍 Bộ lọc
const keyword = ref("");
const status = ref("");

// 📄 Phân trang
const currentPage = ref(0);
const totalPages = ref(1);
const totalItems = ref(0);
const pageSize = 5;

// 🚀 Lấy danh sách PaymentMethod
const fetchData = async (page = currentPage.value) => {
  try {
    const res = await axios.get("/api/payment-method", {
      params: {
        keyword: keyword.value || "",
        status: status.value !== "" ? status.value : null,
        page,
        size: pageSize,
      },
    });

    list.value = res.data.data || res.data.content || [];
    totalPages.value = res.data.totalPages || 1;
    totalItems.value = res.data.totalItems || list.value.length;
    currentPage.value = res.data.currentPage || 0;
  } catch (err) {
    console.error("❌ Lỗi khi tải phương thức thanh toán:", err);
  }
};

// 👉 Đổi trang
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchData(page);
  }
};

// ➕ Thêm, ✏️ Sửa, ❌ Xóa
const goAdd = () => router.push("/payment-method/add");
const goEdit = (id) => router.push(`/payment-method/edit/${id}`);

const confirmDelete = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa phương thức này không?")) return;
  try {
    await axios.delete(`/api/payment-method/${id}`);
    await fetchData(currentPage.value);
    alert("✅ Xóa thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi xóa:", err);
    alert("Xóa thất bại, xem console để biết thêm chi tiết.");
  }
};

onMounted(fetchData);
</script>

<style scoped>
.card {
  border-radius: 10px;
}
.pagination .page-link {
  cursor: pointer;
}
</style>
