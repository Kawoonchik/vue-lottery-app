const BASE_URL = import.meta.env.VITE_API_URL

// localStorage
const getAccessToken = () => localStorage.getItem('accessToken')
const getRefreshToken = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr).refreshToken : null
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = { ...options, headers }

  let response = await fetch(`${BASE_URL}${path}`, config)

  if (response.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    const refreshToken = getRefreshToken()

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
        })

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()

          localStorage.setItem('accessToken', refreshData.accessToken)
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const userObj = JSON.parse(userStr)
            userObj.accessToken = refreshData.accessToken
            userObj.refreshToken = refreshData.refreshToken
            localStorage.setItem('user', JSON.stringify(userObj))
          }

          headers['Authorization'] = `Bearer ${refreshData.accessToken}`
          response = await fetch(`${BASE_URL}${path}`, { ...config, headers })
        } else {
          throw new Error('Refresh token expired')
        }
      } catch (e) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Session expired, please login again')
      }
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} : ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
