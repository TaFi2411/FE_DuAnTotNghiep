import { createRouter, createWebHistory } from 'vue-router'

import LayoutClient from '@/layout/LayoutClient.vue';
import LayoutAdmin from '@/layout/LayoutAdmin.vue';

// --- Import các component ---
// Auth
import Register from '@/views/auth/Register.vue';
import Login from '@/views/auth/Login.vue';

// Client
import Home from '@/views/client/Home.vue';
import Store from '@/views/client/Store.vue';
import Introduce from '../views/client/Introduce.vue';
import Support from '@/views/client/Support.vue';
import ProductDetail from '@/views/client/ProductDetail.vue';
import Cart from '@/views/client/Cart.vue';
import Checkout from '@/views/client/Checkout.vue';

// Admin
import Dashboard from '@/views/admin/Dashboard.vue';
import Auth from '@/views/admin/Auth.vue';

//Admin Product
import CategoryAdd from '@/views/admin/products/CategoryAdd.vue';
import CategoryList from '@/views/admin/products/CategoryList.vue';
import ListProduct from '@/views/admin/products/ListProduct.vue';
import UpdateProduct from '@/views/admin/products/ProductUpdate.vue';
import Attribute from '@/views/admin/products/Attribute.vue';
import FlashSale from '@/views/admin/FlashSale.vue';

// --- Định nghĩa các route con ---
const clientRouter = [
  {
    path: '',
    name: 'Home',
    component: Home
  }, 
  {
    path: 'auth/register',
    name: 'Register',
    component: Register
  },
  {
    path: 'auth/login',
    name: 'Login',
    component: Login
  },
  {
    path: 'store',
    name: 'Store',
    component: Store
  },
  {
    path: 'introduce',
    name: 'Introduce',
    component: Introduce
  },
  {
    path: 'support',
    name: 'Support',
    component: Support
  },

  {
    path: 'product/:id', // URL sẽ có dạng /product/123
    name: 'ProductDetail',
    component: ProductDetail,
    props: true // Tự động truyền id vào làm prop
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/checkout',
    component: Checkout
  }
];

const adminRouter = [
  {
    path: '',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: 'auth',
    name: 'AuthAdmin',
    component: Auth
  },
  {
    path: 'list-product',
    name: 'ListProduct',
    component: ListProduct
  },
  {
    path: 'products/update/:id',
    name: 'UpdateProduct',
    component: UpdateProduct,
    props: true                  // Tự động truyền id vào làm prop
  },
  {
    path: 'category',
    component: CategoryList
  },
  {
    path: 'attribute',
    component: Attribute
  },

  {
    path: '/admin/flashsale',
    component: FlashSale
  },
  {
  path: '/flash-sale/:id?',
  name: 'FlashSale',
  component: FlashSale
  },
  {
    path: "categories/add",
    component: CategoryAdd
  },
  {
    path: "categories/edit/:id"
    , component: CategoryAdd
  },

];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutClient,
      children: clientRouter
    },
    {
      path: '/admin',
      component: LayoutAdmin,
      children: adminRouter,
    }
  ]
})



export default router