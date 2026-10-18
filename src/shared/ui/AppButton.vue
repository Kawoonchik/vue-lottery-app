<script setup lang="ts">
import Button from 'primevue/button'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
  },
)
</script>

<template>
  <Button
    v-bind="$attrs"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </Button>
</template>
