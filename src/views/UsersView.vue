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
const searchQuery = ref((route.query.q as string) || '')

// Стан модалок
const isAddModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedUser = ref<User | null>(null)

// --- Завантаження даних ---
const fetchUsers = async () => {
  isLoading.value = true
  globalError.value = null
  try {
    const data = await ServiceProvider.users.getAll({ q: searchQuery.value })
    users.value = data.items
  } catch (e: any) {
    globalError.value = 'Failed to load users: ' + e.message
  } finally {
    isLoading.value = false
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  router.replace({ query: { ...route.query, q: query ? query : undefined } })
}

onMounted(() => fetchUsers())
watch(searchQuery, () => fetchUsers())

// --- Додавання користувача (Імітація) ---
const handleAddUser = async (values: CreateUserDto) => {
  isMutating.value = true
  try {
    const newUser = await ServiceProvider.users.create(values)
    // Сервер поверне об'єкт з ID. Ми самостійно додаємо його на початок нашого масиву.
    users.value.unshift(newUser)
    isAddModalOpen.value = false
  } catch (e: any) {
    globalError.value = 'Error creating user'
  } finally {
    isMutating.value = false
  }
}

// --- Видалення користувача (Імітація) ---
const requestDelete = (user: User) => {
  selectedUser.value = user
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedUser.value) return
  isMutating.value = true
  try {
    await ServiceProvider.users.delete(selectedUser.value.id)
    // Вирізаємо видаленого юзера з нашого локального масиву
    users.value = users.value.filter((u) => u.id !== selectedUser.value!.id)
    isDeleteModalOpen.value = false
  } catch (e: any) {
    globalError.value = 'Error deleting user'
  } finally {
    isMutating.value = false
    selectedUser.value = null
  }
}

// --- Редагування користувача (Маршрутизація) ---
const requestEdit = (user: User) => {
  // Перекидаємо на вкладений маршрут редагування
  router.push(`/users/${user.id}/edit`)
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Users Directory</h1>
      <!-- Кнопка для відкриття модалки додавання -->
      <button
        @click="isAddModalOpen = true"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm"
      >
        + Add User
      </button>
    </div>

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

    <ParticipantsTable
      v-else
      :users="users"
      @request-edit="requestEdit"
      @request-delete="requestDelete"
    />

    <!-- Модалка додавання -->
    <!-- Модалка додавання -->
    <AppModal :is-open="isAddModalOpen" title="Create New User" @close="isAddModalOpen = false">
      <RegistrationForm
        :is-loading="isMutating"
        @submit="handleAddUser"
        @cancel="isAddModalOpen = false"
      />
    </AppModal>

    <!-- Модалка підтвердження видалення -->
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
