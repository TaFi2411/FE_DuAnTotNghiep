<template>
  <div>
    <h2>Tài khoản</h2>
    <hr />

    <div class="search d-flex">
    <input
        type="text"
        v-model="searchKeyword"
        placeholder="Tìm kiếm theo tên hoặc email"
        class="form-control mb-3"
        />
    <button class="btn btn-primary mb-3" @click="handleSearch">Tìm</button>
</div>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Email</th>
          <th>Giới tính</th>
          <th>Số điện thoại</th>
          <th>Vai trò</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in filteredAccounts" :key="account.id">
          <td>{{ account.id }}</td>
          <td>{{ account.fullname }}</td>
          <td>{{ account.email }}</td>
          <td>{{ account.gender ? 'Nam' : 'Nữ' }}</td>
          <td>{{ account.phone }}</td>
          <td>{{ account.role ? 'Quản lý' : 'Người dùng' }}</td>
          <td>{{ account.status ? 'Hoạt động' : 'Đã bị khóa' }}</td>
          <td>
            <button
              class="btn"
              :class="account.status ? 'btn-danger' : 'btn-success'"
              @click="ChangeStatus(account.id)"
            >
              {{ account.status ? 'Khóa' : 'Mở khóa' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/account'
const accounts = ref([])
const searchKeyword = ref('')

// Lấy danh sách tài khoản
const fetchAccount = async () => {
  try {
    const response = await axios.get(API_URL)
    accounts.value = response.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách tài khoản:', err)
  }
}

// Thay đổi trạng thái tài khoản
const ChangeStatus = async (id) => {
  try {
    await axios.put(`${API_URL}/${id}/capnhattrangthai`)
    await fetchAccount()
  } catch (err) {
    console.error('Lỗi khi thay đổi trạng thái tài khoản:', err)
  }
}


const filteredAccounts = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  return accounts.value.filter(account =>
    account.fullname.toLowerCase().includes(keyword) ||
    account.email.toLowerCase().includes(keyword)
  )
})

onMounted(() => {
  fetchAccount()
})
</script>

<style scoped>
.btn {
  margin: 0 4px;
  min-width: 120px;
}
</style>
