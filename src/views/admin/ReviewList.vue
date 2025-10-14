<template>
  <div class="container mt-4">
    <h2 class="text-center mb-3">Quản lý đánh giá</h2>

    <!-- 🔍 Bộ lọc -->
    <div class="card p-3 mb-3 shadow-sm">
      <div class="row g-2 align-items-center">
        <div class="col-md-4">
          <input
            v-model="filters.keyword"
            type="text"
            class="form-control"
            placeholder="Tìm theo mô tả hoặc tài khoản..."
            @keyup.enter="fetchReviews"
          />
        </div>

        <div class="col-md-3">
          <select v-model="filters.star" class="form-select" @change="fetchReviews">
            <option value="">-- Tất cả số sao --</option>
            <option v-for="s in [1,2,3,4,5]" :key="s" :value="s">{{ s }} sao</option>
          </select>
        </div>

        <div class="col-md-3">
          <button class="btn btn-primary w-100" @click="fetchReviews">Tìm kiếm</button>
        </div>

      </div>
    </div>

    <!-- 📋 Bảng -->
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-light">
            <tr class="text-center">
              <th>ID</th>
              <th>Số sao</th>
              <th>Mô tả</th>
              <th>Tài khoản</th>
              <th>Chi tiết đơn hàng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="reviews.length === 0">
              <td colspan="6" class="text-center py-3 text-muted">
                Không có dữ liệu hiển thị.
              </td>
            </tr>
            <tr v-for="review in reviews" :key="review.id" class="align-middle text-center">
              <td>{{ review.id }}</td>
              <td>
                <span class="text-warning">
                  {{ '★'.repeat(review.star) }}
                </span>
              </td>
              <td class="text-start">{{ truncate(review.description, 60) }}</td>
              <td>{{ review.accountName || '—' }}</td>
              <td>{{ review.orderDetailId }}</td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDelete(review.id)"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 📄 Phân trang -->
      <div
        class="d-flex justify-content-between align-items-center p-3 border-top bg-light"
        v-if="totalPages > 1"
      >
        <small>Trang {{ currentPage + 1 }} / {{ totalPages }}</small>
        <div class="btn-group">
          <button
            class="btn btn-outline-secondary btn-sm"
            :disabled="currentPage === 0"
            @click="changePage(currentPage - 1)"
          >
            ← Trước
          </button>
          <button
            class="btn btn-outline-secondary btn-sm"
            :disabled="currentPage + 1 >= totalPages"
            @click="changePage(currentPage + 1)"
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";

// 🧩 Biến dữ liệu
const reviews = ref([]);
const currentPage = ref(0);
const totalPages = ref(1);

const filters = ref({
  keyword: "",
  star: "",
});

async function fetchReviews(page = 0) {
  try {
    const params = {
      page,
      keyword: filters.value.keyword || undefined,
      star: filters.value.star || undefined,
    };
    const res = await axios.get("/api/review", { params });

    reviews.value = res.data.data;
    currentPage.value = res.data.currentPage;
    totalPages.value = res.data.totalPages;
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách:", err);
    alert("Không tải được danh sách review!");
  }
}

function changePage(page) {
  fetchReviews(page);
}

function confirmDelete(id) {
  if (confirm("Bạn có chắc chắn muốn xóa review này không?")) {
    deleteReview(id);
  }
}

async function deleteReview(id) {
  try {
    await axios.delete(`/api/review/${id}`);
    alert("✅ Xóa thành công!");
    fetchReviews(currentPage.value);
  } catch (err) {
    console.error("❌ Lỗi khi xóa:", err);
    alert("Xóa thất bại!");
  }
}

function truncate(text, length) {
  return text && text.length > length ? text.substring(0, length) + "..." : text;
}

onMounted(() => fetchReviews());
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
.card {
  border-radius: 10px;
}
.table-responsive {
  max-height: 65vh;
}
</style>
