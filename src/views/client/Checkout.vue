<template>
  <div class="checkout-page container py-5 mt-5">
    <h2 class="fw-bold text-center mb-4">Thanh toán đơn hàng</h2>

    <div>
      <div class="bg-white rounded-4 shadow-sm p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Thông tin giao hàng của bạn</h5>
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

        <div v-if="selectedAddress">
          <div>
            <strong>Địa chỉ giao hàng:</strong> {{ selectedAddress.fulladdress }}
          </div>
          <div>
            <strong>Tên người nhận: </strong>
            <span v-if="!editing"> {{ selectedAddress.receiverName }}</span>
            <input
              type="text"
              v-else
              v-model="shippingName"
              class="form-control"
            />
            <div v-if="errorName" class="text-danger small">
              Tên người nhận không được để trống.
            </div>
          </div>
          <div>
            <strong>Số điện thoại: </strong>
            <span v-if="!editing"> {{ selectedAddress.receiverPhone }}</span>
            <input
              type="tel"
              v-else
              v-model="shippingPhone"
              class="form-control"
            />
            <div v-if="errorPhone" class="text-danger small">
              Số điện thoại không hợp lệ. (Yêu cầu 10 chữ số)
            </div>
          </div>
          <button v-if="!editing" @click="editing = true" class="btn btn-sm btn-outline-primary mt-2">
            Sửa
          </button>
          <button
            v-else
            @click="updateAddress"
            :disabled="!shippingName || !shippingPhone"
            class="btn btn-sm btn-primary mt-2"
          >
            Cập nhật
          </button>
        </div>
      </div>

      <div class="summary-box bg-white rounded-4 shadow-sm p-4">
        <h5 class="fw-bold mb-3">Đơn hàng</h5>

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
     

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-semibold">Mã giảm giá</span>
          <button
            class="btn btn-outline-primary btn-sm rounded-pill"
            @click="showVoucherModal = true"
          >
            Áp dụng voucher
          </button>
        </div>

   <div v-if="productVoucher" class="d-flex justify-content-between align-items-center mb-2">
  <span class="d-flex align-items-center">
    Giảm giá sản phẩm ({{ productVoucher.code }})
    <button class="btn btn-sm btn-outline-danger ms-2 p-0 px-1 py-0" @click="applyVoucher(productVoucher)">
      Bỏ
    </button>
  </span>
  <span class="text-success fw-semibold">
    -{{ (Number(productDiscountAmount) || 0).toLocaleString("vi-VN") }} VNĐ
  </span>
</div>

<div v-if="shippingVoucher" class="d-flex justify-content-between align-items-center mb-2">
  <span class="d-flex align-items-center">
    Giảm giá vận chuyển ({{ shippingVoucher.code }})
    <button class="btn btn-sm btn-outline-danger ms-2 p-0 px-1 py-0" @click="applyVoucher(shippingVoucher)">
      Bỏ
    </button>
  </span>
  <span class="text-success fw-semibold">
    -{{ (Number(shippingDiscountAmount) || 0).toLocaleString("vi-VN") }} VNĐ
  </span>
</div>



