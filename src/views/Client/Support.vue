<script setup>

</script>

<template >
    
    <div class="chao" style="margin-top: 120px;">
            <h2 align="center">
              Chào Bạn Mừng Bạn Đã Đến Với Trung Tâm Hỗ Trợ Của TaFi Store
            </h2>
          </div>
          <div class="row" style="padding: 20px;">
            <div class="col-md-7">
                <div class="support-box">
                    <h3 class="text-center fw-bold">Trung Tâm Hỗ Trợ TaFi Store 🎧</h3>
                    <p>
                        Tại TaFi Store, chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình sử dụng sản phẩm và dịch vụ của chúng tôi.
                    </p>
                    <p>
                        Chúng tôi hỗ trợ bạn với mọi hình thức Online và trực tuyến. Nếu bạn có những phản ánh xấu về cửa hàng, hãy gửi thông tin để chúng tôi cải thiện.
                    </p>
                    <h5 class="fw-bold">Câu Hỏi Thường Gặp</h5>
                    <p><strong>1. Làm thế nào để đổi trả sản phẩm?</strong><br>
                        Bạn có thể đổi trả sản phẩm trong vòng 7 ngày. Liên hệ hỗ trợ để biết thêm.
                    </p>
                    <p><strong>2. Kiểm tra tình trạng bảo hành thế nào?</strong><br>
                        Cung cấp thông tin cho đội ngũ hỗ trợ để kiểm tra bảo hành.
                    </p>
                    <p><strong>3. Hỗ trợ kỹ thuật ở đâu?</strong><br>
                        Bạn có thể đến cửa hàng hoặc gọi điện để nhận hỗ trợ từ kỹ thuật viên.
                    </p>
                </div>
            </div>
    

            <div class="col-md-5">
                <div class="form-box">
                    <h4 class="text-center fw-bold">Thông tin của bạn</h4>
                    <form action="#">
                        <div class="mb-3">
                            <input type="text" class="form-control" placeholder="Họ và tên">
                        </div>
                        <div class="mb-3">
                            <input type="tel" class="form-control" placeholder="Số điện thoại">
                        </div>
                        <div class="mb-3">
                            <input type="email" class="form-control" placeholder="Email">
                        </div>
                        <div class="mb-3">
                            <textarea class="form-control" rows="4" placeholder="Hãy nhập thông tin sản phẩm hoặc điều bạn cần hỗ trợ."></textarea>
                        </div>
                        <button  class="btn btn-submit">Gửi</button>
                    </form>
                </div>
            </div>
    
        </div>
        <hr>

        <footer>
            <div class="form ps-3">
              <div class="diachi">
                <h3 align="center" style="font-weight: bold;">Hệ thống cửa hàng</h3>
                <b>Tìm kiếm cửa hàng</b>
                <br />
      
                <div class="nen ">
                  <i class="bi bi-search"></i>
                  <input
                  
                    type="text"
                    name="timdiachi"
                    id="timdiachi"
                    required
                    placeholder="Nhập vị trí để tìm cửa hàng gần nhất"
                  />
                </div>
                <b>Hoặc</b>
                <br />
      
                <div class="nentinhhuyen ">
                  <select name="tinh" id="tinh" required>
                    <option value="" selected disabled>
                      Vui lòng chọn tỉnh/thành phố
                    </option>
                    <option value="TP.Hồ Chí Minh">TP.Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Cà Mau">Cà Mau</option>
                    <option value="Kiên Giang">Kiên Giang</option>
                    <option value="Bạc Liêu">Bạc Liêu</option>
                    <option value="Long An">Long An</option>
                    <option value="Hậu Giang">Hậu Giang</option>
                    <option value="An Giang">An Giang</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Vũng Tàu">Vũng Tàu</option>
                  </select>
                  <select name="huyen" id="huyen" required>
                    <option value="" selected disabled>
                      Vui lòng chọn huyện/quận
                    </option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 3">Quận 3</option>
                    <option value="Huyện Nhà Bè">Huyện Nhà Bè</option>
                    <option value="Quận Hoàn Kiếm">Quận Hoàn Kiếm</option>
                    <option value="Quận Đống Đa">Quận Đống Đa</option>
                    <option value="Huyện Đông Anh">Huyện Đông Anh</option>
                    <option value="Quận Ninh Kiều">Quận Ninh Kiều</option>
                    <option value="Quận Bình Thủy">Quận Bình Thủy</option>
                    <option value="Huyện Cờ Đỏ">Huyện Cờ Đỏ</option>
                    <option value="Huyện Cà Mau">Huyện Cà Mau</option>
                    <option value="Huyện Đầm Dơi">Huyện Đầm Dơi</option>
                    <option value="Huyện Năm Căn">Huyện Năm Căn</option>
                    <option value="Huyện Kiên Hải">Huyện Kiên Hải</option>
                    <option value="Huyện Phú Quốc">Huyện Phú Quốc</option>
                    <option value="Huyện An Biên">Huyện An Biên</option>
                    <option value="Huyện Bạc Liêu">Huyện Bạc Liêu</option>
                    <option value="Huyện Vĩnh Lợi">Huyện Vĩnh Lợi</option>
                    <option value="Huyện Hòa Bình">Huyện Hòa Bình</option>
                    <option value="Huyện Bến Lức">Huyện Bến Lức</option>
                    <option value="Huyện Thủ Thừa">Huyện Thủ Thừa</option>
                    <option value="Huyện Đức Hòa">Huyện Đức Hòa</option>
                    <option value="Huyện Châu Thành">Huyện Châu Thành</option>
                    <option value="Huyện Vị Thủy">Huyện Vị Thủy</option>
                    <option value="Huyện Long Mỹ">Huyện Long Mỹ</option>
                    <option value="Huyện Châu Phú">Huyện Châu Phú</option>
                    <option value="Huyện Chợ Mới">Huyện Chợ Mới</option>
                    <option value="Huyện Phú Tân">Huyện Phú Tân</option>
                    <option value="Huyện Bến Cát">Huyện Bến Cát</option>
                    <option value="Huyện Dầu Tiếng">Huyện Dầu Tiếng</option>
                    <option value="Thị xã Thủ Dầu Một">Thị xã Thủ Dầu Một</option>
                    <option value="Quận Hải Châu">Quận Hải Châu</option>
                    <option value="Quận Sơn Trà">Quận Sơn Trà</option>
                    <option value="Huyện Hòa Vang">Huyện Hòa Vang</option>
                    <option value="Thành phố Vũng Tàu">Thành phố Vũng Tàu</option>
                    <option value="Huyện Xuyên Mộc">Huyện Xuyên Mộc</option>
                    <option value="Huyện Đất Đỏ">Huyện Đất Đỏ</option>
                  </select>
                </div>
                <p align="center" style="margin-top: 10px; margin-bottom: 10px; font-weight: bold;">Địa chỉ các cửa hàng lớn</p>
                <div id="tablediachi">
                  <div class="row">
                    <p><b>Địa chỉ:</b> 123 Đường ABC, Quận Hoàn Kiếm, Hà Nội</p>
                    <p>
                      Thứ Hai - Thứ Sáu: 8:00 - 21:00
                      <br />
                      Thứ Bảy - Chủ Nhật: 9:00 - 22:00
                    </p>
                    <div class="nut">
                      <button type="button">
                        <i class="bi bi-telephone-outbound"></i> 0777118500
                      </button>
                      <button type="button">Xem cửa hàng</button>
                    </div>
                  </div>
                  <div class="row">
                    <p><b>Địa chỉ:</b> 101 Đường XYZ, Quận 1, TP.Hồ Chí Minh</p>
                    <p>
                      Thứ Hai - Thứ Sáu: 8:00 - 21:00
                      <br />
                      Thứ Bảy - Chủ Nhật: 9:00 - 22:00
                    </p>
                    <div class="nut">
                      <button type="button">
                        <i class="bi bi-telephone-outbound"></i> 0918486795
                      </button>
                      <button type="button">Xem cửa hàng</button>
                    </div>
                  </div>
                  <div class="row">
                    <p><b>Địa chỉ:</b> 122 Đường 3/2, Quận Ninh Kiều, Cần Thơ</p>
                    <p>
                      Thứ Hai - Thứ Sáu: 8:00 - 21:00
                      <br />
                      Thứ Bảy - Chủ Nhật: 9:00 - 22:00
                    </p>
                    <div class="nut">
                      <button type="button">
                        <i class="bi bi-telephone-outbound"></i> 0346650459
                      </button>
                      <button type="button">Xem cửa hàng</button>
                    </div>
                  </div>
                </div>
              </div>
      
              <div class="bando">
                  <h3 style="font-weight: bold;">Bản đồ cửa hàng </h3>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3304.245014523651!2d105.75684238838836!3d9.981154714889788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1728844384243!5m2!1svi!2s"
                  width="100%"
                  height="760px"
                  style="border: 0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </footer>
  
