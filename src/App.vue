<script setup>
import { ref, computed, onMounted } from 'vue'

const mechanicsItems = [
  // Coluna Esquerda
  { id: 'veic', name: 'REPARO DE VEÍCULOS', outputName: 'Reparo de Veículos', price: 150, icon: '🚗', colorClass: 'bg-slate-200 dark:bg-slate-700', isCera: false, isKit: false },
  { id: 'seg_norm', name: 'MANDAR CARRO PARA O SEGURO', outputName: 'Seguro de Carro', price: 500, icon: '📄', colorClass: 'bg-slate-200 dark:bg-slate-700', isCera: false, isKit: false },
  { id: 'seg_expl', name: 'SEGURO PARA CARRO EXPLODIDO', outputName: 'Seguro (Carro Explodido)', price: 600, icon: '💥', colorClass: 'bg-red-200 dark:bg-red-900/60', isCera: false, isKit: false },
  { id: 'pneu_rep', name: 'TROCA DE PNEU E REPARO', outputName: 'Troca de Pneu e Reparo', price: 180, icon: '🔧', colorClass: 'bg-slate-200 dark:bg-slate-700', isCera: false, isKit: false },
  { id: 'gal_vaz', name: 'GALÃO VAZIO DE GASOLINA', outputName: 'Galão Vazio', price: 300, icon: '🛢️', colorClass: 'bg-slate-200 dark:bg-slate-700', isCera: false, isKit: false },
  
  // CERAS
  { id: 'cera_sim', name: 'CERA AUTOMOTIVA SIMPLES', outputName: 'Cera Simples', price: 600, icon: '🧴', colorClass: 'bg-gray-300 dark:bg-gray-600', isCera: true, isKit: false },
  { id: 'cera_pre', name: 'CERA AUTOMOTIVA PREMIUM', outputName: 'Cera Premium', price: 1800, icon: '🧴', colorClass: 'bg-blue-300 dark:bg-blue-800/80', isCera: true, isKit: false },
  { id: 'cera_del', name: 'CERA AUTOMOTIVA DELUXE', outputName: 'Cera Deluxe', price: 4200, icon: '🧴', colorClass: 'bg-purple-300 dark:bg-fuchsia-900/80', isCera: true, isKit: false },

  // Coluna Direita
  { id: 'seg_aero', name: 'SEGURO DE AERONAVES', outputName: 'Seguro de Aeronaves', price: 700, icon: '✈️', colorClass: 'bg-indigo-200 dark:bg-indigo-900/70', isCera: false, isKit: false },
  { id: 'aero_rep', name: 'REPARO DE AERONAVES', outputName: 'Reparo de Aeronaves', price: 600, icon: '✈️', colorClass: 'bg-orange-200 dark:bg-orange-900/70', isCera: false, isKit: false },
  
  // KITS
  { id: 'kit_sim', name: 'KIT REPARO SIMPLES', outputName: 'Kit Simples', price: 600, icon: '🧰', colorClass: 'bg-gray-300 dark:bg-gray-600', isCera: false, isKit: true },
  { id: 'kit_ava', name: 'KIT REPARO AVANÇADO', outputName: 'Kit Avançado', price: 2200, icon: '🧰', colorClass: 'bg-yellow-200 dark:bg-yellow-700/60', isCera: false, isKit: true },
  
  { id: 'chave_gri', name: 'CHAVE DE GRIFO', outputName: 'Chave de Grifo', price: 700, icon: '🔧', colorClass: 'bg-slate-200 dark:bg-slate-700', isCera: false, isKit: false },
  { id: 'guinc_vei', name: 'GUINCHO ADICIONAL DE VEÍCULOS', outputName: 'Guincho Adicional', price: 250, icon: '🚚', colorClass: 'bg-slate-200 dark:bg-slate-700', isCera: false, isKit: false },
  { id: 'venda_pne', name: 'VENDA DE PNEU', outputName: 'Pneu', price: 180, icon: '🛞', colorClass: 'bg-slate-200 dark:bg-slate-700', isCera: false, isKit: false },
  { id: 'venda_gal', name: 'VENDA DE GALÃO DE COMBUSTÍVEL CHEIO', outputName: 'Galão de Combustível Cheio', price: 700, icon: '⛽', colorClass: 'bg-slate-200 dark:bg-slate-700', isCera: false, isKit: false }
]

