<template>
  <div class="checkout-page container py-5 mt-5">
    <h2 class="fw-bold text-center mb-4">Thanh toán đơn hàng</h2>

    <div>
      <div class="bg-white rounded-4 shadow-sm p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Địa chỉ giao hàng</h5>
          <div>
            <button
              class="btn btn-outline-primary btn-sm rounded-pill px-3 me-2"
              @click="showSelectAddressModal = true"
            >
              <i class="bi bi-geo-alt"></i> Chọn địa chỉ
            </button>
            <button
              class="btn btn-outline-success btn-sm rounded-pill px-3"
              @click="showAddressModal = true"
            >
              <i class="bi bi-plus-circle"></i> Thêm địa chỉ
            </button>
          </div>
        </div>

        <div v-if="selectedAddress" class="rounded-3 p-3">
          <strong>Địa chỉ giao hàng:</strong> {{ selectedAddress.fulladdress }}
        </div>

        <div v-else class="text-muted fst-italic">
          Chưa chọn địa chỉ giao hàng nào.
        </div>

        <div class="mb-3 mt-3">
          <label for="shippingPhone" class="form-label fw-semibold"
            >Số điện thoại người nhận</label
          >
          <input
            id="shippingPhone"
            type="tel"
            v-model="shippingPhone"
            class="form-control"
            placeholder="Nhập số điện thoại..."
          />
        </div>
      </div>

      <div class="summary-box bg-white rounded-4 shadow-sm p-4">
        <h5 class="fw-bold mb-3">Đơn hàng</h5>

        <!-- Sản phẩm trong giỏ -->
        <div
          v-for="(item, idx) in cartItems"
          :key="item.skuId || item.id || idx"
          class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2"
        >
          <div class="d-flex align-items-center">
            <img
              :src="item.image || '/images/default-product.png'"
              alt="product image"
              class="rounded me-3 border"
              width="60"
              height="60"
              style="object-fit: cover"
            />
            <div>
              <div class="fw-semibold">
                {{ item.productName || "Sản phẩm" }}
              </div>

              <div
                v-if="
                  Array.isArray(item.skuAttributes) &&
                  item.skuAttributes.length > 0
                "
                class="text-muted small"
              >
                <div
                  v-for="attr in item.skuAttributes"
                  :key="attr.id || attr.optionAttributeName"
                >
                  <strong>{{ attr.optionAttributeName }}:</strong>
                  {{ attr.valueAttributeName }}
                </div>
              </div>

              <div class="text-muted small">
                {{ (Number(item.price) || 0).toLocaleString("vi-VN") }} VNĐ ×
                {{ item.quantity }}
              </div>
            </div>
          </div>
          <div class="fw-semibold">
            {{
              ((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString(
                "vi-VN"
              )
            }}
            VNĐ
          </div>
        </div>

        <div class="d-flex justify-content-between mb-2">
          <span>Phí vận chuyển</span>
          <strong
            >{{
              (Number(shippingFee) || 0).toLocaleString("vi-VN")
            }}
            VNĐ</strong
          >
        </div>

        <!-- Voucher -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-semibold">Mã giảm giá</span>
          <button
            class="btn btn-outline-primary btn-sm rounded-pill"
            @click="showVoucherModal = true"
          >
            Áp dụng voucher
          </button>
        </div>

        <!-- Giảm giá hiển thị -->
        <div
          v-if="selectedVoucher"
          class="d-flex justify-content-between text-success fw-semibold mb-2"
        >
          <span>Giảm giá</span>
          <span
            >-{{
              (Number(discountAmount) || 0).toLocaleString("vi-VN")
            }}
            VNĐ</span
          >
        </div>

        <div class="d-flex justify-content-between fw-bold border-top pt-2">
          <span>Tổng thanh toán</span>
          <span
            >{{ (Number(totalPayment) || 0).toLocaleString("vi-VN") }} VNĐ</span
          >
        </div>

        <!-- Chọn phương thức thanh toán -->
        <h5 class="fw-bold mb-2 mt-3">Phương thức thanh toán</h5>
        <div
          v-for="method in paymentMethods"
          :key="method.id"
          class="form-check mb-2"
        >
          <input
            class="form-check-input"
            type="radio"
            :id="'payment-' + method.id"
            :value="method.id"
            v-model="selectedPaymentMethod"
          />
          <label class="form-check-label" :for="'payment-' + method.id">{{
            method.name
          }}</label>
        </div>

        <button
          class="btn btn-dark w-100 rounded-pill py-2 fw-semibold mt-3"
          @click="handlePayment"
        >
          Thanh toán
        </button>
      </div>
    </div>

    <!-- MODAL CHỌN / XÓA ĐỊA CHỈ -->
    <div
      v-if="showAddressModal"
      class="modal fade show d-block"
      style="
        background: rgba(0, 0, 0, 0.5);
        z-index: 2000;
        position: fixed;
        inset: 0;
      "
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Thêm địa chỉ mới</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Tỉnh/Thành phố</label>
              <select
                v-model="selectedProvince"
                @change="fetchDistricts"
                class="form-select"
              >
                <option value="">-- Chọn tỉnh --</option>
                <option
                  v-for="p in provinces"
                  :key="p.ProvinceID"
                  :value="p.ProvinceID"
                >
                  {{ p.ProvinceName }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Quận/Huyện</label>
              <select
                v-model="selectedDistrict"
                @change="fetchWards"
                class="form-select"
                :disabled="!districts.length"
              >
                <option value="">-- Chọn quận/huyện --</option>
                <option
                  v-for="d in districts"
                  :key="d.DistrictID"
                  :value="d.DistrictID"
                >
                  {{ d.DistrictName }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Phường/Xã</label>
              <select
                v-model="selectedWard"
                class="form-select"
                :disabled="!wards.length"
              >
                <option value="">-- Chọn phường/xã --</option>
                <option
                  v-for="w in wards"
                  :key="w.WardCode"
                  :value="w.WardCode"
                >
                  {{ w.WardName }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Địa chỉ cụ thể</label>
              <input
                type="text"
                v-model="specificAddress"
                class="form-control"
                placeholder="Ví dụ: 123 Đường ABC..."
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Hủy</button>
            <button class="btn btn-primary" @click="saveAddress">
              Lưu địa chỉ
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showSelectAddressModal"
      class="modal fade show d-block"
      style="
        background: rgba(0, 0, 0, 0.5);
        z-index: 2000;
        position: fixed;
        inset: 0;
      "
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Chọn địa chỉ giao hàng</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeSelectAddressModal"
            ></button>
          </div>

          <div class="modal-body">
            <div v-if="addresses.length">
              <div
                v-for="a in addresses"
                :key="a.id"
                class="border rounded-3 p-3 mb-2 d-flex justify-content-between align-items-center"
                :class="{
                  'border-primary bg-light': selectedAddress?.id === a.id,
                }"
              >
                <div @click="selectAddress(a)" style="cursor: pointer; flex: 1">
                  <strong>{{ a.fulladdress }}</strong>
                </div>
                <button
                  class="btn btn-sm btn-outline-danger ms-2"
                  @click.stop="deleteAddress(a.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            <div v-else class="text-muted fst-italic">
              Chưa có địa chỉ nào được lưu.
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeSelectAddressModal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL CHỌN VOUCHER -->
    <div
      v-if="showVoucherModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="
        background: rgba(0, 0, 0, 0.5);
        z-index: 2000;
        position: fixed;
        inset: 0;
      "
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Chọn mã giảm giá</h5>
            <button
              type="button"
              class="btn-close"
              @click="showVoucherModal = false"
            ></button>
          </div>

          <div class="modal-body" style="max-height: 400px; overflow-y: auto">
            <div v-if="vouchers.length">
              <div
                v-for="v in vouchers"
                :key="v.id"
                class="border p-3 rounded-3 mb-2 voucher-item"
                :class="{ active: selectedVoucher?.id === v.id }"
                @click="applyVoucher(v)"
              >
                <div class="fw-bold">{{ v.title || "Voucher" }}</div>
                <div>{{ v.code || "-" }}</div>

                <div class="small mt-1">
                  Giảm:
                  <span class="text-success fw-semibold">
                    {{
                      v.type
                        ? v.discount
                          ? v.discount + "%"
                          : "0%"
                        : (Number(v.discount) || 0).toLocaleString("vi-VN") +
                          " ₫"
                    }}
                  </span>
                  (Tối đa
                  {{ (Number(v.discount_max) || 0).toLocaleString("vi-VN") }} ₫)
                </div>
                <div class="text-muted small">
                  Đơn tối thiểu:
                  {{
                    (Number(v.usage_condition) || 0).toLocaleString("vi-VN")
                  }}
                  ₫
                </div>
                <hr />
                <div class="small text-muted">{{ v.description || "" }}</div>
              </div>
            </div>
            <div v-else class="text-center text-muted fst-italic">
              Không có voucher khả dụng
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showVoucherModal = false">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";

// --- Refs ---
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
const shippingPhone = ref("");

const cartItems = ref([]);
const shippingFee = ref(0);
const storeDistrictId = 1451;
const accountId = ref(null);

const showVoucherModal = ref(false);
const vouchers = ref([]);
const selectedVoucher = ref(null);
const discountAmount = ref(0);
const showSelectAddressModal = ref(false);

const paymentMethods = ref([]);
const selectedPaymentMethod = ref(null);

// --- Helpers ---
const fetchAccountId = () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || "{}"));
    accountId.value = payload?.id ?? null;
    console.log("Account ID:", accountId.value);
  } catch (err) {
    console.error("Invalid token payload", err);
  }
};

