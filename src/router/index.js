import { createRouter, createWebHistory } from 'vue-router'

// --- Layouts --- //
import LayoutClient from '@/layout/LayoutClient.vue';
import LayoutAdmin from '@/layout/LayoutAdmin.vue';

// --- Components --- //
import SwiperProductHome from '@/components/SwiperProductHome.vue';

// --- Auth --- //
import Register from '@/views/auth/Register.vue';
import Login from '@/views/auth/Login.vue';
import OAuth2Success from '@/views/auth/OAuth2Success.vue';

// --- Client Pages --- //
import Home from '@/views/client/Home.vue';
import Store from '@/views/client/Store.vue';
import Introduce from '@/views/client/Introduce.vue';
import Support from '@/views/client/Support.vue';
import ProductDetail from '@/views/client/ProductDetail.vue';
import Cart from '@/views/client/Cart.vue';
import Checkout from '@/views/client/Checkout.vue';
import PaymentResult from '@/views/client/PaymentResult.vue';
import Violate from '@/views/403.vue';

// --- Admin Pages --- //
import Dashboard from '@/views/admin/Dashboard.vue';
import Auth from '@/views/admin/Auth.vue';
import PaymentMethodAdd from '@/views/admin/PaymentMethodAdd.vue';
import PaymentMethodList from '@/views/admin/PaymentMethodList.vue';
import StatusAdd from '@/views/admin/StatusAdd.vue';
import StatusList from '@/views/admin/StatusList.vue';
import ReviewDetail from '@/views/admin/ReviewDetail.vue';
import ReviewList from '@/views/admin/ReviewList.vue';
import FlashSale from '@/views/admin/FlashSale.vue';

// --- Voucher --- //
import ListVoucher from '@/views/admin/voucher/ListVoucher.vue';
import VoucherAdd from '@/views/admin/voucher/VoucherAdd.vue';
import VoucherUpdate from '@/views/admin/voucher/VoucherUpdate.vue';

// --- Product --- //
import CategoryAdd from '@/views/admin/products/CategoryAdd.vue';
import CategoryList from '@/views/admin/products/CategoryList.vue';
import ProductAdd from '@/views/admin/products/ProductAdd.vue';
import ProductUpdate from '@/views/admin/products/ProductUpdate.vue';
import ProductList from '@/views/admin/products/ProductList.vue';
import Attribute from '@/views/admin/products/Attribute.vue';


// --- CLIENT ROUTER --- //
const clientRouter = [
  { path: '', name: 'Home', component: Home },
  { path: 'store', name: 'Store', component: Store },
  { path: 'introduce', name: 'Introduce', component: Introduce },
  { path: 'support', name: 'Support', component: Support },
  { path: 'auth/register', name: 'Register', component: Register },
  { path: 'auth/login', name: 'Login', component: Login },
  { path: '/oauth2/success', name: 'OAuth2Success', component: OAuth2Success },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'swiper', component: SwiperProductHome },
  { 
    path: '/san-pham/:id', 
    name: 'ProductDetail', 
    component: ProductDetail, 
    props: true 
  },
  // ✅ Route kết quả thanh toán
  { 
    path: '/payment-result', 
    name: 'PaymentResult',
    component: PaymentResult 
  },
  { path: '/403', name: 'Violate', component: Violate },
];

// --- ADMIN ROUTER --- //
const adminRouter = [
  { path: '', name: 'Dashboard', component: Dashboard },
  { path: 'auth', name: 'AuthAdmin', component: Auth },
  { path: 'list-product', name: 'ProductList', component: ProductList },
  { path: 'products/update/:id', name: 'UpdateProduct', component: ProductUpdate, props: true },
  { path: 'products/create', name: 'AddProduct', component: ProductAdd },
  { path: 'category', component: CategoryList },
  { path: 'attribute', name: 'Attribute', component: Attribute },
  { path: 'flashsale', name: 'FlashSale', component: FlashSale },
  { path: 'flashsale/:id?', name: 'FlashSaleEdit', component: FlashSale },
  { path: 'categories/add', component: CategoryAdd },
  { path: 'categories/edit/:id', component: CategoryAdd },
  { path: 'status', component: StatusList },
  { path: 'status/add', component: StatusAdd },
  { path: 'status/edit/:id', component: StatusAdd },
  { path: 'payment-method', component: PaymentMethodList },
  { path: 'payment-method/add', component: PaymentMethodAdd },
  { path: 'payment-method/edit/:id', component: PaymentMethodAdd },
  { path: 'review', component: ReviewList },
  { path: 'review/detail/:id', component: ReviewDetail },
  { path: 'list-voucher', component: ListVoucher },
  { path: 'add-voucher', component: VoucherAdd },
  { path: 'update-voucher/:id', component: VoucherUpdate, props: true },
];


// --- MAIN ROUTER --- //
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutClient,
      children: clientRouter,
    },
    {
      path: '/admin',
      component: LayoutAdmin,
      children: adminRouter,
    },
  ],
});

export default router;
