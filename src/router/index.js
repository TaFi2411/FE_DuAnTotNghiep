import { createRouter, createWebHistory } from 'vue-router'


import LayoutClient from '@/layout/LayoutClient.vue';
import LayoutAdmin from '@/layout/LayoutAdmin.vue';
import Home from '@/views/Client/Home.vue'
//Admin
import Dashboard from '@/views/Admin/Dashboard.vue';
import ProductType from '@/views/Admin/Product.vue/ProductType.vue';

const clientRouter =[
  { path: '', 
    component: Home
  },
];

const adminRouter =[
  { path: '/quanly/tongquan',
    component: Dashboard
  },
  { path: '/quanly/sanpham/loaisanpham',
    component: ProductType
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
    {
      path: '/',
      name: 'adminRouter',
      component: LayoutAdmin,
      children: adminRouter
    },

  ]
})

export default router
