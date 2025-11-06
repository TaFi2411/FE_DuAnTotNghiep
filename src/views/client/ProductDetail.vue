<template>
  <div class="product-detail container py-5 mt-5">
    <!-- --- PHẦN TRÊN: ẢNH & THÔNG TIN --- -->
    <div class="row align-items-start g-5">
      <!-- Ảnh chính -->
      <div class="col-lg-6 col-md-12 text-center">
        <div class="main-image-wrapper p-4 bg-white rounded-4 shadow-sm">
          <img
            :src="currentImage || '/images/crs-ip17-air.png'"
            alt="Ảnh sản phẩm"
            class="img-fluid rounded-3 main-image"
          />
        </div>

        <!-- thumbnail -->
        <div class="thumbs d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <img
            v-for="(thumb, i) in thumbnails"
            :key="i"
            :src="thumb"
            class="thumb"
            :class="{ active: thumb === currentImage }"
            @click="currentImage = thumb"
          />
        </div>
      </div>

      <!-- THÔNG TIN SẢN PHẨM -->
      <div class="col-lg-6 col-md-12">
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>

          <!-- Giá -->
          <p class="product-price">{{ displayPrice.toLocaleString("vi-VN") }} ₫</p>

          <!-- CHỌN THUỘC TÍNH -->
          <div
            v-for="(attrGroup, index) in attributes"
            :key="index"
            class="attribute-group mb-3"
          >
            <h6 class="fw-semibold mb-2">{{ attrGroup.name }}</h6>

            <div class="options">
              <span
                v-for="option in getVisibleOptions(attrGroup)"
                :key="option"
                class="option"
                :class="{ active: selectedAttributes[attrGroup.name] === option }"
                @click="selectAttribute(attrGroup.name, option)"
              >
                {{ option }}
              </span>
            </div>
          </div>

          <!-- CHỌN SỐ LƯỢNG -->
          <div class="quantity-selector" v-if="selectedSku">
            <label class="quantity-label">Số lượng:</label>
            <div class="quantity-controls">
              <button class="btn-qty" @click="decreaseQuantity" :disabled="quantity <= 1">
                ➖
              </button>
              <input type="number" class="quantity-input" v-model="quantity" readonly />
              <button
                class="btn-qty"
                @click="increaseQuantity"
                :disabled="quantity >= selectedSku.quantity"
              >
                ➕
              </button>
            </div>
          </div>

          <!-- NÚT -->
          <div class="button-group mt-4">
            <button class="btn add-cart" :disabled="!hasStock" @click="addToCart">
              🛒 Thêm vào giỏ hàng
            </button>
            <button class="btn buy-now" :disabled="!hasStock" @click="buyNow">
              💳 Mua ngay
            </button>
          </div>

          <!-- Số lượng còn lại -->
          <p v-if="selectedSku" class="mt-2 text-muted">
            Số lượng còn lại: <strong>{{ selectedSku.quantity }}</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- --- PHẦN DƯỚI: MÔ TẢ & ĐÁNH GIÁ --- -->
    <div class="product-info mt-5 bg-white rounded-4 shadow-sm p-4">
      <h4 class="fw-bold mb-3">Mô tả sản phẩm</h4>
      <p class="text-secondary lh-lg">{{ product.description || "Đang cập nhật..." }}</p>

      <hr class="my-4" />

      <!-- 🟡 ĐÁNH GIÁ KHÁCH HÀNG -->
      <h4 class="fw-bold mb-3">Đánh giá của khách hàng ({{ reviews.length }})</h4>

      <!-- Danh sách đánh giá -->
      <div
        v-for="review in reviews"
        :key="review.id"
        class="card mb-3 border-0 border-bottom pb-3"
      >
        <div class="card-body p-0 ms-3 mt-3">
          <h6 class="fw-semibold mb-1">{{ review.accountName }}</h6>
          <div class="text-warning mb-2">
            <i v-for="n in review.star" :key="n" class="bi bi-star-fill"></i>
          </div>
          <p class="text-muted small mb-2">{{ review.description }}</p>
          <button
            v-if="user && user.id === review.accountId"
            class="btn btn-outline-danger btn-sm mt-2"
            @click="confirmDelete(review.id)"
          >
            <i class="bi bi-trash"></i> Xóa
          </button>
        </div>
      </div>

      <div v-if="reviews.length === 0" class="text-muted">Chưa có đánh giá nào.</div>

      <hr class="my-4" />

      <!-- 🟢 FORM GỬI ĐÁNH GIÁ -->
     <!-- 🟢 FORM GỬI ĐÁNH GIÁ -->
