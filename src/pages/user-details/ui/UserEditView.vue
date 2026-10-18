<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import { UserForm as RegistrationForm } from '@/features/user-form'
import type { User, UpdateUserDto } from '@/entities/user'
import { useAppToast } from '@/shared/ui'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  (e: 'update-success', updatedUser: User): void
}>()

const router = useRouter()
const usersStore = useUsersStore()
const appToast = useAppToast()
const isMutating = ref(false)
const updateError = ref('')

const handleUpdate = async (values: UpdateUserDto) => {
  isMutating.value = true
  updateError.value = ''
  try {
    const savedLocally = await usersStore.updateUser(props.user.id, values, props.user)

    const updatedData = { ...props.user, ...values } as User
    emit('update-success', updatedData)
    appToast.success(
      'User updated',
      savedLocally
        ? 'The API record was not found; changes were applied locally.'
        : 'The user was updated successfully.',
    )

    router.push(`/users/${props.user.id}`)
  } catch (e: unknown) {
    const details = e instanceof Error ? e.message : 'Unknown error'
    updateError.value = 'Failed to update user: ' + details
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
