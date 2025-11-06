<template>
  <div class="checkout-page container py-5 mt-5">
    <h2 class="fw-bold text-center mb-4">Thanh toán đơn hàng 💳</h2>

    <div class="row g-4">
      <!-- CỘT TRÁI: ĐỊA CHỈ -->
      <div class="col-lg-8">
        <div class="bg-white rounded-4 shadow-sm p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Địa chỉ giao hàng</h5>
            <button class="btn btn-outline-primary btn-sm rounded-pill px-3" @click="showAddressModal = true">
              <i class="bi bi-plus-circle"></i> Thêm địa chỉ mới
            </button>
          </div>

          <!-- Danh sách địa chỉ -->
          <div v-if="addresses.length">
            <div v-for="a in addresses" :key="a.id"
              class="border rounded-3 p-3 mb-2 d-flex justify-content-between align-items-center"
              :class="{ 'border-primary bg-light': selectedAddress?.id === a.id }" @click="selectAddress(a)"
              style="cursor: pointer;">
              <div>
                <strong>{{ a.fulladdress }}</strong>
                <div class="text-muted small">#{{ a.id }}</div>
              </div>
              <i v-if="selectedAddress?.id === a.id" class="bi bi-check-circle-fill text-primary fs-5"></i>
            </div>
          </div>
          <div v-else class="text-muted fst-italic">Chưa có địa chỉ nào được lưu.</div>
        </div>
      </div>

      <!-- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG -->
      <div class="col-lg-4">
        <div class="summary-box bg-white rounded-4 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Tóm tắt đơn hàng</h5>

          <!-- Sản phẩm trong giỏ -->
          <!-- Sản phẩm trong giỏ -->
<div
  v-for="item in cartItems"
  :key="item.skuId"
  class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2"
