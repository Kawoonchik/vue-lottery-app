import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { LoginResponse } from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // 1. Стан (State): беремо початкові дані з localStorage, якщо вони там є
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const user = ref<Partial<LoginResponse> | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  )

  // 2. Гетери (Getters): зручна перевірка, чи залогінений юзер
  const isAuthenticated = computed(() => !!token.value)

  // 3. Дії (Actions): функції для зміни стану
  const login = async (username: string, password: string) => {
    // Звертаємося до нашого сервісу
    const data = await ServiceProvider.auth.login(username, password)

    // Оновлюємо стан
    token.value = data.accessToken
    user.value = data

    // Зберігаємо в localStorage, щоб не втратити при F5
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data))
  }

  const logout = () => {
    // Очищаємо стан та пам'ять браузера
    token.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, logout }
})
