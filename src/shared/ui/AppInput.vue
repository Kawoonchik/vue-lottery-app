<script setup lang="ts">
import { useField } from 'vee-validate'
// ВАЖЛИВО: Цей рядок обов'язковий, щоб інпут виглядав як PrimeVue!
import InputText from 'primevue/inputtext'

const props = defineProps<{
  name: string
  label?: string
  type?: string
  placeholder?: string
}>()

const { value, errorMessage } = useField<string>(() => props.name)
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label v-if="label" :for="name" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <InputText
      :id="name"
      v-model="value"
      :type="type || 'text'"
      :placeholder="placeholder"
      :class="['w-full', { 'p-invalid': errorMessage }]"
    />

    <small v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </small>
  </div>
</template>
