<template>
  <div class="container py-5">
    <h2 class="mb-4">📊 Báo cáo Thống kê Chi tiết</h2>

    <div class="row g-3 mb-5 p-3 border rounded shadow-sm bg-light">
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

      <div class="col-md-3" v-if="timeFilter === 'custom'">
        <label class="form-label">Ngày bắt đầu:</label>
        <input type="date" v-model="startDate" class="form-control" @change="loadAllData()" />
      </div>
      <div class="col-md-3" v-if="timeFilter === 'custom'">
        <label class="form-label">Ngày kết thúc:</label>
        <input type="date" v-model="endDate" class="form-control" @change="loadAllData()" />
      </div>
    </div>
    
    <div class="row g-4 mb-5">
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


    <div class="row g-4 mb-5">
      <div class="col-lg-12">
        <div class="card p-4 shadow-lg h-100">
          <h5 class="fw-bold mb-4">📈 Xu hướng Doanh thu và Đơn hàng</h5>
          
          <div class="mb-3 d-flex gap-3 align-items-center">
            <label class="form-label mb-0">Hiển thị theo:</label>
            <select v-model="trendGranularity" class="form-control w-auto" @change="loadChartData">
              <option value="DAY">Ngày</option>
              <option value="MONTH">Tháng</option>
            </select>
          </div>
          
          <div v-if="loading" class="text-center py-5">Đang tải dữ liệu biểu đồ...</div>
          <div v-else>
            <ReusableChart 
              chartId="revenueTrendChart"
              chartType="line"
              :chartData="revenueChartData"
              :chartOptions="{
                responsive: true, 
                interaction: { mode: 'index', intersect: false },
                scales: { 
                  y: { type: 'linear', display: true, position: 'left', title: {display: true, text: 'Doanh thu (VND)'} },
                  y1: { type: 'linear', display: true, position: 'right', title: {display: true, text: 'Đơn hàng (SL)'}, grid: { drawOnChartArea: false } }
                } 
              }"
            />
          </div>
        </div>
        
      </div>
    </div>

    <div class="row g-4 mb-5">
      <div class="col-lg-6 col-md-12">
        <div class="card p-4 shadow-lg h-100">
          <h5 class="fw-bold mb-4">📊 Tỷ lệ Trạng thái Đơn hàng</h5>
          <div v-if="loading" class="text-center py-5">Đang tải dữ liệu...</div>
          <div v-else>
            <ReusableChart 
              chartId="statusRatioChart"
              chartType="doughnut"
              :chartData="statusRatioData"
              :chartOptions="{responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'bottom'}}}"
            />
          </div>
        </div>
      </div>
      
      <div class="col-lg-6 col-md-12">
        <div class="card p-4 shadow-lg h-100">
          <h5 class="fw-bold mb-4">⭐ Top {{ topLimit }} Sản phẩm Bán chạy</h5>
          <div v-if="loading" class="text-center py-5">Đang tải dữ liệu...</div>
          <div v-else>
            <ReusableChart 
              chartId="topSellingChart"
              chartType="bar"
              :chartData="topSellingChartData"
              :chartOptions="{responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: {x: {beginAtZero: true}}}"
            />
          </div>
        </div>
      </div>
    </div>

      <div class="mb-4 d-flex align-items-center gap-2">
    <input type="number" v-model="threshold" placeholder="Nhập số lượng tối đa" class="form-control w-auto" @change="loadLowStockProducts()" />
    <button class="btn btn-primary" @click="loadLowStockProducts()">Lọc</button>
  </div>

    <div class="low-stock-products">
    <h5>Sản phẩm tồn kho dưới {{ threshold }}</h5>
      <div v-if="loading" class="text-center py-5">Đang tải dữ liệu...</div>
      <div v-else-if="lowStockProducts.length === 0" class="alert alert-info mt-3">
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
      <h5>Tất cả Sản phẩm bán chạy nhất</h5>
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
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/composables/axios";
import ReusableChart from '@/components/ReusableChart.vue'; 