<div class="d-flex justify-content-between fw-bold border-top pt-2">
          <span>Tổng thanh toán</span>
          <span
            >{{ (Number(totalPayment) || 0).toLocaleString("vi-VN") }} VNĐ</span
          >
        </div>

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

    <div
      v-if="showAddressModal"
      class="modal fade show d-block"
      style="background: rgba(0, 0, 0, 0.5); z-index: 2000; position: fixed; inset: 0; max-width: 500px; margin: 1.75rem auto;"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Thêm địa chỉ mới</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Tên người nhận</label>
              <input
                type="text"
                v-model="shippingName"
                class="form-control"
                placeholder="Nhập tên người nhận"
              />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Số điện thoại người nhận</label>
              <input
                type="tel"
                v-model="shippingPhone"
                class="form-control"
                placeholder="Nhập số điện thoại"
              />
            </div>

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
                @click="selectAddress(a)"
                style="cursor: pointer"
              >
                <div style="flex: 1">
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
                :class="{ 
                  active: (v.type === true && productVoucher?.id === v.id) || 
                          (v.type === false && shippingVoucher?.id === v.id) 
                }"
                @click="applyVoucher(v)"
              >
                <div class="fw-bold">{{ v.title || "Voucher" }}</div>
                <div>{{ v.code || "-" }}</div>

                <div class="small mt-1">
                  Giảm:
                  <span class="text-success fw-semibold">
                    {{
                      (v.type === true || v.type === 1)
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
const productVoucher = ref(null); // Lưu voucher Sản phẩm (type = true/1)
const shippingVoucher = ref(null); // Lưu voucher Vận chuyển (type = false/0)
// Thay thế discountAmount bằng 2 biến chi tiết hơn
const productDiscountAmount = ref(0); // Giảm giá sản phẩm (type = 1)
const shippingDiscountAmount = ref(0); // Giảm giá vận chuyển (type = 0)
const showSelectAddressModal = ref(false);

const paymentMethods = ref([]);
const selectedPaymentMethod = ref(null);
const shippingName = ref(""); 
const shippingPhone = ref(""); 
const editing = ref(false); 
   const errorName = ref(false);  
    const errorPhone = ref(false); 
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
    // Phí vận chuyển cuối cùng = Phí vận chuyển gốc - Giảm giá vận chuyển
    const finalShippingFee = Math.max(0, (Number(shippingFee.value) || 0) - (Number(shippingDiscountAmount.value) || 0));

    // Tổng thanh toán = Tổng tiền hàng - Giảm giá sản phẩm + Phí vận chuyển cuối cùng
    return (
        (totalProductPrice.value || 0) -
        (Number(productDiscountAmount.value) || 0) +
        finalShippingFee
    );
});

