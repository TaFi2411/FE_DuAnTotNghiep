<script setup>

import HeaderClient from '@/components/Client/HeaderClient.vue';
import FooterClient from '@/components/Client/FooterClient.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div>
    <HeaderClient />
    <div class="content">
      <RouterView />
    </div>
    <FooterClient />
  </div>
</template>

<style scoped>
.content{
  margin-top: 60px;
}
</style>