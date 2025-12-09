<template>
  <div class="orders-page container-fluid py-5">
    <div class="row gx-4">
      <aside class="col-lg-3 mb-4">
        <div class="profile-card p-4 rounded shadow-sm bg-white">
          <div class="d-flex align-items-center gap-3">
            <div
              class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
            >
              <span class="fs-4">{{ userInitials }}</span>
            </div>
            <div>
              <div class="fw-bold">{{ userName }}</div>
              <div class="text-muted small">{{ userEmail }}</div>
            </div>
          </div>

          <nav class="mt-4">
            <ul class="list-unstyled mb-0">
              <li
                v-for="(m, idx) in menu"
                :key="idx"
                :class="{ active: m.active }"
                class="mb-2"
              >
                <a
                  href="#"
                  class="d-flex align-items-center gap-2 p-2 rounded-3 text-decoration-none"
                  @click.prevent="selectMenu(m)"
                >
                  <i :class="m.icon"></i>
                  <span>{{ m.label }}</span>
                </a>
              </li>
            </ul>
          </nav>

          <button class="btn btn-logout mt-3 w-100" @click="logout">
            Đăng xuất
          </button>
        </div>
      </aside>

      <main class="col-lg-9">
        <div class="main-card p-4 rounded shadow-sm bg-white">
          <div v-if="currentMenu === 'Thông tin cá nhân'">
            <Profile />
          </div>

          <div v-else-if="currentMenu === 'Đơn hàng của tôi'">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Đơn hàng của tôi</h5>
              <small class="text-muted">Tổng: {{ orders.length }} đơn</small>
            </div>

            <div class="filter-tabs mb-3">
              <button
                v-for="filter in filtersWithCount"
                :key="filter.value"
                :class="['tab-btn', { active: currentFilter === filter.value }]"
                @click="currentFilter = filter.value"
              >
                <span>{{ filter.label }}</span>
                <span v-if="filter.count > 0" class="badge-count">{{
                  filter.count
                }}</span>
              </button>
            </div>

            <div v-if="loading" class="py-5 text-center">
              <div class="spinner-border" role="status"></div>
            </div>

            <div
              v-else-if="filteredOrders.length === 0"
              class="alert alert-light border text-center"
            >
              Không có đơn hàng nào thuộc trạng thái này.
            </div>

            <div v-else class="order-list">
              <div
                v-for="order in filteredOrders"
                :key="order.id"
                class="order-card mb-4 rounded"
              >
                <div
                  class="order-top d-flex align-items-center justify-content-between p-3"
                  @click="toggleOrder(order.id)"
                >
                  <div class="d-flex align-items-center gap-3">
                    <img
                      v-if="order.items[0]?.productImage"
                      :src="order.items[0].productImage"
                      alt="thumb"
                      class="thumb"
                    />
                    <div>
                      <div class="order-title">Đơn hàng {{ order.id }}</div>
                      <div class="small text-muted">
                        Ngày đặt: {{ formatDate(order.created_date) }}
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-items-center gap-3">
                    <div class="status-pill">
                      <i class="bi bi-truck me-1"></i>
                      {{ getStatusText(order.statusName) }}
                    </div>
                    <i
                      :class="
                        expandedOrder === order.id
                          ? 'bi bi-chevron-up'
                          : 'bi bi-chevron-down'
                      "
                    ></i>
                  </div>
                </div>

                <transition name="slide-fade">
                  <div
                    v-if="expandedOrder === order.id"
                    class="order-body p-3 border-top"
                  >
                    <div class="row">
                      <div class="col-md-8">
                        <div
                          v-for="item in order.items"
                          :key="item.id || item.productName"
                          class="d-flex mb-3"
                        >
                          <img
                            v-if="item.productImage"
                            :src="item.productImage"
                            class="product-img me-3"
                          />
                          <div class="flex-grow-1">
                            <div class="fw-bold">Tên sản phẩm: {{ item.productName }}</div>
                            <div
                              v-if="
                                item.skuAttributes && item.skuAttributes.length
                              "
                              class="small text-muted"
                            >
                              <div
                                v-for="attr in item.skuAttributes"
                                :key="attr.id"
                              >
                                <strong>{{ attr.optionAttributeName }}:</strong>
                                {{ attr.valueAttributeName }}
                              </div>
                            </div>
                            <div class="small text-dark">
                              Số lượng: {{ item.quantity }}
                            </div>
                            <div v-if="item.attributes">
                              <div v-for="(value, key) in item.attributes" :key="key" class="item-attribute">
                                <strong>{{ key }}:</strong> {{ value }}
                              </div>
                            </div>
                        
                          </div>
                      
                        </div>

                        <div class="mt-2">
                          <div class="small text-muted">Địa chỉ giao hàng:</div>
                          <div class="fw-semibold">
                            {{ order.shipping_address }}
                          </div>
                          <div class="small text-muted mt-2">SĐT:</div>
                          <div>{{ order.shippingPhone }}</div>
                          <div class="small text-muted mt-2">Tên người nhận:</div>
                          <div>{{ order.shippingName }}</div>
                          <div class="small text-muted mt-2">Phương thức:</div>
                          <div>{{ order.paymentMethodName }}</div>
                          <div class="small text-muted mt-2">
                            Trạng thái thanh toán:
                          </div>
                          <div>
                            {{
                              order.payment_status
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"
                            }}
                          </div>
                          
                          <div 
                              v-if="order.statusName === 'CANCELLED' && order.note" 
                              class="alert alert-danger p-2 mt-3 small"
                          >
                              <i class="bi bi-info-circle me-2"></i>
                              <strong>Lý do hủy:</strong> {{ order.note }}
                          </div>
                          
                          <div 
                              v-if="order.statusName === 'REFUND_REQUESTED' && order.refundReason" 
                              class="alert alert-warning p-2 mt-3 small"
                          >
                              <i class="bi bi-arrow-return-left me-2"></i>
                              <strong>Lý do bạn yêu cầu hoàn trả:</strong> {{ order.refundReason }}
                          </div>
                          
                          <div 
                              v-if="(order.statusName === 'REFUND_PROCESSING' || order.statusName === 'REFUNDED' || order.statusName === 'REFUND_REJECTED') && order.adminRefundNote" 
                              class="alert p-2 mt-3 small"
                              :class="order.statusName === 'REFUND_REJECTED' ? 'alert-danger' : 'alert-info'"
                          >
                              <i class="bi bi-file-earmark-text me-2"></i>
                              <strong>Ghi chú xử lý của Admin:</strong> {{ order.adminRefundNote }}
                          </div>
                          </div> 
                      </div> 
                      <div
                        class="col-md-4 d-flex flex-column justify-content-between"
                      >
                        <div class="summary-box">
                          <table class="table table-borderless table-sm text-end mb-3 small">
                            <tbody>
                              <tr class="fw-normal">
                                <td class="text-start text-muted">Tổng tiền sản phẩm:</td>
                                <td class="text-end">{{ formatCurrency(getTotalProductPrice(order)) }}</td>
                              </tr>
                              <tr class="fw-normal">
                                <td class="text-start text-muted">Phí vận chuyển :</td>
                                <td class="text-end">{{ formatCurrency(order.feeship) }}</td>
                              </tr>
                              
                              <tr v-if="order.discountProduct > 0" class="text-success fw-semibold ">
                                <td class="text-start">Giảm giá Sản phẩm:</td>
                                <td class="text-end">- {{ formatCurrency(order.discountProduct) }}</td>
                              </tr>
                              
                              <tr v-if="order.discountShipping > 0" class="text-success fw-semibold">
                                <td class="text-start">Giảm giá Vận chuyển:</td>
                                <td class="text-end">- {{ formatCurrency(order.discountShipping) }}</td>
                              </tr>
                              
                              <tr class="fw-bold  ">
                                <td class="text-start fs-5">Tổng Thanh Toán:</td>
                                <td class="text-danger fs-4">{{ formatCurrency(order.total) }}</td>
                              </tr>
                            </tbody>
                          </table>
                          
                          <div class="voucher-details small bg-light p-2 rounded text-start mt-3" v-if="order.productVoucherTitle || order.shippingVoucherTitle">
                            <div class="fw-bold mb-1 text-dark"><i class="bi bi-tag-fill me-1"></i> Voucher đã áp dụng:</div>
                            <ul class="list-unstyled mb-0 ms-2">
                              <li>
                                <span class="text-success">•</span> Sản phẩm: {{ order.productVoucherTitle || 'Không' }}
                              </li>
                              <li>
                                <span class="text-success">•</span> Vận chuyển: {{ order.shippingVoucherTitle || 'Không' }}
                              </li>
                            </ul>
                          </div>
                          
                        </div>

                        <div class="text-end mt-3">
                          <button
                            v-if="order.statusName === 'PENDING'"
                            class="btn btn-outline-secondary me-2"
                            @click.stop="openEditShippingModal(order)"
                          >
                            Đổi thông tin nhận hàng
                          </button>
                          <button
                            v-if="order.statusName === 'PENDING'"
                            class="btn btn-cancel me-2"
                            @click.stop="cancelOrder(order.id)"
                          >
                            × Hủy đơn
                          </button>

                          <button
                            v-if="order.statusName === 'DELIVERED'"
                            class="btn btn-success me-2"
                            @click.stop="completeOrder(order.id)"
                          >
                            Đã nhận hàng
                          </button>

                          <button
                            v-if="order.statusName === 'COMPLETED'"
                            class="btn btn-dark"
                            @click.stop="openReviewModal(order.items[0].id)"
                          >
                            Đánh giá
                          </button>
                          <button
                            v-if="order.statusName === 'COMPLETED' && order.statusName !== 'CANCELLED'"
                            class="btn btn-outline-danger"
                            @click.stop="requestReturn(order.id)"
                          >
                            Yêu cầu Hoàn trả
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="reviewModal" class="review-modal-backdrop">
      <div class="review-modal rounded-4 p-4 bg-white shadow-lg">
        <button class="btn-close float-end" @click="closeReviewModal"></button>
        <h5 class="text-center mb-3">Đánh giá sản phẩm</h5>

        <div class="text-center mb-3">
          <span
            v-for="n in 5"
            :key="n"
            @click="reviewForm.star = n"
            class="star"
            :class="{ active: n <= reviewForm.star }"
            >★</span
          >
          <div class="small text-muted mt-1">Chọn số sao (1-5)</div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Cảm nhận của bạn:</label>
          <textarea
            v-model="reviewForm.description"
            rows="3"
            class="form-control"
            placeholder="Viết cảm nhận của bạn..."
          ></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold"
            >Ảnh minh họa (tối đa 3 ảnh)</label
          >
          <div class="d-flex flex-wrap gap-2 mt-2">
            <div
              v-for="(img, i) in reviewForm.images"
              :key="i"
              class="img-box position-relative"
            >
              <img
                :src="img.path"
                class="w-100 h-100"
                style="object-fit: cover"
              />
              <button type="button" class="btn-remove" @click="removeImage(i)">
                ×
              </button>
            </div>

            <div
              v-if="reviewForm.images.length < 3"
              class="img-add d-flex align-items-center justify-content-center"
              @click="openFilePicker"
            >
              <i class="bi bi-plus-circle fs-4"></i>
            </div>
          </div>

          <div v-if="isUploading" class="small text-primary mt-2">
            Đang tải ảnh lên...
          </div>
          <input
            type="file"
            class="d-none"
            ref="fileInput"
            accept="image/*"
            multiple
            @change="handleAutoUpload"
          />
        </div>

        <div class="text-center mt-3">
          <button class="btn btn-primary px-4" @click="submitReview">
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
    
  </div>


  <div v-if="editShippingModal" class="review-modal-backdrop">
  <div class="review-modal rounded-4 p-4 bg-white shadow-lg" style="max-width: 500px">
    <button class="btn-close float-end" @click="closeEditShippingModal"></button>
    <h5 class="text-center mb-4">Đổi thông tin nhận hàng</h5>

    <div class="mb-3">
      <label class="form-label fw-semibold">Tên người nhận:</label>
      <input 
        v-model="editShippingForm.shippingName" 
        type="text" 
        class="form-control" 
      />
    </div>
    
    <div class="mb-3">
      <label class="form-label fw-semibold">Số điện thoại:</label>
      <input 
        v-model="editShippingForm.shippingPhone" 
        type="tel" 
        class="form-control" 
      />
    </div>
    
    <hr class="my-3">
    
    <div class="mb-3">
      <label class="form-label fw-semibold">Chọn địa chỉ đã lưu:</label>
      <select class="form-select" @change="selectShippingAddress($event)">
        <option value="">-- Chọn địa chỉ --</option>
        <option 
          v-for="addr in addresses" 
          :key="addr.id" 
          :value="addr.id"
          :selected="addr.fulladdress === editShippingForm.shipping_address"
        >
          {{ addr.fulladdress }} 
        </option>
      </select>
      <div v-if="addresses.length === 0" class="small text-danger mt-1">
        Không tìm thấy địa chỉ nào đã lưu. Vui lòng thêm địa chỉ mới ở trang tài khoản.
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label fw-semibold">Địa chỉ chi tiết (Không chỉnh sửa Tỉnh/Huyện/Xã):</label>
      <input
        v-model="editShippingForm.shipping_address"
        type="text"
        class="form-control bg-light"
        readonly 
        placeholder="Địa chỉ sẽ được điền tự động khi bạn chọn ở trên"
      />
    </div>
    
    <hr class="my-3">
    <div class="mb-3 p-3 border rounded" v-if="editShippingForm.selectedAddressId">
        <h6 class="fw-bold mb-3">💰 Chi phí và Thanh toán mới</h6>
        
        <table class="table table-sm table-borderless text-end small">
            <tbody>
                <tr>
                    <td class="text-start text-muted">Phí Ship cũ:</td>
                    <td class="text-end">{{ formatCurrency(originalFeeship) }}</td>
                </tr>
                <tr class="fw-semibold">
                    <td class="text-start text-dark border-bottom border-secondary">Phí Ship (Địa chỉ mới):</td>
                    <td class="text-end border-bottom border-secondary">{{ formatCurrency(currentShippingFee) }}</td>
                </tr>
                
                <tr v-if="currentProductDiscount > 0" class="text-success fw-semibold">
                    <td class="text-start">Giảm giá Sản phẩm:</td>
                    <td class="text-end">- {{ formatCurrency(currentProductDiscount) }}</td>
                </tr>
                <tr v-if="currentShippingDiscount > 0" class="text-success fw-semibold">
                    <td class="text-start">Giảm giá Vận chuyển:</td>
                    <td class="text-end">- {{ formatCurrency(currentShippingDiscount) }}</td>
                </tr>
                <tr class="fw-bold border-top border-2">
                    <td class="text-start fs-5">Tổng Thanh Toán MỚI:</td>
                    <td class="text-danger fs-5">{{ formatCurrency(currentTotalAmount) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="text-center mt-4">
      <button 
        class="btn btn-primary px-4" 
        :disabled="isUpdatingShipping"
        @click="submitEditShipping"
      >
        <span v-if="isUpdatingShipping" class="spinner-border spinner-border-sm me-2"></span>
        {{ isUpdatingShipping ? 'Đang cập nhật...' : 'Cập nhật' }}
      </button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";
import Profile from "./Profile.vue";
const orders = ref([]);
const loading = ref(true);
const expandedOrder = ref(null);
const currentFilter = ref("ALL");

// --- KHAI BÁO MỚI ---
const editShippingModal = ref(false);
const isUpdatingShipping = ref(false);
const editShippingForm = ref({
    orderId: null,
    shippingName: "",
    shippingPhone: "",
    shipping_address: "",
    selectedAddressId: null, // Thêm trường này để theo dõi địa chỉ được chọn
});
const addresses = ref([]); // Danh sách địa chỉ từ DB
// ⭐️ BỔ SUNG: Biến Reactive lưu trữ Phí Ship và Tổng Tiền Mới ⭐️
const currentShippingFee = ref(0); // Phí ship hiện tại của đơn hàng đang mở modal
const currentTotalAmount = ref(0); // Tổng tiền hiện tại của đơn hàng đang mở modal
// ⭐️ Cần thêm 3 biến mới này ⭐️
const currentShippingDiscount = ref(0); // Giảm giá VC mới
const currentProductDiscount = ref(0);  // Giảm giá SP (lấy từ order gốc)
const currentTotalDiscount = ref(0);    // Tổng giảm giá mới (SP + VC)
const originalFeeship = ref(0);
const reviewModal = ref(false);
const reviewForm = ref({
    star: 0,
    description: "",
    orderDetailId: null,
    images: [],
});
const isUploading = ref(false);
const fileInput = ref(null);
const currentMenu = ref("Đơn hàng của tôi");

const userName = ref("");
const userEmail = ref("");
const userPhone = ref("");
const userInitials = computed(() =>
    userName.value
        ? userName.value
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
        : ""
);

const menu = [
    { label: "Thông tin cá nhân", icon: "bi bi-person", active: false },
    { label: "Đơn hàng của tôi", icon: "bi bi-bag-fill", active: true },
    { label: "Đổi mật khẩu", icon: "bi bi-key", active: false },
];

const filters = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ xác nhận", value: "PENDING" },
    { label: "Đang xử lý", value: "PROCESSING" },
    { label: "Đang giao", value: "SHIPPING" },
    { label: "Đã giao", value: "DELIVERED" }, 
    { label: "Hoàn thành", value: "COMPLETED" },
  
    { label: "Đã hủy", value: "CANCELLED" },
];

const filtersWithCount = computed(() =>
    filters.map((f) => ({
        ...f,
        count:
            f.value === "ALL"
                ? orders.value.length
                : orders.value.filter((o) => o.statusName === f.value).length,
    }))
);

const filteredOrders = computed(() =>
    currentFilter.value === "ALL"
        ? orders.value
        : orders.value.filter((o) => o.statusName === currentFilter.value)
);

function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value || 0);
}
function formatDate(dateStr) {
    return dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "";
}
function getStatusText(status) {
    switch (status) {
        case "PENDING":
            return "Chờ xác nhận";
        case "PROCESSING":
            return "Đang xử lý";
        case "SHIPPING":
            return "Đang giao hàng";
        case "DELIVERED":
            return "Đã giao"; 
        case "COMPLETED":
            return "Hoàn thành";
        case "CANCELLED":
            return "Đã hủy";
            case "REFUND_REQUESTED":
  
        default:
            return status;
    }
}

