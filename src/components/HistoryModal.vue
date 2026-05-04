<script setup lang="ts">
import type { HistoryRecord } from '../types'
import { formatCurrency } from '../utils/formatters'

defineProps<{
  show: boolean;
  history: HistoryRecord[];
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'clearHistory'): void;
}>()

const copiarTexto = async (text: string) => {
  if (!text) return
  try { await navigator.clipboard.writeText(text) } catch (err) { console.error('Falha ao copiar:', err) }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
    <div class="bg-white dark:bg-[#151822] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-[#1e2330]">
      
      <div class="flex items-center justify-between p-6">
        <h3 class="font-black italic text-2xl tracking-tighter text-slate-900 dark:text-white">
          HISTÓRICO DE <span class="text-[#ffca28]">VENDAS</span>
        </h3>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-4">
        <div v-if="history.length === 0" class="text-center text-slate-400 dark:text-gray-600 italic py-10 text-sm">Nenhum histórico registrado no navegador.</div>
        
        <div v-for="record in history" :key="record.id" class="p-5 rounded-2xl border border-slate-200 dark:border-[#1e2330] bg-slate-50 dark:bg-[#0b0e14]">
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm font-bold text-[#ffca28] tracking-wider uppercase">Cliente ID: {{ record.passportId }}</span>
            <span class="text-xs font-bold text-slate-400">{{ record.time }}</span>
          </div>
          
          <p class="text-xs text-slate-600 dark:text-gray-400 leading-relaxed mb-4 uppercase">{{ record.summary }}</p>
          
          <div class="flex justify-end items-center mb-4 gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#ffca28]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span class="text-xl font-black text-[#ffca28] tracking-tighter">{{ formatCurrency(record.total) }}</span>
          </div>

          <div class="flex gap-4 border-t border-slate-200 dark:border-[#1e2330] pt-4" v-if="record.kitsText || record.cerasText">
            <div v-if="record.kitsText" class="flex-1 relative group">
              <span class="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Texto Kit's</span>
              <pre class="mt-1 bg-white dark:bg-[#151822] border border-slate-200 dark:border-[#1e2330] text-slate-600 dark:text-gray-400 p-3 pr-10 rounded-xl text-[10px] font-mono overflow-x-auto custom-scrollbar min-h-[60px]">{{ record.kitsText }}</pre>
              <button @click="copiarTexto(record.kitsText)" class="absolute top-6 right-2 bg-slate-200 dark:bg-[#1e2330] p-1.5 rounded-lg text-slate-600 hover:text-[#ffca28] opacity-0 group-hover:opacity-100 transition shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            </div>
            <div v-if="record.cerasText" class="flex-1 relative group">
              <span class="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Texto Ceras</span>
              <pre class="mt-1 bg-white dark:bg-[#151822] border border-slate-200 dark:border-[#1e2330] text-slate-600 dark:text-gray-400 p-3 pr-10 rounded-xl text-[10px] font-mono overflow-x-auto custom-scrollbar min-h-[60px]">{{ record.cerasText }}</pre>
              <button @click="copiarTexto(record.cerasText)" class="absolute top-6 right-2 bg-slate-200 dark:bg-[#1e2330] p-1.5 rounded-lg text-slate-600 hover:text-[#ffca28] opacity-0 group-hover:opacity-100 transition shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button v-if="history.length > 0" @click="emit('clearHistory')" class="w-full py-5 bg-red-50 dark:bg-[#1f1517] hover:bg-red-100 dark:hover:bg-[#2a1b1e] text-red-500 font-bold text-xs tracking-widest uppercase transition">
        Apagar Todo Histórico
      </button>
    </div>
  </div>
</template>