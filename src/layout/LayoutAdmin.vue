<script setup>

import SidebarAdmin from '@/components/Admin/SidebarAdmin.vue';
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="d-flex">
    <SidebarAdmin />
    <div>
      <div class="header fixed-top z-1 top-0">
        <HeaderAdmin />
      </div>
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header{
  margin-left: 300px;
}
.content {
  margin-top: 60px;
  margin-left: 300px;
  padding: 20px;
 
}
</style>