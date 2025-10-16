<template>
  <div class="container-fluid carousel bg-none px-0">
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
  </div>
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


    <!-- ====== FLASH SALE ====== -->
    <div class="container-fluid py-5 flashsale-section">
      <div class="flash-sale-section py-5 rounded-4 shadow-sm p-5">
        <!-- Tiêu đề + đồng hồ -->
        <div class="text-center mb-4 text-white">
          <h4 class="fw-bold mb-2">🔥 FLASH SALE - GIẢM GIÁ SỐC 🔥</h4>
          <div class="countdown fw-semibold fs-5">
            Kết thúc sau:
            <span class="text-warning">12</span> :
            <span class="text-warning">00</span> :
            <span class="text-warning">00</span>
          </div>
        </div>

        <!-- Swiper -->
        <swiper :modules="[Navigation, Autoplay]" navigation loop
          :autoplay="{ delay: 2500, disableOnInteraction: false }" :slides-per-view="4" :space-between="20"
          :breakpoints="{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
          }" class="py-3">
          <swiper-slide v-for="n in 8" :key="n">
            <div class="flash-card rounded-4 text-center p-3 h-100">
              <div class="position-relative">
                <img src="/images/crs-ip17-air.png" class="img-fluid rounded-3 mb-3" />
                <div v-if="n === 3" class="sold-out position-absolute top-50 start-50 translate-middle">
                  CHÁY SUẤT
                </div>
              </div>

              <h6 class="fw-semibold mb-2 text-white">iPhone 17 Promax</h6>
              <h5 class="text-warning fw-bold mb-1">35.000.000₫</h5>
              <p class="text-primary mb-2 text-decoration-line-through ">39.000.000₫</p>

              <div class="progress-container mt-auto">
                <div class="progress rounded-pill" style="height: 20px;">
                  <div class="progress-bar bg-warning fw-semibold text-dark" role="progressbar"
                    :style="{ width: `${sold / total * 100}%` }" aria-valuenow="sold" aria-valuemin="0"
                    aria-valuemax="total">
                    🔥 Đã bán {{ sold }}/{{ total }}
                  </div>
                </div>
              </div>


              <!-- Nút mua -->
              <router-link :to="`/san-pham/${n}`" class="btn btn-primary rounded-pill px-4 py-2 mt-3">
                <i class="bi bi-cart3 me-2"></i> Mua sản phẩm
              </router-link>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>


    <!-- ====== DANH MỤC SẢN PHẨM ====== -->
<div class="container py-5 category-section">
  <div class="text-center mb-4">
    <h4 class="fw-bold text-primary text-uppercase">Danh mục sản phẩm</h4>
    <p class="text-muted mb-0">Khám phá tất cả các dòng sản phẩm nổi bật của chúng tôi</p>
  </div>

  <div class="row g-4 justify-content-center text-center">
    <!-- Category Item -->
    <div class="col-6 col-md-4 col-lg-2">
      <div class="category-card p-3 rounded-4 h-100 d-flex flex-column align-items-center justify-content-between shadow-sm">
        <img src="/images/crs-ip17-air.png" alt="iPhone" class="img-fluid mb-3" style="height:100px; object-fit:contain;" />
        <h5 class="fw-semibold text-dark mb-0">iPhone</h5>
      </div>
    </div>

    <div class="col-6 col-md-4 col-lg-2">
      <div class="category-card p-3 rounded-4 h-100 d-flex flex-column align-items-center justify-content-between shadow-sm">
        <img src="/images/ctg-macbook.png" alt="MacBook" class="img-fluid mb-3" style="height:100px; object-fit:contain;" />
        <h5 class="fw-semibold text-dark mb-0">MacBook</h5>
      </div>
    </div>

    <div class="col-6 col-md-4 col-lg-2">
      <div class="category-card p-3 rounded-4 h-100 d-flex flex-column align-items-center justify-content-between shadow-sm">
        <img src="/images/ctg-ipod.png" alt="AirPods" class="img-fluid mb-3" style="height:100px; object-fit:contain;" />
        <h5 class="fw-semibold text-dark mb-0">AirPods</h5>
      </div>
    </div>

    <div class="col-6 col-md-4 col-lg-2">
      <div class="category-card p-3 rounded-4 h-100 d-flex flex-column align-items-center justify-content-between shadow-sm">
        <img src="/images/ctg-ipad.png" alt="iPad" class="img-fluid mb-3" style="height:100px; object-fit:contain;" />
        <h5 class="fw-semibold text-dark mb-0">iPad</h5>
      </div>
    </div>

    <div class="col-6 col-md-4 col-lg-2">
      <div class="category-card p-3 rounded-4 h-100 d-flex flex-column align-items-center justify-content-between shadow-sm">
        <img src="/images/ctg-watch.png" alt="iPad" class="img-fluid mb-3" style="height:100px; object-fit:contain;" />
        <h5 class="fw-semibold text-dark mb-0">Watch</h5>
      </div>
    </div>


  </div>
