<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatCurrency } from '../utils/formatters'

defineProps<{
  show: boolean;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const displayValue = ref<string>('')

const numericValue = computed(() => {
  const parsed = parseInt(displayValue.value.replace(/\D/g, ''), 10)
  return isNaN(parsed) ? 0 : parsed
})

const result = computed(() => {
  return numericValue.value * 0.15
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  let rawVal = target.value.replace(/\D/g, '')
  
  if (!rawVal) {
    displayValue.value = ''
    return
  }

  let val = parseInt(rawVal, 10)
  
  if (val > 999999) {
    val = 999999
  }
  
  displayValue.value = new Intl.NumberFormat('pt-BR').format(val)
  target.value = displayValue.value
}

const handleClose = () => {
  displayValue.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
    <div class="bg-white dark:bg-[#151822] rounded-3xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden border border-slate-200 dark:border-[#1e2330]">
      
      <div class="flex items-center justify-between p-6 pb-4">
        <h3 class="font-black italic text-xl tracking-tighter text-slate-900 dark:text-white uppercase">
          Calculadora <span class="text-[#ffca28]">15%</span>
        </h3>
        <button @click="handleClose" class="cursor-pointer text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-6 pt-2 space-y-6">
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">Valor Total</label>
          <input 
            type="text" 
            :value="displayValue"
            @input="handleInput"
            placeholder="0"
            class="w-full h-14 px-4 text-2xl font-black rounded-2xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-[#1e2330] text-slate-900 dark:text-white outline-none focus:border-[#ffca28] transition-all"
          >
        </div>

        <div class="p-4 rounded-2xl bg-[#ffca28]/10 border border-[#ffca28]/20 flex flex-col items-center justify-center">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[#ffca28] mb-1">Parte da mecânica (15%)</span>
          <span class="text-3xl font-black text-[#ffca28] tracking-tighter">
            {{ formatCurrency(result) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>