<div v-if="user && canReview" class="review-form mt-4">
  <h5 class="fw-semibold mb-3">Viết đánh giá của bạn</h5>

  <div class="mb-3">
    <label class="form-label fw-semibold">Chọn sao:</label>
    <div class="stars text-warning fs-5">
      <i
        v-for="n in 5"
        :key="n"
        class="bi"
        :class="n <= newReview.star ? 'bi-star-fill' : 'bi-star'"
        style="cursor: pointer"
        @click="newReview.star = n"
      ></i>
    </div>
  </div>

  <div class="mb-3">
    <label class="form-label fw-semibold">Nhận xét:</label>
    <textarea
      class="form-control"
      rows="3"
      v-model="newReview.description"
      placeholder="Chia sẻ trải nghiệm của bạn..."
    ></textarea>
  </div>

  <button class="btn btn-primary rounded-pill px-4" @click="submitReview">
    Gửi đánh giá
  </button>
</div>

<!-- ❌ Chưa mua hoặc chưa hoàn thành đơn -->
<div v-else-if="user && !canReview" class="text-muted mt-3">
  <i class="bi bi-cart-x"></i>
  Bạn chỉ có thể đánh giá khi đã mua sản phẩm này thành công.
</div>

<!-- 🔒 Chưa đăng nhập -->
<div v-else class="text-muted mt-3">
  <i class="bi bi-lock"></i>
  Vui lòng đăng nhập để đánh giá sản phẩm.
</div>


      <hr class="my-4" />

      <!-- 🟡 CÁC SẢN PHẨM KHÁC -->
      <h4 class="fw-bold mb-3">Các sản phẩm khác</h4>
      <div class="product-list">
        <div class="product-item" v-for="p in visibleProducts" :key="p.id">
          <div class="product-image-wrapper">
            <img :src="p.image" class="product-image" :alt="p.name" />
          </div>
          <div class="card-body">
            <h5 class="fw-bold mb-2">{{ p.name }}</h5>
            <p class="fw-semibold text-primary mb-2">
              {{
                getPrice(p)
                  ? getPrice(p).toLocaleString("vi-VN") + "₫"
                  : "Giá: Liên hệ"
              }}
            </p>
            <router-link
              :to="`/san-pham/${p.id}`"
              class="btn btn-primary rounded-pill px-4 py-2"
            >
              Mua ngay
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="visibleCount < products.length" class="text-center mt-4">
        <button
          class="btn btn-outline-primary px-5 py-2 rounded-pill fw-semibold"
          @click="loadMore"
        >
          Xem thêm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const product = ref({});
const attributes = ref([]);
const selectedAttributes = ref({});
const selectedSku = ref(null);
const currentImage = ref("");
const thumbnails = ref([]);
const products = ref([]);
const reviews = ref([]);
const quantity = ref(1);
const visibleCount = ref(10);
const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
const newReview = ref({ star: 0, description: "" });

// --- 🟢 Load chi tiết sản phẩm ---
const loadProductDetail = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/product/${route.params.id}`);
    product.value = res.data;
    currentImage.value = product.value.image;
    thumbnails.value = [product.value.image];
    // Thuộc tính
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
    selectedAttributes.value = {};
    selectedSku.value = null;
    quantity.value = 1;
    await loadReviews();
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
};

// --- 🟡 Load đánh giá sản phẩm ---
const loadReviews = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/review/by-product?productId=${route.params.id}`
    );
    reviews.value = res.data || [];
  } catch (err) {
    console.error("Lỗi khi tải đánh giá:", err);
  }
};

