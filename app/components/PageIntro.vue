<script setup lang="ts">
defineProps<{
  path: string
  title: string
  description?: string
}>()
</script>

<template>
  <section class="relative overflow-hidden border-b border-default">
    <div
      class="graph-paper pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      aria-hidden="true"
    />
    <div class="container-site relative py-16 sm:py-24">
      <p class="label text-primary">
        {{ path }}
      </p>
      <h1 class="display mt-5 max-w-4xl text-6xl text-balance text-highlighted sm:text-8xl">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mt-6 max-w-2xl text-lg text-muted text-pretty"
      >
        {{ description }}
      </p>
      <slot />
    </div>
  </section>
</template>
