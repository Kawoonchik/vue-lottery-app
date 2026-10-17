<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    class="bg-[#38bdf8] hover:bg-[#0284c7] text-white px-8 py-2 rounded shadow-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot />
  </button>
</template>