const totalProductPrice = computed(() =>
  cartItems.value.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1),
    0
  )
);

const totalPayment = computed(() => {
  return (
    (totalProductPrice.value || 0) +
    (Number(shippingFee.value) || 0) -
    (Number(discountAmount.value) || 0)
  );
});

const fetchPaymentMethods = async () => {
  try {
    const res = await axios.get("/api/payment-method");
    paymentMethods.value = res.data?.data || [];
    if (paymentMethods.value.length)
      selectedPaymentMethod.value = paymentMethods.value[0].id;
  } catch (err) {
    console.error("fetchPaymentMethods error", err);
  }
};

const fetchCartFromSessionStorage = () => {
  const stored = JSON.parse(sessionStorage.getItem("checkoutItems") || "[]");
  cartItems.value = stored.map((item) => ({
    id: item.id,
    skuId: item.skuId,
    productName: item.productName || "Sản phẩm",
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
    image: item.image || "/images/default-product.png",
    skuAttributes: Array.isArray(item.skuAttributes) ? item.skuAttributes : [],
    stock: item.stock || 0,
  }));
};

const fetchVouchers = async () => {
  try {
    const res = await axios.get("/api/voucher");
    vouchers.value = res.data?.data || [];
  } catch (err) {
    console.error("Lỗi khi tải voucher:", err);
  }
};

