<script setup lang="ts">
import { computed } from 'vue'

import { ref, watch, onMounted, reactive } from 'vue'
import WinnersBlock from './components/blocks/WinnersBlock.vue'
import RegistrationForm from './components/blocks/RegistrationForm.vue'
import ParticipantsTable from './components/blocks/ParticipantsTable.vue'
import AppModal from './components/ui/AppModal.vue'
import AppInput from './components/ui/AppInput.vue'
import AppButton from './components/ui/AppButton.vue'

export interface Participant {
  id: string
  name: string
  dateOfBirth: string
  email: string
  phone: string
}

const participants = ref<Participant[]>([])
const globalError = ref('')

const searchQuery = ref('')
const sortKey = ref<'name' | 'dateOfBirth' | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

onMounted(() => {
  const saved = localStorage.getItem('participants')
  if (saved) {
    participants.value = JSON.parse(saved)
  }
})

watch(
  participants,
  (newVal) => {
    localStorage.setItem('participants', JSON.stringify(newVal))
  },
  { deep: true },
)

const handleAddParticipant = (newParticipant: Participant) => {
  globalError.value = ''
  const emailExists = participants.value.some(
    (p) => p.email.toLowerCase() === newParticipant.email.toLowerCase(),
  )
  if (emailExists) {
    globalError.value = 'User with this email already exists!'
    return
  }
  participants.value.push(newParticipant)
}

const handleFilter = (query: string) => {
  searchQuery.value = query
}

