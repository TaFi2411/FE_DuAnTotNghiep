<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Quản lý Flash Sale SKU</h3>
      <button class="btn btn-outline-primary" @click="goToFlashSaleAdmin">
        <i class="bi bi-arrow-left"></i> Quản lý Flash Sale
      </button>
    </div>

    <!-- Form thêm/sửa SKU -->
    <div class="card mb-4">
      <div class="card-header fw-bold">
        {{ editModeSku ? "Cập nhật Flash Sale SKU" : "Thêm Flash Sale SKU mới" }}
      </div>
      <div class="card-body">
        <form @submit.prevent="editModeSku ? updateSku() : createSku()">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">Flash Sale</label>
              <select v-model="skuForm.flashSaleId" class="form-select">
                <option value="">-- Chọn Flash Sale --</option>
                <option v-for="f in flashSales" :key="f.id" :value="f.id">
                  {{ f.title }}
                </option>
              </select>
              <small class="text-danger" v-if="skuErrors.flashSaleId">{{ skuErrors.flashSaleId }}</small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">SKU</label>
              <select v-model="skuForm.skuId" class="form-select">
                <option value="">-- Chọn SKU --</option>
                <option v-for="s in skus" :key="s.id" :value="s.id">
                  {{ s.id }} - {{ s.productName }}
                </option>
              </select>
              <small class="text-danger" v-if="skuErrors.skuId">{{ skuErrors.skuId }}</small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Giảm giá (%)</label>
              <input
                v-model.number="skuForm.discount"
                type="number"
                class="form-control"
                @blur="validateDiscount"
              />
              <small class="text-danger" v-if="skuErrors.discount">{{ skuErrors.discount }}</small>
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Số lượng</label>
              <input
                v-model.number="skuForm.quantity"
                type="number"
                class="form-control"
                @blur="validateQuantity"
              />
              <small class="text-danger" v-if="skuErrors.quantity">{{ skuErrors.quantity }}</small>
            </div>
          </div>

          <button type="submit" class="btn btn-primary me-2">
            {{ editModeSku ? "Cập nhật" : "Thêm mới" }}
          </button>
          <button v-if="editModeSku" type="button" class="btn btn-secondary" @click="cancelEditSku">
            Hủy
          </button>
        </form>
      </div>
    </div>

    <!-- Danh sách Flash Sale SKU -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="skuList"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true, placeholder: 'Tìm kiếm Flash Sale SKU...' }"
        theme="polar-bear"
      >
        <template #table-row="props">
          <!-- Flash Sale -->
          <span v-if="props.column.field === 'flashSaleId'">
            {{ getFlashSaleName(props.row.flashSaleId) }}
          </span>

          <!-- SKU -->
          <span v-else-if="props.column.field === 'skuId'">
            {{ getSkuName(props.row.skuId) }}
          </span>

          <!-- Hành động -->
          <span v-else-if="props.column.field === 'actions'">
            <button class="btn btn-outline-warning btn-sm me-1" @click="editSku(props.row)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteSku(props.row.id)">
              <i class="bi bi-trash"></i>
            </button>
          </span>

          <!-- Cột mặc định -->
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "@/composables/axios.js"
import Swal from "sweetalert2"
import "vue-good-table-next/dist/vue-good-table-next.css"

const router = useRouter()
const flashSales = ref([])
const skus = ref([])
const skuList = ref([])
const loading = ref(false)
const editModeSku = ref(false)

const skuForm = reactive({
  id: null,
  flashSaleId: "",
  skuId: "",
  discount: "",
  quantity: "",
})

const skuErrors = reactive({
  flashSaleId: "",
  skuId: "",
  discount: "",
  quantity: "",
})

// ⚙️ Cột bảng
const columns = ref([
  { label: "ID", field: "id", width: "80px" },
  { label: "Flash Sale", field: "flashSaleName" }, // tìm kiếm theo tên Flash Sale
  { label: "SKU", field: "skuName" },             // tìm kiếm theo tên SKU
  { label: "Giảm giá (%)", field: "discount" },
  { label: "Số lượng", field: "quantity" },
  { label: "Hành động", field: "actions", width: "130px" },
])


// 📄 Phân trang frontend
const paginationOptions = ref({
  enabled: true,
  perPage: 10,
  perPageDropdown: [5, 10, 20, 50],
  nextLabel: "Trang sau",
  prevLabel: "Trang trước",
})

// 🔄 Fetch dữ liệu
async function fetchFlashSales() {
  const res = await axios.get("/api/flash-sale")
  flashSales.value = res.data.data || res.data.content || res.data || []
}

async function fetchSkus() {
  const res = await axios.get("/api/sku")
  skus.value = res.data.data || res.data.content || res.data || []
}

async function fetchFlashSaleSku() {
  loading.value = true
  try {
    const res = await axios.get("/api/flash-sale-sku")
    const list = res.data.data || res.data.content || res.data || []

    // Thêm tên hiển thị cho Flash Sale và SKU
    skuList.value = list.map(sku => ({
      ...sku,
      flashSaleName: getFlashSaleName(sku.flashSaleId),
      skuName: getSkuName(sku.skuId),
    }))
  } catch (err) {
    Swal.fire("Lỗi", "Không thể tải danh sách SKU!", "error")
  } finally {
    loading.value = false
  }
}


