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
          <div v-for="item in cartItems" :key="item.skuId"
            class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <div class="d-flex align-items-center">
              <img :src="item.image || '/images/default-product.png'" alt="product image" class="rounded me-3 border"
                width="60" height="60" style="object-fit: cover;" />
              <div>
                <div class="fw-semibold">{{ item.productName || 'Sản phẩm' }}</div>

                <!-- Hiển thị thuộc tính SKU -->
                <div v-if="Array.isArray(item.skuAttributes) && item.skuAttributes.length > 0" class="text-muted small">
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

          <!-- Chọn phương thức thanh toán -->
          <h5 class="fw-bold mb-2 mt-3">Phương thức thanh toán</h5>
          <div v-for="method in paymentMethods" :key="method.id" class="form-check mb-2">
            <input class="form-check-input" type="radio" :id="'payment-' + method.id" :value="method.id"
              v-model="selectedPaymentMethod" />
            <label class="form-check-label" :for="'payment-' + method.id">
              {{ method.name }}
            </label>
          </div>

          <button class="btn btn-dark w-100 rounded-pill py-2 fw-semibold mt-3" @click="handlePayment">
            Thanh toán
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
import axios from "@/composables/axios.js";

// Địa chỉ
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
const selectedPaymentMethod = ref(null);

// Giỏ hàng
const cartItems = ref([]);
const shippingFee = ref(0);
const storeDistrictId = 1451;

// Account
const accountId = ref(null);
const fetchAccountId = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try { accountId.value = JSON.parse(atob(token.split(".")[1])).id; }
    catch (e) { console.error(e); }
  }
};

// Tổng tiền
const totalProductPrice = computed(() =>
  cartItems.value.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0)
);
const totalPayment = computed(() => totalProductPrice.value + (shippingFee.value || 0));

// Payment methods
const paymentMethods = ref([]);
const selectedPaymentMethod = ref(null);
const fetchPaymentMethods = async () => {
  try {
    const res = await axios.get("/api/payment-method");
    paymentMethods.value = res.data.data || [];
    if (paymentMethods.value.length) selectedPaymentMethod.value = paymentMethods.value[0].id;
  } catch (err) { console.error(err); }
};

