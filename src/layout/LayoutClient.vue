<script setup>
import { ref } from 'vue'; // 1. Import ref
import { RouterView } from 'vue-router';

import HeaderClient from '@/components/client/HeaderClient.vue';
import FooterClient from '@/components/client/FooterClient.vue';
import ChatBox from '@/components/AI/ChatBox.vue';
import LuckyWheel from '@/components/AI/LuckyWheel.vue';

// 2. Tạo biến quản lý trạng thái hiển thị vòng quay
const isWheelVisible = ref(false);

// 3. Hàm xử lý khi người dùng quay trúng thưởng (Option)
const handleVoucherWon = (prize) => {
  console.log('User trúng:', prize);
  // Có thể thêm thông báo hoặc gọi API lưu voucher vào đây
  // alert(`Chúc mừng bạn nhận được: ${prize.label}`);
};
</script>

<template>
  <div class="nen">
    <HeaderClient />
    
    <div class="content">
      <RouterView />
      
      <ChatBox />
      
      <LuckyWheel 
        v-model:showWheel="isWheelVisible"
        @voucherWon="handleVoucherWon"
      />

    </div>
    
    <FooterClient />
  </div>
</template>

<style scoped>
.content{
  margin-top: 60px;
  /* Đảm bảo content là relative để các thành phần fixed định vị chuẩn */
  position: relative; 
  min-height: 80vh; /* Giữ footer ở dưới nếu nội dung ngắn */
}
</style>