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

              <div class="order-price-details mt-1">
                <div v-if="item.saleCount > 0" class="text-danger small">
                  {{ (item.flashSalePrice ?? item.price).toLocaleString("vi-VN") }} ₫ × {{ item.saleCount }}
                  <span class="text-muted">(Flash Sale)</span>
                </div>

                <div v-if="item.normalCount > 0" class="text-dark small">
                  {{ item.originalPrice.toLocaleString("vi-VN") }} ₫ × {{ item.normalCount }}
                  <span class="text-muted">(Giá gốc)</span>
                </div>
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
const fullAddress = computed(() => {
  if (!selectedAddress.value) return "";
  return selectedAddress.value.fulladdress || "";
});
const selectAddress = (a) => {
 
  selectedAddress.value = a; // computed fullAddress tự động cập nhật
  showAddressModal.value = false;
};
const closeModal = () => {
  showAddressModal.value = false;
  selectedProvince.value = "";
  selectedDistrict.value = "";
  selectedWard.value = "";
  specificAddress.value = "";
};

const saveAddress = async () => {
  // Kiểm tra dữ liệu bắt buộc
  if (!specificAddress.value || !selectedProvince.value || !selectedDistrict.value || !selectedWard.value) {
    alert("Vui lòng nhập đầy đủ thông tin địa chỉ!");
    return;
  }

  // Lấy tên tỉnh/quận/phường
  const provinceName = provinces.value.find(p => p.ProvinceID === selectedProvince.value)?.ProvinceName || "";
  const districtName = districts.value.find(d => d.DistrictID === selectedDistrict.value)?.DistrictName || "";
  const wardName = wards.value.find(w => w.WardCode === selectedWard.value)?.WardName || "";

  // Cập nhật selectedAddress
  selectedAddress.value = {
    detail: specificAddress.value,
    ward: wardName,
    district: districtName,
    province: provinceName,
    ward_code: selectedWard.value,
    district_id: selectedDistrict.value,
    province_id: selectedProvince.value,
    fulladdress: `${specificAddress.value}, ${wardName}, ${districtName}, ${provinceName}`
  };

  try {
    // Gửi lên backend
    await axios.post("/api/address", {
      province_id: selectedProvince.value,
      district_id: selectedDistrict.value,
      ward_code: selectedWard.value,
      address: specificAddress.value,
      fulladdress: fullAddress.value, // dùng computed luôn
      defaultAddress: false,
      active: true,
      accountId: accountId.value,
    });

    closeModal();       // Đóng modal và reset input
    await fetchAddresses(); // Lấy lại danh sách địa chỉ
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
   if (newVal) fetchShippingFee() ;
  //shippingFee.value = 0; // set phí ship = 0 để test
});


const handlePayment = async () => {
  const uniqueOrderId = "DH" + Date.now();

  try {
    // Kiểm tra địa chỉ giao hàng
    if (!selectedAddress.value) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng chọn địa chỉ giao hàng!",
        text: "Bạn cần chọn địa chỉ giao hàng trước khi thanh toán.",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    // Kiểm tra phương thức thanh toán
    if (!selectedPaymentMethod.value) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng chọn phương thức thanh toán!",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    // Kiểm tra số điện thoại người nhận
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
//orderId: uniqueOrderId,
  accountId: accountId.value,
  shippingAddress: selectedAddress.value?.fulladdress || "", // thay đổi đây
  paymentMethodId: selectedPaymentMethod.value,
  feeship: Number(shippingFee.value) || 0,
  total: Number(totalPayment.value) || 0,
  paymentStatus: false, // camelCase
  discount: Number(discountAmount.value) || 0,
  voucherId: selectedVoucher.value ? selectedVoucher.value.id : null,
  shippingPhone: shippingPhone.value,
  statusId: 1, // PENDING
  orderDetails: cartItems.value.map((i) => ({
    skuId: i.skuId,
    quantity: i.quantity,
    price: i.price,
    // productId: i.productId // thêm nếu backend cần
  })),
};

console.log("Order Payload:", orderPayload);
    // Xử lý thanh toán qua VNPAY
    if (selectedPaymentMethod.value === 1) {
      const res = await axios.post("/api/vnpay/create", {
        amount: orderPayload.total,
          // orderId: uniqueOrderId,   // gửi orderId từ FE

        orderInfo: orderPayload.orderId,
      });     

      if (res.data?.paymentUrl) {
        sessionStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
        window.location.href = res.data.paymentUrl;
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Không thể khởi tạo thanh toán VNPAY",
          text: "Vui lòng thử lại sau.",
        });
      }
    }

    // Xử lý thanh toán qua MOMO
   // MOMO
