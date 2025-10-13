<script setup>
</script>

<template>
  <div class="chao mt-3">
    <h2 align="center">
      Chào Bạn — Mừng Bạn Đã Đến Với Trung Tâm Hỗ Trợ Của TDT Store
    </h2>
  </div>

  <div class="row px-3">
    <div class="col-md-7 mb-4">
      <div class="support-box">
        <h3 class="text-center fw-bold">Trung Tâm Hỗ Trợ TDT Store 🎧</h3>
        <p>
          Tại TDT Store, chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình sử dụng
          sản phẩm và dịch vụ của chúng tôi.
        </p>
        <p>
          Chúng tôi hỗ trợ bạn với mọi hình thức online và trực tiếp. Nếu bạn có phản
          ánh, hãy gửi thông tin để chúng tôi cải thiện.
        </p>

        <h5 class="fw-bold">Câu Hỏi Thường Gặp</h5>
        <p>
          <strong>1. Làm thế nào để đổi trả sản phẩm?</strong><br />
          Bạn có thể đổi trả sản phẩm trong vòng 7 ngày. Liên hệ hỗ trợ để biết thêm.
        </p>
        <p>
          <strong>2. Kiểm tra tình trạng bảo hành thế nào?</strong><br />
          Cung cấp thông tin cho đội ngũ hỗ trợ để kiểm tra bảo hành.
        </p>
        <p>
          <strong>3. Hỗ trợ kỹ thuật ở đâu?</strong><br />
          Bạn có thể đến cửa hàng hoặc gọi điện để nhận hỗ trợ từ kỹ thuật viên.
        </p>
      </div>
    </div>

    <div class="col-md-5 mb-4">
      <div class="form-box">
        <h4 class="text-center fw-bold">Thông tin của bạn</h4>
        <form>
          <div class="mb-3">
            <input type="text" class="form-control" placeholder="Họ và tên" />
          </div>
          <div class="mb-3">
            <input type="tel" class="form-control" placeholder="Số điện thoại" />
          </div>
          <div class="mb-3">
            <input type="email" class="form-control" placeholder="Email" />
          </div>
          <div class="mb-3">
            <textarea
              class="form-control"
              rows="4"
              placeholder="Hãy nhập thông tin sản phẩm hoặc điều bạn cần hỗ trợ."
            ></textarea>
          </div>
          <button class="btn btn-submit">Gửi</button>
        </form>
      </div>
    </div>
  </div>

  <hr />

  <footer>
    <div class="form">
      <div class="diachi mb-4">
        <h3 align="center" style="font-weight: bold;">Hệ thống cửa hàng</h3>
        <b>Tìm kiếm cửa hàng</b>
        <div class="nen">
          <i class="bi bi-search"></i>
          <input
            type="text"
            id="timdiachi"
            placeholder="Nhập vị trí để tìm cửa hàng gần nhất"
          />
        </div>

        <b>Hoặc</b>
        <div class="nentinhhuyen">
          <select id="tinh">
            <option selected disabled>Chọn tỉnh/thành phố</option>
            <option>TP.Hồ Chí Minh</option>
            <option>Hà Nội</option>
            <option>Cần Thơ</option>
          </select>
          <select id="huyen">
            <option selected disabled>Chọn huyện/quận</option>
            <option>Quận 1</option>
            <option>Quận 3</option>
            <option>Quận Ninh Kiều</option>
          </select>
        </div>

        <p class="text-center fw-bold mt-3 mb-3">Địa chỉ các cửa hàng lớn</p>
        <div id="tablediachi">
          <div class="row">
            <p><b>Địa chỉ:</b> 123 Đường ABC, Quận Hoàn Kiếm, Hà Nội</p>
            <p>Thứ Hai - CN: 8:00 - 21:00</p>
            <div class="nut">
              <button><i class="bi bi-telephone-outbound"></i> 0777118500</button>
              <button>Xem cửa hàng</button>
            </div>
          </div>

          <div class="row">
            <p><b>Địa chỉ:</b> 101 Đường XYZ, Quận 1, TP.HCM</p>
            <p>Thứ Hai - CN: 8:00 - 21:00</p>
            <div class="nut">
              <button><i class="bi bi-telephone-outbound"></i> 0918486795</button>
              <button>Xem cửa hàng</button>
            </div>
          </div>
        </div>
      </div>

      <div class="bando">
        <h3 style="font-weight: bold;">Bản đồ cửa hàng</h3>
        <div class="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3304.245014523651!2d105.75684238838836!3d9.981154714889788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1728844384243!5m2!1svi!2s"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ===== Fix overflow toàn trang ===== */
:host,
html,
body {
  overflow-x: hidden !important;
  width: 100%;
}

* {
  box-sizing: border-box;
  max-width: 100%;
}

/* --- Header --- */
.chao {
  background-color: #ffffff;
  color: #343434;
  border-radius: 20px;
  margin-bottom: 20px;
  padding: 15px;
}

/* --- Khối nội dung --- */
.support-box {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);
}

.form-box {
  background-color: white;
  padding: 25px;
  border-radius: 15px;
  border: 2px solid black;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-submit {
  background-color: black;
  color: white;
  border-radius: 5px;
  width: 100%;
  padding: 10px;
  transition: 0.3s;
}

.btn-submit:hover {
  background-color: #0d6efd;
  color: white;
}

/* --- Footer --- */
footer {
  width: 100%;
  overflow-x: hidden;
}

footer .form {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0;
  padding: 0 10px;
  width: 100%;
}

footer .diachi {
  flex: 1 1 35%;
  min-width: 320px;
  padding: 20px;
  background-color: aliceblue;
  border-radius: 20px;
  overflow: hidden;
}

footer .bando {
  flex: 1 1 60%;
  min-width: 320px;
  background-color: aliceblue;
  border-radius: 20px;
  padding: 20px;
  overflow: hidden;
}

/* --- Map --- */
.map-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.map-wrapper iframe {
  width: 100%;
  height: 760px;
  border: none;
  display: block;
}

/* --- Form tìm cửa hàng --- */
.nen {
  margin: 10px 0;
  background-color: white;
  height: 42px;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

#timdiachi {
  flex: 1;
  border: none;
  outline: none;
  height: 40px;
  border-radius: 10px;
  padding-left: 10px;
}

#tinh,
#huyen {
  width: 100%;
  height: 40px;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 10px;
}

/* --- Bảng địa chỉ --- */
#tablediachi .row {
  margin: 10px 0;
  padding: 10px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: white;
  transition: transform 0.3s ease;
}

#tablediachi .row:hover {
  transform: scale(1.02);
}

#tablediachi .nut {
  text-align: center;
}

#tablediachi .nut button {
  margin: 5px;
  width: 180px;
  height: 35px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  transition: 0.3s;
}

#tablediachi .nut button:hover {
  background-color: #0d6efd;
}

/* --- Responsive --- */
@media (max-width: 992px) {
  footer .form {
    flex-direction: column;
    align-items: center;
  }

  footer .diachi,
  footer .bando {
    width: 95%;
  }

  .map-wrapper iframe {
    height: 400px;
  }
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.2rem;
  }

  .map-wrapper iframe {
    height: 300px;
  }
}

@media (max-width: 576px) {
  .btn-submit {
    font-size: 0.9rem;
  }

  .map-wrapper iframe {
    height: 250px;
  }
}
</style>