function toggleOrder(id) {
    expandedOrder.value = expandedOrder.value === id ? null : id;
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
// --- HÀM MỚI: TẢI DANH SÁCH ĐỊA CHỈ (ĐÃ CÓ TRONG CODE CŨ CỦA BẠN, CHỈ ĐIỀU CHỈNH VỊ TRÍ) ---
async function loadAddresses() {
    const token = localStorage.getItem("token");
    if (!token) return;
    const payload = decodeJwtToken(token);
    const accountId = payload?.id;
    if (!accountId) return;

    try {
        const res = await axios.get(`/api/address/account/${accountId}`);
        addresses.value = res.data;
    } catch (err) {
        console.error("Lỗi khi tải danh sách địa chỉ:", err);
    }
}
function selectShippingAddress(event) {
    const selectedId = event.target.value;
    const selected = addresses.value.find(a => a.id.toString() === selectedId);

    if (selected) {
        // ... (Cập nhật các trường form: shipping_address, selectedAddressId, v.v.)
        editShippingForm.value.shipping_address = selected.fulladdress;
        editShippingForm.value.selectedAddressId = selected.id;
        editShippingForm.value.shippingName = selected.receiverName;
        editShippingForm.value.shippingPhone = selected.receiverPhone;

        // ⭐️ SỬA LỖI: Lấy orderId từ chính form chỉnh sửa ⭐️
        const orderIdToUpdate = editShippingForm.value.orderId;

        if (orderIdToUpdate) { // Đảm bảo ID đơn hàng tồn tại
            // Gọi hàm tính phí với addressId và orderId
            updateShippingFee(selected.id, orderIdToUpdate); // Truyền thêm orderId vào hàm updateShippingFee (nếu cần)
        } else {
            console.error("Lỗi: Không tìm thấy ID đơn hàng trong editShippingForm.value.orderId.");
        }
        
    } else {
        // Nếu chọn "Chọn địa chỉ" mặc định
        editShippingForm.value.shipping_address = '';
        editShippingForm.value.selectedAddressId = null;
        
        // ⭐️ OPTIONAL: Xóa/Reset phí ship nếu không chọn địa chỉ ⭐️
        // Ví dụ: this.shippingFee = 0;
    }
}






// Thêm hàm hỗ trợ
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}



