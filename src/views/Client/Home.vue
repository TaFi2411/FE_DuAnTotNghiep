<template>
  <div class="container-banner">
    <div class="banner">
      <div class="banner-left">
        <img src="/images/banner-home-left.png" alt="" srcset="" />
      </div>
      <div class="title-banner">
        <p style="font-size: 40px; font-weight: bold">
          <i class="bi bi-apple" style="font-size: 80px; font-weight: bold"></i
          >TDT Store - Đồng hành cùng bạn mỗi ngày.
        </p>
      </div>
      <div class="buy-now-container">
        <router-link to="/sanpham" class="buy-now-btn">Mua Sắm Ngay</router-link>
      </div>
      <div class="banner-center">
        <img
          src="/images/banner-home-center.jpg"
          alt=""
          srcset=""
          width="500px"
          height="300px"
        />
      </div>
      <div class="banner-right">
        <img src="/images/banner-home-right.png" alt="" srcset="" />
      </div>
    </div>
  </div>

  <div class="container-banner-iphone mt-3">
    <div class="content">
      <h1>iPhone</h1>
      <p>Đơn giản mà hoàn hảo, đó là iPhone.</p>
      <router-link class="buy-btn">Mua sắm iPhone</router-link>
    </div>
    <div class="image-banner-iphone">
      <img src="/images/banner-home-iphone.png" alt="" srcset="" />
    </div>
  </div>

  <div class="row g-0" style="padding: 10px">
    <div class="col-6 container-banner-macbook">
      <div class="content" style="color: white">
        <h1>MacBook</h1>
        <p style="color: white">Chiếc laptop tạo nên khác biệt.</p>
        <router-link class="buy-btn" style="border-color: white; color: white"
          >Mua sắm MacBook</router-link
        >
      </div>
      <div class="image-banner-macbook">
        <img src="/images/banner-home-macbook.png" alt="" srcset="" />
      </div>
    </div>

    <div class="col-6 container-banner-ipad">
      <div class="content" style="color: white">
        <h1>iPad</h1>
        <p style="color: white">Từ ý tưởng đến hiện thực – tất cả trên iPad.</p>
        <router-link class="buy-btn" style="border-color: white; color: white"
          >Mua sắm iPad</router-link
        >
      </div>
      <div class="image-banner-ipad">
        <img src="/images/banner-home-ipad.png" alt="" srcset="" />
      </div>
    </div>
  </div>

  <div class="row g-0 pt-0" style="padding: 10px">
    <div class="col-6 container-banner-watch">
      <div class="content" style="color: white">
        <h1>Watch</h1>
        <p style="color: white">Apple Watch - Công nghệ trên cổ tay bạn.</p>
        <router-link class="buy-btn" style="border-color: white; color: white">
          Mua sắm iPad
        </router-link>
      </div>
      <div class="">
        <img src="/images/banner-home-watch.jpg" alt="" width="100%" height=""/>
      </div>
    </div>

    <div class="col-6 container-banner-ipod">
      <div class="content" style="color: white">
        <h1>iPod</h1>
        <p style="color: white">iPod nơi âm nhạc trở nên sống động.</p>
        <router-link class="buy-btn" style="border-color: white; color: white"
          >Mua sắm MacBook</router-link
        >
      </div>
      <div class="image-banner-ipod">
        <img src="/images/banner-home-ipod.png" alt="" srcset="" width="100%" />
      </div>
    </div>
  </div>

  <h1 class="m-5">TDT Store tạo nên mọi khác biệt.</h1>
  <swiper
    :watchSlidesProgress="true"
    :slidesPerView="3"
    :space-between="20"
    :loop="true"
    :modules="modules"
    :navigation="true"
    class="mySwiper"
  >
    <swiper-slide>
      <button
        class="border-0 bg-transparent p-0 w-100"
        data-bs-toggle="modal"
        data-bs-target="#sanpham"
      >
        <div class="apple-card blue">
          <div class="item">
            <i class="bi bi-patch-check"></i>
            <p>
              Sản phẩm
              <br />
              CHÍNH HÃNG
            </p>
          </div>
        </div>
      </button>
    </swiper-slide>

    <swiper-slide>
      <button
        class="border-0 bg-transparent p-0 w-100"
        data-bs-toggle="modal"
        data-bs-target="#giaohang"
      >
        <div class="apple-card green">
          <div class="item">
            <i class="bi bi-cart3"></i>
            <p>
              Giao hàng
              <br />
              TOÀN QUỐC
            </p>
          </div>
        </div>
      </button>
    </swiper-slide>
    <swiper-slide>
      <div class="apple-card purple" style="">
        <div class="item">
          <i class="bi bi-credit-card-2-back"></i>
          <p>
            Thanh toán
            <br />
            DỄ DÀNG
          </p>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="apple-card purple">
        <div class="item">
          <i class="bi bi-arrow-repeat"></i>
          <p>
            Bảo hành
            <br />
            1 đổi 1
          </p>
        </div>
      </div>
    </swiper-slide>
  </swiper>
  <div
    class="modal fade"
    id="sanpham"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Sản phẩm chính hãng
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Tất cả sản phẩm tại TDT Store đều là hàng chính hãng 100%, nhập trực
          tiếp từ các nhà phân phối uy tín. Chúng tôi cam kết nói không với hàng
          giả, hàng nhái. Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến
          tay khách hàng, kèm đầy đủ bảo hành chính hãng để bạn yên tâm sử dụng.
          Với TDT Store, bạn không chỉ mua sản phẩm, mà còn nhận được sự an tâm
          về chất lượng và dịch vụ hậu mãi tận tâm.
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="giaohang"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Giao hàng toàn quốc
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          TDT Store hỗ trợ giao hàng nhanh chóng trên toàn quốc. Dù bạn ở bất kỳ
          tỉnh thành nào, đơn hàng sẽ được xử lý và vận chuyển an toàn đến tận
          tay. Chúng tôi hợp tác với các đơn vị vận chuyển uy tín, đảm bảo thời
          gian giao hàng nhanh, phí ship hợp lý và theo dõi đơn hàng dễ dàng.
          Mục tiêu của chúng tôi là mang đến cho bạn trải nghiệm mua sắm tiện
          lợi và hài lòng nhất.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default {
  components: { Swiper, SwiperSlide },
  setup() {
    return { modules: [Navigation] };
  },
};
</script>