</div>



   <!-- ====== Sản phẩm nổi bật ====== -->
<div class="container py-5">
  <div class="text-center mb-4">
    <h5 class="text-uppercase text-primary fw-bold">Sản phẩm của chúng tôi</h5>
    <h2 class="fw-bold">Khám phá các dòng sản phẩm nổi bật</h2>
  </div>

  <div class="d-flex justify-content-center mb-4">
    <button class="btn btn-outline-primary mx-2 active">Tất cả sản phẩm</button>
    <button class="btn btn-outline-primary mx-2">Hàng mới về</button>
    <button class="btn btn-outline-primary mx-2">Nổi bật</button>
    <button class="btn btn-outline-primary mx-2">Bán chạy nhất</button>
  </div>

  <swiper
  
    :modules="[Navigation, Autoplay]"
    navigation
    loop
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
    :slides-per-view="4"
    :space-between="20"
    :breakpoints="{
      320: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }"
    class="py-3 product-swiper"
  >
    <swiper-slide v-for="n in 8" :key="n">
      <div class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-decoration-none text-dark text-center p-3">
        <img src="/images/crs-ip17-air.png" class="m-auto mt-2 card-img-top h-75 w-75" alt="Sản phẩm" />
        <div class="card-body text-center">
          <h5 class="card-title fw-bold mb-2">iPhone 17 Promax</h5>
          <p class="text-muted mb-1">Giá chỉ từ</p>
          <p class="text-primary fw-bold fs-5 mb-3">35.000.000 VNĐ</p>
          <router-link :to="`/san-pham/${n}`" class="btn btn-primary rounded-pill px-4 py-2">
            Mua ngay
          </router-link>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</div>


    <!-- ====== Phần 2: Hai ô banner giảm giá ====== -->
    <div class="container pb-5">
      <div class="row g-4">

        <div class="col-md-6">
          <div class="position-relative overflow-hidden rounded-4 shadow-sm">
            <video class="w-100" autoplay loop muted playsinline>
              <source src="/images/banner-ipod.mp4" type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
            <div
              class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start text-white ps-4"
              style="background: rgba(0,0,0,0.4);">
              <h4 class="fw-bold">AirPods</h4>
              <p class="fs-5 mb-2">Đẹp biểu tượng. <br> Hay phi thường.</p>
              <a href="#" class="btn btn-light rounded-pill px-4 py-2">Mua ngay</a>
            </div>
          </div>
        </div>


        <div class="col-md-6">
          <div class="position-relative overflow-hidden rounded-4 shadow-sm">
            <video class="w-100" autoplay loop muted playsinline>
              <source src="/images/banner-macbook.mp4" type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
            <div
              class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start text-white ps-4"
              style="background: rgba(0,0,0,0.4);">
              <h4 class="fw-bold">MacBook</h4>
              <p class="fs-5 mb-2">Bạn nghĩ được là Macbook làm được.</p>
              <a href="#" class="btn btn-light rounded-pill px-4 py-2">Mua ngay</a>
            </div>
          </div>
        </div>
      </div>
    </div>


