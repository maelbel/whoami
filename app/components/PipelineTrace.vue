<script setup lang="ts">
import type { PipelineStep } from '~/utils/content'

defineProps<{
  steps: PipelineStep[]
}>()
</script>

<template>
  <ol class="relative grid gap-0 lg:grid-cols-5">
    <!-- the bus: a single trace every stage hangs off, with a packet travelling along it -->
    <div
      class="absolute top-0 bottom-0 left-[7px] w-px bg-(--ui-border-accented) lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
      aria-hidden="true"
    >
      <span class="absolute hidden size-1.5 -translate-y-[2.5px] bg-primary lg:block lg:animate-[packet_6s_linear_infinite]" />
    </div>

    <li
      v-for="(step, index) in steps"
      :key="step.title"
      class="relative grid grid-cols-[2.25rem_1fr] pb-10 lg:grid-cols-1 lg:pr-6 lg:pb-0"
    >
      <span
        class="relative z-10 size-[15px] border border-(--ui-border-accented) bg-default"
        :class="index === steps.length - 1 && 'border-primary bg-primary'"
        aria-hidden="true"
      />
      <div class="lg:mt-6">
        <p class="label text-dimmed">
          stage {{ index + 1 }}
        </p>
        <p class="mt-1 flex items-center gap-2 font-medium text-highlighted">
          <UIcon
            :name="step.icon"
            class="size-4 text-muted"
          />
          {{ step.title }}
        </p>
        <p class="mt-2 text-sm text-muted text-pretty">
          {{ step.description }}
        </p>
      </div>
    </li>
  </ol>
</template>