const handleSort = (key: 'name' | 'dateOfBirth') => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const displayedParticipants = computed(() => {
  let result = [...participants.value] // Робимо копію, щоб не міняти оригінал

  // 1. Фільтрація
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q))
  }

  // 2. Сортування
  if (sortKey.value) {
    result.sort((a, b) => {
      const valA = a[sortKey.value!].toLowerCase()
      const valB = b[sortKey.value!].toLowerCase()

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

// ================= ЛОГІКА ЛОТЕРЕЇ =================
// Зберігаємо лише ID переможців, щоб завжди мати актуальні дані з масиву participants
const winnerIds = ref<string[]>([])

// Обчислювана властивість: перетворює масив ID на масив об'єктів Participant
const winnerParticipants = computed(() => {
  return winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter(Boolean) as Participant[] // filter(Boolean) відкидає undefined, якщо юзера видалили
})

// Умови, за яких кнопка активна:
// є юзери, переможців менше ніж 3, і переможців менше ніж загалом учасників
const canPickWinner = computed(() => {
  return (
    participants.value.length > 0 &&
    winnerIds.value.length < 3 &&
    winnerIds.value.length < participants.value.length
  )
})

const handlePickWinner = () => {
  if (!canPickWinner.value) return

  // Шукаємо тих, хто ще не є переможцем
  const availableParticipants = participants.value.filter((p) => !winnerIds.value.includes(p.id))

  if (availableParticipants.length > 0) {
    // Обираємо випадковий індекс
    const randomIndex = Math.floor(Math.random() * availableParticipants.length)
    winnerIds.value.push(availableParticipants[randomIndex]!.id)
  }
}

const handleRemoveWinner = (id: string) => {
  winnerIds.value = winnerIds.value.filter((wid) => wid !== id)
}

// ================= РОБОТА З МОДАЛКАМИ =================

const selectedParticipant = ref<Participant | null>(null)

// --- Видалення ---
const isDeleteModalOpen = ref(false)

const openDeleteModal = (participant: Participant) => {
  selectedParticipant.value = participant
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (selectedParticipant.value) {
    const idToDelete = selectedParticipant.value.id // Оголошуємо змінну

    participants.value = participants.value.filter((p) => p.id !== idToDelete)
    handleRemoveWinner(idToDelete)
  }
  isDeleteModalOpen.value = false
  selectedParticipant.value = null
}

// --- Редагування ---
const isEditModalOpen = ref(false)
const editForm = reactive({ id: '', name: '', dateOfBirth: '', email: '', phone: '' })
const editErrors = reactive({ name: '', dateOfBirth: '', email: '', phone: '' })

const openEditModal = (participant: Participant) => {
  selectedParticipant.value = participant
  Object.assign(editForm, participant) // Заповнюємо форму даними юзера
  Object.keys(editErrors).forEach((key) => (editErrors[key as keyof typeof editErrors] = ''))
  isEditModalOpen.value = true
}

const validateEditForm = () => {
  let isValid = true
  Object.keys(editErrors).forEach((key) => (editErrors[key as keyof typeof editErrors] = ''))

  if (!editForm.name.trim()) {
    editErrors.name = 'Required'
    isValid = false
  }

  if (!editForm.dateOfBirth) {
    editErrors.dateOfBirth = 'Required'
    isValid = false
  } else if (new Date(editForm.dateOfBirth) > new Date()) {
    editErrors.dateOfBirth = 'No future dates'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!editForm.email.trim()) {
    editErrors.email = 'Required'
    isValid = false
  } else if (!emailRegex.test(editForm.email)) {
    editErrors.email = 'Invalid email'
    isValid = false
  }

  const phoneRegex = /^\+380\d{9}$/
  if (!editForm.phone.trim()) {
    editErrors.phone = 'Required'
    isValid = false
  } else if (!phoneRegex.test(editForm.phone)) {
    editErrors.phone = 'Format: +380XXXXXXXXX'
    isValid = false
  }

  return isValid
}

const confirmEdit = () => {
  if (!validateEditForm()) return

  // Перевірка унікальності e-mail (без урахування регістру), ігноруючи поточного користувача
  const emailExists = participants.value.some(
    (p) => p.email.toLowerCase() === editForm.email.toLowerCase() && p.id !== editForm.id,
  )

  if (emailExists) {
    editErrors.email = 'This email is used by another user!'
    return
  }

  // Оновлюємо дані
  const index = participants.value.findIndex((p) => p.id === editForm.id)
  if (index !== -1) {
    participants.value[index] = { ...editForm }
  }

  isEditModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-5xl mx-auto flex flex-col gap-6">
      <WinnersBlock
        :winners="winnerParticipants"
        :can-pick-winner="canPickWinner"
        @pick-winner="handlePickWinner"
        @remove-winner="handleRemoveWinner"
      />

      <div>
        <div v-if="globalError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{{ globalError }}</p>
        </div>
        <RegistrationForm @add-participant="handleAddParticipant" />
      </div>

      <ParticipantsTable
        :participants="displayedParticipants"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        @request-edit="openEditModal"
        @request-delete="openDeleteModal"
        @request-sort="handleSort"
        @filter-by-name="handleFilter"
      />
    </div>

    <!-- Модалка Видалення -->
    <AppModal
      :is-open="isDeleteModalOpen"
      title="Видалення учасника"
      @close="isDeleteModalOpen = false"
    >
      <p class="mb-6 text-gray-700" v-if="selectedParticipant">
        Ви дійсно бажаєте видалити учасника
        <strong>"{{ selectedParticipant.name }}"</strong>,
        <strong>"{{ selectedParticipant.email }}"</strong>?
      </p>
      <div class="flex justify-end gap-3">
        <AppButton @click="isDeleteModalOpen = false" class="!bg-gray-400 hover:!bg-gray-500"
          >Ні</AppButton
        >
        <AppButton @click="confirmDelete" class="!bg-red-500 hover:!bg-red-600">Так</AppButton>
      </div>
    </AppModal>

    <!-- Модалка Редагування -->
    <AppModal :is-open="isEditModalOpen" title="Редагувати дані" @close="isEditModalOpen = false">
      <div class="space-y-1 mb-6">
        <AppInput v-model="editForm.name" label="Name" :error="editErrors.name" />
        <AppInput
          v-model="editForm.dateOfBirth"
          label="Date of Birth"
          type="date"
          :error="editErrors.dateOfBirth"
        />
        <AppInput v-model="editForm.email" label="Email" :error="editErrors.email" />
        <AppInput v-model="editForm.phone" label="Phone number" :error="editErrors.phone" />
      </div>
      <div class="flex justify-end">
        <AppButton @click="confirmEdit">Оновити дані</AppButton>
      </div>
    </AppModal>
  </div>
</template>
