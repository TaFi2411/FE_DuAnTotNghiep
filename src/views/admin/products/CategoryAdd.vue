<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">
      {{ isEdit ? 'Cập nhật Category' : 'Thêm mới Category' }}
    </h2>

    <div class="card shadow-sm p-4">
      <form @submit.prevent="saveCategory">
        <!-- Slug -->
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
          <small class="text-danger" v-if="errors.name">{{ errors.name }}</small>
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

        <!-- Buttons -->
        <div class="d-flex justify-content-end button-group">
          <button type="button" class="btn-back" @click="goBack">
            ← Quay lại danh sách
          </button>

          <button type="submit" class="add-category-btn" :disabled="isSubmitting">
            <i v-if="!isSubmitting" :class="isEdit ? 'bi bi-pencil' : 'bi bi-plus-lg'"></i>
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm"></span>
            {{ isSubmitting
              ? (isEdit ? 'Đang lưu...' : 'Đang thêm...')
              : (isEdit ? 'Cập nhật' : 'Thêm mới') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import axios from '@/composables/axios';

const route = useRoute();
const router = useRouter();

const form = reactive({
  id: null,
  slug: '',
  name: '',
  status: true
});

const errors = reactive({ name: '' });
const isSubmitting = ref(false);
const isEdit = computed(() => !!route.params.id);

/* 🧩 RULES giống voucher update */
const rules = {
  name: [
    {
      required: true,
      message: 'Tên danh mục không được để trống'
    },
    {
      minLength: 3,
      message: 'Tên danh mục phải có ít nhất 3 ký tự'
    },
    {
      regex: /^[a-zA-ZÀ-ỹ0-9\s]+$/,
      message: 'Tên danh mục không được chứa ký tự đặc biệt'
    }
  ]
};

// 🔡 Tạo slug tự động
const toSlug = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const onNameInput = () => {
  form.slug = toSlug(form.name);
};

// 🧠 Kiểm tra slug tồn tại
const checkSlugExists = async (slug) => {
  try {
    const res = await axios.get(`/api/category/check-slug/${slug}`);
    return res.data?.exists === true;
  } catch {
    return false;
  }
};

// 🧠 Load category khi edit
const loadCategory = async (id) => {
  try {
    const res = await axios.get(`/api/category/${id}`);
    Object.assign(form, res.data);
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: 'error',
      title: 'Không tìm thấy danh mục',
      text: 'Quay lại danh sách',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true
    });
    router.push('/admin/category');
  }
};

onMounted(() => {
  if (isEdit.value) loadCategory(route.params.id);
});

// 🧭 Quay lại
const goBack = () => router.push('/admin/category');

// ✅ Validate dùng const rules
const validateForm = () => {
  errors.name = '';

  for (const rule of rules.name) {
    const value = form.name ? form.name.trim() : '';

    if (rule.required && !value) {
      errors.name = rule.message;
      return false;
    }
    if (rule.minLength && value.length < rule.minLength) {
      errors.name = rule.message;
      return false;
    }
    if (rule.regex && !rule.regex.test(value)) {
      errors.name = rule.message;
      return false;
    }
  }

  return true;
};

// 💾 Save Category
const saveCategory = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    // 🔍 Kiểm tra slug khi thêm mới
    if (!isEdit.value) {
      const exists = await checkSlugExists(form.slug);
      if (exists) {
        await Swal.fire({
          icon: 'error',
          title: 'Slug đã tồn tại',
          text: 'Vui lòng đổi tên khác hoặc thêm số ở cuối',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        isSubmitting.value = false;
        return;
      }
    }

    const payload = {
      slug: form.slug,
      name: form.name.trim(),
      status: form.status
    };

    if (isEdit.value) {
      await axios.put(`/api/category/${form.id}`, payload);
      await Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    } else {
      await axios.post('/api/category', payload);
      await Swal.fire({
        icon: 'success',
        title: 'Thêm mới thành công',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    }

    router.push('/admin/category');
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: 'error',
      title: 'Lưu thất bại 😢',
      text: err.response?.data?.message || 'Đã có lỗi xảy ra',
      confirmButtonColor: '#dc3545'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}

.button-group button {
  min-width: 140px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 13px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

/* Nút quay lại */
.btn-back {
  border: 1px solid #6c757d;
  background-color: #fff;
  color: #6c757d;
}
.btn-back:hover {
  background-color: #6c757d;
  color: #fff;
  transform: translateY(-1px);
}

/* Nút thêm / cập nhật */
.add-category-btn {
  border: 1px solid #198754;
  background-color: #fff;
  color: #198754;
}
.add-category-btn:hover {
  background-color: #198754;
  color: #fff;
  transform: translateY(-1px);
}

.add-category-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
