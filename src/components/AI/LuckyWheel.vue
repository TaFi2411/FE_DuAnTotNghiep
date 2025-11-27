<template>
  <div class="floating-wheel-btn" @click.stop="openWheel">
    <div class="wheel-icon-inner">
      <span v-if="hasIcon">🎁</span>
      <i v-else class="bi bi-gift-fill"></i>
    </div>
    <div class="wheel-tooltip">Săn Voucher</div>
  </div>

  <div v-if="showWheel" class="wheel-overlay" @click.self="closeWheel">
    <div class="wheel-modal">
      <button class="btn-close-wheel" @click="closeWheel">✕</button>

      <div class="text-center mb-4">
        <h3 class="fw-bolder text-gold ls-2">VÒNG QUAY MAY MẮN</h3>
        <p class="text-white-50 small">Quay là trúng - Giảm giá ngay lập tức!</p>
      </div>

      <div class="wheel-container">
        <div class="wheel-arrow"></div>
        
        <div class="the-wheel" :style="wheelStyle">
          <div 
            v-for="(prize, index) in prizes" 
            :key="index" 
            class="wheel-text-item"
            :style="getTextRotation(index)"
          >
            <span class="prize-label" :style="{ color: prize.text }">{{ prize.label }}</span>
          </div>
        </div>

        <div class="wheel-center">
          <button class="btn-spin" @click="spinWheel" :disabled="isSpinning">
            {{ isSpinning ? '...' : 'QUAY' }}
          </button>
        </div>
      </div>

      <div v-if="wonPrize" class="result-box mt-4 text-center">
        <template v-if="wonPrize.value > 0">
          <h4 class="text-white fw-bold">Chúc mừng!</h4>
          <p class="text-gold fs-5">Bạn nhận được: {{ wonPrize.label }}</p>
          <button class="btn-use-now" @click="useVoucher">DÙNG NGAY</button>
        </template>
        <template v-else>
          <h4 class="text-white fw-bold">Rất tiếc!</h4>
          <p class="text-white-50 fs-5">{{ wonPrize.label }}</p>
          <button class="btn-use-now" @click="closeWheel">ĐÓNG</button>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

// Nhận props từ cha
const props = defineProps({
  showWheel: { type: Boolean, default: false }
});

// Định nghĩa sự kiện gửi ngược lại cha
const emit = defineEmits(['update:showWheel', 'voucherWon']);

// Danh sách quà (Bạn có thể sửa, thêm bớt thoải mái)
const prizes = [
  { label: "10% OFF", value: 0.1, color: "#222", text: "#C5A059" },
  { label: "Mất lượt", value: 0, color: "#C5A059", text: "#000" },
  { label: "20% OFF", value: 0.2, color: "#222", text: "#C5A059" },
  { label: "Free Ship", value: 0, color: "#C5A059", text: "#000" },
  { label: "5% OFF", value: 0.05, color: "#222", text: "#C5A059" },
  { label: "50% OFF", value: 0.5, color: "#C5A059", text: "#000" },
];

const isSpinning = ref(false);
const currentRotation = ref(0);
const wonPrize = ref(null);
const hasIcon = ref(false); // Biến check icon, mặc định false để dùng emoji

const segmentAngle = 360 / prizes.length; // Góc mỗi phần quà

// 1. Tạo màu nền tự động (Conic Gradient)
const wheelStyle = computed(() => {
  const gradient = prizes.map((p, i) => {
    const start = i * segmentAngle;
    const end = (i + 1) * segmentAngle;
    return `${p.color} ${start}deg ${end}deg`;
  }).join(', ');

  return {
    background: `conic-gradient(${gradient})`,
    transform: `rotate(${currentRotation.value}deg)`,
    transition: isSpinning.value ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
  };
});

// 2. Tính góc xoay cho chữ
const getTextRotation = (index) => {
  const rotate = index * segmentAngle + (segmentAngle / 2);
  return { transform: `rotate(${rotate}deg)` };
};

// 3. Các hàm xử lý
const openWheel = () => {
  emit('update:showWheel', true);
};

const closeWheel = () => {
  if (!isSpinning.value) {
    emit('update:showWheel', false);
  }
};

