import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // Ліниве завантаження компонента
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Home | Lottery App' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About Author | Lottery App' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { title: 'Users | Lottery App', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login | Lottery App', layout: 'AuthLayout' },
    },
    {
      // Catch-all маршрут для сторінки 404
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '404 Not Found | Lottery App' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Якщо маршрут захищений і юзер не залогінений
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // Якщо юзер вже залогінений, йому не треба сторінка логіну
  else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'users' })
  }
  // В усіх інших випадках пропускаємо
  else {
    next()
  }
})

// Автоматична зміна заголовка вкладки браузера
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
