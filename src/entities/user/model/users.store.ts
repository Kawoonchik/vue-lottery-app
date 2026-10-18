import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { UserService } from '../api/user.service'
import type { User, CreateUserDto, UpdateUserDto } from './types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const currentPage = ref(1)
  const currentQuery = ref('')

  const hasUsers = computed(() => users.value.length > 0)

  //сервіс із реєстру
  const service = () => ServiceProvider.get<UserService>('users')

  async function fetchUsers(limit = 10, skip = 0, search = '') {
    const page = Math.floor(skip / limit) + 1

    if (hasUsers.value && currentPage.value === page && currentQuery.value === search) {
      return
    }

    isLoading.value = true
    error.value = null
    try {
      let data
      if (search) {
        data = await service().search(search)
      } else {
        data = await service().getAll({ limit, skip })
      }

      users.value = 'users' in data ? data.users : data.items
      total.value = data.total
      currentPage.value = page
      currentQuery.value = search
    } catch (e: any) {
      error.value = e.message || 'Failed to load users'
    } finally {
      isLoading.value = false
    }
  }

  //Імітація змін
  async function removeUser(id: number) {
    try {
      await service().delete(id)
      users.value = users.value.filter((u) => u.id !== id)
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function updateUser(id: number, updatedData: UpdateUserDto) {
    try {
      const result = await service().update(id, updatedData)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...result }
      }
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function createUser(userData: CreateUserDto) {
    try {
      const result = await service().create(userData)
      //Додаємо нового фейкового юзера на початок масиву
      users.value.unshift(result)
    } catch (e: any) {
      error.value = e.message
    }
  }

  return {
    users,
    total,
    isLoading,
    error,
    hasUsers,
    currentPage,
    currentQuery,
    fetchUsers,
    removeUser,
    updateUser,
    createUser,
  }
})