const applyVoucher = (v) => {
  const usageCond = Number(v?.usage_condition) || 0;
  if (totalProductPrice.value < usageCond) {
    Swal.fire({
      icon: "warning",
      title: "Không đủ điều kiện!",
      text: `Đơn hàng cần tối thiểu ${usageCond.toLocaleString(
        "vi-VN"
      )} ₫ để áp dụng mã này.`,
      confirmButtonText: "Đã hiểu",
    });
    return;
  }

  selectedVoucher.value = v;
  const discount = v?.type
    ? (totalProductPrice.value * (Number(v.discount) || 0)) / 100
    : Number(v.discount) || 0;
  discountAmount.value = Math.min(
    discount,
    Number(v?.discount_max) || discount
  );
  showVoucherModal.value = false;
};

// --- Address APIs ---
const closeSelectAddressModal = () => {
  showSelectAddressModal.value = false;
};

const deleteAddress = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
  try {
    await axios.delete(`/api/address/${id}`);
    if (selectedAddress.value?.id === id) selectedAddress.value = null;
    await fetchAddresses();
    alert("Đã xóa địa chỉ thành công!");
  } catch (err) {
    console.error(err);
    alert("Không thể xóa địa chỉ!");
  }
};

const fetchProvinces = async () => {
  try {
    const res = await axios.get("/api/ghn/provinces");
    provinces.value = res.data || [];
  } catch (err) {
    console.error("fetchProvinces", err);
  }
};

