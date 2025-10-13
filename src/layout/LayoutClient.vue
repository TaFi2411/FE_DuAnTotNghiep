<script setup>

import HeaderClient from '@/components/client/HeaderClient.vue';
import FooterClient from '@/components/client/FooterClient.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="nen">
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