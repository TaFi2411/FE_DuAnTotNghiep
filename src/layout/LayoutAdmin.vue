<script setup>

import SidebarAdmin from '@/components/Admin/SidebarAdmin.vue';
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue';
import { RouterView } from 'vue-router';
</script>

<template>
    <SidebarAdmin />
    <div>
      <div class="header fixed-top z-1 top-0">
        <HeaderAdmin />
      </div>
      <div class="content">
        <RouterView />
      </div>
    </div>
</template>

<style scoped>
.content {
  margin-left: 300px;
  padding: 30px;
  width: calc(100%-300px);
}
</style>