</template>

<style scoped>

    .chao{
    margin-top: 30px;
    width: 100%;
    background-color: #f0f0f0;
    color: #343434;
    border-radius: 20px;
    margin-bottom: 20px;
}

.support-box {
    background-color: #e3f2fd; /* Nền xanh nhạt */
    border-radius: 15px;
    padding: 25px;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);
}
.form-box {
    background-color: white;
    padding: 25px;
    border-radius: 15px;
    border: 2px solid black; /* Viền đen */
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
}
.btn-submit {
    background-color: black;
    color: white;
    border-radius: 5px;
    width: 100%;
    padding: 10px;
}
/*--------------------------------------------------------------*/
footer>.form{
    display: flex;
}

footer>.form>.diachi{
    width: 35%;
    padding: 20px;
    height: 900px;
    font-family: Arial, Helvetica, sans-serif;
    background-color: aliceblue;
    border-radius: 20px;
}
footer>.form>.diachi>.nen{
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: white;
    height: 42px;
    border: 1px solid black;
    border-radius: 10px;
    
}
footer>.form>.diachi>.nen>.bi.bi-search{
    margin-left: 20px;
}
#timdiachi{
    width: 90%;
    height: 40px;
    border-radius: 10px;
    border: none;
    outline: none;
}
footer>.form>.nentinhhuyen{
    margin-top: 20px;
}
#tinh{
    margin-top: 10px;
    width: 216px;
    height: 40px;
    border: 1px solid black;
    border-radius: 10px;
}

#huyen{
    width: 216px;
    height: 40px;
    border: 1px solid black;
    border-radius: 10px;
    
}


#tablediachi{
   
    border: 2px solid white;
    border-radius: 10px;
    
}

#tablediachi>.row{
    margin: 10px;
    padding: 10px;
    border: 2px solid black;
    border-radius: 10px;
    background-color: white;
    transition: transform 0.4s ease;    
}
#tablediachi>.row:hover{
    transform: scale(102%);
}
#tablediachi>.row>.nut{
   text-align: center;
}
#tablediachi>.row>.nut>button{
    margin-bottom: 10px;
    width: 180px;
    height: 30px;
    background-color:black ;
    color: white;
    border: none;
}
#tablediachi>.row>.nut>button:hover{
    cursor: pointer;
    color: red;
}


footer>.form>.bando{
    width: 60%;
    margin: 20px;
    margin-left: 40px;
    margin-top: 0px;
    padding: 20px;
    height: 900px;
    font-family: Arial, Helvetica, sans-serif;
    background-color: aliceblue;
    border-radius: 20px;
    
}
/*--------------------------------------------------------------*/
</style>