import { http, type Readable, type Creatable, type Editable, type Deletable } from '@/shared/api'
import type { User, CreateUserDto, UpdateUserDto } from '../model/types'

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll(
    params: { limit?: number; skip?: number; q?: string } = {},
  ): Promise<{ items: User[]; total: number }> {
    const { limit = 10, skip = 0, q = '' } = params

    let url = `/users?limit=${limit}&skip=${skip}`
    if (q) {
      url = `/users/search?q=${q}&limit=${limit}&skip=${skip}`
    }

    const data = await http<UsersResponse>(url)
    return { items: data.users, total: data.total }
  }

  getById(id: number | string): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  update(id: number | string, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(id: number | string): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' })
  }

  async search(query: string) {
    return http<{ users: User[]; total: number }>(`/users/search?q=${query}`)
  }
}
