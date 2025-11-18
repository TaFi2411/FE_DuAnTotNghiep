<template>
  <div class="container py-5">

    <!-- 🔹 THỐNG KÊ DOANH THU & ĐƠN HÀNG -->
    <!-- 🔹 THỐNG KÊ DOANH THU & ĐƠN HÀNG -->
<div class="row g-4 mb-4">
  <div class="col-md-3">
    <div class="stat-card bg-primary text-white d-flex flex-column align-items-center">
      <h5>Tổng doanh thu đạt được</h5>
      <p class="stat-value">{{ formatCurrency(totalRevenue) }}</p>
    </div>
  </div>

  <div class="col-md-3">
    <div class="stat-card bg-success text-white d-flex flex-column align-items-center">
      <h5>Tổng số lượng đơn hàng</h5>
      <p class="stat-value">{{ totalOrders }}</p>
    </div>
  </div>

  <div class="col-md-3">
    <div class="stat-card bg-warning text-dark d-flex flex-column align-items-center">
      <h5>Tổng số lượng tồn kho</h5>
      <p class="stat-value">{{ totalInventory }}</p>
    </div>
  </div>

  <div class="col-md-3">
    <div class="stat-card bg-info text-white d-flex flex-column align-items-center">
      <h5>Tổng số sản phẩm đã bán</h5>
      <p class="stat-value">{{ totalSoldProducts }}</p>
    </div>
  </div>
</div>


    <!-- 🔹 NHẬP THRESHOLD -->
    <div class="mb-4 d-flex align-items-center gap-2">
      <input type="number" v-model="threshold" placeholder="Nhập số lượng tối đa" class="form-control w-auto" @change="loadLowStockProducts()" />
      <button class="btn btn-primary" @click="loadLowStockProducts()">Lọc</button>
    </div>

    <!-- 🔹 HIỂN THỊ SẢN PHẨM TỒN KHO THẤP -->
    <div class="low-stock-products">
      <h5>Sản phẩm tồn kho dưới {{ threshold }}</h5>

      <div v-if="lowStockProducts.length === 0" class="alert alert-info mt-3">
        Không có sản phẩm nào tồn kho thấp.
      </div>

      <ul v-else class="list-unstyled">
        <li v-for="item in lowStockProducts" 
            :key="item.skuId"
            class="d-flex align-items-center mb-3 p-3 border rounded shadow-sm bg-light">
          <img :src="item.productImage" width="70" height="70" class="me-3 rounded border"/>
          <div class="flex-grow-1">
            <h6 class="mb-1">{{ item.productName }}</h6>
            <small class="text-muted">SKU ID: {{ item.skuId }}</small>
            <div class="mt-1 small text-secondary">
              <span v-for="(value, key) in item.attributes" :key="key">
                <strong>{{ key }}:</strong> {{ value }} &nbsp;
              </span>
            </div>
          </div>
          <div class="fw-bold text-danger ms-3">
            Số lượng: {{ item.quantity }}
          </div>
        </li>
      </ul>
    </div>
<div class="top-selling-products mt-5">
  <h5>Sản phẩm bán chạy nhất</h5>
  <ul class="list-unstyled">
    <li v-for="item in topSellingProducts" :key="item.skuId"
        class="d-flex align-items-center mb-3 p-3 border rounded shadow-sm bg-light">
      <img :src="item.productImage" width="70" height="70" class="me-3 rounded border"/>
      <div class="flex-grow-1">
        <h6 class="mb-1">{{ item.productName }}</h6>
        <div class="mt-1 small text-secondary">
          <span v-for="(value, key) in item.attributes" :key="key">
            <strong>{{ key }}:</strong> {{ value }} &nbsp;
          </span>
        </div>
      </div>
      <div class="fw-bold text-success ms-3">
        Đã bán: {{ item.quantitySold }}
      </div>
    </li>
  </ul>
