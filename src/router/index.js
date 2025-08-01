import { createRouter, createWebHistory } from 'vue-router'


import LayoutClient from '@/layout/LayoutClient.vue';
import LayoutAdmin from '@/layout/LayoutAdmin.vue';
import Home from '@/views/Client/Home.vue'

//Admin
import Dashboard from '@/views/Admin/Dashboard.vue';
import ProductList from '@/views/Admin/Product.vue/ProductList.vue';
import ProductType from '@/views/Admin/Product.vue/ProductType.vue';
import ProductDetailAd from '@/views/Admin/Product.vue/ProductDetail.vue';
import City from '@/views/Admin/Address/City.vue';
import Ward from '@/views/Admin/Address/Ward.vue';
import Voucher from '@/views/Admin/Voucher/Voucher.vue';
//User
import Introduce from '@/views/Client/Introduce.vue';
import Support from '@/views/Client/Support.vue';
import ProductDetail from '@/views/Client/Products/ProductDetail.vue';
import Product from '@/views/Client/Products/Product.vue';
import Cart from '@/views/Client/Cart.vue';
import Checkout from '@/views/Client/Checkout.vue';

//Auth
import Login from '@/views/Auth/Login.vue';
import Register from '@/views/Auth/Register.vue';

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
  { path: '/dangnhap', 
    component: Login
  },
  { path: '/dangky', 
    component: Register
  },
];

const adminRouter =[
  { path: '/quanly/tongquan',
    component: Dashboard
  },
  { path: '/quanly/sanpham/danhsachsanpham',
    component: ProductList
  },
  { path: '/quanly/sanpham/danhsachchitietsanpham',
    component: ProductDetailAd
  },
  { path: '/quanly/sanpham/loaisanpham',
    component: ProductType
  },
  { path: '/quanly/diachi/tinh-thanhpho',
    component: City
  },
  { path: '/quanly/diachi/xa-phuong',
    component: Ward
  },
  { path: '/quanly/voucher',
    component: Voucher
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
      path: '/quanly',
      name: 'layoutAdmin',
      component: LayoutAdmin,
      children: adminRouter
    }
  ]
})



export default router
