<script setup>
import { ref, computed, onMounted } from 'vue'
import logoUrl from './assets/logo.png' 

// 1. DADOS OTIMIZADOS COM CATEGORIAS CORRIGIDAS
const mechanicsItems = [
  // MECÂNICA
  { id: 'veic', name: 'REPARO DE VEÍCULOS', outputName: 'Reparo de Veículos', price: 150, icon: '🚗', category: 'MECÂNICA', isCera: false, isKit: false },
  { id: 'aero_rep', name: 'REPARO DE AERONAVES', outputName: 'Reparo de Aeronaves', price: 600, icon: '✈️', category: 'MECÂNICA', isCera: false, isKit: false },
  { id: 'pneu_rep', name: 'TROCA DE PNEU E REPARO', outputName: 'Troca de Pneu e Reparo', price: 180, icon: '🔧', category: 'MECÂNICA', isCera: false, isKit: false },
  { id: 'guinc_vei', name: 'GUINCHO ADICIONAL', outputName: 'Guincho Adicional', price: 250, icon: '🚚', category: 'MECÂNICA', isCera: false, isKit: false },

  // KIT'S
  { id: 'kit_sim', name: 'KIT REPARO SIMPLES', outputName: 'Kit Simples', price: 600, icon: '🧰', category: 'KIT\'s', isCera: false, isKit: true },
  { id: 'kit_ava', name: 'KIT REPARO AVANÇADO', outputName: 'Kit Avançado', price: 2200, icon: '🧰', category: 'KIT\'s', isCera: false, isKit: true },

  // SEGURO
  { id: 'seg_norm', name: 'MANDAR CARRO PARA O SEGURO', outputName: 'Seguro de Carro', price: 500, icon: '📄', category: 'SEGURO', isCera: false, isKit: false },
  { id: 'seg_expl', name: 'SEGURO PARA CARRO EXPLODIDO', outputName: 'Seguro (Carro Explodido)', price: 600, icon: '💥', category: 'SEGURO', isCera: false, isKit: false },
  { id: 'seg_aero', name: 'SEGURO DE AERONAVES', outputName: 'Seguro de Aeronaves', price: 700, icon: '✈️', category: 'SEGURO', isCera: false, isKit: false },

  // ESTÉTICA (Ceras)
  { id: 'cera_sim', name: 'CERA AUTOMOTIVA SIMPLES', outputName: 'Cera Simples', price: 600, icon: '🧴', category: 'ESTÉTICA', isCera: true, isKit: false },
  { id: 'cera_pre', name: 'CERA AUTOMOTIVA PREMIUM', outputName: 'Cera Premium', price: 1800, icon: '🧴', category: 'ESTÉTICA', isCera: true, isKit: false },
  { id: 'cera_del', name: 'CERA AUTOMOTIVA DELUXE', outputName: 'Cera Deluxe', price: 4200, icon: '💎', category: 'ESTÉTICA', isCera: true, isKit: false },

  // OUTROS
  { id: 'chave_gri', name: 'CHAVE DE GRIFO', outputName: 'Chave de Grifo', price: 700, icon: '🔧', category: 'OUTROS', isCera: false, isKit: false },
  { id: 'venda_pne', name: 'VENDA DE PNEU', outputName: 'Pneu', price: 180, icon: '🛞', category: 'OUTROS', isCera: false, isKit: false },
  { id: 'gal_vaz', name: 'GALÃO VAZIO DE GASOLINA', outputName: 'Galão Vazio', price: 300, icon: '🛢️', category: 'OUTROS', isCera: false, isKit: false },
  { id: 'venda_gal', name: 'GALÃO DE COMBUSTÍVEL CHEIO', outputName: 'Galão Cheio', price: 700, icon: '⛽', category: 'OUTROS', isCera: false, isKit: false }
]

const categories = ['MECÂNICA', 'KIT\'s', 'SEGURO', 'ESTÉTICA', 'OUTROS']
const activeCategory = ref('MECÂNICA')
const searchQuery = ref('')

const quantities = ref(mechanicsItems.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}))
const passportId = ref('')
const showPassportWarning = ref(false) // Estado para controlar o aviso visual

const history = ref([])
const isDarkMode = ref(true)
const showModal = ref(false)

const toggleTheme = (dark) => {
  isDarkMode.value = dark
  dark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
}

onMounted(() => {
  toggleTheme(true)
  const savedHistory = localStorage.getItem('alta_repair_history')
  if (savedHistory) history.value = JSON.parse(savedHistory)
})

