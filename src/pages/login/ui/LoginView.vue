<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '@/entities/session/api/auth.service'
import { AppButton, AppInput } from '@/shared/ui'

// 1. Повертаємо імпорти VeeValidate та Yup
import { Form } from 'vee-validate'
import * as yup from 'yup'

const router = useRouter()
const sessionStore = useSessionStore()
const authService = ServiceProvider.get<AuthService>('auth')

const globalError = ref('')
const isLoading = ref(false)

// 2. Відновлюємо правила валідації
const schema = yup.object({
  username: yup.string().required('Введіть логін'),
  password: yup.string().required('Введіть пароль'),
})

async function onSubmit(values: any) {
  isLoading.value = true
  globalError.value = ''
  try {
    const response = await authService.login(values.username, values.password)

    sessionStore.setSession(response.accessToken)

    router.push({ name: 'home' })
  } catch (e: any) {
    globalError.value = 'Невірний логін або пароль'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded shadow-md w-full max-w-sm border border-gray-200">
    <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>

    <Form :validation-schema="schema" @submit="onSubmit" class="space-y-4">
      <div
        v-if="globalError"
        class="p-3 bg-red-50 text-red-600 rounded border border-red-200 text-sm"
      >
        {{ globalError }}
      </div>

      <AppInput name="username" label="Username" placeholder="emilys" />

      <AppInput name="password" label="Password" type="password" placeholder="emilyspass" />

      <AppButton type="submit" :disabled="isLoading" class="w-full mt-4">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </AppButton>
    </Form>
  </div>
</template>
