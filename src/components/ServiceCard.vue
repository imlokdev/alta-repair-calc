<script setup lang="ts">
import { formatCurrency } from '../utils/formatters.ts'
import type { MechanicItem } from '../types'

defineProps<{
  item: MechanicItem;
  quantity: number;
}>()

defineEmits<{
  (e: 'updateQuantity', itemId: string, change: number): void
}>()
</script>

<template>
  <div class="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-[#151822] border border-slate-200 dark:border-[#1e2330] hover:border-[#ffca28] transition duration-200 shadow-sm min-h-[100px]">
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
      <button @click="$emit('updateQuantity', item.id, -1)" class="w-8 h-8 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-[#1e2330] transition flex items-center justify-center text-sm font-bold">-</button>
      <span class="font-black text-lg text-slate-800 dark:text-white w-6 text-center">{{ quantity }}</span>
      <button @click="$emit('updateQuantity', item.id, 1)" class="w-8 h-8 rounded-lg text-slate-500 hover:text-green-500 hover:bg-slate-200 dark:hover:bg-[#1e2330] transition flex items-center justify-center text-sm font-bold">+</button>
    </div>
  </div>
</template>