</div>

    <!-- 🔹 LỌC THEO NGÀY / TUẦN / THÁNG / NĂM -->
    <div class="row g-3 mt-4">
      <div class="col-md-4">
        <label class="form-label">Kiểu thống kê:</label>
        <select v-model="timeFilter" class="form-control" @change="applyTimeFilter">
          <option value="custom">Khoảng ngày</option>
          <option value="today">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button class="btn btn-secondary w-100" @click="resetFilter">Xóa lọc</button>
      </div>

      <!-- Chỉ hiển thị khi ở mode custom -->
      <div class="col-md-3" v-if="timeFilter === 'custom'">
        <label class="form-label">Ngày bắt đầu:</label>
        <input type="date" v-model="startDate" class="form-control" @change="loadOrders()" />
      </div>
      <div class="col-md-3" v-if="timeFilter === 'custom'">
        <label class="form-label">Ngày kết thúc:</label>
        <input type="date" v-model="endDate" class="form-control" @change="loadOrders()" />
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- KHÔNG CÓ ĐƠN -->
    <div v-else-if="totalOrders === 0" class="alert alert-info mt-3">
      Không có đơn hàng nào.
    </div>

    <!-- PHÂN TRANG -->
    <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="loadOrders(currentPage - 1)">
          <a class="page-link" href="#">«</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page - 1 }" @click="loadOrders(page - 1)">
          <a class="page-link" href="#">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }" @click="loadOrders(currentPage + 1)">
          <a class="page-link" href="#">»</a>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/composables/axios";

const totalRevenue = ref(0);
const totalOrders = ref(0);
const loading = ref(true);
const currentPage = ref(0);
const totalPages = ref(0);
const totalInventory = ref(0);
const lowStockProducts = ref([]);
const threshold = ref(20);
const totalSoldProducts = ref(0);
const startDate = ref("");
const endDate = ref("");
const timeFilter = ref("custom");
const topSellingProducts = ref([]);
const topLimit = ref(1); // lấy 5 sản phẩm bán chạy nhất
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
}

// Helper: chuyển Date về yyyy-MM-dd theo giờ Việt Nam
function getLocalDateString(date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date - tzOffset).toISOString().split("T")[0];
}

// Load danh sách đơn hàng
async function loadOrders(page = 0) {
  loading.value = true;

  let formattedStartDate = null;
  let formattedEndDate = null;

if (timeFilter.value === "custom") {
    // Custom date: convert sang ISO để lấy đúng từ 00:00 -> 23:59
    formattedStartDate = startDate.value ? new Date(startDate.value).toISOString() : null;
    formattedEndDate = endDate.value ? new Date(endDate.value + "T23:59:59").toISOString() : null;
} else {
    // Today / week / month / year: gửi chuỗi yyyy-MM-dd là đủ
    formattedStartDate = startDate.value || null;
    formattedEndDate = endDate.value || null;
}


  try {
    const url = `http://localhost:8080/api/statistics/revenue?page=${page}&size=10`;

    const response = await axios.get(url, {
      params: { startDate: formattedStartDate, endDate: formattedEndDate }
    });

    totalRevenue.value = response.data.totalRevenue || 0;
    totalOrders.value = response.data.totalOrders || 0;
    totalInventory.value = response.data.totalInventory || 0;
    totalSoldProducts.value = response.data.totalSoldProducts || 0;
    totalPages.value = response.data.totalPages || 1;
    currentPage.value = response.data.currentPage || page;
  } catch (err) {
    console.error("Lỗi khi tải thống kê doanh thu:", err);
  } finally {
    loading.value = false;
  }
}


