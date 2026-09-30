<script setup lang="ts">
import type { ToolItem } from '~/utils/content'

defineProps<{
  items: ToolItem[]
  prefix: string
}>()
</script>

<template>
  <div class="font-mono text-xs">
    <div class="hidden grid-cols-[4.5rem_16rem_1fr] gap-6 border-y border-accented py-2 text-dimmed sm:grid">
      <span class="label">ref</span>
      <span class="label">item</span>
      <span class="label">note</span>
    </div>
    <ul>
      <li
        v-for="(item, index) in items"
        :key="item.name"
        class="grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-1 border-b border-default py-3.5 sm:grid-cols-[4.5rem_16rem_1fr]"
      >
        <span class="text-dimmed">{{ prefix }}-{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="flex items-center gap-2 text-sm font-medium text-highlighted">
          <UIcon
            :name="item.icon"
            class="size-4 shrink-0 text-muted"
          />
          {{ item.name }}
        </span>
        <span class="col-start-2 font-sans text-sm text-muted sm:col-start-auto">{{ item.description }}</span>
      </li>
    </ul>
  </div>
</template>