const quantities = ref(mechanicsItems.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}))
const passportId = ref('')

const generatedTextKits = ref('')
const generatedTextCeras = ref('')
const activeTab = ref('kits')

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

// Formatação estilo Real com casas decimais zeradas (sem R$)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

const grandTotal = computed(() => mechanicsItems.reduce((total, item) => total + (quantities.value[item.id] * item.price), 0))

const handleLimpar = () => {
  mechanicsItems.forEach(item => quantities.value[item.id] = 0)
  passportId.value = ''
  generatedTextKits.value = ''
  generatedTextCeras.value = ''
}

const handleFinalizar = () => {
  if (grandTotal.value === 0 || !passportId.value || passportId.value <= 0) return

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
  
  generatedTextKits.value = kitsLines.length > 0 ? header + kitsLines.join('\n') : ''
  generatedTextCeras.value = cerasLines.length > 0 ? header + cerasLines.join('\n') : ''

  if (kitsLines.length > 0) activeTab.value = 'kits'
  else if (cerasLines.length > 0) activeTab.value = 'ceras'

  const record = {
    id: Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    passportId: passportId.value,
    total: grandTotal.value,
    kitsText: generatedTextKits.value,
    cerasText: generatedTextCeras.value
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
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Falha ao copiar:', err)
  }
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
  <div class="min-h-screen p-3 md:p-6 flex flex-col items-center select-none font-sans bg-slate-100 dark:bg-[#0f172a] transition-colors duration-300 pb-16">
    
    <div class="fixed top-1/2 right-0 -translate-y-1/2 z-50 flex">
      <div 
        class="translate-x-[calc(100%-44px)] hover:translate-x-0 transition-transform duration-300 ease-in-out flex items-center shadow-2xl border-y border-l rounded-l-xl overflow-hidden"
        :class="isDarkMode ? 'bg-slate-100 border-slate-300' : 'bg-gray-800 border-gray-700'"
      >
        <div 
          class="w-11 h-12 flex items-center justify-center text-xl cursor-pointer"
          :class="isDarkMode ? 'text-slate-700' : 'text-gray-200'"
          @click="toggleTheme(!isDarkMode)"
        >
          <span v-if="isDarkMode">☀️</span>
          <span v-else>🌙</span>
        </div>
        <button 
          @click="toggleTheme(!isDarkMode)" 
          class="px-4 h-12 font-bold text-xs uppercase tracking-wider transition-colors border-l"
          :class="isDarkMode ? 'text-slate-700 hover:text-blue-600 border-slate-300' : 'text-gray-200 hover:text-blue-400 border-gray-700'"
        >
          Modo {{ isDarkMode ? 'Claro' : 'Escuro' }}
        </button>
      </div>
    </div>

    <header class="w-full max-w-6xl flex items-center justify-between mb-6 pb-4 border-b border-slate-300 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-full bg-blue-600 font-bold text-sm text-white shadow-md">ALTA</div>
        <div class="flex flex-col">
          <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none transition-colors">ALTA REPAIR</h1>
          <p class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500 leading-none mt-1">TABELA MECÂNICA</p>
        </div>
      </div>
      
      <div class="w-[200px]">
        <label class="block text-xs font-semibold mb-1 text-slate-600 dark:text-gray-400 transition-colors">ID CLIENTE (Passaporte) *</label>
        <input 
          type="number" 
          v-model="passportId" 
          placeholder="Ex: 314"
          min="1"
          @keydown="preventInvalidChars"
          @keyup.enter="handleFinalizar"
          class="no-spin-button w-full p-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none tabular-nums placeholder:text-slate-400 dark:placeholder:text-gray-600 shadow-sm transition-all"
        >
      </div>
    </header>

    <main class="w-full max-w-6xl flex flex-col gap-6">
      
      <section class="bg-white dark:bg-gray-800/40 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-8 items-stretch transition-colors">
        <div class="space-y-2.5">
          <div v-for="item in mechanicsItems.slice(0, 8)" :key="item.id" class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700/50 hover:border-blue-500/50 transition duration-150 shadow-sm">
            <div class="flex items-center gap-3 flex-1 overflow-hidden pl-1">
              <div :class="item.colorClass" class="w-8 h-8 rounded-md flex items-center justify-center text-lg flex-shrink-0 shadow-inner">{{ item.icon }}</div>
              <div class="flex-1 overflow-hidden">
                <p class="text-xs font-bold text-slate-700 dark:text-gray-200 tracking-tight leading-tight truncate">{{ item.name }}</p>
                <p class="text-[10px] text-slate-500 dark:text-gray-500 font-medium leading-tight truncate mt-0.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {{ formatCurrency(item.price) }} / un
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1 bg-slate-200 dark:bg-gray-800 p-1 rounded-md border border-slate-300 dark:border-gray-700">
              <button @click="updateQuantity(item.id, -1)" class="w-7 h-7 rounded bg-white dark:bg-gray-700/50 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition font-mono text-sm shadow-sm">-</button>
              <span class="font-bold text-sm text-slate-800 dark:text-white w-6 text-center tabular-nums">{{ quantities[item.id] }}</span>
              <button @click="updateQuantity(item.id, 1)" class="w-7 h-7 rounded bg-white dark:bg-gray-700/50 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-500/20 dark:hover:text-green-400 transition font-mono text-sm shadow-sm">+</button>
            </div>
          </div>
        </div>

        <div class="hidden md:flex justify-center items-center py-2"><div class="w-px h-full bg-slate-200 dark:bg-gray-700/50 transition-colors"></div></div>

        <div class="space-y-2.5">
          <div v-for="item in mechanicsItems.slice(8)" :key="item.id" class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700/50 hover:border-blue-500/50 transition duration-150 shadow-sm">
            <div class="flex items-center gap-3 flex-1 overflow-hidden pl-1">
              <div :class="item.colorClass" class="w-8 h-8 rounded-md flex items-center justify-center text-lg flex-shrink-0 shadow-inner">{{ item.icon }}</div>
              <div class="flex-1 overflow-hidden">
                <p class="text-xs font-bold text-slate-700 dark:text-gray-200 tracking-tight leading-tight truncate">{{ item.name }}</p>
                <p class="text-[10px] text-slate-500 dark:text-gray-500 font-medium leading-tight truncate mt-0.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {{ formatCurrency(item.price) }} / un
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1 bg-slate-200 dark:bg-gray-800 p-1 rounded-md border border-slate-300 dark:border-gray-700">
              <button @click="updateQuantity(item.id, -1)" class="w-7 h-7 rounded bg-white dark:bg-gray-700/50 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition font-mono text-sm shadow-sm">-</button>
              <span class="font-bold text-sm text-slate-800 dark:text-white w-6 text-center tabular-nums">{{ quantities[item.id] }}</span>
              <button @click="updateQuantity(item.id, 1)" class="w-7 h-7 rounded bg-white dark:bg-gray-700/50 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-500/20 dark:hover:text-green-400 transition font-mono text-sm shadow-sm">+</button>
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-6 items-stretch">
        
        <div class="bg-white dark:bg-gray-800/40 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-lg flex flex-col justify-between transition-colors">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-sm font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider">Resumo da Venda</h2>
            <div class="flex items-center gap-3">
                <span class="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">TOTAL A COBRAR:</span>
                <span class="text-3xl font-black text-green-600 dark:text-green-400 tracking-tighter tabular-nums leading-none flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {{ formatCurrency(grandTotal) }}
                </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-auto">
            <button @click="handleLimpar" class="py-3.5 rounded-lg font-bold text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50 transition duration-200 flex items-center justify-center gap-2 shadow-sm">
              LIMPAR TUDO
            </button>
            <button @click="handleFinalizar" :disabled="!passportId || grandTotal === 0" class="py-3.5 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-gray-800 disabled:text-slate-500 dark:disabled:text-gray-600 transition duration-200 flex items-center justify-center gap-2 shadow-md disabled:shadow-none">
              FINALIZAR
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-inner flex flex-col h-full min-h-[160px] overflow-hidden transition-colors">
          <div class="flex bg-slate-100 dark:bg-black border-b border-slate-200 dark:border-gray-800 transition-colors">
            <button 
              @click="activeTab = 'kits'" 
              :class="activeTab === 'kits' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-900' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/50'"
              class="flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Kit's
            </button>
            <div class="w-px bg-slate-200 dark:bg-gray-800 transition-colors"></div>
            <button 
              @click="activeTab = 'ceras'" 
              :class="activeTab === 'ceras' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-900' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/50'"
              class="flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Ceras
            </button>
          </div>

          <div class="flex-1 p-3 relative group">
            <textarea 
              v-if="activeTab === 'kits'"
              v-model="generatedTextKits"
              placeholder="Aguardando finalização de Kits..."
              class="custom-scrollbar w-full h-full bg-transparent text-slate-800 dark:text-slate-300 font-mono text-xs resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
            ></textarea>
            <textarea 
              v-if="activeTab === 'ceras'"
              v-model="generatedTextCeras"
              placeholder="Aguardando finalização de Ceras..."
              class="custom-scrollbar w-full h-full bg-transparent text-slate-800 dark:text-slate-300 font-mono text-xs resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
            ></textarea>
            <button 
              @click="copiarTexto(activeTab === 'kits' ? generatedTextKits : generatedTextCeras)"
              class="absolute top-2 right-2 p-1.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition opacity-0 group-hover:opacity-100 focus:opacity-100 shadow"
              title="Copiar Texto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          </div>
        </div>

      </section>

      <div class="flex justify-center mt-2">
        <button @click="showModal = true" class="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition underline underline-offset-4">
          Ver Histórico de Vendas
        </button>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-slate-200 dark:border-gray-700">
        
        <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700">
          <h3 class="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">Histórico Salvo</h3>
          <button @click="showModal = false" class="text-slate-500 hover:text-slate-800 dark:hover:text-white">✕</button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div v-if="history.length === 0" class="text-center text-slate-500 dark:text-gray-500 italic py-8">Está vazio por aqui...</div>
          
          <div v-for="record in history" :key="record.id" class="bg-slate-50 dark:bg-gray-900 p-4 rounded-lg border border-slate-200 dark:border-gray-700">
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-3">
                <span class="text-xs font-mono bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">ID: {{ record.passportId }}</span>
                <span class="text-xs text-slate-500">{{ record.time }}</span>
              </div>
              <span class="font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {{ formatCurrency(record.total) }}
              </span>
            </div>
            
            <div class="flex gap-4">
              <div v-if="record.kitsText" class="flex-1 flex flex-col gap-1">
                <span class="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold">Kit's</span>
                <div class="relative group h-full">
                  <pre class="custom-scrollbar overflow-x-auto bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-slate-300 p-2 rounded text-[10px] font-mono h-full">{{ record.kitsText }}</pre>
                  <button @click="copiarTexto(record.kitsText)" class="absolute top-1 right-1 bg-white dark:bg-gray-700 p-1 rounded shadow text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                </div>
              </div>
              <div v-if="record.cerasText" class="flex-1 flex flex-col gap-1">
                <span class="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold">Ceras</span>
                <div class="relative group h-full">
                  <pre class="custom-scrollbar overflow-x-auto bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-slate-300 p-2 rounded text-[10px] font-mono h-full">{{ record.cerasText }}</pre>
                  <button @click="copiarTexto(record.cerasText)" class="absolute top-1 right-1 bg-white dark:bg-gray-700 p-1 rounded shadow text-slate-600 hover:text-purple-600 dark:hover:text-purple-400 opacity-0 group-hover:opacity-100 transition"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-200 dark:border-gray-700 flex justify-end">
          <button @click="limparHistorico" v-if="history.length > 0" class="text-xs text-red-500 hover:underline mr-auto flex items-center">Limpar Histórico</button>
          <button @click="showModal = false" class="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-bold rounded hover:bg-slate-300 dark:hover:bg-slate-700 transition">Fechar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
body { background-color: transparent; }

/* Remove as setinhas dos inputs numéricos */
.no-spin-button::-webkit-outer-spin-button,
.no-spin-button::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spin-button {
  -moz-appearance: textfield;
}

/* Scrollbar Customizada Global */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; /* slate-300 para o modo claro */
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569; /* slate-600 para o modo escuro */
}
</style>