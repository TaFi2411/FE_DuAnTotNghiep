<template>
  <div class="checkout-page container py-5 mt-5">
    <h2 class="fw-bold text-center mb-4">Thanh toán đơn hàng 💳</h2>

    <div class="row g-4">
      <!-- CỘT TRÁI -->
      <div class="col-lg-8">
        <!-- ĐỊA CHỈ GIAO HÀNG -->
        <div class="bg-white rounded-4 shadow-sm p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Địa chỉ giao hàng</h5>
            <button
              class="btn btn-outline-primary btn-sm rounded-pill px-3"
              @click="showAddressModal = true"
            >
              <i class="bi bi-plus-circle"></i> Thêm địa chỉ mới
            </button>
          </div>

          <!-- Danh sách địa chỉ -->
          <div v-if="addresses.length">
            <div
              v-for="a in addresses"
              :key="a.id"
              class="border rounded-3 p-3 mb-2 d-flex justify-content-between align-items-center"
              :class="{ 'border-primary bg-light': selectedAddress?.id === a.id }"
              @click="selectAddress(a)"
              style="cursor: pointer;"
            >
              <div>
                <strong>{{ a.fulladdress }}</strong>
                <div class="text-muted small">#{{ a.id }}</div>
              </div>
              <i
                v-if="selectedAddress?.id === a.id"
                class="bi bi-check-circle-fill text-primary fs-5"
              ></i>
            </div>
          </div>
          <div v-else class="text-muted fst-italic">Chưa có địa chỉ nào được lưu.</div>
        </div>
      </div>

      <!-- CỘT PHẢI (Tóm tắt đơn hàng) -->
      <div class="col-lg-4">
        <div class="summary-box bg-white rounded-4 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Tóm tắt đơn hàng</h5>

          <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển</span>
            <strong>{{ formatShippingFee( shippingFee.toLocaleString() )}} đ</strong>
          </div>

          <button class="btn btn-dark w-100 rounded-pill py-2 fw-semibold">
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL THÊM ĐỊA CHỈ -->
    <div
      v-if="showAddressModal"
      class="modal fade show d-block"
      style="background: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Thêm địa chỉ mới</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- Chọn tỉnh -->
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

            <!-- Chọn huyện -->
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

            <!-- Chọn phường -->
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

            <!-- Nhập địa chỉ cụ thể -->
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
            <button class="btn btn-primary" @click="saveAddress">Lưu địa chỉ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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

const accountId = 7; // ⚠️ sau này lấy từ login
const storeDistrictId = 1451; // Quận shop GHN

const shippingFee = ref(0);

// ✅ Gọi API GHN
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

// ✅ Gọi API lấy danh sách địa chỉ từ DB
const fetchAddresses = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/address?account=${accountId}`);
    addresses.value = res.data.data || [];
  } catch (err) {
    console.error("Lỗi khi load danh sách địa chỉ:", err);
  }
};

// ✅ Lưu địa chỉ mới
const saveAddress = async () => {
  if (!specificAddress.value || !selectedProvince.value || !selectedDistrict.value || !selectedWard.value) {
    alert("Vui lòng nhập đầy đủ thông tin địa chỉ!");
    return;
  }

  const provinceName =
    provinces.value.find(p => p.ProvinceID === selectedProvince.value)?.ProvinceName || "";
  const districtName =
    districts.value.find(d => d.DistrictID === selectedDistrict.value)?.DistrictName || "";
  const wardName =
    wards.value.find(w => w.WardCode === selectedWard.value)?.WardName || "";

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
      accountId,
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

// ✅ Hàm tính phí ship chuẩn GHN
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
        weight: 1000, // thay bằng tổng khối lượng giỏ hàng
      },
    });
    shippingFee.value = res.data?.total || res.data?.data?.total || 0;
    console.log("Phí ship:", shippingFee.value);
  } catch (err) {
    console.error("Lỗi khi tính phí ship:", err.response?.data || err.message);
    shippingFee.value = 0;
  }
};
const formatShippingFee = (fee) => {
  if (!shippingFee.value) return 0;
  return Math.ceil(shippingFee.value / 1000) * 1000; // làm tròn lên đơn vị nghìn
};

watch(selectedAddress, (newVal) => {
  if (newVal) fetchShippingFee();
});

const closeModal = () => {
  showAddressModal.value = false;
  selectedProvince.value = "";
  selectedDistrict.value = "";
  selectedWard.value = "";
  specificAddress.value = "";
};

onMounted(() => {
  fetchProvinces();
  fetchAddresses();
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
</style>
