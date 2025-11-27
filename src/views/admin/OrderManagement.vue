<template>
  <div class="container py-5">

    <!-- 🔹 BỘ LỌC NGANG ĐẸP -->
    <div class="filter-bar d-flex flex-wrap align-items-center gap-3 mb-4">
      <div
        v-for="status in statusList"
        :key="status.key"
        class="filter-item"
        :class="{ active: selectedStatus === status.key }"
        @click="selectStatus(status.key)"
      >
        <span>{{ status.label }}</span>
        <span class="count-badge" v-if="orderCounts[status.key] !== undefined">
          {{ orderCounts[status.key] }}
        </span>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- KHÔNG CÓ ĐƠN -->
    <div v-else-if="orders.length === 0" class="alert alert-info">
      Không có đơn hàng nào.
    </div>

    <!-- DANH SÁCH ĐƠN -->
    <div v-else>
      <div
        v-for="order in orders"
        :key="order.id"
        class="card mb-4 shadow-sm order-card"
      >
        <!-- HEADER -->
        <div
          class="card-header d-flex justify-content-between align-items-center"
          @click="toggleOrder(order.id)"
          style="cursor: pointer"
        >
          <div>
            <strong>Mã đơn:</strong> {{ order.id }} <br />
            <small>Ngày đặt: {{ formatDate(order.created_date) }}</small>
          </div>
          <div class="text-end">
            <span :class="['badge', getStatusClass(order.statusName), 'me-2']">
              {{ getStatusText(order.statusName) }}
            </span>
            <span class="fw-bold text-primary">{{ formatCurrency(order.total) }}</span>
          </div>
        </div>

        <!-- CHI TIẾT -->
        <div v-if="expandedOrder === order.id" class="card-body fade-in">
          <div class="mb-3">
            <p><strong>Khách hàng:</strong> {{ order.accountName || 'N/A' }}</p>
                 <p><strong>Địa chỉ giao hàng:</strong> {{ order.shipping_address }}</p>
           <p><strong>Số điện thoại:</strong> {{ order.shippingPhone }}</p>
            <p><strong>Phương thức thanh toán:</strong> {{ order.paymentMethodName }}</p>
            <p>
              <strong>Trạng thái thanh toán:</strong>
              <span :class="['badge', order.payment_status ? 'bg-success' : 'bg-secondary']">
                {{ order.payment_status ? 'Đã thanh toán' : 'Chưa thanh toán' }}
              </span>
            </p>
          </div>

          <!-- DANH SÁCH SẢN PHẨM -->
          <table class="table table-sm align-middle">
            <thead>
              <tr>
                <th style="width: 60%">Sản phẩm</th>
                <th class="text-end">Số lượng</th>
                <th class="text-end">Giá</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.productName">
               <td>
  <div class="d-flex align-items-center">
    <img
      v-if="item.productImage"
      :src="item.productImage"
      alt="Ảnh sản phẩm"
      class="me-3 rounded"
      style="width: 60px; height: 60px; object-fit: cover"
    />
    <div>{{ item.productName }}</div>
  </div>

 <div v-if="item.skuAttributes && item.skuAttributes.length" class="mt-1">
  <div v-for="attr in item.skuAttributes" :key="attr.id" class="text-end">
    <strong>{{ attr.optionAttributeName }}:</strong> {{ attr.valueAttributeName }}
  </div>
</div>

<div v-if="item.attributes" class="mt-1">
  <div v-for="(value, key) in item.attributes" :key="key" class="text-end">
    <strong>{{ key }}:</strong> {{ value }}
  </div>
</div>

</td>

                <td class="text-end">{{ item.quantity }}</td>
               
                <td class="text-end">{{ formatCurrency(item.price) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- NÚT HÀNH ĐỘNG -->
          <div class="text-end mt-3">
            <button
              v-if="order.statusName === 'PENDING'"
              class="btn btn-sm btn-outline-primary me-2"
              @click="processOrder(order.id)"
            >
              ⚙️ Xác nhận xử lý
            </button>

            <button
              v-if="order.statusName === 'PROCESSING'"
              class="btn btn-sm btn-outline-warning me-2"
              @click="shippingOrder(order.id)"
            >
              🚚 Chuyển sang đang giao hàng
            </button>
<!-- Nút quản lý đánh dấu đã giao -->
<button
  v-if="order.statusName === 'SHIPPING'"
  class="btn btn-sm btn-outline-secondary me-2"
  @click="markDelivered(order.id)"
>
  ✅ Đã giao
</button>

            <!-- <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteOrder(order.id)"
            >
              Xóa
            </button> -->
          </div>
        </div>
      </div>

      <!-- PHÂN TRANG -->
      <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="loadOrders(currentPage - 1)">
            <a class="page-link" href="#">«</a>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page - 1 }"
            @click="loadOrders(page - 1)"
          >
            <a class="page-link" href="#">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages - 1 }"
            @click="loadOrders(currentPage + 1)"
          >
            <a class="page-link" href="#">»</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const orders = ref([]);
