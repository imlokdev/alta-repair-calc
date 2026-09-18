<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const token = route.query.token as string
  
  if (token) {
    localStorage.setItem('alta_repair_token', token)
  }

  router.replace('/')
})
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center bg-[#f4f6f8] dark:bg-[#0b0e14]">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-[#ffca28] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#ffca28] font-bold tracking-widest uppercase text-sm">Sincronizando conta...</p>
    </div>
  </div>
</template>