// Hàm để hoàn trả đơn hàng









// --- CẬP NHẬT: openEditShippingModal ---
function openEditShippingModal(order) {
    editShippingForm.value = {
        orderId: order.id,
        shippingName: order.shippingName,
        shippingPhone: order.shippingPhone,
        shipping_address: order.shippingAddress, // Giả sử trường này là shippingAddress/shipping_address
        selectedAddressId: null, // 
        
    };
    
    // ⭐️ BỔ SUNG: Gán phí ship và tổng tiền của đơn hàng hiện tại ⭐️
    currentShippingFee.value = order.feeship || 0;
    currentTotalAmount.value = order.total || 0; // Giả định order.total là tổng cuối cùng
originalFeeship.value = order.feeship;
    editShippingModal.value = true;
    loadAddresses(); 
}
// --- BỔ SUNG: HÀM GỌI API TÍNH LẠI PHÍ SHIP ---
async function updateShippingFee(addressId) {
    const orderId = editShippingForm.value.orderId; 
    
    if (!orderId || !addressId) return;

    try {
        const response = await axios.get('/api/ghn/calculate-fee', {
            params: {
                orderId: orderId,
                addressId: addressId
            }
        });

        const data = response.data;
        
        // ⭐️ CẬP NHẬT UI: Gán phí ship và tổng tiền mới vào biến reactive ⭐️
        currentShippingFee.value = data.newFeeship; // Tên trường trả về từ BE là newFeeship
        currentTotalAmount.value = data.newTotalAmount;
        
        // ✅ BỔ SUNG LƯU CÁC GIÁ TRỊ GIẢM GIÁ MỚI
        // Giảm giá SP (lấy từ Order gốc)
        // Lưu ý: Backend không tính lại Product Discount, nên bạn phải lấy từ order gốc 
        // hoặc yêu cầu BE trả kèm productDiscount trong response
        // => TẠM THỜI SỬ DỤNG GIÁ TRỊ TỪ RESPONSE CỦA BE (nếu có):
        currentShippingDiscount.value = data.newShippingDiscount || 0; 
        currentTotalDiscount.value = data.newTotalDiscount || 0;
        
        // Để hiển thị chi tiết giảm giá SP, bạn cần lấy từ đơn hàng gốc đang hiển thị
        const originalOrder = orders.value.find(o => o.id === orderId);
        if (originalOrder) {
             currentProductDiscount.value = originalOrder.discountProduct || 0; 
        }

        console.log(`Phí ship mới: ${data.newFeeship}, Giảm giá VC: ${data.newShippingDiscount}, Tổng tiền mới: ${data.newTotalAmount}`);

    } catch (error) {
        console.error("Lỗi khi tính lại phí vận chuyển:", error);
        // Tùy chọn: Đặt lại phí ship về 0 hoặc phí cũ
        Swal.fire("Lỗi tính phí", "Không thể tính lại phí vận chuyển cho địa chỉ này.", "error");
    }
}
function closeEditShippingModal() {
    editShippingModal.value = false;
    editShippingForm.value = { orderId: null, shippingName: "", shippingPhone: "", shipping_address: "", selectedAddressId: null };
}

