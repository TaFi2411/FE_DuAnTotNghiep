<script >
import Header from '@/components/Client/HeaderClient.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Header /> <!-- Header cố định luôn hiển thị -->

  <!-- Bọc nội dung RouterView vào div và thêm padding-top -->
  <div class="main-content">
    <RouterView />
  </div>
</template>

<style>
.main-content {
  padding-top: 50px; /* Điều chỉnh theo chiều cao thật của Header */
  font-family: 'Montserrat', sans-serif;
  line-height: 1.6;
  letter-spacing: 0.3px;
  color: #000000; /* màu chữ đậm hơn */
}


</style>



