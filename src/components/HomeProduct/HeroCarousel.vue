<template>
    <div class="row g-0 justify-content-end">
      <!-- Carousel chính -->
      <div class="col-12 col-lg-7 col-xl-9">
        <div id="mainCarousel" class="carousel slide bg-light py-5" data-bs-ride="carousel">
          <div class="carousel-inner">
            <!-- Slide 1 -->
            <div class="carousel-item active">
              <div class="row g-0 align-items-center">
                <div class="col-xl-6 carousel-img animate__animated animate__fadeInLeft">
                  <img src="/images/crs-ip17-banner.png" class="img-fluid w-100" alt="Image" />
                </div>
                <div class="col-xl-6 carousel-content p-4 animate__animated animate__fadeInRight">
                  <h4 class="text-uppercase fw-bold mb-4" style="letter-spacing: 3px;">iPhone 17 Promax</h4>
                  <h1 class="display-5 text-capitalize mb-4">
                    Vỏ nguyên khối.<br />Tạo nên một tổng thể mạnh vô đối.
                  </h1>
                  <p class="text-dark">Nhanh tay mua ngay</p>
                  <a class="btn btn-primary rounded-pill py-3 px-5" href="#">Mua ngay</a>
                </div>
              </div>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-item">
              <div class="row g-0 align-items-center">
                <div class="col-xl-6 carousel-img animate__animated animate__fadeInLeft">
                  <img src="/images/crs-ip17-air.png" class="img-fluid w-100" alt="Image" />
                </div>
                <div class="col-xl-6 carousel-content p-4 animate__animated animate__fadeInRight">
                  <h4 class="text-uppercase fw-bold mb-4" style="letter-spacing: 3px;">iPhone 17 Air</h4>
                  <h1 class="display-5 text-capitalize mb-4">
                    iPhone mỏng nhất từng có. <br>
                    Với sức mạnh pro bên trong.</h1>
                  <p class="text-dark">Nhanh tay mua ngay</p>
                  <a class="btn btn-primary rounded-pill py-3 px-5" href="#">Mua ngay</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Nút điều hướng -->
          <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      <!-- Banner bên phải -->
      <div class="col-12 col-lg-5 col-xl-3 animate__animated animate__fadeInRight">
        <div class="carousel-header-banner h-100 position-relative">
          <img src="/images/crs-ip17-right.jpg" class="img-fluid w-100 h-100" alt="Image" />
          <div class="carousel-banner-offer position-absolute top-0 start-0 m-3">
            <img src="/images/Logo.png" alt="Logo" height="40" width="120" />
          </div>
          <div class="carousel-banner position-absolute bottom-0 start-0 end-0 text-center p-4 bg-opacity-75">
            <a href="#" class="d-block mb-2 text-white">iPhone</a>
            <p class="d-block text-white fs-3">iPhone 17 Promax <br />Giá từ</p>
            <div class="mt-2">
              <span class="me-2 text-white fs-5">35.000.000VNĐ -</span>
              <span class="me-2 text-white fs-5">80.000.000VNĐ</span>
            </div>
            <a href="#" class="btn btn-primary rounded-pill py-2 px-4 mt-3">
              <i class="bi bi-cart3 me-2"></i> Mua sản phẩm
            </a>
          </div>
        </div>
      </div>
    </div>
</template>
