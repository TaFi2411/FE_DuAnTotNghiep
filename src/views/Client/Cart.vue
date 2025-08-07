<template>
  <div class="container mt-5">
    <h2>Giỏ hàng</h2>
    <div v-if="cart.length === 0">
      <p>Giỏ hàng của bạn đang trống.</p>
    </div>
    <div v-else>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th><input type="checkbox" @change="toggleAll" :checked="allSelected" /></th>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Thuộc tính</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="item.id">
            <td>
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item"
              />
            </td>
            <td>
              <img :src="item.image" alt="image" style="height: 60px" />
            </td>
            <td>{{ item.productName }}</td>
            <td>
              <ul class="m-0 p-0" style="list-style: none;">
                <li v-for="(attr, i) in item.attributes || []" :key="i">
                  {{ attr.optionAttributeName }}: {{ attr.attributeValue }}
                </li>
              </ul>
            </td>
            <td>{{ item.price.toLocaleString() }} VNĐ</td>
            <td>
              <input
                type="number"
                v-model.number="item.quantity"
                @change="updateCart(item)"
                min="1"
                class="form-control"
                style="width: 80px"
              />
            </td>
            <td>{{ (item.price * item.quantity).toLocaleString() }} VNĐ</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="removeItem(index)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h4 class="text-end">
        Tổng cộng: {{ selectedTotal.toLocaleString() }} đ
      </h4>

      <div class="text-end mt-3">
        <button class="btn btn-primary" @click="goToCheckout" :disabled="selectedItems.length === 0">
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const cart = ref([]);
const selectedItems = ref([]);
const router = useRouter();

onMounted(async () => {
  const accountId = sessionStorage.getItem("accountId");
  if (!accountId) {
    alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi xem giỏ hàng.");
    router.push("/dangnhap");
    return;
  }

  try {
    const res = await axios.get(`http://localhost:8080/api/cart/account/${accountId}`);
    cart.value = res.data;
    console.log("Dữ liệu giỏ hàng từ API:", res.data);
  } catch (error) {
    console.error("Không thể lấy giỏ hàng từ CSDL:", error);
  }
});

const updateCart = async (item) => {
  try {
    if (item.id) {
      await axios.put(`http://localhost:8080/api/cart/${item.id}`, {
        quantity: item.quantity,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart.value));
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    alert("Cập nhật giỏ hàng thất bại!");
  }
};

const removeItem = async (index) => {
  const item = cart.value[index];

  if (!item.id) {
    alert("Không tìm thấy cartId để xóa!");
    console.error("Không có cartId:", item);
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/api/cart/${item.id}`);
    cart.value.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart.value));

    selectedItems.value = selectedItems.value.filter((i) => i.id !== item.id);
  } catch (error) {
    console.error("Lỗi khi xóa khỏi CSDL:", error);
    alert("Không thể xóa khỏi CSDL!");
  }
};

const selectedTotal = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const allSelected = computed(() =>
  cart.value.length > 0 && selectedItems.value.length === cart.value.length
);

const toggleAll = () => {
  if (allSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = [...cart.value];
  }
};

const goToCheckout = () => {
  sessionStorage.setItem("selectedCartItems", JSON.stringify(selectedItems.value));
  router.push("/thanhtoan");
};
</script>
