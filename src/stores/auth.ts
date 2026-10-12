import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { LoginResponse } from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const user = ref<Partial<LoginResponse> | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  )

  const isAuthenticated = computed(() => !!token.value)

  const login = async (username: string, password: string) => {
    const data = await ServiceProvider.auth.login(username, password)

    token.value = data.accessToken
    user.value = data

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, logout }
})
