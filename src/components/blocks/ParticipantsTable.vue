<script setup lang="ts">
import type { Participant } from '../../App.vue'
import AppButton from '../ui/AppButton.vue'

defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  (e: 'request-edit', participant: Participant): void
  (e: 'request-delete', participant: Participant): void
}>()
</script>

<template>
  <div class="bg-white p-6 rounded shadow-sm border border-gray-200 overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">#</th>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Date of Birth</th>
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
            <!-- Кнопки генерують події з даними конкретного учасника -->
            <button
              @click="emit('request-edit', participant)"
              class="text-blue-500 hover:text-blue-700 underline text-xs"
            >
              Редагувати дані
            </button>
            <button
              @click="emit('request-delete', participant)"
              class="text-red-500 hover:text-red-700 underline text-xs"
            >
              Видалити учасника
            </button>
          </td>
        </tr>

        <tr v-if="participants.length === 0">
          <td colspan="6" class="px-6 py-4 text-center text-gray-400">
            No participants registered yet.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
