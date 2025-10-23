<template>
  <button @click="pay" class="btn">Thanh toán bằng VNPAY</button>
</template>

<script setup>
import axios from "axios";

const props = defineProps({
  orderId: String,
  amount: Number
});

async function pay() {
  try {
    const res = await axios.post("http://localhost:8080/api/vnpay/create", {
      orderId: props.orderId,
      amount: props.amount
    });
    window.location.href = res.data.paymentUrl; // Redirect sang VNPAY
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
  }
}
</script>

<style scoped>
.btn {
  background-color: #0074e4;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover {
  background-color: #005bb5;
}
</style>
