<script setup lang="ts">
import type { Participant } from '../../App.vue'

defineProps<{
  winner: Participant
}>()

defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <div
    class="border border-blue-200 bg-blue-50 rounded-md p-3 flex justify-between items-center shadow-sm w-full md:w-1/3"
  >
    <div>
      <p class="font-bold text-sm text-gray-800">{{ winner.name }}</p>
      <p class="text-xs text-gray-500">{{ winner.email }}</p>
    </div>
    <button
      @click="$emit('remove')"
      class="text-gray-400 hover:text-red-500 font-bold px-2 py-1 transition-colors"
      title="Видалити переможця"
    >
      ✕
    </button>
  </div>
</template>
