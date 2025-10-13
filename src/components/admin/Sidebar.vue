<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <div class="sidebar-header">
      
      <router-link class="navbar-brand p-3" to="/" v-if="!isCollapsed">
        <img src="/images/Logo.png" alt="Logo" height="40" width="120" />
      </router-link>

      <button class="toggle-btn fs-2" @click="$emit('toggle')">
        ☰
      </button>
    </div>

    <ul class="menu">
      <li
        v-for="item in menu"
        :key="item.name"
        :class="{ active: item.path === activePath }"
        @click="navigate(item.path)"
      >
        <i :class="item.icon"></i>
        <span v-if="!isCollapsed">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const navigate = (path) => {
  router.push(path)
  activePath.value = path
}
</script>

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
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu li:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.menu li.active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
}

.menu i {
  font-size: 18px;
}
</style>
