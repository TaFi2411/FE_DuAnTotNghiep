<template>
  <HomeIndex />
</template>

<script setup>
import HomeIndex from '@/components/HomeProduct/HomeIndex.vue'
console.log(import.meta.env.VITE_API_URL);
console.log("Token FE:", localStorage.getItem("token"));


</script>
