<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const globalError = ref('')

// Схема валідації VeeValidate + Yup
const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

// Функція спрацює лише якщо валідація пройдена успішно
const onSubmit = async (values: any) => {
  isLoading.value = true
  globalError.value = ''

  try {
    await authStore.login(values.username, values.password)

    // Повертаємо юзера туди, куди він намагався зайти до логіну, або на сторінку /users
    const redirectPath = route.query.redirect?.toString() || '/users'
    router.push(redirectPath)
  } catch (e: any) {
    console.error('Login error:', e) // Виводимо реальну помилку в консоль
    globalError.value = `Помилка: ${e.message}`
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded shadow-md w-full max-w-sm border border-gray-200">
    <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>

    <!-- Компонент Form із VeeValidate -->
    <Form :validation-schema="schema" @submit="onSubmit" class="space-y-4">
      <!-- Помилка від сервера (якщо невірний пароль) -->
      <div
        v-if="globalError"
        class="p-3 bg-red-50 text-red-600 rounded border border-red-200 text-sm"
      >
        {{ globalError }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <!-- Компонент Field із VeeValidate замінює звичайний input -->
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
