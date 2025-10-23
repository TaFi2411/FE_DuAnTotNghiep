<template>
  <div class="container py-5" v-if="products?.length">


    <Swiper
      :modules="[Navigation, Autoplay]"
      navigation
      :loop="products.length > slidesPerView"
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
      <SwiperSlide
        v-for="product in products"
        :key="product.id"
      >
        <div class="card product-card h-100 border-1 shadow-sm rounded-4 overflow-hidden text-center p-3">
          
          <img
            :src="product.image"
            class="m-auto mt-2 card-img-top h-75 w-75"
            :alt="product.name"
          />

          <div class="card-body">
            <h5 class="fw-bold mb-2">{{ product.name }}</h5>
            <p class="text-muted mb-1">Giá chỉ từ</p>
            <p class="text-primary fw-bold fs-5 mb-3">
              {{ formatPrice(product.skus?.[0]?.price) }}
            </p>

            <router-link
              :to="`/product/${product.id}`"
              class="btn btn-primary rounded-pill px-4 py-2"
            >
              Mua ngay
            </router-link>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>

  <!-- Empty -->
  <div v-else class="py-5 text-center text-muted">Không có sản phẩm.</div>
</template>


<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const props = defineProps({
  products: { type: Array, required: true },
  title: { type: String, default: "Sản phẩm" },
  subtitle: { type: String, default: "Danh sách sản phẩm nổi bật" },
  banner: { type: String, default: null },
  bannerTitle: { type: String, default: "" },
  bannerDesc: { type: String, default: "" },
  bannerLink: { type: String, default: "#" }
});

const formatPrice = (value) => {
  if (!value) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
};
</script>

<style scoped>
.overlay-bg {
  background: rgba(0,0,0,0.3);
  color: #fff;
}
</style>
