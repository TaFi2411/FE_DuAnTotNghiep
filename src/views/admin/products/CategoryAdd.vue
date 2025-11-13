<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">
      {{ isEdit ? "Cập nhật Category" : "Thêm mới Category" }}
    </h2>

    <div class="card shadow-sm p-4">
      <form @submit.prevent="saveCategory">
        <!-- Slug -->
        <div class="mb-3">
          <label class="form-label">Slug (tự tạo)</label>
          <input
            v-model="form.slug"
            type="text"
            class="form-control"
            disabled
          />
          <small class="text-danger" v-if="v$.slug.$error">
            <span v-if="v$.slug.required.$invalid">Slug không được bỏ trống</span>
            <span v-else-if="v$.slug.duplicateSlug.$invalid">Slug đã tồn tại</span>
          </small>
        </div>

        <!-- Name -->
        <div class="mb-3">
          <label class="form-label">Tên danh mục</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.name.$error }"
            @input="onNameInput"
          />
          <small class="text-danger" v-if="v$.name.$error">
            <span v-if="v$.name.required.$invalid">Tên danh mục không bỏ trống</span>
            <span v-else-if="v$.name.minLength.$invalid"
              >Tên danh mục ít nhất 3 ký tự</span
            >
            <span v-else-if="v$.name.duplicateName.$invalid"
              >Tên danh mục đã tồn tại</span
            >
          </small>
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

          <button
            type="submit"
            class="add-category-btn"
            :disabled="isSubmitting"
          >
            <i
              v-if="!isSubmitting"
              :class="isEdit ? 'bi bi-pencil' : 'bi bi-plus-lg'"
            ></i>
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm"
            ></span>
            {{
              isSubmitting
                ? isEdit
                  ? "Đang lưu..."
                  : "Đang thêm..."
                : isEdit
                ? "Cập nhật"
                : "Thêm mới"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "@/composables/axios";
import useVuelidate from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";

const route = useRoute();
const router = useRouter();

const form = reactive({
  id: null,
  slug: "",
  name: "",
  status: true,
});

const isSubmitting = ref(false);
const categories = ref([]);
const isEdit = computed(() => !!route.params.id);

// 🧠 Load danh sách category
const loadCategories = async () => {
  try {
    const res = await axios.get("/api/category");
    const data = res.data;

    if (Array.isArray(data)) categories.value = data;
    else if (Array.isArray(data.data)) categories.value = data.data;
    else if (Array.isArray(data.content)) categories.value = data.content;
    else categories.value = [];

    console.log("✅ Categories loaded:", categories.value);
  } catch (err) {
    console.error("Không thể tải danh mục:", err);
    categories.value = [];
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
      icon: "error",
      title: "Không tìm thấy danh mục",
      text: "Quay lại danh sách",
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    router.push("/admin/category");
  }
};

// 🔡 Tạo slug tự động
const toSlug = (str) =>
  (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const onNameInput = () => {
  form.slug = toSlug(form.name);
};

// 🧩 Custom rule: kiểm tra trùng tên
const duplicateName = helpers.withMessage(
  "Tên danh mục đã tồn tại",
  (value) => {
    if (!value) return true;
    return !categories.value.some(
      (c) =>
        c.name.trim().toLowerCase() === value.trim().toLowerCase() &&
        c.id !== form.id
    );
  }
);

// 🧩 Custom rule: kiểm tra trùng slug
const duplicateSlug = helpers.withMessage("Slug đã tồn tại", (value) => {
  if (!value) return true;
  return !categories.value.some(
    (c) =>
      c.slug.trim().toLowerCase() === value.trim().toLowerCase() &&
      c.id !== form.id
  );
});

// 🧩 RULES Vuelidate
const rules = {
  name: { required, minLength: minLength(3), duplicateName },
  slug: { required, duplicateSlug },
};

// ✅ Kích hoạt Vuelidate
const v$ = useVuelidate(rules, form);

// 🧭 Quay lại
const goBack = () => router.push("/admin/category");

// 💾 Save Category
const saveCategory = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return; // Nếu form lỗi → dừng lại

  isSubmitting.value = true;
  try {
    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      status: form.status,
    };

    if (isEdit.value) {
      await axios.put(`/api/category/${form.id}`, payload);
      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } else {
      await axios.post("/api/category", payload);
      await Swal.fire({
        icon: "success",
        title: "Thêm mới thành công",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }

    router.push("/admin/category");
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: "error",
      title: "Lưu thất bại 😢",
      text: err.response?.data?.message || "Đã có lỗi xảy ra",
      confirmButtonColor: "#dc3545",
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await loadCategories();
  if (isEdit.value) await loadCategory(route.params.id);
});
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
