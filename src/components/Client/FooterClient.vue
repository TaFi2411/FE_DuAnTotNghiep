<template>
    <!--------------------------------------- Chứng nhận--------------------------------------->

      <hr>
       <!--------------------------------------- Footer --------------------------------------->
    <!-- Của Phúc Duy Nè -->
       <footer>
    <div class="form">
      <div class="container">
        <div class="row">
          <div class="col-lg-3">
            <p class="title">Liên hệ với chúng tôi</p>
            <br />
            <a href="facebook"><img src="/images/logo-face.png" alt="Facebook" /></a>
            <a href="Zalo"><img src="/images/logo-zalo.png" alt="Zalo" /></a>
            <a href="Instagram"><img src="/images/logo-intergam.png" alt="Instagram" /></a>
            <br /><br />
            <p><i class="bi bi-telephone-forward"></i> Mua hàng: 0346650459</p>
            <p><i class="bi bi-telephone-forward"></i> Khiếu nại: 0777118500</p>
          </div>
          
          <div class="col-lg-3">
            <p class="title">Hệ thống của chúng tôi</p>
            <br />
            <p>
              Hệ thống của chúng tôi trải dài khắp các tỉnh từ miền Nam ra tới miền Bắc,
              lên đến 82 cửa hàng để luôn có thể phục vụ khách hàng mọi nơi và mọi lúc.
            </p>
          </div>
          
          <div class="col-lg-3">
            <p class="title">Dịch vụ khách hàng</p>
            <br />
            <p>
              Chúng tôi luôn đặt uy tín và chất lượng lên hàng đầu, luôn không bao giờ để khách hàng phải thiệt thòi.
              Đặc biệt, cửa hàng chúng tôi luôn vui lòng khách đến và vừa lòng khách đi.
            </p>
          </div>
          
          <div class="col-lg-3">
            <p class="title">Thanh toán online</p>
            <br />
            <p>Khách hàng có thể thanh toán qua các kênh thanh toán này của chúng tôi:</p>
            <div class="row">
              <div class="col-6"><a href=""><img src="/images/logo-visa.png" alt="Visa" /></a></div>
              <div class="col-6"><a href=""><img src="/images/logo-vnpay.png" alt="VNPay" /></a></div>
            </div>
            <div class="row mt-3">
              <div class="col-6"><a href=""><img src="/images/logo-master.png" alt="MasterCard" /></a></div>
              <div class="col-6"><a href=""><img src="/images/logo-zalo (1).png" alt="Zalo Pay" /></a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <hr />

  <div class="copyright">
    <p>Copyright <i class="bi bi-c-circle"></i> TDT Store</p>
  </div>
      <!--------------------------------------- ----- --------------------------------------->
</template>
<script setup>

</script>
<style scoped>

footer .title{
  font-size: 20px;
  font-weight: bold;
}
.chungnhan{
    display: flex;
    justify-content: center;
}

.chungnhan>.item{
    display: flex;
    color: black;
    margin: 40px;
    margin-bottom: 0px;

}

.chungnhan>.item>i{
    font-size: 60px;
}

.chungnhan>.item>p{
    margin: 10px;
    margin-left: 10px;
    font-size: 20px;
    font-family: Arial, Helvetica, sans-serif;
}
    /* ------------------Footer--------------- */

footer{
    
    background-color: black;
    margin-top: 20px;
    height: 350px;
}
footer>.form{
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 50px;
    height: 300px;
}

footer>.logo{
    color: white;
    font-weight: bolder;
    color: white;
    display: flex;
    padding-top: 20px;
    padding-left: 20px;
    
}

footer>.logo>p{
    margin: 0px;
    font-size: 20px;
    margin-top: 10px;
}
footer>.logo>.bi.bi-apple{
   font-size: 40px;
}

footer>.form>.container>.row>.col-lg-3{
    padding-right: 46px;
    color: white;
    text-align: justify;
    
}


.copyright{
    width: 100%;
    height: 40px;
    margin-top: 20px;
    background-color: black;
    color: white;
    text-align: center;
}

.copyright>p{
    padding-top: 10px;
}

</style>