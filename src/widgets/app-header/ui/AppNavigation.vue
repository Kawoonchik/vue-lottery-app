<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useSessionStore as useAuthStore } from '@/entities/session'
import { computed } from 'vue'
import { useThemeStore } from '@/entities/theme'

const themeStore = useThemeStore()

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.clearSession()
  router.push('/login') // Після виходу редірект на сторінку логіну
}
</script>

<template>
  <nav class="flex gap-6 items-center">
    <RouterLink
      to="/"
      class="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      exact-active-class="!text-blue-600 border-b-2 border-blue-600"
    >
      Home
    </RouterLink>
    <RouterLink
      to="/about"
      class="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      active-class="!text-blue-600 border-b-2 border-blue-600"
    >
      About author
    </RouterLink>

    <RouterLink
      v-if="isAuthenticated"
      to="/users"
      class="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      active-class="!text-blue-600 border-b-2 border-blue-600"
    >
      Users
    </RouterLink>

    <button
      v-if="isAuthenticated"
      @click="handleLogout"
      class="text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
    >
      Logout
    </button>
    <RouterLink
      v-else
      to="/login"
      class="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      active-class="!text-blue-600 border-b-2 border-blue-600"
    >
      Login
    </RouterLink>

    <button
      @click="themeStore.toggleTheme()"
      class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
    >
      {{ themeStore.isDark ? '🌙 Dark' : '☀️ Light' }}
    </button>
  </nav>
</template>
