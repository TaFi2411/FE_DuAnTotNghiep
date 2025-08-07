
<template>
  <div class="container mt-4">
    <h2>Biến thể sản phẩm</h2>
    <hr />

    <!-- Tabs -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active text-black" data-bs-toggle="tab" href="#list">Danh sách</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-black" data-bs-toggle="tab" href="#add">Thêm</a>
      </li>
    </ul>

    <!-- Nội dung tabs -->
    <div class="tab-content">
      <!-- Danh sách SKU -->
      <div id="list" class="container tab-pane active"><br />
        <div class="mb-3">
          <input v-model="searchKeyword" type="text" class="form-control" placeholder="Tìm kiếm theo tên chi tiết sản phẩm..." />
        </div>

        <table class="table table-bordered table-hover">
          <thead>
            <tr class="table-secondary text-center">
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thuộc tính</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sku) in skuList" :key="sku.id" class="align-middle">
              <td class="text-center">{{ sku.id }}</td>
              <td class="text-center">
                <img :src="sku.image" alt="Ảnh" class="table-img rounded" />
              </td>
              <td>{{ sku.productName }}</td>
              <td class="text-end">{{ sku.price.toLocaleString() }}</td>
              <td class="text-center">{{ sku.quantity }}</td>
              <td>
                <ul class="list-unstyled mb-0">
                  <li v-for="attr in sku.attributes" :key="attr.attributeValueId">
                    <strong>{{ attr.optionAttributeName }}:</strong> {{ attr.attributeValue }}
                  </li>
                </ul>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning me-1" @click="editSku(sku)">Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteSku(sku.id)">Xoá</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Form thêm / sửa SKU -->
      <div id="add" class="container tab-pane fade"><br />
        <form @submit.prevent="addSku">
          <div class="mb-3">
            <label class="form-label">Sản phẩm</label>
            <select v-model="SkuRequest.productId" class="form-select" required>
              <option disabled value="">-- Chọn sản phẩm --</option>
              <option v-for="product in Products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>

        

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Giá</label>
              <input type="number" v-model="SkuRequest.price" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Số lượng</label>
              <input type="number" v-model="SkuRequest.quantity" class="form-control" required />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Ảnh</label>
            <input type="file" class="form-control" accept="image/*" @change="handleImageFile" />
          </div>
          <div class="col-12" v-if="imagePreview">
                <label class="form-label d-block">Xem trước ảnh</label>
                <img :src="imagePreview" class="preview-img" alt="preview" @error="onImgError" width="200px" height="200px"/>
              </div>

               <div
                  v-for="(item, index) in Attributes"
                  :key="index"
                  class="row g-2 align-items-center mb-3 border rounded p-2 attribute-row"
                >
                  <div class="col-md-5">
                    <label class="form-label mb-1">Thuộc tính</label>
                    <select v-model="item.OpptionAttributeId" @change="item.AttributeValueId = ''" class="form-select">
                      <option disabled value="">-- Chọn thuộc tính --</option>
                      <option v-for="attr in OpptionAttribute" :key="attr.id" :value="attr.id">
                        {{ attr.name }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-5">
                    <label class="form-label mb-1">Giá trị</label>
                    <select v-if="item.OpptionAttributeId" v-model="item.AttributeValueId" class="form-select">
                      <option disabled value="">-- Chọn giá trị --</option>
                      <option
                        v-for="val in getValuesByOpptionAttributeId(item.OpptionAttributeId)"
                        :key="val.id"
                        :value="val.id"
                      >
                        {{ val.value }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-2 d-flex align-items-end">
                    <button @click="removeAttribute(index)" class="btn btn-outline-danger w-100">Xóa</button>
                  </div>
                </div>

                <div class="mt-3">
                  <button @click="addAttribute" type="button" class="btn btn-outline-primary">
                    + Thêm thuộc tính
                  </button>
                </div>

              

          <button type="submit" class="btn btn-success mt-5">Lưu biến thể</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, computed } from "vue";
import axios from "axios";

const API_URL = 'http://localhost:8080/api/sku'

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/deiqvfmm0/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'kaijun_upload';

const isEditing = ref(false);
const editingId = ref(null);
const imagePreview = ref(null);
const searchKeyword = ref("");


const Products = ref([]);
const skuList = ref([]);


const SkuRequest = ref({

  imageUrl: null,
  price: 0,
  quantity: 0,
  productId: '',
   imageFile: null,
});


const handleImageFile = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;


  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result;
  };
  reader.readAsDataURL(file);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(CLOUDINARY_URL, formData);
    SkuRequest.value.image = res.data.secure_url;
  } catch (err) {
    console.error("Lỗi upload Cloudinary:", err);
  }
};

