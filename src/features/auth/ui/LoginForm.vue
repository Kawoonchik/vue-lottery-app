<script setup lang="ts">
import { Form, type GenericObject } from 'vee-validate'
import * as yup from 'yup'
import { AppButton, AppInput } from '@/shared/ui'

defineProps<{
  isLoading?: boolean
}>()

const emit = defineEmits<{
  submit: [credentials: { username: string; password: string }]
}>()

const schema = yup.object({
  username: yup.string().required('Введіть логін'),
  password: yup.string().required('Введіть пароль'),
})

function onSubmit(values: GenericObject) {
  const { username, password } = values
  if (typeof username !== 'string' || typeof password !== 'string') return

  emit('submit', { username, password })
}
</script>

<template>
  <Form :validation-schema="schema" @submit="onSubmit" class="space-y-4">
    <AppInput name="username" label="Username" placeholder="emilys" />
    <AppInput name="password" label="Password" type="password" placeholder="emilyspass" />
    <AppButton type="submit" :disabled="isLoading" class="w-full mt-4">
      {{ isLoading ? 'Logging in...' : 'Login' }}
    </AppButton>
  </Form>
</template>
