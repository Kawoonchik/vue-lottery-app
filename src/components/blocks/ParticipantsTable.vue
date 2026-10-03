<script setup lang="ts">
import type { Participant } from '../../App.vue'
import SearchBar from '../ui/SearchBar.vue'

defineProps<{
  participants: Participant[]
  sortKey: 'name' | 'dateOfBirth' | null
  sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'request-edit', participant: Participant): void
  (e: 'request-delete', participant: Participant): void
  (e: 'request-sort', key: 'name' | 'dateOfBirth'): void
  (e: 'filter-by-name', query: string): void
}>()
</script>

<template>
  <div class="bg-white p-6 rounded shadow-sm border border-gray-200">
    <!-- Підключаємо компонент пошуку та прокидаємо його подію вище -->
    <SearchBar @filter-by-name="emit('filter-by-name', $event)" />

    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">#</th>

            <!-- Клікабельні заголовки для сортування -->
            <th
              scope="col"
              class="px-6 py-3 cursor-pointer hover:bg-gray-200 select-none"
              @click="emit('request-sort', 'name')"
            >
              Name
              <span v-if="sortKey === 'name'" class="ml-1">{{
                sortOrder === 'asc' ? '↓' : '↑'
              }}</span>
            </th>

            <th
              scope="col"
              class="px-6 py-3 cursor-pointer hover:bg-gray-200 select-none"
              @click="emit('request-sort', 'dateOfBirth')"
            >
              Date of Birth
              <span v-if="sortKey === 'dateOfBirth'" class="ml-1">{{
                sortOrder === 'asc' ? '↓' : '↑'
              }}</span>
            </th>

            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Phone number</th>
            <th scope="col" class="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(participant, index) in participants" :key="participant.id" class="border-b">
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ participant.name }}</td>
            <td class="px-6 py-4">{{ participant.dateOfBirth }}</td>
            <td class="px-6 py-4">{{ participant.email }}</td>
            <td class="px-6 py-4">{{ participant.phone }}</td>
            <td class="px-6 py-4 flex justify-center gap-2">
              <button
                @click="emit('request-edit', participant)"
                class="text-blue-500 hover:text-blue-700 underline text-xs"
              >
                Редагувати
              </button>
              <button
                @click="emit('request-delete', participant)"
                class="text-red-500 hover:text-red-700 underline text-xs"
              >
                Видалити
              </button>
            </td>
          </tr>
          <tr v-if="participants.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-400">No participants found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
