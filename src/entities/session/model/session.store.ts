import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'session'

export const useSessionStore = defineStore('session', () => {
  //State)
  const accessToken = ref<string | null>(localStorage.getItem(`${STORAGE_KEY}:token`))

  // Getters)
  const isAuthenticated = computed(() => accessToken.value !== null)

  // Actions)
  function setSession(token: string) {
    accessToken.value = token
    localStorage.setItem(`${STORAGE_KEY}:token`, token)
  }

  function clearSession() {
    accessToken.value = null
    localStorage.removeItem(`${STORAGE_KEY}:token`)
  }

  return { accessToken, isAuthenticated, setSession, clearSession }
})
