<template>
  <div class="sidebar d-none d-md-block border-end-0">
  

    <div class="menu">
      <ul class="list-group mt-5 custom-list">
        <router-link to="/quanly/tongquan" class="list-group-item custom-item">Tổng quan</router-link>

        
        <div class="accordion custom-accordion" id="accordionExample">
          <div class="accordion-item border-0">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button collapsed custom-item"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                Sản phẩm
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body p-0">
                <router-link to="/quanly/sanpham/danhsachsanpham" class="list-group-item custom-item ps-5" style="font-size: 17px;">
                  Danh sách sản phẩm
                </router-link>
                <router-link to="/quanly/sanpham/danhsachchitietsanpham" class="list-group-item custom-item ps-5" style="font-size: 17px;">
                  Danh sách chi tiết sản phẩm
                </router-link>

                 <router-link to="/quanly/sanpham/loaisanpham" class="list-group-item custom-item ps-5" style="font-size: 17px;">
                  Loại sản phẩm
                </router-link>
              
              </div>
            </div>
          </div>
        </div>

        <router-link to="/item3" class="list-group-item custom-item">Voucher</router-link>
        <router-link to="/item3" class="list-group-item custom-item">Đơn hàng</router-link>
        <div class="accordion custom-accordion" id="accordionExample">
          <div class="accordion-item border-0">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button collapsed custom-item"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#address"
                aria-expanded="false"
                aria-controls="address"
              >
                Địa chỉ
              </button>
            </h2>
            <div
              id="address"
              class="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body p-0">
                <router-link to="/quanly/diachi/tinh-thanhpho" class="list-group-item custom-item ps-5" style="font-size: 17px;">
                  Tỉnh / Thành phố
                </router-link>
                <router-link to="/quanly/diachi/xa-phuong" class="list-group-item custom-item ps-5" style="font-size: 17px;">
                  Xã / Phường
                </router-link>

                
              
              </div>
            </div>
          </div>
        </div>
        <router-link to="/quanly/taikhoan" class="list-group-item custom-item">Tài khoản</router-link>
        <router-link to="/item5" class="list-group-item custom-item">Thống kê</router-link>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  
  height: 800px;
  width: 300px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #eaeaea;
  padding-left: 20px;
}

.custom-list {
  border: none;
  padding: 0;
}

.custom-item {
  border: none;
  background-color: transparent !important;
  color: #333;
  text-decoration: none;
  padding: 12px 16px;
  transition: background-color 0.2s ease, color 0.2s ease;
  display: block;
  width: 100%;
  text-align: left;
  font-size: 18px;
}

.custom-item:hover {
  background-color: #f8f9fa !important;
  color: #0071e3 !important;
}
.custom-item:focus {
  background-color: #f8f9fa !important;
  color: #0071e3 !important;
}


.custom-accordion .accordion-button {
  box-shadow: none;
  border: none;
}
.custom-accordion .accordion-button:focus {
  box-shadow: none;
}
.custom-accordion .accordion-button::after {
  margin-left: auto;
}



</style>
