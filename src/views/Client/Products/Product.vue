<template>
  <div class="container py-4">
    <ul class="nav nav-tabs mb-4 justify-content-center">
      <li class="nav-item" v-for="tab in tabs" :key="tab">
        <button
          class="nav-link"
          :class="{ active: currentTab === tab }"
          @click="currentTab = tab"
        >
          {{ tab }}
        </button>
      </li>
    </ul>

    <div class="row g-4">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="item in filteredSkus"
        :key="item.id"
      >
        <div class="card h-100">
          <img
            class="table-img"
            :src="firstImage(item)"
            :alt="item.productName"
            @error="onImgError"
          />
          <div class="card-body">
            <h5 class="card-title text-center">{{ item.productName }}</h5>

            <ul class="text-center" style="list-style: none; padding: 0; margin: 0;">
              <li v-for="(attr, index) in item.attributes" :key="index">
                {{ attr.optionAttributeName }}: {{ attr.attributeValue }}
              </li>
            </ul>

            <h5 class="text-center text-danger">
              {{ item.price.toLocaleString() }} VNĐ
            </h5>

            <div class="text-center">
              <button class="btn btn-primary" @click="goToProductDetail(item.id)">
                Mua hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const SKU_API = "http://localhost:8080/api/sku";

const skus = ref([]);

const tabs = ["Tất cả", "iPhone", "Macbook", "iPad", "Tai Nghe", "Apple Watch"];
const currentTab = ref("Tất cả");

const placeholderDataUrl =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
      <rect width='100%' height='100%' fill='#eee'/>
      <text x='50%' y='50%' font-size='10' fill='#888' text-anchor='middle' dominant-baseline='central'>No Image</text>
    </svg>`
  );

const onImgError = (e) => {
  e.target.src = placeholderDataUrl;
};

const firstImage = (sku) => sku?.image || placeholderDataUrl;

const fetchSkus = async () => {
  try {
    const res = await axios.get(SKU_API);
    skus.value = (res.data || []).sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error("Lỗi khi fetch danh sách SKU", err);
  }
};

const goToProductDetail = (skuId) => {
  router.push(`/sanpham/chitietsanpham/${skuId}`);
};

// Lọc sản phẩm theo tab
const filteredSkus = computed(() => {
  if (currentTab.value === "Tất cả") return skus.value;
  return skus.value.filter((item) =>
    item.productName?.toLowerCase()?.includes(currentTab.value.toLowerCase())
  );
});

onMounted(fetchSkus);
</script>

<style scoped>
/* TAB NAVIGATION */
.nav-tabs {
  border-bottom: 2px solid #dee2e6;
}

.nav-tabs .nav-link {
  color: #495057;
  font-weight: 500;
  border: none;
  padding: 10px 20px;
  margin-right: 5px;
  transition: all 0.3s ease;
  border-radius: 5px 5px 0 0;
}

.nav-tabs .nav-link.active {
  background-color: #007bff;
  color: white;
  font-weight: 600;
}

/* PRODUCT CARD */
.card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.card .card-body {
  padding: 15px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.table-img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 10px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

/* ATTRIBUTE LIST */
.card ul {
  font-size: 0.9rem;
  color: #555;
}

/* PRICE */
.card .text-danger {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 10px;
}

/* BUTTON */
.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 8px 16px;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* RESPONSIVE FIX */
@media (max-width: 576px) {
  .card .table-img {
    height: 150px;
  }
}
</style>


