import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSessionStore = defineStore(
  'session',
  () => {
    const accessToken = ref<string | null>(null)

    const isAuthenticated = computed(() => accessToken.value !== null)

    function setSession(token: string) {
      accessToken.value = token
    }

    function clearSession() {
      accessToken.value = null
    }

    return { accessToken, isAuthenticated, setSession, clearSession }
  },
  {
    persist: true,
  },
)
