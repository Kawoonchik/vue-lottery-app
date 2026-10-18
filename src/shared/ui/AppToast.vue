<script setup lang="ts">
import Toast from 'primevue/toast'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Toast v-bind="$attrs" />
</template>
