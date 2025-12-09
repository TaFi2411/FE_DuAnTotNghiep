<template>
  <footer class="footer-section">
    <div class="footer-content container">
      <div class="row">
        <!-- Liên hệ -->
        <div class="col-lg-3 mb-4 footer-box">
          <p class="footer-title">Liên hệ với chúng tôi</p>
          <div class="social-links mt-3 mb-3">
            <a href="#"><img src="/images/logo-face.png" alt="Facebook" /></a>
            <a href="#"><img src="/images/logo-zalo.png" alt="Zalo" /></a>
            <a href="#"><img src="/images/logo-intergam.png" alt="Instagram" /></a>
          </div>
          <p><i class="bi bi-telephone-forward"></i> Mua hàng: 0346650459</p>
          <p><i class="bi bi-telephone-forward"></i> Khiếu nại: 0777118500</p>
        </div>

        <!-- Hệ thống -->
        <div class="col-lg-3 mb-4 footer-box">
          <p class="footer-title">Hệ thống của chúng tôi</p>
          <p class="mt-3 text-justify">
            Hệ thống trải dài từ miền Nam ra miền Bắc với hơn 82 cửa hàng,
            luôn sẵn sàng phục vụ khách hàng mọi lúc, mọi nơi.
          </p>
        </div>

        <!-- Dịch vụ -->
        <div class="col-lg-3 mb-4 footer-box">
          <p class="footer-title">Dịch vụ khách hàng</p>
          <p class="mt-3 text-justify">
            Luôn đặt uy tín – chất lượng lên hàng đầu và cam kết mang lại trải nghiệm tốt nhất
            cho khách hàng. Chúng tôi luôn “vui lòng khách đến, vừa lòng khách đi”.
          </p>
        </div>

        <!-- Thanh toán -->
        <div class="col-lg-3 mb-4 footer-box">
          <p class="footer-title">Thanh toán online</p>
          <p class="mt-3">Hỗ trợ nhiều cổng thanh toán phổ biến:</p>

          <div class="payment-grid">
            <img src="/images/logo-visa.png" alt="Visa" />
            <img src="/images/logo-vnpay.png" alt="VNPay" />
            <img src="/images/logo-master.png" alt="MasterCard" />
            <img src="/images/payment_momo.png" alt="Momo" />
          </div>
        </div>
      </div>
    </div>

    <div class="footer-copy">
      Copyright <i class="bi bi-c-circle"></i> TDT Store
    </div>
  </footer>
</template>

<script setup>

</script>
<style scoped>
.footer-section {
  background: #000;
  color: white;
  padding-top: 50px;
  margin-top: 30px;
}

.footer-title {
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.footer-box {
  padding-right: 25px;
}

.text-justify {
  text-align: justify;
}

.social-links a img {
  width: 35px;
  margin-right: 10px;
  transition: 0.3s ease;
}

.social-links a img:hover {
  transform: scale(1.1);
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(2, 70px);
  gap: 15px;
  margin-top: 10px;
}

.payment-grid img {
  width: 70px;
  background: white;
  border-radius: 8px;
  padding: 4px;
  transition: 0.3s ease;
}

.payment-grid img:hover {
  transform: translateY(-3px);
}

.footer-copy {
  text-align: center;
  padding: 15px 0;
  background: #111;
  margin-top: 30px;
  font-size: 15px;
}
</style>
