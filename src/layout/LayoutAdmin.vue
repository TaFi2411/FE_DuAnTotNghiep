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
  { type: 'item', name: 'Tổng quan', path: '/admin', icon: 'bi bi-speedometer2' },

  { type: 'title', label: 'QUẢN LÝ SẢN PHẨM' },
  {
    type: 'item',
    name: 'Sản phẩm',
    icon: 'bi bi-box-seam',
    children: [
      { name: 'Danh sách sản phẩm', path: '/admin/list-product' },
      { name: 'Thêm sản phẩm', path: '/admin/product/create' },
    ]
  },
  { type: 'item', name: 'Loại', path: '/admin/category', icon: 'bi bi-journal-bookmark' },
  { type: 'item', name: 'Thuộc tính', path: '/admin/attribute', icon: 'bi bi-segmented-nav' },

  { type: 'title', label: 'QUẢN LÝ BÁN HÀNG' },
  { type: 'item', name: 'Voucher', path: '/admin/list-voucher', icon: 'bi bi-ticket-detailed' },
  { type: 'item', name: 'FlashSale', path: '/admin/flash-sale-admin', icon: 'bi bi-lightning-charge-fill' },
  { type: 'item', name: 'Đơn hàng', path: '/admin/orders', icon: 'bi bi-cart-check' },

  { type: 'title', label: 'HỆ THỐNG' },
  { type: 'item', name: 'Người dùng', path: '/admin/account-management', icon: 'bi bi-people' },
  { type: 'item', name: 'Thống kê', path: '/admin/statistical', icon: 'bi bi-bar-chart' },
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