const fetchDistricts = async () => {
  if (!selectedProvince.value) return;
  try {
    const res = await axios.get(
      `/api/ghn/districts?provinceId=${selectedProvince.value}`
    );
    districts.value = res.data || [];
    wards.value = [];
    selectedDistrict.value = "";
    selectedWard.value = "";
  } catch (err) {
    console.error("fetchDistricts", err);
  }
};

const fetchWards = async () => {
  if (!selectedDistrict.value) return;
  try {
    const res = await axios.get(
      `/api/ghn/wards?districtId=${selectedDistrict.value}`
    );
    wards.value = res.data || [];
    selectedWard.value = "";
  } catch (err) {
    console.error("fetchWards", err);
  }
};

const fetchAddresses = async () => {
  if (!accountId.value) return;
  try {
    const res = await axios.get(`/api/address/account/${accountId.value}`);
    addresses.value = (res.data || []).sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error("fetchAddresses", err);
  }
};

const selectAddress = (a) => {
  selectedAddress.value = a;
};
const closeModal = () => {
  showAddressModal.value = false;
  selectedProvince.value = "";
  selectedDistrict.value = "";
  selectedWard.value = "";
  specificAddress.value = "";
};

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
    await axios.post("/api/address", {
      province_id: selectedProvince.value,
      district_id: selectedDistrict.value,
      ward_code: selectedWard.value,
      address: specificAddress.value,
      fulladdress: fullAddress,
      defaultAddress: false,
      active: true,
      accountId: accountId.value,
    });
    closeModal();
    await fetchAddresses();
  } catch (err) {
    console.error(err);
    alert("Không thể lưu địa chỉ.");
  }
};

