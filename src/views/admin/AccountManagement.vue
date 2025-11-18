<template>
  <div class="p-3">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0 fw-normal">Danh sách tài khoản</h3>
    </div>


    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>


    <div v-else>
      <vue-good-table :columns="columns" :rows="accounts" :pagination-options="paginationOptions" :search-options="{
        enabled: true,
        placeholder: 'Tìm kiếm tài khoản...',
      }" theme="polar-bear">
        <template #table-row="props">
          <span v-if="props.column.field === 'active'">
            <button class="btn btn-sm" :class="props.row.active ? 'btn-success' : 'btn-secondary'"
              @click="toggleActive(props.row)">
              {{ props.row.active ? "Hoạt động" : "Khoá" }}
            </button>
          </span>
          <span v-else-if="props.column.field === 'active'">
            <button class="btn btn-sm" :class="props.row.active ? 'btn-success' : 'btn-danger'"
              @click="toggleActive(props.row)">
              {{ props.row.active ? "Hoạt động" : "Khoá" }}
            </button>
          </span>


          <span v-else-if="props.column.field === 'gender'">
            {{ props.row.gender ? "Nam" : "Nữ" }}
          </span>

          <span v-else-if="props.column.field === 'role'">
            {{ props.row.role ? "Admin" : "User" }}
          </span>

          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import "vue-good-table-next/dist/vue-good-table-next.css";

const router = useRouter();
const accounts = ref([]);
const loading = ref(false);


const columns = ref([
  { label: "Họ tên", field: "fullname", sortable: true },
  { label: "Email", field: "email", sortable: true },
  { label: "Số điện thoại", field: "phone", sortable: true },
  { label: "Giới tính", field: "gender", sortable: true, width: "100px" },
  { label: "Vai trò", field: "role", sortable: true, width: "100px" },
  { label: "Trạng thái", field: "active", sortable: true, width: "120px" },
]);


const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  dropdownAllowAll: true,
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
});

const fetchAccounts = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/account", {
      params: { page: 0, size: 1000 },
    });

    const list = Array.isArray(res.data.data)
      ? res.data.data
      : res.data.content || res.data || [];


    const sorted = list.sort((a, b) => b.id - a.id);

    accounts.value = sorted.filter(acc => !acc.role); // role = true là admin
  } catch (err) {
    console.error("❌ Lỗi tải tài khoản:", err);
    Swal.fire("Lỗi", "Không thể tải danh sách tài khoản!", "error");
  } finally {
    loading.value = false;
  }
};


const toggleActive = async (account) => {
  const result = await Swal.fire({
    title: account.active ? 'Khoá tài khoản này?' : 'Mở khoá tài khoản?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
  });
  if (!result.isConfirmed) return;

  try {
    await axios.put(`/api/account/${account.id}/status`, null, {
      params: { active: !account.active },
    });
    account.active = !account.active;
    Swal.fire('Thành công', 'Cập nhật trạng thái thành công!', 'success');
  } catch (err) {
    Swal.fire('Lỗi', 'Không thể cập nhật trạng thái!', 'error');
  }
};


onMounted(fetchAccounts);
</script>

<style scoped>
h3 {
  font-size: 18px;
  font-weight: 400;
  color: #333;
}

.add-account-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 400;
  font-size: 13px;
  padding: 5px 12px;
  border: 1px solid #198754;
  border-radius: 6px;
  background-color: #fff;
  color: #198754;
  height: 32px;
  line-height: 1;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.add-account-btn:hover {
  background-color: #198754;
  color: #fff;
  box-shadow: 0 2px 5px rgba(25, 135, 84, 0.25);
  transform: translateY(-1px);
}

.btn-sm {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 5px;
}
</style>
