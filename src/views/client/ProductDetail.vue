<template>
  <div class="product-detail container py-5 mt-5">
    <div class="row align-items-start g-5">
      <!-- 🔹 Ảnh sản phẩm -->
      <div class="col-lg-6 col-md-12 text-center">
        <div class="main-image-wrapper position-relative bg-white rounded-4 shadow-lg p-4">
          <img :src="currentImage || '/images/default-product.png'" alt="Ảnh sản phẩm"
            class="img-fluid rounded-3 main-image" />
        </div>

        <!-- 🔸 Thumbnail -->
        <!-- Nếu có hơn 6 ảnh thì hiển thị bằng Swiper -->
        <div v-if="getAllImages().length > 6" class="thumbs mt-4">
          <Swiper :modules="[Navigation]" :slides-per-view="6" :space-between="10" navigation class="thumb-swiper">
            <SwiperSlide v-for="(img, idx) in getAllImages()" :key="idx">
              <img :src="img" class="thumb" :class="{ active: img === currentImage }" @click="currentImage = img"
                alt="thumb" />
            </SwiperSlide>
          </Swiper>
        </div>

        <!-- Nếu có 6 ảnh trở xuống thì hiển thị dạng lưới -->
        <div v-else class="thumbs d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <img v-for="(img, idx) in getAllImages()" :key="idx" :src="img" class="thumb"
            :class="{ active: img === currentImage }" @click="currentImage = img" alt="thumb" />
        </div>
      </div>

      <!-- 🔹 Thông tin sản phẩm -->
      <div class="col-lg-6 col-md-12">
        <div class="product-info bg-white rounded-4 shadow-sm p-4">
          <h1 class="product-name text-black">{{ product.name }}</h1>

          <p class="product-price mb-4 text-dark">
            {{ displayPrice.toLocaleString("vi-VN") }} VNĐ
          </p>

          <!-- Thuộc tính -->
          <div v-for="(attrGroup, index) in attributes" :key="index" class="attribute-group mb-3">
            <h6 class="fw-semibold mb-2 text-black">{{ attrGroup.name }}</h6>
            <div class="options">
              <span v-for="option in getVisibleOptions(attrGroup)" :key="option.name" class="option" :class="{
                active: selectedAttributes[attrGroup.name] === option.name,
                disabled: option.disabled,
              }" @click="
                  !option.disabled &&
                  selectAttribute(attrGroup.name, option.name)
                  ">
                {{ option.name }}
              </span>
            </div>
          </div>

          <!-- Số lượng -->
          <div class="quantity-selector mt-4" v-if="selectedSku">
            <label class="quantity-label text-black">Số lượng:</label>
            <div class="quantity-controls">
              <button class="btn-qty" @click="decreaseQuantity" :disabled="quantity <= 1">
                <i class="bi bi-dash"></i>
              </button>
              <input type="number" class="quantity-input" v-model="quantity" readonly />
              <button class="btn-qty" @click="increaseQuantity" :disabled="quantity >= selectedSku.quantity">
                <i class="bi bi-plus"></i>
              </button>
            </div>
          </div>

          <!-- Nút thao tác -->
          <div class="button-group mt-4">
            <button class="btn add-cart" :disabled="!hasStock" @click="addToCart">
              <i class="bi bi-cart"></i> Thêm vào giỏ
            </button>
            <button class="btn buy-now" :disabled="!hasStock" @click="buyNow">
              <i class="bi bi-lightning-charge"></i> Mua ngay
            </button>
          </div>

          <!-- Tồn kho -->
          <p v-if="selectedSku" class="mt-3 text-muted small">
            Số lượng còn lại: <strong>{{ selectedSku.quantity }}</strong>
          </p>

          <!-- ⭐ Đánh giá + Đã bán -->
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="text-warning fs-5">
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-half"></i>
            </div>
            <span class="text-muted small">(4.8/5 - 126 đánh giá)</span>
          </div>
        </div>
      </div>
    </div>

    <PolicySection/>

    <div class="product-info mt-5 bg-white rounded-4 shadow-sm p-4 description-wrapper">
      <h4 class="fw-bold mb-3 text-black text-center">Mô tả sản phẩm</h4>

      <div class="description-text text-secondary lh-lg mx-auto">
        <div v-html="showFullDescription ? product.description : shortDescription"></div>

        <button v-if="product.description && product.description.length > 300"
          class="btn btn-link p-0 mt-3 description-toggle" @click="showFullDescription = !showFullDescription">
          {{ showFullDescription ? "Thu gọn ▲" : "Xem thêm ▼" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/composables/axios.js";
import PolicySection from "@/components/PolicySection.vue";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const route = useRoute();
const router = useRouter();

const product = ref({});
const attributes = ref([]);
const selectedAttributes = ref({});
const selectedSku = ref(null);
const currentImage = ref("");
const quantity = ref(1);
const accountId = ref(null);
const relatedProducts = ref([]);

const showFullDescription = ref(false);

const shortDescription = computed(() => {
  if (!product.value.description) return "<i>Mô tả sản phẩm chưa có.</i>";
  const text = product.value.description;

  return text.length > 0 ? text.substring(0, 0) : text;
});

function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const loadProductDetail = async () => {
  try {
    const res = await axios.get(
      `/api/product/${route.params.id}`
    );
    product.value = res.data;
    currentImage.value = product.value.image;

    // Nhóm thuộc tính (giữ nguyên)
    const attrMap = {};
    product.value.skus?.forEach((sku) => {
      sku.skuAttributes?.forEach((attr) => {
        if (!attrMap[attr.optionAttributeName])
          attrMap[attr.optionAttributeName] = new Set();
        attrMap[attr.optionAttributeName].add(attr.valueAttributeName);
      });
    });

    attributes.value = Object.entries(attrMap).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));

    if (product.value.skus?.length > 0) {
      const firstSku = product.value.skus[0];
      selectedAttributes.value = {};
      firstSku.skuAttributes.forEach((attr) => {
        selectedAttributes.value[attr.optionAttributeName] =
          attr.valueAttributeName;
      });
      updateSelectedSku();
    }

  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
};

const selectedSectionIndex = ref(0);

const currentSectionContent = computed(() => {
  if (
    !product.value.descriptionSections ||
    !product.value.descriptionSections.length
  ) {
    return "<i>Mô tả sản phẩm chưa có.</i>";
  }
  return product.value.descriptionSections[selectedSectionIndex.value].content;
});

// 🟢 Khi chọn thuộc tính (giữ nguyên)
const selectAttribute = async (name, value) => {
  if (selectedAttributes.value[name] === value)
    delete selectedAttributes.value[name];
  else selectedAttributes.value[name] = value;
  await nextTick();
  updateSelectedSku();
};

// 🟢 Xác định SKU được chọn (giữ nguyên)
const updateSelectedSku = () => {
  const keys = Object.keys(selectedAttributes.value);
  selectedSku.value =
    product.value.skus?.find((sku) =>
      keys.every((key) =>
        sku.skuAttributes.find(
          (a) =>
            a.optionAttributeName === key &&
            a.valueAttributeName === selectedAttributes.value[key]
        )
      )
    ) || null;

  if (selectedSku.value) {
    currentImage.value =
      selectedSku.value.skuImages?.[0]?.path || product.value.image;
    quantity.value = 1;
  } else {
    currentImage.value = product.value.image;
  }
};

// 🟢 Ảnh hiển thị (giữ nguyên)
const getAllImages = () => {
  const images = new Set();
  if (selectedSku.value && selectedSku.value.skuImages?.length > 0) {
    selectedSku.value.skuImages.forEach((img) => images.add(img.path));
    return Array.from(images);
  }
  if (product.value.image) images.add(product.value.image);
  return Array.from(images);
};

// 🟢 Giá hiển thị (giữ nguyên)
const displayPrice = computed(() => {
  if (selectedSku.value?.price) return selectedSku.value.price;
  if (product.value.price) return product.value.price;
  return product.value.skus?.[0]?.price || 0;
});

// 🟢 Còn hàng (giữ nguyên)
const hasStock = computed(() => selectedSku.value?.quantity > 0);

// 🟢 Số lượng (giữ nguyên)
const increaseQuantity = () => {
  if (selectedSku.value && quantity.value < selectedSku.value.quantity)
    quantity.value++;
};
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// 🟢 Hiển thị option khả dụng (giữ nguyên)
const getVisibleOptions = (attrGroup) => {
  const selected = { ...selectedAttributes.value };
  delete selected[attrGroup.name];

  const filteredSkus = product.value.skus.filter((sku) =>
    Object.entries(selected).every(([k, v]) =>
      sku.skuAttributes.some(
        (a) => a.optionAttributeName === k && a.valueAttributeName === v
      )
    )
  );

  const visibleOptions = new Set(
    filteredSkus.flatMap((sku) =>
      sku.skuAttributes
        .filter((a) => a.optionAttributeName === attrGroup.name)
        .map((a) => a.valueAttributeName)
    )
  );

  return attrGroup.values.map((opt) => ({
    name: opt,
    disabled: !visibleOptions.has(opt),
  }));
};

const addToCart = async () => {
  if (!selectedSku.value) {
    Swal.fire(
      "Chọn biến thể!",
      "Vui lòng chọn đủ thuộc tính sản phẩm",
      "warning"
    );
    return;
  }

  if (!accountId.value) {
    Swal.fire(
      "Chưa đăng nhập",
      "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      "info"
    );
    router.push("/auth/login");
    return;
  }

  try {
    const res = await axios.post("/api/cart-details", {
      accountId: accountId.value,
      skuId: selectedSku.value.id,
      quantity: quantity.value,
    });

    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      text: "Sản phẩm đã được thêm thành công.",
      showConfirmButton: false,
      timer: 1500,
    });

    // Cập nhật lại event giỏ hàng
    window.dispatchEvent(new Event("cart-updated"));
  } catch (err) {
    console.error("Lỗi khi thêm vào giỏ hàng:", err);
    Swal.fire(
      "Lỗi!",
      "Số lượng sản phẩm đã đạt tối đa bạn không thể thêm sản phẩm vào giỏ hàng nữa.",
      "error"
    );
  }
};