// Load cart
const fetchCartFromSessionStorage = () => {
  const stored = JSON.parse(sessionStorage.getItem("checkoutItems") || "[]");
  cartItems.value = stored.map(item => ({
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

// Địa chỉ API
const fetchProvinces = async () => { provinces.value = (await axios.get("/api/ghn/provinces")).data; };
const fetchDistricts = async () => {
  if (!selectedProvince.value) return;
  districts.value = (await axios.get(`/api/ghn/districts?provinceId=${selectedProvince.value}`)).data;
  wards.value = []; selectedDistrict.value = ""; selectedWard.value = "";
};
const fetchWards = async () => {
  if (!selectedDistrict.value) return;
  wards.value = (await axios.get(`/api/ghn/wards?districtId=${selectedDistrict.value}`)).data;
  selectedWard.value = "";
};
const fetchAddresses = async () => {
  if (!accountId.value) return;
  addresses.value = (await axios.get(`/api/address/account/${accountId.value}`)).data || [];
};
const selectAddress = (a) => { selectedAddress.value = a; };
const closeModal = () => { showAddressModal.value = false; selectedProvince.value = ""; selectedDistrict.value = ""; selectedWard.value = ""; specificAddress.value = ""; };
const saveAddress = async () => {
  if (!specificAddress.value || !selectedProvince.value || !selectedDistrict.value || !selectedWard.value) {
    alert("Vui lòng nhập đầy đủ thông tin địa chỉ!"); return;
  }
  const provinceName = provinces.value.find(p => p.ProvinceID === selectedProvince.value)?.ProvinceName || "";
  const districtName = districts.value.find(d => d.DistrictID === selectedDistrict.value)?.DistrictName || "";
  const wardName = wards.value.find(w => w.WardCode === selectedWard.value)?.WardName || "";
  const fullAddress = `${specificAddress.value}, ${wardName}, ${districtName}, ${provinceName}`;
  try {
    await axios.post("/api/address", {
      province_id: selectedProvince.value, district_id: selectedDistrict.value, ward_code: selectedWard.value,
      address: specificAddress.value, fulladdress: fullAddress, defaultAddress: false, active: true, accountId: accountId.value
    });
    closeModal(); fetchAddresses();
  } catch (err) { console.error(err); alert("Không thể lưu địa chỉ."); }
};

// Ship fee
const fetchShippingFee = async () => {
  if (!selectedAddress.value) { shippingFee.value = 0; return; }
  try {
    const res = await axios.get("/api/ghn/fee", { params: { fromDistrictId: storeDistrictId, toDistrictId: Number(selectedAddress.value.district_id), toWardCode: String(selectedAddress.value.ward_code), weight: 1000 } });
    shippingFee.value = res.data?.total || res.data?.data?.total || 0;
  } catch (err) { shippingFee.value = 0; console.error(err); }
};
watch(selectedAddress, (newVal) => { if (newVal) fetchShippingFee(); });

// Thanh toán
const handlePayment = async () => {
  if (!selectedAddress.value) { alert("Vui lòng chọn địa chỉ giao hàng!"); return; }
  if (!selectedPaymentMethod.value) { alert("Vui lòng chọn phương thức thanh toán!"); return; }

  const orderPayload = {
    accountId: accountId.value,
    addressId: selectedAddress.value.id,
    paymentMethodId: selectedPaymentMethod.value,
    feeship: shippingFee.value,
    total: totalPayment.value,
    payment_status: false,
    discount: 0,
    voucherId: null,
    orderDetails: cartItems.value.map(i => ({ skuId: i.skuId, quantity: i.quantity, price: i.price }))
  };

  try {
    const orderRes = await axios.post("/api/order", orderPayload);
    const order = orderRes.data;

    sessionStorage.removeItem("cart");
    sessionStorage.removeItem("checkoutItems");
    sessionStorage.setItem("orderId", order.id);
    cartItems.value = [];

    if (selectedPaymentMethod.value === 1) { // VNPAY
      const vnpayRes = await axios.post("/api/vnpay/create", { orderId: order.id, amount: order.total });
      if (vnpayRes.data?.paymentUrl) window.location.href = vnpayRes.data.paymentUrl;
    } else if (selectedPaymentMethod.value === 2) { // MOMO
      const momoRes = await axios.post("/api/momo/create", { orderId: order.id, amount: order.total, orderInfo: "Thanh toán đơn hàng #" + order.id });
      if (momoRes.data?.resultCode === 0 && momoRes.data?.payUrl) window.location.href = momoRes.data.payUrl;
    } else if (selectedPaymentMethod.value === 5) { // COD
      window.location.href = "/orders";
    }
  } catch (err) { console.error(err); alert("Có lỗi khi thanh toán!"); }
};

// onMounted
onMounted(() => {
  fetchCartFromSessionStorage();
  fetchAccountId();
  fetchProvinces();
  fetchAddresses();
  fetchPaymentMethods();

  // Callback VNPAY / MoMo
  const urlParams = new URLSearchParams(window.location.search);
  const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
  const orderId = urlParams.get("orderId") || localStorage.getItem("orderId");

  if (vnp_ResponseCode && orderId) {
    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      axios.post(`/api/order/vnpay-success/${orderId}`)
        .then(() => {
          sessionStorage.removeItem("cart");
          sessionStorage.removeItem("checkoutItems");
          sessionStorage.removeItem("orderId");
          cartItems.value = [];
          window.location.href = "/orders"; // chuyển về trang đơn hàng của tôi
        })
        .catch(err => {
          console.error(err);
          alert("Lỗi cập nhật đơn hàng!");
        });
    } else {
      // Thanh toán hủy hoặc thất bại
      axios.post(`/api/order/cancel/${orderId}`)
        .then(() => {
          sessionStorage.removeItem("orderId");
          alert("Thanh toán bị hủy. Đơn hàng đã được huỷ.");
          window.location.href = "/cart"; // quay lại giỏ hàng
        })
        .catch(err => {
          console.error(err);
          alert("Có lỗi khi hủy đơn hàng!");
        });
    }

    // Xóa query params khỏi URL
    window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
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
  transition: .3s;
}

.modal-content {
  border: none;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
}

.summary-box img {
  object-fit: cover;
}
</style>