<style scoped>
.apple-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: left;
  height: 220px;
  background: linear-gradient(#868585be, #ffffff, #9b9b9b);
}

.apple-card i {
  font-size: 40px;
  margin-bottom: 15px;
  display: block;
}

.apple-card h3 {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}

.apple-card p {
  color: #555;
  font-size: 16px;
}

.apple-card.blue i,
.apple-card.blue h3 {
  font-size: 60px;
  color: #007aff;
}

.apple-card.green i,
.apple-card.green h3 {
  font-size: 60px;
  color: #34c759;
}

.apple-card.purple i,
.apple-card.purple h3 {
  font-size: 60px;
  color: #af52de;
}

.item {
  display: flex;
  margin: 40px;
  margin-bottom: 0px;
}

.item > p {
  color: white;
  margin: 10px;
  margin-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: black;
  width: 66px;
  height: 66px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-weight: bold;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: black;
  color: #fff;
  transform: scale(1.1);
}

.mySwiper {
  padding-left: 100px;
  padding-right: 100px;
  margin-bottom: 100px;
}

.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(90deg, #1e90ff, #00bfff);
  color: white;
  font-weight: bold;
  border-bottom: none;
  padding: 16px 24px;
}

.modal-title {
  font-size: 28px;
}

.btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.8;
}
.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 20px 24px;
  font-size: 20px;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  text-align: justify;
}

.banner {
  position: relative;
  height: 600px;
  background-color: #ffffff;
  color: #000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-left {
  position: absolute;
  z-index: 1;
  left: 0px;
  bottom: 0px;
}

.buy-now-container {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.buy-now-btn {
  background: linear-gradient(90deg, #1e90ff, #00bfff);
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  text-decoration: none;
}

.buy-now-btn:hover {
  transform: scale(1.1);
  background: linear-gradient(90deg, #00bfff, #1e90ff);
}

.banner-center {
  position: absolute;
  z-index: 2;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.banner-right {
  position: absolute;
  z-index: 1;
  right: 0px;
  bottom: 0px;
}

.title-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 400px;
  padding: 0px 80px 0px 80px;
}

.container-banner-iphone {
  position: relative;
  background: linear-gradient(to top, #ffffff, #83cfff 80%);
  height: 560px;
}

.image-banner-iphone {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.content {
  text-align: center;
  padding: 30px 20px;
  border-radius: 8px;
}

.content h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
}

.content p {
  font-size: 20px;
  color: #333;
  margin-bottom: 30px;
}

.buy-btn {
  background-color: transparent;
  color: #0071e3;
  font-size: 18px;
  font-weight: 500;
  padding: 12px 28px;
  border: 1.5px solid #0071e3;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.buy-btn:hover {
  background-color: #0071e3;
  color: #fff;
}

.container-banner-macbook {
  background: linear-gradient(#000000 16%, #0071e380 60%, #000000 100%);
  background-color: #278ff7;
  height: 520px;
  border-right: 5px solid white;
}

.image-banner-macbook {
  display: flex;
  justify-content: center;
}

.container-banner-ipad {
  background: linear-gradient(to bottom, #000000 16%, #ffffff80 60%, #000000 100%);
  height: 520px;
  border-left: 5px solid white;
}

.image-banner-ipad {
  height: 283px;
  display: flex;
  justify-content: center;
}

.container-banner-watch {
  background: linear-gradient(to bottom, #ff69b4 0%, #000000 30%);
  background-color: #278ff7;
  height: 610px;
  border-right: 5px solid white;
  overflow: hidden;
}

.image-banner-watch {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.container-banner-watch img {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}

.container-banner-ipod {
  background: linear-gradient(to bottom,
    #000000 0%,
    #000000 35%,
    #0071e3 50%,
    #000000 65%,
    #000000 100%);
  height: 610px;
  border-left: 5px solid white;
}

.image-banner-ipod {
  display: flex;
  justify-content: center;
  height: 400px;
}

.banner img,
.container-banner-iphone img,
.container-banner-macbook img,
.container-banner-ipad img,
.container-banner-watch img,
.container-banner-ipod img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  overflow: hidden;
}

@media (max-width: 992px) {
  .banner {
    position: relative;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
  }

  .banner-left,
  .banner-center,
  .banner-right {
    position: static;
    margin: 10px 0;
  }

  .title-banner {
    gap: 0;
    padding: 0 20px;
  }

  .buy-now-container {
    position: static;
    transform: none;
    margin: 20px 0;
  }

  .container-banner-iphone,
  .container-banner-macbook,
  .container-banner-ipad,
  .container-banner-watch,
  .container-banner-ipod {
    height: auto;
    padding: 20px 0;
    text-align: center;
  }
}
</style>

