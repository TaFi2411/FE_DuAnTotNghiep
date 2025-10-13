import { createRouter, createWebHistory } from 'vue-router'

import LayoutClient from '@/layout/LayoutClient.vue';
import LayoutAdmin from '@/layout/LayoutAdmin.vue';
//auth
import Register from '@/views/auth/Register.vue';
import Login from '@/views/auth/Login.vue';

//client
import Home from '@/views/client/Home.vue';
import Store from '@/views/client/Store.vue';
import Introduce from '../views/client/Introduce.vue';
import Support from '@/views/client/Support.vue';
import ProductDetail from '@/views/client/ProductDetail.vue';
import Cart from '@/views/client/Cart.vue';
import Checkout from '@/views/client/Checkout.vue';

//admin
import Dashboard from '@/views/admin/Dashboard.vue';
import Auth from '@/views/admin/Auth.vue';
import Product from '@/views/products/Product.vue';
import Category from '@/views/products/Category.vue';
import ValueAttribute from '@/views/products/ValueAttribute.vue';
import OptionAttribute from '@/views/products/OptionAttribute.vue';

const clientRouter =[
  { path: '/auth/register', 
    component: Register 
  },
  { path: '/auth/login', 
    component: Login 
  },
  { path: '/', 
    component: Home 
  },
  { path: '/store', 
    component: Store 
  },
  { path: '/introduce', 
    component: Introduce 
  },
  { path: '/support', 
    component: Support 
  },
  { path: '/product-detail', 
    component: ProductDetail 
  },
  { path: '/cart', 
    component: Cart
  },
  { path: '/checkout', 
    component: Checkout
  },
  

];

const adminRouter =[
   { path: '/admin/dashboard', 
    component: Dashboard 
  },
   { path: '/admin/auth', 
    component: Auth 
  },
   { path: '/admin/product', 
    component: Product 
  },
   { path: '/admin/category', 
    component: Category 
  },
   { path: '/admin/value-attribute', 
    component: ValueAttribute 
  },
   { path: '/admin/option-attribute', 
    component: OptionAttribute 
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
      name: 'layoutAdmin',
      component: LayoutAdmin,
      children: adminRouter
    },

  ]
})


export default router
