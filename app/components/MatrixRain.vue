<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const colorMode = useColorMode()

const canvasEl = ref<HTMLCanvasElement>()

const FONT_SIZE = 16
const FRAME_INTERVAL_MS = 45
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'

interface Drop {
  y: number
  speed: number
  hue: number
  hueTarget: number
}

let ctx: CanvasRenderingContext2D | null = null
let drops: Drop[] = []
let timer: ReturnType<typeof setInterval> | undefined
let tick = 0

function randomHueTarget() {
  const dark = colorMode.value === 'dark'
  // Dark mode drifts through vivid greens/cyans, light mode through cooler teals/blues.
  const base = dark ? 140 : 175
  const spread = dark ? 40 : 25
  return base + (Math.random() - 0.5) * spread
}

function makeDrop(): Drop {
  const hue = randomHueTarget()
  return {
    y: Math.floor(Math.random() * -50),
    speed: 0.5 + Math.random() * 1.5,
    hue,
    hueTarget: hue
  }
}

function resize() {
  const canvas = canvasEl.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const columns = Math.ceil(canvas.width / FONT_SIZE)
  drops = Array.from({ length: columns }, () => makeDrop())
}

function draw() {
  const canvas = canvasEl.value
  if (!canvas || !ctx) return

  tick++

  const dark = colorMode.value === 'dark'
  const fadeColor = dark ? 'rgba(0, 0, 0, 0.09)' : 'rgba(2, 6, 4, 0.11)'

  // A slow breathing pulse drives how dense/bright the rain feels moment to moment.
  const pulse = (Math.sin(tick / 120) + 1) / 2 // 0..1

  ctx.fillStyle = fadeColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = `${FONT_SIZE}px monospace`
  ctx.textBaseline = 'top'

  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i]!
    const char = CHARS[Math.floor(Math.random() * CHARS.length)]
    const x = i * FONT_SIZE
    const y = drop.y * FONT_SIZE

    // Hue wanders toward a fresh target so colors shift continuously, never snapping.
    drop.hue += (drop.hueTarget - drop.hue) * 0.02
    if (Math.random() < 0.01) drop.hueTarget = randomHueTarget()

    const isGlitch = Math.random() < 0.04 + pulse * 0.05
    const lightness = dark ? 55 + pulse * 15 : 38 + pulse * 12
    ctx.fillStyle = isGlitch
      ? `hsl(${drop.hue}, 90%, ${dark ? 90 : 80}%)`
      : `hsl(${drop.hue}, 95%, ${lightness}%)`
    ctx.fillText(char!, x, y)

    const resetChance = 0.965 - pulse * 0.02
    if (y > canvas.height && Math.random() > resetChance) {
      drop.y = 0
      drop.speed = 0.5 + Math.random() * 1.5
    } else {
      drop.y += drop.speed
    }
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  ctx = canvasEl.value?.getContext('2d') ?? null
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('keydown', handleKeydown)
  timer = setInterval(draw, FRAME_INTERVAL_MS)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('keydown', handleKeydown)
  clearInterval(timer)
})
</script>

<template>
  <Teleport to="body">
    <canvas
      ref="canvasEl"
      class="fixed inset-0 -z-10 pointer-events-none opacity-80"
    />
  </Teleport>
</template>
