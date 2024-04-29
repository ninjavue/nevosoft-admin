import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/RegisterView.vue'
import VueCookies from 'vue-cookies';

const routes = [
  {
    path: '/',
    name: 'register',
    component: Register,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/dashboard',
    component: () => import(/* webpackChunkName: "admin" */ '../views/AdminView.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/DashboardView.vue')
      },
      {
        path: 'employees',
        name: 'employees',
        component: () => import(/* webpackChunkName: "employees" */ '../views/EmpolesView.vue')
      },
      {
        path: 'services',
        name: 'services',
        component: () => import(/* webpackChunkName: "services" */ '../views/ServicesView.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/OrderView.vue')
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import(/* webpackChunkName: "admin" */ '../views/AdminsView.vue')
      },
      {
        path: 'product',
        name: 'product',
        component: () => import(/* webpackChunkName: "product" */ '../views/ProductView.vue')
      },
      {
        path: 'question',
        name: 'question',
        component: () => import(/* webpackChunkName: "question" */ '../views/QuestionView.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // Authentication
  const isLoggedIn = VueCookies.get('accessToken')
  const token = isLoggedIn + 'addeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  const isLoggedIn2 = localStorage.getItem('adc_token')

  if (!isLoggedIn && !isLoggedIn2 && token != isLoggedIn2 && to.meta.requiresAuth) {
    next({ name: 'register' });
  }else if (token == isLoggedIn2 && to.name === 'register') {
    next({ name: 'admin' });
  } else {
    next();
  }
});

export default router
