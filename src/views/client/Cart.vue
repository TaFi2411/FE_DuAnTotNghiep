<template>
  <div class="cart container mx-auto py-12 px-6">
    <h1 class="cart-title">🛒 Giỏ hàng của bạn</h1>

    <!-- Có sản phẩm -->
    <div v-if="cartItems.length > 0" class="cart-list">
      <div
        v-for="(item, index) in cartItems"
        :key="index"
        class="cart-item"
      >
        <!-- Checkbox chọn -->
        <input
          type="checkbox"
          class="form-check-input me-3"
          v-model="item.selected"
        />

        <!-- Hình ảnh -->
        <img :src="item.image || defaultImage" alt="" class="cart-item-image" />

        <!-- Thông tin -->
        <div class="cart-item-info">
          <h2>{{ item.name || "Sản phẩm" }}</h2>
          <p class="price">
            {{ (item.price || 0).toLocaleString("vi-VN") }} ₫
          </p>

          <!-- Số lượng -->
          <div class="quantity-control">
            <button @click="decreaseQty(index)" :disabled="item.quantity <= 1">
              -
            </button>

            <span>{{ item.quantity }}</span>

            <button
              @click="increaseQty(index)"
              :disabled="item.quantity >= item.stock"
            >
              +
            </button>

            <span
              v-if="item.quantity >= item.stock"
              class="out-of-stock"
              >Hết hàng</span
            >
          </div>

          <p class="stock-info">Kho còn: {{ item.stock }}</p>
        </div>

        <!-- Tổng tiền & nút xóa -->
        <div class="cart-item-total">
          <p>
            {{
              ((item.price || 0) * (item.quantity || 1)).toLocaleString("vi-VN")
            }}
            ₫
          </p>
          <button class="remove-btn" @click="removeItem(index)">✖</button>
        </div>
      </div>

      <!-- Tổng kết -->
      <div class="cart-summary">
        <h2>
          Tổng cộng: {{ selectedTotal.toLocaleString("vi-VN") }} ₫
        </h2>
        <button
          class="checkout-btn"
          :disabled="selectedItems.length === 0"
          @click="goToCheckout"
        >
          💳 Thanh toán ({{ selectedItems.length }})
        </button>
      </div>
    </div>

    <!-- Giỏ hàng trống -->
    <div v-else class="empty-cart">
      <p>Giỏ hàng trống 😢</p>
      <router-link to="/" class="back-btn">← Tiếp tục mua sắm</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const cartItems = ref([]);
const defaultImage = "https://via.placeholder.com/100";
const router = useRouter();

// 🔹 Hàm load giỏ hàng
onMounted(() => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cartItems.value = cart.map((item) => ({
    ...item,
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
    price: item.price || 0,
    stock: item.stock || 0,
    selected: false,
  }));
});

// 🔹 Hàm lưu giỏ hàng + thông báo cho Header
const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
  window.dispatchEvent(new Event("cart-updated")); // 👈 Cập nhật cho Header
};

// 🔹 Tăng số lượng
const increaseQty = (index) => {
  const item = cartItems.value[index];
  if (item.quantity >= item.stock) return;
  item.quantity++;
  saveCart();
};

// 🔹 Giảm số lượng
const decreaseQty = (index) => {
  const item = cartItems.value[index];
  if (item.quantity > 1) {
    item.quantity--;
    saveCart();
  }
};

// 🔹 Xóa sản phẩm
const removeItem = (index) => {
  cartItems.value.splice(index, 1);
  saveCart();
};

// 🔹 Danh sách sản phẩm được chọn
const selectedItems = computed(() => cartItems.value.filter((i) => i.selected));

// 🔹 Tổng tiền sản phẩm đã chọn
const selectedTotal = computed(() =>
  selectedItems.value.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  )
);

// 🔹 Chuyển sang checkout
const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán 😢");
    return;
  }

  localStorage.setItem("checkoutItems", JSON.stringify(selectedItems.value));
  router.push("/checkout");
};
</script>


<style scoped>
.container {
  max-width: 900px;
  margin-top: 100px;
}

.cart-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cart-item-image {
  width: 110px;
  height: 110px;
  object-fit: contain;
  border-radius: 10px;
  background: #fafafa;
}

.cart-item-info {
  flex: 1;
  margin-left: 20px;
}

.cart-item-info h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.price {
  color: #e53935;
  font-weight: 600;
  margin-bottom: 10px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.quantity-control button {
  width: 30px;
  height: 30px;
  border: none;
  background: #eee;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s;
}

.quantity-control button:hover {
  background: #ddd;
}

.out-of-stock {
  color: #e53935;
  font-weight: 600;
}

.stock-info {
  font-size: 0.9rem;
  color: #555;
}

.cart-item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.2s;
}

.remove-btn:hover {
  color: #e53935;
}

.cart-summary {
  margin-top: 30px;
  text-align: right;
  border-top: 2px solid #eee;
  padding-top: 20px;
}

.cart-summary h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.checkout-btn {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.checkout-btn:hover {
  background: #1d4ed8;
}

.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  margin-top: 50px;
}

.back-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
}

.back-btn:hover {
  background: #1d4ed8;
}
</style>
