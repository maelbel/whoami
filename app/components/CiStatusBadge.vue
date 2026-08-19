<script setup lang="ts">
import type { CiStatus } from '~/composables/useCiStatus'

const props = defineProps<{
  status?: CiStatus
  error?: unknown
  label?: string
}>()

const unavailableText = computed(() => props.label ? `${props.label} status unavailable` : 'Status unavailable')
const checkingText = computed(() => props.label ? `Checking ${props.label}…` : 'Checking…')
</script>

<template>
  <UBadge
    v-if="status"
    :color="status.color"
    variant="subtle"
    :icon="status.icon"
    size="sm"
  >
    {{ status.label }}
  </UBadge>
  <UBadge
    v-else
    color="neutral"
    variant="subtle"
    :icon="error ? 'i-lucide-circle-help' : 'i-lucide-loader-circle'"
    size="sm"
  >
    {{ error ? unavailableText : checkingText }}
  </UBadge>
</template>
