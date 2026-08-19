<script setup lang="ts">
defineProps<{
  href?: string
}>()
</script>

<template>
  <ULink
    :to="href"
    target="_blank"
    class="text-primary hover:text-primary/75 active:text-primary/75 outline-primary/25 focus-visible:outline-3"
  >
    <slot />
  </ULink>
</template>
