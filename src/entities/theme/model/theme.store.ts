import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const isDark = ref(false)

    const toggleTheme = () => {
      isDark.value = !isDark.value
    }

    watch(
      isDark,
      (newVal) => {
        document.documentElement.classList.toggle('app-dark', newVal)
      },
      { immediate: true, flush: 'sync' },
    )

    return { isDark, toggleTheme }
  },
  {
    persist: true,
  },
)
