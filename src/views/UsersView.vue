<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ServiceProvider } from '../services/service-provider'
import type { User } from '../types/user'
import ParticipantsTable from '../components/blocks/ParticipantsTable.vue'
import SearchBar from '../components/ui/SearchBar.vue'

const route = useRoute()
const router = useRouter()

// Стан компонента
const users = ref<User[]>([])
const isLoading = ref(false)
const globalError = ref<string | null>(null)

// Беремо початковий пошук з URL (якщо користувач зайшов за посиланням /users?q=John)
const searchQuery = ref((route.query.q as string) || '')

// Функція для завантаження даних через наш репозиторій
const fetchUsers = async () => {
  isLoading.value = true
  globalError.value = null

  try {
    // Викликаємо метод getAll, передаючи йому пошуковий запит
    const data = await ServiceProvider.users.getAll({ q: searchQuery.value })
    users.value = data.items
  } catch (e: any) {
    globalError.value = 'Failed to load users: ' + e.message
  } finally {
    isLoading.value = false
  }
}

// Слухаємо зміну пошуку з SearchBar
const handleSearch = (query: string) => {
  searchQuery.value = query

  // Оновлюємо URL-адресу без перезавантаження сторінки
  router.replace({
    query: { ...route.query, q: query ? query : undefined },
  })
}

// Завантажуємо юзерів при старті
onMounted(() => {
  fetchUsers()
})

// Якщо змінився рядок пошуку (в тому числі через URL) — робимо новий запит до API
watch(searchQuery, () => {
  fetchUsers()
})

// Заглушки для майбутніх модалок
const handleEdit = (user: User) => console.log('Edit user:', user.id)
const handleDelete = (user: User) => console.log('Delete user:', user.id)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Users Directory</h1>
      <!-- Можна додати кнопку Add User тут пізніше -->
    </div>

    <!-- Пошук -->
    <SearchBar @filter-by-name="handleSearch" :initial-value="searchQuery" />

    <!-- Стани завантаження та помилки -->
    <div v-if="isLoading" class="text-center py-8 text-blue-500 font-medium animate-pulse">
      Loading users from server...
    </div>

    <div
      v-else-if="globalError"
      class="p-4 mb-4 bg-red-50 text-red-600 rounded border border-red-200"
    >
      {{ globalError }}
    </div>

    <!-- Наша оновлена таблиця -->
    <ParticipantsTable
      v-else
      :users="users"
      @request-edit="handleEdit"
      @request-delete="handleDelete"
    />
  </div>
</template>
