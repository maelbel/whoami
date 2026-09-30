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
    class="w-full h-full flex flex-col justify-between p-16"
    style="font-family: 'JetBrains Mono', monospace; background-color: #11110F; color: #ECE9E1"
  >
    <div
      class="flex items-center justify-between text-2xl"
      style="color: #948F83"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex w-6 h-6"
          style="background-color: #EB5517"
        />
        <span class="flex">mael.belliard</span>
      </div>
      <span class="flex">~/whoami</span>
    </div>

    <div class="flex flex-col gap-8">
      <div
        class="flex text-8xl font-bold leading-none"
        style="color: #F4F1E8; text-transform: uppercase; letter-spacing: -2px"
      >
        {{ title }}
      </div>
      <div
        v-if="description"
        class="flex text-3xl max-w-5xl leading-snug"
        style="color: #948F83"
      >
        {{ description }}
      </div>
    </div>

    <div
      class="flex items-center justify-between text-2xl pt-8"
      style="color: #615D54; border-top: 2px solid #2D2C28"
    >
      <span class="flex">maelbelliard.fr</span>
      <span class="flex">fullstack developer · lyon, fr</span>
    </div>
  </div>
</template>