// ✅ Validate
function validateDiscount() {
  if (skuForm.discount === "" || skuForm.discount === null) {
    skuErrors.discount = "Vui lòng nhập giảm giá"
    return false
  }
  const d = Number(skuForm.discount)
  if (isNaN(d) || d < 0 || d > 100) {
    skuErrors.discount = "Giảm giá phải trong khoảng 0 - 100%"
    return false
  }

  const flashSale = flashSales.value.find((f) => f.id === Number(skuForm.flashSaleId))
  if (flashSale && d > Number(flashSale.discount)) {
    skuErrors.discount = `Giảm giá SKU (${d}%) không được vượt quá Flash Sale (${flashSale.discount}%)`
    return false
  }

  skuErrors.discount = ""
  return true
}

function validateQuantity() {
  if (skuForm.quantity === "" || skuForm.quantity === null) {
    skuErrors.quantity = "Vui lòng nhập số lượng"
    return false
  }
  const q = Number(skuForm.quantity)
  if (isNaN(q) || q <= 0) {
    skuErrors.quantity = "Số lượng phải lớn hơn 0"
    return false
  }

  const sku = skus.value.find((s) => s.id === Number(skuForm.skuId))
  if (sku && q > Number(sku.quantity)) {
    skuErrors.quantity = `Số lượng SKU (${q}) không được vượt quá tồn kho (${sku.quantity})`
    return false
  }

  skuErrors.quantity = ""
  return true
}

function validateSku() {
  skuErrors.flashSaleId = skuForm.flashSaleId ? "" : "Vui lòng chọn Flash Sale"
  skuErrors.skuId = skuForm.skuId ? "" : "Vui lòng chọn SKU"

  const valid = validateDiscount() && validateQuantity() && !skuErrors.flashSaleId && !skuErrors.skuId
  return valid
}

// 🧱 CRUD
async function createSku() {
  if (!validateSku()) return Swal.fire("Lỗi", "Form chưa hợp lệ!", "warning")

  try {
    await axios.post("/api/flash-sale-sku", {
      flashSaleId: Number(skuForm.flashSaleId),
      skuId: Number(skuForm.skuId),
      discount: Number(skuForm.discount),
      quantity: Number(skuForm.quantity),
    })
    Swal.fire("Thành công", "Thêm SKU thành công!", "success")
    await fetchFlashSaleSku()
    cancelEditSku()
  } catch {
    Swal.fire("Lỗi", "Không thể thêm SKU!", "error")
  }
}

async function updateSku() {
  if (!validateSku()) return Swal.fire("Lỗi", "Form chưa hợp lệ!", "warning")

  try {
    await axios.put(`/api/flash-sale-sku/${skuForm.id}`, {
      flashSaleId: Number(skuForm.flashSaleId),
      skuId: Number(skuForm.skuId),
      discount: Number(skuForm.discount),
      quantity: Number(skuForm.quantity),
    })
    Swal.fire("Thành công", "Cập nhật SKU thành công!", "success")
    await fetchFlashSaleSku()
    cancelEditSku()
  } catch {
    Swal.fire("Lỗi", "Không thể cập nhật SKU!", "error")
  }
}

async function deleteSku(id) {
  const confirm = await Swal.fire({
    title: "Xóa SKU?",
    text: "Bạn có chắc muốn xóa SKU này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  })
  if (!confirm.isConfirmed) return

  try {
    await axios.delete(`/api/flash-sale-sku/${id}`)
    Swal.fire("Đã xóa!", "SKU đã được xóa thành công.", "success")
    await fetchFlashSaleSku()
  } catch {
    Swal.fire("Lỗi", "Không thể xóa SKU!", "error")
  }
}

function editSku(s) {
  Object.assign(skuForm, s)
  Object.keys(skuErrors).forEach((k) => (skuErrors[k] = ""))
  editModeSku.value = true
}

function cancelEditSku() {
  Object.assign(skuForm, { id: null, flashSaleId: "", skuId: "", discount: "", quantity: "" })
  Object.keys(skuErrors).forEach((k) => (skuErrors[k] = ""))
  editModeSku.value = false
}

function getFlashSaleName(id) {
  const f = flashSales.value.find((x) => x.id === id)
  return f ? f.title : "Không xác định"
}

function getSkuName(id) {
  const s = skus.value.find((x) => x.id === id)
  return s ? `${s.id} - ${s.productName}` : id
}

function goToFlashSaleAdmin() {
  router.push("/admin/flash-sale-admin")
}

// 🚀 onMounted
onMounted(async () => {
  await fetchSkus() 
  await Promise.all([fetchFlashSales(), fetchSkus(), fetchFlashSaleSku()])
})
</script>

<style scoped>
.p-3 {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.btn {
  padding: 4px 8px;
  font-size: 13px;
}
.text-danger {
  font-size: 0.875rem;
}
</style>
