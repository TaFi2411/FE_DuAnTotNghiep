<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">
      {{ isEdit ? 'Cập nhật Category' : 'Thêm mới Category' }}
    </h2>

    <div class="card shadow-sm p-4">
      <form @submit.prevent="saveCategory">
        <!-- Slug (disabled) -->
        <div class="mb-3">
          <label class="form-label">Slug (tự tạo)</label>
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
          <input v-model="form.status" type="checkbox" class="form-check-input" id="status" />
          <label class="form-check-label" for="status">Hoạt động</label>
        </div>

        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-secondary me-2" @click="goBack">Quay lại</button>
          <button type="submit" class="btn btn-success">{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';

const route = useRoute();
const router = useRouter();

const form = ref({ id: null, slug: '', name: '', status: true });
const isEdit = computed(() => !!route.params.id);

function toSlug(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const loadCategory = async (id) => {
  try {
    const res = await axios.get(`/api/category/${id}`);
    form.value = { ...res.data, id: res.data.id ?? id };
  } catch (err) {
    console.error('Không tải được danh mục:', err);
    alert('Không tìm thấy danh mục, quay về danh sách.');
    router.push('/category');
  }
};

onMounted(() => {
  if (isEdit.value) loadCategory(route.params.id);
  else form.value = { id: null, slug: '', name: '', status: true };
});

const onNameInput = () => {
  form.value.slug = toSlug(form.value.name);
};

const checkSlugExists = async (slug) => {
  try {
    const res = await axios.get(`/api/category/check-slug/${slug}`);
    return res.data?.exists === true;
  } catch {
    return false;
  }
};

// 🔍 Hàm validate form
function validateForm() {
  const name = form.value.name?.trim() || '';

  if (!name) {
    alert('Tên danh mục không được để trống!');
    return false;
  }

  if (/^\d+$/.test(name)) {
    alert('Tên danh mục không được chỉ gồm số!');
    return false;
  }

  if (/[^a-zA-Z0-9À-ỹ\s]/.test(name)) {
    alert('Tên danh mục không được chứa ký tự đặc biệt!');
    return false;
  }

  return true;
}

const saveCategory = async () => {
  try {
    // ✅ Kiểm tra trước khi gửi
    if (!validateForm()) return;

    if (!isEdit.value) {
      const exists = await checkSlugExists(form.value.slug);
      if (exists) {
        alert('Slug đã tồn tại — đổi tên khác hoặc thêm số ở cuối.');
        return;
      }
    }

    const payload = {
      slug: form.value.slug,
      name: form.value.name.trim(),
      status: form.value.status,
    };

    if (isEdit.value) {
      await axios.put(`/api/category/${form.value.id}`, payload);
      alert('Cập nhật thành công!');
    } else {
      await axios.post('/api/category', payload);
      alert('Thêm mới thành công!');
    }

    router.push('/category');
  } catch (err) {
    console.error('Lỗi khi lưu category:', err);
    alert('Lưu thất bại, xem console để biết chi tiết.');
  }
};

const goBack = () => router.push('/category');
</script>
