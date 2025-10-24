<template>
  <div class="product-detail container mx-auto py-12 px-6">
    <div class="product-layout">
      
      <!-- CỘT ẢNH -->
      <div class="product-image-container">
        <div class="image-wrapper">
          <img :src="currentImage" alt="Product Image" class="product-image" />
        </div>
      </div>

      <!-- CỘT THÔNG TIN -->
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>

        <!-- ✅ Giá: nếu chưa chọn SKU thì hiện giá mặc định -->
        <p class="product-price">
          {{ displayPrice.toLocaleString("vi-VN") }} ₫
        </p>

        <!-- CHỌN THUỘC TÍNH -->
        <div v-if="attributes.length" class="product-attributes">
          <div
            v-for="(attrGroup, index) in attributes"
            :key="index"
            class="attribute-group"
          >
            <h3>{{ attrGroup.name }}</h3>
            <div class="options">
              <span
                v-for="option in attrGroup.values"
                :key="option"
                class="option"
                :class="{ active: selectedAttributes[attrGroup.name] === option }"
                @click="selectAttribute(attrGroup.name, option)"
              >
                {{ option }}
              </span>
            </div>
          </div>
        </div>

        <p v-if="selectedSku?.quantity">
          Số lượng còn lại: <strong>{{ selectedSku.quantity }}</strong>
        </p>

        <!-- NÚT -->
        <div class="button-group">
          <button class="btn add-cart" :disabled="!hasStock" @click="addToCart">
            🛒 Thêm vào giỏ hàng
          </button>
          <button class="btn buy-now" :disabled="!hasStock">
            💳 Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

const route = useRoute();
const product = ref({});
const attributes = ref([]);
const selectedAttributes = ref({});
const selectedSku = ref(null);
const currentImage = ref("");

// 🟢 Lấy dữ liệu sản phẩm
onMounted(async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/product/${route.params.id}`
    );
    product.value = res.data;
    currentImage.value = product.value.image;

    // Xử lý nhóm thuộc tính
    if (product.value.skus && product.value.skus.length > 0) {
      const attrMap = {};
      product.value.skus.forEach((sku) => {
        sku.skuAttributes?.forEach((attr) => {
          if (!attrMap[attr.optionAttributeName]) {
            attrMap[attr.optionAttributeName] = new Set();
          }
          attrMap[attr.optionAttributeName].add(attr.valueAttributeName);
        });
      });
      attributes.value = Object.entries(attrMap).map(([name, values]) => ({
        name,
        values: Array.from(values),
      }));
    }
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
});

// 🟡 Khi chọn thuộc tính
const selectAttribute = (name, value) => {
  selectedAttributes.value[name] = value;
  updateSelectedSku();
};

// 🔵 Cập nhật SKU khi chọn đủ
const updateSelectedSku = () => {
  const chosen = product.value.skus?.find((sku) =>
    sku.skuAttributes.every(
      (attr) =>
        selectedAttributes.value[attr.optionAttributeName] ===
        attr.valueAttributeName
    )
  );
  if (chosen) {
    selectedSku.value = chosen;
    currentImage.value = chosen.skuImages?.[0]?.path || product.value.image;
  }
};

// 🟣 Giá hiển thị — nếu chưa chọn SKU thì lấy giá mặc định
const displayPrice = computed(() => {
  // Nếu đã chọn SKU
  if (selectedSku.value && selectedSku.value.price) {
    return selectedSku.value.price;
  }

  // Nếu có giá mặc định trong product
  if (product.value.price) {
    return product.value.price;
  }

  // Nếu không có product.price thì lấy giá SKU đầu tiên (nếu có)
  if (product.value.skus && product.value.skus.length > 0) {
    return product.value.skus[0].price || 0;
  }

  // Nếu vẫn không có thì trả 0
  return 0;
});

// 🟢 Kiểm tra còn hàng
const hasStock = computed(() => {
  if (selectedSku.value) return selectedSku.value.quantity > 0;
  return true; // chưa chọn thì vẫn cho thêm
});

// 🛒 Thêm vào giỏ hàng
const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const skuId = selectedSku.value?.id || product.value.id;
  const existingItem = cart.find((item) => item.skuId === skuId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      skuId,
      name: product.value.name,
      price: displayPrice.value,
      image: currentImage.value,
      quantity: 1,
      attributes: selectedAttributes.value,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  Swal.fire({
    icon: "success",
    title: "Đã thêm vào giỏ hàng!",
    showConfirmButton: false,
    timer: 1200,
  });
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin-top: 100px;
}
.product-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
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
</style>
