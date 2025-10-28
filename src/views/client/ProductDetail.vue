<template>
  <div class="product-detail container py-5 mt-5">
    <!-- --- PHẦN TRÊN: ẢNH & THÔNG TIN --- -->
    <div class="row align-items-start g-5">
      <!-- Ảnh chính -->
      <div class="col-lg-6 col-md-12 text-center">
        <div class="main-image-wrapper p-4 bg-white rounded-4 shadow-sm">
          <img
            :src="currentImage || '/images/crs-ip17-air.png'"
            alt="iPhone 17 Pro Max"
            class="img-fluid rounded-3 main-image"
          />
        </div>

        <!-- thumbnail -->
        <div class="thumbs d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <img src="/images/crs-ip17-air.png" class="thumb active" alt="thumb" />
          <img src="/images/crs-ip17-air.png" class="thumb" alt="thumb" />
          <img src="/images/crs-ip17-air.png" class="thumb" alt="thumb" />
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
            class="attribute-group"
          >
            <div class="options">
              <span
                v-for="option in availableOptions[attrGroup.name] || []"
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
      <p class="text-secondary lh-lg">
        iPhone 17 Pro Max mang đến hiệu năng mạnh mẽ nhờ chip A19 Bionic, màn
        hình Super Retina XDR ProMotion 120Hz và thiết kế titan cao cấp.
      </p>

      <hr class="my-4" />

      <h4 class="fw-bold mb-3">Đánh giá của khách hàng (2)</h4>

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
          <div class="text-muted small mb-2">
            {{ review.orderDetail?.order?.createdDate || "Chưa có ngày" }} |
            Phân loại hàng:
            <span class="fw-semibold">
              {{ review.orderDetail?.sku?.productVariantName || "Không xác định" }}
            </span>
          </div>
          <p class="mb-0">{{ review.description }}</p>
          <button
            v-if="user && user.id === review.accountId"
            class="btn btn-outline-danger btn-sm mt-2"
            @click="confirmDelete(review.id)"
          >
            <i class="bi bi-trash"></i> Xóa
          </button>
        </div>
      </div>

      <hr class="my-4" />

      <!-- CÁC SẢN PHẨM KHÁC -->
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
import { ref, onMounted, computed, watch } from "vue";
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
const products = ref([]);
const quantity = ref(1);
const visibleCount = ref(10);

