<template>
        <div class="container-banner">
        <div id="carouselExampleControls"  class="carousel slide mt-3" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="/images/banner-trangchu-1.png" class="d-block w-100" alt="Banner 1">
            </div>
            <div class="carousel-item">
                <img src="/images/banner-trangchu-2.png" class="d-block w-100" alt="Banner 2">
            </div>
            <div class="carousel-item">
                <img src="/images/banner-trangchu-3.png" class="d-block w-100" alt="Banner 3">
            </div>
            <div class="carousel-item">
                <img src="/images/banner-trangchu-4.jpg" class="d-block w-100" alt="Banner 3">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    <div class="video-banner mt-5">
        <div class="title-video-banner">
            <p style="font-size: 60px;font-weight: bold;"><i class="bi bi-apple"></i>iPhone</p>
            <p style="font-size: 30px; font-weight: bold;">Sở hữu iPhone <br> nâng tầm đẳng cấp.</p>
        </div>
       
        <video src="/images/banner-iphone-home.mp4" type="video/mp4" width="100%" height="660px" autoplay="autoplay" muted="" loop="">
        </video>
    </div>
     </div>

     <div class="container p-5 mt-5">
     <div class="information">
        <div class="title-information mb-5">
            <p style="font-size: 60px;font-weight: bold;">Khám phá sản phẩm</p>
        </div>

        <div class="row">
            <div class="col-lg-4">
               <router-link class="card" style="width: 100%;">
                    <img src="/images/Ip16prm-1tb.png" class="card-img-top">
            
            <div class="card-body">
                <h1 class="card-text">iPhone 16 ProMax</h1>
                <h5 class="card-text">Một iPhone cực mạnh</h5>
            </div>
        </router-link>
            </div>
            <div class="col-lg-4">
                <router-link class="card" style="width: 100%;">
            <img src="/images/Ip16plus.png" class="card-img-top" >
            <div class="card-body">
                <h1 class="card-text">iPhone 16 Plus</h1>
                <h5 class="card-text">Một thiết bị thật thời trang</h5>
            </div>
        </router-link>
            </div>
            <div class="col-lg-4">
                <router-link class="card" style="width: 100%;">
                    <img src="/images/Ip16.png" class="card-img-top" >
            <div class="card-body">
                <h1 class="card-text">iPhone 16</h1>
                <h5 class="card-text">iPhone cực đỉnh với giá tốt nhất</h5>
            </div>
        </router-link>
            </div>
        </div>
        

     </div>
     </div>
</template>

<script>

</script>

<style  scoped>
video{
    
    object-fit: cover;
    border-radius: 60px;
    padding: 20px;
}

.title-video-banner{
    margin-top: 80px;
    display: flex;
    align-items: center;
    gap: 700px;
    padding: 40px 80px 20px 80px;
    
}
.card{
    text-decoration: none;
    border: none;
}
.card-img-top{
    height: 460px;
    width: 390px;
    transition: transform 0.2s ease-in-out;
    
}
.card-img-top:hover{
    transform: translateY(-20px);
}

.card-body{
    text-align: center;
}
</style>

