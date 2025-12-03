<template>
  <div class="voucher-page p-3">
    <div class="header-bar">
      <h3 class="page-title mb-0">Danh sách Voucher</h3>
      <button class="add-voucher-btn" @click="addVoucher">
        <i class="bi bi-plus-lg"></i> Thêm voucher
      </button>
    </div>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2">Đang tải dữ liệu voucher...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger text-center">
      <p><strong>Lỗi:</strong> {{ errorMessage }}</p>
      <button class="btn btn-primary" @click="fetchVouchers">Thử lại</button>
    </div>

    <div v-else-if="vouchers.length === 0" class="alert alert-info text-center">
      Không có voucher nào để hiển thị.
    </div>

    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="vouchers"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm voucher...' }"
        theme="polar-bear"
        :max-height="'60vh'"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'title'">
            <strong>{{ props.row.title }}</strong
            ><br />
            <small class="text-muted">Mã: {{ props.row.code }}</small>
          </span>

<span v-else-if="props.column.field === 'discount'">
    <span class="text-danger fw-bold">
        <template v-if="props.row.type === true">
            {{ props.row.discount }}%
        </template>
        <template v-else-if="props.row.type === false">
            {{ Number(props.row.discount).toLocaleString('vi-VN') }} VNĐ
        </template>
        <template v-else>
            N/A
        </template>
    </span>
</span>
          <span v-else-if="props.column.field === 'type'">
            <strong>
              {{ props.row.type ? "Sản phẩm" : "Vận chuyển" }}
            </strong>
          </span>

          <span v-else-if="props.column.field === 'active'">
            <span
              class="badge"
              :class="props.row.active ? 'bg-success' : 'bg-danger'"
            >
              {{ props.row.active ? "Kích hoạt" : "Vô hiệu hóa" }}
            </span>
          </span>

          <span v-else-if="props.column.field === 'actions'">
            <div class="d-flex justify-content-center gap-1">
              <button
                class="btn btn-outline-secondary btn-sm"
                @click="viewVoucher(props.row.id)"
                title="Xem chi tiết"
              >
                <i class="bi bi-eye"></i>
              </button>

              <button
                class="btn btn-outline-primary btn-sm"
                @click="editVoucher(props.row.id)"
                title="Sửa"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <button
                class="btn btn-outline-danger btn-sm"
                @click="deleteVoucher(props.row.id)"
                title="Xóa mềm"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </span>

          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>

    <VoucherDetailModal
      v-if="isModalVisible"
      :voucher-id="selectedVoucherId"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/composables/axios.js";
import VoucherDetailModal from "@/components/admin/VoucherDetailModal.vue";
import Swal from "sweetalert2";
// ✅ BƯỚC 2: IMPORT CSS (Đã có sẵn)
import "vue-good-table-next/dist/vue-good-table-next.css";

const router = useRouter();

const vouchers = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const isModalVisible = ref(false);
const selectedVoucherId = ref(null);

const columns = [
  { label: "Tiêu đề", field: "title", sortable: true },
  { label: "Giảm", field: "discount", sortable: true },
  { label: "Số lượng", field: "quantity", sortable: true },
  { label: "Loại", field: "type" },
  { label: "Trạng thái", field: "active" },
  { label: "Hành động", field: "actions", sortable: false, width: "140px" },
];

const paginationOptions = {
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
};

const fetchVouchers = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const res = await apiClient.get("/api/voucher", {
      params: { page: 0, size: 1000 },
    });
    vouchers.value = res.data.data || res.data.content || [];
  } catch (err) {
    console.error("❌ Lỗi tải voucher:", err);
    errorMessage.value = "Không thể tải dữ liệu voucher.";
  } finally {
    isLoading.value = false;
  }
};

const viewVoucher = (id) => {
  selectedVoucherId.value = id;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  selectedVoucherId.value = null;
};

const editVoucher = (id) => {
  router.push({ name: "VoucherUpdate", params: { id } });
};

const addVoucher = () => {
  router.push({ name: "VoucherAdd" });
};

// 🔹 Xóa mềm voucher dùng Swal
const deleteVoucher = async (id) => {
  const result = await Swal.fire({
    title: "Bạn có chắc?",
    text: `Muốn xóa voucher không!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      await apiClient.put(`/api/voucher/soft-delete/${id}`);
      vouchers.value = vouchers.value.filter((v) => v.id !== id);

      Swal.fire({
        title: "Đã xóa!",
        text: "Voucher đã được xóa mềm thành công.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Lỗi khi xóa mềm voucher:", err);
      console.log("📦 Phản hồi từ backend:", err.response?.data);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể xóa mềm voucher, vui lòng thử lại!",
        icon: "error",
      });
    }
  }
};

// ===========================================
onMounted(fetchVouchers);
</script>

<style scoped>
.voucher-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* === ✅ CSS ĐÃ ĐỒNG BỘ === */
.add-voucher-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #198754;
  border-radius: 6px;
  background-color: #198754; /* Đổi từ #fff */
  color: #fff; /* Đổi từ #198754 */
  height: 38px; /* Đổi từ 30px */
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Thêm shadow */
}

.add-voucher-btn i {
  font-size: 14px; /* Tăng nhẹ cho cân đối */
}

.add-voucher-btn:hover {
  background-color: #157347; /* Làm tối nền khi hover */
  border-color: #146c43;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sửa shadow */
  transform: translateY(-2px); /* Sửa transform */
}
/* === HẾT PHẦN SỬA === */

.d-flex button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.d-flex i {
  font-size: 14px;
}

/* ===== ✅ BƯỚC 3: CSS CHO SCROLLBAR VÀ STICKY HEADER ===== */

/* 1. Style cho vùng cuộn (tbody) */
:deep(.vgt-table-wrapper) {
  /* Tùy chỉnh thanh cuộn cho mỏng và đẹp */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
}

/* 2. Ép header phải "dính" (sticky) */
:deep(.vgt-table thead th) {
  /* Sử dụng !important để đảm bảo
    ghi đè lên mọi style khác 
  */
  position: sticky !important;
  top: 0 !important;

  /* Thêm nền trắng (hoặc màu nền của bạn) 
    để tbody không bị "xuyên thấu" qua header khi cuộn
  */
  background: white !important;

  /* Đảm bảo header luôn nổi lên trên */
  z-index: 10 !important;
}
</style>