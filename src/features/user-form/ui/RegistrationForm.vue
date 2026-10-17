<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import type { CreateUserDto } from '@/entities/user'

const props = defineProps<{
  initialData?: any // Дані для підстановки при редагуванні
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', values: CreateUserDto): void
  (e: 'cancel'): void
}>()

// Схема валідації VeeValidate + Yup для всіх обов'язкових полів
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters required').required('Password is required'),
  age: yup
    .number()
    .typeError('Must be a valid number')
    .min(1, 'Invalid age')
    .required('Age is required'),
  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Must be male or female')
    .required('Gender is required'),
  phone: yup.string().required('Phone is required'),
})

const onSubmit = (values: any) => {
  emit('submit', values as CreateUserDto)
}
</script>

<template>
  <Form
    :validation-schema="schema"
    :initial-values="initialData"
    @submit="onSubmit"
    class="space-y-4"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <Field
          name="firstName"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        />
        <ErrorMessage name="firstName" class="text-red-500 text-xs mt-1 block" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <Field
          name="lastName"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        />
        <ErrorMessage name="lastName" class="text-red-500 text-xs mt-1 block" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <Field
          name="username"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        />
        <ErrorMessage name="username" class="text-red-500 text-xs mt-1 block" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Field
          name="email"
          type="email"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        />
        <ErrorMessage name="email" class="text-red-500 text-xs mt-1 block" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <Field
          name="password"
          type="password"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        />
        <ErrorMessage name="password" class="text-red-500 text-xs mt-1 block" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <Field
          name="age"
          type="number"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        />
        <ErrorMessage name="age" class="text-red-500 text-xs mt-1 block" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <Field
          name="gender"
          as="select"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white"
        >
          <option value="" disabled>Select gender...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Field>
        <ErrorMessage name="gender" class="text-red-500 text-xs mt-1 block" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <Field
          name="phone"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        />
        <ErrorMessage name="phone" class="text-red-500 text-xs mt-1 block" />
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors font-medium"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isLoading"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors font-medium disabled:opacity-50"
      >
        {{ isLoading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </Form>
</template>
