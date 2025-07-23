<template>
    <nav class="header d-flex align-items-center">
    
        
        <div class="tab d-flex align-items-center">
            <form class=" search d-flex align-items-center">
                    <input type="text" class="input-search form-control" id="exampleFormControlInput1" placeholder="Bạn muốn tìm gì ?">
                    <button class="button-search"><i class="bi bi-search"></i></button>
                </form>
        
        </div>
        
        <div class="information">
            <div class="dropdown">
            <button class="btn dropdown-toggle" type="button" style="border: none;" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle" style="font-size: 32px;"></i>
            </button>
            <ul class="dropdown-menu" style="width: 260px;" aria-labelledby="dropdownMenuButton1">
                <li class="dropdown-item"> <strong>Chưa đăng nhập</strong></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link class="dropdown-item" to="">Đăng ký</router-link></li>
                <li><router-link class="dropdown-item" to="">Đăng nhập</router-link></li>
                <li><router-link class="dropdown-item" to="">Quên mật khẩu</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link class="dropdown-item" to="">Thông tin tài khoản</router-link></li>
                <li><router-link to="/quanly/tongquan" class="dropdown-item" >Quản lý hệ thống</router-link></li>
                <li><router-link class="dropdown-item" to="">Đổi mật khẩu</router-link></li>
                <li><router-link class="dropdown-item" to="">Đăng xuất</router-link></li>
            </ul>
            </div>

        </div>

    </nav>
</template>


<style scoped>

    .header{
        
        position: fixed; 
        top: 0;          
        left: 0;
        width: 100%; 
        height: 60px;    
        background-color: #fff; 
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
        z-index: 1000; 
        margin-left: 0px;
        padding-left: 760px;
    }
    
    .tab>.search{
        position: relative;
    }
    .tab>.search>.input-search{
        border-radius: 20px;
        width: 260px;
    }
    .tab>.search>.button-search{
        background-color: transparent;
        border: none;
        position: absolute;
        right: 6px;
    }

    .information{
        margin-left: 10px;
    }
</style>

<script setup>

</script>