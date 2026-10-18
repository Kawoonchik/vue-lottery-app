<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '@/entities/session/api/auth.service'
import { Form, Field, ErrorMessage } from 'vee-validate'

const router = useRouter()
const sessionStore = useSessionStore()
const authService = ServiceProvider.get<AuthService>('auth')

const globalError = ref('')
const isLoading = ref(false)

// 2. Схема валідації (якщо юзаєш yup + VeeValidate)
// const schema = yup.object({
//   username: yup.string().required(),
//   password: yup.string().required(),
// })
const schema = {}

// 3. Функція onSubmit (на яку свариться Vue)
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

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <Field
          name="username"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
          placeholder="emilys"
        />
        <ErrorMessage name="username" class="text-red-500 text-xs mt-1 block" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <Field
          name="password"
          type="password"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
          placeholder="emilyspass"
        />
        <ErrorMessage name="password" class="text-red-500 text-xs mt-1 block" />
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </Form>
  </div>
</template>
