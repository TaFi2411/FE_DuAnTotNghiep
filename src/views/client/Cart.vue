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
      <div
        v-for="(item, index) in cartItems"
        :key="item.id"
        class="cart-item d-grid align-items-center bg-white rounded-4 shadow-sm p-3 mb-3 border border-light"
      >
        <!-- Cột 1: Hình & Tên -->
        <div class="d-flex align-items-center gap-3">
          <input type="checkbox" v-model="item.selected" class="form-check-input me-2" />
          <img :src="item.image || defaultImage" alt="" class="cart-item-image" />
          <div>
            <h6 class="fw-bold text-dark mb-1">{{ item.productName }}</h6>
            <div
              v-if="Array.isArray(item.skuAttributes) && item.skuAttributes.length > 0"
              class="text-muted small"
            >
              <div v-for="attr in item.skuAttributes" :key="attr.id">
                <strong>{{ attr.optionAttributeName }}:</strong>
                {{ attr.valueAttributeName }}
              </div>
            </div>

            <!-- 🔹 Hiển thị số lượng trong kho & Flash Sale -->
            <div class="mt-2">
              <p class="text-muted small mb-1">
                🏢 <strong>Số lượng trong kho:</strong>
                {{ item.normalStock ?? 0 }}
              </p>
              <p v-if="item.flashSaleStock !== null" class="text-danger small mb-0">
                ⚡ <strong>Số lượng Flash Sale còn:</strong>
                {{ item.flashSaleStock }}
              </p>
            </div>
          </div>
        </div>

        <!-- Cột 2: Giá -->
        <div class="text-center fw-semibold text-dark">
          <!-- Nếu sản phẩm có Flash Sale -->
          <div v-if="item.flashSaleStock !== null">
            <!-- Nếu số lượng vượt Flash Sale -->
            <div v-if="item.normalCount > 0">
              <!-- Giá gốc dòng trên -->
              <p class="mb-1 text-dark fw-bold" style="font-size: 15px">
                {{ item.originalPrice.toLocaleString("vi-VN") }} ₫
              </p>
              <!-- Giá Sale dòng dưới -->
              <p class="mb-0 text-danger" style="font-size: 13px">
                {{ (item.flashSalePrice ?? item.price).toLocaleString("vi-VN") }} ₫
                <span class="text-muted">(Flash Sale)</span>
              </p>
            </div>

            <!-- Chỉ hiển thị giá Sale -->
            <div v-else>
              <p class="mb-0 text-danger" style="font-size: 13px">
                {{ (item.flashSalePrice ?? item.price).toLocaleString("vi-VN") }} ₫
                <span class="text-muted">(Flash Sale)</span>
              </p>
            </div>
          </div>

          <!-- Nếu sản phẩm không có Flash Sale -->
          <div v-else>
            <p class="mb-0 text-dark fw-bold" style="font-size: 15px">
              {{ item.price.toLocaleString("vi-VN") }} ₫
            </p>
          </div>
        </div>

        <!-- Cột 3: Số lượng -->
        <div class="text-center">
          <div class="d-flex justify-content-center align-items-center gap-2">
            <button
              class="btn btn-outline-dark btn-sm rounded-3"
              @click="updateQuantity(item, item.quantity - 1)"
            >
              −
            </button>
            <span class="fw-bold">{{ item.quantity }}</span>
            <button
              class="btn btn-outline-dark btn-sm rounded-3"
              @click="updateQuantity(item, item.quantity + 1)"
            >
              +
            </button>
          </div>
        </div>

        <!-- Cột 4: Tổng & Xóa -->
        <div class="text-end">
          <p class="fw-bold text-dark mb-2">
            {{
              (
                item.saleCount * (item.flashSalePrice ?? item.price) +
                item.normalCount * item.originalPrice
              ).toLocaleString("vi-VN")
            }}
            ₫
          </p>
          <button class="btn btn-sm btn-outline-dark rounded-3" @click="removeItem(item)">
            Xóa
          </button>
        </div>
      </div>

      <!-- Tổng cộng -->
      <div
        class="cart-summary mt-5 bg-white shadow-sm rounded-4 p-4 text-end border border-light"
      >
        <h4 class="fw-bold text-dark mb-3">
          Tổng cộng:
          <span class="text-dark">{{ selectedTotal.toLocaleString("vi-VN") }} ₫</span>
        </h4>
        <button
          class="btn btn-dark px-4 py-2 rounded-3 fw-semibold"
          :disabled="selectedItems.length === 0"
          @click="goToCheckout"
        >
          Thanh toán ({{ selectedItems.length }})
        </button>
      </div>
    </div>

    <!-- Giỏ hàng trống -->
    <div v-else class="empty-cart text-center py-5">
      <h3 class="fw-bold text-dark mb-3">Giỏ hàng trống</h3>
      <p class="text-muted fs-5 mb-4">Hiện bạn chưa có sản phẩm nào trong giỏ hàng.</p>
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
const flashSales = ref([]);
const flashSaleSkus = ref([]);

// --- decode JWT ---
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