// Load sản phẩm tồn kho thấp
async function loadLowStockProducts() {
  try {
    const response = await axios.get("http://localhost:8080/api/statistics/low-stock", {
      params: { threshold: threshold.value }
    });
    lowStockProducts.value = response.data.lowStockProducts;
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

// Load sản phẩm bán chạy nhất (không cần truyền ngày)
async function loadTopSellingProducts() {
  try {
    const response = await axios.get("http://localhost:8080/api/statistics/top-selling", {
      params: { limit: topLimit.value } // chỉ cần limit
    });
 console.log("Top Selling Raw Response:", response); // toàn bộ response
console.log("Top Selling Data:", response.data);   
    topSellingProducts.value = response.data.topSellingProducts;
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm bán chạy:", err);
  }
}


// Áp dụng filter theo thời gian
function applyTimeFilter() {
  const now = new Date();

  if (timeFilter.value === "today") {
    startDate.value = getLocalDateString(now);
    endDate.value = startDate.value;
  }
  else if (timeFilter.value === "week") {
    const firstDay = new Date(now);
    const dayOfWeek = firstDay.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    firstDay.setDate(firstDay.getDate() + diffToMonday);

    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);

    startDate.value = getLocalDateString(firstDay);
    endDate.value = getLocalDateString(lastDay);
  }
  else if (timeFilter.value === "month") {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    startDate.value = getLocalDateString(firstDay);
    endDate.value = getLocalDateString(lastDay);
  }
  else if (timeFilter.value === "year") {
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const lastDay = new Date(now.getFullYear(), 11, 31);

    startDate.value = getLocalDateString(firstDay);
    endDate.value = getLocalDateString(lastDay);
  }

  loadOrders();
  loadTopSellingProducts();
}

// Reset filter về custom
function resetFilter() {
  timeFilter.value = "custom";
  startDate.value = "";
  endDate.value = "";
  loadOrders();
}

onMounted(() => {
loadLowStockProducts();
loadOrders();
loadTopSellingProducts();

});
</script>

<style scoped>
/* 🔹 CARD THỐNG KÊ */
.stat-card {
  display: flex;
  flex-direction: column;
  justify-content: center; /* căn giữa theo chiều dọc */
  align-items: center;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  height: 100%; /* ép thẻ full chiều cao của col */
  min-height: 180px; /* chiều cao tối thiểu để đều nhau */
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 10px;
}


/* Gradient background theo loại */
.bg-primary {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}
.bg-success {
  background: linear-gradient(135deg, #28a745, #85e085);
}
.bg-warning {
  background: linear-gradient(135deg, #ffc107, #ffe680);
}
.bg-info {
  background: linear-gradient(135deg, #17a2b8, #5ad4e1);
}



/* 🔹 LOW STOCK PRODUCTS */
.low-stock-products h5 {
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #2575fc;
  display: inline-block;
  padding-bottom: 0.25rem;
}

.low-stock-products ul li {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  background: #f9f9f9;
}

.low-stock-products ul li:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  background: #f1f5f9;
}

/* Ảnh sản phẩm */
.low-stock-products img {
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  transition: transform 0.3s ease;
}

.low-stock-products img:hover {
  transform: scale(1.05);
}

/* 🔹 BUTTONS */
.btn-primary, .btn-secondary {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2575fc, #6a11cb);
  transform: scale(1.05);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d, #a0a0a0);
  border: none;
}

.btn-secondary:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #a0a0a0, #6c757d);
}

/* 🔹 PAGINATION */
.pagination .page-item .page-link {
  border-radius: 0.5rem;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
  color: #2575fc;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: #fff;
  border: none;
}

.pagination .page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 🔹 RESPONSIVE */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 1rem;
  }
  .low-stock-products ul li {
    flex-direction: column;
    align-items: flex-start;
  }
  .low-stock-products div.fw-bold {
    margin-top: 0.5rem;
  }
}
.top-selling-products h5 {
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #28a745;
  display: inline-block;
  padding-bottom: 0.25rem;
}

.top-selling-products ul li {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  background: #f9f9f9;
}

.top-selling-products ul li:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  background: #e6ffed;
}

</style>