<!-- ====== SẢN PHẨM THEO TỪNG LOẠI ====== -->
<!-- iPhone -->
<div class="container py-5">
  <div class="text-center mb-4">
    <h5 class="text-uppercase text-primary fw-bold">Sản phẩm iPhone</h5>
    <h2 class="fw-bold">Khám phá iPhone mới nhất</h2>
  </div>
<div class="container-fluid category-banner mb-5">
  <div class="position-relative rounded-4 overflow-hidden">
    <img src="/images/banner-home-iphone.png" alt="iPhone Banner" class="w-100 rounded-4" />
    <div class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center overlay-bg">
      <h2 class="fw-bold mb-2">iPhone Series</h2>
      <p class="fs-5 mb-3">Hiệu năng vượt trội. Thiết kế đột phá.</p>
      <a href="#" class="btn btn-light rounded-pill px-4 py-2">Khám phá ngay</a>
    </div>
  </div>
</div>
  <swiper
    :modules="[Navigation, Autoplay]"
    navigation
    loop
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
    :slides-per-view="4"
    :space-between="20"
    :breakpoints="{
      320: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }"
    class="py-3 product-swiper"
  >
    <swiper-slide v-for="n in 6" :key="`iphone-${n}`">
      <div class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-center p-3">
        <img src="/images/crs-ip17-air.png" class="m-auto mt-2 card-img-top h-75 w-75" alt="iPhone" />
        <div class="card-body">
          <h5 class="fw-bold mb-2">iPhone 17 Pro Max</h5>
          <p class="text-muted mb-1">Giá chỉ từ</p>
          <p class="text-primary fw-bold fs-5 mb-3">35.000.000 VNĐ</p>
          <router-link :to="`/san-pham/iphone-${n}`" class="btn btn-primary rounded-pill px-4 py-2">
            Mua ngay
          </router-link>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</div>


<!-- MacBook -->
<div class="container py-5">
  <div class="text-center mb-4">
    <h5 class="text-uppercase text-primary fw-bold">Sản phẩm MacBook</h5>
    <h2 class="fw-bold">Hiệu năng mạnh mẽ cho công việc sáng tạo</h2>
  </div>
<!-- ===== BANNER MACBOOK ===== -->
<!-- ===== BANNER AIRPODS ===== -->
<div class="container-fluid category-banner mb-5">
  <div class="position-relative rounded-4 overflow-hidden">
    <img src="/images/banner-home-ipod.png" alt="AirPods Banner" class="w-100 rounded-4" />
    <div class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center overlay-bg">
      <h2 class="fw-bold mb-2">AirPods</h2>
      <p class="fs-5 mb-3">Âm thanh sống động, đắm chìm.</p>
      <a href="#" class="btn btn-light rounded-pill px-4 py-2">Khám phá ngay</a>
    </div>
  </div>
</div>
  <swiper
    :modules="[Navigation, Autoplay]"
    navigation
    loop
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
    :slides-per-view="4"
    :space-between="20"
    :breakpoints="{
      320: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }"
    class="py-3 product-swiper"
  >
   <swiper-slide v-for="product in macBooks" :key="product.id">
    
      <div
        class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-center p-3"
      >
        <img
          :src="product.image"
          class="m-auto mt-2 card-img-top h-75 w-75"
          :alt="product.name"
        />
        <div class="card-body">
          <h5 class="fw-bold mb-2">{{ product.name }}</h5>
       
          <router-link
            :to="`/san-pham/${product.id}`"
            class="btn btn-primary rounded-pill px-4 py-2"
          >
            Mua ngay
          </router-link>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</div>


<!-- iPad -->
<div class="container py-5">
  <div class="text-center mb-4">
    <h5 class="text-uppercase text-primary fw-bold">Sản phẩm iPad</h5>
    <h2 class="fw-bold">Sức mạnh. Linh hoạt. Đẳng cấp.</h2>
  </div>
