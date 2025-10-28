import { createRouter, createWebHistory } from "vue-router";

// --- Layouts --- //
import LayoutClient from "@/layout/LayoutClient.vue";
import LayoutAdmin from "@/layout/LayoutAdmin.vue";

// --- Import các component ---//
// --- Components --- //
import SwiperProductHome from "@/components/SwiperProductHome.vue";

// --- Auth --- //
import Register from "@/views/auth/Register.vue";
import Login from "@/views/auth/Login.vue";
import OAuth2Success from "@/views/auth/OAuth2Success.vue";

// Client
// --- Client Pages --- //
import Home from "@/views/client/Home.vue";
import Store from "@/views/client/Store.vue";
import Introduce from "../views/client/Introduce.vue";
import Support from "@/views/client/Support.vue";
import ProductDetail from "@/views/client/ProductDetail.vue";
import Cart from "@/views/client/Cart.vue";
import Checkout from "@/views/client/Checkout.vue";
import Violate from "@/views/403.vue";
import PaymentResult from "@/views/client/PaymentResult.vue";
import FlashSaleSkuUser from '@/components/FlashSaleSku.vue';

// Admin
import Dashboard from '@/views/admin/Dashboard.vue';
import Auth from '@/views/admin/Auth.vue';
import paymentMethod from '@/views/admin/PaymentMethod.vue';
import ReviewDetail from '@/views/admin/ReviewDetail.vue';
import ReviewList from '@/views/admin/ReviewList.vue';
import Status from '@/views/admin/Status.vue';

// Admin Voucher
import ListVoucher from '@/views/admin/voucher/ListVoucher.vue';
import VoucherAdd from '@/views/admin/voucher/VoucherAdd.vue';
import VoucherUpdate from '@/views/admin/voucher/VoucherUpdate.vue';

//Admin Product
import CategoryAdd from "@/views/admin/products/CategoryAdd.vue";
import CategoryList from "@/views/admin/products/CategoryList.vue";
import ProductAdd from "@/views/admin/products/ProductAdd.vue";
import ProductUpdate from "@/views/admin/products/ProductUpdate.vue";
import ProductList from "@/views/admin/products/ProductList.vue";
import Attribute from "@/views/admin/products/Attribute.vue";
import FlashSale from "@/views/admin/FlashSale.vue";


// --- Định nghĩa các route con ---
// --- CLIENT ROUTER --- //
const clientRouter = [
  {
    path: "",
    name: "Home",
    component: Home,
  },
  {
    path: 'flash-sale-sku-user',
    name: 'FlashSaleSkuUser',
    component: FlashSaleSkuUser
  },
  {
    path: "",
    name: "Violate",
    component: Violate,
  },
  {
    path: "auth/register",
    name: "Register",
    component: Register,
  },
  {
    path: "auth/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/oauth2/success",
    name: "OAuth2Success",
    component: OAuth2Success,
  },
  {
    path: "store",
    name: "Store",
    component: Store,
  },
  {
    path: "introduce",
    name: "Introduce",
    component: Introduce,
  },
  {
    path: "support",
    name: "Support",
    component: Support,
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true,
  },
  {
    path: "/cart",
    component: Cart,
  },
  {
    path: "/checkout",
    component: Checkout,
  },
  {
    path: "/SwiperProductHome",
    component: SwiperProductHome,
  },

  {

    path: '',
    name: 'Violate',
    component: Violate
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
    path: '/oauth2/success',
    name: 'OAuth2Success',
    component: OAuth2Success
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
    path: 'product/:id',
    name: 'ProductDetail',

    path: "/san-pham/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true,
  },


  {
    path: "/payment-result",
    name: "PaymentResult",
    component: PaymentResult,
  },

  {
    path: '/checkout',
    component: Checkout
  },

  {
    path: "/403",
    name: "Violate",
    component: Violate
  },

];

// --- ADMIN ROUTER --- //
const adminRouter = [
  {
    path: "",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "auth",
    name: "AuthAdmin",
    component: Auth,
  },
  {
    path: "list-product",
    name: "ListProduct",
    component: ProductList,
  },
  {
    path: "product/update/:id",
    name: "UpdateProduct",
    component: ProductUpdate,
    props: true,
  },
  {
    path: "product/create",
    name: "AddProduct",
    component: ProductAdd,
  },
  {
    path: "category",
    component: CategoryList,
  },
  {
    path: "attribute",
    name: "Attribute",
    component: Attribute,
  },
  {
    path: "flashsale",
    name: "FlashSale",
    component: FlashSale,
  },
  {
    path: "flashsale/:id?",
    name: "FlashSale",
    component: FlashSale,
  },

  {
    path: "categories/add",
    component: CategoryAdd,
  },
  {
    path: "/categories/edit/:id",
    component: CategoryAdd,
  },

  {

    path: '/status',
    name: 'status',
    component: Status,
  },
  {
    path: '/paymentMethod',
    name: 'paymentMethod',
    component: paymentMethod,
  },
  {
    path: "/review",
    component: ReviewList,
  },
  {
    path: "/review/detail/:id",
    component: ReviewDetail,
  },

  {
    path: "/review",
    component: ReviewList,
  },
  {
    path: "/review/detail/:id",
    component: ReviewDetail,
  },
  {
    path: "categories/edit/:id",
    component: CategoryAdd

  },
  {
    path: "list-voucher",
    name: "ListVoucher",
    component: ListVoucher,
  },
  {
    path: "add-voucher",
    name: "VoucherAdd",
    component: VoucherAdd,
  },
  {
    path: "update-voucher/:id",
    name: "VoucherUpdate",
    component: VoucherUpdate,
    props: true,
  },
];

// --- MAIN ROUTER --- //
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LayoutClient,
      children: clientRouter,
    },
    {
      path: "/admin",
      component: LayoutAdmin,
      children: adminRouter,
      meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
    },
  ],
});

function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (e) {
    console.error("❌ Lỗi decode token:", e);
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtToken(token);
  if (!payload) return true;
  const now = Date.now() / 1000;
  return payload.exp && payload.exp < now;
}


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Nếu có token thì kiểm tra hạn
  if (token && isTokenExpired(token)) {
    console.warn("⚠️ Token hết hạn — đăng xuất tự động");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return next({ name: "Login" });
  }

  // Nếu route yêu cầu đăng nhập
  if (to.meta.requiresAuth) {
    if (!token) {
      console.warn("⚠️ Chưa đăng nhập — chuyển về Login");
      return next({ name: "Login" });
    }

    // Kiểm tra quyền
    if (to.meta.role && to.meta.role !== role) {
      console.warn(
        `⛔ Truy cập bị chặn | Yêu cầu: ${to.meta.role} | Hiện tại: ${role}`
      );
      return next({ name: "Violate" });
    }
  }

  next();
});


export default router;