>
  <div class="d-flex align-items-center">
    <img
      :src="item.image || '/images/default-product.png'"
      alt="product image"
      class="rounded me-3 border"
      width="60"
      height="60"
      style="object-fit: cover;"
    />
    <div>
      <div class="fw-semibold">{{ item.productName || 'Sản phẩm' }}</div>

      <!-- Hiển thị thuộc tính SKU -->
      <div
        v-if="Array.isArray(item.skuAttributes) && item.skuAttributes.length > 0"
        class="text-muted small"
      >
        <div v-for="attr in item.skuAttributes" :key="attr.id">
          <strong>{{ attr.optionAttributeName }}:</strong>
          {{ attr.valueAttributeName }}
        </div>
      </div>

      <div class="text-muted small">
        {{ (item.price || 0).toLocaleString('vi-VN') }} ₫ × {{ item.quantity }}
      </div>
    </div>
  </div>
  <div class="fw-semibold">
    {{ ((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN') }} ₫
  </div>
</div>


          <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển</span>
            <strong>{{ (shippingFee || 0).toLocaleString('vi-VN') }} ₫</strong>
          </div>

          <div class="d-flex justify-content-between fw-bold border-top pt-2">
            <span>Tổng thanh toán</span>
            <span>{{ totalPayment.toLocaleString('vi-VN') }} ₫</span>
          </div>

          <button class="btn btn-dark w-100 rounded-pill py-2 fw-semibold mt-3" @click="handleVnpayPayment">
            Thanh toán bằng VnPay
          </button>
          <!-- Nút thanh toán MoMo -->
          <button class="btn btn-outline-danger w-100 rounded-pill py-2 fw-semibold mt-2" @click="handleMomoPayment">
            Thanh toán bằng MoMo
          </button>
          <button class="btn btn-outline-secondary w-100 rounded-pill py-2 fw-semibold mt-2" @click="handleCODPayment">
            Thanh toán khi nhận hàng (COD)
          </button>

        </div>
      </div>
    </div>

    <!-- MODAL THÊM ĐỊA CHỈ -->
    <div v-if="showAddressModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Thêm địa chỉ mới</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Tỉnh/Thành phố</label>
              <select v-model="selectedProvince" @change="fetchDistricts" class="form-select">
                <option value="">-- Chọn tỉnh --</option>
                <option v-for="p in provinces" :key="p.ProvinceID" :value="p.ProvinceID">{{ p.ProvinceName }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Quận/Huyện</label>
              <select v-model="selectedDistrict" @change="fetchWards" class="form-select" :disabled="!districts.length">
                <option value="">-- Chọn quận/huyện --</option>
                <option v-for="d in districts" :key="d.DistrictID" :value="d.DistrictID">{{ d.DistrictName }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Phường/Xã</label>
              <select v-model="selectedWard" class="form-select" :disabled="!wards.length">
                <option value="">-- Chọn phường/xã --</option>
                <option v-for="w in wards" :key="w.WardCode" :value="w.WardCode">{{ w.WardName }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Địa chỉ cụ thể</label>
              <input type="text" v-model="specificAddress" class="form-control" placeholder="Ví dụ: 123 Đường ABC..." />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Hủy</button>
            <button class="btn btn-primary" @click="saveAddress">Lưu địa chỉ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

const showAddressModal = ref(false);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const addresses = ref([]);

const selectedProvince = ref("");
const selectedDistrict = ref("");
const selectedWard = ref("");
const specificAddress = ref("");
const selectedAddress = ref(null);

const accountId = ref(null);
const storeDistrictId = 1451;
const shippingFee = ref(0);
const cartItems = ref([]);

const fetchAccountId = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      accountId.value = payload.id;
    } catch (err) {
      console.error("Lỗi khi giải mã token:", err);
    }
  }
};

// Tổng tiền sản phẩm
const totalProductPrice = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  )
);

// Tổng thanh toán = sản phẩm + ship
const totalPayment = computed(
  () => totalProductPrice.value + (shippingFee.value || 0)
);

// Load danh sách tỉnh/huyện/xã
const fetchProvinces = async () => {
  const res = await axios.get("http://localhost:8080/api/ghn/provinces");
  provinces.value = res.data;
};

const fetchDistricts = async () => {
  if (!selectedProvince.value) return;
  const res = await axios.get(
    `http://localhost:8080/api/ghn/districts?provinceId=${selectedProvince.value}`
  );
  districts.value = res.data;
  wards.value = [];
  selectedDistrict.value = "";
  selectedWard.value = "";
};

const fetchWards = async () => {
  if (!selectedDistrict.value) return;
  const res = await axios.get(
    `http://localhost:8080/api/ghn/wards?districtId=${selectedDistrict.value}`
  );
  wards.value = res.data;
  selectedWard.value = "";
};

// Địa chỉ
const fetchAddresses = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/address/account/${accountId.value}`
    );
    addresses.value = res.data || [];
  } catch (err) {
    console.error("Lỗi khi load danh sách địa chỉ:", err);
  }
};

// ✅ Lưu địa chỉ mới
const saveAddress = async () => {
  if (
    !specificAddress.value ||
    !selectedProvince.value ||
    !selectedDistrict.value ||
    !selectedWard.value
  ) {
    alert("Vui lòng nhập đầy đủ thông tin địa chỉ!");
    return;
  }

  const provinceName =
    provinces.value.find((p) => p.ProvinceID === selectedProvince.value)
      ?.ProvinceName || "";
  const districtName =
    districts.value.find((d) => d.DistrictID === selectedDistrict.value)
      ?.DistrictName || "";
  const wardName =
    wards.value.find((w) => w.WardCode === selectedWard.value)?.WardName || "";

  const fullAddress = `${specificAddress.value}, ${wardName}, ${districtName}, ${provinceName}`;

  try {
    const payload = {
      province_id: selectedProvince.value,
      district_id: selectedDistrict.value,
      ward_code: selectedWard.value,
      address: specificAddress.value,
      fulladdress: fullAddress,
      defaultAddress: false,
      active: true,
      accountId: accountId.value,
    };

    await axios.post("http://localhost:8080/api/address", payload);
    alert("Lưu địa chỉ thành công!");
    closeModal();
    fetchAddresses();
  } catch (err) {
    console.error("Lỗi lưu địa chỉ:", err);
    alert("Không thể lưu địa chỉ. Vui lòng thử lại!");
  }
};

const selectAddress = (a) => {
  selectedAddress.value = a;
};

// Tính phí ship
const fetchShippingFee = async () => {
  if (!selectedAddress.value) return;
  const toDistrictId = Number(selectedAddress.value.district_id);
  const toWardCode = String(selectedAddress.value.ward_code);
  if (!toDistrictId || !toWardCode) {
    shippingFee.value = 0;
    return;
  }
  try {
    const res = await axios.get("http://localhost:8080/api/ghn/fee", {
      params: {
        fromDistrictId: storeDistrictId,
        toDistrictId,
        toWardCode,
        weight: 1000,
      },
    });
    shippingFee.value = res.data?.total || res.data?.data?.total || 0;
  } catch (err) {
    shippingFee.value = 0;
    console.error(err);
  }
};

watch(selectedAddress, (newVal) => {
  if (newVal) fetchShippingFee();
});

// Modal địa chỉ
const closeModal = () => {
  showAddressModal.value = false;
  selectedProvince.value = "";
  selectedDistrict.value = "";
  selectedWard.value = "";
  specificAddress.value = "";
};

// ✅ Thanh toán VNPAY — tạo đơn + redirect thanh toán
const handleVnpayPayment = async () => {
  if (!selectedAddress.value) {
    alert("Vui lòng chọn địa chỉ giao hàng!");
    return;
  }

  try {
    const orderPayload = {
      accountId: accountId.value,
      addressId: selectedAddress.value.id,
      paymentMethodId: 1, // VNPAY
      feeship: shippingFee.value,
      total: totalPayment.value,
      payment_status: false,
      discount: 0,
      voucherId: null,
      orderDetails: cartItems.value.map((i) => ({
        skuId: i.skuId,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    const orderRes = await axios.post(
      "http://localhost:8080/api/order",
      orderPayload
    );
    const order = orderRes.data;
    sessionStorage.removeItem("cart");
    cartItems.value = [];

    console.log("🧾 Đơn hàng tạo thành công:", order);
    localStorage.setItem("orderId", order.id);

    const vnpayRes = await axios.post("http://localhost:8080/api/vnpay/create", {
      orderId: order.id,
      amount: order.total,
    });

    if (vnpayRes.data?.paymentUrl) {
      window.location.href = vnpayRes.data.paymentUrl;
    } else {
      alert("Không tạo được link thanh toán!");
    }
  } catch (err) {
    console.error("❌ Lỗi tạo đơn hàng hoặc thanh toán VNPAY:", err);
    alert("Lỗi tạo đơn hàng hoặc thanh toán VNPAY!");
  }
};

// ✅ Thanh toán MoMo — tạo đơn + redirect thanh toán
const handleMomoPayment = async () => {
  if (!selectedAddress.value) {
    alert("Vui lòng chọn địa chỉ giao hàng!");
    return;
  }

  try {
    // 1️⃣ Gửi tạo đơn hàng
    const orderPayload = {
      accountId: accountId.value,
      addressId: selectedAddress.value.id,
      paymentMethodId: 3, // MoMo
      feeship: shippingFee.value,
      total: totalPayment.value,
      payment_status: false,
      discount: 0,
      voucherId: null,
      orderDetails: cartItems.value.map(i => ({
        skuId: i.skuId,
        quantity: i.quantity,
        price: i.price
      }))
    };

    const orderRes = await axios.post("http://localhost:8080/api/order", orderPayload);
    const order = orderRes.data;
    sessionStorage.removeItem("cart");
    cartItems.value = [];

    console.log("🧾 Đơn hàng tạo thành công:", order);

    localStorage.setItem("orderId", order.id);

    // 2️⃣ Gọi API backend để tạo link thanh toán MoMo
    const momoRes = await axios.post("http://localhost:8080/api/momo/create", {
      orderId: order.id,
      amount: order.total,
      orderInfo: "Thanh toán đơn hàng #" + order.id
    });

    console.log("🔗 MoMo response:", momoRes.data);

    // 3️⃣ Nếu tạo link thành công => redirect người dùng sang trang MoMo
    if (momoRes.data?.resultCode === 0 && momoRes.data?.payUrl) {
      window.location.href = momoRes.data.payUrl;
    } else {
      alert("Không tạo được link thanh toán MoMo!");
    }
  } catch (err) {
    console.error("❌ Lỗi tạo đơn hàng hoặc thanh toán MoMo:", err);
    alert("Lỗi tạo đơn hàng hoặc thanh toán MoMo!");
  }
};



// ✅ Thanh toán COD — tạo đơn và thông báo thành công
const handleCODPayment = async () => {
  if (!selectedAddress.value) {
    alert("Vui lòng chọn địa chỉ giao hàng!");
    return;
  }

  try {
    // 1️⃣ Tạo payload đơn hàng
    const orderPayload = {
      accountId: accountId.value,
      addressId: selectedAddress.value.id,
      paymentMethodId: 2, // COD
      feeship: shippingFee.value,
      total: totalPayment.value,
      payment_status: false,
      discount: 0,
      voucherId: null,
      orderDetails: cartItems.value.map(i => ({
        skuId: i.skuId,
        quantity: i.quantity,
        price: i.price
      }))
    };

    // 2️⃣ Gọi API backend tạo đơn COD
    const res = await axios.post("http://localhost:8080/api/order-cod", orderPayload);

    const order = res.data;

    if (order && order.id) {
      alert(`Đặt hàng COD thành công! Mã đơn hàng: #${order.id}`);
      // Xoá giỏ hàng sau khi đặt
      sessionStorage.removeItem("cart");
      cartItems.value = [];
      // Redirect hoặc làm gì đó nếu muốn
    } else {
      alert("Đặt hàng COD thất bại!");
    }
  } catch (err) {
    console.error("❌ Lỗi tạo đơn COD:", err);
    alert("Đặt hàng COD thất bại!");
  }
};

