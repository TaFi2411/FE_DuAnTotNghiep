<template>
  <div class="container mt-4">
    <h2 class="text-center mb-3">Quản lý đánh giá</h2>
    <div
      v-for="review in reviews"
      :key="review.id"
      class="card mb-3 border-0 border-bottom pb-3"
    >
      <div class="card-body p-0 ms-3 mt-3">
        <!-- Tên người dùng -->
        <h6 class="fw-semibold mb-1">{{ review.accountName }}</h6>
        <!-- Số sao -->
        <div class="text-warning mb-2">
          <i v-for="n in review.star" :key="n" class="bi bi-star-fill"></i>
        </div>
        <!-- Ngày và phân loại -->
        <div class="text-muted small mb-2">
          {{ review.orderDetail?.order?.createdDate || "Chưa có ngày" }}
          | Phân loại hàng:
          <span class="fw-semibold">
            {{
              review.orderDetail?.sku?.productVariantName || "Không xác định"
            }}
          </span>
        </div>

        <!-- Nội dung đánh giá -->
        <p class="mb-0">{{ review.description }}</p>
      </div>
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
    const params = { page };
    const res = await axios.get("/api/review", { params });
    const reviewList = res.data.data;

    // 🧠 Gọi thêm API order-detail cho từng review
    for (let review of reviewList) {
      try {
        const orderRes = await axios.get(
          `/api/order-detail/${review.orderDetailId}`
        );
        review.orderDetail = orderRes.data; // gán dữ liệu chi tiết vào review
      } catch (err) {
        console.warn("Không lấy được orderDetail cho ID", review.orderDetailId);
        review.orderDetail = null;
      }
    }

    reviews.value = reviewList;
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
  return text && text.length > length
    ? text.substring(0, length) + "..."
    : text;
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