// --- STATE/BIẾN ---
const totalRevenue = ref(0);
const totalOrders = ref(0);
const totalInventory = ref(0);
const totalSoldProducts = ref(0);
const loading = ref(true);
const lowStockProducts = ref([]);
const threshold = ref(20);
const topSellingProducts = ref([]);
const topLimit = ref(5); // Dùng cho biểu đồ Top Selling

// Bộ lọc ngày tháng (Vẫn giữ các biến cũ)
const startDate = ref("");
const endDate = ref("");
const timeFilter = ref("month"); // Đặt mặc định là tháng này
const trendGranularity = ref('MONTH'); // Mặc định biểu đồ theo MONTH

// Dữ liệu thô từ API cho biểu đồ
const rawTrendData = ref([]); 
const rawStatusData = ref({});

// --- HELPER ---
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
}

// Helper: chuyển Date về yyyy-MM-dd theo giờ Việt Nam
function getLocalDateString(date) {
  // ⭐ CODE MỚI: Dùng các thành phần Local Date để tránh lỗi tính toán múi giờ ⭐
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// --- DỮ LIỆU COMPUTED CHO BIỂU ĐỒ ---
// 1. Dữ liệu cho Biểu đồ Xu hướng (Line Chart)
const revenueChartData = computed(() => ({
  labels: rawTrendData.value.map(item => item.timePeriod),
  datasets: [
    {
      label: 'Doanh thu (VND)',
      data: rawTrendData.value.map(item => item.totalRevenue),
      borderColor: '#6a11cb',
      fill: true,
      tension: 0.3,
      yAxisID: 'y'
    },
    {
      label: 'Đơn hàng (SL)',
      data: rawTrendData.value.map(item => item.totalOrders),
      borderColor: '#28a745',
      backgroundColor: '#28a745',
      fill: false,
      tension: 0.3,
      yAxisID: 'y1'
    }
  ]
}));

// 2. Dữ liệu cho Biểu đồ Tỷ lệ Trạng thái (Doughnut Chart)
const statusRatioData = computed(() => ({
    labels: ['Hoàn thành', 'Đang giao/Xử lý', 'Đã hủy', 'Đã hoàn tiền'],
    datasets: [{
        data: [
          rawStatusData.value['COMPLETED'] || 0,
          (rawStatusData.value['PENDING'] || 0) + (rawStatusData.value['PROCESSING'] || 0) + (rawStatusData.value['SHIPPING'] || 0) + (rawStatusData.value['DELIVERED'] || 0),
          rawStatusData.value['CANCELLED'] || 0,
          rawStatusData.value['REFUNDED'] || 0
        ],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#17a2b8'],
        hoverOffset: 4
    }]
}));

// 3. Dữ liệu cho Top Sản phẩm Bán chạy (Bar Chart)
const topSellingChartData = computed(() => ({
    labels: topSellingProducts.value.slice(0, topLimit.value).map(item => item.productName), // Chỉ lấy topLimit (5) cho biểu đồ
    datasets: [{
      label: 'Số lượng đã bán',
      data: topSellingProducts.value.slice(0, topLimit.value).map(item => item.quantitySold),
      backgroundColor: ['#6a11cb', '#2575fc', '#28a745', '#17a2b8', '#ffc107'], // Thêm nhiều màu
      borderRadius: 4
    }]
}));


// --- HÀM TẢI DỮ LIỆU CHÍNH (Gộp tất cả logic API) ---

// 1. Load Metrics (Doanh thu, Đơn hàng, Tồn kho, Sản phẩm đã bán)
async function loadMetrics() {
  // Sử dụng loading = true ở hàm loadAllData()
let formattedStartDate = startDate.value ? new Date(startDate.value + "T00:00:00").toISOString() : null;
  let formattedEndDate = endDate.value ? new Date(endDate.value + "T23:59:59").toISOString() : null;


  
  try {
    // ⭐ ĐÃ SỬA: Dùng đường dẫn tương đối ⭐
    const url = `/api/statistics/revenue`;
    const response = await axios.get(url, {
      params: { startDate: formattedStartDate, endDate: formattedEndDate }
    });

    totalRevenue.value = response.data.totalRevenue || 0;
    totalOrders.value = response.data.totalOrders || 0;
    totalInventory.value = response.data.totalInventory || 0;
    totalSoldProducts.value = response.data.totalSoldProducts || 0;
  } catch (err) {
    console.error("Lỗi khi tải thống kê doanh thu:", err);
  }
}

// 2. Load Sản phẩm tồn kho thấp
async function loadLowStockProducts() {
  // Lấy dữ liệu không cần lọc theo ngày
  try {
    // ⭐ ĐÃ SỬA: Dùng đường dẫn tương đối ⭐
    const response = await axios.get("/api/statistics/low-stock", {
      params: { threshold: threshold.value }
    });
    lowStockProducts.value = response.data.lowStockProducts;
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm tồn kho thấp:", err);
  }
}

// 3. Load Top Sản phẩm Bán chạy (Tất cả sản phẩm)
async function loadTopSellingProducts() {
let formattedStartDate = startDate.value ? new Date(startDate.value + "T00:00:00").toISOString() : null;
  let formattedEndDate = endDate.value ? new Date(endDate.value + "T23:59:59").toISOString() : null;
  
  try {
    // ⭐ ĐÃ SỬA: Dùng đường dẫn tương đối ⭐
    const response = await axios.get("/api/statistics/top-selling", {
      params: { 
        limit: 1000, 
        startDate: formattedStartDate, 
        endDate: formattedEndDate     
      } 
    });
    topSellingProducts.value = response.data.topSellingProducts;
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm bán chạy:", err);
  }
}

// 4. Load Dữ liệu Biểu đồ (Xu hướng & Trạng thái)
async function loadChartData() {
let formattedStartDate = startDate.value ? new Date(startDate.value + "T00:00:00").toISOString() : null;
  let formattedEndDate = endDate.value ? new Date(endDate.value + "T23:59:59").toISOString() : null;
  
  try {
    // 1. Xu hướng Doanh thu/Đơn hàng
    // ⭐ ĐÃ SỬA: Dùng đường dẫn tương đối ⭐
    const trendResponse = await axios.get("/api/statistics/revenue-trend", {
      params: { 
        startDate: formattedStartDate, 
        endDate: formattedEndDate, 
        granularity: trendGranularity.value 
      }
    });
    rawTrendData.value = trendResponse.data;

    // 2. Phân phối Trạng thái
    // ⭐ ĐÃ SỬA: Dùng đường dẫn tương đối ⭐
    const statusResponse = await axios.get("/api/statistics/status-distribution", {
      params: { startDate: formattedStartDate, endDate: formattedEndDate }
    });
    rawStatusData.value = statusResponse.data;
    
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu biểu đồ:", err);
  } finally {
    loading.value = false; // Chỉ set loading = false sau khi tất cả dữ liệu biểu đồ đã tải xong
  }
}


// ⭐ HÀM GỌI TỔNG THỂ KHI NGÀY THÁNG THAY ĐỔI ⭐
async function loadAllData() {
  loading.value = true; // Bắt đầu tải, đặt loading = true
  // Sử dụng Promise.all để tải đồng thời tất cả các API, giúp giảm thời gian chờ
  await Promise.all([
    loadMetrics(),
    loadTopSellingProducts(),
    loadLowStockProducts(),
    loadChartData() // loadChartData sẽ set loading.value = false ở cuối
  ]);
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
  
  loadAllData();
}

// Reset filter về custom
function resetFilter() {
  timeFilter.value = "custom";
  startDate.value = "";
  endDate.value = "";
  loadAllData();
}

onMounted(() => {
  // Bắt đầu bằng việc áp dụng filter mặc định (tháng này)
  applyTimeFilter(); 
});
</script>