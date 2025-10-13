<template>
  <div class="product-detail container py-5 mt-5">

    <!-- --- PHẦN TRÊN: ẢNH & THÔNG TIN --- -->
    <div class="row align-items-start g-5">
      <!-- Ảnh chính -->
      <div class="col-lg-6 col-md-12 text-center">
        <div class="main-image-wrapper p-4 bg-white rounded-4 shadow-sm">
          <img src="/images/crs-ip17-air.png" alt="iPhone 17 Pro Max" class="img-fluid rounded-3 main-image" />
        </div>
        <div class="thumbs d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <img src="/images/crs-ip17-air.png" class="thumb active" alt="thumb" />
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
          <button class="btn btn-outline-dark px-5 py-2 rounded-pill">Thêm vào giỏ</button>
        </div>
      </div>
    </div>

    <!-- --- PHẦN DƯỚI: MÔ TẢ & ĐÁNH GIÁ --- -->
    <div class="product-info mt-5 bg-white rounded-4 shadow-sm p-4">
      <!-- Mô tả -->
      <h4 class="fw-bold mb-3">Mô tả sản phẩm</h4>
      <p class="text-secondary lh-lg">
        iPhone 17 Pro Max mang đến hiệu năng mạnh mẽ nhờ chip A19 Bionic, màn hình Super Retina
        XDR ProMotion 120Hz và thiết kế titan cao cấp. Camera được nâng cấp với cảm biến 48MP mới,
        cho khả năng chụp ảnh sắc nét vượt trội trong mọi điều kiện ánh sáng.
      </p>

      <hr class="my-4" />

      <!-- Đánh giá -->
      <h4 class="fw-bold mb-3">Đánh giá của khách hàng (2)</h4>

      <div class="review-item border-bottom pb-3 mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="fw-bold mb-0">Minh Anh</h6>
          <small class="text-muted">2 ngày trước</small>
        </div>
        <div class="text-warning my-1">
          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
        </div>
        <p class="text-secondary mb-0">Sản phẩm rất đáng tiền, hiệu năng cực tốt!</p>
      </div>

      <div class="review-item">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="fw-bold mb-0">Hải Đăng</h6>
          <small class="text-muted">1 tuần trước</small>
        </div>
        <div class="text-warning my-1">
          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
          <i class="bi bi-star"></i>
        </div>
        <p class="text-secondary mb-0">Thiết kế đẹp, chụp hình cực kỳ chi tiết.</p>
      </div>
    </div>

  </div>
</template>

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