// 🟢 Gửi đánh giá
const submitReview = async () => {
  if (!newReview.value.star || !newReview.value.description.trim()) {
    return Swal.fire("Thiếu thông tin", "Vui lòng chọn sao và nhập nội dung!", "warning");
  }

  try {
    const payload = {
      star: newReview.value.star,
      description: newReview.value.description,
      accountId: user.value.id,
      productId: product.value.id,
    };
    await axios.post("http://localhost:8080/api/review", payload);
    Swal.fire("Cảm ơn bạn!", "Đánh giá của bạn đã được gửi.", "success");
    newReview.value = { star: 0, description: "" };
    await loadReviews();
  } catch (err) {
    Swal.fire("Lỗi", err.response?.data?.message || "Không thể gửi đánh giá.", "error");
  }
};

// --- Xóa đánh giá ---
const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: "Xác nhận xóa?",
    text: "Bạn có chắc muốn xóa đánh giá này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/review/${id}`);
      reviews.value = reviews.value.filter((r) => r.id !== id);
      Swal.fire("Đã xóa!", "Đánh giá đã được xóa.", "success");
    } catch {
      Swal.fire("Lỗi!", "Không thể xóa đánh giá.", "error");
    }
  }
};

// --- Giữ nguyên toàn bộ chức năng khác của bạn ---
const selectAttribute = async (n, v) => {
  if (selectedAttributes.value[n] === v) delete selectedAttributes.value[n];
  else selectedAttributes.value[n] = v;
  await nextTick();
  updateSelectedSku();
};

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
  }
};

const displayPrice = computed(() => {
  if (selectedSku.value?.price) return selectedSku.value.price;
  if (product.value.price) return product.value.price;
  if (product.value.skus?.length) return product.value.skus[0].price || 0;
  return 0;
});

const hasStock = computed(() => selectedSku.value?.quantity > 0);

const addToCart = () => {
  const requiredAttrs = attributes.value.map((a) => a.name);
  const isComplete = requiredAttrs.every(
    (attr) => selectedAttributes.value[attr]
  );
  if (!isComplete) {
    return Swal.fire("Thiếu thuộc tính!", "Vui lòng chọn đầy đủ.", "warning");
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const skuId = selectedSku.value?.id || product.value.id;
  const existingItem = cart.find((item) => item.skuId === skuId);

  if (existingItem) {
    existingItem.quantity = Math.min(
      existingItem.quantity + quantity.value,
      selectedSku.value.quantity
    );
  } else {
    cart.push({
      skuId,
      name: product.value.name,
      price: displayPrice.value,
      image: currentImage.value,
      quantity: quantity.value,
      stock: selectedSku.value?.quantity || 0,
      attributes: { ...selectedAttributes.value },
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  Swal.fire("Đã thêm!", "Sản phẩm đã được thêm vào giỏ hàng.", "success");
};

const buyNow = () => {
  const requiredAttrs = attributes.value.map((a) => a.name);
  const isComplete = requiredAttrs.every(
    (attr) => selectedAttributes.value[attr]
  );
  if (!isComplete) {
    return Swal.fire("Thiếu thuộc tính!", "Vui lòng chọn đầy đủ.", "warning");
  }
  const order = [
    {
      skuId: selectedSku.value?.id || product.value.id,
      name: product.value.name,
      price: displayPrice.value,
      image: currentImage.value,
      quantity: quantity.value,
      attributes: selectedAttributes.value,
    },
  ];
  localStorage.setItem("checkout", JSON.stringify(order));
  router.push("/thanh-toan");
};

const getPrice = (p) => {
  if (!p.skus || p.skus.length === 0) return null;
  const skuWithPrice = p.skus.find((sku) => sku.price > 0);
  return skuWithPrice ? skuWithPrice.price : null;
};

const visibleProducts = computed(() =>
  products.value.slice(0, visibleCount.value)
);
const loadMore = () => (visibleCount.value += 10);
const increaseQuantity = () => {
  if (selectedSku.value && quantity.value < selectedSku.value.quantity)
    quantity.value++;
};
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const getVisibleOptions = (attrGroup) => {
  const selected = { ...selectedAttributes.value };
  delete selected[attrGroup.name];

  let filteredSkus = product.value.skus.filter((sku) =>
    Object.entries(selected).every(([k, v]) =>
      sku.skuAttributes.some(
        (a) => a.optionAttributeName === k && a.valueAttributeName === v
      )
    )
  );

  return [
    ...new Set(
      filteredSkus
        .flatMap((sku) =>
          sku.skuAttributes
            .filter((a) => a.optionAttributeName === attrGroup.name)
            .map((a) => a.valueAttributeName)
        )
    ),
  ];
};

onMounted(async () => {
  await loadProductDetail();
  await checkCanReview(); // ✅ thêm dòng này
  const res = await axios.get("http://localhost:8080/api/product");
  products.value = res.data.data || [];
});

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await loadProductDetail();
      await checkCanReview(); // ✅ thêm dòng này
      window.scrollTo(0, 0);
    }
  }
);





const canReview = ref(false);

// 🧩 Kiểm tra quyền đánh giá
const checkCanReview = async () => {
  if (!user.value) {
    canReview.value = false;
    return;
  }
  try {
    const res = await axios.get(
      `http://localhost:8080/api/review/can-review/${route.params.id}?accountId=${user.value.id}`
    );
    canReview.value = res.data === true;
  } catch (err) {
    console.error("Lỗi khi kiểm tra quyền đánh giá:", err);
    canReview.value = false;
  }
};

</script>




<style scoped>
.product-detail {
  box-sizing: border-box;
  max-width: 1200px;
  margin: 100px auto 0;
  padding: 0 16px;
}

/* Layout chính */
.product-layout {
  display: flex;
  align-items: flex-start;
  gap: 50px;
  flex-wrap: wrap;
}

/* Cột ảnh */
.product-image-container {
  flex: 1 1 420px;
  display: flex;
  justify-content: center;
  min-width: 280px;
}

/* Wrapper ảnh chính */
.main-image-wrapper {
  padding: 16px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  max-width: 520px;
  width: 100%;
  box-sizing: border-box;
}

.main-image-wrapper img.main-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  border-radius: 12px;
}

