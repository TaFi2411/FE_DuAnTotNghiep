<template>
  <div class="container py-5">
    
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

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="orders.length === 0" class="alert alert-info shadow-sm">
      <i class="bi bi-info-circle me-2"></i> Không có đơn hàng nào trong mục này.
    </div>

    <div v-else>
      <div
        v-for="order in orders"
        :key="order.id"
        class="card mb-4 shadow-sm order-card"
        :class="{ 'border-primary': expandedOrder === order.id }"
      >
        <div
          class="card-header d-flex justify-content-between align-items-center bg-white py-3"
          @click="toggleOrder(order.id)"
          style="cursor: pointer"
        >
          <div>
            <span class="fw-bold text-dark">Mã đơn: #{{ order.id }}</span> <br />
            <small class="text-muted"><i class="bi bi-clock me-1"></i>{{ formatDate(order.created_date) }}</small>
          </div>
          <div class="text-end">
            <span :class="['badge', getStatusClass(order.statusName), 'me-3 px-3 py-2']">
              {{ getStatusText(order.statusName) }}
            </span>
            <span class="fw-bold text-primary fs-5">{{ formatCurrency(order.total) }}</span>
            <i class="bi ms-2" :class="expandedOrder === order.id ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </div>
        </div>

        <div v-if="expandedOrder === order.id" class="card-body fade-in p-4 border-top">
          <div class="row g-4">
            
            <div class="col-lg-5 border-end">
              <h5 class="fw-bold mb-3 text-secondary border-bottom pb-2">Thông tin giao nhận</h5>
              <div class="mb-4 p-3 bg-light rounded shadow-sm">
                  <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-person-circle fs-5 me-2 text-primary"></i>
                      <p class="mb-0 fw-semibold">{{ order.shippingName }}</p>
                  </div>
                  <div class="d-flex align-items-start mb-2">
                      <i class="bi bi-geo-alt-fill fs-5 me-2 text-primary"></i>
                      <p class="mb-0">{{ order.shipping_address }}</p>
                  </div>
                  <div class="d-flex align-items-center">
                      <i class="bi bi-phone-fill fs-5 me-2 text-primary"></i>
                      <p class="mb-0">{{ order.shippingPhone }}</p>
                  </div>
              </div>

              <h5 class="fw-bold mb-3 text-secondary border-bottom pb-2">Thanh toán</h5>
              <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Phương thức:</span>
                  <span class="fw-medium">{{ order.paymentMethodName }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Trạng thái:</span>
                  <span :class="['badge', order.payment_status ? 'bg-success' : 'bg-warning text-dark']">
                      {{ order.payment_status ? 'Đã thanh toán' : 'Chờ thanh toán' }}
                  </span>
              </div>
            </div>
            
            <div class="col-lg-7">
              <h5 class="fw-bold mb-3 text-secondary border-bottom pb-2">Sản phẩm đã đặt</h5>
              <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Sản phẩm</th>
                            <th class="text-center">SL</th>
                            <th class="text-end">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in order.items" :key="item.productName">
                            <td>
                                <div class="d-flex align-items-center">
                                    <img v-if="item.productImage" :src="item.productImage" 
                                        class="me-3 rounded border" style="width: 50px; height: 50px; object-fit: cover" />
                                    <div>
                                        <div class="fw-bold small">{{ item.productName }}</div>
                                        <div v-if="item.flashSaleSkuId" class="text-danger small fw-bold">
                                            <i class="bi bi-lightning-fill"></i> Flash Sale
                                        </div>
                                        <div class="text-muted extra-small">
                                            <span v-for="(value, key) in item.attributes" :key="key" class="me-2">
                                                {{ key }}: {{ value }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">{{ item.quantity }}</td>
                            <td class="text-end fw-medium">{{ formatCurrency(item.price) }}</td>
                        </tr>
                    </tbody>
                </table>
              </div>

              <div class="bg-light p-3 rounded mt-3">
                  <div class="d-flex justify-content-between mb-1 small">
                      <span>Tiền hàng:</span>
                      <span>{{ formatCurrency(getTotalProductPrice(order)) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-1 small text-muted">
                      <span>Phí vận chuyển:</span>
                      <span>+ {{ formatCurrency(order.feeship) }}</span>
                  </div>
                  <div v-if="order.discountProduct > 0" class="d-flex justify-content-between mb-1 small text-success">
                      <span>Giảm giá sản phẩm:</span>
                      <span>- {{ formatCurrency(order.discountProduct) }}</span>
                  </div>
                  <div v-if="order.discountShipping > 0" class="d-flex justify-content-between mb-1 small text-success">
                      <span>Giảm phí ship:</span>
                      <span>- {{ formatCurrency(order.discountShipping) }}</span>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold">Tổng Thanh Toán:</span>
                      <span class="text-danger fw-bold fs-4">{{ formatCurrency(order.total) }}</span>
                  </div>
              </div>
            </div>
          </div>

          <div v-if="(order.statusName === 'CANCELLED' || order.statusName === 'REFUND_REJECTED') && order.note" 
               class="alert alert-secondary p-3 mt-4 mb-0 border-start border-4 border-danger">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>{{ order.statusName === 'CANCELLED' ? 'Lý do hủy:' : 'Ghi chú Admin:' }}</strong> {{ order.note }}
          </div>

          <div class="text-end mt-4 pt-3 border-top action-btns">
            <button v-if="order.statusName === 'PENDING'" class="btn btn-primary px-4 me-2" @click="processOrder(order.id)">
              <i class="bi bi-check2-square me-1"></i> Xác nhận đơn
            </button>

            <button v-if="order.statusName === 'PROCESSING'" class="btn btn-warning px-4 me-2" @click="shippingOrder(order.id)">
              <i class="bi bi-truck me-1"></i> Giao hàng
            </button>

            <button v-if="order.statusName === 'SHIPPING'" class="btn btn-success px-4 me-2" @click="markDelivered(order.id)">
              <i class="bi bi-house-check me-1"></i> Đã giao hàng
            </button>
            
            <button v-if="['PENDING', 'PROCESSING'].includes(order.statusName)" class="btn btn-outline-danger px-4" @click="cancelOrderByAdmin(order.id)">
              <i class="bi bi-x-circle me-1"></i> Hủy đơn
            </button>
          </div>
        </div>
      </div>

      <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
        <ul class="pagination shadow-sm">
          <li class="page-item" :class="{ disabled: currentPage === 0 }" @click.prevent="loadOrders(currentPage - 1)">
            <a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page - 1 }" @click.prevent="loadOrders(page - 1)">
            <a class="page-link" href="#">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }" @click.prevent="loadOrders(currentPage + 1)">
            <a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from 'sweetalert2';

// Cấu hình Toast mặc định cho SweetAlert2
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

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
    { key: "shipping", label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "completed", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
];

// --- CÁC HÀM TIỆN ÍCH ---
const formatCurrency = (val) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "";

const getStatusClass = (status) => {
    const classes = {
        'PENDING': 'bg-warning text-dark',
        'PROCESSING': 'bg-info text-dark',
        'SHIPPING': 'bg-primary',
        'DELIVERED': 'bg-secondary',
        'COMPLETED': 'bg-success',
        'CANCELLED': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
};

const getStatusText = (status) => {
    const texts = {
        'PENDING': 'Chờ xác nhận',
        'PROCESSING': 'Đang xử lý',
        'SHIPPING': 'Đang giao hàng',
        'DELIVERED': 'Đã giao',
        'COMPLETED': 'Hoàn thành',
        'CANCELLED': 'Đã hủy'
    };
    return texts[status] || status;
};

const getTotalProductPrice = (order) => {
    return (order.total || 0) + (order.totalDiscount || 0) - (order.feeship || 0);
};

// --- CÁC HÀM XỬ LÝ DỮ LIỆU ---
async function loadOrders(page = 0) {
    loading.value = true;
    const token = localStorage.getItem("token");
    try {
        let url = `http://localhost:8080/api/order/admin/all?page=${page}&size=10`;
        if (selectedStatus.value) url += `&status=${selectedStatus.value}`;

        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        orders.value = (res.data.data || res.data.content || []).sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        totalPages.value = res.data.totalPages || 1;
        currentPage.value = res.data.currentPage || page;
    } catch (err) {
        Toast.fire({ icon: 'error', title: 'Lỗi tải danh sách đơn hàng' });
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
        let counts = res.data;
        let total = Object.values(counts).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0);
        counts[""] = total;
        orderCounts.value = counts;
    } catch (err) { console.error(err); }
}

function selectStatus(status) {
    selectedStatus.value = status;
    loadOrders(0);
}

function toggleOrder(id) {
    expandedOrder.value = expandedOrder.value === id ? null : id;
}

// --- CÁC HÀM THAO TÁC ĐƠN HÀNG (SỬ DỤNG SWEETALERT2) ---

async function processOrder(orderId) {
    const result = await Swal.fire({
        title: 'Xác nhận đơn hàng?',
        text: "Chuyển đơn này sang trạng thái Đang xử lý sản phẩm.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Xác nhận ngay',
        cancelButtonText: 'Đóng'
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`http://localhost:8080/api/order/${orderId}/process`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            Toast.fire({ icon: 'success', title: 'Đã xác nhận xử lý đơn hàng' });
            loadOrders(currentPage.value);
            loadOrderCounts();
        } catch (err) {
            Swal.fire('Lỗi!', 'Không thể cập nhật trạng thái.', 'error');
        }
    }
}

async function shippingOrder(orderId) {
    const result = await Swal.fire({
        title: 'Bắt đầu giao hàng?',
        text: "Hành động này thông báo cho khách hàng rằng đơn đang được vận chuyển.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#ffc107',
        confirmButtonText: 'Xác nhận giao hàng',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`http://localhost:8080/api/order/${orderId}/shipping`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            Toast.fire({ icon: 'success', title: 'Đơn hàng đã chuyển cho đơn vị vận chuyển' });
            loadOrders(currentPage.value);
            loadOrderCounts();
        } catch (err) {
            Swal.fire('Lỗi!', 'Lỗi khi chuyển trạng thái giao hàng.', 'error');
        }
    }
}

async function markDelivered(orderId) {
    const result = await Swal.fire({
        title: 'Hoàn tất giao hàng?',
        text: "Xác nhận đơn hàng đã đến tay khách hàng thành công.",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        confirmButtonText: 'Hoàn thành'
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`http://localhost:8080/api/order/${orderId}/delivered`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            Toast.fire({ icon: 'success', title: 'Đã hoàn thành đơn hàng' });
            loadOrders(currentPage.value);
            loadOrderCounts();
        } catch (err) {
            Swal.fire('Lỗi!', 'Không thể đánh dấu đã giao.', 'error');
        }
    }
}

async function cancelOrderByAdmin(orderId) {
    const { isConfirmed } = await Swal.fire({
        title: 'Xác nhận hủy đơn?',
        text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Xác nhận hủy',
        cancelButtonText: 'Quay lại',
    });

    if (isConfirmed) {
        try {
            // Gửi request với note mặc định hoặc để trống nếu Backend cho phép
            await axios.put(`http://localhost:8080/api/order/admin/${orderId}/cancel`, 
            { note: "Đơn hàng bị hủy bởi Quản trị viên" }, // Hoặc { note: "" }
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            Swal.fire('Đã hủy!', 'Đơn hàng đã được hủy thành công.', 'success');
            
            // Reload lại dữ liệu
            loadOrders(currentPage.value);
            loadOrderCounts();
            expandedOrder.value = null;
        } catch (err) {
            Swal.fire('Thất bại', err.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    }
}

onMounted(() => {
    loadOrders();
    loadOrderCounts();
});
</script>

<style scoped>
/* Giao diện thanh lọc trạng thái */
.filter-bar {
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #f8f9fa;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.filter-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.filter-item.active {
  background: #0d6efd;
  color: white;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
}

.count-badge {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.1);
}

.filter-item.active .count-badge {
  background: white;
  color: #0d6efd;
}

/* Thẻ đơn hàng */
.order-card {
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #edf2f7;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important;
}

.extra-small {
    font-size: 0.75rem;
}

/* Hiệu ứng mượt */
.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.action-btns .btn {
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s;
}

.action-btns .btn:hover {
    transform: scale(1.05);
}
</style>