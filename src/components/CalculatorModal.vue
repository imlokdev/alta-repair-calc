<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { formatCurrency } from '../utils/formatters'

defineProps<{
  show: boolean;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
}>()

// === LÓGICA: CALCULADORA 15% ===
const displayValue = ref<string>('')

const numericValue = computed(() => {
  const parsed = parseInt(displayValue.value.replace(/\D/g, ''), 10)
  return isNaN(parsed) ? 0 : parsed
})

const calcResult = computed(() => {
  return numericValue.value * 0.20
})

const handleCalcInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  
  // Limpeza agressiva: remove tudo que não for número (bloqueia e, +, - e pontuações)
  let rawVal = target.value.replace(/\D/g, '')
  
  if (!rawVal) {
    displayValue.value = ''
    target.value = ''
    return
  }

  let val = parseInt(rawVal, 10)
  if (val > 999999) val = 999999
  
  displayValue.value = new Intl.NumberFormat('pt-BR').format(val)
  target.value = displayValue.value 
}

// === LÓGICA: TUNING ===
const weightCurrent = ref<string>('')
const weightMax = ref<string>('')
const tuningQty = ref<number>(0)
const customQty = ref<number>(0)

onMounted(() => {
  weightCurrent.value = localStorage.getItem('alta_repair_weight_current') || ''
  weightMax.value = localStorage.getItem('alta_repair_weight_max') || ''
})

watch(weightCurrent, (newVal) => localStorage.setItem('alta_repair_weight_current', newVal))
watch(weightMax, (newVal) => localStorage.setItem('alta_repair_weight_max', newVal))

const handleWeightInput = (e: Event, type: 'current' | 'max') => {
  const target = e.target as HTMLInputElement
  let val = target.value.replace(/[^0-9.,]/g, '').replace(',', '.')
  
  const parts = val.split('.')
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('')
  
  if (type === 'current') weightCurrent.value = val
  else weightMax.value = val
}

const updateQty = (type: 'tuning' | 'custom', change: number) => {
  if (type === 'tuning') {
    const next = tuningQty.value + change
    if (next >= 0) tuningQty.value = next
  } else {
    const next = customQty.value + change
    if (next >= 0) customQty.value = next
  }
}

const handleInputQty = (e: Event, type: 'tuning' | 'custom') => {
  const target = e.target as HTMLInputElement
  let val = parseInt(target.value.replace(/\D/g, ''), 10)
  if (isNaN(val)) val = 0
  
  if (type === 'tuning') tuningQty.value = val
  else customQty.value = val
  
  target.value = val.toString()
}

const tuningPacks = computed(() => Math.floor(tuningQty.value / 99))
const tuningRem = computed(() => tuningQty.value % 99)
const customPacks = computed(() => Math.floor(customQty.value / 99))
const customRem = computed(() => customQty.value % 99)

const totalAddedWeight = computed(() => (tuningQty.value + customQty.value) * 0.05)
const finalWeight = computed(() => (parseFloat(weightCurrent.value || '0') + totalAddedWeight.value))
const isOverweight = computed(() => {
  const max = parseFloat(weightMax.value || '0')
  return max > 0 && finalWeight.value > max
})

// === COMPARTILHADO ===
const preventInvalidChars = (e: KeyboardEvent): void => {
  if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault()
}

