<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const user = ref<User | null>(null)
const isLoading = ref(true)
const error = ref('')

const fetchUser = async () => {
  isLoading.value = true
  error.value = ''
  try {
    user.value = await usersStore.getUserById(Number(props.id))
  } catch (e: any) {
    error.value = 'Failed to load user data: ' + e.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <div>
    <button
      @click="router.push('/users')"
      class="mb-4 text-blue-500 hover:underline text-sm font-medium"
    >
      ← Back to Directory
    </button>

    <div v-if="isLoading" class="text-center py-8 text-gray-500 animate-pulse">
      Loading profile...
    </div>

    <div v-else-if="error" class="text-red-500 p-4 bg-red-50 rounded border border-red-200">
      {{ error }}
    </div>

    <div v-else-if="user" class="bg-white p-6 rounded shadow-sm border border-gray-200">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        {{ user.firstName }} {{ user.lastName }}'s Profile
      </h1>

      <!-- Блок деталей відображається тільки на базовому маршруті /users/:id -->
      <div v-if="route.name === 'user-details'" class="space-y-4 text-gray-700">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Age:</strong> {{ user.age }}</p>
        <p><strong>Gender:</strong> {{ user.gender }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>

        <div class="mt-6 pt-4">
          <button
            @click="router.push(`/users/${user.id}/edit`)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <RouterView v-else :user="user" @update-success="user = $event" />
    </div>
  </div>
</template>
