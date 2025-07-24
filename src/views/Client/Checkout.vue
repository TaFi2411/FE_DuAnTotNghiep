<template>
  <div class="container py-5">
    <div class="row">
      <!-- Cột thông tin khách hàng và thanh toán -->
      <div class="col-md-8 pe-md-4 border-end">
        <h4 class="mb-4">Thông tin giao hàng</h4>
        <div class="mb-3">
          <label for="fullname" class="form-label">Họ và tên</label>
          <input type="text" id="fullname" class="form-control" v-model="order.fullname" required />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Số điện thoại</label>
          <input type="tel" id="phone" class="form-control" v-model="order.phone" required />
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Địa chỉ</label>
          <input type="text" id="address" class="form-control" v-model="order.address" required />
        </div>
<div class="mb-3">
  <label for="note" class="form-label">Ghi chú (tuỳ chọn)</label>
  <textarea
    id="note"
    class="form-control"
    rows="3"
    v-model="order.note"
    placeholder="Ghi chú cho người giao hàng hoặc cửa hàng..."
  ></textarea>
</div>
        <h5 class="mt-4">Phương thức thanh toán</h5>
        <div class="form-check mt-2" v-for="method in paymentMethods" :key="method.value">
          <input
            class="form-check-input"
            type="radio"
            :id="method.value"
            :value="method.value"
            v-model="order.payment"
          />
          <label class="form-check-label" :for="method.value">{{ method.label }}</label>
        </div>

        <!-- Checkbox đồng ý chính sách -->
        <div class="form-check mt-4">
          <input
            class="form-check-input"
            type="checkbox"
            id="agree"
            v-model="isAgreed"
          />
          <label class="form-check-label" for="agree">
            Tôi đồng ý với
            <a href="#" target="_blank">Chính sách xử lý dữ liệu cá nhân của TDT APPLE</a>
          </label>
        </div>

        <div class="text-end mt-4">
          <button
            class="btn btn-dark px-4 py-2"
            :disabled="!isAgreed"
            @click="placeOrder"
          >
            Đặt hàng
          </button>
        </div>
      </div>

      <!-- Cột tóm tắt đơn hàng -->
      <div class="col-md-4 ps-md-4">
        <h4 class="mb-4">Tóm tắt đơn hàng</h4>
        <div v-for="item in cart" :key="item.id" class="d-flex mb-3 align-items-center">
          <img :src="item.image" alt="" class="me-3" width="60" height="60" />
          <div>
            <p class="mb-1">{{ item.name }}</p>
            <small class="text-muted">{{ item.quantity }} x {{ formatPrice(item.price) }}</small>
          </div>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <span>Tạm tính:</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Phí vận chuyển:</span>
          <span>{{ formatPrice(shippingFee) }}</span>
        </div>
        <hr />
        <div class="d-flex justify-content-between fw-bold">
          <span>Tổng cộng:</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isAgreed: false,
      order: {
        fullname: "",
        phone: "",
        address: "",
        payment: "cod",
        note: "", 
      },
      paymentMethods: [
        { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
        { value: "bank", label: "Chuyển khoản ngân hàng" },
        { value: "momo", label: "Ví điện tử MoMo" },
      ],
      cart: [
        {
          id: 1,
          name: "iPhone 15 Pro Max",
          image: "/images/Ip16prm-1tb.png",
          price: 35000000,
          quantity: 1,
        },
        {
          id: 2,
          name: "AirPods Pro 2",
          image: "/images/Ip16prm-1tb.png",
          price: 6000000,
          quantity: 2,
        },
      ],
      shippingFee: 30000,
    };
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    total() {
      return this.subtotal + this.shippingFee;
    },
  },
  methods: {
    formatPrice(value) {
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    placeOrder() {
      if (this.isAgreed) {
        alert("✅ Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại TDT APPLE.");
        // Reset form hoặc điều hướng nếu cần
      } else {
        alert("❌ Vui lòng đồng ý với chính sách để tiếp tục.");
      }
    },
  },
};
</script>
