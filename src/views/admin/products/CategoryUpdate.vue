<template>
  <div class="container mt-4">
    <h2 class="page-title text-center mb-4">Cập nhật danh mục</h2>

    <div class="card shadow-sm p-4">
      <form @submit.prevent="saveCategory">
        <!-- Slug -->
        <div class="mb-3">
          <label class="form-label">Slug</label>
          <input v-model="form.slug" type="text" class="form-control" disabled />
        </div>

        <!-- Name -->
        <div class="mb-3">
          <label class="form-label">Tên danh mục</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            @input="onNameInput"
          />
        </div>

        <!-- Status -->
        <div class="form-check mb-3">
          <input
            v-model="form.status"
            type="checkbox"
            class="form-check-input"
            id="status"
          />
          <label class="form-check-label" for="status">Hoạt động</label>
        </div>

        <!-- Nút -->
        <div class="d-flex justify-content-end">
          <button type="button" class="btn-cancel me-2" @click="goBack">
            Quay lại
          </button>
          <button type="submit" class="btn-save">Cập nhật</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/composables/axios'

const route = useRoute()
const router = useRouter()

const form = ref({
  id: null,
  slug: '',
  name: '',
  status: true
})

const toSlug = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const loadCategory = async (id) => {
  try {
    const res = await axios.get(`/api/category/${id}`)
    form.value = { ...res.data, id: res.data.id ?? id }
  } catch (err) {
    console.error('❌ Không tải được danh mục:', err)
    alert('Không tìm thấy danh mục, quay lại danh sách.')
    router.push('/categories')
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) loadCategory(id)
})

const onNameInput = () => {
  form.value.slug = toSlug(form.value.name)
}

const saveCategory = async () => {
  try {
    if (!form.value.name.trim()) {
      alert('Tên danh mục không được để trống!')
      return
    }

    const payload = {
      slug: form.value.slug,
      name: form.value.name.trim(),
      status: form.value.status
    }

    await axios.put(`/api/category/${form.value.id}`, payload)
    alert('Cập nhật thành công!')
    router.push('/admin/category') // ✅ chuyển về danh sách sau khi lưu
  } catch (err) {
    console.error('❌ Lỗi khi lưu category:', err)
    alert('Lưu thất bại!')
  }
}

const goBack = () => router.push('/categories')
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

/* 🟢 Nút Quay lại */
.btn-cancel {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  padding: 6px 14px;
  transition: all 0.2s ease;
}
.btn-cancel:hover {
  background-color: #e9ecef;
}

/* 🟢 Nút Lưu/Cập nhật */
.btn-save {
  background-color: #198754;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  padding: 6px 14px;
  transition: all 0.2s ease;
}
.btn-save:hover {
  background-color: #157347;
  transform: translateY(-1px);
}
</style>