if (selectedPaymentMethod.value === 3) { // MOMO
  try {
    const res = await axios.post("/api/momo/create", orderPayload);

    console.log("MOMO create response:", res.data);

    // Lấy link thanh toán
    const paymentUrl = res?.data?.payUrl || res?.data?.data?.payUrl;

    if (paymentUrl) {
      // redirect sang MoMo
      window.location.href = paymentUrl;
      return;
    } else {
      Swal.fire({
        icon: "error",
        title: "Không thể khởi tạo thanh toán MOMO",
        text: JSON.stringify(res?.data),
      });
      return;
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Lỗi khi kết nối MOMO",
      text: err?.response?.data?.message || err.message,
    });
  }
}



    // Xử lý COD
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
  console.log("🔥 handlePaymentCallback chạy rồi");

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
    const momoResultCode = urlParams.get("resultCode");

    const pendingOrderStr = sessionStorage.getItem("pendingOrder");
    const token = localStorage.getItem("token"); // JWT lưu trong localStorage
    console.log("JWT token:", token);

    if (!token) {
      await Swal.fire({
        icon: "error",
        title: "Bạn chưa đăng nhập!",
        text: "Vui lòng đăng nhập trước khi thanh toán.",
      });
      window.location.href = "/login";
      return;
    }

    // ----- Xử lý MOMO -----
    if (momoResultCode === "0") {
      // MOMO đã thanh toán thành công trước đó, chỉ thông báo
      sessionStorage.removeItem("pendingOrder");
      await Swal.fire({
        icon: "success",
        title: "Thanh toán MOMO thành công!",
        text: "Đơn hàng của bạn đã được ghi nhận.",
      });
      window.location.href = "/orders";
      return;
    }

    // ----- Xử lý VNPAY -----
    if (vnp_ResponseCode === "00") {
      if (!pendingOrderStr) {
        await Swal.fire({
          icon: "error",
          title: "Không tìm thấy thông tin đơn hàng!",
          text: "Vui lòng kiểm tra lại giỏ hàng.",
        });
        window.location.href = "/cart";
        return;
      }

      const orderPayload = JSON.parse(pendingOrderStr);
      try {
        // Tạo order trên backend
        console.log("Token sent to backend:", token);
        const createdOrderRes = await axios.post(
          "http://localhost:8080/api/order",
          orderPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const orderId = createdOrderRes.data?.id || createdOrderRes.data;

        // Gọi backend thông báo VNPAY success
        try {
          await axios.post(
            `http://localhost:8080/api/order/vnpay-success/${orderId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (e) {
          console.warn("Không thể gọi /vnpay-success:", e);
        }

        // Xóa session tạm
        sessionStorage.removeItem("pendingOrder");
        sessionStorage.removeItem("cart");
        sessionStorage.removeItem("checkoutItems");

        // Thông báo thành công
        await Swal.fire({
          icon: "success",
          title: "Thanh toán VNPAY thành công!",
          text: "Đơn hàng của bạn đã được ghi nhận.",
        });
        window.location.href = "/orders";
      } catch (err) {
        console.error("Lỗi khi tạo đơn hàng VNPAY:", err);
        await Swal.fire({
          icon: "error",
          title: "Lỗi khi lưu đơn hàng",
          text: "Vui lòng liên hệ quản trị viên.",
        });
        window.location.href = "/cart";
      }
      return;
    }

    // ----- Thanh toán thất bại hoặc hủy -----
    sessionStorage.removeItem("pendingOrder");
    await Swal.fire({
      icon: "error",
      title: "Thanh toán thất bại hoặc đã bị hủy!",
    });
    window.location.href = "/cart";

  } catch (err) {
    console.error("handlePaymentCallback unexpected error:", err);
    await Swal.fire({
      icon: "error",
      title: "Có lỗi xảy ra!",
      text: "Vui lòng thử lại sau.",
    });
    window.location.href = "/cart";
  } finally {
    // Xóa query params khỏi URL
    window.history.replaceState(
      {},
      document.title,
      window.location.origin + window.location.pathname
    );
  }
};



onMounted(async () => {
  fetchCartFromSessionStorage();
  fetchAccountId();
  await fetchProvinces();
  await fetchAddresses();
  await fetchPaymentMethods();
  await fetchVouchers();
const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("vnp_ResponseCode") || urlParams.get("resultCode")) {
    await handlePaymentCallback();
  }
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
