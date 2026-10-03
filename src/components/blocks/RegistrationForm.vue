<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppInput from '../ui/AppInput.vue'
import AppButton from '../ui/AppButton.vue'

const emit = defineEmits<{
  (e: 'add-participant', participant: any): void
}>()

const initialFormState = {
  name: '',
  dateOfBirth: '',
  email: '',
  phone: '',
}

const form = reactive({ ...initialFormState })
const errors = reactive({ ...initialFormState })
const isSubmitted = ref(false)

const validateForm = () => {
  let isValid = true
  // Скидаємо старі помилки
  Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = ''))

  if (!form.name.trim()) {
    errors.name = 'This value is required'
    isValid = false
  }

  if (!form.dateOfBirth) {
    errors.dateOfBirth = 'This value is required'
    isValid = false
  } else {
    const selectedDate = new Date(form.dateOfBirth)
    const today = new Date()
    if (selectedDate > today) {
      errors.dateOfBirth = 'Date cannot be in the future'
      isValid = false
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!form.email.trim()) {
    errors.email = 'This value is required'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }

  const phoneRegex = /^\+380\d{9}$/
  if (!form.phone.trim()) {
    errors.phone = 'This value is required'
    isValid = false
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = 'Format: +380XXXXXXXXX'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  isSubmitted.value = true
  if (validateForm()) {
    // Відправляємо дані наверх у таблицю
    emit('add-participant', {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      dateOfBirth: form.dateOfBirth,
      email: form.email.trim(),
      phone: form.phone.trim(),
    })

    // Очищуємо форму та скидаємо прапорець відправки
    isSubmitted.value = false
    Object.assign(form, initialFormState)
    Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = ''))
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded shadow-sm border border-gray-200">
    <div class="mb-6">
      <h2 class="text-sm font-bold text-gray-800 uppercase">Register form</h2>
      <p class="text-gray-400 text-xs mt-1">Please fill in all the fields.</p>
    </div>

    <form @submit.prevent="handleSubmit" @keyup.enter="handleSubmit">
      <AppInput
        v-model="form.name"
        label="Name"
        placeholder="Enter user name"
        :error="isSubmitted ? errors.name : ''"
      />
      <AppInput
        v-model="form.dateOfBirth"
        label="Date of Birth"
        type="date"
        placeholder="mm/dd/yyyy"
        :error="isSubmitted ? errors.dateOfBirth : ''"
      />
      <AppInput
        v-model="form.email"
        label="Email"
        placeholder="Enter email"
        :error="isSubmitted ? errors.email : ''"
      />
      <AppInput
        v-model="form.phone"
        label="Phone number"
        placeholder="Enter Phone number"
        :error="isSubmitted ? errors.phone : ''"
      />

      <div class="flex justify-end mt-4 pt-2 border-t border-gray-100">
        <AppButton type="submit">Save</AppButton>
      </div>
    </form>
  </div>
</template>
