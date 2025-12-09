<template>
  <div class="container py-4">

    <!-- SEARCH BAR -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input 
        v-model="searchKeyword"
        type="text"
        class="form-control w-50"
        placeholder="Tìm kiếm theo tên, số điện thoại hoặc địa chỉ..."
      />

      <button class="btn btn-primary ms-3" @click="openAddModal">
        + Thêm địa chỉ
      </button>
    </div>

    <!-- ADDRESS LIST -->
    <div v-if="filteredAddresses.length > 0">
      <div 
        class="card mb-3 p-3 shadow-sm"
        v-for="addr in filteredAddresses" 
        :key="addr.id"
      >
        <div class="d-flex justify-content-between">
          
          <div>
            <h5 class="fw-bold">{{ addr.receiverName }}</h5>
            <p class="mb-1"><strong>SĐT:</strong> {{ addr.receiverPhone }}</p>
            <p class="mb-1"><strong>Địa chỉ:</strong> {{ addr.fulladdress }}</p>

            <span v-if="addr.defaultAddress" class="badge bg-success">Mặc định</span>
          </div>

          <div class="text-end">
            <button class="btn btn-warning btn-sm me-2" @click="openEditModal(addr)">
              Sửa
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteAddress(addr.id)">
              Xóa
            </button>
          </div>

        </div>
      </div>
    </div>

    <div v-else class="text-center py-5 text-muted">
      Không tìm thấy địa chỉ nào.
    </div>

    <!-- MODAL -->
    <AddressModal
      v-if="showModal"
      :isEdit="isEdit"
      :addressData="selectedAddress"
      @close="closeModal"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/composables/axios.js";
import AddressModal from "@/components/AddressModal.vue";

const addresses = ref([]);
const selectedAddress = ref(null);
const accountId = ref(null);
const searchKeyword = ref("");

const showModal = ref(false);
const isEdit = ref(false);

// Lấy ID từ token
const fetchAccountId = () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || "{}"));
    accountId.value = payload?.id ?? null;
  } catch (err) {
    console.error("Invalid token payload", err);
  }
};

const fetchAddresses = async () => {
  if (!accountId.value) return;
  const res = await axios.get(`/api/address/account/${accountId.value}`);
  addresses.value = res.data || [];
};

// Tìm kiếm theo các trường
const filteredAddresses = computed(() => {
  if (!searchKeyword.value.trim()) return addresses.value;

  const k = searchKeyword.value.toLowerCase();

  return addresses.value.filter(a =>
    a.receiverName?.toLowerCase().includes(k) ||
    a.receiverPhone?.toLowerCase().includes(k) ||
    a.fulladdress?.toLowerCase().includes(k)
  );
});

// MODAL EVENTS
const openAddModal = () => {
  selectedAddress.value = null;
  isEdit.value = false;
  showModal.value = true;
};

const openEditModal = (addr) => {
  selectedAddress.value = { ...addr };
  isEdit.value = true;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const onSaved = async () => {
  await fetchAddresses();
  showModal.value = false;
};

// XÓA ĐỊA CHỈ
const deleteAddress = async (id) => {
  if (!confirm("Xác nhận xóa địa chỉ?")) return;

  await axios.delete(`/api/address/${id}`);
  await fetchAddresses();
};

onMounted(async () => {
  fetchAccountId();
  await fetchAddresses();
});
</script>