<!-- ===== BANNER AIRPODS ===== -->
<div class="container-fluid category-banner mb-5">
  <div class="position-relative rounded-4 overflow-hidden">
    <img src="/images/banner-home-ipod.png" alt="AirPods Banner" class="w-100 rounded-4" />
    <div class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center overlay-bg">
      <h2 class="fw-bold mb-2">AirPods</h2>
      <p class="fs-5 mb-3">Âm thanh sống động, đắm chìm.</p>
      <a href="#" class="btn btn-light rounded-pill px-4 py-2">Khám phá ngay</a>
    </div>
  </div>
</div>
  <swiper
    :modules="[Navigation, Autoplay]"
    navigation
    loop
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
    :slides-per-view="4"
    :space-between="20"
    :breakpoints="{
      320: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }"
    class="py-3 product-swiper"
  >
   <swiper-slide v-for="product in ipads" :key="product.id">
    
      <div
        class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-center p-3"
      >
        <img
          :src="product.image"
          class="m-auto mt-2 card-img-top h-75 w-75"
          :alt="product.name"
        />
        <div class="card-body">
          <h5 class="fw-bold mb-2">{{ product.name }}</h5>
       
          <router-link
            :to="`/san-pham/${product.id}`"
            class="btn btn-primary rounded-pill px-4 py-2"
          >
            Mua ngay
          </router-link>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</div>


<!-- Watch -->
<div class="container py-5">
  <div class="text-center mb-4">
    <h5 class="text-uppercase text-primary fw-bold">Sản phẩm Apple Watch</h5>
    <h2 class="fw-bold">Đồng hành cùng sức khỏe mỗi ngày</h2>
  </div>
<!-- ===== BANNER AIRPODS ===== -->
<div class="container-fluid category-banner mb-5">
  <div class="position-relative rounded-4 overflow-hidden">
    <img src="/images/banner-home-ipod.png" alt="AirPods Banner" class="w-100 rounded-4" />
    <div class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center overlay-bg">
      <h2 class="fw-bold mb-2">AirPods</h2>
      <p class="fs-5 mb-3">Âm thanh sống động, đắm chìm.</p>
      <a href="#" class="btn btn-light rounded-pill px-4 py-2">Khám phá ngay</a>
    </div>
  </div>
</div>
  <swiper
    :modules="[Navigation, Autoplay]"
    navigation
    loop
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
    :slides-per-view="4"
    :space-between="20"
    :breakpoints="{
      320: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }"
    class="py-3 product-swiper"
  >
   <swiper-slide v-for="product in watches" :key="product.id">
    
      <div
        class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-center p-3"
      >
        <img
          :src="product.image"
          class="m-auto mt-2 card-img-top h-75 w-75"
          :alt="product.name"
        />
        <div class="card-body">
          <h5 class="fw-bold mb-2">{{ product.name }}</h5>
       
          <router-link
            :to="`/san-pham/${product.id}`"
            class="btn btn-primary rounded-pill px-4 py-2"
          >
            Mua ngay
          </router-link>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</div>




<!-- AirPods -->
<div class="container py-5">
  <div class="text-center mb-4">
    <h5 class="text-uppercase text-primary fw-bold">Sản phẩm AirPods</h5>
    <h2 class="fw-bold">Nghe nhạc theo cách chuyên nghiệp</h2>
  </div>

<!-- ===== BANNER AIRPODS ===== -->
<div class="container-fluid category-banner mb-5">
  <div class="position-relative rounded-4 overflow-hidden">
    <img src="/images/banner-home-ipod.png" alt="AirPods Banner" class="w-100 rounded-4" />
    <div class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center overlay-bg">
      <h2 class="fw-bold mb-2">AirPods</h2>
      <p class="fs-5 mb-3">Âm thanh sống động, đắm chìm.</p>
      <a href="#" class="btn btn-light rounded-pill px-4 py-2">Khám phá ngay</a>
    </div>
  </div>
