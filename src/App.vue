<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { mechanicsItems, categories } from './data/mechanics'
import { formatCurrency } from './utils/formatters'
import type { HistoryRecord } from './types'

import AppHeader from './components/AppHeader.vue'
import ServiceCard from './components/ServiceCard.vue'
import CheckoutBar from './components/CheckoutBar.vue'

const activeCategory = ref<string>('MECÂNICA')
const searchQuery = ref<string>('')

// Tipagem correta do objeto dicionário para evitar erros de índice no TS
const quantities = ref<Record<string, number>>(
  mechanicsItems.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
)

const passportId = ref<string>('')
const showPassportWarning = ref<boolean>(false)
const history = ref<HistoryRecord[]>([])
const isDarkMode = ref<boolean>(true)
const showModal = ref<boolean>(false)

const toggleTheme = (dark?: boolean): void => {
  isDarkMode.value = dark ?? !isDarkMode.value
  isDarkMode.value ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
}

onMounted(() => {
  toggleTheme(true)
  const savedHistory = localStorage.getItem('alta_repair_history')
  if (savedHistory) history.value = JSON.parse(savedHistory)
})

watch(passportId, () => {
  if (passportId.value) showPassportWarning.value = false
})

const filteredItems = computed(() => {
  return mechanicsItems.filter(item => {
    if (searchQuery.value) return item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    if (!activeCategory.value) return true
    return item.category === activeCategory.value
  })
})

const grandTotal = computed<number>(() => 
  mechanicsItems.reduce((total, item) => total + (quantities.value[item.id] * item.price), 0)
)

const itemsInOrder = computed<string>(() => {
  const selected = mechanicsItems.filter(item => quantities.value[item.id] > 0)
  return selected.length === 0 
    ? 'Nenhum item...' 
    : selected.map(item => `${quantities.value[item.id]}x ${item.outputName}`).join(', ')
})

const handleLimpar = (): void => {
  mechanicsItems.forEach(item => quantities.value[item.id] = 0)
  passportId.value = ''
  showPassportWarning.value = false
}

const handleFinalizar = (): void => {
  if (grandTotal.value === 0) return

  if (!passportId.value || Number(passportId.value) <= 0) {
    showPassportWarning.value = true
    document.getElementById('passportInput')?.focus()
    return
  }

  const kitsLines: string[] = []
  const cerasLines: string[] = []

  mechanicsItems.forEach(item => {
    const qty = quantities.value[item.id]
    if (qty > 0) {
      if (item.isCera) cerasLines.push(`${qty}x ${item.outputName}`)
      if (item.isKit) kitsLines.push(`${qty}x ${item.outputName}`)
    }
  })

  const header = `ID: ${passportId.value}\n\n`
  
  const record: HistoryRecord = {
    id: Date.now(),
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    passportId: passportId.value,
    total: grandTotal.value,
    summary: itemsInOrder.value,
    kitsText: kitsLines.length > 0 ? header + kitsLines.join('\n') : '',
    cerasText: cerasLines.length > 0 ? header + cerasLines.join('\n') : ''
  }
  
  history.value.unshift(record)
  localStorage.setItem('alta_repair_history', JSON.stringify(history.value))
  handleLimpar()
}

const updateQuantity = (itemId: string, change: number): void => {
  const next = quantities.value[itemId] + change
  if (next >= 0) quantities.value[itemId] = next
}
</script>

<template>
  <div class="h-screen h-[100dvh] flex flex-col bg-[#f4f6f8] dark:bg-[#0b0e14] transition-colors duration-300 font-sans select-none overflow-hidden">
    
    <AppHeader 
      v-model:searchQuery="searchQuery" 
      v-model:passportId="passportId" 
      :isDarkMode="isDarkMode" 
      :showPassportWarning="showPassportWarning"
      @toggleTheme="toggleTheme()" 
      @openHistory="showModal = true" 
      @finalize="handleFinalizar" 
    />

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 flex flex-col gap-6 min-h-0">
      <div class="shrink-0 flex flex-wrap items-center gap-3">
        <button 
          v-for="cat in categories" :key="cat"
          @click="activeCategory = activeCategory === cat ? '' : cat; searchQuery = ''"
          class="px-8 py-3 text-xs font-bold tracking-widest rounded-xl transition-all duration-200"
          :class="activeCategory === cat && !searchQuery ? 'bg-[#ffca28] text-slate-900 shadow-lg shadow-yellow-500/20' : 'bg-transparent border border-slate-300 dark:border-gray-800 text-slate-500 hover:border-slate-400'"
        >
          {{ cat }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
        <section v-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
          <ServiceCard 
            v-for="item in filteredItems" 
            :key="item.id" 
            :item="item" 
            :quantity="quantities[item.id]" 
            @updateQuantity="updateQuantity" 
          />
        </section>
        <div v-else class="text-slate-500 text-sm mt-10">Nenhum serviço encontrado.</div>
      </div>
    </main>

    <CheckoutBar 
      :grandTotal="grandTotal" 
      :itemsInOrder="itemsInOrder" 
      @clear="handleLimpar" 
      @finalize="handleFinalizar" 
    />

    <!-- O Modal de histórico pode ser injetado aqui -->
    <!-- <HistoryModal :show="showModal" :history="history" @close="showModal = false" @clearHistory="history = []; localStorage.removeItem('alta_repair_history')" /> -->
  </div>
</template>

<style>
/* Seus estilos globais originais permanecem aqui */
body { background-color: transparent; margin: 0; padding: 0; overflow: hidden; }
.no-spin-button::-webkit-outer-spin-button, .no-spin-button::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.no-spin-button { -moz-appearance: textfield; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1e2330; }
</style>