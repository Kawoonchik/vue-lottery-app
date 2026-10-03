<script setup lang="ts">
import type { Participant } from '../../App.vue'
import WinnerCard from './WinnerCard.vue'
import AppButton from '../ui/AppButton.vue'

defineProps<{
  winners: Participant[]
  canPickWinner: boolean
}>()

const emit = defineEmits<{
  (e: 'pick-winner'): void
  (e: 'remove-winner', id: string): void
}>()
</script>

<template>
  <div class="bg-white p-6 rounded shadow-sm border border-gray-200">
    <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
      <h2 class="text-sm font-bold text-gray-400 uppercase">Winners</h2>
      <!-- Кнопка генерує подію вибору переможця -->
      <AppButton :disabled="!canPickWinner" @click="emit('pick-winner')"> New winner </AppButton>
    </div>

    <div class="flex flex-col md:flex-row gap-4 min-h-[60px]">
      <WinnerCard
        v-for="winner in winners"
        :key="winner.id"
        :winner="winner"
        @remove="emit('remove-winner', winner.id)"
      />
      <div v-if="winners.length === 0" class="text-gray-400 text-sm flex items-center">
        No winners selected yet.
      </div>
    </div>
  </div>
</template>
