<script setup lang="ts">
import type { ToastMessage } from '../types'

defineProps<{
  toasts: ToastMessage[];
}>()

defineEmits<{
  (e: 'remove', id: number): void;
}>()
</script>

<template>
  <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        @click="toast.clickable && toast.onClick ? toast.onClick() : null"
        class="pointer-events-auto flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#151822] shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-80 transition-all duration-300 border border-slate-200 dark:border-[#1e2330]"
        :class="[
          toast.clickable ? 'cursor-pointer hover:scale-105 hover:border-[#ffca28] dark:hover:border-[#ffca28]' : '',
          toast.type === 'success' ? 'border-l-4 border-l-[#ffca28]' : toast.type === 'error' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-slate-400'
        ]"
      >
        <div class="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-[#0b0e14] shadow-inner text-lg">
          <span v-if="toast.type === 'success'">✨</span>
          <span v-else-if="toast.type === 'error'">⚠️</span>
          <span v-else>🗑️</span>
        </div>
        
        <div class="flex-1 min-w-0">
          <h4 class="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-white truncate" :class="toast.type === 'success' ? 'text-[#ffca28] dark:text-[#ffca28]' : ''">
            {{ toast.title }}
          </h4>
          <p class="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 leading-tight">
            {{ toast.message }}
          </p>
        </div>

        <button @click.stop="$emit('remove', toast.id)" class="shrink-0 text-slate-400 hover:text-slate-800 dark:hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>