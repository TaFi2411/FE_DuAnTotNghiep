<template>
  <div class="container py-5">
    <div class="row">
      <!-- Thông tin khách hàng -->
      <div class="col-md-8 pe-md-4 border-end">
        <h4 class="mb-4">Thông tin đơn hàng</h4>

        <!-- Địa chỉ giao hàng -->
        <div class="mb-3">
          <h5>Chọn địa chỉ giao hàng</h5>
          <div class="row g-2">
            <div class="col-md-4">
              <select class="form-select" v-model="selectedProvince" @change="getDistricts(selectedProvince)">
                <option disabled value="">Chọn tỉnh</option>
                <option v-for="p in provinces" :key="p.ProvinceID" :value="p.ProvinceID">{{ p.ProvinceName }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <select class="form-select" v-model="selectedDistrict" @change="handleDistrictChange">
                <option disabled value="">Chọn quận</option>
                <option v-for="d in districts" :key="d.DistrictID" :value="d.DistrictID">{{ d.DistrictName }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <select class="form-select" v-model="selectedWard" @change="handleWardChange">
                <option disabled value="">Chọn phường</option>
                <option v-for="w in wards" :key="w.WardCode" :value="w.WardCode">{{ w.WardName }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Chọn voucher -->
        <div class="mt-4">
          <label class="form-label">Chọn Voucher</label>
          <select class="form-select" v-model="selectedVoucherId" @change="applyVoucher">
            <option disabled value="">-- Chọn voucher --</option>
            <option v-for="v in vouchers" :key="v.id" :value="v.id">
              {{ v.name }} - Giảm {{ v.discount }}%
            </option>
          </select>
        </div>

        <!-- Ghi chú -->
        <div class="mb-3">
          <label class="form-label">Ghi chú</label>
          <textarea class="form-control" rows="3" v-model="order.note"></textarea>
        </div>

        <!-- Phương thức thanh toán -->
        <h5 class="mt-4">Phương thức thanh toán</h5>
        <div class="form-check mt-2" v-for="method in paymentMethods" :key="method.value">
          <input class="form-check-input" type="radio" :id="method.value" :value="method.value" v-model="order.payment" />
          <label class="form-check-label" :for="method.value">{{ method.label }}</label>
        </div>

        <!-- Đồng ý -->
        <div class="form-check mt-4">
          <input class="form-check-input" type="checkbox" id="agree" v-model="isAgreed" />
          <label class="form-check-label" for="agree">
            Tôi đồng ý với <a href="#" target="_blank">chính sách xử lý dữ liệu cá nhân</a>
          </label>
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-dark px-4 py-2" :disabled="!isAgreed" @click="placeOrder"> Đặt hàng </button>
        </div>
      </div>

      <!-- Tóm tắt đơn hàng -->
      <div class="col-md-4 ps-md-4">
        <h4 class="mb-4">Đơn hàng</h4>
        <div v-for="item in cart" :key="item.id" class="d-flex mb-3 align-items-start">
          <img :src="item.image" alt="" class="me-3" width="60" height="60" />
          <div>
            <p class="mb-1 fw-bold">{{ item.productName || item.name }}</p>
            <ul class="mb-1 ps-3" style="font-size: 0.9rem;">
              <li v-for="(attr, i) in item.attributes || []" :key="i">
                {{ attr.optionAttributeName }}: {{ attr.attributeValue }}
              </li>
            </ul>
            <small class="text-muted">{{ item.quantity }} x {{ formatPrice(item.price) }}</small>
          </div>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <span>Tạm tính:</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="d-flex justify-content-between text-success" v-if="voucherDiscount > 0">
          <span>Giảm theo voucher:</span>
          <span>-{{ formatPrice(voucherDiscount) }}</span>
        </div>
        <div class="d-flex justify-content-between fw-bold text-primary" v-if="voucherDiscount > 0">
          <span>Giá sau khi giảm:</span>
          <span>{{ formatPrice(subtotal - voucherDiscount) }}</span>
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const YOUR_GHN_TOKEN = 'd242c47a-7082-11f0-bae3-5e3443de31a0';

// Trạng thái
const isAgreed = ref(false);

const order = reactive({
  note: '',
  payment: 'cod'
});

const cart = ref([]);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const selectedProvince = ref('');
const selectedDistrict = ref('');
const selectedWard = ref('');
const shippingFee = ref(0);
const selectedVoucherId = ref(null);
const selectedVoucher = ref(null);
const vouchers = ref([]);

const paymentMethods = [
  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
  { value: 'bank', label: 'Chuyển khoản' },
  { value: 'momo', label: 'Ví MoMo' }
];

// Computed
const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const voucherDiscount = computed(() => {
  if (!selectedVoucher.value) return 0;
  return Math.floor(subtotal.value * selectedVoucher.value.discount / 100);
});

const total = computed(() =>
  subtotal.value + shippingFee.value - voucherDiscount.value
);

// Methods
function formatPrice(val) {
  return val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

async function getProvinces() {
  const res = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
    headers: { Token: YOUR_GHN_TOKEN }
  });
  provinces.value = res.data.data;
}

async function getDistricts(provinceId) {
  const res = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
    province_id: provinceId
  }, {
    headers: { Token: YOUR_GHN_TOKEN }
  });
  districts.value = res.data.data;
}

