<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '@/entities/session/api/auth.service'
import { Form, type GenericObject } from 'vee-validate'
import * as yup from 'yup'
import { AppButton, AppInput, useAppToast } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()
const authService = ServiceProvider.get<AuthService>('auth')
const appToast = useAppToast()

const isLoading = ref(false)

const schema = yup.object({
  username: yup.string().required('Введіть логін'),
  password: yup.string().required('Введіть пароль'),
})

async function onSubmit(values: GenericObject) {
  const { username, password } = values
  if (typeof username !== 'string' || typeof password !== 'string') {
    appToast.error('Помилка входу', 'Невірний логін або пароль')
    return
  }

  isLoading.value = true
  try {
    const response = await authService.login(username, password)

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

    <Form :validation-schema="schema" @submit="onSubmit" class="space-y-4">
      <AppInput name="username" label="Username" placeholder="emilys" />

      <AppInput name="password" label="Password" type="password" placeholder="emilyspass" />

      <AppButton type="submit" :disabled="isLoading" class="w-full mt-4">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </AppButton>
    </Form>
  </div>
</template>
