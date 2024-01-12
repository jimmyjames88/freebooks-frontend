import { NavigationHookAfter, RouteComponent, RouteLocation, createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/dashboard/Index.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/auth/login',
    name: 'Auth/Login',
    component: () => import('../views/auth/Login.vue'),
    meta: {
      title: 'Login', 
      public: true
    }
  },
  {
    path: '/auth/register',
    name: 'Auth/Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { 
      title: 'Register',
      public: true
    }
  },
  {
    path: '/clients',
    name: 'Clients/Index',
    component: () => import('../views/clients/Index.vue'),
    meta: { title: 'Clients' }
  },
  {
    path: '/clients/create',
    name: 'Clients/Create',
    component: () => import('../views/clients/Create.vue'),
    meta: { title: 'Create Client' }
  },
  {
    path: '/clients/:clientId/edit',
    name: 'Clients/Edit',
    component: () => import('../views/clients/Edit.vue'),
    meta: { title: 'Edit Client' }
  },
  {
    path: '/clients/:clientId/delete',
    name: 'Clients/Delete',
    component: () => import('../views/clients/Delete.vue'),
    meta: { title: 'Delete Client' }
  },
  {
    path: '/clients/:clientId',
    name: 'Clients/Show',
    component: () => import('../views/clients/Show.vue'),
    meta: { title: 'Client Details' }
  },
  {
    path: '/invoices',
    name: 'Invoices/Index',
    component: () => import('../views/invoices/Index.vue'),
    meta: { title: 'Invoices' }
  },
  {
    path: '/invoices/create',
    name: 'Invoices/Create',
    component: () => import('../views/invoices/Create.vue'),
    meta: { title: 'Create Invoice' }
  },
  {
    path: '/invoices/:invoiceId/edit',
    name: 'Invoices/Edit',
    component: () => import('../views/invoices/Edit.vue'),
    meta: { title: 'Edit Invoice' }
  },
  {
    path: '/invoices/:invoiceId/delete',
    name: 'Invoices/Delete',
    component: () => import('../views/invoices/Delete.vue'),
    meta: { title: 'Delete Invoice' }
  },
  {
    path: '/invoices/:invoiceId',
    name: 'Invoices/Show',
    component: () => import('../views/invoices/Show.vue'),
    meta: { title: 'Invoice Details' }
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

// Set document title
router.afterEach((to: RouteLocation) => {
  document.title = `FreeBooks - ${to.meta.title}` || 'FreeBooks'
})

export default router
