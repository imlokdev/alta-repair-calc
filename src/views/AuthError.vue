<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Extrai a mensagem da URL e decodifica (ex: %20 vira espaço)
const errorMessage = computed(() => {
  const msg = route.query.message as string
  return msg 
    ? decodeURIComponent(msg) 
    : 'Ocorreu um erro desconhecido durante a autenticação. Verifique sua conta e tente novamente.'
})

const handleTryAgain = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  window.location.href = `${apiUrl}/auth/calculator/discord`
}

const handleGoHome = () => {
  router.replace('/')
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#f4f6f8] dark:bg-[#0b0e14] p-4 transition-colors">
    <div class="max-w-md w-full bg-white dark:bg-[#151822] rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/30 p-8 flex flex-col items-center text-center">
      
      <!-- Ícone de Alerta -->
      <div class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-6 border-4 border-red-50 dark:border-red-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 class="text-2xl font-black italic text-slate-900 dark:text-white uppercase tracking-tight mb-2">
        Acesso <span class="text-red-500">Negado</span>
      </h1>
      
      <p class="text-sm font-semibold text-slate-600 dark:text-gray-400 mb-8 leading-relaxed">
        {{ errorMessage }}
      </p>

      <div class="flex flex-col w-full gap-3">
        <button 
          @click="handleTryAgain" 
          class="cursor-pointer w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-[#5865F2] hover:bg-[#4752C4] transition shadow-lg shadow-[#5865F2]/20"
        >
          Tentar Novamente
        </button>
        
        <button 
          @click="handleGoHome" 
          class="cursor-pointer w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-[#1e2330] hover:bg-slate-200 dark:hover:bg-gray-800 transition"
        >
          Voltar para a Calculadora
        </button>
      </div>

    </div>
  </div>
</template>