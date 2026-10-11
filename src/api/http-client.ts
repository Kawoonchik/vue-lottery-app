const BASE_URL = import.meta.env.VITE_API_URL

// Допоміжні функції для роботи з localStorage
const getAccessToken = () => localStorage.getItem('accessToken')
const getRefreshToken = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr).refreshToken : null
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  // 1. Автоматично додаємо токен до КОЖНОГО запиту
  const token = getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = { ...options, headers }

  // Робимо оригінальний запит
  let response = await fetch(`${BASE_URL}${path}`, config)

  // 2. Перехоплювач (Interceptor): якщо сервер каже 401 (Токен прострочено)
  if (response.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    const refreshToken = getRefreshToken()

    if (refreshToken) {
      try {
        // Пробуємо отримати новий токен
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
        })

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()

          // Зберігаємо новий токен у пам'ять
          localStorage.setItem('accessToken', refreshData.accessToken)
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const userObj = JSON.parse(userStr)
            userObj.accessToken = refreshData.accessToken
            userObj.refreshToken = refreshData.refreshToken
            localStorage.setItem('user', JSON.stringify(userObj))
          }

          // Повторюємо оригінальний запит, але ВЖЕ З НОВИМ токеном
          headers['Authorization'] = `Bearer ${refreshData.accessToken}`
          response = await fetch(`${BASE_URL}${path}`, { ...config, headers })
        } else {
          throw new Error('Refresh token expired')
        }
      } catch (e) {
        // Якщо навіть refresh token прострочений — розлогінюємо і викидаємо на логін
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Session expired, please login again')
      }
    }
  }

  // Обробка інших помилок
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} : ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