/* Thumbnails */
.thumbs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.thumbs .thumb {
  width: 62px;
  height: 62px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.thumbs .thumb:hover {
  transform: translateY(-4px);
}

.thumbs .thumb.active {
  border-color: #2563eb;
  transform: translateY(-6px);
}

/* Info column */
.product-info {
  flex: 1 1 420px;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
}

/* Title / price */
.product-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.product-price {
  font-size: 1.6rem;
  color: #e53935;
  font-weight: 700;
  margin-bottom: 16px;
}

/* Attributes */
.attribute-group {
  margin-bottom: 14px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.option {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.18s ease;
  user-select: none;
  border: 1px solid transparent;
}

.option:hover {
  transform: translateY(-2px);
}

.option.active {
  background: #2563eb;
  color: #fff;
  border-color: rgba(37, 99, 235, 0.9);
}

/* 🔹 Ẩn option không hợp lệ */
.option.hidden {
  display: none !important;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.btn {
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.12s ease;
}

.btn:active {
  transform: translateY(1px);
}

.add-cart {
  background: #2563eb;
  color: #fff;
}

.add-cart:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.buy-now {
  background: #e53935;
  color: #fff;
}

.buy-now:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Quantity selector */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}

.quantity-label {
  font-weight: 600;
  color: #333;
  min-width: 100px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-qty {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-qty:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Product list */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 18px;
  margin-top: 12px;
}

/* Product card */
.product-item {
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  text-align: center;
  padding: 12px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 280px;
}

.product-item img {
  width: 100%;
  height: 140px;
  object-fit: contain;
  margin-bottom: 8px;
}

/* Responsive */
@media (max-width: 1024px) {
  .product-layout {
    gap: 30px;
  }

  .product-image-container,
  .product-info {
    flex-basis: 100%;
    max-width: 100%;
    justify-content: center;
  }

  .main-image-wrapper {
    max-width: 600px;
  }

  .product-price {
    font-size: 1.4rem;
  }
}

@media (max-width: 600px) {
  .thumbs .thumb {
    width: 52px;
    height: 52px;
  }

  .product-item img {
    height: 120px;
  }

  .product-name {
    font-size: 1.4rem;
  }
}
</style>