const fetchProduct = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/product');
    Products.value = response.data;
  } catch (err) {
    console.error('Lỗi khi tải danh sách sản phẩm:', err);
  }
};


const fetchSkuList = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/sku");
    skuList.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách SKU:", err);
  }
};


const addSku = async () => {
  let imageUrl = SkuRequest.value.image;
    if (SkuRequest.value.imageFile) {
      const formData = new FormData();
      formData.append("file", SkuRequest.value.imageFile);
      formData.append("upload_preset", "kaijun_upload");
      const res = await axios.post("https://api.cloudinary.com/v1_1/deiqvfmm0/image/upload", formData);
      imageUrl = res.data.secure_url;
    }
    const formSkuAdd = {
        discriptione: SkuRequest.value.discriptione,
        image: imageUrl,
        price: SkuRequest.value.price,
        quantity: SkuRequest.value.quantity,
        productId: SkuRequest.value.productId,
        attributes: Attributes.value.map(item => ({
          id: item.AttributeValueId  
        }))
      }
      console.log('Payload gửi:', formSkuAdd);
    await axios.post(API_URL, formSkuAdd)
    ResetForm();
    await fetchSkuList()
    setTimeout(() => { document.querySelector('[href="#list"]').click() }, 100)
};



const editSku = (sku) => {
  isEditing.value = true;
  editingId.value = sku.id;

  SkuRequest.value = {
    discriptione: sku.discriptione || '',
    image: sku.image || null,
    imageUrl: sku.image || null,
    price: sku.price,
    quantity: sku.quantity,
    productId: sku.productId,
    imageFile: null
  };

  imagePreview.value = sku.image || null;
  Attributes.value = sku.attributes.map(attr => ({
    OpptionAttributeId: attr.optionAttributeId,
    AttributeValueId: attr.attributeValueId
  }));

  setTimeout(() => {
    document.querySelector('[href="#add"]')?.click();
  }, 100);
};

const updateSku = async () => {
  let imageUrl = SkuRequest.value.image;

  if (SkuRequest.value.imageFile) {
    const formData = new FormData();
    formData.append("file", SkuRequest.value.imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(CLOUDINARY_URL, formData);
    imageUrl = res.data.secure_url;
  }

  const formSkuUpdate = {
    discriptione: SkuRequest.value.discriptione,
    image: imageUrl,
    price: SkuRequest.value.price,
    quantity: SkuRequest.value.quantity,
    productId: SkuRequest.value.productId,
    attributes: Attributes.value.map(item => ({
      id: item.AttributeValueId
    }))
  };

  await axios.put(`${API_URL}/${editingId.value}`, formSkuUpdate);

  ResetForm();
  await fetchSkuList();
  setTimeout(() => { document.querySelector('[href="#list"]').click(); }, 100);
};



const deleteSku = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xoá SKU này không?")) return;
  try {
    await axios.delete(`http://localhost:8080/api/sku/${id}`);
    alert("Xoá thành công!");
    fetchSkuList();
  } catch (err) {
    console.error("Lỗi khi xoá SKU:", err);
    alert("Xoá thất bại!");
  }
};

const filteredSkus = computed(() => {
  return skuList.value.filter(sku =>
    sku.productId.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

const ResetForm = () => {
  SkuRequest.value = {
    name: '',
    description: '',
    image: '',
    price: 0,
    quantity: 0,
    productId: ''
  };
  imagePreview.value = null; 
};





const OpptionAttribute = ref([]);
const AttributeValue = ref([]);
const Attributes = ref([
  { OpptionAttributeId: '', AttributeValueId: '' }
]);

const fetchOptionAttributes = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/option-attribute')
    OpptionAttribute.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải thuộc tính:', err)
  }
}

const fetchAttributeValues = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/attribute-value')
    AttributeValue.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải giá trị thuộc tính:', err)
  }
}


const getValuesByOpptionAttributeId = (attrId) => {
  return AttributeValue.value.filter(v => v.optionAttributeId === Number(attrId))
}



// Thêm dòng thuộc tính
const addAttribute = () => {
 Attributes.value.push({ OpptionAttributeId: '', AttributeValueId: '' })

}

// Xóa dòng thuộc tính
const removeAttribute = (index) => {
  Attributes.value.splice(index, 1)
}


onMounted(() => {
  fetchProduct()
  fetchSkuList()
  fetchOptionAttributes()
  fetchAttributeValues()
})

</script>

<style scoped>
.attribute-row {
  background-color: #f8f9fa;
  transition: all 0.3s;
}

.attribute-row:hover {
  background-color: #f1f1f1;
}

.preview-img {
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 8px;
  object-fit: cover;
}

.table-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>