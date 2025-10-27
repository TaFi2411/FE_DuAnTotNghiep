<template>
  <div>
    <button class="btn btn-primary" @click="openModal">
      {{ selectedStatus?.name || "Trạng thái" }}
    </button>

    <div
      class="modal fade"
      id="statusModal"
      tabindex="-1"
      aria-hidden="true"
      ref="statusModalRef"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Trạng thái</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>

          <div class="modal-body">
            <ul class="list-group">
              <!-- Danh sách Status -->
              <li
                v-for="item in statuses"
                :key="item.id"
                class="list-group-item d-flex align-items-center justify-content-between"
              >
                <div class="d-flex align-items-center">
                  <input
                    v-if="!editingId || editingId !== item.id"
                    type="radio"
                    name="status"
                    :value="item"
                    v-model="selectedStatus"
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
                      @click="updateStatus(item.id)"
                    >
                      <i class="bi bi-check-square"></i>
                    </button>
                  </template>

                  <!--  Hiển thị mặc định -->
                  <template v-else>
                    <button
                      class="btn btn-sm btn-outline-secondary me-2"
                      @click="startEdit(item)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteStatus(item.id)"
                    >
                      <i class="bi bi-x-square"></i>
                    </button>
                  </template>
                </div>
              </li>
            </ul>

            <!-- Thêm Status -->
            <div class="input-group mt-3">
              <input
                v-model="newStatus"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errorMessage }"
                placeholder="Thêm trạng thái mới..."
                @input="errorMessage = ''"
              />
              <button class="btn btn-primary" @click="addStatus">Thêm</button>
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
import axios from "@/axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

const emit = defineEmits(["update:modelValue"]);
const errorMessage = ref("");

const statuses = ref([]);
const selectedStatus = ref(null);
const newStatus = ref("");

let modalInstance = null;
const statusModalRef = ref(null);

const editingId = ref(null);
const editName = ref("");

// ✅ Load danh sách
const fetchStatuses = async () => {
  const res = await axios.get("/api/status");
  statuses.value = res.data?.data || res.data || [];
};

// ✅ Modal control
const openModal = () => {
  if (!modalInstance) modalInstance = new bootstrap.Modal(statusModalRef.value);
  modalInstance.show();
};
const closeModal = () => modalInstance.hide();

// ✅ Emit khi chọn radio
const emitChange = () => {
  emit("update:modelValue", selectedStatus.value);
};

// ✅ Add status
const addStatus = async () => {
  if (!newStatus.value.trim()) {
    errorMessage.value = "Tên trạng thái không được để trống!";
    return;
  }

  try {
    await axios.post("/api/status", { name: newStatus.value.trim() });
    newStatus.value = "";
    errorMessage.value = "";
    fetchStatuses();
  } catch (error) {
    errorMessage.value = "Không thể thêm trạng thái!";
  }
};


// ✅ Start Editing
const startEdit = (item) => {
  editingId.value = item.id;
  editName.value = item.name;
};

// ✅ Cancel
const cancelEdit = () => {
  editingId.value = null;
  editName.value = "";
};

// ✅ Update status
const updateStatus = async (id) => {
  if (!editName.value.trim()) return;
  await axios.put(`/api/status/${id}`, { name: editName.value.trim() });
  cancelEdit();
  fetchStatuses();
};

// ✅ Delete
const deleteStatus = async (id) => {
  if (!confirm("Xóa trạng thái này?")) return;
  await axios.delete(`/api/status/${id}`);
  fetchStatuses();
};

onMounted(fetchStatuses);
</script>
<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>
