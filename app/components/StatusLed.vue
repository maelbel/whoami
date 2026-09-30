<script setup lang="ts">
import type { CiStatus } from '~/composables/useCiStatus'

const props = defineProps<{
  color?: CiStatus['color']
}>()

const tone = computed(() => {
  switch (props.color) {
    case 'success': return 'bg-led-ok shadow-[0_0_6px_var(--color-led-ok)]'
    case 'error': return 'bg-led-fail shadow-[0_0_6px_var(--color-led-fail)]'
    case 'warning': return 'bg-led-busy animate-[led-pulse_1s_ease-in-out_infinite]'
    default: return 'bg-(--ui-border-accented) animate-[led-pulse_1.6s_ease-in-out_infinite]'
  }
})
</script>

<template>
  <span
    class="inline-block size-1.5 shrink-0"
    :class="tone"
    aria-hidden="true"
  />
</template>
