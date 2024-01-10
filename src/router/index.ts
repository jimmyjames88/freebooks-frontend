import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/dashboard/Index.vue')
  },
  {
    path: '/auth/login',
    name: 'Auth/Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/auth/register',
    name: 'Auth/Register',
    component: () => import('../views/auth/Register.vue'),
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
    path: '/clients/:clientId/edit',
    name: 'Clients/Edit',
    component: () => import('../views/clients/Edit.vue')
  },
  {
    path: '/clients/:clientId/delete',
    name: 'Clients/Delete',
    component: () => import('../views/clients/Delete.vue')
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
    path: '/invoices/:invoiceId/edit',
    name: 'Invoices/Edit',
    component: () => import('../views/invoices/Edit.vue')
  },
  {
    path: '/invoices/:invoiceId/delete',
    name: 'Invoices/Delete',
    component: () => import('../views/invoices/Delete.vue')
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
  if (!to.meta.public && !authStore.loggedIn) {
    return next({ name: 'Auth/Login' })
  } 
  if (to.name === 'Auth/Login' && authStore.loggedIn) {
    return next({ name: 'Dashboard' })
  }
  next()
})

export default router
