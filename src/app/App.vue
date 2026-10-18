<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { AppToast, DefaultLayout, AuthLayout } from '@/shared/ui'

const route = useRoute()

const layout = computed(() => {
  return route.meta.layout === 'AuthLayout' ? AuthLayout : DefaultLayout
})
</script>

<template>
  <AppToast />
  <component :is="layout">
    <RouterView />
  </component>
</template>
