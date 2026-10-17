import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { User } from '../types/user'

const itemsPerPage = 10

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const searchQuery = ref('')

  const fetchUsers = async (page: number, query: string) => {
    if (users.value.length > 0 && currentPage.value === page && searchQuery.value === query) {
      return
    }

    const data = await ServiceProvider.users.getAll({
      q: query,
      limit: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    })

    users.value = data.items
    totalUsers.value = data.total
    currentPage.value = page
    searchQuery.value = query
  }

  const getUserById = async (id: number): Promise<User> => {
    const user = users.value.find((item) => item.id === id)
    if (user) return user

    return ServiceProvider.users.getById(id)
  }

  const addUser = (user: User) => {
    users.value.unshift(user)
  }

  const updateUser = (id: number, updatedUser: User) => {
    const index = users.value.findIndex((user) => user.id === id)
    if (index !== -1) users.value[index] = updatedUser
  }

  const removeUser = (id: number) => {
    users.value = users.value.filter((user) => user.id !== id)
  }

  return {
    users,
    totalUsers,
    currentPage,
    searchQuery,
    fetchUsers,
    getUserById,
    addUser,
    updateUser,
    removeUser,
  }
})