</div>
  <swiper
    :modules="[Navigation, Autoplay]"
    navigation
    loop
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
    :slides-per-view="4"
    :space-between="20"
    :breakpoints="{
      320: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }"
    class="py-3 product-swiper"
  >
   <swiper-slide v-for="product in phones" :key="product.id">
    
      <div
        class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-center p-3"
      >
        <img
          :src="product.image"
          class="m-auto mt-2 card-img-top h-75 w-75"
          :alt="product.name"
        />
        <div class="card-body">
          <h5 class="fw-bold mb-2">{{ product.name }}</h5>
       
          <router-link
            :to="`/san-pham/${product.id}`"
            class="btn btn-primary rounded-pill px-4 py-2"
          >
            Mua ngay
          </router-link>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</div>


</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Khai báo biến lưu danh sách điện thoại
const phones = ref([]);

// Khi component được mount
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/product");

    console.log("Dữ liệu API:", res.data);

    // Kiểm tra nếu có dữ liệu trong res.data.data
    if (res.data && res.data.data) {
      // Lọc ra các sản phẩm có categoryName chứa chữ "điện thoại"
      phones.value = res.data.data.filter(
        (p) =>
          p.categoryName &&
          p.categoryName.toLowerCase().includes("điện thoại")
      );
    } else {
      console.warn("Không có dữ liệu sản phẩm trong phản hồi API.");
      phones.value = [];
    }

    console.log("Sản phẩm điện thoại:", phones.value);
  } catch (err) {
    console.error("Lỗi tải sản phẩm điện thoại:", err);
  }
});


// Khai báo biến lưu danh sách Apple Watch
const watches = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/product");

    console.log("Dữ liệu API:", res.data);

    // Kiểm tra nếu có dữ liệu trong res.data.data
    if (res.data && res.data.data) {
      // Lọc ra sản phẩm có categoryName chứa "apple watch"
      watches.value = res.data.data.filter(
        (p) =>
          p.categoryName &&
          p.categoryName.toLowerCase().includes("apple watch")
      );
    } else {
      console.warn("Không có dữ liệu sản phẩm trong phản hồi API.");
      watches.value = [];
    }

    console.log("Sản phẩm Apple Watch:", watches.value);
  } catch (err) {
    console.error("Lỗi tải sản phẩm Apple Watch:", err);
  }
});


// Khai báo biến lưu danh sách iPad
const ipads = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/product");

    console.log("Dữ liệu API:", res.data);

    // Kiểm tra nếu có dữ liệu trong res.data.data
    if (res.data && res.data.data) {
      // Lọc ra sản phẩm có categoryName chứa "ipad"
      ipads.value = res.data.data.filter(
        (p) =>
          p.categoryName &&
          p.categoryName.toLowerCase().includes("ipad")
      );
    } else {
      console.warn("Không có dữ liệu sản phẩm trong phản hồi API.");
      ipads.value = [];
    }

    console.log("Sản phẩm iPad:", ipads.value);
  } catch (err) {
    console.error("Lỗi tải sản phẩm iPad:", err);
  }
});



// Khai báo biến lưu danh sách iPad
const macBooks = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/product");

    console.log("Dữ liệu API:", res.data);

    // Kiểm tra nếu có dữ liệu trong res.data.data
    if (res.data && res.data.data) {
      // Lọc ra sản phẩm có categoryName chứa "ipad"
      macBooks.value = res.data.data.filter(
        (p) =>
          p.categoryName &&
          p.categoryName.toLowerCase().includes("macbook")
      );
    } else {
      console.warn("Không có dữ liệu sản phẩm trong phản hồi API.");
      macBooks.value = [];
    }

    console.log("Sản phẩm iPad:", macBooks.value);
  } catch (err) {
    console.error("Lỗi tải sản phẩm iPad:", err);
  }
});

</script>


<style scoped>





.carousel-header-banner {
  position: relative;
  overflow: hidden;
}

.carousel-banner-offer {
  z-index: 2;
}

.carousel-banner {
  z-index: 2;
}

.carousel-banner a {
  text-decoration: none;
}

