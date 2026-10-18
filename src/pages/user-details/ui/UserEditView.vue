<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import { UserForm as RegistrationForm } from '@/features/user-form'
import type { User, UpdateUserDto } from '@/entities/user'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  (e: 'update-success', updatedUser: User): void
}>()

const router = useRouter()
const usersStore = useUsersStore()
const isMutating = ref(false)
const updateError = ref('')

const handleUpdate = async (values: UpdateUserDto) => {
  isMutating.value = true
  updateError.value = ''
  try {
    // 1. Просто викликаємо стор, він сам оновить і сервер, і локальний стан
    await usersStore.updateUser(props.user.id, values)

    // 2. Створюємо об'єкт з оновленими даними для еміту
    const updatedData = { ...props.user, ...values } as User
    emit('update-success', updatedData)

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

    <RegistrationForm
      :initial-data="user"
      :is-loading="isMutating"
      @submit="handleUpdate"
      @cancel="router.push(`/users/${user.id}`)"
    />
  </div>
</template>
