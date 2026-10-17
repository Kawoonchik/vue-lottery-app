<script setup lang="ts">
import Logo from './Logo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>
