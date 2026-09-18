<script setup lang="ts">
import { ref, onMounted } from 'vue'
import logoUrl from '../assets/logo.png'

const searchQuery = defineModel<string>('searchQuery')

defineProps<{
  isDarkMode: boolean;
}>()

const emit = defineEmits<{
  (e: 'toggleTheme'): void;
  (e: 'openHistory'): void;
  (e: 'openCalculator'): void;
}>()

const isAuthenticated = ref<boolean>(false)

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('alta_repair_token')
})

const handleLogin = () => {
  // Ajuste esta URL para a rota que inicializa o OAuth2 no seu backend real
  window.location.href = 'http://localhost:3000/auth/calculator/discord'
}

const handleLogout = () => {
  localStorage.removeItem('alta_repair_token')
  isAuthenticated.value = false
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
      
      <!-- BOTÃO DE LOGIN / LOGOUT DO DISCORD -->
      <button 
        v-if="!isAuthenticated" 
        @click="handleLogin" 
        class="h-11 px-4 flex items-center justify-center gap-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs uppercase tracking-widest transition shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 127.14 96.36">
          <path d="M107.7 8.07A105.15 105.15 0 0081.47 0a72.06 72.06 0 00-3.36 6.83 97.68 97.68 0 00-29.08 0A72.37 72.37 0 0045.67 0 105.15 105.15 0 0019.44 8.07C2.79 32.65-1.74 56.63.53 80.2a105.73 105.73 0 0032.1 16.16 77.7 77.7 0 006.89-11.1 68.42 68.42 0 01-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0064.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 01-10.87 5.19 77 77 0 006.89 11.1 105.25 105.25 0 0032.14-16.16c2.61-27.19-4.32-50.51-18.77-72.14zM42.56 65.31c-5.36 0-9.76-4.9-9.76-10.93s4.3-10.93 9.76-10.93c5.5 0 9.8 4.96 9.76 10.93 0 6-4.3 10.93-9.76 10.93zm42.02 0c-5.36 0-9.76-4.9-9.76-10.93s4.3-10.93 9.76-10.93c5.5 0 9.8 4.96 9.76 10.93 0 6-4.3 10.93-9.76 10.93z"/>
        </svg>
        Login
      </button>
      <button 
        v-else 
        @click="handleLogout" 
        class="h-11 px-4 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest transition border border-red-500/20 shadow-sm"
      >
        Sair
      </button>

      <button @click="$emit('openCalculator')" class="w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-[#ffca28] transition shadow-sm" title="Calculadora 15%">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>

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
    </div>
  </header>
</template>