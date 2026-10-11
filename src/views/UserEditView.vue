<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ServiceProvider } from '../services/service-provider'
import RegistrationForm from '../components/blocks/RegistrationForm.vue'
import type { User, UpdateUserDto } from '../types/user'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  (e: 'update-success'): void
}>()

const router = useRouter()
const isMutating = ref(false)
const updateError = ref('')

const handleUpdate = async (values: UpdateUserDto) => {
  isMutating.value = true
  updateError.value = ''
  try {
    // Відправляємо PUT запит. Сервер поверне "ОК", але базу не змінить.
    await ServiceProvider.users.update(props.user.id, values)

    // Повідомляємо батьківський компонент, що треба оновити дані
    emit('update-success')

    // Повертаємося на сторінку профілю
    router.push(`/users/${props.user.id}`)
  } catch (e: any) {
    updateError.value = 'Failed to update user: ' + e.message
  } finally {
    isMutating.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-gray-800">Edit Information</h2>

    <div
      v-if="updateError"
      class="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200 text-sm"
    >
      {{ updateError }}
    </div>

    <!-- Перевикористовуємо форму, передаючи поточні дані юзера в initial-data -->
    <RegistrationForm
      :initial-data="user"
      :is-loading="isMutating"
      @submit="handleUpdate"
      @cancel="router.push(`/users/${user.id}`)"
    />
  </div>
</template>