// --- Shipping fee ---
const fetchShippingFee = async () => {
  if (!selectedAddress.value || !selectedAddress.value.district_id) {
    shippingFee.value = 0;
    return;
  }
  try {
    const res = await axios.get("/api/ghn/fee", {
      params: {
        fromDistrictId: storeDistrictId,
        toDistrictId: Number(selectedAddress.value.district_id),
        toWardCode: String(selectedAddress.value.ward_code),
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

// --- Payment flow ---
const handlePayment = async () => {
  const uniqueOrderId = "DH" + Date.now();

  if (!selectedAddress.value) {
    Swal.fire({
      icon: "warning",
      title: "Vui lòng chọn địa chỉ giao hàng!",
      text: "Bạn cần chọn địa chỉ giao hàng trước khi thanh toán.",
      confirmButtonText: "Đã hiểu",
    });
    return;
  }
  if (!selectedPaymentMethod.value) {
    Swal.fire({
      icon: "warning",
      title: "Vui lòng chọn phương thức thanh toán!",
      confirmButtonText: "Đã hiểu",
    });
    return;
  }
  if (!shippingPhone.value) {
    Swal.fire({
      icon: "warning",
      title: "Thiếu số điện thoại!",
      text: "Vui lòng nhập số điện thoại người nhận trước khi thanh toán.",
      confirmButtonText: "Đã hiểu",
    });
    return;
  }

  const orderPayload = {
    orderId: uniqueOrderId,
    accountId: accountId.value,
    addressId: selectedAddress.value.id,
    paymentMethodId: selectedPaymentMethod.value,
    feeship: Number(shippingFee.value) || 0,
    total: Number(totalPayment.value) || 0,
    payment_status: false,
    discount: Number(discountAmount.value) || 0,
    voucherId: selectedVoucher.value ? selectedVoucher.value.id : null,
    shippingPhone: shippingPhone.value,
    orderDetails: cartItems.value.map((i) => ({
      skuId: i.skuId,
      quantity: i.quantity,
      price: i.price,
    })),
  };

  console.log("Order Payload:", orderPayload);

  try {
    // VNPAY
    if (selectedPaymentMethod.value === 1) {
      const res = await axios.post("/api/vnpay/create", {
        amount: orderPayload.total,
        orderInfo: "Thanh toán đơn hàng qua VNPAY",
      });
      if (res.data?.paymentUrl) {
        sessionStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
        window.location.href = res.data.paymentUrl;
        return;
      }
    }

    // MOMO
    if (selectedPaymentMethod.value === 3) {
      const res = await axios.post("/api/momo/create", {
        orderId: orderPayload.orderId,
        amount: orderPayload.total,
        orderInfo: "Thanh toán đơn hàng qua MOMO",
      });
      if (res.data?.paymentUrl) {
        sessionStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
        window.location.href = res.data.paymentUrl;
        return;
      }
    }

    // COD
    if (selectedPaymentMethod.value === 2) {
      const orderRes = await axios.post("/api/order", orderPayload);
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("checkoutItems");
      cartItems.value = [];
      window.location.href = "/orders";
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Không thể khởi tạo thanh toán",
      text: "Vui lòng thử lại sau.",
    });
  } catch (err) {
    console.error("handlePayment error", err);
    Swal.fire({
      icon: "error",
      title: "Có lỗi khi thanh toán!",
      text: "Vui lòng thử lại sau.",
    });
  }
};

// Handle callback from payment gateways
const handlePaymentCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
  const momoResultCode = urlParams.get("resultCode");
  const paymentSuccess = vnp_ResponseCode === "00" || momoResultCode === "0";
  const pendingOrder = sessionStorage.getItem("pendingOrder");

  if (pendingOrder && paymentSuccess) {
    try {
      const orderPayload = JSON.parse(pendingOrder);
      const createdOrder = await axios.post("/api/order", orderPayload);
      const orderId = createdOrder.data?.id || createdOrder.data;

      // call vnpay-success endpoint if exists
      try {
        await axios.post(`/api/order/vnpay-success/${orderId}`);
      } catch (e) {
        console.warn("Could not call vnpay-success", e);
      }

      sessionStorage.removeItem("pendingOrder");
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("checkoutItems");
      cartItems.value = [];

      Swal.fire({
        icon: "success",
        title: "Thanh toán thành công!",
        text: "Đơn hàng của bạn đã được ghi nhận.",
      }).then(() => (window.location.href = "/orders"));
    } catch (err) {
      console.error("Error creating order after payment", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi khi lưu đơn hàng",
        text: "Vui lòng liên hệ quản trị viên.",
      });
    }
  } else if (vnp_ResponseCode || momoResultCode) {
    // failed or canceled
    sessionStorage.removeItem("pendingOrder");
    Swal.fire({
      icon: "error",
      title: "Thanh toán thất bại hoặc đã bị hủy!",
    }).then(() => (window.location.href = "/cart"));
  }

  // Clean query params
  window.history.replaceState(
    {},
    document.title,
    window.location.origin + window.location.pathname
  );
};

onMounted(async () => {
  fetchCartFromSessionStorage();
  fetchAccountId();
  await fetchProvinces();
  await fetchAddresses();
  await fetchPaymentMethods();
  await fetchVouchers();
  await handlePaymentCallback();
});
</script>

<style scoped>
.checkout-page {
  color: #1d1d1f;
  max-width: 900px;
  margin: 0 auto;
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
.address-item {
  transition: all 0.25s ease;
}
.address-item:hover {
  background: #f8f9ff;
  border-color: #0d6efd;
}
.modal.show.d-block {
  z-index: 1 !important;
  position: fixed !important;
  inset: 0 !important;
}
</style>
