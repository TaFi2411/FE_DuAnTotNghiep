<template>
  <div class="container mt-4">
    <h2>Quản lý Voucher</h2>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'list' }"
          @click="activeTab = 'list'"
          >Danh sách</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'add' }"
          @click="activeTab = 'add'"
          >{{ isEditing ? "Cập nhật" : "Thêm mới" }}</a
        >
      </li>
    </ul>

    <!-- Tab Danh sách -->
    <div v-show="activeTab === 'list'">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giảm (%)</th>
            <th>Số lượng</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="voucher in vouchers" :key="voucher.id">
            <td>{{ voucher.id }}</td>
            <td>{{ voucher.name }}</td>
            <td>{{ voucher.discount }}</td>
            <td>{{ voucher.quantity }}</td>
            <td>{{ formatDate(voucher.stardate) }}</td>
            <td>{{ formatDate(voucher.enddate) }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" @click="editVoucher(voucher)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="deleteVoucher(voucher.id)">Xoá</button>
            </td>
               
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tab Thêm/Cập nhật -->
    <div v-show="activeTab === 'add'">
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Tên voucher</label>
          <input v-model="voucher.name" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea v-model="voucher.description" class="form-control" rows="3"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Số lượng</label>
          <input v-model.number="voucher.quantity" type="number" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Giảm giá (%)</label>
          <input v-model.number="voucher.discount" type="number" class="form-control" required min="0" max="100" />
        </div>

        <div class="mb-3">
          <label class="form-label">Ngày bắt đầu</label>
          <input v-model="voucher.stardate" type="date" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Ngày kết thúc</label>
          <input v-model="voucher.enddate" type="date" class="form-control" />
        </div>

        <button type="submit" class="btn btn-success">
          {{ isEditing ? "Cập nhật" : "Thêm voucher" }}
        </button>

        <div v-if="message" class="alert alert-success mt-3">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios"; // axios có cấu hình sẵn baseURL

export default {
  name: "VoucherManager",
  data() {
    return {
      activeTab: "list",
      vouchers: [],
      message: "",
      isEditing: false,
      voucher: {
        id: null,
        name: "",
        description: "",
        quantity: 0,
        discount: 0,
        stardate: "",
        enddate: "",
      },
    };
  },
  mounted() {
    this.fetchVouchers();
  },
  methods: {
    async fetchVouchers() {
      try {
        const res = await axios.get("/voucher");
        this.vouchers = res.data;
      } catch (err) {
        console.error("Lỗi khi tải danh sách voucher:", err);
      }
    },
    async submitForm() {
      try {
        if (this.isEditing) {
          await axios.put(`/voucher/${this.voucher.id}`, this.voucher);
          this.message = "Cập nhật voucher thành công!";
        } else {
          await axios.post("/voucher", this.voucher);
          this.message = "Thêm voucher thành công!";
        }
        this.resetForm();
        this.fetchVouchers();
        this.activeTab = "list";
      } catch (err) {
        console.error("Lỗi khi lưu voucher:", err);
        alert("Thao tác thất bại.");
      }
    },
    async deleteVoucher(id) {
      if (confirm("Bạn có chắc muốn xoá voucher này?")) {
        try {
          await axios.delete(`/voucher/${id}`);
          this.fetchVouchers();
        } catch (err) {
          console.error("Lỗi khi xoá:", err);
          alert("Xoá thất bại.");
        }
      }
    },
    editVoucher(voucher) {
      this.voucher = { ...voucher }; // sao chép dữ liệu sang form
      this.isEditing = true;
      this.activeTab = "add";
    },
    resetForm() {
      this.voucher = {
        id: null,
        name: "",
        description: "",
        quantity: 0,
        discount: 0,
        stardate: "",
        enddate: "",
      };
      this.isEditing = false;
      this.message = "";
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN");
    },
  },
};
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}

</style>
