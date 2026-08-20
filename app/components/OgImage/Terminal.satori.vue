<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
}>(), {
  description: ''
})
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between bg-black p-16"
    style="font-family: 'JetBrains Mono', monospace"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-5 h-5 rounded-full"
        style="background-color: #ef4444b3"
      />
      <div
        class="w-5 h-5 rounded-full"
        style="background-color: #eab308b3"
      />
      <div
        class="w-5 h-5 rounded-full"
        style="background-color: #22c55eb3"
      />
    </div>

    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-3 text-3xl text-green-400">
        <span class="flex">$</span>
        <span class="flex">whoami</span>
      </div>
      <div class="flex text-7xl font-bold text-white leading-tight">
        {{ title }}
      </div>
      <div
        v-if="description"
        class="flex text-3xl text-neutral-400 max-w-4xl leading-snug"
      >
        {{ description }}
      </div>
    </div>

    <div class="flex items-center justify-between text-2xl text-neutral-500">
      <div class="flex items-center gap-3">
        <span class="flex text-green-400">●</span>
        <span class="flex">maelbelliard.fr</span>
      </div>
      <div class="flex">
        Mael Belliard — Fullstack Developer
      </div>
    </div>
  </div>
</template>