const spinWheel = () => {
  if (isSpinning.value) return;
  isSpinning.value = true;
  wonPrize.value = null;

  // Random quà
  const index = Math.floor(Math.random() * prizes.length);
  
  // LOGIC TOÁN HỌC:
  // Mũi tên ở góc 0 độ (12 giờ).
  // Tâm phần thưởng nằm tại: index * segmentAngle + segmentAngle/2
  // Để tâm phần thưởng về đúng vị trí 0 độ, ta quay ngược chiều kim đồng hồ.
  const spinRounds = 5; // Quay 5 vòng
  const prizeCenter = index * segmentAngle + (segmentAngle / 2);
  
  // Tính góc đích đến
  const targetRotation = 360 * spinRounds - prizeCenter;

  // Cộng dồn vào góc hiện tại (để không bị reset vòng quay)
  const currentMod = currentRotation.value % 360;
  currentRotation.value += targetRotation - currentMod + 360 * spinRounds;

  setTimeout(() => {
    isSpinning.value = false;
    wonPrize.value = prizes[index];
  }, 4000); // 4 giây
};

const useVoucher = () => {
  if (wonPrize.value && wonPrize.value.value > 0) {
    emit('voucherWon', wonPrize.value);
    closeWheel();
    wonPrize.value = null;
  }
};
</script>

<style scoped>
/* NÚT MỞ (FLOATING BUTTON) */
.floating-wheel-btn {
  position: fixed; bottom: 30px; left: 30px;
  width: 60px; height: 60px;
  background: #C5A059; border: 2px solid #fff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; 
  z-index: 999999; /* Luôn nổi trên cùng */
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: float 3s ease-in-out infinite;
}
.wheel-icon-inner { font-size: 1.5rem; color: #fff; }
.wheel-tooltip {
  position: absolute; left: 70px; top: 50%; transform: translateY(-50%);
  background: #000; color: #fff; padding: 5px 10px; border-radius: 4px;
  font-size: 0.8rem; opacity: 0; pointer-events: none; transition: 0.3s;
  white-space: nowrap;
}
.floating-wheel-btn:hover .wheel-tooltip { opacity: 1; left: 75px; }
@keyframes float { 0%,100% {transform: translateY(0)} 50% {transform: translateY(-10px)} }

/* MODAL */
.wheel-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8);
  z-index: 1000000; display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.wheel-modal {
  background: #111; padding: 30px; border-radius: 20px;
  position: relative; border: 1px solid #333;
  width: 95vw; max-width: 400px;
  box-shadow: 0 0 30px rgba(197, 160, 89, 0.3);
}
.btn-close-wheel {
  position: absolute; top: 10px; right: 15px; background: none; border: none;
  color: #fff; font-size: 1.2rem; cursor: pointer;
}

/* VÒNG QUAY */
.wheel-container {
  width: 280px; height: 280px; margin: 0 auto;
  position: relative; border-radius: 50%;
  border: 5px solid #C5A059; overflow: hidden;
  box-shadow: 0 0 15px #000;
}
.wheel-arrow {
  position: absolute; top: -5px; left: 50%; transform: translateX(-50%);
  width: 0; height: 0; z-index: 10;
  border-left: 15px solid transparent; border-right: 15px solid transparent;
  border-top: 30px solid #fff; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
}
.the-wheel { width: 100%; height: 100%; border-radius: 50%; position: relative; }

/* CHỮ TRÊN VÒNG QUAY */
.wheel-text-item {
  position: absolute; top: 0; left: 50%; width: 0; height: 50%;
  transform-origin: bottom center;
  display: flex; justify-content: center; padding-top: 20px;
}
.prize-label {
  display: block; width: 80px; text-align: center;
  font-weight: bold; font-size: 0.8rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

/* NÚT GIỮA */
.wheel-center {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 50px; height: 50px; background: #fff; border-radius: 50%; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  border: 3px solid #C5A059;
}
.btn-spin { border: none; background: transparent; font-weight: 800; color: #111; font-size: 0.7rem; }

/* RESULT */
.text-gold { color: #C5A059; }
.btn-use-now {
  background: #C5A059; color: #000; border: none;
  padding: 8px 25px; border-radius: 20px; font-weight: bold; margin-top: 10px;
}
</style>