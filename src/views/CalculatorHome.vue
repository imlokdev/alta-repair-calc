<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { mechanicsItems, categories } from '../data/mechanics'
import type { HistoryRecord, ToastMessage } from '../types'

import MechanicsSidebar from '../components/MechanicsSidebar.vue'
import CartSidebar from '../components/CartSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import ServiceCard from '../components/ServiceCard.vue'
import CheckoutBar from '../components/CheckoutBar.vue'
import HistoryModal from '../components/HistoryModal.vue'
import CalculatorModal from '../components/CalculatorModal.vue'
import ToastNotification from '../components/ToastNotification.vue'

const activeCategory = ref<string>('KIT\'s')
const searchQuery = ref<string>('')
const quantities = ref<Record<string, number>>(
  mechanicsItems.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
)

const passportId = ref<string>('')
const kmValue = ref<string>('')
const showPassportWarning = ref<boolean>(false)
const history = ref<HistoryRecord[]>([])
const isDarkMode = ref<boolean>(true)
const showModal = ref<boolean>(false)
const showCalculator = ref<boolean>(false)
const highlightedRecordId = ref<number | null>(null)

// Estados de Autenticação e Relogin
const isAuthenticated = ref<boolean>(false)
const showReloginModal = ref<boolean>(false)
const reloginMessage = ref<string>('')

// Estados das Sidebars
const isSidebarPinned = ref<boolean>(false)
const isCartPinned = ref<boolean>(false)

// Estados dos Toasts
const toasts = ref<ToastMessage[]>([])
let toastCounter = 0

const syncAuth = () => {
  isAuthenticated.value = !!localStorage.getItem('alta_repair_token')
}

const checkFailedCart = () => {
  const failedCart = localStorage.getItem('alta_repair_failed_cart')
  if (isAuthenticated.value && failedCart) {
    addToast({
      type: 'info',
      title: 'Venda Interrompida',
      message: 'Detectamos uma venda que falhou devido à sessão expirada. Deseja restaurar?',
      clickable: false,
      action: {
        label: 'Restaurar Carrinho',
        onClick: () => {
          const cart = JSON.parse(failedCart)
          for (const key in cart.quantities) {
            quantities.value[key] = cart.quantities[key]
          }
          passportId.value = cart.passportId
          kmValue.value = cart.kmValue
          localStorage.removeItem('alta_repair_failed_cart')
          addToast({ type: 'success', title: 'Restaurado', message: 'Itens adicionados de volta ao carrinho!' })
        }
      }
    })
  }
}

onMounted(() => {
  toggleTheme(true)
  syncAuth()
  
  window.addEventListener('auth-updated', syncAuth)

  const savedHistory = localStorage.getItem('alta_repair_history')
  if (savedHistory) history.value = JSON.parse(savedHistory)

  const savedPin = localStorage.getItem('alta_repair_sidebar_pinned')
  if (savedPin === 'true') isSidebarPinned.value = true

  const savedCartPin = localStorage.getItem('alta_repair_cart_pinned')
  if (savedCartPin === 'true') isCartPinned.value = true

  checkFailedCart()
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-updated', syncAuth)
})

watch(isSidebarPinned, (newVal) => localStorage.setItem('alta_repair_sidebar_pinned', String(newVal)))
watch(isCartPinned, (newVal) => localStorage.setItem('alta_repair_cart_pinned', String(newVal)))
watch(passportId, () => { if (passportId.value) showPassportWarning.value = false })

watch(kmValue, (newVal) => {
  const km = Number(newVal)
  if (km > 0) {
    if (quantities.value['guinc_vei'] === 0) {
      quantities.value['guinc_vei'] = 1
    }
  } else {
    quantities.value['guinc_vei'] = 0
  }
})

const toggleTheme = (dark?: boolean): void => {
  isDarkMode.value = dark ?? !isDarkMode.value
  isDarkMode.value ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
}

const addToast = (toast: Omit<ToastMessage, 'id'>) => {
  const id = toastCounter++
  const wrappedOnClick = toast.onClick ? () => { toast.onClick!(); removeToast(id); } : undefined
  toasts.value.push({ ...toast, id, onClick: wrappedOnClick })
  setTimeout(() => removeToast(id), toast.action ? 10000 : 5000)
}

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

const sidebarItems = computed(() => mechanicsItems.filter(item => item.category === 'MECÂNICA'))

const filteredItems = computed(() => {
  return mechanicsItems.filter(item => {
    if (item.category === 'MECÂNICA') return false
    if (searchQuery.value) return item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    if (!activeCategory.value) return true
    return item.category === activeCategory.value
  })
})

const grandTotal = computed<number>(() => {
  return mechanicsItems.reduce((total, item) => {
    let currentPrice = item.price

    if (item.id === 'guinc_vei' && kmValue.value && Number(kmValue.value) > 0) {
      currentPrice = Number(kmValue.value) * 50
    }

    return total + (quantities.value[item.id] * currentPrice)
  }, 0)
})

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

