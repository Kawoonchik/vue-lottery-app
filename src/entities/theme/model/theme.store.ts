import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Зчитуємо початковий стан з localStorage
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // Слідкуємо за зміною теми: оновлюємо localStorage та HTML-клас
  watch(
    isDark,
    (newVal) => {
      localStorage.setItem('theme', newVal ? 'dark' : 'light')
      if (newVal) {
        document.documentElement.classList.add('app-dark')
      } else {
        document.documentElement.classList.remove('app-dark')
      }
    },
    { immediate: true },
  ) // immediate: true застосує тему одразу при завантаженні сторінки

  return { isDark, toggleTheme }
})
