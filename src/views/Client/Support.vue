<template>
  <div class="container py-5">
    <h2 class="text-center mb-4 fw-bold">📞 HỖ TRỢ KHÁCH HÀNG</h2>
    <p class="text-center text-muted mb-5">Nếu bạn có câu hỏi hay vấn đề, chúng tôi luôn sẵn sàng hỗ trợ!</p>

    <!-- Accordion: Câu hỏi thường gặp -->
    <div class="accordion mb-5" id="faqAccordion">
      <div class="accordion-item" v-for="(faq, index) in faqs" :key="index">
        <h2 class="accordion-header" :id="'heading' + index">
          <button
            class="accordion-button"
            :class="{ collapsed: activeFaq !== index }"
            type="button"
            @click="toggleFaq(index)"
          >
            {{ faq.question }}
          </button>
        </h2>
        <transition name="fade">
          <div
            :id="'collapse' + index"
            class="accordion-collapse collapse"
            :class="{ show: activeFaq === index }"
          >
            <div class="accordion-body">{{ faq.answer }}</div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Biểu mẫu liên hệ -->
    <div class="row">
      <div class="col-md-6">
        <h4 class="fw-bold mb-3">Gửi yêu cầu hỗ trợ</h4>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="form-label">Họ và tên</label>
            <input v-model="form.name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Nội dung</label>
            <textarea v-model="form.message" rows="4" class="form-control" required></textarea>
          </div>
          <button class="btn btn-primary" type="submit">Gửi hỗ trợ</button>
        </form>
      </div>

      <!-- Bên phải: Thông tin liên hệ -->
      <div class="col-md-6 mt-5 mt-md-0">
        <h4 class="fw-bold mb-3">Thông tin liên hệ</h4>
        <ul class="list-unstyled">
          <li class="mb-3"><i class="bi bi-telephone-fill me-2"></i> 0123 456 789</li>
          <li class="mb-3"><i class="bi bi-envelope-fill me-2"></i> support@tdtapple.vn</li>
          <li class="mb-3"><i class="bi bi-geo-alt-fill me-2"></i> 123 Lê Lợi, Quận 1, TP.HCM</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeFaq: null,
      faqs: [
        {
          question: "Làm thế nào để đặt hàng?",
          answer: "Bạn chỉ cần chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán.",
        },
        {
          question: "Tôi có thể đổi trả hàng không?",
          answer: "Có, bạn có thể đổi trả trong vòng 7 ngày kể từ khi nhận hàng.",
        },
        {
          question: "Tôi có thể thanh toán bằng cách nào?",
          answer: "Chúng tôi hỗ trợ chuyển khoản, COD, thẻ tín dụng và ví điện tử.",
        },
      ],
      form: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? null : index;
    },
    submitForm() {
      alert(`📨 Cảm ơn bạn ${this.form.name}, chúng tôi sẽ phản hồi sớm qua email: ${this.form.email}`);
      this.form = { name: "", email: "", message: "" };
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