const fetchCartFromSessionStorage = () => {
  const stored = JSON.parse(sessionStorage.getItem("checkoutItems") || "[]");
  cartItems.value = stored.map((item) => ({
    id: item.id,
    skuId: item.skuId,
    productName: item.productName || "Sản phẩm",
    price: item.price || 0,
    quantity: item.quantity || 1,
    image: item.image || "/images/default-product.png",
    skuAttributes: Array.isArray(item.skuAttributes) ? item.skuAttributes : [],
    stock: item.stock || 0,
  }));
};


// ✅ Thêm callback VNPAY tại đây
onMounted(async () => {
  fetchCartFromSessionStorage();
  fetchAccountId();
  fetchProvinces();
  fetchAddresses();

  // 🔹 Khi người dùng quay lại từ trang VNPAY
  const urlParams = new URLSearchParams(window.location.search);
  const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
  const orderId = urlParams.get("orderId") || localStorage.getItem("orderId");

  if (vnp_ResponseCode && orderId) {
    if (vnp_ResponseCode === "00") {
      try {
        console.log("✅ Thanh toán VNPAY thành công, cập nhật đơn hàng...");
        await axios.post(
          `http://localhost:8080/api/order/vnpay-success/${orderId}`
        );
        alert("🎉 Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.");
        localStorage.removeItem("cart");
        localStorage.removeItem("checkoutItems");
        localStorage.removeItem("orderId");
        cartItems.value = [];
      } catch (error) {
        console.error("❌ Lỗi cập nhật đơn hàng sau VNPAY:", error);
        alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
      }
    } else {
      console.warn("⚠️ Thanh toán VNPAY thất bại hoặc bị hủy!");
      alert("Thanh toán không thành công hoặc đã bị hủy!");
    }

    // Xóa query khỏi URL
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
});
</script>


<style scoped>
.checkout-page {
  color: #1d1d1f;
}

.address-card:hover,
.payment-method:hover {
  border-color: #0d6efd;
  background-color: #f8f9ff;
  transition: 0.3s;
}

.modal-content {
  border: none;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
}

.summary-box img {
  object-fit: cover;
}
</style>
