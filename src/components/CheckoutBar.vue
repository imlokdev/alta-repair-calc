<script setup lang="ts">
import { formatCurrency } from '../utils/formatters'

defineProps<{
  grandTotal: number;
}>()

// AQUI ESTAVA O BUG: Faltava o "const emit =" para podermos usar no template!
const emit = defineEmits<{
  (e: 'clear'): void;
  (e: 'finalize'): void;
}>()
</script>

<template>
  <div class="shrink-0 w-full bg-white dark:bg-[#0b0e14] border-t border-slate-200 dark:border-[#1e2330] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6 h-auto md:h-24">
      
      <!-- Esquerda: Valor Total -->
      <div class="flex items-center gap-6 w-full md:w-auto">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-1">Total a cobrar</span>
          <div class="flex items-center gap-2 text-slate-900 dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#ffca28]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span class="text-4xl font-black tracking-tighter">{{ formatCurrency(grandTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Direita: Botões -->
      <div class="flex items-center gap-4 w-full md:w-auto">
        <button 
          @click="emit('clear')"
          class="px-8 h-12 rounded-xl font-bold text-xs uppercase tracking-widest text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition w-full md:w-auto"
        >
          Limpar
        </button>
        <button 
          @click="emit('finalize')"
          :disabled="grandTotal === 0"
          class="px-10 h-12 rounded-xl font-black text-xs uppercase tracking-widest text-slate-900 bg-[#ffca28] hover:bg-[#ffd54f] disabled:opacity-50 disabled:cursor-not-allowed transition w-full md:w-auto shadow-lg shadow-yellow-500/20"
        >
          Finalizar Atendimento
        </button>
      </div>

    </div>
  </div>
</template>