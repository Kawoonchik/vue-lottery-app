<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)

// Коли вікно відкривається, автоматично фокусуємось на ньому,
// щоб працював ключовий модифікатор .esc
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      modalRef.value?.focus()
    }
  },
)
</script>

<template>
  <Transition name="fade">
    <!-- Ключовий модифікатор .esc для закриття -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @keydown.esc="emit('close')"
      tabindex="-1"
      ref="modalRef"
    >
      <div class="bg-white rounded shadow-xl w-full max-w-md p-6 relative">
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold mb-4">{{ title }}</h3>

        <!-- Слот за замовчуванням для контенту -->
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Анімації для Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
