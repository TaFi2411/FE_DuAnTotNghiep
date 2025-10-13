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
import CategoryAdd from '@/views/admin/CategoryAdd.vue';
import CategoryList from '@/views/admin/CategoryList.vue';
import Product from '@/views/products/Product.vue';
import ValueAttribute from '@/views/products/ValueAttribute.vue';
import OptionAttribute from '@/views/products/OptionAttribute.vue';
import ListProduct from '@/views/products/ListProduct.vue';
import UpdateProduct from '@/views/products/UpdateProduct.vue';

// --- Định nghĩa các route con ---
const clientRouter = [
  { path: '', name: 'Home', component: Home }, // Đường dẫn rỗng sẽ khớp với '/' của layout cha
  { path: 'auth/register', name: 'Register', component: Register },
  { path: 'auth/login', name: 'Login', component: Login },
  { path: 'store', name: 'Store', component: Store },
  { path: 'introduce', name: 'Introduce', component: Introduce },
  { path: 'support', name: 'Support', component: Support },
  // ✅ THÊM ID (HOẶC SLUG) VÀO TRANG CHI TIẾT SẢN PHẨM
  { 
    path: 'product/:id', // URL sẽ có dạng /product/123
    name: 'ProductDetail', 
    component: ProductDetail,
    props: true // Tự động truyền id vào làm prop
  },
  { path: '/cart', 
    component: Cart
  },
  { path: '/checkout', 
    component: Checkout
  }
  

];

const adminRouter = [
  { path: '', name: 'Dashboard', component: Dashboard }, // Khớp với '/admin'
  { path: 'auth', name: 'AuthAdmin', component: AuthAdmin },
  { path: 'list-product', name: 'ListProduct', component: ListProduct },
  { path: 'create-product', name: 'CreateProduct', component: CreateProduct },
  
  // ✅ THÊM ID VÀO TRANG SỬA SẢN PHẨM
  {
    path: 'products/update/:id', // URL sẽ có dạng /admin/products/update/123
    name: 'UpdateProduct',       // Tên route để điều hướng
    component: UpdateProduct,
    props: true                  // Tự động truyền id vào làm prop
  },
   { path: '/admin/category', 
    component: CategoryList 
  },
   { path: '/admin/value-attribute', 
    component: ValueAttribute 
  },
   { path: '/admin/option-attribute', 
    component: OptionAttribute 
  },
  { path: "/admin/categories/add", 
    component: CategoryAdd 
  },
  { path: "/admin/categories/edit/:id"
    , component: CategoryAdd 
  },

];

// --- Cấu hình router chính ---
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // ✅ Layout Client nằm ở gốc
      path: '/',
      component: LayoutClient,
      children: clientRouter
    },
    {
      // ✅ Layout Admin có tiền tố riêng, giải quyết xung đột
      path: '/admin',
      component: LayoutAdmin,
      children: adminRouter
    }
  ]
})

export default router