// Thêm computed cho tổng giảm giá để hiển thị trên giao diện (nếu muốn)
const totalDiscountAmount = computed(() => {
    return (Number(productDiscountAmount.value) || 0) + (Number(shippingDiscountAmount.value) || 0);
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
  const DEFAULT_ITEM_WEIGHT = 500;
  cartItems.value = stored.map((item) => ({
    id: item.id,
    skuId: item.skuId,
    productName: item.productName || "Sản phẩm",
    
    // Thêm các thuộc tính Flash Sale
    flashSaleSkuId: item.flashSaleSkuId ?? null,     
    flashSalePrice: Number(item.flashSalePrice) || null, 
    originalPrice: Number(item.originalPrice) || Number(item.price) || 0,
    saleCount: Number(item.saleCount) || 0,        
    normalCount: Number(item.normalCount) || 0,      
    type: item.type,                              

    // Các thuộc tính gốc
    price: Number(item.price) || 0, // Giá hiển thị (có thể là giá FS hoặc giá gốc)
    quantity: Number(item.quantity) || 1,
    image: item.image || "/images/default-product.png",
    skuAttributes: Array.isArray(item.skuAttributes) ? item.skuAttributes : [],
    stock: item.stock || 0,
    weight: Number(item.weight) || DEFAULT_ITEM_WEIGHT,
  }));
  console.log("Cart Items:", cartItems.value);  // Kiểm tra cartItems

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
    // 1. Xử lý logic chọn/hủy voucher
    
    let isCancelled = false;
    
    // Voucher Sản phẩm (type = true/1)
    if ((v.type === true || v.type === 1) && productVoucher.value?.id === v.id) {
        productVoucher.value = null; // Hủy chọn
        isCancelled = true;
    } 
    // Voucher Vận chuyển (type = false/0)
    else if ((v.type === false || v.type === 0) && shippingVoucher.value?.id === v.id) {
        shippingVoucher.value = null; // Hủy chọn
        isCancelled = true;
    }

    if (isCancelled) {
        // Sau khi hủy chọn, tính lại tổng tiền
        calculateDiscounts();
        showVoucherModal.value = false;
        return;
    }

    // 2. Kiểm tra điều kiện sử dụng (usage_condition) khi ÁP DỤNG MỚI
    const usageCond = Number(v?.usage_condition) || 0;
    if (totalProductPrice.value < usageCond) {
        Swal.fire({
            icon: "warning",
            title: "Không đủ điều kiện!",
            text: `Đơn hàng cần tối thiểu ${usageCond.toLocaleString("vi-VN")} ₫ để áp dụng mã này.`,
            confirmButtonText: "Đã hiểu",
        });
        return;
    }

    // 3. Áp dụng voucher mới: LƯU VÀO BIẾN ĐÚNG LOẠI
    // KHÔNG ghi đè voucher loại khác
    if (v.type === true || v.type === 1) {
        productVoucher.value = v;
    } else if (v.type === false || v.type === 0) {
        shippingVoucher.value = v;
    } else {
        console.error("Voucher type không hợp lệ");
    }
    calculateDiscounts(); 
    showVoucherModal.value = false;
};
// Hàm tính toán và cập nhật các ref giảm giá
const calculateDiscounts = () => {
    // 1. TÍNH GIẢM GIÁ SẢN PHẨM
    let calculatedProductDiscount = 0;
    if (productVoucher.value) {
        const v = productVoucher.value;
        const discountValue = Number(v.discount) || 0;
        const discountMax = Number(v.discount_max) || 0;
        const usageCond = Number(v.usage_condition) || 0; // Thêm dòng này

        // CHỈ TÍNH KHI THỎA MÃN ĐIỀU KIỆN TỐI THIỂU
        if (totalProductPrice.value >= usageCond) { // Thêm điều kiện này
            if (v.type === true || v.type === 1) {
                // VOUCHER SẢN PHẨM
                if (discountValue > 0 && discountValue <= 100) {
                    calculatedProductDiscount = (totalProductPrice.value * discountValue) / 100;
                } else {
                    calculatedProductDiscount = discountValue;
                }
                calculatedProductDiscount = Math.min(calculatedProductDiscount, discountMax);
            }
        }
    }
    productDiscountAmount.value = calculatedProductDiscount;
    // 2. TÍNH GIẢM GIÁ VẬN CHUYỂN
    let calculatedShippingDiscount = 0;
    if (shippingVoucher.value) {
        const v = shippingVoucher.value;
        const currentShippingFee = Number(shippingFee.value) || 0;
        const discountValue = Number(v.discount) || 0;
        const discountMax = Number(v.discount_max) || 0;

        if (v.type === false || v.type === 0) {
            // VOUCHER VẬN CHUYỂN
            calculatedShippingDiscount = Math.min(
                discountValue, 
                discountMax, 
                currentShippingFee
            );
        }
    }
    shippingDiscountAmount.value = calculatedShippingDiscount;
};

// --- Address APIs ---
const closeSelectAddressModal = () => {
  showSelectAddressModal.value = false;
};
const updateAddress = async () => {
  if (!selectedAddress.value || !selectedAddress.value.id) {
    alert("Chưa chọn địa chỉ để cập nhật!");
    return;
  }

  // Kiểm tra tên người nhận
  if (!shippingName.value || shippingName.value.trim() === "") {
    errorName.value = true;
    return;
  } else {
    errorName.value = false;
  }

  // Kiểm tra số điện thoại
  const phonePattern = /^[0-9]{10}$/; // Định dạng số điện thoại (10 chữ số)
  if (!shippingPhone.value || !phonePattern.test(shippingPhone.value)) {
    errorPhone.value = true;
    return;
  } else {
    errorPhone.value = false;
  }

  try {
    // Cập nhật thông tin địa chỉ
    await axios.put(`/api/address/${selectedAddress.value.id}`, {
      receiverName: shippingName.value,
      receiverPhone: shippingPhone.value
    });

    // Đồng bộ state sau khi cập nhật thành công
    selectedAddress.value.receiverName = shippingName.value;
    selectedAddress.value.receiverPhone = shippingPhone.value;
    editing.value = false;

    alert("Cập nhật thông tin thành công!");
  } catch (err) {
    console.error(err);
    alert("Cập nhật thất bại!");
  }
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

  // Gán đúng theo property từ backend
  shippingName.value = a.receiverName || a.name || "";
  shippingPhone.value = a.receiverPhone || a.phone || "";

  showSelectAddressModal.value = false;
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
    !selectedWard.value ||
    !shippingName.value ||
    !shippingPhone.value
  ) {
    alert("Vui lòng nhập đầy đủ thông tin địa chỉ và người nhận!");
    return;
  }

  const provinceName = provinces.value.find(
    (p) => p.ProvinceID === selectedProvince.value
  )?.ProvinceName || "";
  const districtName = districts.value.find(
    (d) => d.DistrictID === selectedDistrict.value
  )?.DistrictName || "";
  const wardName = wards.value.find((w) => w.WardCode === selectedWard.value)
    ?.WardName || "";

  const fulladdress = `${specificAddress.value}, ${wardName}, ${districtName}, ${provinceName}`;

  selectedAddress.value = {
    detail: specificAddress.value,
    ward: wardName,
    district: districtName,
    province: provinceName,
    ward_code: selectedWard.value,
    district_id: selectedDistrict.value,
    province_id: selectedProvince.value,
    fulladdress: `${specificAddress.value}, ${wardName}, ${districtName}, ${provinceName}`,
    name: shippingName.value, // Gán tên người nhận
    phone: shippingPhone.value, // Gán số điện thoại
  };

  try {
    // Lưu thông tin địa chỉ vào backend
    await axios.post("/api/address", {
      receiverName: shippingName.value,
      receiverPhone: shippingPhone.value,
      province_id: selectedProvince.value,
      district_id: selectedDistrict.value,
      ward_code: selectedWard.value,
      address: specificAddress.value,
      fulladdress: fulladdress,
      defaultAddress: false,
      active: true,
      accountId: accountId.value
    });
    await fetchAddresses();  
    const newAddress = addresses.value.find(
      (address) => address.fulladdress === fulladdress
    );

    if (newAddress) {
      selectedAddress.value = newAddress; 
    }
    closeModal();
  } catch (err) {
    console.error(err);
    alert("Không thể lưu địa chỉ.");
  }
};