const buyNow = () => {
  if (!selectedSku.value) {
    Swal.fire(
      "Chọn biến thể!",
      "Vui lòng chọn đủ thuộc tính sản phẩm",
      "warning"
    );
    return;
  }
  const order = [
    {
      skuId: selectedSku.value.id,
      name: product.value.name,
      price: displayPrice.value,
      image: currentImage.value,
      quantity: quantity.value,
      attributes: selectedAttributes.value,
    },
  ];
  sessionStorage.setItem("checkoutItems", JSON.stringify(order));
  router.push("/checkout");
};

// 🟢 Khởi tạo (giữ nguyên)
onMounted(() => {
  // Lấy ID người dùng từ JWT token
  const token = localStorage.getItem("token");
  if (token) {
    const payload = decodeJwtToken(token);
    accountId.value = payload?.id || null;
    console.log("🧩 Account ID:", accountId.value);
  }
  loadProductDetail();
});
</script>

<style scoped>
.policy-premium-row {
  width: 100%;
  padding: 22px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0;
}

.policy-premium-item {
  flex: 1;
  text-align: center;
  color: #111;
  font-size: 1rem;
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
}

.policy-premium-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: #e2e2e2;
}

.policy-premium-item i {
  font-size: 2rem;
  color: #000;
  opacity: 0.9;
  /* sang trọng */
}

