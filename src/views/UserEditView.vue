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
  (e: 'update-success', updatedUser: User): void
}>()

const router = useRouter()
const isMutating = ref(false)
const updateError = ref('')

const handleUpdate = async (values: UpdateUserDto) => {
  isMutating.value = true
  updateError.value = ''
  try {
    const updatedUser = await ServiceProvider.users.update(props.user.id, values)

    emit('update-success', updatedUser)

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