async function submitEditShipping() {
    // 1. Client-Side Validation 
    const form = editShippingForm.value;

    // ✅ BỔ SUNG: Kiểm tra xem người dùng đã chọn địa chỉ mới chưa (trừ khi họ chỉ sửa tên/SĐT)
    // Nếu họ đã chọn địa chỉ mới, phải có selectedAddressId
    if (!form.shippingName || !form.shippingPhone || !form.shipping_address) {
        return Swal.fire("Thiếu thông tin", "Vui lòng điền đầy đủ Tên, SĐT và chọn Địa chỉ.", "warning");
    }
    
    // ... (Kiểm tra regex SĐT) ...

    if (form.orderId === null) return;
    
    isUpdatingShipping.value = true;
    try {
        // ⭐️ CẬP NHẬT PAYLOAD: Bổ sung 3 trường mới ⭐️
        const payload = {
            shippingName: form.shippingName,
            shippingPhone: form.shippingPhone,
            // ⚠️ Gửi địa chỉ chi tiết (chuỗi)
            shippingAddress: form.shipping_address, 
            
            // ✅ GỬI ID ĐỊA CHỈ MỚI: Rất quan trọng để BE thay đổi địa chỉ Order
            // Nếu người dùng không chọn địa chỉ, giá trị này sẽ là null
            newAddressId: form.selectedAddressId, 
            
            // ✅ GỬI PHÍ SHIP VÀ TỔNG TIỀN MỚI
            newFeeship: currentShippingFee.value,
            newTotalAmount: currentTotalAmount.value,
        };

        // API này phải được sửa ở BE để chấp nhận và lưu 3 trường mới
        const response = await axios.put(`/api/order/${form.orderId}/shipping-info`, payload);
        
        // Cập nhật dữ liệu trong orders.value
        const updatedOrderData = response.data;
        const orderIndex = orders.value.findIndex(o => o.id === form.orderId);
        if (orderIndex !== -1) {
            orders.value[orderIndex].shippingName = updatedOrderData.shippingName;
            orders.value[orderIndex].shippingPhone = updatedOrderData.shippingPhone;
            orders.value[orderIndex].shipping_address = updatedOrderData.shippingAddress || updatedOrderData.shipping_address; 
            
            // ✅ CẬP NHẬT PHÍ SHIP VÀ TỔNG TIỀN TRONG MẢNG ĐƠN HÀNG
            orders.value[orderIndex].feeship = updatedOrderData.feeship; 
            orders.value[orderIndex].total = updatedOrderData.total;
        }

        Swal.fire("🎉 Thành công", "Thông tin nhận hàng và phí ship đã được cập nhật!", "success");
        closeEditShippingModal();
    } catch (err) {
        // ... (Xử lý lỗi) ...
        // ...
    } finally {
        isUpdatingShipping.value = false;
    }
}
// --- KẾT THÚC CẬP NHẬT HÀM SỬA CHỮA ---

