<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="flex gap-6 items-center">
    <!-- Для Home використовуємо exact-active-class, щоб він не світився завжди -->
    <RouterLink
      to="/"
      class="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      exact-active-class="!text-blue-600 border-b-2 border-blue-600"
    >
      Home
    </RouterLink>
    <RouterLink
      to="/about"
      class="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      active-class="!text-blue-600 border-b-2 border-blue-600"
    >
      About author
    </RouterLink>
    <RouterLink
      to="/users"
      class="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      active-class="!text-blue-600 border-b-2 border-blue-600"
    >
      Users
    </RouterLink>
    <RouterLink
      to="/login"
      class="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      active-class="!text-blue-600 border-b-2 border-blue-600"
    >
      Login
    </RouterLink>
  </nav>
</template>