const handleLimpar = (silent = false): void => {
  mechanicsItems.forEach(item => quantities.value[item.id] = 0)
  passportId.value = ''
  kmValue.value = ''
  showPassportWarning.value = false
  if (!silent) {
    addToast({ type: 'info', title: 'Carrinho Limpo', message: 'Os itens selecionados foram removidos.' })
  }
}

const openHistoryWithHighlight = (id: number) => {
  highlightedRecordId.value = id
  showModal.value = true
}

const updateRecordStatus = (id: number, status: 'success' | 'error') => {
  const record = history.value.find(r => r.id === id)
  if (record) {
    record.syncStatus = status
    localStorage.setItem('alta_repair_history', JSON.stringify(history.value))
  }
}

const handleFinalizar = (): void => {
  if (grandTotal.value === 0) return

  if (!passportId.value || Number(passportId.value) <= 0) {
    showPassportWarning.value = true
    document.getElementById('passportInput')?.focus()
    addToast({ type: 'error', title: 'Aviso', message: 'Preencha o Passaporte do cliente!' })
    return
  }

  const token = localStorage.getItem('alta_repair_token')

  const payload = {
    passportId: passportId.value.toString(),
    kitAvancadoQty: quantities.value['kit_ava'] || 0,
    ceraDeluxeQty: quantities.value['cera_del'] || 0,
    ceraPremiumQty: quantities.value['cera_pre'] || 0,
    ceraSimplesQty: quantities.value['cera_sim'] || 0
  }

  const cartSnapshot = {
    quantities: { ...quantities.value },
    passportId: passportId.value,
    kmValue: kmValue.value
  }

  let kitsLines: string[] = []
  if (payload.kitAvancadoQty > 0) {
    kitsLines.push(`${payload.kitAvancadoQty}x Kit Avançado | ID: ${passportId.value}`)
  }

  let cerasLines: string[] = []
  mechanicsItems.forEach(item => {
    const qty = quantities.value[item.id]
    if (qty > 0 && item.isCera) {
      cerasLines.push(`${qty}x ${item.outputName}`)
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
    kitsText: kitsLines.join('\n'),
    cerasText: cerasLines.length > 0 ? header + cerasLines.join('\n') : '',
    syncStatus: token ? 'pending' : undefined,
    webhookPayload: token ? payload : undefined
  }

  history.value.unshift(record)
  localStorage.setItem('alta_repair_history', JSON.stringify(history.value))

  handleLimpar(true)

  addToast({
    type: 'success',
    title: 'Venda Salva!',
    message: token
      ? 'Atendimento registrado. Sincronizando com o Discord...'
      : 'Salvo localmente no histórico. Copie os textos manualmente.',
    clickable: true,
    onClick: () => openHistoryWithHighlight(recordId)
  })

  if (token) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    fetch(`${apiUrl}/calculator/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            const errorData = await response.json().catch(() => ({}))
            throw { status: 401, message: errorData.message || 'Sessão inválida ou sem permissão.' }
          }
          throw new Error('Falha no servidor')
        }
        updateRecordStatus(recordId, 'success')
      })
      .catch((error) => {
        updateRecordStatus(recordId, 'error')

        if (error.status === 401) {
          localStorage.removeItem('alta_repair_token')
          localStorage.removeItem('alta_repair_user_name')
          localStorage.removeItem('alta_repair_user_avatar')
          localStorage.removeItem('alta_repair_user_passport')
          
          localStorage.setItem('alta_repair_failed_cart', JSON.stringify(cartSnapshot))

          window.dispatchEvent(new Event('auth-updated'))

          reloginMessage.value = error.message.replace(/^(REQUIRE_APPROVAL|REQUIRE_PROFILE):\s*/, '')
          showReloginModal.value = true
        } else {
          addToast({ type: 'error', title: 'Erro de Sincronização', message: 'Falha ao enviar para o Discord. Você pode tentar reenviar no histórico.' })
        }
      })
  }
}

const handleResend = (record: HistoryRecord) => {
  const token = localStorage.getItem('alta_repair_token')
  if (!token) {
    addToast({ type: 'error', title: 'Erro', message: 'Faça login para reenviar o log.' })
    return
  }
  if (!record.webhookPayload) return

  record.syncStatus = 'pending'
  localStorage.setItem('alta_repair_history', JSON.stringify(history.value))

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  fetch(`${apiUrl}/calculator/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(record.webhookPayload)
  })
  .then(async (response) => {
    if (!response.ok) {
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}))
        throw { status: 401, message: errorData.message || 'Sessão inválida' }
      }
      throw new Error('Falha')
    }
    updateRecordStatus(record.id, 'success')
    addToast({ type: 'success', title: 'Reenviado', message: 'Log enviado com sucesso para o Discord!' })
  })
  .catch((error) => {
    updateRecordStatus(record.id, 'error')
    if (error.status === 401) {
      localStorage.removeItem('alta_repair_token')
      window.dispatchEvent(new Event('auth-updated'))
      reloginMessage.value = error.message.replace(/^(REQUIRE_APPROVAL|REQUIRE_PROFILE):\s*/, '')
      showReloginModal.value = true
    } else {
      addToast({ type: 'error', title: 'Erro', message: 'O servidor não respondeu. Tente novamente mais tarde.' })
    }
  })
}

