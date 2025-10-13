<template>
  <div class="cart-page container py-5 mt-5">
    <h2 class="fw-bold text-center mb-4">Giỏ hàng của bạn 🛒</h2>

    <div class="row g-4">
      <!-- DANH SÁCH SẢN PHẨM -->
      <div class="col-lg-8">
        <!-- Thanh chọn tất cả -->
        <div class="d-flex align-items-center mb-3">
          <input type="checkbox" id="selectAll" class="form-check-input me-2" />
          <label for="selectAll" class="form-check-label fw-semibold">Chọn tất cả</label>
        </div>

        <!-- Sản phẩm -->
        <div class="cart-item bg-white rounded-4 shadow-sm p-3 mb-3 d-flex flex-wrap align-items-center">
          <div class="form-check me-3">
            <input type="checkbox" class="form-check-input" id="product1" />
          </div>
          <img src="/images/crs-ip17-air.png" alt="iPhone 17" class="cart-img rounded-3 me-3" />
          <div class="flex-grow-1">
            <h5 class="fw-bold mb-1">iPhone 17 Pro Max</h5>
            <p class="text-secondary small mb-2">Màu: Titan Đen — 256GB</p>
            <div class="d-flex align-items-center justify-content-between flex-wrap">
              <span class="fw-bold text-primary fs-5">35.000.000 VNĐ</span>
              <div class="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                <button class="qty-btn">-</button>
                <span class="fw-bold">1</span>
                <button class="qty-btn">+</button>
              </div>
            </div>
          </div>
          <button class="btn-remove ms-auto mt-3 mt-lg-0">
            <i class="bi bi-trash3"></i>
          </button>
        </div>

        <div class="cart-item bg-white rounded-4 shadow-sm p-3 mb-3 d-flex flex-wrap align-items-center">
          <div class="form-check me-3">
            <input type="checkbox" class="form-check-input" id="product2" />
          </div>
          <img src="/images/ctg-macbook.png" alt="MacBook Air" class="cart-img rounded-3 me-3" />
          <div class="flex-grow-1">
            <h5 class="fw-bold mb-1">MacBook Air M3 2024</h5>
            <p class="text-secondary small mb-2">Màu: Bạc — 512GB</p>
            <div class="d-flex align-items-center justify-content-between flex-wrap">
              <span class="fw-bold text-primary fs-5">32.000.000 VNĐ</span>
              <div class="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                <button class="qty-btn">-</button>
                <span class="fw-bold">1</span>
                <button class="qty-btn">+</button>
              </div>
            </div>
          </div>
          <button class="btn-remove ms-auto mt-3 mt-lg-0">
            <i class="bi bi-trash3"></i>
          </button>
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-outline-danger px-4 py-2 rounded-pill">
            <i class="bi bi-trash"></i> Xóa tất cả
          </button>
        </div>
      </div>

      <!-- TỔNG TIỀN & THANH TOÁN -->
      <div class="col-lg-4">
        <div class="summary-box bg-white rounded-4 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Tóm tắt đơn hàng</h5>

          <div class="d-flex justify-content-between mb-2">
            <span>Tạm tính:</span>
            <span class="fw-semibold">67.000.000 VNĐ</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển:</span>
            <span class="fw-semibold text-success">Miễn phí</span>
          </div>
          <hr />
          <div class="d-flex justify-content-between mb-3">
            <span class="fw-bold fs-5">Tổng cộng:</span>
            <span class="fw-bold fs-5 text-primary">67.000.000 VNĐ</span>
          </div>

          <button class="btn btn-dark w-100 rounded-pill py-2 fw-semibold">
            Thanh toán sản phẩm đã chọn
          </button>
          <router-link to="/store" class="btn btn-outline-dark w-100 rounded-pill py-2 mt-3 fw-semibold">
            Tiếp tục mua sắm
          </router-link>
        </div>
      </div>
    </div>

    <!-- --- Nếu giỏ hàng trống --- -->
    <!--
    <div class="empty-cart text-center py-5">
      <img src="/images/empty-cart.svg" alt="Empty Cart" class="mb-3" style="width: 180px;" />
      <h4 class="fw-bold">Giỏ hàng trống!</h4>
      <p class="text-secondary mb-4">Hãy thêm sản phẩm bạn yêu thích vào giỏ hàng để mua sắm nhé.</p>
      <router-link to="/store" class="btn btn-primary rounded-pill px-4 py-2">
        Mua sắm ngay
      </router-link>
    </div>
    -->
  </div>
</template>

<style scoped>
.cart-page {
  color: #1d1d1f;
}

.cart-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  background-color: #f9f9f9;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background: #fff;
  font-weight: bold;
  line-height: 1;
  transition: 0.2s;
}
.qty-btn:hover {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}

.btn-remove {
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  transition: 0.2s;
}
.btn-remove:hover {
  color: red;
}

/* Box tổng kết */
.summary-box {
  border: 1px solid #eee;
}

/* Checkbox style nhẹ nhàng */
.form-check-input {
  width: 1.2em;
  height: 1.2em;
  cursor: pointer;
}
.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-img {
    width: 80px;
    height: 80px;
  }
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-remove {
    align-self: flex-end;
  }
}
</style>
