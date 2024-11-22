import { RouteLocation, createRouter, createWebHistory } from 'vue-router'
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
    path: '/clients/:ClientId/edit',
    name: 'Clients/Edit',
    component: () => import('../views/clients/Edit.vue'),
    meta: { title: 'Edit Client' }
  },
  {
    path: '/clients/:ClientId/delete',
    name: 'Clients/Delete',
    component: () => import('../views/clients/Delete.vue'),
    meta: { title: 'Delete Client' }
  },
  {
    path: '/clients/:ClientId',
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
    path: '/invoices/:InvoiceId/edit',
    name: 'Invoices/Edit',
    component: () => import('../views/invoices/Edit.vue'),
    meta: { title: 'Edit Invoice' }
  },
  {
    path: '/invoices/:InvoiceId/delete',
    name: 'Invoices/Delete',
    component: () => import('../views/invoices/Delete.vue'),
    meta: { title: 'Delete Invoice' }
  },
  {
    path: '/invoices/:InvoiceId',
    name: 'Invoices/Show',
    component: () => import('../views/invoices/Show.vue'),
    meta: { title: 'Invoice Details' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings/Index.vue'),
    meta: { title: 'Settings' }
  },
  {
    path: '/settings/taxes/create',
    name: 'Settings/Taxes/Create',
    component: () => import('../views/settings/taxes/Create.vue'),
    meta: { title: 'Create Tax' }
  },
  {
    path: '/settings/taxes/:taxId/edit',
    name: 'Settings/Taxes/Edit',
    component: () => import('../views/settings/taxes/Edit.vue'),
    meta: { title: 'Edit Tax' }
  },
  {
    path: '/payments',
    name: 'Payments/Index',
    component: () => import('../views/payments/Index.vue'),
    meta: { title: 'Payments' }
  },
  {
    path: '/expenses',
    name: 'Expenses/Index',
    component: () => import('../views/expenses/Index.vue'),
    meta: { title: 'Expenses' }
  },
  {
    path: '/expenses/create',
    name: 'Expenses/Create',
    component: () => import('../views/expenses/Create.vue'),
    meta: { title: 'Create Expense' }
  },
  {
    path: '/expenses/:ExpenseId/edit',
    name: 'Expenses/Edit',
    component: () => import('../views/expenses/Edit.vue'),
    meta: { title: 'Edit Expense' }
  },
  {
    path: '/expenses/:ExpenseId/delete',
    name: 'Expenses/Delete',
    component: () => import('../views/expenses/Delete.vue'),
    meta: { title: 'Delete Expense' }
  },
  {
    path: '/expenses/:ExpenseId',
    name: 'Expenses/Show',
    component: () => import('../views/expenses/Show.vue'),
    meta: { title: 'Expense Details' }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
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
