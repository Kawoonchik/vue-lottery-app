<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '@/entities/session'
import { LoginForm } from '@/features/auth'
import { useAppToast } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()
const authService = ServiceProvider.get<AuthService>('auth')
const appToast = useAppToast()

const isLoading = ref(false)

async function onSubmit(credentials: { username: string; password: string }) {
  isLoading.value = true
  try {
    const response = await authService.login(credentials.username, credentials.password)

    sessionStore.setSession(response.accessToken)

    router.push({ name: 'home' })
  } catch {
    appToast.error('Помилка входу', 'Невірний логін або пароль')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded shadow-md w-full max-w-sm border border-gray-200">
    <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>

    <LoginForm :is-loading="isLoading" @submit="onSubmit" />
  </div>
</template>
