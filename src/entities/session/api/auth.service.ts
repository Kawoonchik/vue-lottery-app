import { http } from '@/shared/api'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}

export class AuthService {
  login(username: string, password: string): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  getCurrentUser(token: string): Promise<any> {
    return http<any>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
