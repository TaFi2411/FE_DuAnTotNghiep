<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <Sidebar :menu="menu" :is-collapsed="isCollapsed" @toggle="toggleSidebar" />

    <!-- Main -->
    <div class="main" :class="{ collapsed: isCollapsed }">
      <AdminHeader />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/admin/Sidebar.vue'
import AdminHeader from '@/components/admin/HeaderAdmin.vue'

const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const menu = [
  { name: 'Dashboard', path: '/admin', icon: 'bi bi-speedometer2' },
 {
    name: 'Sản phẩm',
    icon: 'bi bi-box-seam',
    children: [
      { name: 'Danh sách sản phẩm', path: '/admin/list-product' },
      { name: 'Thêm sản phẩm', path: '/admin/product/create' },
      { name: 'Loại sản phẩm', path: '/admin/category' },
      { name: 'Thêm thuộc tính', path: '/admin/attribute' },
    ]
  },
  { name: 'Voucher', path: '/admin/list-voucher', icon: 'bi bi-box-seam' },
  { name: 'FlashSale', path: '/admin/flashsale', icon: 'bi bi-box-seam' },
  { name: 'Đơn hàng', path: '/admin/orders', icon: 'bi bi-cart-check' },
  { name: 'Người dùng', path: '/admin/users', icon: 'bi bi-people' },
]
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f9fafc;
}

.main {

  flex: 1;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  background: #fff;
  margin-left: 240px;

}

.main.collapsed {
  margin-left: 70px;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f9fafc;
}
</style>
