<script setup lang="ts">
defineProps<{
  href?: string
}>()
</script>

<template>
  <NuxtLink
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot />
  </NuxtLink>
</template>