function selectMenu(item) {
    currentMenu.value = item.label;
    menu.forEach((m) => (m.active = m.label === item.label));
}

function decodeJwtToken(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(
            decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            )
        );
    } catch {
        return null;
    }
}

async function loadUserProfile() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = decodeJwtToken(token);
        const accountId = payload?.id;
        if (!accountId) return;

        const res = await axios.get(`/api/account/${accountId}`);
        const data = res.data;
        userName.value = data.fullname || "";
        userEmail.value = data.email || "";
        userPhone.value = data.phone || "";
    } catch (err) {
        console.error("Không thể tải thông tin người dùng:", err);
    }
}

async function loadOrders() {
    loading.value = true;
    const token = localStorage.getItem("token");
    if (!token) {
        loading.value = false;
        return;
    }
    const payload = decodeJwtToken(token);
    const accountId = payload?.id;
    if (!accountId) {
        loading.value = false;
        return;
    }

    try {
        const res = await axios.get(`/api/order/account/${accountId}`);
        console.log("Dữ liệu trả về từ backend:", res.data);
        orders.value = (res.data || [])
            .map((o) => ({ ...o, items: o.items || [] }))
            .sort((a, b) => b.id - a.id);
    } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
        loading.value = false;
    }
}

async function cancelOrder(orderId) {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    try {
        await axios.put(`/api/order/${orderId}/cancel`, { status: "CANCELLED" });
        const order = orders.value.find((o) => o.id === orderId);
        if (order) order.statusName = "CANCELLED";
        alert("Đơn hàng đã được hủy thành công!");
    } catch (err) {
        console.error(err);
        alert("Không thể hủy đơn hàng!");
    }
}

