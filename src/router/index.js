import { createRouter, createWebHistory } from 'vue-router'


import LayoutClient from '@/layout/LayoutClient.vue';
import LayoutAdmin from '@/layout/LayoutAdmin.vue';
import Home from '@/views/Client/Home.vue'
import ProductDetail from '@/views/Client/ProductDetail.vue';
import Product from '@/views/Client/Product.vue';
import Cart from '@/views/Client/Cart.vue';
import Checkout from '@/views/Client/Checkout.vue';

import About from '@/views/Client/About.vue';
//Admin
import Dashboard from '@/views/Admin/Dashboard.vue';
import ProductList from '@/views/Admin/Product.vue/ProductList.vue';
import ProductType from '@/views/Admin/Product.vue/ProductType.vue';


//User
import Introduce from '@/views/Client/Introduce.vue';
import Support from '@/views/Client/Support.vue';
const clientRouter =[
  { 
    path: '', 
    component: Home
  },
    { 
      path: '/ProductDetail/:id', 
    component: ProductDetail
  },
      { 
      path: '/Product', 
    component: Product
  },
        { 
      path: '/Cart', 
    component: Cart
  },
   { 
      path: '/Checkout', 
    component: Checkout
  },
   { 
      path: '/Support', 
    component: Support
  },
     { 
      path: '/About', 
    component: About
  },
  { path: '/gioithieu', 
    component: Introduce
  },
  { path: '/hotro', 
    component: Support
  },
];

const adminRouter =[
  { path: '/quanly/tongquan',
    component: Dashboard
  },
  { path: '/quanly/sanpham/danhsachsanpham',
    component: ProductList
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
 
    // {
    //   path: '/',
    //   name: 'adminRouter',
    //   component: AdminLayout,
    //   children: adminRouter
    // },
    {
      path: '/',
      name: 'adminRouter',
      component: LayoutAdmin,
      children: adminRouter
    },

  ]
})

export default router
