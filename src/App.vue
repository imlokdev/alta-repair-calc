<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { mechanicsItems, categories } from './data/mechanics'
import type { HistoryRecord, ToastMessage } from './types'

import MechanicsSidebar from './components/MechanicsSidebar.vue'
import CartSidebar from './components/CartSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import ServiceCard from './components/ServiceCard.vue'
import CheckoutBar from './components/CheckoutBar.vue'
import HistoryModal from './components/HistoryModal.vue'
import ToastNotification from './components/ToastNotification.vue'

const activeCategory = ref<string>('KIT\'s')
const searchQuery = ref<string>('')
const quantities = ref<Record<string, number>>(
  mechanicsItems.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
)

const passportId = ref<string>('')
const showPassportWarning = ref<boolean>(false)
const history = ref<HistoryRecord[]>([])
const isDarkMode = ref<boolean>(true)
const showModal = ref<boolean>(false)
const highlightedRecordId = ref<number | null>(null)

// Estados das Sidebars
const isSidebarPinned = ref<boolean>(false)
const isCartPinned = ref<boolean>(false)

// Estados dos Toasts
const toasts = ref<ToastMessage[]>([])
let toastCounter = 0

onMounted(() => {
  toggleTheme(true)
  
  const savedHistory = localStorage.getItem('alta_repair_history')
  if (savedHistory) history.value = JSON.parse(savedHistory)
  
  const savedPin = localStorage.getItem('alta_repair_sidebar_pinned')
  if (savedPin === 'true') isSidebarPinned.value = true

  const savedCartPin = localStorage.getItem('alta_repair_cart_pinned')
  if (savedCartPin === 'true') isCartPinned.value = true
})

watch(isSidebarPinned, (newVal) => localStorage.setItem('alta_repair_sidebar_pinned', String(newVal)))
watch(isCartPinned, (newVal) => localStorage.setItem('alta_repair_cart_pinned', String(newVal)))
watch(passportId, () => { if (passportId.value) showPassportWarning.value = false })

const toggleTheme = (dark?: boolean): void => {
  isDarkMode.value = dark ?? !isDarkMode.value
  isDarkMode.value ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
}

// === LÓGICA DE TOASTS ===
const addToast = (toast: Omit<ToastMessage, 'id'>) => {
  const id = toastCounter++
  const wrappedOnClick = toast.onClick ? () => { toast.onClick!(); removeToast(id); } : undefined
  
  toasts.value.push({ ...toast, id, onClick: wrappedOnClick })
  setTimeout(() => removeToast(id), 5000)
}

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// === LÓGICA DE ITENS ===
const sidebarItems = computed(() => mechanicsItems.filter(item => item.category === 'MECÂNICA'))

const filteredItems = computed(() => {
  return mechanicsItems.filter(item => {
    if (item.category === 'MECÂNICA') return false
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

const updateQuantity = (itemId: string, change: number): void => {
  const next = quantities.value[itemId] + change
  if (next >= 0) quantities.value[itemId] = next
}

const setQuantity = (itemId: string, value: number): void => {
  if (value >= 0) quantities.value[itemId] = value
}

// === CHECKOUT ===
const handleLimpar = (silent = false): void => {
  mechanicsItems.forEach(item => quantities.value[item.id] = 0)
  passportId.value = ''
  showPassportWarning.value = false
  
  if (!silent) {
    addToast({ type: 'info', title: 'Carrinho Limpo', message: 'Os itens selecionados foram removidos.' })
  }
}

const openHistoryWithHighlight = (id: number) => {
  highlightedRecordId.value = id
  showModal.value = true
}

const handleFinalizar = (): void => {
  if (grandTotal.value === 0) return

  if (!passportId.value || Number(passportId.value) <= 0) {
    showPassportWarning.value = true
    document.getElementById('passportInput')?.focus()
    addToast({ type: 'error', title: 'Aviso', message: 'Preencha o Passaporte do cliente!' })
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
  const recordId = Date.now()
  
  const record: HistoryRecord = {
    id: recordId,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    passportId: passportId.value,
    total: grandTotal.value,
    summary: itemsInOrder.value,
    kitsText: kitsLines.length > 0 ? header + kitsLines.join('\n') : '',
    cerasText: cerasLines.length > 0 ? header + cerasLines.join('\n') : ''
  }
  
  history.value.unshift(record)
  localStorage.setItem('alta_repair_history', JSON.stringify(history.value))
  handleLimpar(true) // Limpa sem disparar o toast de limpar

  // Dispara o toast de sucesso com evento de clique
  addToast({ 
    type: 'success', 
    title: 'Venda Finalizada!', 
    message: 'Atendimento salvo. Clique aqui para abrir o histórico.',
    clickable: true,
    onClick: () => openHistoryWithHighlight(recordId)
  })
}

const handleClearHistory = (): void => {
  history.value = []
  localStorage.removeItem('alta_repair_history')
  addToast({ type: 'info', title: 'Histórico Apagado', message: 'Todos os registros foram excluídos do navegador.' })
}
</script>

<template>
  <div 
    class="h-screen h-[100dvh] flex flex-col bg-[#f4f6f8] dark:bg-[#0b0e14] transition-all duration-300 font-sans select-none overflow-hidden"
    :class="[
      isSidebarPinned ? 'md:pl-64 min-[1800px]:pl-0' : 'pl-0',
      isCartPinned ? 'md:pr-72 min-[1800px]:pr-0' : 'pr-0'
    ]"
  >
    <MechanicsSidebar 
      :items="sidebarItems"
      :quantities="quantities"
      v-model:pinned="isSidebarPinned"
      @updateQuantity="updateQuantity"
    />

    <CartSidebar 
      :items="mechanicsItems"
      :quantities="quantities"
      v-model:pinned="isCartPinned"
      @updateQuantity="updateQuantity"
      @setQuantity="setQuantity"
    />

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
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = activeCategory === cat ? '' : cat; searchQuery = ''"
          :class="[
            'px-8 py-3 text-xs font-bold tracking-widest rounded-xl transition-all duration-200',
            activeCategory === cat && !searchQuery 
              ? 'bg-[#ffca28] text-slate-900 shadow-lg shadow-yellow-500/20' 
              : 'bg-transparent border border-slate-300 dark:border-gray-800 text-slate-500 dark:text-gray-500 hover:border-slate-400 dark:hover:border-gray-600'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
        <section v-if="filteredItems.length > 0" class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 content-start">
          <ServiceCard 
            v-for="item in filteredItems" 
            :key="item.id" 
            :item="item" 
            :quantity="quantities[item.id]" 
            @updateQuantity="updateQuantity" 
          />
        </section>
        <div v-else class="text-slate-500 dark:text-gray-500 text-sm mt-10">Nenhum serviço encontrado.</div>
      </div>
    </main>

    <CheckoutBar 
      :grandTotal="grandTotal"
      @clear="handleLimpar(false)"
      @finalize="handleFinalizar"
    />

    <HistoryModal 
      :show="showModal" 
      :history="history" 
      :highlightedId="highlightedRecordId"
      @close="showModal = false; highlightedRecordId = null" 
      @clearHistory="handleClearHistory" 
    />
    
    <!-- Renderiza os Toasts Globalmente -->
    <ToastNotification 
      :toasts="toasts" 
      @remove="removeToast" 
    />
  </div>
</template>

<style>
body { background-color: transparent; margin: 0; padding: 0; overflow: hidden; }
.no-spin-button::-webkit-outer-spin-button, .no-spin-button::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.no-spin-button { -moz-appearance: textfield; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1e2330; }
</style>