const filteredItems = computed(() => {
  return mechanicsItems.filter(item => {
    if (searchQuery.value) {
      return item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    }
    if (!activeCategory.value) return true
    return item.category === activeCategory.value
  })
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

const grandTotal = computed(() => mechanicsItems.reduce((total, item) => total + (quantities.value[item.id] * item.price), 0))

const itemsInOrder = computed(() => {
  const selected = mechanicsItems.filter(item => quantities.value[item.id] > 0)
  if (selected.length === 0) return 'Nenhum item...'
  return selected.map(item => `${quantities.value[item.id]}x ${item.outputName}`).join(', ')
})

const handleLimpar = () => {
  mechanicsItems.forEach(item => quantities.value[item.id] = 0)
  passportId.value = ''
  showPassportWarning.value = false
}

const handleFinalizar = () => {
  // Se não tem itens, não faz nada
  if (grandTotal.value === 0) return

  // Validação do passaporte
  if (!passportId.value || passportId.value <= 0) {
    showPassportWarning.value = true
    document.getElementById('passportInput')?.focus() // Foca no input
    return
  }

  showPassportWarning.value = false

  let kitsLines = []
  let cerasLines = []

  mechanicsItems.forEach(item => {
    const qty = quantities.value[item.id]
    if (qty > 0) {
      if (item.isCera) cerasLines.push(`${qty}x ${item.outputName}`)
      if (item.isKit) kitsLines.push(`${qty}x ${item.outputName}`)
    }
  })

  const header = `ID: ${passportId.value}\n\n`
  
  const generatedTextKits = kitsLines.length > 0 ? header + kitsLines.join('\n') : ''
  const generatedTextCeras = cerasLines.length > 0 ? header + cerasLines.join('\n') : ''

  const record = {
    id: Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    passportId: passportId.value,
    total: grandTotal.value,
    summary: itemsInOrder.value,
    kitsText: generatedTextKits,
    cerasText: generatedTextCeras
  }
  
  history.value.unshift(record)
  localStorage.setItem('alta_repair_history', JSON.stringify(history.value))

  mechanicsItems.forEach(item => quantities.value[item.id] = 0)
  passportId.value = ''
}

const updateQuantity = (itemId, change) => {
  const next = quantities.value[itemId] + change
  if (next >= 0) quantities.value[itemId] = next
}

const copiarTexto = async (text) => {
  if (!text) return
  try { await navigator.clipboard.writeText(text) } catch (err) { console.error('Falha ao copiar:', err) }
}

const limparHistorico = () => {
  history.value = []
  localStorage.removeItem('alta_repair_history')
}

const preventInvalidChars = (e) => {
  if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault()
}
</script>

<template>
  <!-- Wrapper principal travado com h-screen e overflow-hidden -->
  <div class="h-screen h-[100dvh] flex flex-col bg-[#f4f6f8] dark:bg-[#0b0e14] transition-colors duration-300 font-sans select-none overflow-hidden">
    
    <!-- HEADER ESTILO V2 (Paleta Amarelo) - Não shrinka -->
    <header class="shrink-0 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
      
      <!-- Logo e Título -->
      <div class="flex items-center gap-4">
        <!-- Logo Image SEM fundo/borda -->
        <div class="relative w-14 h-14 flex items-center justify-center">
          <img :src="logoUrl" alt="Alta Repair Logo" class="w-full h-full object-contain relative z-10 drop-shadow-md" />
          <div class="absolute inset-0 bg-[#ffca28] rounded-full opacity-10 blur-md"></div>
        </div>
        <div class="flex flex-col">
          <h1 class="text-3xl font-black italic tracking-tight">
            <!-- ALTA em Branco/Escuro, REPAIR em Amarelo -->
            <span class="text-slate-900 dark:text-white transition-colors">ALTA </span>
            <span class="text-[#ffca28]">REPAIR</span>
          </h1>
          <p class="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-gray-500 mt-0.5">Excelência em cada detalhe</p>
        </div>
      </div>
      
      <!-- Controles -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Histórico Modal -->
        <button @click="showModal = true" class="w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-[#ffca28] dark:hover:text-[#ffca28] transition shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </button>

        <!-- Tema -->
        <button @click="toggleTheme(!isDarkMode)" class="w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-yellow-500 hover:scale-105 transition shadow-sm">
          <span v-if="isDarkMode">☀️</span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        </button>

        <!-- Barra de Pesquisa -->
        <div class="relative flex items-center h-11">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar serviço..."
            class="w-48 h-full pl-9 pr-4 text-xs font-semibold rounded-xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-200 focus:border-[#ffca28] dark:focus:border-[#ffca28] outline-none transition shadow-sm placeholder:text-slate-400 dark:placeholder:text-gray-600"
          >
        </div>

        <!-- Input Passaporte com Validação Visual -->
        <div class="relative h-11">
          <input 
            id="passportInput"
            type="number" 
            v-model="passportId" 
            @input="showPassportWarning = false"
            @keydown="preventInvalidChars"
            @keyup.enter="handleFinalizar"
            :placeholder="showPassportWarning ? 'INFORME O ID!' : 'PASSAPORTE'"
            min="1"
            :class="[
              'no-spin-button w-36 h-full px-4 text-xs font-bold text-center uppercase tracking-widest rounded-xl bg-white dark:bg-[#151822] outline-none transition-all shadow-sm',
              showPassportWarning 
                ? 'border-2 border-red-500 text-red-500 placeholder:text-red-400 animate-pulse' 
                : 'border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-200 focus:border-[#ffca28] dark:focus:border-[#ffca28] placeholder:text-slate-400 dark:placeholder:text-gray-500'
            ]"
          >
        </div>
      </div>
    </header>

    <!-- ÁREA PRINCIPAL (miolo dinâmico) -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 flex flex-col gap-6 min-h-0">
      
      <!-- ABAS DE CATEGORIA (Fixas no topo do main) -->
      <div class="shrink-0 flex flex-wrap items-center gap-3">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = activeCategory === cat ? '' : cat; searchQuery = ''"
          class="px-8 py-3 text-xs font-bold tracking-widest rounded-xl transition-all duration-200"
          :class="activeCategory === cat && !searchQuery 
            ? 'bg-[#ffca28] text-slate-900 shadow-lg shadow-yellow-500/20' 
            : 'bg-transparent border border-slate-300 dark:border-gray-800 text-slate-500 dark:text-gray-500 hover:border-slate-400 dark:hover:border-gray-600'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- GRID SOLTO DE ITENS (Scrolla apenas aqui dentro) -->
      <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
        <section v-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-[#1e2330] hover:border-[#ffca28] dark:hover:border-[#ffca28] transition duration-200 shadow-sm min-h-[100px]"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#0b0e14] text-2xl shadow-inner">
                {{ item.icon }}
              </div>
              <div class="flex flex-col">
                <p class="text-[13px] font-bold text-slate-800 dark:text-gray-200 tracking-wide uppercase">{{ item.name }}</p>
                <p class="text-[13px] font-black text-[#ffca28] mt-1 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {{ formatCurrency(item.price) }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 bg-slate-100 dark:bg-[#0b0e14] p-2 rounded-xl border border-slate-200 dark:border-transparent">
              <button @click="updateQuantity(item.id, -1)" class="w-8 h-8 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-[#1e2330] transition flex items-center justify-center text-sm font-bold">-</button>
              <span class="font-black text-lg text-slate-800 dark:text-white w-6 text-center">{{ quantities[item.id] }}</span>
              <button @click="updateQuantity(item.id, 1)" class="w-8 h-8 rounded-lg text-slate-500 hover:text-green-500 hover:bg-slate-200 dark:hover:bg-[#1e2330] transition flex items-center justify-center text-sm font-bold">+</button>
            </div>
          </div>
        </section>
        <div v-else class="text-slate-500 dark:text-gray-500 text-sm mt-10">Nenhum serviço encontrado.</div>
      </div>

    </main>

    <!-- BARRA INFERIOR (Agora como bloco flex, sem absolute/fixed) -->
    <div class="shrink-0 w-full bg-white dark:bg-[#0b0e14] border-t border-slate-200 dark:border-[#1e2330] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 transition-colors">
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
          
          <div class="hidden md:block w-px h-12 bg-slate-200 dark:bg-[#1e2330]"></div>

          <div class="flex flex-col max-w-[200px] lg:max-w-[400px]">
            <span class="text-[10px] font-bold tracking-widest text-[#ffca28] uppercase mb-1">Itens na ordem:</span>
            <span class="text-xs text-slate-500 dark:text-gray-500 truncate italic">{{ itemsInOrder }}</span>
          </div>
        </div>

        <!-- Direita: Botões -->
        <div class="flex items-center gap-4 w-full md:w-auto">
          <button 
            @click="handleLimpar"
            class="px-8 h-12 rounded-xl font-bold text-xs uppercase tracking-widest text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition w-full md:w-auto"
          >
            Limpar
          </button>
          <button 
            @click="handleFinalizar"
            :disabled="grandTotal === 0"
            class="px-10 h-12 rounded-xl font-black text-xs uppercase tracking-widest text-slate-900 bg-[#ffca28] hover:bg-[#ffd54f] disabled:opacity-50 disabled:cursor-not-allowed transition w-full md:w-auto shadow-lg shadow-yellow-500/20"
          >
            Finalizar Atendimento
          </button>
        </div>

      </div>
    </div>

    <!-- MODAL DE HISTÓRICO -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
      <div class="bg-white dark:bg-[#151822] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-[#1e2330]">
        
        <div class="flex items-center justify-between p-6">
          <h3 class="font-black italic text-2xl tracking-tighter text-slate-900 dark:text-white">
            HISTÓRICO DE <span class="text-[#ffca28]">VENDAS</span>
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
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

            <!-- Caixas de Cópia Rápidas no Histórico -->
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

        <button v-if="history.length > 0" @click="limparHistorico" class="w-full py-5 bg-red-50 dark:bg-[#1f1517] hover:bg-red-100 dark:hover:bg-[#2a1b1e] text-red-500 font-bold text-xs tracking-widest uppercase transition">
          Apagar Todo Histórico
        </button>
      </div>
    </div>

  </div>
</template>

<style>
body { background-color: transparent; margin: 0; padding: 0; overflow: hidden; } /* Trava o scroll global */

.no-spin-button::-webkit-outer-spin-button,
.no-spin-button::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spin-button {
  -moz-appearance: textfield;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #1e2330; 
}
</style>