const handleClose = () => {
  displayValue.value = ''
  tuningQty.value = 0
  customQty.value = 0
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
    <div class="bg-white dark:bg-[#151822] rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-slate-200 dark:border-[#1e2330] max-h-[95vh]">
      
      <div class="shrink-0 flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-[#1e2330]">
        <h3 class="font-black italic text-xl tracking-tighter text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <span>🧮</span> CALCULADORAS
        </h3>
        <button @click="handleClose" class="cursor-pointer text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">Valor do Orçamento</label>
            <input 
              type="text" 
              :value="displayValue"
              @input="handleCalcInput"
              placeholder="0"
              class="w-full h-14 px-4 text-2xl font-black rounded-2xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-[#1e2330] text-slate-900 dark:text-white outline-none focus:border-[#ffca28] transition-all"
            >
          </div>

          <div class="p-4 rounded-2xl bg-[#ffca28]/10 border border-[#ffca28]/20 flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#ffca28]">Parte da mecânica (20%)</span>
            <span class="text-3xl font-black text-[#ffca28] tracking-tighter">
              {{ formatCurrency(calcResult) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-4 py-1">
          <div class="h-px bg-slate-200 dark:bg-[#1e2330] flex-1"></div>
          <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400">TUNING & CUSTOM</span>
          <div class="h-px bg-slate-200 dark:bg-[#1e2330] flex-1"></div>
        </div>

        <div class="flex flex-col gap-4">
          
          <div class="flex items-center justify-between bg-slate-50 dark:bg-[#0b0e14] p-3 rounded-xl border border-slate-200 dark:border-[#1e2330]">
            <div class="flex items-center gap-2">
              <span class="text-lg">🎒</span>
              <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mochila</span>
            </div>
            <div class="flex items-center gap-1">
              <input 
                type="text" 
                :value="weightCurrent" 
                @input="e => handleWeightInput(e, 'current')"
                placeholder="0.00"
                class="w-12 bg-transparent outline-none text-right font-black text-sm text-slate-700 dark:text-gray-200 placeholder:text-slate-400"
              >
              <span class="text-slate-400 font-bold text-sm">/</span>
              <input 
                type="text" 
                :value="weightMax" 
                @input="e => handleWeightInput(e, 'max')"
                placeholder="0.00"
                class="w-12 bg-transparent outline-none font-black text-sm text-slate-700 dark:text-gray-200 placeholder:text-slate-400"
              >
            </div>
          </div>

          <div class="flex flex-row items-center justify-between gap-4">
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="flex items-center gap-1.5 text-slate-600 dark:text-gray-300">
                <span class="text-lg">⚙️</span>
                <span class="font-bold text-[9px] uppercase tracking-widest">Tunagem</span>
              </div>
              <div class="flex items-center gap-1 bg-slate-50 dark:bg-[#0b0e14] p-1 rounded-xl border border-slate-200 dark:border-[#1e2330] w-full justify-center">
                <button @click="updateQty('tuning', -1)" class="cursor-pointer w-8 h-8 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-[#1e2330] transition flex items-center justify-center font-bold">-</button>
                <input 
                  type="number" 
                  :value="tuningQty"
                  @keydown="preventInvalidChars"
                  @input="e => handleInputQty(e, 'tuning')"
                  class="no-spin-button w-12 text-center bg-transparent font-black text-base text-slate-800 dark:text-white outline-none"
                >
                <button @click="updateQty('tuning', 1)" class="cursor-pointer w-8 h-8 rounded-lg text-slate-500 hover:text-green-500 hover:bg-slate-200 dark:hover:bg-[#1e2330] transition flex items-center justify-center font-bold">+</button>
              </div>
            </div>

            <div class="w-px h-12 bg-slate-200 dark:bg-[#1e2330]"></div>

            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="flex items-center gap-1.5 text-slate-600 dark:text-gray-300">
                <span class="text-lg">🎨</span>
                <span class="font-bold text-[9px] uppercase tracking-widest">Custom.</span>
              </div>
              <div class="flex items-center gap-1 bg-slate-50 dark:bg-[#0b0e14] p-1 rounded-xl border border-slate-200 dark:border-[#1e2330] w-full justify-center">
                <button @click="updateQty('custom', -1)" class="cursor-pointer w-8 h-8 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-[#1e2330] transition flex items-center justify-center font-bold">-</button>
                <input 
                  type="number" 
                  :value="customQty"
                  @keydown="preventInvalidChars"
                  @input="e => handleInputQty(e, 'custom')"
                  class="no-spin-button w-12 text-center bg-transparent font-black text-base text-slate-800 dark:text-white outline-none"
                >
                <button @click="updateQty('custom', 1)" class="cursor-pointer w-8 h-8 rounded-lg text-slate-500 hover:text-green-500 hover:bg-slate-200 dark:hover:bg-[#1e2330] transition flex items-center justify-center font-bold">+</button>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-[#1e2330] rounded-xl p-3 mt-1 flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 text-center leading-relaxed">
              <span v-if="tuningQty > 0 || customQty > 0">
                {{ tuningPacks }} Packs Tuning + {{ tuningRem }} <br/> {{ customPacks }} Packs Custom + {{ customRem }}
              </span>
              <span v-else class="text-slate-400 opacity-50">Adicione itens para ver packs</span>
            </div>

            <div v-if="weightCurrent && weightMax && (tuningQty > 0 || customQty > 0)" class="border-t border-slate-200 dark:border-[#1e2330] pt-2 mt-1 flex flex-col items-center gap-1">
              <span class="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Peso Add: <span class="text-slate-700 dark:text-gray-300">{{ totalAddedWeight.toFixed(2) }}kg</span>
              </span>
              <span class="text-[11px] font-black" :class="isOverweight ? 'text-red-500' : 'text-green-500 dark:text-green-400'">
                Mochila: {{ finalWeight.toFixed(2) }}kg / {{ weightMax }}kg
                <span v-if="isOverweight" class="ml-1 uppercase tracking-widest text-[8px] bg-red-100 dark:bg-red-500/20 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-500/50">Limite!</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.no-spin-button::-webkit-outer-spin-button, 
.no-spin-button::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.no-spin-button { -moz-appearance: textfield; }
</style>