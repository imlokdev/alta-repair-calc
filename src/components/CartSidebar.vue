<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { MechanicItem } from '../types'
import { formatCurrency } from '../utils/formatters'

const props = defineProps<{
  items: MechanicItem[];
  quantities: Record<string, number>;
  pinned: boolean;
}>()

const emit = defineEmits<{
  (e: 'updateQuantity', itemId: string, change: number): void;
  (e: 'setQuantity', itemId: string, value: number): void;
  (e: 'update:pinned', value: boolean): void;
}>()

const isOpen = ref(false)
const cartRef = ref<HTMLElement | null>(null)

const cartItems = computed(() => props.items.filter(item => props.quantities[item.id] > 0))

const togglePin = () => {
  const newPinnedState = !props.pinned
  emit('update:pinned', newPinnedState)
  if (newPinnedState) isOpen.value = true
}

const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value && !props.pinned && cartRef.value) {
    if (!cartRef.value.contains(event.target as Node)) isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// Impede bloqueios de caracteres antes mesmo de serem digitados
const preventInvalidChars = (e: KeyboardEvent) => {
  if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault()
}

// Atualiza o estado enquanto digita
const onInput = (itemId: string, event: Event) => {
  const val = (event.target as HTMLInputElement).value
  if (val === '') return // Permite esvaziar para reescrever
  const num = parseInt(val, 10)
  if (!isNaN(num) && num >= 0) emit('setQuantity', itemId, num)
}

// Força o zero se a pessoa clicar fora do input deixando ele vazio
const onBlur = (itemId: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const val = target.value
  if (val === '' || parseInt(val, 10) <= 0) {
    emit('setQuantity', itemId, 0)
    target.value = '0'
  }
}
</script>

<template>
  <!-- BOTÃO FLUTUANTE DIREITO -->
  <div 
    class="fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-300"
    :class="isOpen || pinned ? 'translate-x-full' : 'translate-x-0'"
  >
    <button @click.stop="isOpen = true" class="flex flex-col items-center justify-center gap-2 py-5 px-2.5 bg-[#ffca28] border-y border-l border-[#e5b524] rounded-l-xl shadow-[-5px_0_15px_rgba(0,0,0,0.1)] dark:shadow-[-5px_0_15px_rgba(0,0,0,0.5)] text-slate-900 hover:bg-[#ffd54f] transition group">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      <span class="text-[10px] font-black uppercase tracking-widest mt-1" style="writing-mode: vertical-rl; text-orientation: mixed;">Carrinho</span>
    </button>
  </div>

  <!-- BARRA LATERAL CARRINHO -->
  <aside 
    ref="cartRef"
    class="fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#151822] z-50 transition-all duration-300 flex flex-col"
    :class="[
      isOpen || pinned ? 'translate-x-0' : 'translate-x-full',
      pinned ? 'border-l border-slate-200 dark:border-[#1e2330]' : 'shadow-[-10px_0_40px_rgba(0,0,0,0.2)] dark:shadow-[-10px_0_40px_rgba(0,0,0,0.6)]'
    ]"
  >
    <div class="p-4 flex items-center justify-between border-b border-slate-200 dark:border-[#1e2330]">
      <div class="flex items-center gap-1">
        <button v-if="!pinned" @click="isOpen = false" class="p-1.5 text-slate-400 hover:text-red-500 transition rounded">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <button @click="togglePin" class="p-1.5 text-slate-400 hover:text-[#ffca28] transition rounded" :title="pinned ? 'Desfixar carrinho' : 'Fixar carrinho'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform" :class="{'rotate-45 opacity-50': !pinned}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </button>
      </div>
      <h2 class="font-black text-slate-800 dark:text-white tracking-wider flex items-center gap-2 text-sm">
        CARRINHO <span class="text-[#ffca28]">🛒</span>
      </h2>
    </div>

    <!-- LISTA DE ITENS -->
    <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar">
      <div v-if="cartItems.length === 0" class="text-center text-slate-400 dark:text-gray-600 text-xs mt-10 font-bold uppercase tracking-widest">
        Carrinho Vazio
      </div>
      
      <div v-for="item in cartItems" :key="item.id" class="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-[#1e2330]">
        
        <!-- Header do Item -->
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2 pr-2 min-w-0">
            <span class="text-lg bg-white dark:bg-[#151822] w-8 h-8 flex items-center justify-center rounded-lg shadow-sm border border-slate-100 dark:border-transparent shrink-0">{{ item.icon }}</span>
            <span class="text-[9px] font-bold dark:text-gray-200 uppercase truncate">{{ item.outputName }}</span>
          </div>
          <button @click="emit('setQuantity', item.id, 0)" class="text-slate-400 hover:text-red-500 transition shrink-0 bg-white dark:bg-[#151822] p-1.5 rounded-lg border border-slate-100 dark:border-transparent shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>

        <!-- Controles -->
        <div class="flex items-center justify-between mt-1">
          <span class="text-[11px] font-black text-[#ffca28]">{{ formatCurrency(item.price * quantities[item.id]) }}</span>
          <div class="flex items-center gap-0.5 bg-white dark:bg-[#151822] p-1 rounded-lg border border-slate-200 dark:border-transparent shadow-sm">
            <button @click="emit('updateQuantity', item.id, -1)" class="w-6 h-6 rounded text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-[#1e2330] transition font-bold text-sm flex items-center justify-center">-</button>
            <input 
              type="number" 
              :value="quantities[item.id]"
              @input="onInput(item.id, $event)"
              @blur="onBlur(item.id, $event)"
              @keydown="preventInvalidChars"
              class="w-8 text-center bg-transparent text-[11px] font-black text-slate-800 dark:text-white outline-none no-spin-button"
            >
            <button @click="emit('updateQuantity', item.id, 1)" class="w-6 h-6 rounded text-slate-500 hover:text-green-500 hover:bg-slate-100 dark:hover:bg-[#1e2330] transition font-bold text-sm flex items-center justify-center">+</button>
          </div>
        </div>

      </div>
    </div>
  </aside>

  <div v-if="isOpen && !pinned" @click="isOpen = false" class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm"></div>
</template>