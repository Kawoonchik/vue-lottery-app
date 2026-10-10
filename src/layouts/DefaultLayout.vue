<script setup lang="ts">
import AppHeader from '../components/blocks/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <!-- У цей слот буде підставлятися контент поточної сторінки -->
    <main class="flex-grow max-w-5xl mx-auto w-full p-4 py-8">
      <slot />
    </main>
  </div>
</template>
