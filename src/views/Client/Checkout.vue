<template>
  <div class="container py-5">
    <div class="row">
      <!-- Cột thông tin khách hàng và thanh toán -->
      <div class="col-md-8 pe-md-4 border-end">
        <h4 class="mb-4">Thông tin đơn hàng</h4>
       
        <div class="mb-3">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <i class="bi bi-map-fill"></i> Chọn địa chỉ
          </button>
          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Địa chỉ</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body bg-light">
                <div class="myaddress">
                  <div class="close-address">
                    <button type="button" class="btn-close"></button>
                  </div>
                  <div class="card " style="width: auto;">
                    <div class="card-body">
                      <p class="card-text "> Tỉnh Cà Mau, Xã Trí Phải , Ấp Kinh 5b.</p>
                    </div>
                    <div class="text-end p-2">
                      
                    <a href="#" class="btn btn-primary w-100">Chọn</a>
                    </div>
                  </div>

                </div>
                <div class="myaddress mt-2">
                  <div class="close-address">
                    <button type="button" class="btn-close"></button>
                  </div>
                  <div class="card " style="width: auto;">
                    <div class="card-body">
                      <p class="card-text "> Tỉnh Cà Mau, Xã Trí Phải , Ấp Kinh 5b.</p>
                    </div>
                    <div class="text-end p-2">
                      
                    <a href="#" class="btn btn-primary w-100">Chọn</a>
                    </div>
                  </div>

                </div>
                
                <div class="add-address">
                 <button type="button" class="btn btn-outline-success w-100 mt-4" data-bs-toggle="modal" data-bs-target="#themdiachi">
                    <i class="bi bi-plus-circle"></i> Thêm địa chỉ
                  </button>
                
                  
                </div>

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Thoát</button>
                
              </div>
            </div>
          </div>
        </div>
          
        </div>
              <div class="modal fade" id="themdiachi" tabindex="-1" aria-labelledby="themdiachiLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="themdiachiLabel">Thêm địa chỉ</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <div class="city mb-3">
                            <select class="form-select" aria-label="Default select example">
                              <option selected disabled>Chọn tỉnh</option>
                              <option value="1">Cà Mau</option>
                              <option value="2">Cần Thơ</option>
                              <option value="3">TP.Hồ Chí Minh</option>
                            </select>
                          </div>
                          <div class="ward mb-3">
                            <select class="form-select" aria-label="Default select example">
                              <option selected disabled>Chọn Quận/Xã</option>
                              <option value="1">Trí Phải</option>
                              <option value="2">Cái Răng</option>
                              <option value="3">Quận 1</option>
                            </select>
                          </div>
                          <div class="detail">
                            <label class="d-block">Địa chỉ cụ thể</label>
                            <textarea class="w-100"></textarea>
                          </div>
                        </div>
                        <div class="modal-footer">
                          
                          <button type="button" class="btn btn-secondary"  data-bs-toggle="modal" data-bs-target="#exampleModal">Thoát</button>
                          <button type="button" class="btn btn-primary">Lưu địa chỉ</button>
                        </div>
                       </div>
                    </div>
                  </div>

                  <div class="voucher mb-5">
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#voucher">
                          <i class="bi bi-receipt-cutoff"></i> Áp dụng Voucher
                        </button>

                        <!-- Modal -->
                        <div class="modal fade" id="voucher" tabindex="-1" aria-labelledby="voucherLabel" aria-hidden="true">
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="voucherlLabel">Voucher</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body">
                                <div class="myaddress mb-3">
                                  <div class="close-address">
                                    <input class=" bg-light-black" type="checkbox" value="" id="flexCheckDefault">
                                  </div>
                                  <div class="card mb-3" style="width: auto;">
                                    <div class="card-header">
                                      Voucher sinh nhật TDT Store
                                    </div>
                                    <div class="card-body p-0 ps-3">
                                      <p class="card-text "> 
                                        <strong>Giảm 10% hóa đơn</strong>
                                        Điều kiện áp dụng: <br>
                                        -Thời gian từ: 25/07/2025 - 31/07/2025 <br>
                                        -Đơn hàng từ: 1.000.000 VND
                                      </p>
                                    </div>
                                   
                                  </div>


                                  
                                </div>

                                <div class="myaddress mb-3">
                                  <div class="close-address">
                                    <input class=" bg-light-black" type="checkbox" disabled value="" id="flexCheckDefault">
                                  </div>
                                  <div class="card mb-3" style="width: auto;">
                                    <div class="card-header">
                                      Voucher khai chương TDT Store
                                    </div>
                                    <div class="card-body p-0 ps-3">
                                      <p class="card-text"> 
                                        <strong>Giảm 10% hóa đơn</strong>
                                        Điều kiện áp dụng: <br>
                                        -Thời gian từ: 20/07/2025 - 24/07/2025 <br>
                                        -Đơn hàng từ: 1.000.000 VND
                                      </p>
                                      <div class="status-voucher d-flex justify-content-end pe-3">
                                        <p class="text-danger">Hết hạn</p>
                                      </div>
                                    </div>
                              
                                  </div>


                                  
                                </div>
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Thoát</button>
                                <button type="button" class="btn btn-primary">Áp dụng</button>
                              </div>
                            </div>
                          </div>
                        </div>
                  </div>

      <div class="mb-3">
        <label for="note" class="form-label">Ghi chú (tuỳ chọn)</label>
        <textarea
          id="note"
          class="form-control"
          rows="3"
          v-model="order.note"
          placeholder="Ghi chú cho người giao hàng hoặc cửa hàng..."
        ></textarea>
      </div>
        <h5 class="mt-4">Phương thức thanh toán</h5>
        <div class="form-check mt-2" v-for="method in paymentMethods" :key="method.value">
          <input
            class="form-check-input"
            type="radio"
            :id="method.value"
            :value="method.value"
            v-model="order.payment"
          />
          <label class="form-check-label" :for="method.value">{{ method.label }}</label>
        </div>

        <!-- Checkbox đồng ý chính sách -->
        <div class="form-check mt-4">
          <input
            class="form-check-input"
            type="checkbox"
            id="agree"
            v-model="isAgreed"
          />
          <label class="form-check-label" for="agree">
            Tôi đồng ý với
            <a href="#" target="_blank">Chính sách xử lý dữ liệu cá nhân của TDT APPLE</a>
          </label>
        </div>

        <div class="text-end mt-4">
          <button
            class="btn btn-dark px-4 py-2"
            :disabled="!isAgreed"
            @click="placeOrder"
          >
            Đặt hàng
          </button>
        </div>
      </div>

      <!-- Cột tóm tắt đơn hàng -->
      <div class="col-md-4 ps-md-4">
        <h4 class="mb-4">Đơn hàng</h4>
        <div v-for="item in cart" :key="item.id" class="d-flex mb-3 align-items-center">
          <img :src="item.image" alt="" class="me-3" width="60" height="60" />
          <div>
            <p class="mb-1">{{ item.name }}</p>
            <small class="text-muted">{{ item.quantity }} x {{ formatPrice(item.price) }}</small>
          </div>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <span>Tạm tính:</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Phí vận chuyển:</span>
          <span>{{ formatPrice(shippingFee) }}</span>
        </div>
        <hr />
        <div class="d-flex justify-content-between fw-bold">
          <span>Tổng cộng:</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAgreed: false,
      order: {
        fullname: "",
        phone: "",
        address: "",
        payment: "cod",
        note: "", 
      },
      paymentMethods: [
        { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
        { value: "bank", label: "Chuyển khoản ngân hàng" },
        { value: "momo", label: "Ví điện tử MoMo" },
      ],
      cart: [
        {
          id: 1,
          name: "iPhone 15 Pro Max",
          image: "/images/Ip16prm-1tb.png",
          price: 35000000,
          quantity: 1,
        },
        {
          id: 2,
          name: "AirPods Pro 2",
          image: "/images/Ip16prm-1tb.png",
          price: 6000000,
          quantity: 2,
        },
      ],
      shippingFee: 30000,
    };
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    total() {
      return this.subtotal + this.shippingFee;
    },
  },
  methods: {
    formatPrice(value) {
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    placeOrder() {
      if (this.isAgreed) {
        alert("✅ Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại TDT APPLE.");
        // Reset form hoặc điều hướng nếu cần
      } else {
        alert("❌ Vui lòng đồng ý với chính sách để tiếp tục.");
      }
    },
  },
};
</script>
<style scoped>
.myaddress{
  position: relative;
}

.close-address{
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 3;
}
</style>