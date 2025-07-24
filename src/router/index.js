import { createRouter, createWebHistory } from 'vue-router'


import LayoutClient from '@/layout/LayoutClient.vue';
import Home from '@/views/Client/Home.vue'
import ProductDetail from '@/views/Client/ProductDetail.vue';
import Product from '@/views/Client/Product.vue';
import Cart from '@/views/Client/Cart.vue';
import Checkout from '@/views/Client/Checkout.vue';
import Support from '@/views/Client/Support.vue';
import About from '@/views/Client/About.vue';
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
