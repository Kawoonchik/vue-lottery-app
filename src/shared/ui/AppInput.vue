<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label: string
  type?: string
  placeholder?: string
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
      :class="error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'"
    />
    <span v-if="error" class="text-xs text-red-500 mt-1 block">{{ error }}</span>
  </div>
</template>
