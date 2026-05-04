<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { MechanicItem } from '../types'
import { formatCurrency } from '../utils/formatters'

const props = defineProps<{
  items: MechanicItem[];
  quantities: Record<string, number>;
  pinned: boolean;
}>()

const emit = defineEmits<{
  (e: 'updateQuantity', itemId: string, change: number): void;
  (e: 'update:pinned', value: boolean): void;
}>()

const isOpen = ref(false)
const sidebarRef = ref<HTMLElement | null>(null)

const togglePin = () => {
  const newPinnedState = !props.pinned
  emit('update:pinned', newPinnedState)
  if (newPinnedState) {
    isOpen.value = true
  }
}

// Lógica para fechar ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value && !props.pinned && sidebarRef.value) {
    // Verifica se o elemento clicado NÃO está dentro da sidebar
    if (!sidebarRef.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <!-- BOTÃO FLUTUANTE (Gatilho) -->
  <div 
    class="fixed left-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-300"
    :class="isOpen || pinned ? '-translate-x-full' : 'translate-x-0'"
  >
    <!-- Adicionado .stop para o clique não propagar para o document -->
    <button @click.stop="isOpen = true" class="flex flex-col items-center justify-center gap-2 py-5 px-2.5 bg-white dark:bg-[#151822] border-y border-r border-slate-200 dark:border-[#1e2330] rounded-r-xl shadow-[5px_0_15px_rgba(0,0,0,0.1)] dark:shadow-[5px_0_15px_rgba(0,0,0,0.5)] text-slate-600 dark:text-gray-400 hover:text-[#ffca28] dark:hover:text-[#ffca28] transition group">
      <span class="text-xl group-hover:scale-110 transition-transform">🔧</span>
      <span class="text-[10px] font-bold uppercase tracking-widest mt-1" style="writing-mode: vertical-rl; text-orientation: mixed;">Mecânica</span>
    </button>
  </div>

  <!-- A BARRA LATERAL EM SI -->
  <aside 
    ref="sidebarRef"
    class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#151822] z-50 transition-all duration-300 flex flex-col"
    :class="[
      isOpen || pinned ? 'translate-x-0' : '-translate-x-full',
      pinned ? 'border-r border-slate-200 dark:border-[#1e2330]' : 'shadow-[10px_0_40px_rgba(0,0,0,0.2)] dark:shadow-[10px_0_40px_rgba(0,0,0,0.6)]'
    ]"
  >
    <div class="p-4 flex items-center justify-between border-b border-slate-200 dark:border-[#1e2330]">
      <h2 class="font-black text-slate-800 dark:text-white tracking-wider flex items-center gap-2 text-sm">
        <span class="text-[#ffca28]">🔧</span> MECÂNICA
      </h2>
      <div class="flex items-center gap-1">
        <button @click="togglePin" class="p-1.5 text-slate-400 hover:text-[#ffca28] transition rounded" :title="pinned ? 'Desfixar aba' : 'Fixar aba'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform" :class="{'rotate-45 opacity-50': !pinned}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </button>
        <button v-if="!pinned" @click="isOpen = false" class="p-1.5 text-slate-400 hover:text-red-500 transition rounded">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- LISTA DE ITENS MECÂNICOS -->
    <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar">
      <div v-for="item in items" :key="item.id" class="flex flex-col gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-[#1e2330] hover:border-[#ffca28] dark:hover:border-[#ffca28] transition shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-white dark:bg-[#151822] text-lg shadow-inner border border-slate-100 dark:border-transparent">
            {{ item.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[9px] font-bold text-slate-800 dark:text-gray-200 tracking-tight uppercase leading-tight truncate">{{ item.name }}</p>
            <p class="text-[10px] font-black text-[#ffca28] mt-0.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {{ formatCurrency(item.price) }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between bg-white dark:bg-[#151822] p-1 rounded-lg border border-slate-200 dark:border-transparent mt-1">
          <button @click="emit('updateQuantity', item.id, -1)" class="w-8 h-6 rounded text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-[#1e2330] transition font-bold text-sm flex items-center justify-center">-</button>
          <span class="font-black text-xs text-slate-800 dark:text-white w-6 text-center">{{ quantities[item.id] || 0 }}</span>
          <button @click="emit('updateQuantity', item.id, 1)" class="w-8 h-6 rounded text-slate-500 hover:text-green-500 hover:bg-slate-100 dark:hover:bg-[#1e2330] transition font-bold text-sm flex items-center justify-center">+</button>
        </div>
      </div>
    </div>
  </aside>

  <div v-if="isOpen && !pinned" @click="isOpen = false" class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm"></div>
</template>