async function completeOrder(orderId) {
    if (!confirm("Xác nhận bạn đã nhận được hàng?")) return;
    try {
        await axios.put(`/api/order/${orderId}/complete`);
        // Gọi loadOrders() để load lại danh sách và cập nhật UI
        await loadOrders();
        alert("Đơn hàng đã hoàn tất.");
    } catch (err) {
        console.error(err);
        alert("Không thể cập nhật trạng thái!");
    }
}


function openReviewModal(orderDetailId) {
    reviewForm.value = { star: 0, description: "", orderDetailId, images: [] };
    reviewModal.value = true;
}
function closeReviewModal() {
    reviewModal.value = false;
}
function openFilePicker() {
    fileInput.value?.click();
}

async function handleAutoUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    isUploading.value = true;
    try {
        for (const file of files.slice(0, 3 - reviewForm.value.images.length)) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            reviewForm.value.images.push({ path: res.data });
        }
    } catch (err) {
        console.error(err);
        Swal.fire("Lỗi", "Không thể tải ảnh lên", "error");
    } finally {
        isUploading.value = false;
        event.target.value = "";
    }
}

function removeImage(index) {
    reviewForm.value.images.splice(index, 1);
}

async function submitReview() {
    if (reviewForm.value.star === 0)
        return Swal.fire("Thiếu thông tin", "Vui lòng chọn số sao!", "warning");
    try {
        await axios.post("/api/review", reviewForm.value);
        Swal.fire("🎉 Thành công", "Cảm ơn bạn đã đánh giá!", "success");
        closeReviewModal();
    } catch (err) {
        console.error(err);
        Swal.fire(
            "Lỗi 😥",
            err.response?.data?.message || "Không thể gửi đánh giá",
            "error"
        );
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login"; // hoặc trang login của bạn
}

onMounted(() => {
    loadUserProfile();
    loadOrders();
});
</script>

<style scoped>
/* ---------------- layout ---------------- */
.item-attribute {
  margin-bottom: 4px;
  font-size: 0.9rem;
  color: #333;
}

.orders-page {
  min-height: 80vh;
  padding-top: 30px;
  padding-bottom: 60px;
  background: #f6f7f9;
}
.profile-card {
  position: sticky;
  top: 90px;
}
.avatar {
  width: 56px;
  height: 56px;
  font-weight: 700;
  border-radius: 50%;
}
.profile-card .btn-logout {
  background: transparent;
  border: 1px solid #f3f3f3;
  color: #d9534f;
  font-weight: 600;
  cursor: pointer;
}

/* filter tabs */
.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 18px;
}
.tab-btn {
  border: none;
  background: transparent;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  cursor: pointer;
}
.tab-btn:hover {
  background: #fafafa;
}
.tab-btn.active {
  background: #fff;
  color: #000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #eee;
}
.badge-count {
  background: #525252;
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 12px;
  margin-left: 6px;
}

