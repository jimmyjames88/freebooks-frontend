import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'

const routes = [
  {
    path: '/auth/login',
    name: 'Auth/Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/clients',
    name: 'Clients/Index',
    component: () => import('../views/clients/Index.vue')
  },
  {
    path: '/clients/create',
    name: 'Clients/Create',
    component: () => import('../views/clients/Create.vue')
  },
  {
    path: '/clients/:clientId',
    name: 'Clients/Show',
    component: () => import('../views/clients/Show.vue')
  },
  {
    path: '/invoices',
    name: 'Invoices/Index',
    component: () => import('../views/invoices/Index.vue')
  },
  {
    path: '/invoices/create',
    name: 'Invoices/Create',
    component: () => import('../views/invoices/Create.vue')
  },
  {
    path: '/invoices/:invoiceId',
    name: 'Invoices/Show',
    component: () => import('../views/invoices/Show.vue')
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log(authStore.loggedIn)
  if (!to.meta.public && !authStore.loggedIn) {
    return next({ name: 'Auth/Login' })
  } 
  next()
})

export default router
