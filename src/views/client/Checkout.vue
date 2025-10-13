<template>
  <div class="checkout-page container py-5 mt-5">
    <h2 class="fw-bold text-center mb-4">Thanh toán đơn hàng 💳</h2>

    <div class="row g-4">
      <!-- CỘT TRÁI -->
      <div class="col-lg-8">
        <!-- ĐỊA CHỈ GIAO HÀNG -->
        <div class="bg-white rounded-4 shadow-sm p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Địa chỉ giao hàng</h5>
            <button class="btn btn-outline-primary btn-sm rounded-pill px-3">
              <i class="bi bi-plus-circle"></i> Thêm địa chỉ mới
            </button>
          </div>

          <div class="address-card border rounded-3 p-3 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="address" id="addr1" checked />
              <label class="form-check-label w-100" for="addr1">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Lương Thế Tài</strong> — 0909 123 456
                    <p class="text-secondary mb-0 small">
                      123 Đường ABC, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                  <span class="badge bg-primary text-white">Mặc định</span>
                </div>
              </label>
            </div>
          </div>

          <div class="address-card border rounded-3 p-3 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="address" id="addr2" />
              <label class="form-check-label w-100" for="addr2">
                <div>
                  <strong>Nguyễn Văn A</strong> — 0987 654 321
                  <p class="text-secondary mb-0 small">
                    456 Đường XYZ, Quận Bình Thạnh, TP. Hồ Chí Minh
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- VOUCHER -->
        <div class="bg-white rounded-4 shadow-sm p-4 mb-4">
          <h5 class="fw-bold mb-3">Mã giảm giá (Voucher)</h5>

          <div class="input-group mb-4">
            <input
              type="text"
              class="form-control rounded-start-pill"
              placeholder="Nhập mã giảm giá của bạn..."
            />
            <button class="btn btn-dark rounded-end-pill px-4">Áp dụng</button>
          </div>

          <!-- Nút bật/tắt danh sách voucher -->
          <button
            class="btn btn-outline-primary rounded-pill w-100 fw-semibold d-flex justify-content-between align-items-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#voucherList"
            aria-expanded="false"
          >
            <span><i class="bi bi-ticket-perforated me-2"></i> Chọn voucher có sẵn</span>
            <i class="bi bi-chevron-down"></i>
          </button>

          <!-- DANH SÁCH VOUCHER -->
          <div class="collapse mt-4" id="voucherList">
            <!-- Voucher sản phẩm -->
            <h6 class="fw-bold text-primary mb-3 mt-2">
              <i class="bi bi-gift me-2"></i> Voucher sản phẩm
            </h6>

            <div class="voucher-section mb-4">
              <div
                class="voucher-card border rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center flex-wrap"
              >
                <div>
                  <strong>GIAM10K</strong>
                  <p class="text-secondary small mb-1">Giảm 10.000₫ cho đơn từ 500.000₫</p>
                  <span class="badge bg-success">Còn hạn</span>
                </div>
                <button class="btn btn-outline-primary rounded-pill px-3 mt-2 mt-sm-0">
                  Áp dụng
                </button>
              </div>

              <div
                class="voucher-card border rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center flex-wrap"
              >
                <div>
                  <strong>SALE20</strong>
                  <p class="text-secondary small mb-1">Giảm 20% tối đa 200.000₫</p>
                  <span class="badge bg-success">Còn hạn</span>
                </div>
                <button class="btn btn-outline-primary rounded-pill px-3 mt-2 mt-sm-0">
                  Áp dụng
                </button>
              </div>
            </div>

            <!-- Voucher vận chuyển -->
            <h6 class="fw-bold text-primary mb-3">
              <i class="bi bi-truck me-2"></i> Voucher vận chuyển
            </h6>

            <div class="voucher-section">
              <div
                class="voucher-card border rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center flex-wrap"
              >
                <div>
                  <strong>FREESHIP</strong>
                  <p class="text-secondary small mb-1">Miễn phí vận chuyển toàn quốc</p>
                  <span class="badge bg-primary">Hot</span>
                </div>
                <button class="btn btn-outline-primary rounded-pill px-3 mt-2 mt-sm-0">
                  Áp dụng
                </button>
              </div>

              <div
                class="voucher-card border rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center flex-wrap"
              >
                <div>
                  <strong>SHIP20</strong>
                  <p class="text-secondary small mb-1">Giảm 20.000₫ phí ship cho đơn từ 300.000₫</p>
                  <span class="badge bg-success">Còn hạn</span>
                </div>
                <button class="btn btn-outline-primary rounded-pill px-3 mt-2 mt-sm-0">
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- PHƯƠNG THỨC THANH TOÁN -->
        <div class="bg-white rounded-4 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Phương thức thanh toán</h5>

          <div class="payment-method border rounded-3 p-3 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="payment" id="cod" checked />
              <label class="form-check-label fw-semibold" for="cod">
                <i class="bi bi-truck me-2 text-primary"></i> Thanh toán khi nhận hàng (COD)
              </label>
            </div>
          </div>

          <div class="payment-method border rounded-3 p-3 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="payment" id="bank" />
              <label class="form-check-label fw-semibold" for="bank">
                <i class="bi bi-bank me-2 text-primary"></i> Chuyển khoản ngân hàng
              </label>
            </div>
          </div>

          <div class="payment-method border rounded-3 p-3 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="payment" id="momo" />
              <label class="form-check-label fw-semibold" for="momo">
                <i class="bi bi-phone me-2 text-primary"></i> Ví MoMo / ZaloPay
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG -->
      <div class="col-lg-4">
        <div class="summary-box bg-white rounded-4 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Tóm tắt đơn hàng</h5>

          <!-- DANH SÁCH SẢN PHẨM -->
          <div class="product-summary mb-4">
            <div class="product-item d-flex align-items-center mb-3">
              <img
                src="/images/crs-ip17-air.png"
                alt="MacBook Pro 14”"
                class="rounded-3 me-3"
                width="60"
                height="60"
              />
              <div class="flex-grow-1">
                <h6 class="mb-1">MacBook Pro 14” M3</h6>
                <small class="text-secondary d-block">Màu: Xám | RAM: 16GB</small>
                <small class="text-secondary">x1</small>
              </div>
              <span class="fw-semibold">52.000.000₫</span>
            </div>

            <div class="product-item d-flex align-items-center mb-3">
              <img
                src="/images/crs-ip17-air.png"
                alt="AirPods Pro 2"
                class="rounded-3 me-3"
                width="60"
                height="60"
              />
              <div class="flex-grow-1">
                <h6 class="mb-1">AirPods Pro 2</h6>
                <small class="text-secondary d-block">Bản sạc Type-C</small>
                <small class="text-secondary">x1</small>
              </div>
              <span class="fw-semibold">7.000.000₫</span>
            </div>
          </div>

          <hr />

          <div class="d-flex justify-content-between mb-2">
            <span>Tạm tính:</span>
            <span class="fw-semibold">59.000.000₫</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Giảm giá:</span>
            <span class="fw-semibold text-success">-1.000.000₫</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển:</span>
            <span class="fw-semibold text-success">Miễn phí</span>
          </div>
          <hr />
          <div class="d-flex justify-content-between mb-3">
            <span class="fw-bold fs-5">Tổng cộng:</span>
            <span class="fw-bold fs-5 text-primary">58.000.000₫</span>
          </div>

          <button class="btn btn-dark w-100 rounded-pill py-2 fw-semibold">
            Xác nhận thanh toán
          </button>
          <router-link
            to="/cart"
            class="btn btn-outline-dark w-100 rounded-pill py-2 mt-3 fw-semibold"
          >
            Quay lại giỏ hàng
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  color: #1d1d1f;
}

.address-card:hover,
.payment-method:hover {
  border-color: #0d6efd;
  background-color: #f8f9ff;
  transition: 0.3s;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.summary-box {
  border: 1px solid #eee;
}

.product-item img {
  object-fit: cover;
}

.product-item:hover {
  background-color: #f9f9ff;
  border-radius: 12px;
  transition: 0.3s;
  padding: 4px;
}

.voucher-card:hover {
  border-color: #0d6efd;
  background-color: #f8f9ff;
}

.btn[data-bs-toggle="collapse"] i {
  transition: transform 0.3s ease;
}
.btn[aria-expanded="true"] i {
  transform: rotate(180deg);
}
</style>