async function getWards(districtId) {
  const res = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
    district_id: districtId
  }, {
    headers: { Token: YOUR_GHN_TOKEN }
  });
  wards.value = res.data.data;
}

function handleDistrictChange() {
  getWards(selectedDistrict.value);
  calculateShippingFee();
}

function handleWardChange() {
  calculateShippingFee();
}

async function calculateShippingFee() {
  if (!selectedDistrict.value || !selectedWard.value) return;
  const payload = {
    fromDistrictId: 1538,
    toDistrictId: selectedDistrict.value,
    toWardCode: selectedWard.value,
    weight: 1000,
    service_type_id: 2
  };
  try {
    const res = await axios.post('http://localhost:8080/api/shipping/fee', payload);
    shippingFee.value = res.data.data.total;
  } catch (err) {
    alert('Lỗi khi tính phí: ' + err.message);
    console.log('Lỗi khi tính phí: ' + err.message)
  }
}
function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function applyVoucher() {
  const v = vouchers.value.find(v => v.id === selectedVoucherId.value);
  if (!v) return;

  const today = stripTime(new Date());
  const start = stripTime(new Date(v.stardate));
  const end = stripTime(new Date(v.enddate));

  if (today < start || today > end) {
    alert('❌ Voucher chưa có hiệu lực hoặc đã hết hạn!');
    selectedVoucherId.value = null;
    selectedVoucher.value = null;
    return;
  }

  selectedVoucher.value = v;
}


async function getVouchers() {
  try {
    const res = await axios.get('http://localhost:8080/api/voucher');
    vouchers.value = res.data;
  } catch (err) {
    alert('Lỗi khi tải danh sách voucher');
  }
}

function placeOrder() {
  if (!isAgreed.value) return alert("❌ Bạn chưa đồng ý chính sách");

  const accountId = sessionStorage.getItem('accountId');
  if (!accountId) {
    alert("⚠️ Bạn cần đăng nhập trước khi đặt hàng");
    router.push('/dangnhap');
    return;
  }



  const finalOrder = {
    accountId: accountId,
    note: order.note,
    payment: order.payment,
    feeship: shippingFee.value,
    total: total.value,
    cart: cart.value.map(item => ({
      skuId: item.skuId,
      quantity: item.quantity,
      price: item.price
    }))
    
  };

  if (selectedVoucherId.value) {
    finalOrder.voucherId = selectedVoucherId.value;
  }

  axios.post('http://localhost:8080/api/order', finalOrder)
    .then(() => {
      alert("✅ Đặt hàng thành công!");
      cart.value = [];
      
      router.push("/donhangcuatoi");
    })
    .catch(err => {
      console.log("id sku nè",skuId)
      console.error(err);
      alert("❌ Lỗi khi đặt hàng: " + err.message);
    });
}

// Lifecycle
onMounted(() => {
  getProvinces();
  getVouchers();

  const selectedCart = sessionStorage.getItem("selectedCartItems");
  if (selectedCart) {
    try {
      cart.value = JSON.parse(selectedCart);
    } catch (err) {
      console.error("Lỗi khi parse dữ liệu giỏ hàng:", err);
    }
  } else {
    alert("❌ Không tìm thấy sản phẩm trong giỏ hàng đã chọn.");
    router.push("/giohang");
  }
});
</script>
