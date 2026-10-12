<script setup lang="ts">
import type { User } from '../../types/user'

defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  (e: 'request-details', user: User): void
  (e: 'request-edit', user: User): void
  (e: 'request-delete', user: User): void
}>()
</script>

<template>
  <div class="overflow-x-auto bg-white rounded shadow-sm border border-gray-200 mt-4">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">ID</th>
          <th scope="col" class="px-6 py-3">First Name</th>
          <th scope="col" class="px-6 py-3">Last Name</th>
          <th scope="col" class="px-6 py-3">Age / Gender</th>
          <th scope="col" class="px-6 py-3">Email</th>
          <th scope="col" class="px-6 py-3">Phone</th>
          <th scope="col" class="px-6 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50">
          <td class="px-6 py-4 font-bold text-gray-400">{{ user.id }}</td>
          <td class="px-6 py-4 font-medium text-gray-900">{{ user.firstName }}</td>
          <td class="px-6 py-4 font-medium text-gray-900">{{ user.lastName }}</td>
          <td class="px-6 py-4">{{ user.age }} y.o. / {{ user.gender }}</td>
          <td class="px-6 py-4">{{ user.email }}</td>
          <td class="px-6 py-4">{{ user.phone }}</td>
          <td class="px-6 py-4 flex justify-center gap-3">
            <button
              @click="emit('request-details', user)"
              class="text-gray-500 hover:text-gray-700 underline text-xs font-medium"
            >
              Details
            </button>
            <button
              @click="emit('request-edit', user)"
              class="text-blue-500 hover:text-blue-700 underline text-xs font-medium"
            >
              Edit
            </button>
            <button
              @click="emit('request-delete', user)"
              class="text-red-500 hover:text-red-700 underline text-xs font-medium"
            >
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="7" class="px-6 py-8 text-center text-gray-400">No users found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
