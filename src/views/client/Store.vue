<template>
  <div class="store-page  text-dark min-vh-100">
    

    <!-- Video Banner -->
    <section class="banner-section position-relative overflow-hidden">
      <video autoplay muted loop playsinline class="w-100 h-100 object-fit-cover">
        <source src="/images/banner-iphone.mp4" type="video/mp4" />
      </video>
      <div
        class="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center"
      >
        <h2 class="fw-bold mb-3">Khám phá sản phẩm Apple mới nhất</h2>
        <p class="mb-4 fs-6">
          Trải nghiệm công nghệ đỉnh cao cùng iPhone, iPad, MacBook và hơn thế nữa.
        </p>
        <button class="btn btn-primary px-4 py-2 rounded-pill fw-semibold">
          Mua ngay
        </button>
      </div>
    </section>
<!-- Navbar -->
    <nav class="navbar navbar-expand-lg bg-none">
      <div class="container mt-3 mb-1">
        <button
          class="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          class="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul
            class="navbar-nav category-nav text-uppercase fw-semibold small rounded-pill px-3 py-2"
          >
            <li class="nav-item"><a class="nav-link" href="#">iPhone</a></li>
            <li class="nav-item"><a class="nav-link" href="#">iPad</a></li>
            <li class="nav-item"><a class="nav-link" href="#">MacBook</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Watch</a></li>
            <li class="nav-item"><a class="nav-link" href="#">iPod</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- Filter Buttons -->
    <div class="container py-5">
      <div class="d-flex flex-wrap justify-content-center gap-2 mb-5">
        <button class="btn btn-outline-primary btn-sm active">iPhone 17 Series</button>
        <button class="btn btn-outline-primary btn-sm">iPhone 16 Series</button>
        <button class="btn btn-outline-primary btn-sm">iPhone 15 Series</button>
        <button class="btn btn-outline-primary btn-sm">iPhone 14 Series</button>
        <button class="btn btn-outline-primary btn-sm">iPhone 13 Series</button>
      </div>

      <!-- Product Grid -->
      <div class="row g-4">
        <!-- Sản phẩm 1 -->
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div
            class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-decoration-none text-dark text-center p-3"
          >
            <img
              src="/images/crs-ip17-air.png"
              class="m-auto mt-2 card-img-top h-75 w-75"
              alt="Sản phẩm"
            />
            <div class="card-body text-center">
              <h5 class="card-title fw-bold mb-2">iPhone 17 Pro Max</h5>

              <!-- Nút dung lượng -->
              <div class="mb-3 d-flex justify-content-center gap-2 flex-wrap">
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3">
                  128GB
                </button>
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3">
                  256GB
                </button>
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3">
                  512GB
                </button>
              </div>

              <p class="text-muted mb-1">Giá chỉ từ</p>
              <p class="text-primary fw-bold fs-5 mb-3">35.000.000 VNĐ</p>
              <router-link
                to="/san-pham/1"
                class="btn btn-primary rounded-pill px-4 py-2"
              >
                Mua ngay
              </router-link>
            </div>
          </div>
        </div>

        <!-- Thêm các sản phẩm khác -->
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3" v-for="n in 4" :key="n">
          <div
            class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-decoration-none text-dark text-center p-3"
          >
            <img
              src="/images/crs-ip17-air.png"
              class="m-auto mt-2 card-img-top h-75 w-75"
              alt="Sản phẩm"
            />
            <div class="card-body text-center">
              <h5 class="card-title fw-bold mb-2">iPhone 17 Promax</h5>
              <div class="mb-3 d-flex justify-content-center gap-2 flex-wrap">
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3">
                  128GB
                </button>
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3">
                  256GB
                </button>
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3">
                  512GB
                </button>
              </div>
              <p class="text-muted mb-1">Giá chỉ từ</p>
              <p class="text-primary fw-bold fs-5 mb-3">35.000.000 VNĐ</p>
              <router-link
                :to="`/san-pham/${n}`"
                class="btn btn-primary rounded-pill px-4 py-2"
              >
                Mua ngay
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// chưa cần backend
</script>

<style scoped>
/* ===== Navbar danh mục ===== */
.category-nav {
  gap: 60px;
  background-color: #000000;
}

.category-nav .nav-link {
  color: #ffffff !important;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.category-nav .nav-link:hover {
  background-color: #0d6efd;
  color: #fff !important;
}

/* ===== Banner video ===== */
.banner-section {
  height: 500px;
  position: relative;
}

.banner-section video {
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.banner-overlay {
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
}

/* ===== Product card ===== */
.product-card img {
  transition: transform 0.4s ease, box-shadow 0.3s ease;
}

.product-card:hover img {
  transform: scale(1.05);
  box-shadow: 0 4px 25px rgba(13, 110, 253, 0.3);
}

/* ===== Active button ===== */
.btn-outline-primary.active {
  background: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .banner-section {
    height: 320px;
  }

  .banner-overlay h2 {
    font-size: 1.25rem;
  }

  .banner-overlay p {
    font-size: 0.9rem;
  }
}
</style>