.carousel-banner a:hover {
  color: var(--bs-primary);
}


.feature-card {
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(13, 110, 253, 0.15);
  border-color: var(--bs-primary);
}

.feature-card i {
  color: var(--bs-primary);
  transition: all 0.3s ease;
}

.feature-card:hover i {
  color: #ffb703;
  text-shadow: 0 0 15px rgba(255, 183, 3, 0.7);
}

.feature-card h6 {
  color: #212529;
  font-size: 1rem;
}

/* Mobile responsive */
@media (max-width: 576px) {
  .feature-card {
    padding: 1.2rem 0.5rem;
  }

  .feature-card i {
    font-size: 1.7rem;
  }
}



/* ====== HIỆU ỨNG HOVER ====== */

/* Hiệu ứng cho card sản phẩm */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card img {
  transition: transform 0.3s ease;
}

.card:hover img {
  transform: scale(1.05);
}

/* Hiệu ứng cho nút lọc sản phẩm */
.btn-outline-primary {
  transition: all 0.3s ease;
}

.btn-outline-primary.active,
.btn-outline-primary:hover {
  background-color: var(--bs-primary);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

/* Hiệu ứng hover cho video banner */
.position-relative video {
  transition: transform 0.5s ease;
}

.position-relative:hover video {
  transform: scale(1.05);
}

.position-relative .btn {
  transition: all 0.3s ease;
}

.position-relative:hover .btn {
  background-color: var(--bs-primary);
  color: #fff;
  transform: scale(1.05);
}

/* Flash Sale */
.flash-sale-section {
  background: radial-gradient(120% 120% at 50% 90%, #000000 35%, #ff4500 70%, #ff7b00 100%);
  position: relative;
}

.flash-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.flash-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

/* Card flash sale */
.flash-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 90, 0, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.flash-card:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 25px rgba(255, 140, 0, 0.7);
}

/* Nút và chữ trong flash sale */
.flash-sale-section .btn-primary {
  background: linear-gradient(90deg, #ff4500, #ffb300);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(255, 90, 0, 0.5);
  transition: all 0.3s ease;
}

.flash-sale-section .btn-primary:hover {
  background: linear-gradient(90deg, #ffb300, #ff4500);
  box-shadow: 0 0 30px rgba(255, 150, 0, 0.8);
  transform: scale(1.05);
}


.sold-out {
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-weight: bold;
  padding: 8px 20px;
  border-radius: 30px;
}



/* ===== DANH MỤC SẢN PHẨM ===== */
.category-section {
  border-radius: 20px;
  padding: 60px 0;
}

.category-card {
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.103);
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-8px);
  background: linear-gradient(145deg, #e0f7ff, #4ea3ff);
  box-shadow: 0 10px 20px rgba(97, 174, 255, 0.4);
  border: none;
}

.category-card img {
  width: 100%;
  height: auto;
  max-height: 130px;
  object-fit: contain;
}

.category-card h6 {
  color: #fff;
  font-size: 1rem;
}

@media (max-width: 576px) {
  .category-card {
    padding: 1.5rem 0.5rem;
  }

  .category-card img {
    max-height: 100px;
  }
}

/* Highlight */
.highlight-item {
  transition: all 0.3s ease;
}

.highlight-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
}


/* Nếu bạn đang dùng <style scoped>, hãy thêm deep selector */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: rgb(255, 255, 255) !important;
  background-color: rgb(0, 0, 0);
  width: 60px;
  height: 60px;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background-color: rgb(255, 255, 255);
  color: black !important;
 
  transform: scale(1);
}

/* Tùy chọn: tăng kích thước mũi tên */
:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 10px;
  font-weight: bold;
}










.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.product-img {
  width: 100%;
  height: 250px; /* chỉnh tùy ý: 200–300px */
  object-fit: cover; /* cắt ảnh cho đều, không méo */
  border-radius: 10px;
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.swiper-slide {
  height: auto !important;
  display: flex;
  align-items: stretch;
}




</style>
