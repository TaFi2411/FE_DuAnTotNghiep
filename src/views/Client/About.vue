<template>
  <div class="container py-5">
    <transition name="fade-slide" appear>
      <div>
        <h2 class="mb-4 text-center text-primary">Giới Thiệu Về TDT APPLE</h2>
        <p class="text-muted text-center mb-4">
          Cửa hàng chuyên cung cấp các dòng điện thoại chính hãng, uy tín và chất lượng hàng đầu.
        </p>

        <div class="row">
          <div class="col-md-6 mb-4">
            <img
              src="/images/hinhapple.png"
              class="img-fluid"
              alt="Cửa hàng điện thoại"
            />
          </div>
          <div class="col-md-6">
            <h5 class="fw-bold">Về TDT APPLE</h5>
            <p>
              TDT APPLE là cửa hàng chuyên kinh doanh các sản phẩm điện thoại cao cấp như iPhone, iPad và phụ kiện chính hãng. Chúng tôi cam kết mang đến trải nghiệm mua sắm uy tín, sản phẩm chất lượng, giá cả hợp lý và chế độ hậu mãi tận tâm.
            </p>

            <h5 class="fw-bold mt-4">Tại sao chọn chúng tôi?</h5>
            <ul class="text-muted ps-3">
              <li>✔ Sản phẩm chính hãng, nguyên seal, bảo hành rõ ràng</li>
              <li>✔ Giá cả cạnh tranh, nhiều chương trình ưu đãi hấp dẫn</li>
              <li>✔ Đội ngũ tư vấn nhiệt tình, am hiểu công nghệ</li>
              <li>✔ Hỗ trợ trả góp linh hoạt</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
};
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.6s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
