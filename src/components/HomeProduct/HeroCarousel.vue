<template>
  <div class="row g-0 justify-content-end align-items-stretch bg-black" >

    <!-- Carousel bên trái -->
    <div class="col-12 col-lg-7 col-xl-9 bg-dark">
      <div id="mainCarousel" class="carousel slide h-100" data-bs-ride="carousel">
        <div class="carousel-inner h-100">

          <!-- Dùng v-for -->
          <div
            class="carousel-item h-100"
            v-for="(item, index) in carouselItems"
            :class="{ active: index === 0 }"
            :key="index"
          >
            <div class="row g-0 align-items-center h-100">

              <!-- Hình -->
              <div class="col-xl-6 carousel-img animate__animated animate__fadeInLeft h-100">
                <img :src="item.image"
                     class="img-fluid w-100 h-100 object-fit-contain"
                     alt="Image" />
              </div>

              <!-- Nội dung -->
              <div class="col-xl-6 carousel-content p-4 text-white animate__animated animate__fadeInRight">
                <h4 class="text-uppercase fw-bold mb-4" style="letter-spacing: 3px;">{{ item.title }}</h4>
                <h1 class="display-5 text-capitalize mb-4" v-html="item.description"></h1>
                <p>{{ item.subtext }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Controls -->
        <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>

    <!-- Banner bên phải -->
    <div class="col-12 col-lg-5 col-xl-3 h-100 animate__animated animate__fadeInRight">
      <div class="carousel-header-banner h-100 position-relative">

        <!-- Video -->
        <video :src="rightBanner.video"
               class="img-fluid w-100 h-100 object-fit-cover"
               autoplay muted loop playsinline>
        </video>

        <div class="carousel-banner-offer position-absolute top-0 start-0 m-3">
          <img :src="rightBanner.logo" alt="Logo" height="40" width="120" />
        </div>

        <div class="carousel-banner position-absolute bottom-0 start-0 end-0 text-center p-4 bg-opacity-75">
          
          <p class="d-block text-white fs-3" v-html="rightBanner.name"></p>
          <div class="text-nowrap">
            <span class="me-2 text-white fs-5">{{ rightBanner.minPrice }} -</span>
            <span class="me-2 text-white fs-5">{{ rightBanner.maxPrice }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
const carouselItems = [
  {
    title: "iPhone 17 Promax",
    description: "Vỏ nguyên khối.<br/>Tạo nên một tổng thể mạnh vô đối.",
    subtext: "Nhanh tay mua ngay",
    image: "/images/crs-ip17-banner.png",
  },
  {
    title: "iPhone Air",
    description: "iPhone mỏng nhất.<br/>Với sức mạnh pro bên trong.",
    subtext: "Nhanh tay mua ngay",
    image: "/images/crs-ip17-air.png",
  }
];

const rightBanner = {
  video: "/images/banner_home.mp4",
  logo: "/images/Logo.png",
  name: "iPhone 17 Promax <br />Giá từ",
  minPrice: "35.000.000VNĐ",
  maxPrice: "80.000.000VNĐ",
};
</script>
