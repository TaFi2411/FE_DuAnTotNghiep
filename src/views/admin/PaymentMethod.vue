<template>
  <div>
    <button class="btn btn-primary" @click="openModal">
      {{ selectedPayment?.name || "Phương thức thanh toán" }}
    </button>

    <div
      class="modal fade"
      id="paymentModal"
      tabindex="-1"
      aria-hidden="true"
      ref="paymentModalRef"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Phương thức thanh toán</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <ul class="list-group">
              <li
                v-for="item in paymentMethods"
                :key="item.id"
                class="list-group-item d-flex align-items-center justify-content-between"
              >
                <div class="d-flex align-items-center">
                  <input
                    v-if="!editingId || editingId !== item.id"
                    type="radio"
                    name="payment"
                    :value="item"
                    v-model="selectedPayment"
                    @change="emitChange"
                    class="form-check-input me-2"
                  />

                  <!-- Input chỉnh sửa -->
                  <template v-if="editingId === item.id">
                    <input
                      type="text"
                      v-model="editName"
                      class="form-control"
                      style="width: 250px"
                    />
                  </template>

                  <!-- Text hiển thị -->
                  <template v-else>
                    {{ item.name }}
                  </template>
                </div>

                <div>
                  <!-- Khi đang sửa -->
                  <template v-if="editingId === item.id">
                    <button
                      class="btn btn-sm btn-success me-2"
                      @click="updatePaymentMethod(item.id)"
                    >
                      <i class="bi bi-check-square"></i>
                    </button>
                  </template>

                  <!-- Mặc định -->
                  <template v-else>
                    <button
                      class="btn btn-sm btn-outline-secondary me-2"
                      @click="startEdit(item)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deletePaymentMethod(item.id)"
                    >
                      <i class="bi bi-x-square"></i>
                    </button>
                  </template>
                </div>
              </li>
            </ul>

            <!-- ✅ Thêm phương thức -->
            <div class="input-group mt-3">
              <input
                v-model="newPayment"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errorMessage }"
                placeholder="Thêm phương thức thanh toán..."
                @input="errorMessage = ''"
              />
              <button class="btn btn-primary" @click="addPaymentMethod">Thêm</button>
              <div class="invalid-feedback">{{ errorMessage }}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/composables/axios";

const emit = defineEmits(["update:modelValue"]);

const paymentMethods = ref([]);
const selectedPayment = ref(null);
const newPayment = ref("");
const errorMessage = ref("");

let modalInstance = null;
const paymentModalRef = ref(null);

const editingId = ref(null);
const editName = ref("");

// ✅ Load danh sách
const fetchPaymentMethods = async () => {
  const res = await axios.get("/api/payment-method", {
    params: { size: 1000 },
  });
  paymentMethods.value = res.data?.data || [];
};

// ✅ Modal control
const openModal = () => {
  if (!modalInstance)
    modalInstance = new bootstrap.Modal(paymentModalRef.value);
  modalInstance.show();
};
const closeModal = () => modalInstance.hide();

// ✅ Emit khi chọn radio
const emitChange = () => {
  emit("update:modelValue", selectedPayment.value);
};

// ✅ Add Payment Method (có kiểm tra trùng)
const addPaymentMethod = async () => {
  const name = newPayment.value?.trim();
  if (!name) {
    errorMessage.value = "Tên phương thức không được để trống!";
    return;
  }

  // ✅ Kiểm tra trùng tên
  const isDuplicate = paymentMethods.value.some(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );
  if (isDuplicate) {
    errorMessage.value = "Phương thức thanh toán này đã tồn tại!";
    return;
  }

  try {
    await axios.post("/api/payment-method", { name, status: true });
    await fetchPaymentMethods();
    newPayment.value = "";
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Thêm thất bại!";
  }
};

// ✅ Start Editing
const startEdit = (item) => {
  editingId.value = item.id;
  editName.value = item.name;
};

// ✅ Cancel Edit
const cancelEdit = () => {
  editingId.value = null;
  editName.value = "";
};

// ✅ Update Payment (có kiểm tra trùng)
const updatePaymentMethod = async (id) => {
  const name = editName.value?.trim();
  if (!name) {
    errorMessage.value = "Tên không được để trống!";
    return;
  }

  // ✅ Kiểm tra trùng (ngoại trừ chính item đang sửa)
  const isDuplicate = paymentMethods.value.some(
    (m) =>
      m.name.toLowerCase() === name.toLowerCase() &&
      m.id !== id
  );
  if (isDuplicate) {
    errorMessage.value = "Phương thức thanh toán này đã tồn tại!";
    return;
  }

  try {
    await axios.put(`/api/payment-method/${id}`, { name });
    await fetchPaymentMethods();
    cancelEdit();
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value = "Cập nhật thất bại!";
  }
};

// ✅ Delete Payment
const deletePaymentMethod = async (id) => {
  if (!confirm("Xóa phương thức thanh toán này?")) return;

  try {
    await axios.delete(`/api/payment-method/${id}`);
    if (selectedPayment.value?.id === id) {
      selectedPayment.value = null;
      emitChange();
    }
    await fetchPaymentMethods();
  } catch (err) {
    errorMessage.value = "Xóa thất bại!";
  }
};

onMounted(fetchPaymentMethods);
</script>


<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>
