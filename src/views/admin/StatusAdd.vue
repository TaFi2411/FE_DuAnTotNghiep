<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-center">{{ isEdit ? 'Cập nhật Status' : 'Thêm mới Status' }}</h2>

    <div class="card shadow-sm p-4">
      <form @submit.prevent="saveStatus">
        <div class="mb-3">
          <label class="form-label">Tên trạng thái</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            placeholder="Nhập tên trạng thái (VD: Đang xử lý, Hoàn tất...)"
            required
          />
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios'

const route = useRoute()
const router = useRouter()

const form = ref({ id: null, name: '' })
const isEdit = computed(() => !!route.params.id)

const loadStatus = async (id) => {
  try {
    const res = await axios.get(`/api/status/${id}`)
    form.value = { ...res.data, id: res.data.id ?? id }
  } catch (err) {
    console.error('❌ Không tải được status:', err)
    alert('Không tìm thấy status!')
    setTimeout(() => router.push('/status'), 500)
  }
}

function validateForm() {
  const name = form.value.name?.trim() || ''
  if (!name) {
    alert('Tên trạng thái không được để trống!')
    return false
  }
  if (/^\d+$/.test(name)) {
    alert('Tên trạng thái không được chỉ gồm số!')
    return false
  }
  if (/[^a-zA-Z0-9À-ỹ\s]/.test(name)) {
    alert('Tên trạng thái không được chứa ký tự đặc biệt!')
    return false
  }
  return true
}

const saveStatus = async () => {
  try {
    if (!validateForm()) return

    if (isEdit.value) {
      await axios.put(`/api/status/${form.value.id}`, { name: form.value.name.trim() })
      alert('✅ Cập nhật thành công!')
    } else {
      await axios.post('/api/status', { name: form.value.name.trim() })
      alert('✅ Thêm mới thành công!')
    }
    router.push('/status')
  } catch (err) {
    console.error('❌ Lỗi khi lưu:', err)
    alert('Lưu thất bại!')
  }
}

const goBack = () => router.push('/status')

onMounted(() => {
  if (isEdit.value) loadStatus(route.params.id)
})
</script>

<style scoped>
.card {
  border-radius: 10px;
  max-width: 700px;
  margin: 0 auto;
}
</style>
