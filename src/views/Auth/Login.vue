<template>
    <section>

  <div class="container-banner">
    <div class="banner">
      <div class="banner-left">
        <img src="/images/banner-home-left.png" alt="" srcset="" />
      </div>

      <div class="banner-center">
              <div class="formto">
            <h3 class="text-center font-bold">Đăng nhập</h3>
            <br />
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email">Email</label>
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  
                  placeholder="Nhập email"
                />
              
              </div>
      
              <div class="mb-3">
                <label for="pass">Mật khẩu</label>
                <div class="input-group position-relative">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control pr-5 rounded-3"
                    id="pass"
                    
                    placeholder="Nhập mật khẩu"
                  />
                  <i
                    :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                    class="eye-icon"
                    @click="showPassword = !showPassword"
                  ></i>
                </div>
                
              </div>
  
          <div class="nhomatkhau mt-2">
            <p>
              <input type="checkbox"  /> Nhớ mật khẩu
            </p>
            <router-link to="/quenmatkhau" style="text-decoration: none;">Quên mật khẩu?</router-link>
          </div>
  
          <button type="submit" class="btn " id="btndangnhap">Đăng nhập</button>
  
          <h5 class="text-center">or</h5>
          <div class="fg">
            <button type="button" id="facebook" @click="dangNhapFacebook">
              <i class="bi bi-facebook"></i> Facebook
            </button>
            <button type="button" id="google" @click="dangNhapGoogle">
              <i class="bi bi-google"></i> Google
            </button>
          </div>
          <p id="dangky">
            Bạn chưa có tài khoản? <a href="dangky">Đăng ký</a>
          </p>
        </form>
      </div>
      </div>
      <div class="banner-right">
        <img src="/images/banner-home-right.png" alt="" srcset="" />
      </div>
    </div>
  </div>
    </section>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  
.banner {
  position: relative;
  height: 700px;
  color: #000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  /* background: linear-gradient(to bottom, #000000 16%, #ffffff80 60%, #000000 100%); */
 
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

.banner-center {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.banner-right {
  position: absolute;
  z-index: 1;
  right: 0px;
  bottom: 0px;
}
  section{
    font-family: Arial, Helvetica, sans-serif;
    height: 700px;
  }
  .eye-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 18px;
    color: #6c757d;
  }
  .eye-icon:hover {
    color: #000;
  }
  

  .formto {
    width: 500px;
    padding: 40px;
    padding-top: 20px;
   
    border-radius: 20px;
    max-height: 493px;
    color: rgb(0, 0, 0);
  }
  
  .nhomatkhau {
    display: flex;
    justify-content: space-between;
  }
  
  #btndangnhap {
    
    background-color: #000000;
    color: white;
    width: 100%;
    height: 36px;
    border: none;
    font-weight: bold;
    border: 1px solid #ffffff;
  }
  
  #btndangnhap:hover {
    cursor: pointer;
    background-color: white;
    color: #000;
    border: 2px solid black;
    
  }
  
  .fg {
    text-align: center;
    margin: 10px;
  }
  
  #facebook {
    border: none;
    width: 143px;
    height: 30px;
    background-color: #4285F4;
    color: white;
    margin-right: 5px;
  }
  
  #facebook:hover {
    cursor: pointer;
    background-color: rgb(32, 89, 182);
  }
  
  #google {
    border: none;
    width: 145px;
    height: 30px;
    background-color: #EA4335;
    color: white;
    margin-left: 4px;
  }
  
  #google:hover {
    cursor: pointer;
    background-color: #c12f22;
  }
  
  #dangky {
    text-align: center;
  }
  </style>
  