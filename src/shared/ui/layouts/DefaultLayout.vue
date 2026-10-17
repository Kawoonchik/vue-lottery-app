<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <main class="flex-grow max-w-5xl mx-auto w-full p-4 py-8">
      <slot />
    </main>
  </div>
</template>
