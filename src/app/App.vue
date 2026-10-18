<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useThemeStore } from '@/entities/theme'
import { AppHeader } from '@/widgets/app-header'
import { AppToast, DefaultLayout, AuthLayout } from '@/shared/ui'

const route = useRoute()
useThemeStore()

const layout = computed(() => {
  return route.meta.layout === 'AuthLayout' ? AuthLayout : DefaultLayout
})
</script>

<template>
  <AppToast />
  <component :is="layout">
    <template v-if="route.meta.layout !== 'AuthLayout'" #header>
      <AppHeader />
    </template>
    <RouterView />
  </component>
</template>
