<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  initialValue?: string
}>()

const emit = defineEmits<{
  (e: 'filter-by-name', value: string): void
}>()

const searchQuery = ref(props.initialValue || '')
let timeout: ReturnType<typeof setTimeout>

// Якщо props зміняться ззовні (через URL), оновлюємо інпут
watch(
  () => props.initialValue,
  (newVal) => {
    if (newVal !== undefined) searchQuery.value = newVal
  },
)

watch(searchQuery, (newValue) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('filter-by-name', newValue)
  }, 300)
})
</script>

<template>
  <div class="mb-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search participants by name..."
      class="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
    />
  </div>
</template>
