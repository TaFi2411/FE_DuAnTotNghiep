<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  menu: {
    type: Array,
    required: true
  },
  isCollapsed: Boolean
})

const router = useRouter()
const route = useRoute()
const activePath = ref(route.path)
const openItem = ref('') // lưu name của menu đang mở

watch(route, (newRoute) => {
  activePath.value = newRoute.path
})

// Khi collapsed, reset menu mở
watch(() => props.isCollapsed, (val) => {
  if (val) openItem.value = ''
})

const navigate = (path) => {
  router.push(path)
  activePath.value = path
}

const toggleItem = (item) => {
  if (item.children && !props.isCollapsed) {
    openItem.value = openItem.value === item.name ? '' : item.name
  } else if (item.path) {
    navigate(item.path)
  }
}

const isOpen = (item) => item.children && openItem.value === item.name
</script>

<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <div class="sidebar-header">
      <router-link class="navbar-brand p-3" to="/" v-if="!isCollapsed">
        <img src="/images/Logo.png" alt="Logo" height="40" width="120" />
      </router-link>

      <button class="toggle-btn fs-2" @click="$emit('toggle')">☰</button>
    </div>

    <ul class="menu">
      <li v-for="item in menu" :key="item.name" :class="{ active: item.path === activePath }">
        <div class="menu-item" @click="toggleItem(item)">
          <i :class="item.icon"></i>
          <span v-if="!isCollapsed">{{ item.name }}</span>
          <i v-if="item.children && !isCollapsed" class="bi" :class="isOpen(item) ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
        </div>

        <!-- Submenu -->
        <ul v-if="isOpen(item)" class="submenu">
          <li v-for="child in item.children" :key="child.name" :class="{ active: child.path === activePath }" @click.stop="navigate(child.path)">
            <span v-if="!isCollapsed">{{ child.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>



<style scoped>
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #1e1e1e, #111);
  color: #ccc;
  height: 100vh;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  color: #fff;
}

.toggle-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.menu li {
  display: block;
}

.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.menu li.active > .menu-item {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
}

.submenu {
  list-style: none;
  padding-left: 20px;
  background: #2a2a2a;
}

.submenu li {
  padding: 8px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submenu li:hover {
  background: rgba(255, 255, 255, 0.1);
}

.submenu li.active {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
}

.menu i {
  font-size: 18px;
}
</style>
