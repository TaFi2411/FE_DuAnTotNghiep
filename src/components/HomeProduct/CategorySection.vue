<template>
  <div class="container py-5 category-section">
    <div class="text-center mb-5">
      <h4 class="fw-bold text-uppercase text-dark mb-2">Danh mục sản phẩm</h4>
      <p class="text-muted mb-0">Khám phá các dòng sản phẩm nổi bật của chúng tôi</p>
    </div>

    <div class="row g-4 justify-content-center text-center">
      <div
        v-for="(item, index) in categories"
        :key="index"
        class="col-6 col-md-4 col-lg-2"
      >
        <div class="category-card p-4 rounded-4 h-100 d-flex flex-column align-items-center justify-content-between">
          <img :src="item.img" :alt="item.name" class="img-fluid mb-3" />
          <h5 class="fw-semibold mb-0">{{ item.name }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { name: "iPhone", img: "/images/crs-ip17-air.png" },
  { name: "MacBook", img: "/images/ctg-macbook.png" },
  { name: "AirPods", img: "/images/ctg-ipod.png" },
  { name: "iPad", img: "/images/ctg-ipad.png" },
  { name: "Watch", img: "/images/ctg-watch.png" },
];
</script>

<style scoped>
.category-section {
  background-color: #fff;
  border-radius: 20px;
}

.category-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.category-card:hover {
  transform: translateY(-6px);
  border-color: #000;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.category-card img {
  width: 100%;
  max-height: 110px;
  object-fit: contain;
  transition: filter 0.3s ease;
}

.category-card:hover img {
  filter: grayscale(0%);
}

.category-card h5 {
  font-size: 1rem;
  color: #000;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.category-card:hover h5 {
  color: #000;
  font-weight: 600;
}

@media (max-width: 576px) {
  .category-card {
    padding: 1.5rem 0.75rem;
  }
  .category-card img {
    max-height: 90px;
  }
}
</style>