const handleClearHistory = (): void => {
  history.value = []
  localStorage.removeItem('alta_repair_history')
  addToast({ type: 'info', title: 'Histórico Apagado', message: 'Todos os registros foram excluídos do navegador.' })
}

const handleLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  window.location.href = `${apiUrl}/auth/calculator/discord`
}
</script>

<template>
  <div
    class="h-screen flex flex-col bg-[#f4f6f8] dark:bg-[#0b0e14] transition-all duration-300 font-sans select-none overflow-hidden"
    :class="[
      isSidebarPinned ? 'md:pl-64 min-[1800px]:pl-0' : 'pl-0',
      isCartPinned ? 'md:pr-72 min-[1800px]:pr-0' : 'pr-0'
    ]">
    
    <MechanicsSidebar :items="sidebarItems" :quantities="quantities" v-model:pinned="isSidebarPinned"
      @updateQuantity="updateQuantity" />

    <CartSidebar :items="mechanicsItems" :quantities="quantities" v-model:pinned="isCartPinned"
      @updateQuantity="updateQuantity" @setQuantity="setQuantity" />

    <AppHeader v-model:searchQuery="searchQuery" :isDarkMode="isDarkMode" @toggleTheme="toggleTheme()"
      @openHistory="showModal = true" @openCalculator="showCalculator = true" />

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 flex flex-col gap-6 min-h-0">

      <div class="shrink-0 flex flex-wrap items-center gap-3">
        <button v-for="cat in categories" :key="cat"
          @click="activeCategory = activeCategory === cat ? '' : cat; searchQuery = ''" :class="[
            'cursor-pointer px-8 py-3 text-xs font-bold tracking-widest rounded-xl transition-all duration-200',
            activeCategory === cat && !searchQuery
              ? 'bg-[#ffca28] text-slate-900 shadow-lg shadow-yellow-500/20'
              : 'bg-transparent border border-slate-300 dark:border-gray-800 text-slate-500 dark:text-gray-500 hover:border-slate-400 dark:hover:border-gray-600'
          ]">
          {{ cat }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 flex flex-col">
        <section v-if="filteredItems.length > 0"
          class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 content-start mb-auto">
          <ServiceCard v-for="item in filteredItems" :key="item.id" :item="item" :quantity="quantities[item.id]"
            @updateQuantity="updateQuantity" />
        </section>
        <div v-else class="text-slate-500 dark:text-gray-500 text-sm mt-10 mb-auto">Nenhum serviço encontrado.</div>

        <footer
          class="mt-16 pb-2 w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-600 transition-colors">
          <a href="https://github.com/imlokdev/alta-repair-calc" target="_blank" rel="noopener noreferrer"
            class="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Projeto Open Source</span>
          </a>
          <div class="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-700"></div>
          <a href="https://github.com/imlokdev" target="_blank" rel="noopener noreferrer"
            class="flex items-center gap-1 hover:text-[#ffca28] transition group">
            <span>Desenvolvido por</span>
            <span class="text-slate-500 dark:text-gray-400 group-hover:text-[#ffca28] transition">Gabriel Santos</span>
          </a>
        </footer>
      </div>
    </main>

    <CheckoutBar :grandTotal="grandTotal" v-model:passportId="passportId" v-model:kmValue="kmValue"
      :showPassportWarning="showPassportWarning" @clear="handleLimpar(false)" @finalize="handleFinalizar" />

    <HistoryModal :show="showModal" :history="history" :highlightedId="highlightedRecordId" :isAuthenticated="isAuthenticated"
      @close="showModal = false; highlightedRecordId = null" @clearHistory="handleClearHistory" @notify="addToast" @resend="handleResend" />

    <CalculatorModal :show="showCalculator" @close="showCalculator = false" />

    <ToastNotification :toasts="toasts" @remove="removeToast" />

    <!-- MODAL DE RELOGIN -->
    <div v-if="showReloginModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
        <div class="bg-white dark:bg-[#151822] rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center border border-slate-200 dark:border-[#1e2330]">
            <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4 border-4 border-red-50 dark:border-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 class="font-black text-lg text-slate-900 dark:text-white uppercase tracking-wider mb-2">Sessão Expirada</h3>
            <p class="text-xs text-slate-500 dark:text-gray-400 mb-6">{{ reloginMessage || 'Sua sessão foi desconectada. Por favor, faça login novamente para continuar sincronizando.' }}</p>
            <div class="flex flex-col gap-3">
                <button @click="handleLogin" class="cursor-pointer w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-[#5865F2] hover:bg-[#4752C4] transition shadow-lg shadow-[#5865F2]/20">Fazer Login Novamente</button>
                <button @click="showReloginModal = false" class="cursor-pointer w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white transition bg-slate-100 dark:bg-[#1e2330]">Continuar Offline</button>
            </div>
        </div>
    </div>
  </div>
</template>