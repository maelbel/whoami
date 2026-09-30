<script setup lang="ts">
defineProps<{
  index: string
  topic: string
  title: string
  description?: string
}>()
</script>

<template>
  <section class="border-t border-default">
    <div class="container-site grid gap-x-12 py-16 sm:py-24 lg:grid-cols-[11rem_1fr]">
      <div class="mb-6 lg:mb-0">
        <div class="flex items-baseline gap-3 lg:sticky lg:top-20 lg:flex-col lg:gap-1">
          <span class="label text-primary">{{ index }}</span>
          <span class="label text-dimmed break-all">{{ topic }}</span>
        </div>
      </div>

      <div class="min-w-0">
        <h2 class="display text-5xl text-highlighted sm:text-7xl">
          {{ title }}
        </h2>
        <p
          v-if="description || $slots.description"
          class="mt-5 max-w-2xl text-muted text-pretty"
        >
          <slot name="description">
            {{ description }}
          </slot>
        </p>

        <div class="mt-12">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
