<template>
  <div class="text-center mt-5">
    <h3>Thanh toán MOMO thành công!</h3>
    <p>Bạn sẽ được chuyển về trang đơn hàng trong giây lát...</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // Lấy thông tin từ query string nếu cần
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId");
  const resultCode = params.get("resultCode");

  console.log("MOMO callback params:", { orderId, resultCode });

  // Redirect về trang shop sau 3 giây
  setTimeout(() => {
    window.location.href = "/orders"; // hoặc /checkout/success
  }, 10000);
});
</script>