.policy-premium-item span {
  font-weight: 500;
  opacity: 0.95;
}

.description-wrapper {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.description-text {
  max-width: 750px;
  font-size: 1.05rem;
  text-align: justify;
}

.description-toggle {
  font-weight: 600;
  color: #111;
}

.description-toggle:hover {
  color: #000;
  text-decoration: underline;
}

.btn-link {
  font-weight: 600;
  color: #111;
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
  color: #000;
}

.product-detail {
  max-width: 1200px;
  margin: 100px auto 0;
  color: #111;
  font-family: "Inter", system-ui, sans-serif;
}

/* --- Cân bằng layout */
.row.align-items-start {
  align-items: stretch !important;
  /* ensure equal column height */
}

/* 🔹 ẢNH CHÍNH */
.main-image-wrapper {
  overflow: hidden;
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
  border-radius: 20px;
  transition: all 0.3s ease;
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(17, 24, 39, 0.04);
}

.main-image {
  width: 100%;
  max-height: 460px;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.main-image-wrapper:hover .main-image {
  transform: scale(1.06);
}

/* 🔹 Thumbnail */
.thumb {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  background: #f8f9fa;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.thumb:hover {
  transform: translateY(-3px);
  border-color: #ddd;
}

.thumb.active {
  border-color: #111;
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

/* 🔹 Swiper buttons */
.thumb-swiper .swiper-button-prev,
.thumb-swiper .swiper-button-next {
  color: #111;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.thumb-swiper .swiper-button-prev:hover,
.thumb-swiper .swiper-button-next:hover {
  background: #f3f4f6;
}

/* 🔹 Product Info */
.product-info {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
}

.product-info:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 1.5rem;
}

/* 🔹 Options */
.attribute-group h6 {
  color: #333;
}

.option {
  background: #f6f7f8;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid transparent;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 6px;
}

.option:hover {
  background: #ececec;
}

.option.active {
  background: #111;
  color: #fff;
  border-color: #111;
}

.option.disabled {
  background: #f1f1f1;
  color: #aaa;
  cursor: not-allowed;
  border-color: #e0e0e0;
}

/* 🔹 Quantity */
.quantity-selector {
  margin-top: 1.2rem;
}

.quantity-label {
  margin-right: 10px;
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-qty {
  width: 38px;
  height: 38px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-qty:hover {
  background: #111;
  color: #fff;
}

.quantity-input {
  width: 60px;
  text-align: center;
  border: none;
  background: #fff;
  font-weight: 600;
  font-size: 1rem;
}

/* 🔹 Buttons */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
}

.add-cart {
  border: 1px solid #111;
  color: #111;
  background: #fff;
}

.add-cart:hover {
  background: #111;
  color: #fff;
}

.buy-now {
  background: #111;
  color: #fff;
}

.buy-now:hover {
  background: #222;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 🔹 Product Policy & Related */
.product-policy {
  margin-top: 18px;
}

.related {
  border-top: 1px solid #f0f0f0;
  margin-top: 20px;
  padding-top: 12px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-radius: 10px;
  transition: all 0.15s ease;
}

.related-item:hover {
  background: #fafafa;
  transform: translateX(4px);
}

/* 🔹 Description */
.product-info.mt-5 {
  line-height: 1.8;
  color: #555;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 16px;
}

/* Responsive tweaks */
@media (max-width: 992px) {
  .main-image-wrapper {
    min-height: 360px;
  }

  .main-image {
    max-height: 320px;
  }

  .thumb {
    width: 64px;
    height: 64px;
  }
}
</style>
