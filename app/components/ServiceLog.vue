<script setup lang="ts">
import type { TimelineEntry } from '#shared/utils/resume'

defineProps<{
  title: string
  entries: TimelineEntry[]
}>()
</script>

<template>
  <div>
    <h3 class="label mb-4 flex items-center justify-between border-b border-accented pb-2 text-highlighted">
      <span>{{ title }}</span>
      <span class="text-dimmed">{{ entries.length }} units</span>
    </h3>

    <ol>
      <li
        v-for="entry in entries"
        :key="entry.title + entry.date"
        class="grid grid-cols-[1.25rem_1fr] border-b border-muted py-5 last:border-b-0"
      >
        <span
          class="mt-1.5 size-2"
          :class="entry.current ? 'bg-led-ok shadow-[0_0_6px_var(--color-led-ok)]' : 'border border-(--ui-border-accented)'"
          aria-hidden="true"
        />
        <div class="min-w-0">
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p class="font-medium text-highlighted">
              {{ entry.title }}
            </p>
            <p class="font-mono text-xs text-muted">
              {{ entry.date }}
            </p>
          </div>
          <p class="mt-1 font-mono text-xs">
            <span class="text-toned">{{ entry.org }}</span>
            <span
              v-if="entry.meta"
              class="text-dimmed"
            > · {{ entry.meta }}</span>
          </p>
          <p class="mt-1 font-mono text-[11px]">
            <span :class="entry.current ? 'text-led-ok' : 'text-dimmed'">
              {{ entry.current ? 'active (running)' : 'inactive (exited)' }}
            </span>
          </p>
          <p
            v-if="entry.description"
            class="mt-3 text-sm text-muted text-pretty"
          >
            {{ entry.description }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
