<template>
  <div class="modal-backdrop">
    <div class="modal-content-card">

      <h4 class="fw-bold mb-3">
        {{ props.isEdit ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới" }}
      </h4>

      <div class="mb-2">
        <label>Họ tên người nhận</label>
        <input v-model="shippingName" class="form-control" />
      </div>

      <div class="mb-2">
        <label>Số điện thoại</label>
        <input v-model="shippingPhone" class="form-control" />
      </div>

      <div class="row">
        <div class="col-4">
          <label>Tỉnh/TP</label>
          <select v-model="selectedProvince" class="form-select" @change="fetchDistricts">
            <option value="">Chọn tỉnh</option>
            <option v-for="p in provinces" :value="p.ProvinceID" :key="p.ProvinceID">
              {{ p.ProvinceName }}
            </option>
          </select>
        </div>

        <div class="col-4">
          <label>Quận/Huyện</label>
          <select v-model="selectedDistrict" class="form-select" @change="fetchWards">
            <option value="">Chọn huyện</option>
            <option v-for="d in districts" :value="d.DistrictID" :key="d.DistrictID">
              {{ d.DistrictName }}
            </option>
          </select>
        </div>

        <div class="col-4">
          <label>Phường/Xã</label>
          <select v-model="selectedWard" class="form-select">
            <option value="">Chọn phường</option>
            <option v-for="w in wards" :value="w.WardCode" :key="w.WardCode">
              {{ w.WardName }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-2">
        <label>Địa chỉ cụ thể</label>
        <input v-model="specificAddress" class="form-control" />
      </div>

      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-secondary me-2" @click="$emit('close')">Hủy</button>
        <button class="btn btn-primary" @click="save">Lưu</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "@/composables/axios.js";

const props = defineProps({
  isEdit: Boolean,
  addressData: Object,
});

const emit = defineEmits(["close", "saved"]);


const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

const selectedProvince = ref("");
const selectedDistrict = ref("");
const selectedWard = ref("");

const specificAddress = ref("");
const shippingName = ref("");
const shippingPhone = ref("");

const accountId = localStorage.getItem("token")
  ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id
  : null;





const fetchProvinces = async () => {
  const res = await axios.get("/api/ghn/provinces");
  provinces.value = res.data;
};

const fetchDistricts = async () => {
  if (!selectedProvince.value) {
    districts.value = [];
    return;
  }
  const res = await axios.get(`/api/ghn/districts?provinceId=${selectedProvince.value}`);
  districts.value = res.data;
};

const fetchWards = async () => {
  if (!selectedDistrict.value) {
    wards.value = [];
    return;
  }
  const res = await axios.get(`/api/ghn/wards?districtId=${selectedDistrict.value}`);
  wards.value = res.data;
};


const save = async () => {
  if (
    !shippingName.value ||
    !shippingPhone.value ||
    !specificAddress.value ||
    !selectedProvince.value ||
    !selectedDistrict.value ||
    !selectedWard.value
  ) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // LẤY TÊN TỈNH / HUYỆN / XÃ
  const provinceName = provinces.value.find(p => p.ProvinceID == selectedProvince.value)?.ProvinceName || "";
  const districtName = districts.value.find(d => d.DistrictID == selectedDistrict.value)?.DistrictName || "";
  const wardName = wards.value.find(w => w.WardCode == selectedWard.value)?.WardName || "";

  // KHỞI TẠO fulladdress — ĐẶT NGAY SAU KHI TÍM TÊN
  const fulladdress = `${specificAddress.value}, ${wardName}, ${districtName}, ${provinceName}`;

  // PAYLOAD CÓ ÉP KIỂU ĐÚNG
  const payload = {
    receiverName: shippingName.value,
    receiverPhone: shippingPhone.value,
    province_id: Number(selectedProvince.value),
    district_id: Number(selectedDistrict.value),
    ward_code: String(selectedWard.value),
    address: specificAddress.value,
    fulladdress,
    defaultAddress: false,
    active: true,
    accountId
  };

  try {
    let res;

    if (props.isEdit) {
      res = await axios.put(`/api/address/${props.addressData.id}`, payload);
    } else {
      res = await axios.post(`/api/address`, payload);
    }

    emit("saved", res.data);
    emit("close");

  } catch (err) {
    console.error(err);
    alert("Không thể lưu địa chỉ.");
  }
};


watch(
  () => props.addressData,
  async (val) => {
    if (!val) return;

    shippingName.value = val.receiverName;
    shippingPhone.value = val.receiverPhone;
    specificAddress.value = val.address; 

    selectedProvince.value = Number(val.province_id);


    await fetchDistricts();
    selectedDistrict.value = Number(val.district_id);


    await fetchWards();
    selectedWard.value = val.ward_code + "";
  },
  { immediate: true }
);

onMounted(fetchProvinces);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content-card {
  background: white;
  padding: 20px;
  width: 500px;
  border-radius: 10px;
}
</style>
