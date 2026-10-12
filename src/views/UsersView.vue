<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ServiceProvider } from '../services/service-provider'
import type { User, CreateUserDto } from '../types/user'
import ParticipantsTable from '../components/blocks/ParticipantsTable.vue'
import SearchBar from '../components/ui/SearchBar.vue'
import AppModal from '../components/ui/AppModal.vue'
import RegistrationForm from '../components/blocks/RegistrationForm.vue'

const route = useRoute()
const router = useRouter()

const users = ref<User[]>([])
const isLoading = ref(false)
const isMutating = ref(false)
const globalError = ref<string | null>(null)

//URL State
const searchQuery = ref((route.query.q as string) || '')
const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = 10
const totalUsers = ref(0)

// Модалки
const isAddModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedUser = ref<User | null>(null)
const winners = ref<User[]>([])

//Завантаження
const fetchUsers = async () => {
  isLoading.value = true
  globalError.value = null
  try {
    const skip = (currentPage.value - 1) * itemsPerPage
    const data = await ServiceProvider.users.getAll({
      q: searchQuery.value,
      limit: itemsPerPage,
      skip: skip,
    })

    users.value = data.items
    totalUsers.value = data.total
  } catch (e: any) {
    globalError.value = 'Failed to load users: ' + e.message
  } finally {
    isLoading.value = false
  }
}

const updateUrl = () => {
  router.replace({
    query: {
      q: searchQuery.value ? searchQuery.value : undefined,
      page: currentPage.value > 1 ? currentPage.value : undefined,
    },
  })
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
  updateUrl()
}

// Пагінація
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    updateUrl()
  }
}

const nextPage = () => {
  if (currentPage.value * itemsPerPage < totalUsers.value) {
    currentPage.value++
    updateUrl()
  }
}

onMounted(() => fetchUsers())
watch([searchQuery, currentPage], () => fetchUsers())

const handleAddUser = async (values: CreateUserDto) => {
  isMutating.value = true
  try {
    const newUser = await ServiceProvider.users.create(values)
    users.value.unshift(newUser)
    isAddModalOpen.value = false
  } catch (e: any) {
    globalError.value = 'Error creating user'
  } finally {
    isMutating.value = false
  }
}

const requestDelete = (user: User) => {
  selectedUser.value = user
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedUser.value) return
  const deletedUserId = selectedUser.value.id
  isMutating.value = true
  try {
    await ServiceProvider.users.delete(deletedUserId)
    users.value = users.value.filter((u) => u.id !== deletedUserId)
    winners.value = winners.value.filter((winner) => winner.id !== deletedUserId)
    isDeleteModalOpen.value = false
  } catch (e: any) {
    globalError.value = 'Error deleting user'
  } finally {
    isMutating.value = false
    selectedUser.value = null
  }
}

const requestEdit = (user: User) => {
  router.push(`/users/${user.id}/edit`)
}

const drawWinner = () => {
  if (winners.value.length >= 3) return

  const eligibleUsers = users.value.filter(
    (user) => !winners.value.some((winner) => winner.id === user.id),
  )
  if (eligibleUsers.length === 0) return

  const winnerIndex = Math.floor(Math.random() * eligibleUsers.length)
  const winner = eligibleUsers[winnerIndex]
  if (!winner) return

  winners.value.push(winner)
}

const removeWinner = (id: number) => {
  winners.value = winners.value.filter((winner) => winner.id !== id)
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Users Directory</h1>
      <div class="flex gap-3">
        <button
          @click="drawWinner"
          :disabled="winners.length === 3"
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Draw Winner
        </button>
        <button
          @click="isAddModalOpen = true"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm"
        >
          + Add User
        </button>
      </div>
    </div>

    <section
      v-if="winners.length > 0"
      class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      aria-label="Lottery winners"
    >
      <article
        v-for="user in winners"
        :key="user.id"
        class="relative bg-yellow-50 border border-yellow-200 rounded p-4 shadow-sm"
      >
        <button
          @click="removeWinner(user.id)"
          class="absolute top-2 right-2 text-sm text-gray-600 hover:text-red-600"
        >
          Remove ❌
        </button>
        <h2 class="font-semibold text-gray-800 pr-20">{{ user.firstName }} {{ user.lastName }}</h2>
        <p class="mt-2 text-sm text-gray-600">Age: {{ user.age }}</p>
        <p class="mt-1 text-sm text-gray-600 break-all">{{ user.email }}</p>
      </article>
    </section>

    <SearchBar @filter-by-name="handleSearch" :initial-value="searchQuery" />

    <div v-if="isLoading" class="text-center py-8 text-blue-500 font-medium animate-pulse">
      Loading users from server...
    </div>

    <div
      v-else-if="globalError"
      class="p-4 mb-4 bg-red-50 text-red-600 rounded border border-red-200"
    >
      {{ globalError }}
    </div>

    <div v-else>
      <ParticipantsTable
        :users="users"
        @request-edit="requestEdit"
        @request-delete="requestDelete"
      />

      <div
        class="flex items-center justify-between mt-4 bg-white p-4 rounded shadow-sm border border-gray-200"
      >
        <p class="text-sm text-gray-600">
          Showing page <strong>{{ currentPage }}</strong> (Total: {{ totalUsers }} users)
        </p>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage * itemsPerPage >= totalUsers"
            class="px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <AppModal :is-open="isAddModalOpen" title="Create New User" @close="isAddModalOpen = false">
      <RegistrationForm
        :is-loading="isMutating"
        @submit="handleAddUser"
        @cancel="isAddModalOpen = false"
      />
    </AppModal>

    <AppModal :is-open="isDeleteModalOpen" title="Delete User?" @close="isDeleteModalOpen = false">
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete
        <strong>{{ selectedUser?.firstName }} {{ selectedUser?.lastName }}</strong
        >? This action cannot be undone.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="isDeleteModalOpen = false"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          :disabled="isMutating"
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors font-medium disabled:opacity-50"
        >
          {{ isMutating ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </AppModal>
  </div>
</template>
