<script setup lang="ts">
import logoUrl from '../assets/logo.png'

const searchQuery = defineModel<string>('searchQuery')
const passportId = defineModel<string>('passportId')

defineProps<{
  isDarkMode: boolean;
  showPassportWarning: boolean;
}>()

defineEmits<{
  (e: 'toggleTheme'): void;
  (e: 'openHistory'): void;
  (e: 'finalize'): void;
}>()

const preventInvalidChars = (e: KeyboardEvent): void => {
  if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault()
}
</script>

<template>
  <header class="shrink-0 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="flex items-center gap-4">
      <div class="relative w-14 h-14 flex items-center justify-center">
        <img :src="logoUrl" alt="Alta Repair Logo" class="w-full h-full object-contain relative z-10 drop-shadow-md" />
        <div class="absolute inset-0 bg-[#ffca28] rounded-full opacity-10 blur-md"></div>
      </div>
      <div class="flex flex-col">
        <h1 class="text-3xl font-black italic tracking-tight">
          <span class="text-slate-900 dark:text-white transition-colors">ALTA </span>
          <span class="text-[#ffca28]">REPAIR</span>
        </h1>
        <p class="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-gray-500 mt-0.5">Excelência em cada detalhe</p>
      </div>
    </div>
    
    <div class="flex flex-wrap items-center gap-3">
      <button @click="$emit('openHistory')" class="w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-[#ffca28] transition shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      </button>

      <button @click="$emit('toggleTheme')" class="w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-yellow-500 hover:scale-105 transition shadow-sm">
        <span v-if="isDarkMode">☀️</span>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      </button>

      <div class="relative flex items-center h-11">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" v-model="searchQuery" placeholder="Buscar serviço..." class="w-48 h-full pl-9 pr-4 text-xs font-semibold rounded-xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-200 focus:border-[#ffca28] outline-none transition shadow-sm placeholder:text-slate-400">
      </div>

      <div class="relative h-11">
        <input id="passportInput" type="number" v-model="passportId" @keydown="preventInvalidChars" @keyup.enter="$emit('finalize')" :placeholder="showPassportWarning ? 'INFORME O ID!' : 'PASSAPORTE'" min="1" :class="['no-spin-button w-36 h-full px-4 text-xs font-bold text-center uppercase tracking-widest rounded-xl bg-white dark:bg-[#151822] outline-none transition-all shadow-sm', showPassportWarning ? 'border-2 border-red-500 text-red-500 placeholder:text-red-400 animate-pulse' : 'border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-200 focus:border-[#ffca28] placeholder:text-slate-400']">
      </div>
    </div>
  </header>
</template>