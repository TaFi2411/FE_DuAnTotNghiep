<template>
  <div class="home-page bg-white text-dark">
    <HeroCarousel />
    <BannerSection />
    <FlashSale/>
    <CategorySection />
    <ProductSection />
    <ProductCategory/>
  </div>
</template>

<script setup>
import HeroCarousel from './HeroCarousel.vue'
import FlashSale from './FlashSale.vue'
import CategorySection from './CategorySection.vue'
import BannerSection from './BannerSection.vue'
import ProductSection from './ProductFeature.vue'
import ProductCategory from './ProductCategory.vue'

</script>

<style scoped>
.home-page {
  font-family: 'Poppins', sans-serif;
}
</style>
