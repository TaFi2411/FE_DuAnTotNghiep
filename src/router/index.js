import { createRouter, createWebHistory } from 'vue-router'


import LayoutClient from '@/layout/LayoutClient.vue';
import LayoutAdmin from '@/layout/LayoutAdmin.vue';
import Home from '@/views/Client/Home.vue'

//Admin
import Dashboard from '@/views/Admin/Dashboard.vue';
import ProductList from '@/views/Admin/Product.vue/ProductList.vue';
import ProductType from '@/views/Admin/Product.vue/ProductType.vue';


//User
import Introduce from '@/views/Client/Introduce.vue';
import Support from '@/views/Client/Support.vue';
import ProductDetail from '@/views/Client/Products/ProductDetail.vue';
import Product from '@/views/Client/Products/Product.vue';
import Cart from '@/views/Client/Cart.vue';
import Checkout from '@/views/Client/Checkout.vue';


const clientRouter =[
  { 
    path: '', 
    component: Home
  },
    { 
      path: '/sanpham/chitietsanpham/:id', 
    component: ProductDetail
  },
      { 
      path: '/sanpham', 
    component: Product
  },
        { 
      path: '/giohang', 
    component: Cart
  },
   { 
      path: '/thanhtoan', 
    component: Checkout
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
 
    {
      path: '/',
      name: 'adminRouter',
      component: LayoutAdmin,
      children: adminRouter
    },

  ]
})

export default router