const totalWeight = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + (Number(item.weight) || 0) * (Number(item.quantity) || 1),
    0
  )
);

const fetchShippingFee = async () => {
 if (!selectedAddress.value || !selectedAddress.value.district_id) {
  shippingFee.value = 0;
  return;
 }

 try {

 const weightToSend = totalWeight.value; 

 console.log("Tổng khối lượng GỬI ĐI:", weightToSend); 

 const res = await axios.get("/api/ghn/fee", {
 params: {
 fromDistrictId: storeDistrictId,
  toDistrictId: Number(selectedAddress.value.district_id),
  toWardCode: String(selectedAddress.value.ward_code),
   weight: weightToSend, 
},
 });

 console.log('GHN Fee Response:', res.data);

 // 2. CẬP NHẬT PHÍ SHIP
//  shippingFee.value = res.data?.total || res.data?.data?.total || 0;
shippingFee.value = 0; // Luôn là 0 bất kể GHN trả về gì

 } catch (err) {
 shippingFee.value = 0;
 console.error("fetchShippingFee error", err);
 }
};



watch(selectedAddress, (newVal) => {
    if (newVal) fetchShippingFee();
});

watch(shippingFee, () => {
    // Khi phí vận chuyển thay đổi, tính lại giảm giá vận chuyển
    calculateDiscounts();
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
  accountId: accountId.value,
  shippingAddress: selectedAddress.value?.fulladdress || "",
  shippingPhone: shippingPhone.value,
  shippingName: shippingName.value,
  paymentMethodId: selectedPaymentMethod.value,
  feeship: Number(shippingFee.value) || 0,
  total: Number(totalPayment.value) || 0,
  paymentStatus: false,

  // Tổng giảm giá
  discount: Number(totalDiscountAmount.value) || 0,
  discountProduct: Number(productDiscountAmount.value) || 0, 
  discountShipping: Number(shippingDiscountAmount.value) || 0,

  // ID Voucher
  productVoucherId: productVoucher.value ? productVoucher.value.id : null,
  shippingVoucherId: shippingVoucher.value ? shippingVoucher.value.id : null,

  statusId: 1, // PENDING
  totalWeight: totalWeight.value,
  orderDetails: cartItems.value.map((i) => ({
    skuId: i.skuId,
    quantity: i.quantity,
    price: i.price,
    flashSaleSkuId: i.flashSaleSkuId ?? null,
  })),
};

console.log("Order Payload:", orderPayload);
    // Xử lý thanh toán qua VNPAY
    if (selectedPaymentMethod.value === 1) {
      const res = await axios.post("/api/vnpay/create", {
        amount: orderPayload.total,
          // orderId: uniqueOrderId,   // gửi orderId từ FE
productVoucherId: orderPayload.productVoucherId,
        shippingVoucherId: orderPayload.shippingVoucherId,
        accountId: orderPayload.accountId,
        orderInfo: orderPayload.orderId,
      });     

      if (res.data?.paymentUrl) {
        sessionStorage.setItem("pendingTxnRef", res.data.orderId);
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
    const momoOrderId = res?.data?.orderId; // Lấy orderId từ backend trả về

    if (paymentUrl && momoOrderId) {
      // ✅ QUAN TRỌNG: Lưu mã đơn hàng vào session trước khi đi
      sessionStorage.setItem("pendingMomoOrderId", momoOrderId);
      sessionStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
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

// Tìm đến cuối hàm handlePayment và thêm logic PayOS
if (selectedPaymentMethod.value === 4) { // Giả sử ID 4 là PayOS
    try {
        // 1. Gửi request tạo thanh toán
        const res = await axios.post("/api/payos/create-payment?origin=web", {
            amount: orderPayload.total,
            description: `Thanh toan don hang ${uniqueOrderId}`,
            buyerName: orderPayload.shippingName,
            buyerPhone: orderPayload.shippingPhone,
            buyerAddress: orderPayload.shippingAddress,
          // QUAN TRỌNG: Phải có danh sách sản phẩm ở đây
            orderDetails: orderPayload.orderDetails, 
            totalDiscount: orderPayload.discount, // Hoặc tên trường khớp với DTO của bạn
            // Các thông tin bổ sung để Backend xử lý Voucher
              totalWeight: orderPayload.totalWeight,

            productVoucherId: orderPayload.productVoucherId,
            shippingVoucherId: orderPayload.shippingVoucherId,
            feeship: orderPayload.feeship,
            discountProduct: orderPayload.discountProduct,
            discountShipping: orderPayload.discountShipping
        });

        if (res.data?.checkoutUrl) {
            // 2. Lưu thông tin đơn hàng tạm thời vào session để tạo sau khi thanh toán xong
            sessionStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
            sessionStorage.setItem("pendingPayosOrderCode", res.data.orderCode);
            
            // 3. Chuyển hướng sang trang thanh toán của PayOS
            window.location.href = res.data.checkoutUrl;
            return;
        }
    } catch (err) {
        console.error("PayOS Error:", err);
        Swal.fire("Lỗi", "Không thể khởi tạo thanh toán PayOS", "error");
        return;
    }
}


   if (selectedPaymentMethod.value === 2) {
      const orderRes = await axios.post("/api/order-cod", orderPayload);
      // ✅ GỌI XÓA DATABASE TRƯỚC KHI CHUYỂN TRANG
    const purchasedIds = orderPayload.orderDetails.map(d => d.skuId);
    await clearPurchasedItemsFromDb(purchasedIds);
      console.log(localStorage.getItem('token'));

      // ✅ THÊM THÔNG BÁO THÀNH CÔNG TẠI ĐÂY
      await Swal.fire({
          icon: "success",
          title: "Đặt hàng thành công!",
          text: "Đơn hàng COD của bạn đã được tạo. Bạn sẽ được chuyển hướng đến trang Đơn hàng của tôi.",
          showConfirmButton: false,
          timer: 2500 // Tự động đóng sau 2.5 giây
      });

      // ✅ SAU ĐÓ MỚI XÓA DỮ LIỆU VÀ CHUYỂN HƯỚNG
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("checkoutItems");
      cartItems.value = [];
      window.location.href = "/orders";
      return;
    }

    // ... (logic xử lý các phương thức thanh toán khác hoặc lỗi) ...

    Swal.fire({
      icon: "error",
      title: "Không thể khởi tạo thanh toán",
      text: "Vui lòng thử lại sau.",
    });
  } catch (err) {
    console.error("handlePayment error", err, err.response); // Nên log cả err.response
    let errorMessage = "Vui lòng thử lại sau.";
    
    // Xử lý thông báo lỗi từ Backend nếu có (ví dụ: lỗi hết hàng)
    if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
    }

    Swal.fire({
      icon: "error",
      title: "Có lỗi khi thanh toán!",
      text: errorMessage,
    });
  }
};

// Handle callback from payment gateways
const clearPurchasedItemsFromDb = async (skuIds) => {
    if (!skuIds || skuIds.length === 0 || !accountId.value) return;
    try {
        await axios.post("/api/cart-details/remove-after-order", {
            accountId: accountId.value,
            skuIds: skuIds // Gửi mảng ID sản phẩm đã mua
        });
        console.log("Database cart cleared for:", skuIds);
    } catch (err) {
        console.error("Lỗi xóa giỏ hàng Database:", err);
    }
};

const handlePaymentCallback = async () => {
  console.log("🔥 handlePaymentCallback chạy rồi");
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
    const momoResultCode = urlParams.get("resultCode");
    const payosStatus = urlParams.get("status"); 
    console.log("Trạng thái PayOS nhận được:", payosStatus);
    const payosOrderCode = urlParams.get("orderCode");
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
if (payosStatus === "PAID" && payosOrderCode) {
      try {
          const res = await axios.post(`http://localhost:8080/api/payos/payos-success/${payosOrderCode}`, 
              {}, 
              { headers: { Authorization: `Bearer ${token}` } }
          );

          sessionStorage.removeItem("pendingOrder");
          sessionStorage.removeItem("pendingPayosOrderCode");
          sessionStorage.removeItem("cart");
          sessionStorage.removeItem("checkoutItems");

          await Swal.fire("Thành công", "Thanh toán PayOS thành công!", "success");
          window.location.href = "/orders";
          return;
      } catch (err) {
          console.error("Lỗi tạo đơn sau PayOS:", err);
          Swal.fire("Lỗi", "Thanh toán thành công nhưng lỗi tạo đơn hàng", "error");
          return;
      }
  }
// Trong hàm handlePaymentCallback, phần xử lý MOMO thành công:
if (momoResultCode === "0") {
    const pendingOrder = JSON.parse(sessionStorage.getItem("pendingOrder") || "{}");
    if (pendingOrder.orderDetails) {
        await clearPurchasedItemsFromDb(pendingOrder.orderDetails.map(d => d.skuId));
    }
    
    // ✅ Dọn dẹp session MoMo
    sessionStorage.removeItem("pendingOrder");
    sessionStorage.removeItem("pendingMomoOrderId"); 

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
// ✅ GỌI XÓA DATABASE SAU KHI TẠO ĐƠN THÀNH CÔNG
        const purchasedIds = orderPayload.orderDetails.map(d => d.skuId);
        await clearPurchasedItemsFromDb(purchasedIds);
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
  // 1. Lấy dữ liệu cơ bản
  fetchCartFromSessionStorage();
  fetchAccountId();
  await Promise.all([fetchProvinces(), fetchAddresses(), fetchPaymentMethods(), fetchVouchers()]);

  const urlParams = new URLSearchParams(window.location.search);
  
  // Kiểm tra callback từ các cổng thanh toán
  const hasPaymentCallback = 
    urlParams.get("vnp_ResponseCode") || 
    urlParams.get("resultCode") || 
    urlParams.get("status");

  // 2. Nếu ĐANG xử lý kết quả thanh toán trả về (Callback)
  if (hasPaymentCallback) {
    await handlePaymentCallback();
    
    // Xóa sạch tất cả các mã lưu tạm sau khi đã xử lý xong kết quả
    sessionStorage.removeItem("pendingTxnRef");           // VNPAY
    sessionStorage.removeItem("pendingPayosOrderCode");    // PayOS
    sessionStorage.removeItem("pendingMomoOrderId");      // MoMo
  } 
  
  // 3. Nếu KHÔNG phải là callback (Khách tự ý quay lại trang checkout hoặc nhấn Back)
  else {
    // --- Xử lý hoàn Voucher cho VNPAY ---
    const pendingTxnRef = sessionStorage.getItem("pendingTxnRef");
    if (pendingTxnRef) {
      try {
        await axios.post(`/api/vnpay/release/${pendingTxnRef}`);
        sessionStorage.removeItem("pendingTxnRef");
        console.log("VNPAY: Đã hoàn lại voucher.");
      } catch (err) {
        console.error("Lỗi hoàn voucher VNPAY:", err);
      }
    }

    // --- Xử lý hoàn Voucher cho PAYOS ---
    const pendingPayosCode = sessionStorage.getItem("pendingPayosOrderCode");
    if (pendingPayosCode) {
      try {
        await axios.post(`/api/payos/release/${pendingPayosCode}`);
        sessionStorage.removeItem("pendingPayosOrderCode");
        console.log("PayOS: Đã hoàn lại voucher.");
      } catch (err) {
        console.error("Lỗi hoàn voucher PayOS:", err);
      }
    }

    // --- BỔ SUNG: Xử lý hoàn Voucher cho MOMO ---
    const pendingMomoId = sessionStorage.getItem("pendingMomoOrderId");
    if (pendingMomoId) {
      try {
        // Gọi đến API release MoMo mà mình vừa viết ở Backend
        await axios.post(`/api/momo/release/${pendingMomoId}`);
        sessionStorage.removeItem("pendingMomoOrderId");
        console.log("MoMo: Khách đã quay lại, voucher đã được hoàn kho.");
      } catch (err) {
        console.error("Lỗi hoàn voucher MoMo:", err);
      }
    }
  }
});
</script>
<style scoped>
.text-danger {
  color: red;
}
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
  z-index: 1050 !important;
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.5); 
}
/* Modal Setup */
.modal-dialog {
  max-width: 500px; 
  margin: 1.75rem auto; 
  position: relative;
  z-index: 1050;
}

.modal-content {
  padding: 1rem; 
  border-radius: 0.75rem; 
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
}

.modal-body {
  padding-bottom: 1rem; 
  height: auto; 
  overflow-y: hidden;
}

.modal-body::-webkit-scrollbar {
  display: none; 
}

.form-label {
  font-size: 0.875rem;
}

.form-control {
  font-size: 0.875rem; 
  padding: 0.5rem; 
  height: auto; 
}

.mb-3 {
  margin-bottom: 1rem; 
}

.modal-header {
  padding: 1rem 1rem; 
}

.modal-footer {
  padding: 1rem 1rem; 
}

.btn-close {
  padding: 0.5rem; 
}

.modal.show.d-block {
  z-index: 2000 !important;
  position: fixed;
  inset: 0;
}
/* Thêm CSS cho trạng thái chọn voucher trong modal */
.voucher-item {
  cursor: pointer;
  transition: all 0.2s;
}

.voucher-item:hover {
  background-color: #f8f9fa; /* Light gray background on hover */
}

.voucher-item.active {
  border-color: var(--bs-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
