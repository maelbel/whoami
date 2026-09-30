<script setup lang="ts">
const props = withDefaults(defineProps<{
  timeZone?: string
  seconds?: boolean
}>(), {
  timeZone: 'Europe/Paris',
  seconds: true
})

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: props.timeZone,
  hour: '2-digit',
  minute: '2-digit',
  second: props.seconds ? '2-digit' : undefined,
  hour12: false
})

// Rendered empty on the server so the prerendered page never ships a stale time.
const now = ref('')
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  const tick = () => (now.value = formatter.format(new Date()))
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <span class="tabular-nums">{{ now || (seconds ? '--:--:--' : '--:--') }}</span>
</template>