// --- Load flash sale data ---
async function loadFlashSales() {
  try {
    const [fsRes, fssRes] = await Promise.all([
      axios.get("/api/flash-sale"),
      axios.get("/api/flash-sale-sku"),
    ]);

    const now = new Date();
    const fsData = fsRes.data?.content || fsRes.data?.data || fsRes.data || [];
    const fssData = fssRes.data?.content || fssRes.data?.data || fssRes.data || [];

    flashSales.value = fsData.filter(
      (f) =>
        f.active &&
        new Date(f.started_date ?? f.startedDate) <= now &&
        new Date(f.ended_date ?? f.endedDate) >= now
    );

    flashSaleSkus.value = fssData;
  } catch (err) {
    console.error("Không thể load flash sale", err);
  }
}

// --- Load cart ---
const loadCart = async () => {
  try {
    const res = await axios.get(`/api/cart-details/account/${accountId.value}`);
    const data = res.data || [];

    cartItems.value = data.map((item) => {
      const skuId = item.skuId;

      const flashSku = flashSaleSkus.value.find(
        (f) =>
          (f.sku_id === skuId || f.skuId === skuId) &&
          flashSales.value.some((fs) => fs.id === (f.flash_sale_id ?? f.flashSaleId))
      );

      const discountedPrice = flashSku
        ? Math.round(item.price * (1 - (flashSku.discount ?? 0) / 100))
        : item.price;

      const normalStock = item.skuQuantity ?? 0;
      const flashSaleStock = flashSku ? flashSku.quantity ?? 0 : null;

      // --- Tính sẵn saleCount & normalCount khi load ---
      const quantity = item.quantity;
      const saleCount = Math.min(quantity, flashSaleStock ?? 0);
      const normalCount = Math.max(0, quantity - saleCount);

      return {
        id: item.id,
        productName: item.skuName || "Sản phẩm",
        price: discountedPrice,
        flashSalePrice: discountedPrice,
        originalPrice: item.price,
        quantity,
        normalStock,
        flashSaleStock,
        image: item.skuImage || defaultImage,
        skuAttributes: Array.isArray(item.skuAttributes) ? item.skuAttributes : [],
        selected: false,
        skuId,
        flashSaleSkuId: flashSku?.id ?? null,
        saleCount,
        normalCount,
      };
    });
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể tải giỏ hàng từ server", "error");
  }
};

// --- Cập nhật số lượng ---
const updateQuantity = async (item, newQty) => {
  if (newQty < 1) {
    const result = await Swal.fire({
      title: "Xác nhận xoá sản phẩm?",
      text: "Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xoá!",
      cancelButtonText: "Huỷ",
    });
    if (!result.isConfirmed) return;
    await removeItem(item);
    return;
  }

  // Nếu vượt quá Flash Sale
  if (item.flashSaleStock) {
    if (newQty > item.flashSaleStock && !item.flashSaleAlerted) {
      Swal.fire({
        icon: "info",
        title: "Vượt số lượng khuyến mãi",
        text: `Chỉ ${item.flashSaleStock} sản phẩm được áp dụng giá Flash Sale. Hết số lượng sale sẽ tính giá gốc.`,
        confirmButtonText: "Đã hiểu",
      });
      item.flashSaleAlerted = true; // đánh dấu đã thông báo
    } else if (newQty <= item.flashSaleStock) {
      item.flashSaleAlerted = false; // reset nếu giảm số lượng về <= flashSaleStock
    }
  }

  // Giới hạn theo kho
  if (newQty > item.normalStock) {
    Swal.fire("Thông báo", "Số lượng đã vượt quá số lượng trong kho", "info");
    newQty = item.normalStock;
  }

  // Cập nhật
  item.quantity = newQty;
  item.saleCount = Math.min(newQty, item.flashSaleStock ?? 0);
  item.normalCount = Math.max(0, newQty - item.saleCount);

  try {
    await axios.put(`/api/cart-details/${item.id}/quantity`, {
      accountId: accountId.value,
      skuId: item.skuId,
      quantity: newQty,
    });
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể cập nhật số lượng sản phẩm", "error");
  }
};

// --- Xoá sản phẩm ---
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

// --- Computed ---
const selectedItems = computed(() => cartItems.value.filter((i) => i.selected));
const selectedTotal = computed(() =>
  selectedItems.value.reduce(
    (sum, i) =>
      sum + i.saleCount * (i.flashSalePrice ?? i.price) + i.normalCount * i.originalPrice,
    0
  )
);

// --- Thanh toán ---
const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    Swal.fire("Chưa chọn sản phẩm", "Vui lòng chọn sản phẩm để thanh toán", "info");
    return;
  }
  sessionStorage.setItem("checkoutItems", JSON.stringify(selectedItems.value));
  router.push("/checkout");
};

// --- Mounted ---
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("Chưa đăng nhập", "Vui lòng đăng nhập để xem giỏ hàng", "info");
    router.push("/auth/login");
    return;
  }
  const payload = decodeJwtToken(token);
  accountId.value = payload?.id || null;

  await loadFlashSales();
  if (accountId.value) await loadCart();
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
