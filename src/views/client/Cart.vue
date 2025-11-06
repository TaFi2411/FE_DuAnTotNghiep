<template>
  <div class="cart container py-5 mt-5">
    <!-- Có sản phẩm -->
    <div v-if="cartItems.length > 0" class="cart-list">
      <!-- Header -->
      <div class="cart-header d-none d-md-grid">
        <div>Thông tin sản phẩm</div>
        <div class="text-center">Giá</div>
        <div class="text-center">Số lượng</div>
        <div class="text-end">Thành tiền</div>
      </div>

      <!-- Item -->
      <div v-for="(item, index) in cartItems" :key="item.id"
        class="cart-item d-grid align-items-center bg-white rounded-4 shadow-sm p-3 mb-3 border border-light">
        <!-- Cột 1: Hình & Tên -->
        <div class="d-flex align-items-center gap-3">
          <input type="checkbox" v-model="item.selected" class="form-check-input me-2" />
          <img :src="item.image || defaultImage" alt="" class="cart-item-image  " />
          <div>
            <h6 class="fw-bold text-dark mb-1">{{ item.productName }}</h6>
            <div v-if="
              Array.isArray(item.skuAttributes) &&
              item.skuAttributes.length > 0
            " class="text-muted small">
              <div v-for="attr in item.skuAttributes" :key="attr.id">
                <strong>{{ attr.optionAttributeName }}:</strong>
                {{ attr.valueAttributeName }}
              </div>
            </div>
            <p class="text-muted small mt-1">Kho còn: {{ item.stock }}</p>
          </div>
        </div>

        <!-- Cột 2: Giá -->
        <div class="text-center fw-semibold text-dark">
          {{ (item.price || 0).toLocaleString("vi-VN") }} ₫
        </div>

        <!-- Cột 3: Số lượng -->
        <div class="text-center">
          <div class="d-flex justify-content-center align-items-center gap-2">
            <button class="btn btn-outline-dark btn-sm rounded-3" @click="updateQuantity(item, item.quantity - 1)">
              −
            </button>
            <span class="fw-bold">{{ item.quantity }}</span>
            <button class="btn btn-outline-dark btn-sm rounded-3" @click="updateQuantity(item, item.quantity + 1)">
              +
            </button>
          </div>
        </div>

        <!-- Cột 4: Tổng & Xóa -->
        <div class="text-end">
          <p class="fw-bold text-dark mb-2">
            {{
              ((item.price || 0) * (item.quantity || 1)).toLocaleString("vi-VN")
            }}
            ₫
          </p>
          <button class="btn btn-sm btn-outline-dark rounded-3" @click="removeItem(item)">
            Xóa
          </button>
        </div>
      </div>

      <!-- Tổng cộng -->
      <div class="cart-summary mt-5 bg-white shadow-sm rounded-4 p-4 text-end border border-light">
        <h4 class="fw-bold text-dark mb-3">
          Tổng cộng:
          <span class="text-dark">{{ selectedTotal.toLocaleString("vi-VN") }} ₫</span>
        </h4>
        <button class="btn btn-dark px-4 py-2 rounded-3 fw-semibold" :disabled="selectedItems.length === 0"
          @click="goToCheckout">
          Thanh toán ({{ selectedItems.length }})
        </button>
      </div>
    </div>

    <!-- Giỏ hàng trống -->
    <div v-else class="empty-cart text-center py-5">
      <h3 class="fw-bold text-dark mb-3">Giỏ hàng trống</h3>
      <p class="text-muted fs-5 mb-4">
        Hiện bạn chưa có sản phẩm nào trong giỏ hàng.
      </p>
      <router-link to="/" class="btn btn-outline-dark rounded-3 px-4 py-2 fw-semibold">
        Tiếp tục mua sắm
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";

const router = useRouter();
const cartItems = ref([]);
const accountId = ref(null);
const defaultImage = "/images/default-product.png";

function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const loadCart = async () => {
  try {
    const res = await axios.get(`/api/cart-details/account/${accountId.value}`);
    const data = res.data || [];

    cartItems.value = data.map((item) => ({
      id: item.id,
      productName: item.skuName || "Sản phẩm",
      price: item.price,
      quantity: item.quantity,
      stock: item.skuQuantity,
      image: item.skuImage || defaultImage,
      skuAttributes: Array.isArray(item.skuAttributes)
        ? item.skuAttributes
        : [],
      selected: false,
      skuId: item.skuId,
    }));
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể tải giỏ hàng từ server", "error");
  }
};

const updateQuantity = async (item, newQty) => {
  console.log("Cập nhật số lượng thành công" + item.id);
if (newQty < 1) {
    const result = await Swal.fire({
      title: "Xác nhận xoá sản phẩm?",
      text: "Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xoá!",
      cancelButtonText: "Huỷ"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/cart-details/${item.id}`);
        Swal.fire("Đã xoá!", "Sản phẩm đã được xoá khỏi giỏ hàng.", "success");
        await loadCart(); // refresh giỏ hàng
      } catch (err) {
        Swal.fire("Lỗi", "Không thể xoá sản phẩm", "error");
      }
    }
    return; // Dừng lại, không chạy tiếp
  }
  if (newQty > item.stock) {
    Swal.fire("Thông báo", "Số lượng đã đạt giới hạn trong kho", "info");
    return;
  }

  try {
    const payload = {
      accountId: accountId.value,
      skuId: item.skuId,
      quantity: newQty,
    };

    await axios.put(`/api/cart-details/${item.id}/quantity`, payload);
    console.log("Cập nhật số lượng thành công" + item.id);

    item.quantity = newQty;

    await loadCart();
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể cập nhật số lượng sản phẩm", "error");
  }
};

const removeItem = async (item) => {
  const confirm = await Swal.fire({
    title: "Xóa sản phẩm?",
    text: "Bạn có chắc muốn xóa sản phẩm này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (!confirm.isConfirmed) return;

  try {
    await axios.delete(`/api/cart-details/${item.id}`);
    cartItems.value = cartItems.value.filter((i) => i.id !== item.id);
    Swal.fire("Đã xóa", "Sản phẩm đã được xóa khỏi giỏ hàng", "success");
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể xóa sản phẩm", "error");
  }
};

const selectedItems = computed(() => cartItems.value.filter((i) => i.selected));
const selectedTotal = computed(() =>
  selectedItems.value.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  )
);

const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    Swal.fire(
      "Chưa chọn sản phẩm",
      "Vui lòng chọn sản phẩm để thanh toán",
      "info"
    );
    return;
  }

  sessionStorage.setItem("checkoutItems", JSON.stringify(selectedItems.value));
  router.push("/checkout");
};


onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("Chưa đăng nhập", "Vui lòng đăng nhập để xem giỏ hàng", "info");
    router.push("/auth/login");
    return;
  }

  const payload = decodeJwtToken(token);
  accountId.value = payload?.id || null;
  if (accountId.value) loadCart();
});
</script>

<style scoped>
.cart-header {
  display: grid;
  grid-template-columns: 45% 15% 20% 20%;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #eee;
  padding: 10px 15px;
  margin-bottom: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 45% 15% 20% 20%;
  transition: all 0.2s ease-in-out;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.cart-item-image {
  width: 90px;
  height: 100px;
  object-fit: cover;
  
}

.cart-summary {
  border-top: 2px dashed #eaeaea;
}

.btn-outline-dark:hover {
  background-color: #000;
  color: #fff;
  border-color: #000;
}

.empty-cart {
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
}
</style>
