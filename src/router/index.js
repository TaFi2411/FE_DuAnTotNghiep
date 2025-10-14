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
import PaymentMethodAdd from '@/views/admin/PaymentMethodAdd.vue';
import PaymentMethodList from '@/views/admin/PaymentMethodList.vue';
import StatusAdd from '@/views/admin/StatusAdd.vue';
import StatusList from '@/views/admin/StatusList.vue';
import ReviewDetail from '@/views/admin/ReviewDetail.vue';
import ReviewList from '@/views/admin/ReviewList.vue';

//Admin Product
import CategoryAdd from '@/views/admin/products/CategoryAdd.vue';
import CategoryList from '@/views/admin/products/CategoryList.vue';
import ListProduct from '@/views/admin/products/ListProduct.vue';
import UpdateProduct from '@/views/admin/products/ProductUpdate.vue';
import Attribute from '@/views/admin/products/Attribute.vue';

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

  // {
  //   path: 'product/:id', // URL sẽ có dạng /product/123
  //   name: 'ProductDetail',
  //   component: ProductDetail,
  //   props: true // Tự động truyền id vào làm prop
  // },
  {
    path: 'product-details', // URL sẽ có dạng /product/123
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
    path: '/category',
    component: CategoryList
  },
  {
    path: '/attribute',
    component: Attribute
  },
  {
    path: "/categories/add",
    component: CategoryAdd
  },
  {
    path: "/categories/edit/:id", 
    component: CategoryAdd
  },
  {
    path: '/status',
    component:StatusList,
  },
  {
    path: '/status/add',
    component: StatusAdd,
  },
  {
    path: '/status/edit/:id',
    component: StatusAdd,
  },
{
  path: '/payment-method',
  name: 'PaymentMethodList',
  component: PaymentMethodList,
},
{
  path: '/payment-method/add',
  name: 'PaymentMethodAdd',
  component: PaymentMethodAdd,
},
{
  path: '/payment-method/edit/:id',
  name: 'PaymentMethodEdit',
  component: PaymentMethodAdd,
},
{
  path: "/review",
  component: ReviewList,
},
{
  path: "/review/detail/:id",
  component: ReviewDetail,
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