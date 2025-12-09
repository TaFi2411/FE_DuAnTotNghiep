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

    <div v-else-if="orders.length === 0" class="alert alert-info">
      Không có đơn hàng nào.
    </div>

    <div v-else>
      <div
        v-for="order in orders"
        :key="order.id"
        class="card mb-4 shadow-sm order-card"
      >
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

        <div v-if="expandedOrder === order.id" class="card-body fade-in p-4">
          <div class="row g-4">
            
            <div class="col-lg-5 border-end">
              <h5 class="fw-bold mb-3 text-secondary">Thông tin giao nhận</h5>
              
              <div class="mb-4 p-3 bg-light rounded">
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

              <h5 class="fw-bold mb-3 text-secondary mt-4">Thông tin thanh toán</h5>
              <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Phương thức:</span>
                  <span class="fw-medium">{{ order.paymentMethodName }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Trạng thái:</span>
                  <span :class="['badge', 'fw-medium', order.payment_status ? 'bg-success' : 'bg-secondary']">
                      {{ order.payment_status ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                  </span>
              </div>
            </div>
            
            <div class="col-lg-7">
              
              <h5 class="fw-bold mb-3 text-secondary">Sản phẩm đã đặt</h5>
              <div class="table-responsive">
                <table class="table table-striped table-sm align-middle mb-4">
                  <thead class="table-light">
                    <tr>
                      <th style="width: 50%">Sản phẩm</th>
                      <th class="text-end">Số lượng</th>
                      <th class="text-end">Giá/SP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items" :key="item.productName">
                      <td>
                        <div class="d-flex align-items-start product-details-wrapper">
                          <img
                            v-if="item.productImage"
                            :src="item.productImage"
                            alt="Ảnh sản phẩm"
                            class="me-3 rounded"
                            style="width: 60px; height: 60px; object-fit: cover"
                          />
                          <div>
                            <div class="fw-medium">{{ item.productName }}</div>
                            <div class="text-muted small mt-1">
                              <span v-for="attr in item.skuAttributes" :key="attr.id" class="me-2">
                                {{ attr.optionAttributeName }}: **{{ attr.valueAttributeName }}**
                              </span>
                              <span v-for="(value, key) in item.attributes" :key="key" class="me-2">
                                {{ key }}: {{ value }}<br></br>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="text-end fw-medium">{{ item.quantity }}</td>
                      <td class="text-end">{{ formatCurrency(item.price) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="d-flex justify-content-end">
                <div class="col-12 p-0"> <div class="pt-2">
                      
                      <div class="d-flex justify-content-between mb-1 small text-muted border-top pt-2">
                          <span>Tổng tiền sản phẩm:</span>
                          <span class="fw-normal">{{ formatCurrency(getTotalProductPrice(order)) }}</span>
                      </div>
                      
                      <div class="d-flex justify-content-between mb-1 small text-muted">
                          <span>Phí vận chuyển:</span>
                          <span class="fw-normal">{{ formatCurrency(order.feeship) }}</span>
                      </div>
                      
                      <div v-if="order.discountProduct > 0" class="d-flex justify-content-between mb-1 small text-success">
                          <span>Giảm giá Sản phẩm:</span>
                          <span class="fw-semibold">- {{ formatCurrency(order.discountProduct) }}</span>
                      </div>
                      
                      <div v-if="order.discountShipping > 0" class="d-flex justify-content-between mb-1 small text-success">
                          <span>Giảm giá Vận chuyển:</span>
                          <span class="fw-semibold">- {{ formatCurrency(order.discountShipping) }}</span>
                      </div>
                      
                        
                    <div class="voucher-details small bg-light p-2 rounded text-start mt-3" v-if="order.productVoucherTitle || order.shippingVoucherTitle">
                        <div class="fw-bold mb-1 text-dark"><i class="bi bi-tag-fill me-1"></i> Voucher đã áp dụng:</div>
                        <ul class="list-unstyled mb-0 ms-2">
                            <li v-if="order.productVoucherTitle">
                                <span class="text-success">•</span> Sản phẩm: {{ order.productVoucherTitle }}
                            </li>
                            <li v-if="order.shippingVoucherTitle">
                                <span class="text-success">•</span> Vận chuyển: {{ order.shippingVoucherTitle }}
                            </li>
                        </ul>
                    </div>


                      <hr class="my-2 border-2">
                      
                      <div class="d-flex justify-content-between align-items-center pt-1">
                          <span class="fw-bold fs-5">Tổng Thanh Toán:</span> 
                          <span class="text-danger fw-bolder fs-3">{{ formatCurrency(order.total) }}</span>
                      </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="(order.statusName === 'CANCELLED' || order.statusName === 'REFUND_REJECTED' || order.statusName === 'REFUNDED') && order.note" class="alert p-3 mt-4" :class="order.statusName === 'CANCELLED' ? 'alert-danger' : 'alert-info'">
            <i class="bi bi-info-circle me-2 fs-5"></i>
            <span class="fw-semibold">{{ order.statusName === 'CANCELLED' ? 'Lý do hủy:' : 'Ghi chú Admin:' }}</span> {{ order.note }}
          </div>

          <div 
    v-if="order.statusName === 'REFUND_REQUESTED' && order.refundReason" 
    class="alert alert-warning p-3 mt-4 mb-4"
>
    <h6 class="fw-bold text-danger mb-2">
        <i class="bi bi-arrow-return-left me-2"></i> Lý do Yêu cầu Hoàn trả:
    </h6>
    <p class="mb-0">{{ order.refundReason }}</p>
</div>

<div 
    v-if="order.statusName === 'REFUND_PROCESSING' && order.refundReason" 
    class="alert alert-info p-3 mt-4 mb-4"
>
    <h6 class="fw-bold text-primary mb-2">
        <i class="bi bi-info-circle-fill me-2"></i> Lý do Hoàn trả (Đang xử lý):
    </h6>
    <p class="mb-0">{{ order.refundReason }}</p>
</div>


          <div class="text-end mt-4 pt-3 border-top">
            <button
              v-if="order.statusName === 'PENDING'"
              class="btn btn-sm btn-primary me-2"
              @click="processOrder(order.id)"
            >
              <i class="bi bi-gear-fill me-1"></i> Xác nhận xử lý
            </button>

            <button
              v-if="order.statusName === 'PROCESSING'"
              class="btn btn-sm btn-warning text-dark me-2"
              @click="shippingOrder(order.id)"
            >
              <i class="bi bi-truck me-1"></i> Chuyển sang đang giao hàng
            </button>

            <button
              v-if="order.statusName === 'SHIPPING'"
              class="btn btn-sm btn-success me-2"
              @click="markDelivered(order.id)"
            >
              <i class="bi bi-check-circle-fill me-1"></i> Đã giao
            </button>
            
            <button
              v-if="order.statusName === 'PENDING' || order.statusName === 'PROCESSING'"
              class="btn btn-sm btn-outline-danger me-2"
              @click="cancelOrderByAdmin(order.id)"
            >
              <i class="bi bi-x-circle-fill me-1"></i> Hủy đơn hàng
            </button>

            <div v-if="order.statusName === 'REFUND_REQUESTED'" class="d-inline-flex gap-2">
                <button
                    class="btn btn-sm btn-success"
                    @click="handleRefundAction(order.id, 'approve')"
                >
                    <i class="bi bi-cash-stack me-1"></i> Phê duyệt Hoàn tiền
                </button>
                <button
                    class="btn btn-sm btn-danger"
                    @click="handleRefundAction(order.id, 'reject')"
                >
                    <i class="bi bi-slash-circle me-1"></i> Từ chối Hoàn tiền
                </button>
            </div>
            </div>
        </div>
      </div>

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

// Cập nhật statusList để thêm các trạng thái Hoàn trả/Hoàn tiền
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

// Cập nhật hàm getStatusClass
function getStatusClass(status) {
    switch (status) {
        case "PENDING": return "bg-warning text-dark";
        case "PROCESSING": return "bg-info text-dark";
        case "SHIPPING": return "bg-primary text-white";
        case "DELIVERED": return "bg-secondary text-white";
        case "COMPLETED": return "bg-success";
        case "CANCELLED": return "bg-danger";
     
        default: return "bg-secondary";
    }
}

// Cập nhật hàm getStatusText
function getStatusText(status) {
    switch (status) {
        case "PENDING": return "Chờ xác nhận";
        case "PROCESSING": return "Đang xử lý";
        case "SHIPPING": return "Đang giao hàng";
        case "DELIVERED": return "Đã giao";
        case "COMPLETED": return "Hoàn thành";
        case "CANCELLED": return "Đã hủy";
  
        default: return status;
    }
}

const getTotalProductPrice = (order) => {
    // Tổng tiền sản phẩm GỐC = Tổng cuối (Total) + Tổng Giảm giá (TotalDiscount) - Phí Vận chuyển (Feeship)
    const { total, totalDiscount, feeship } = order;

    if (total !== undefined && totalDiscount !== undefined && feeship !== undefined) {
        // Sử dụng giá trị từ Backend (tin cậy hơn)
        return total + (totalDiscount || 0) - (feeship || 0);
    }
    
    // Nếu dữ liệu Backend thiếu (Dự phòng: tính tay tổng giá các items)
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};



async function cancelOrderByAdmin(orderId) {
    if (!confirm("Xác nhận HỦY đơn hàng này? Thao tác này không thể hoàn tác.")) return;

    const token = localStorage.getItem("token"); 

    if (!token) {
        alert("Lỗi xác thực: Không tìm thấy Token. Vui lòng đăng nhập lại.");
        return;
    }

    try {
        await axios.put(
            `http://localhost:8080/api/order/admin/${orderId}/cancel`, 
            {},
            { 
                headers: { 
                    Authorization: `Bearer ${token}` 
                } 
            }
        );
        
        alert("Đơn hàng đã được HỦY thành công!");
        
        loadOrders(currentPage.value); 
        loadOrderCounts(); 
        
        expandedOrder.value = null; 

    } catch (err) {
        console.error("Lỗi khi hủy đơn hàng:", err);
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            alert("Bạn không có quyền hoặc Token hết hạn để thực hiện thao tác này. Vui lòng kiểm tra vai trò ADMIN!");
        } else if (err.response && err.response.data) {
             alert(`Lỗi hủy đơn: ${err.response.data.message || err.response.data}`);
        } else {
            alert("Không thể hủy đơn hàng do lỗi kết nối hoặc hệ thống.");
        }
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

        let data = response.data.data || response.data.content || [];

        orders.value = data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));     totalPages.value = response.data.totalPages || 1;
        currentPage.value = response.data.currentPage || page;

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
        
        let counts = res.data;
        
        // Tính tổng số lượng cho "Tất cả"
        let totalCount = 0;
        for (const key in counts) {
            if (typeof counts[key] === 'number') {
                totalCount += counts[key];
            }
        }
        
        counts[""] = totalCount;
        
        orderCounts.value = counts;

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