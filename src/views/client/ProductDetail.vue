<template>
  <div class="product-detail container py-5 mt-5">
    <!-- --- PHẦN TRÊN: ẢNH & THÔNG TIN --- -->
    <div class="row align-items-start g-5">
      <!-- Ảnh chính -->
      <div class="col-lg-6 col-md-12 text-center">
        <div class="main-image-wrapper p-4 bg-white rounded-4 shadow-sm">
          <img
            src="/images/crs-ip17-air.png"
            alt="iPhone 17 Pro Max"
            class="img-fluid rounded-3 main-image"
          />
        </div>
        <div class="thumbs d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <img
            src="/images/crs-ip17-air.png"
            class="thumb active"
            alt="thumb"
          />
          <img src="/images/crs-ip17-air.png" class="thumb" alt="thumb" />
          <img src="/images/crs-ip17-air.png" class="thumb" alt="thumb" />
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="col-lg-6 col-md-12">
        <h2 class="fw-bold mb-3">iPhone 17 Pro Max</h2>
        <p class="text-secondary mb-2">Hàng chính hãng (VN/A) - Mới 100%</p>
        <h3 class="fw-bold text-primary mb-4">Giá: 35.000.000 VNĐ</h3>

        <!-- Chọn màu sắc -->
        <div class="mb-4">
          <h6 class="fw-bold mb-2">Màu sắc</h6>
          <div class="d-flex flex-wrap gap-2">
            <button class="option-btn active">Đen Titan</button>
            <button class="option-btn">Xanh Biển Sâu</button>
            <button class="option-btn">Vàng Ánh Kim</button>
          </div>
        </div>

        <!-- Chọn dung lượng -->
        <div class="mb-4">
          <h6 class="fw-bold mb-2">Dung lượng</h6>
          <div class="d-flex flex-wrap gap-2">
            <button class="option-btn active">128GB</button>
            <button class="option-btn">256GB</button>
            <button class="option-btn">512GB</button>
            <button class="option-btn">1TB</button>
          </div>
        </div>

        <!-- Nút hành động -->
        <div class="d-flex flex-wrap gap-3 mt-4">
          <button class="btn btn-dark px-5 py-2 rounded-pill">Mua ngay</button>
          <button class="btn btn-outline-dark px-5 py-2 rounded-pill">
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>

    <!-- --- PHẦN DƯỚI: MÔ TẢ & ĐÁNH GIÁ --- -->
    <div class="product-info mt-5 bg-white rounded-4 shadow-sm p-4">
      <!-- Mô tả -->
      <h4 class="fw-bold mb-3">Mô tả sản phẩm</h4>
      <p class="text-secondary lh-lg">
        iPhone 17 Pro Max mang đến hiệu năng mạnh mẽ nhờ chip A19 Bionic, màn
        hình Super Retina XDR ProMotion 120Hz và thiết kế titan cao cấp. Camera
        được nâng cấp với cảm biến 48MP mới, cho khả năng chụp ảnh sắc nét vượt
        trội trong mọi điều kiện ánh sáng.
      </p>

      <hr class="my-4" />

      <!-- Đánh giá -->
      <h4 class="fw-bold mb-3">Đánh giá của khách hàng (2)</h4>

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
          <!-- nút xóa chỉ hiện nếu là người viết -->
          <button
            v-if="user && user.id === review.accountId"
            class="btn btn-outline-danger btn-sm mt-2"
            @click="confirmDelete(review.id)"
          >
            <i class="bi bi-trash"></i> Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";
import { useRouter } from "vue-router";

// 🧩 Lấy thông tin người dùng đang đăng nhập
const user = JSON.parse(localStorage.getItem("user"));
console.log("User hiện tại:", user);

// 🧩 Biến dữ liệu
const reviews = ref([]);
const currentPage = ref(0);
const totalPages = ref(1);

// ✅ Bộ lọc search + star rating
const filters = ref({
  keyword: "",
  star: "",
});

// 🧠 Hàm lấy danh sách review theo phân trang + filter
async function fetchReviews(page = 0) {
  try {
    const params = {
      page,
      keyword: filters.value.keyword,
      star: filters.value.star,
    };

    const res = await axios.get("/api/review", { params });

    const reviewList = res.data.data;

    // 🧩 Gọi thêm API order-detail cho từng review
    for (let review of reviewList) {
      try {
        const orderRes = await axios.get(
          `/api/order-detail/${review.orderDetailId}`
        );
        review.orderDetail = orderRes.data;
      } catch (err) {
        console.warn("Không lấy được orderDetail:", review.orderDetailId);
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

// 🧩 Chuyển trang
function changePage(page) {
  if (page >= 0 && page < totalPages.value) {
    fetchReviews(page);
  }
}

// 🧩 Xác nhận xóa
function confirmDelete(id, accountId) {
  if (!user) return alert("Bạn cần đăng nhập!");

  if (user.role !== "ADMIN" && user.id !== accountId) {
    return alert("Bạn không có quyền xóa review này!");
  }

  if (confirm("Bạn có chắc chắn muốn xóa review này không?")) {
    deleteReview(id);
  }
}

// 🧩 Gọi API xóa review
async function deleteReview(id) {
  try {
    await axios.delete(`/api/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    alert("✅ Xóa review thành công!");
    fetchReviews(currentPage.value); // load lại trang hiện tại
  } catch (error) {
    console.error(error);
    alert("❌ Xóa thất bại!");
  }
}

// 🧩 Cắt bớt mô tả dài
function truncate(text, length) {
  return text?.length > length ? text.substring(0, length) + "..." : text;
}

// 🧩 Gọi khi load trang
onMounted(() => fetchReviews());
</script>


<style scoped>
.product-detail {
  color: #1d1d1f;
}

.main-image {
  max-height: 420px;
  object-fit: contain;
}

.thumb {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 1px solid #ddd;
  object-fit: contain;
  cursor: pointer;
  transition: 0.3s;
}

.thumb:hover,
.thumb.active {
  border-color: #0d6efd;
  box-shadow: 0 0 8px rgba(13, 110, 253, 0.3);
}

/* Nút chọn màu / dung lượng */
.option-btn {
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.2s;
}

.option-btn:hover {
  background-color: #0d6efd;
  color: #fff;
}

.option-btn.active {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}

/* Phần mô tả & đánh giá */
.product-info {
  line-height: 1.7;
}

.review-item {
  background-color: #fafafa;
  padding: 15px;
  border-radius: 12px;
  transition: 0.2s;
}

.review-item:hover {
  background-color: #f1f5ff;
}

/* Responsive */
@media (max-width: 768px) {
  .main-image {
    max-height: 320px;
  }
}
</style>
