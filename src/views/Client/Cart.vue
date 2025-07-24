<template>
  <div class="container py-5">
    <h2 class="mb-4 text-dark">GIỎ HÀNG</h2>
    <hr />
    <div class="table-responsive">
      <table class="table table-borderless table-hover align-middle bg-transparent">
        <thead class="bg-light text-dark">
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th>Xoá</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="item.id">
            <td>
              <div class="d-flex align-items-center gap-3">
                <img :src="item.image" alt="..." width="60" height="60" class="rounded-2 border" />
                <div>
                  <h6 class="mb-0 text-dark">{{ item.name }}</h6>
                  <small class="text-muted">{{ item.description }}</small>
                </div>
              </div>
            </td>
            <td class="text-dark">{{ formatPrice(item.price) }}</td>
            <td>
              <div class="input-group input-group-sm" style="max-width: 120px">
                <button class="btn btn-outline-dark" @click="decreaseQty(index)">−</button>
                <input
                  type="number"
                  class="form-control text-center text-dark border-dark"
                  v-model.number="item.quantity"
                  min="1"
                />
                <button class="btn btn-outline-dark" @click="increaseQty(index)">+</button>
              </div>
            </td>
            <td class="text-dark">{{ formatPrice(item.price * item.quantity) }}</td>
            <td>
              <button class="btn btn-sm btn-danger" @click="removeItem(index)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="cart.length === 0">
            <td colspan="5" class="text-center text-muted py-4">🛒 Giỏ hàng trống</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr />

    <div class="d-flex justify-content-end mt-4">
      <div class="p-4 text-dark" style="min-width: 300px">
        <h5 class="mb-3">Tạm tính:</h5>
        <h4 class="text-danger fw-bold">{{ formatPrice(totalPrice) }}</h4>

       

        <button class="btn btn-dark w-100 mt-2" @click="checkout">
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [
        {
          id: 1,
          name: "iPhone 15 Pro",
          description: "128GB - Titan",
          image: "/images/Ip16prm-1tb.png",
          price: 25990000,
          quantity: 1,
        },
        {
          id: 2,
          name: "MacBook Air M2",
          description: "256GB SSD - 8GB RAM",
          image: "/images/Ip16prm-1tb.png",
          price: 28990000,
          quantity: 1,
        },
      ],
      note: "",
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  },
  methods: {
    formatPrice(value) {
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    increaseQty(index) {
      this.cart[index].quantity++;
    },
    decreaseQty(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
      }
    },
    removeItem(index) {
      this.cart.splice(index, 1);
    },
    checkout() {
      // Chuyển sang trang checkout
      this.$router.push("/checkout");
    },
  },
};
</script>

<style scoped>
body {
  background-color: #121212;
}
.table th,
.table td {
  vertical-align: middle;
}
.table td img {
  object-fit: cover;
}
</style>
