<template>
  <div class="container mt-5" v-if="sku">
    <div class="row">
      <div class="col-md-6 ">
        <img :src="sku.image" class="img-fluid border rounded" @error="onImgError" />
      </div>
      
      <div class="col-md-6">
        
        <h2>{{ sku.productName }}</h2>
        <p class="price">Giá: {{ sku.price.toLocaleString() }} VNĐ</p>
        <ul>
          <li v-for="(attr, index) in sku.attributes" :key="index">
            {{ attr.optionAttributeName }}: {{ attr.attributeValue }}
          </li>
        </ul>



     
          <div class="mt-3">
            <label class="form-label">Số lượng:</label>
            <div class="quantity-input">
              <button class="btn-qty" @click="decreaseQuantity">−</button>
              <input
                type="text"
                v-model="quantity"
                min="1"
                class="form-control text-center"
                disabled
              />
              <button class="btn-qty" @click="increaseQuantity">+</button>
            </div>
            <div class="mt-1 text-danger" v-if="errorMessage">{{ errorMessage }}</div>
          </div>




        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-success w-50" @click="addToCart(sku)">
            <i class="bi bi-cart-plus"></i> Thêm vào giỏ
          </button>
          <button class="btn btn-primary w-50" @click="goToCheckout()">
            <i class="bi bi-credit-card"></i> Mua hàng
          </button>
        </div>
      </div>

    </div>
    <!-- Mô tả sản phẩm -->
    <div class="mt-3">
      <p class="description" v-if="sku.discriptione" v-html="sku.discriptione"></p>
    </div>

  </div>
</template>



<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const errorMessage = ref("");
const sku = ref(null);
const skuId = route.params.skuId;
const quantity = ref(1);

const increaseQuantity = () => {
 
  if(quantity.value < sku.value.quantity){
    quantity.value++;
     errorMessage.value = "";
  }else{
    console.log(sku.value.quantity)
     errorMessage.value = "Số lượng vượt quá số lượng trong kho!";
  }

};

const decreaseQuantity = () => {
  if (quantity.value > 1){
   quantity.value-- ;
   errorMessage.value = "";
  }
};

const onImgError = (e) => {
  e.target.src = "data:image/svg+xml;utf8,<svg ... />";
};

const fetchSku = async () => {
  const res = await axios.get(`http://localhost:8080/api/sku/${skuId}`);
  sku.value = res.data;
};

onMounted(fetchSku);


const addToCart = async (sku) => {
  const accountId = sessionStorage.getItem('accountId');

  const payload = {
    accountId: accountId,
    skuId: sku.id,
    quantity: quantity.value
  };

  try {
    const res = await axios.post("http://localhost:8080/api/cart", payload);
    alert("Đã thêm vào giỏ hàng!");
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    alert("Thêm giỏ hàng thất bại!");
  }
};

const goToCheckout = () => {
  addToCart(sku.value);
  router.push("/thanhtoan");
};
</script>

<style scoped>

.quantity-input {
  display: flex;
  align-items: center;
  width: 150px;
  
}

.quantity-input input {
  width: 60px;
  text-align: center;
  border-radius: 0;
   border: 1px #ccc solid;
  border-left: none;
  border-right: none;
  background-color: white;
 
}

.quantity-input .btn-qty {
  background-color: #eee;
  border: 1px solid #ccc;
  width: 36px;
  height: 38px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  background-color: white;
}

.quantity-input .btn-qty:hover {
  background-color: #ddd;
}

.description {
  background-color: #fefefe;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #c9c9c9;
  line-height: 1.6;
  white-space: pre-line;
}
img {
  max-height: 400px;
  object-fit: contain;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
}

h2 {
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
}

ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1rem;
}

ul li {
  padding: 6px 0;
  font-size: 1rem;
  color: #444;
  border-bottom: 1px dashed #ccc;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 1rem;
}


button i {
  margin-right: 5px;
}

.btn {
  font-size: 1rem;
  padding: 10px;
}
</style>

