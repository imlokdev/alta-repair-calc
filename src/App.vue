<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style>
body { background-color: transparent; margin: 0; padding: 0; overflow: hidden; }
.no-spin-button::-webkit-outer-spin-button, .no-spin-button::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.no-spin-button { appearance: textfield; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1e2330; }
</style>