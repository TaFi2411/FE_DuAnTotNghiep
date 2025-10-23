<template>
  <div v-if="product" class="product-detail container py-4">
    <!-- Tên sản phẩm -->
    <h2 class="text-2xl font-bold mb-3">{{ product.name }}</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Hình ảnh -->
      <div>
        <img
          :src="currentImage"
          alt="product image"
          class="rounded-xl shadow-lg w-full object-cover"
        />
        <div class="flex gap-2 mt-3">
          <img
            v-for="(img, i) in selectedSku?.skuImages"
            :key="i"
            :src="img.path"
            class="w-20 h-20 rounded-lg cursor-pointer border hover:border-blue-500"
            @click="currentImage = img.path"
          />
        </div>
      </div>

      <!-- Thông tin -->
      <div>
        <p class="text-gray-600 mb-2">{{ product.description }}</p>
        <h3 class="text-xl font-semibold text-red-600">
          {{ selectedSku?.price?.toLocaleString() }}₫
        </h3>
        <p class="text-sm text-gray-500 mb-3">
          Số lượng: {{ selectedSku?.quantity }}
        </p>

        <!-- Thuộc tính (VD: Màu sắc, Dung lượng) -->
        <div v-for="(values, option) in groupedAttributes" :key="option" class="mb-3">
          <h4 class="font-semibold">{{ option }}:</h4>
          <div class="flex gap-2 mt-1">
            <button
              v-for="value in values"
              :key="value"
              :class="[
                'px-3 py-1 rounded-lg border',
                selectedAttributes[option] === value ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              ]"
              @click="selectAttribute(option, value)"
            >
              {{ value }}
            </button>
          </div>
        </div>

        <!-- Nút thêm giỏ hàng -->
        <button
          class="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          :disabled="!selectedSku"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-10">Đang tải sản phẩm...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const slug = route.params.slug

const product = ref(null)
const selectedSku = ref(null)
const selectedAttributes = ref({})
const currentImage = ref('')

// ✅ Lấy dữ liệu sản phẩm theo slug
onMounted(async () => {
  const res = await axios.get(`http://localhost:8080/api/products/${id}`)
  product.value = res.data

  // Chọn SKU có giá thấp nhất làm mặc định
  selectedSku.value = product.value.skus.reduce((min, s) =>
    s.price < min.price ? s : min
  )
  currentImage.value = selectedSku.value.skuImages[0]?.path

  // Gán thuộc tính mặc định tương ứng SKU
  selectedSku.value.skuAttributes.forEach(attr => {
    selectedAttributes.value[attr.optionAttributeName] = attr.valueAttributeName
  })
})

// ✅ Gom các thuộc tính (Màu sắc, Dung lượng, ...)
const groupedAttributes = computed(() => {
  if (!product.value) return {}
  const groups = {}
  product.value.skus.forEach(sku => {
    sku.skuAttributes.forEach(attr => {
      if (!groups[attr.optionAttributeName]) groups[attr.optionAttributeName] = new Set()
      groups[attr.optionAttributeName].add(attr.valueAttributeName)
    })
  })
  // Chuyển từ Set → Array để dễ v-for
  for (let key in groups) {
    groups[key] = Array.from(groups[key])
  }
  return groups
})

// ✅ Khi chọn thuộc tính
function selectAttribute(option, value) {
  selectedAttributes.value[option] = value
  updateSelectedSku()
}

// ✅ Cập nhật SKU tương ứng khi chọn thuộc tính
function updateSelectedSku() {
  if (!product.value) return

  // Tìm SKU khớp tất cả thuộc tính
  const found = product.value.skus.find(sku => {
    return sku.skuAttributes.every(attr =>
      selectedAttributes.value[attr.optionAttributeName] === attr.valueAttributeName
    )
  })

  if (found) {
    selectedSku.value = found
    currentImage.value = found.skuImages[0]?.path
  }
}
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