const loading = ref(true);
const expandedOrder = ref(null);
const selectedStatus = ref("");
const currentPage = ref(0);
const totalPages = ref(0);
const orderCounts = ref({});

const statusList = [
  { key: "", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipping", label: "Đang giao hàng" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];


const statusIdMap = {
  pending: 1,
  processing: 2,
  shipping: 3,
  delivered: 6,   
  completed: 4,
  cancelled: 5,
};


function selectStatus(status) {
  selectedStatus.value = status;
  loadOrders(0);
}

function toggleOrder(id) {
  expandedOrder.value = expandedOrder.value === id ? null : id;
}

function getStatusClass(status) {
  switch (status) {
    case "PENDING": return "bg-warning text-dark";
    case "PROCESSING": return "bg-info text-dark";
    case "SHIPPING": return "bg-primary text-white";
    case "DELIVERED": return "bg-secondary text-white"; // ✅ màu cho đã giao
    case "COMPLETED": return "bg-success";
    case "CANCELLED": return "bg-danger";
    default: return "bg-secondary";
  }
}

function getStatusText(status) {
  switch (status) {
    case "PENDING": return "Chờ xác nhận";
    case "PROCESSING": return "Đang xử lý";
    case "SHIPPING": return "Đang giao hàng";
    case "DELIVERED": return "Đã giao"; // ✅ hiển thị text
    case "COMPLETED": return "Hoàn thành";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
}



function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
}

function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "";
}

async function loadOrders(page = 0) {
  loading.value = true;
  console.log("📦 Orders loaded:", orders.value);

  const token = localStorage.getItem("token");
  try {
    let url = `http://localhost:8080/api/order/admin/all?page=${page}&size=10`;

    
    if (selectedStatus.value) url += `&status=${selectedStatus.value}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

 // Lấy danh sách đơn
    let data = response.data.data || response.data.content || [];

    // Sắp xếp theo ngày tạo, mới nhất lên đầu
    orders.value = data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));    totalPages.value = response.data.totalPages || 1;
    currentPage.value = response.data.currentPage || page;
    console.log(response.data);

  } catch (err) {
    console.error("Lỗi khi tải đơn hàng:", err);
  } finally {
    loading.value = false;
  }
}


async function loadOrderCounts() {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get("http://localhost:8080/api/order/count-by-status", {
      headers: { Authorization: `Bearer ${token}` },
    });
    orderCounts.value = res.data;
  } catch (err) {
    console.error("Không thể tải số lượng đơn hàng:", err);
  }
}

async function processOrder(orderId) {
  if (!confirm("Xác nhận đơn hàng đang được xử lý?")) return;
  const token = localStorage.getItem("token");
  try {
    await axios.put(
      `http://localhost:8080/api/order/${orderId}/process`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Đơn hàng đã được xác nhận xử lý!");
    loadOrders(currentPage.value);
    loadOrderCounts();
  } catch (err) {
    console.error(err);
    alert("Lỗi khi cập nhật trạng thái!");
  }
}

async function shippingOrder(orderId) {
 console.log("🚚 FE CALL shippingOrder(orderId) =", orderId);

  if (!confirm("Chuyển đơn sang trạng thái Đang giao hàng?")) return;
  const token = localStorage.getItem("token");
  

  try {
    await axios.put(
      
      `http://localhost:8080/api/order/${orderId}/shipping`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Đơn hàng đã chuyển sang đang giao hàng!");
    loadOrders(currentPage.value);
    loadOrderCounts();
  } catch (err) {
    console.error(err);
    alert("Lỗi khi cập nhật trạng thái!");
  }
}
async function markDelivered(orderId) {
  if (!confirm("Xác nhận đơn hàng đã giao xong?")) return;
  const token = localStorage.getItem("token");
  try {
    await axios.put(
      `http://localhost:8080/api/order/${orderId}/delivered`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Đơn hàng đã được đánh dấu là đã giao!");
    loadOrders(currentPage.value);
    loadOrderCounts();
  } catch (err) {
    console.error(err);
    alert("Lỗi khi cập nhật trạng thái!");
  }
}

async function deleteOrder(orderId) {
  if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`http://localhost:8080/api/order/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Đã xóa đơn hàng!");
    loadOrders(currentPage.value);
    loadOrderCounts();
  } catch (err) {
    console.error(err);
    alert("Lỗi khi xóa đơn hàng!");
  }
}

onMounted(() => {
  loadOrders();
  loadOrderCounts();
});
</script>

<style scoped>
/* Bộ lọc ngang */
.filter-bar {
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f8f9fa;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.filter-item:hover {
  background: #e9f3ff;
  transform: translateY(-2px);
}

.filter-item.active {
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.count-badge {
  background: #fff;
  color: #007bff;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.filter-item.active .count-badge {
  background: white;
  color: #007bff;
}

.order-card {
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: scale(1.01);
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