// --- Load chi tiết sản phẩm ---
const loadProductDetail = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/product/${route.params.id}`);
    product.value = res.data;
    currentImage.value = product.value.image;

    // Gom tất cả thuộc tính
    const attrMap = {};
    product.value.skus?.forEach(sku => {
      sku.skuAttributes?.forEach(attr => {
        if (!attrMap[attr.optionAttributeName]) attrMap[attr.optionAttributeName] = new Set();
        attrMap[attr.optionAttributeName].add(attr.valueAttributeName);
      });
    });
    attributes.value = Object.entries(attrMap).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));

    // Reset selection
    selectedAttributes.value = {};
    selectedSku.value = null;
    quantity.value = 1;
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
};

// --- Load danh sách sản phẩm khác ---
const loadAllProducts = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/product");
    products.value = res.data.data || [];
  } catch (err) {
    console.error("Lỗi khi tải danh sách sản phẩm:", err);
  }
};

// --- Chọn thuộc tính ---
const selectAttribute = (name, value) => {
  selectedAttributes.value[name] = value;

  // Loại bỏ các lựa chọn không còn hợp lệ
  Object.keys(selectedAttributes.value).forEach(key => {
    if (!availableOptions.value[key]?.includes(selectedAttributes.value[key])) {
      delete selectedAttributes.value[key];
    }
  });

  updateSelectedSku();
};

// --- Cập nhật SKU khi chọn đủ thuộc tính ---
const updateSelectedSku = () => {
  const keys = Object.keys(selectedAttributes.value);
  selectedSku.value = product.value.skus?.find(sku =>
    keys.every(key => sku.skuAttributes.find(a => a.optionAttributeName === key && a.valueAttributeName === selectedAttributes.value[key]))
  ) || null;

  if (selectedSku.value) {
    currentImage.value = selectedSku.value.skuImages?.[0]?.path || product.value.image;
    quantity.value = 1;
  }
};

// --- Tính giá hiển thị ---
const displayPrice = computed(() => {
  if (selectedSku.value?.price) return selectedSku.value.price;
  if (product.value.price) return product.value.price;
  if (product.value.skus?.length) return product.value.skus[0].price || 0;
  return 0;
});

// --- Kiểm tra còn hàng ---
const hasStock = computed(() => selectedSku.value?.quantity > 0);

// --- Thêm vào giỏ hàng ---
const addToCart = () => {
  const requiredAttrs = attributes.value.map(a => a.name);
  const isComplete = requiredAttrs.every(attr => selectedAttributes.value[attr]);
  if (!isComplete) {
    Swal.fire({
      icon: "warning",
      title: "Thiếu thuộc tính!",
      text: "Vui lòng chọn đầy đủ trước khi thêm vào giỏ hàng.",
      confirmButtonText: "OK",
    });
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const skuId = selectedSku.value?.id || product.value.id;
  const existingItem = cart.find(item => item.skuId === skuId);

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity.value, selectedSku.value.quantity);
  } else {
    cart.push({
      skuId,
      name: product.value.name,
      price: displayPrice.value,
      image: currentImage.value,
      quantity: quantity.value,
      stock: selectedSku.value?.quantity || product.value.quantity || 0,
      attributes: { ...selectedAttributes.value },
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  Swal.fire({ icon: "success", title: "Đã thêm vào giỏ hàng!", showConfirmButton: false, timer: 1200 });
};

// --- Mua ngay ---
const buyNow = () => {
  const requiredAttrs = attributes.value.map(a => a.name);
  const isComplete = requiredAttrs.every(attr => selectedAttributes.value[attr]);
  if (!isComplete) {
    Swal.fire({
      icon: "warning",
      title: "Thiếu thuộc tính!",
      text: "Vui lòng chọn đầy đủ trước khi mua hàng.",
      confirmButtonText: "OK",
    });
    return;
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

// --- Giá sản phẩm ---
const getPrice = (p) => {
  if (!p.skus || p.skus.length === 0) return null;
  const skuWithPrice = p.skus.find(sku => sku.price > 0);
  return skuWithPrice ? skuWithPrice.price : null;
};

// --- Xem thêm sản phẩm ---
const visibleProducts = computed(() => products.value.slice(0, visibleCount.value));
const loadMore = () => (visibleCount.value += 10);

// --- Tăng / giảm số lượng ---
const increaseQuantity = () => {
  if (selectedSku.value && quantity.value < selectedSku.value.quantity) quantity.value++;
};
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// --- Tính các option khả dụng dynamic ---
const availableOptions = computed(() => {
  const map = {};
  if (!product.value.skus) return map;

  const selectedKeys = Object.keys(selectedAttributes.value);

  product.value.skus.forEach(sku => {
    const match = selectedKeys.every(key => {
      const attr = sku.skuAttributes.find(a => a.optionAttributeName === key);
      return attr && attr.valueAttributeName === selectedAttributes.value[key];
    });

    if (match) {
      sku.skuAttributes.forEach(attr => {
        if (!map[attr.optionAttributeName]) map[attr.optionAttributeName] = new Set();
        map[attr.optionAttributeName].add(attr.valueAttributeName);
      });
    }
  });

  Object.keys(map).forEach(key => {
    map[key] = Array.from(map[key]);
  });

  return map;
});

// --- Lifecycle ---
onMounted(async () => {
  await loadProductDetail();
  await loadAllProducts();
});

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await loadProductDetail();
      window.scrollTo(0, 0);
    }
  }
);
</script>

<style scoped>
/* --- CSS giống bạn gửi trước --- */
.container {
  max-width: 1200px;
  margin-top: 100px;
}

.product-layout {
  display: flex;
  align-items: flex-start;
  gap: 50px;
  flex-wrap: wrap;
}

.product-image-container {
  flex: 1;
  max-width: 45%;
  display: flex;
  justify-content: flex-end;
}

.image-wrapper {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  overflow: hidden;
  background: #f9f9f9;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.product-info {
  flex: 1;
  max-width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.product-price {
  font-size: 1.8rem;
  color: #e53935;
  font-weight: 600;
  margin-bottom: 20px;
}

.attribute-group {
  margin-bottom: 20px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.option {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: 0.3s;
}

.option:hover {
  background: #e0e0e0;
}

.option.active {
  background: #2563eb;
  color: white;
}

.button-group {
  display: flex;
  gap: 20px;
}

.btn {
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-cart {
  background: #2563eb;
  color: white;
}

.add-cart:hover {
  background: #1d4ed8;
}

.buy-now {
  background: #e53935;
  color: white;
}

.buy-now:hover {
  background: #c62828;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.product-item {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  text-align: center;
  padding: 16px;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 340px;
}

.product-item img {
  width: 100%;
  height: 180px;
  object-fit: contain;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width:1024px) {
  .product-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width:768px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width:480px) {
  .product-list {
    grid-template-columns: repeat(1, 1fr);
  }
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
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
  width: 35px;
  height: 35px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  font-size: 18px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-qty:hover:not(:disabled) {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}

.btn-qty:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  text-align: center;
  font-weight: 600;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 0;
}
</style>
