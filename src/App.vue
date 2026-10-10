<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()

// Динамічно визначаємо, який макет використовувати
const layout = computed(() => {
  return route.meta.layout === 'AuthLayout' ? AuthLayout : DefaultLayout
})
</script>

<template>
  <!-- Спеціальний тег <component :is="..."> динамічно рендерить переданий йому компонент -->
  <component :is="layout">
    <RouterView />
  </component>
</template>
