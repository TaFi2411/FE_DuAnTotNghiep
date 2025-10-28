<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 text-center px-4"
  >
    <div
      class="w-full max-w-md p-8 rounded-2xl shadow-xl transform transition duration-500 hover:scale-105"
      :class="
        status === 'success'
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      "
    >
      <div class="text-6xl mb-6">
        <span v-if="status === 'success'">✅</span>
        <span v-else>❌</span>
      </div>

      <h1
        class="text-3xl font-extrabold mb-4"
        :class="
          status === 'success' ? 'text-green-700' : 'text-red-700'
        "
      >
        {{ status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại!' }}
      </h1>

      <p class="text-lg mb-8 text-gray-700">
        {{
          status === 'success'
            ? 'Cảm ơn bạn đã mua hàng 💚'
            : 'Vui lòng thử lại sau hoặc liên hệ hỗ trợ.'
        }}
      </p>

      <button
        @click="goHome"
        class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-105"
      >
        Về trang chủ
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const status = ref("");

onMounted(async () => {
  status.value = route.query.status || "fail";
  const orderId = route.query.orderId || localStorage.getItem("orderId");

  if (status.value === "success" && orderId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/order/vnpay-success/${orderId}`,
        { method: "POST" }
      );

      if (response.ok) {
        console.log("✅ Cập nhật đơn hàng thành công!");
      } else {
        console.error("⚠️ Lỗi khi cập nhật đơn hàng:", await response.text());
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi yêu cầu cập nhật:", error);
    }
  }

  setTimeout(() => {
    router.push("/");
  }, 3000);
});


// 🏠 Nút về trang chủ thủ công
const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
span {
  display: inline-block;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