/* order card */
.order-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(18, 24, 31, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.04);
}
.order-top {
  cursor: pointer;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-title {
  font-weight: 700;
  color: #111;
  display: flex;
  align-items: center;
  gap: 12px;
}
.thumb {
  width: 68px;
  height: 68px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
  padding: 4px;
  background: #fff;
}
.status-pill {
  background: linear-gradient(90deg, #f3e9ff, #f7efff);
  color: #7b3dd6;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(123, 61, 214, 0.08);
  font-size: 14px;
}
.status-pill i {
  font-size: 16px;
}
.order-body {
  background: #fff;
  padding: 16px 18px;
  border-top: 1px solid #f2f2f2;
}
.product-img {
  width: 86px;
  height: 86px;
  object-fit: cover;
  border: 1px solid #eee;
  border-radius: 8px;
}
.total-label {
  color: #666;
  font-size: 14px;
}
.total-amount {
  color: #e43f3f;
  font-size: 1.15rem;
  font-weight: 700;
}
.btn-cancel {
  background: transparent;
  border: 1px solid #e43f3f;
  color: #e43f3f;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #e43f3f;
  color: #fff;
}
.btn-success {
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 700;
}
.btn-dark {
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 700;
}
.review-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.review-modal {
  width: 100%;
  max-width: 520px;
  position: relative;
}
.star {
  font-size: 28px;
  margin: 0 6px;
  cursor: pointer;
  color: #cfcfcf;
}
.star.active {
  color: #ffb400;
}
.img-box {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.btn-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  cursor: pointer;
}
.img-add {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 1px dashed #ddd;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.18s ease;
}
.slide-fade-enter-from {
  transform: translateY(-6px);
  opacity: 0;
}
.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-fade-leave-to {
  transform: translateY(-6px);
  opacity: 0;
}
@media (max-width: 991px) {
  .profile-card {
    position: static;
  }
  .tab-btn {
    padding: 8px 10px;
    font-size: 14px;
  }
}
</style>
