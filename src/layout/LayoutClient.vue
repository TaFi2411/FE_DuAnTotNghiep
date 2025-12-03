<script setup>
import { ref } from 'vue'; // 1. Import ref
import { RouterView } from 'vue-router';

import HeaderClient from '@/components/client/HeaderClient.vue';
import FooterClient from '@/components/client/FooterClient.vue';
import ChatBox from '@/components/AI/ChatBox.vue';
import LuckyWheel from '@/components/AI/LuckyWheel.vue';


const isWheelVisible = ref(false);


const handleVoucherWon = (prize) => {
  console.log('User trúng:', prize);
  
};
</script>

<template>
  <div class="nen">
    <HeaderClient />
    
    <div class="content">
      <RouterView />
      
      <div>
         <ChatBox />
      
      <LuckyWheel 
        v-model:showWheel="isWheelVisible"
        @voucherWon="handleVoucherWon"
      />
      </div>
     

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