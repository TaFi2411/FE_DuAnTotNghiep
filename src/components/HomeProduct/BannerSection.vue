<template>
    <!-- ====== Phần 1: Hàng icon 6 cột ====== -->
    <div class="container py-5 feature-section">
      <div class="row text-center g-4">
        <div class="col-6 col-md-4 col-lg-2">
          <div class="feature-card rounded-4 p-4 h-100">
            <i class="bi bi-box-seam fs-1 mb-3"></i>
            <h6 class="fw-semibold mb-0">Trả lại miễn phí</h6>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="feature-card rounded-4 p-4 h-100">
            <i class="bi bi-truck fs-1 mb-3"></i>
            <h6 class="fw-semibold mb-0">Miễn phí vận chuyển</h6>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="feature-card rounded-4 p-4 h-100">
            <i class="bi bi-headset fs-1 mb-3"></i>
            <h6 class="fw-semibold mb-0">Hỗ trợ 24/7</h6>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="feature-card rounded-4 p-4 h-100">
            <i class="bi bi-credit-card fs-1 mb-3"></i>
            <h6 class="fw-semibold mb-0">Thanh toán dễ dàng</h6>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="feature-card rounded-4 p-4 h-100">
            <i class="bi bi-tag fs-1 mb-3"></i>
            <h6 class="fw-semibold mb-0">Giảm giá hằng ngày</h6>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="feature-card rounded-4 p-4 h-100">
            <i class="bi bi-gift fs-1 mb-3"></i>
            <h6 class="fw-semibold mb-0">Quà tặng hấp dẫn</h6>
          </div>
        </div>
      </div>
    </div>


    <!-- ====== Phần 2: Hai ô banner giảm giá ====== -->
    <div class="container pb-5">
      <div class="row g-4">

        <div class="col-md-6">
          <div class="position-relative overflow-hidden rounded-4 shadow-sm">
            <video class="w-100" autoplay loop muted playsinline>
              <source src="/images/banner-iphone.mp4" type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
            <div
              class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start text-white ps-4"
              style="background: rgba(0,0,0,0.4);">
              <h4 class="fw-bold">iPhone</h4>
              <p class="fs-5 mb-2">Công nghệ trên tay. <br> Gọn nhẹ siêu chức năng.</p>
              <a href="#" class="btn btn-light rounded-pill px-4 py-2">Mua ngay</a>
            </div>
          </div>
        </div>


        <div class="col-md-6">
          <div class="position-relative overflow-hidden rounded-4 shadow-sm">
            <video class="w-100" autoplay loop muted playsinline>
              <source src="/images/banner-ipad.mp4" type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
            <div
              class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start text-white ps-4"
              style="background: rgba(0,0,0,0.4);">
              <h4 class="fw-bold">iPad</h4>
              <p class="fs-5 mb-2">iPad cả thế giới trong tay bạn.</p>
              <a href="#" class="btn btn-light rounded-pill px-4 py-2">Mua ngay</a>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
