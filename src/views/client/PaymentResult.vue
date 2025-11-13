<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 text-center px-4"
  >
    <!-- 🔹 Khối thông báo chính -->
    <div
      class="w-full max-w-lg p-10 rounded-3xl shadow-2xl border backdrop-blur-md transition-all duration-500"
      :class="status === 'success'
        ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-emerald-300'
        : 'bg-gradient-to-br from-red-50 to-rose-100 border-rose-300'"
    >
      <!-- Biểu tượng động -->
      <div class="text-7xl mb-6 animate-bounce">
        <span v-if="status === 'success'">🎉</span>
        <span v-else>💔</span>
      </div>

      <!-- Tiêu đề -->
      <h1
        class="text-3xl font-extrabold mb-3 tracking-wide"
        :class="status === 'success' ? 'text-emerald-700' : 'text-rose-700'"
      >
        {{ status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại!' }}
      </h1>

      <!-- Phụ đề -->
      <p class="text-gray-600 mb-6 text-lg leading-relaxed">
        {{
          status === 'success'
            ? 'Cảm ơn bạn đã mua hàng 💚 Đơn hàng của bạn đang được xử lý!'
            : 'Rất tiếc! Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.'
        }}
      </p>

      <!-- Nút về trang chủ -->
      <button
        @click="goHome"
        class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 hover:scale-105"
      >
        🏠 Về trang chủ
      </button>

      <!-- Dòng chờ chuyển hướng -->
      <p class="text-sm text-gray-500 mt-6 italic">
        Tự động trở về trang chủ sau vài giây...
      </p>
    </div>

    <!-- Animation nền -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute w-72 h-72 bg-blue-300 opacity-20 rounded-full blur-3xl top-20 left-10 animate-pulse"
      ></div>
      <div
        class="absolute w-96 h-96 bg-green-300 opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-pulse delay-200"
      ></div>
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
  }, 4000);
});

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
/* Hiệu ứng bounce mượt hơn */
@keyframes bounce-smooth {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
.animate-bounce {
  animation: bounce-smooth 1.2s infinite;
}

/* Hiệu ứng ánh sáng */
@keyframes pulse-light {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}
.animate-pulse {
  animation: pulse-light 3s ease-in-out infinite;
}

.delay-200 {
  animation-delay: 0.5s;
}
</style>
