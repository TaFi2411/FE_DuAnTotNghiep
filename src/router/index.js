import { createRouter, createWebHistory } from 'vue-router'


import LayoutClient from '@/layout/LayoutClient.vue';
import Home from '@/views/Client/Home.vue'

const clientRouter =[
  { path: '', 
    component: Home
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layoutClient',
      component: LayoutClient,
      children: clientRouter
    },
    // {
    //   path: '/',
    //   name: 'adminRouter',
    //   component: AdminLayout,
    //   children: adminRouter
    // },

  ]
})

export default router
