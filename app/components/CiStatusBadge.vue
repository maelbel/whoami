<script setup lang="ts">
import type { CiStatus } from '~/composables/useCiStatus'

const props = defineProps<{
  status?: CiStatus
  error?: unknown
  label?: string
}>()

const text = computed(() => {
  if (props.status) return props.status.label.replace(/^CI /, props.label ? `${props.label.toLowerCase()} ` : '')
  if (props.error) return props.label ? `${props.label.toLowerCase()} unavailable` : 'unavailable'
  return props.label ? `${props.label.toLowerCase()} checking…` : 'checking…'
})
</script>

<template>
  <component
    :is="status ? 'a' : 'span'"
    :href="status?.url"
    :target="status ? '_blank' : undefined"
    class="inline-flex items-center gap-2 font-mono text-xs text-muted"
    :class="status && 'hover:text-highlighted'"
    @click.stop
  >
    <StatusLed :color="status?.color" />
    {{ text }}
  </component>
</template>
