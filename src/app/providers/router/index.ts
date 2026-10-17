import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore as useAuthStore } from '@/entities/session'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/ui/HomeView.vue'),
      meta: { title: 'Home | Lottery App' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about/ui/AboutView.vue'),
      meta: { title: 'About Author | Lottery App' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/users/ui/UsersView.vue'),
      meta: { title: 'Users | Lottery App', requiresAuth: true },
    },
    {
      path: '/users/:id',
      name: 'user-details',
      component: () => import('@/pages/user-details/ui/UserView.vue'),
      props: true,
      meta: { requiresAuth: true, title: 'User Profile | Lottery App' },
      children: [
        {
          path: 'edit',
          name: 'user-edit',
          component: () => import('@/pages/user-details/ui/UserEditView.vue'),
          meta: { title: 'Edit User | Lottery App' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/ui/LoginView.vue'),
      meta: { title: 'Login | Lottery App', layout: 'AuthLayout' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/ui/NotFoundView.vue'),
      meta: { title: '404 Not Found | Lottery App' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'users' })
  } else {
    next()
  }
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
