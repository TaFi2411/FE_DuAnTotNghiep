<script setup>
import { RouterView } from 'vue-router';

import HeaderClient from '@/components/client/HeaderClient.vue';
import FooterClient from '@/components/client/FooterClient.vue';


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

  position: relative; 
  min-height: 80vh;
  
}
</style>