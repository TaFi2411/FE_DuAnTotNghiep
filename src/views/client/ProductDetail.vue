<template>
<<<<<<< HEAD
  <div class="product-detail container py-5 mt-5">
    <!-- --- PHẦN TRÊN: ẢNH & THÔNG TIN --- -->
    <div class="row align-items-start g-5">
      <!-- Ảnh chính -->
      <div class="col-lg-6 col-md-12 text-center">
        <div class="main-image-wrapper p-4 bg-white rounded-4 shadow-sm">
          <img
            src="/images/crs-ip17-air.png"
            alt="iPhone 17 Pro Max"
            class="img-fluid rounded-3 main-image"
          />
        </div>
        <div class="thumbs d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <img
            src="/images/crs-ip17-air.png"
            class="thumb active"
            alt="thumb"
          />
          <img src="/images/crs-ip17-air.png" class="thumb" alt="thumb" />
          <img src="/images/crs-ip17-air.png" class="thumb" alt="thumb" />
=======
  <div class="product-detail container mx-auto py-12 px-6">
    <div class="product-layout">
      <!-- CỘT ẢNH -->
      <div class="product-image-container">
        <div class="image-wrapper">
          <img :src="currentImage" alt="Product Image" class="product-image" />
>>>>>>> d4a91aaeda8ed394a77d65474e89dca61488cbad
        </div>
      </div>

      <!-- CỘT THÔNG TIN -->
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>

        <!-- Giá hiển thị -->
        <p class="product-price">
          {{ displayPrice.toLocaleString("vi-VN") }} ₫
        </p>

        <!-- CHỌN THUỘC TÍNH -->
        <div v-for="(attrGroup, index) in attributes" :key="index" class="attribute-group">
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
            <button class="btn-qty" @click="decreaseQuantity" :disabled="quantity <= 1">➖</button>
            <input type="number" class="quantity-input" v-model="quantity" readonly />
            <button class="btn-qty" @click="increaseQuantity" :disabled="quantity >= selectedSku.quantity">➕</button>
          </div>
        </div>

<<<<<<< HEAD
        <!-- Nút hành động -->
        <div class="d-flex flex-wrap gap-3 mt-4">
          <button class="btn btn-dark px-5 py-2 rounded-pill">Mua ngay</button>
          <button class="btn btn-outline-dark px-5 py-2 rounded-pill">
            Thêm vào giỏ
=======
        <!-- Số lượng còn lại -->
        <p v-if="selectedSku">
          Số lượng còn lại: <strong>{{ selectedSku.quantity }}</strong>
        </p>

        <!-- NÚT -->
        <div class="button-group">
          <button class="btn add-cart" :disabled="!hasStock" @click="addToCart">
            🛒 Thêm vào giỏ hàng
          </button>
          <button class="btn buy-now" :disabled="!hasStock" @click="buyNow">
            💳 Thanh toán ngay
>>>>>>> d4a91aaeda8ed394a77d65474e89dca61488cbad
          </button>
        </div>
      </div>
    </div>

<<<<<<< HEAD
    <!-- --- PHẦN DƯỚI: MÔ TẢ & ĐÁNH GIÁ --- -->
    <div class="product-info mt-5 bg-white rounded-4 shadow-sm p-4">
      <!-- Mô tả -->
      <h4 class="fw-bold mb-3">Mô tả sản phẩm</h4>
      <p class="text-secondary lh-lg">
        iPhone 17 Pro Max mang đến hiệu năng mạnh mẽ nhờ chip A19 Bionic, màn
        hình Super Retina XDR ProMotion 120Hz và thiết kế titan cao cấp. Camera
        được nâng cấp với cảm biến 48MP mới, cho khả năng chụp ảnh sắc nét vượt
        trội trong mọi điều kiện ánh sáng.
      </p>

      <hr class="my-4" />

      <!-- Đánh giá -->
      <h4 class="fw-bold mb-3">Đánh giá của khách hàng (2)</h4>

      <div
        v-for="review in reviews"
        :key="review.id"
        class="card mb-3 border-0 border-bottom pb-3"
      >
        <div class="card-body p-0 ms-3 mt-3">
          <!-- Tên người dùng -->
          <h6 class="fw-semibold mb-1">{{ review.accountName }}</h6>
          <!-- Số sao -->
          <div class="text-warning mb-2">
            <i v-for="n in review.star" :key="n" class="bi bi-star-fill"></i>
          </div>
          <!-- Ngày và phân loại -->
          <div class="text-muted small mb-2">
            {{ review.orderDetail?.order?.createdDate || "Chưa có ngày" }}
            | Phân loại hàng:
            <span class="fw-semibold">
              {{
                review.orderDetail?.sku?.productVariantName || "Không xác định"
              }}
            </span>
          </div>

          <!-- Nội dung đánh giá -->
          <p class="mb-0">{{ review.description }}</p>
          <!-- nút xóa chỉ hiện nếu là người viết -->
          <button
            v-if="user && user.id === review.accountId"
            class="btn btn-outline-danger btn-sm mt-2"
            @click="confirmDelete(review.id)"
          >
            <i class="bi bi-trash"></i> Xóa
          </button>
        </div>
=======
    <hr class="my-8" />

    <!-- Các sản phẩm khác -->
    <div class="tieude">Các sản phẩm khác</div>
    <div class="container py-5">
      <div class="product-list">
        <div class="product-item" v-for="p in visibleProducts" :key="p.id">
          <div class="product-image-wrapper">
            <img :src="p.image" class="product-image" :alt="p.name" />
          </div>
          <div class="card-body">
            <h5 class="fw-bold mb-2">{{ p.name }}</h5>
            <p class="fw-semibold text-primary mb-2">
              {{ getPrice(p) ? getPrice(p).toLocaleString("vi-VN") + "₫" : "Giá: Liên hệ" }}
            </p>
            <router-link :to="`/san-pham/${p.id}`" class="btn btn-primary rounded-pill px-4 py-2">
              Mua ngay
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="visibleCount < products.length" class="text-center mt-4">
        <button class="btn btn-outline-primary px-5 py-2 rounded-pill fw-semibold" @click="loadMore">
          Xem thêm
        </button>
>>>>>>> d4a91aaeda8ed394a77d65474e89dca61488cbad
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";
import { useRouter } from "vue-router";

// 🧩 Lấy thông tin người dùng đang đăng nhập
const user = JSON.parse(localStorage.getItem("user"));
console.log("User hiện tại:", user);

// 🧩 Biến dữ liệu
const reviews = ref([]);
const currentPage = ref(0);
const totalPages = ref(1);

// ✅ Bộ lọc search + star rating
const filters = ref({
  keyword: "",
  star: "",
});

// 🧠 Hàm lấy danh sách review theo phân trang + filter
async function fetchReviews(page = 0) {
  try {
    const params = {
      page,
      keyword: filters.value.keyword,
      star: filters.value.star,
    };

    const res = await axios.get("/api/review", { params });

    const reviewList = res.data.data;

    // 🧩 Gọi thêm API order-detail cho từng review
    for (let review of reviewList) {
      try {
        const orderRes = await axios.get(
          `/api/order-detail/${review.orderDetailId}`
        );
        review.orderDetail = orderRes.data;
      } catch (err) {
        console.warn("Không lấy được orderDetail:", review.orderDetailId);
        review.orderDetail = null;
      }
    }

    reviews.value = reviewList;
    currentPage.value = res.data.currentPage;
    totalPages.value = res.data.totalPages;
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách:", err);
    alert("Không tải được danh sách review!");
  }
}

// 🧩 Chuyển trang
function changePage(page) {
  if (page >= 0 && page < totalPages.value) {
    fetchReviews(page);
  }
}

// 🧩 Xác nhận xóa
function confirmDelete(id, accountId) {
  if (!user) return alert("Bạn cần đăng nhập!");

  if (user.role !== "ADMIN" && user.id !== accountId) {
    return alert("Bạn không có quyền xóa review này!");
  }

  if (confirm("Bạn có chắc chắn muốn xóa review này không?")) {
    deleteReview(id);
  }
}

// 🧩 Gọi API xóa review
async function deleteReview(id) {
  try {
    await axios.delete(`/api/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    alert("✅ Xóa review thành công!");
    fetchReviews(currentPage.value); // load lại trang hiện tại
  } catch (error) {
    console.error(error);
    alert("❌ Xóa thất bại!");
  }
}

// 🧩 Cắt bớt mô tả dài
function truncate(text, length) {
  return text?.length > length ? text.substring(0, length) + "..." : text;
}

// 🧩 Gọi khi load trang
onMounted(() => fetchReviews());
</script>


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
.container { max-width: 1200px; margin-top: 100px; }
.product-layout { display: flex; align-items: flex-start; gap: 50px; flex-wrap: wrap; }
.product-image-container { flex: 1; max-width: 45%; display: flex; justify-content: flex-end; }
.image-wrapper { width: 100%; max-width: 420px; border-radius: 16px; overflow: hidden; background: #f9f9f9; box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
.product-image { width: 100%; height: auto; object-fit: contain; }
.product-info { flex: 1; max-width: 45%; display: flex; flex-direction: column; justify-content: flex-start; }
.product-name { font-size: 2rem; font-weight: 700; margin-bottom: 15px; }
.product-price { font-size: 1.8rem; color: #e53935; font-weight: 600; margin-bottom: 20px; }
.attribute-group { margin-bottom: 20px; }
.options { display: flex; flex-wrap: wrap; gap: 10px; }
.option { background: #f0f0f0; border-radius: 8px; padding: 6px 12px; font-size: 0.95rem; cursor: pointer; transition: 0.3s; }
.option:hover { background: #e0e0e0; }
.option.active { background: #2563eb; color: white; }
.button-group { display: flex; gap: 20px; }
.btn { flex: 1; padding: 12px 0; border-radius: 10px; border: none; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; }
.add-cart { background: #2563eb; color: white; }
.add-cart:hover { background: #1d4ed8; }
.buy-now { background: #e53935; color: white; }
.buy-now:hover { background: #c62828; }
.product-list { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
.product-item { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; text-align: center; padding: 16px; transition: transform 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; height: 340px; }
.product-item img { width: 100%; height: 180px; object-fit: contain; }
.product-item:hover { transform: translateY(-5px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
@media (max-width:1024px){.product-list{grid-template-columns:repeat(3,1fr);}}
@media (max-width:768px){.product-list{grid-template-columns:repeat(2,1fr);}}
@media (max-width:480px){.product-list{grid-template-columns:repeat(1,1fr);}}
.quantity-selector { display:flex; align-items:center; gap:12px; margin:16px 0; }
.quantity-label { font-weight:600; color:#333; min-width:100px; }
.quantity-controls { display:flex; align-items:center; gap:8px; }
.btn-qty { width:35px; height:35px; border:1px solid #ddd; background:#f9f9f9; font-size:18px; font-weight:bold; border-radius:6px; cursor:pointer; transition: all 0.2s ease; }
.btn-qty:hover:not(:disabled) { background:#007bff; color:#fff; border-color:#007bff; }
.btn-qty:disabled { opacity:0.5; cursor:not-allowed; }
.quantity-input { width:60px; text-align:center; font-weight:600; border:1px solid #ddd; border-radius:6px; padding:6px 0; }
</style>
