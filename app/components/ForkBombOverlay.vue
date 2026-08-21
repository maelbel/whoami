<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

interface Clone {
  id: number
  left: number
  top: number
  size: number
  rotate: number
  delay: number
  pid: number
}

const MAX_CLONES = 180

const clones = ref<Clone[]>([])
const stage = ref<'forking' | 'flash' | 'cloud'>('forking')

const critical = computed(() => stage.value === 'forking' && clones.value.length >= MAX_CLONES * 0.55)

let nextId = 0
let nextPid = 4200

function spawnClone() {
  clones.value.push({
    id: nextId++,
    left: Math.random() * 92,
    top: Math.random() * 88,
    size: 60 + Math.random() * 85,
    rotate: (Math.random() - 0.5) * 20,
    delay: Math.random() * 0.1,
    pid: nextPid++
  })
}

const timers: ReturnType<typeof setTimeout>[] = []

function tick(round: number) {
  const target = Math.min(MAX_CLONES, Math.pow(2, round))
  while (clones.value.length < target) spawnClone()

  if (target >= MAX_CLONES) {
    timers.push(setTimeout(() => (stage.value = 'flash'), 300))
    timers.push(setTimeout(() => (stage.value = 'cloud'), 850))
    return
  }

  timers.push(setTimeout(() => tick(round + 1), 100))
}

// --- Explosion rendering -----------------------------------------------
// The mushroom silhouette is drawn explicitly (a tapering stem + a wide
// scalloped cap) so the shape is always correct, regardless of how the
// particle physics tunes out. Particles only add fire/glow/texture on top.

type ParticleKind = 'fire' | 'spark' | 'smoke' | 'dust' | 'core'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  born: number
  life: number
  kind: ParticleKind
  heat: number
}

const RISE_DURATION = 1500
const MAX_PARTICLES = 900

const canvasEl = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let raf: number | undefined
let lastFrame = 0
let detonatedAt = 0
let burstFired = false
let particles: Particle[] = []

function resizeCanvas() {
  const canvas = canvasEl.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function groundY(canvas: HTMLCanvasElement) {
  return canvas.height * 0.74
}

// A Tsar Bomba-scale shockwave: a bright pressure ring that sweeps across
// the entire frame, far outrunning the cloud itself, kicking up dust along
// the ground as its leading edge passes.
const SHOCKWAVE_DURATION = 1700

function shockwaveRadius(canvas: HTMLCanvasElement, elapsed: number) {
  const t = Math.min(1, Math.max(0, elapsed / SHOCKWAVE_DURATION))
  const eased = 1 - Math.pow(1 - t, 2)
  const maxRadius = Math.hypot(canvas.width, canvas.height) * 0.78
  return eased * maxRadius
}

function drawShockwave(canvas: HTMLCanvasElement, elapsed: number) {
  if (!ctx || elapsed < 0 || elapsed > SHOCKWAVE_DURATION) return
  const t = elapsed / SHOCKWAVE_DURATION
  const fade = 1 - t
  const cx = canvas.width / 2
  const originY = groundY(canvas)
  const radius = shockwaveRadius(canvas, elapsed)

  ctx.save()

  const haze = ctx.createRadialGradient(cx, originY, Math.max(0, radius - 90), cx, originY, radius)
  haze.addColorStop(0, 'rgba(255, 205, 140, 0)')
  haze.addColorStop(1, `rgba(255, 205, 140, ${0.16 * fade})`)
  ctx.fillStyle = haze
  ctx.beginPath()
  ctx.arc(cx, originY, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(cx, originY, radius, 0, Math.PI * 2)
  ctx.lineWidth = Math.max(2, 30 * fade)
  ctx.strokeStyle = `rgba(255, 245, 225, ${0.7 * fade})`
  ctx.shadowColor = 'rgba(255, 210, 150, 0.8)'
  ctx.shadowBlur = 36
  ctx.stroke()

  ctx.restore()
}

// An explicit, blinding fireball sphere at the moment of detonation — drawn
// as geometry (not left to particle density) so the first instant of the
// blast reads as one huge violent flash before the column takes over.
const FIREBALL_DURATION = 900

function drawFireball(canvas: HTMLCanvasElement, elapsed: number) {
  if (!ctx || elapsed < 0 || elapsed > FIREBALL_DURATION) return
  const t = elapsed / FIREBALL_DURATION
  const cx = canvas.width / 2
  const gy = groundY(canvas)

  const growT = Math.min(1, elapsed / 260)
  const easedGrow = 1 - Math.pow(1 - growT, 3)
  const maxRadius = Math.min(canvas.width, canvas.height) * 0.4
  const radius = easedGrow * maxRadius
  const riseY = gy - t * maxRadius * 0.4
  const fade = t < 0.45 ? 1 : 1 - (t - 0.45) / 0.55

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const grad = ctx.createRadialGradient(cx, riseY, 0, cx, riseY, Math.max(1, radius))
  grad.addColorStop(0, `rgba(255, 255, 250, ${0.98 * fade})`)
  grad.addColorStop(0.22, `rgba(255, 235, 180, ${0.95 * fade})`)
  grad.addColorStop(0.5, `rgba(255, 160, 70, ${0.85 * fade})`)
  grad.addColorStop(0.78, `rgba(230, 80, 30, ${0.55 * fade})`)
  grad.addColorStop(1, 'rgba(200, 40, 20, 0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, riseY, Math.max(1, radius), 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function spawnShockwaveDust(canvas: HTMLCanvasElement, elapsed: number, now: number) {
  if (elapsed < 0 || elapsed > SHOCKWAVE_DURATION || particles.length >= MAX_PARTICLES) return
  const cx = canvas.width / 2
  const gy = groundY(canvas)
  const radius = shockwaveRadius(canvas, elapsed)
  if (radius <= 0) return

  for (const side of [-1, 1]) {
    const x = cx + side * radius
    if (x < -40 || x > canvas.width + 40) continue
    if (Math.random() < 0.7) {
      particles.push({
        x,
        y: gy,
        vx: side * (30 + Math.random() * 70),
        vy: -Math.random() * 26,
        size: 14 + Math.random() * 22,
        born: now,
        life: 850 + Math.random() * 650,
        kind: 'dust',
        heat: 0
      })
    }
  }
}

function spawnBurst(canvas: HTMLCanvasElement, now: number) {
  const cx = canvas.width / 2
  const gy = groundY(canvas)

  for (let i = 0; i < 180; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4
    const speed = 100 + Math.random() * 340
    particles.push({
      x: cx + (Math.random() - 0.5) * 14,
      y: gy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 7 + Math.random() * 22,
      born: now,
      life: 550 + Math.random() * 700,
      kind: Math.random() < 0.55 ? 'fire' : 'spark',
      heat: 1
    })
  }

  // A handful of long-lived embers ride up inside the column, keeping a
  // hot glow visible through the smoke long after the initial burst fades.
  for (let i = 0; i < 20; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9
    const speed = 20 + Math.random() * 60
    particles.push({
      x: cx + (Math.random() - 0.5) * 20,
      y: gy - Math.random() * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 16 + Math.random() * 20,
      born: now,
      life: 3200 + Math.random() * 1800,
      kind: 'core',
      heat: 1
    })
  }
}

function spawnDust(canvas: HTMLCanvasElement, now: number) {
  if (particles.length >= MAX_PARTICLES) return
  const cx = canvas.width / 2
  const gy = groundY(canvas)
  const angle = Math.random() * Math.PI
  const speed = 40 + Math.random() * 150
  const dir = Math.random() < 0.5 ? -1 : 1

  particles.push({
    x: cx + (Math.random() - 0.5) * 24,
    y: gy,
    vx: Math.cos(angle) * speed * dir,
    vy: -Math.random() * 18,
    size: 22 + Math.random() * 32,
    born: now,
    life: 1800 + Math.random() * 1200,
    kind: 'dust',
    heat: 0
  })
}

interface ColumnMetrics {
  cx: number
  gy: number
  capProgress: number
  stemTopY: number
  stemBottomWidth: number
  stemTopWidth: number
  capWidth: number
  capHeight: number
  capCenterY: number
}

function columnMetrics(canvas: HTMLCanvasElement, elapsed: number): ColumnMetrics {
  const cx = canvas.width / 2
  const gy = groundY(canvas)
  const capProgress = Math.min(1, elapsed / RISE_DURATION)
  const eased = 1 - Math.pow(1 - capProgress, 3)
  const stemTopY = gy - eased * canvas.height * 0.48
  const stemBottomWidth = 30
  const stemTopWidth = 48 + capProgress * 16
  const capWidth = 50 + capProgress * Math.min(canvas.width * 0.38, 460)
  const capHeight = capWidth * 0.52
  const capCenterY = stemTopY - capHeight * 0.12

  return { cx, gy, capProgress, stemTopY, stemBottomWidth, stemTopWidth, capWidth, capHeight, capCenterY }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function mixRgb(c1: [number, number, number], c2: [number, number, number], t: number) {
  return `${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))}`
}

// Explicit silhouette: a tapering stem trapezoid + a wide ellipse cap with
// scalloped underside bumps, so the mushroom shape is always geometrically
// correct rather than hoping particle physics converges on one.
function drawMushroomShape(canvas: HTMLCanvasElement, elapsed: number) {
  if (!ctx) return
  const m = columnMetrics(canvas, elapsed)
  const coolT = Math.min(1, elapsed / 8000)

  ctx.beginPath()
  ctx.moveTo(m.cx - m.stemBottomWidth / 2, m.gy)
  ctx.lineTo(m.cx - m.stemTopWidth / 2, m.stemTopY)
  ctx.lineTo(m.cx + m.stemTopWidth / 2, m.stemTopY)
  ctx.lineTo(m.cx + m.stemBottomWidth / 2, m.gy)
  ctx.closePath()
  const stemGrad = ctx.createLinearGradient(m.cx, m.gy, m.cx, m.stemTopY)
  stemGrad.addColorStop(0, `rgba(${mixRgb([255, 150, 60], [110, 95, 85], coolT)}, 0.85)`)
  stemGrad.addColorStop(1, `rgba(${mixRgb([255, 190, 110], [90, 78, 70], coolT)}, 0.6)`)
  ctx.fillStyle = stemGrad
  ctx.fill()

  ctx.beginPath()
  ctx.ellipse(m.cx, m.capCenterY, m.capWidth / 2, m.capHeight / 2, 0, 0, Math.PI * 2)
  ctx.closePath()
  const capGrad = ctx.createRadialGradient(
    m.cx - m.capWidth * 0.12, m.capCenterY - m.capHeight * 0.25, 0,
    m.cx, m.capCenterY, m.capWidth / 2
  )
  capGrad.addColorStop(0, `rgba(${mixRgb([255, 240, 205], [150, 130, 120], coolT)}, 0.95)`)
  capGrad.addColorStop(0.5, `rgba(${mixRgb([255, 150, 60], [100, 85, 78], coolT)}, 0.88)`)
  capGrad.addColorStop(1, `rgba(${mixRgb([120, 70, 45], [55, 48, 45], coolT)}, 0.5)`)
  ctx.fillStyle = capGrad
  ctx.fill()

  const bumpCount = 8
  for (let i = 0; i < bumpCount; i++) {
    const t = i / (bumpCount - 1)
    const bx = m.cx - m.capWidth / 2 + t * m.capWidth
    const wobble = Math.sin(t * Math.PI * 3 + elapsed / 900) * m.capHeight * 0.06
    const by = m.capCenterY + m.capHeight * 0.32 + wobble
    const br = (m.capWidth / bumpCount) * 0.85
    ctx.beginPath()
    ctx.arc(bx, by, br, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${mixRgb([90, 55, 40], [50, 45, 42], coolT)}, 0.45)`
    ctx.fill()
  }
}

// Short-lived puffs spawned along the cap's current rim to rough up its
// otherwise-clean geometric edge with roiling texture.
function spawnCapFluff(canvas: HTMLCanvasElement, elapsed: number, now: number) {
  if (particles.length >= MAX_PARTICLES) return
  const m = columnMetrics(canvas, elapsed)
  const angle = Math.random() * Math.PI * 2
  const rx = (m.capWidth / 2) * (0.7 + Math.random() * 0.4)
  const ry = (m.capHeight / 2) * (0.7 + Math.random() * 0.4)

  particles.push({
    x: m.cx + Math.cos(angle) * rx,
    y: m.capCenterY + Math.sin(angle) * ry * 0.6,
    vx: Math.cos(angle) * 6,
    vy: Math.sin(angle) * 4 + 6,
    size: 20 + Math.random() * 26,
    born: now,
    life: 900 + Math.random() * 700,
    kind: 'smoke',
    heat: Math.max(0, 1 - elapsed / 6000)
  })
}

function stepParticle(p: Particle, dt: number, ageRatio: number) {
  const buoyancy = p.kind === 'dust'
    ? -4
    : p.kind === 'fire' || p.kind === 'spark'
      ? -160 * (1 - ageRatio)
      : p.kind === 'core'
        ? -70 * (1 - ageRatio * 0.5)
        : 0

  p.vy += buoyancy * dt
  p.vx *= 1 - 1.4 * dt
  p.vy *= 1 - 1.4 * dt
  p.vx += (Math.random() - 0.5) * 14 * dt
  p.x += p.vx * dt
  p.y += p.vy * dt
  if (p.kind === 'core') p.size += dt * 3
}

function colorFor(p: Particle, ageRatio: number): [string, number] {
  if (p.kind === 'fire' || p.kind === 'spark') {
    const stops = ['255,250,225', '255,195,90', '255,110,35', '190,40,20']
    const idx = Math.min(stops.length - 1, Math.floor(ageRatio * stops.length))
    return [stops[idx]!, 1 - ageRatio]
  }

  if (p.kind === 'core') {
    const stops = ['255,235,180', '255,175,80', '255,120,45']
    const idx = Math.min(stops.length - 1, Math.floor(ageRatio * stops.length))
    const fadeOut = 1 - Math.max(0, ageRatio - 0.6) / 0.4
    return [stops[idx]!, fadeOut * 0.7]
  }

  if (p.kind === 'smoke') {
    const mixT = Math.min(1, (1 - p.heat) * 0.7 + ageRatio * 0.3)
    const color = mixRgb([255, 190, 90], [95, 80, 70], mixT)
    const fade = Math.sin(Math.min(1, ageRatio) * Math.PI)
    return [color, fade * 0.5]
  }

  return ['95,80,65', (1 - ageRatio) * 0.32]
}

function drawParticle(p: Particle, now: number) {
  if (!ctx) return
  const ageRatio = Math.min(1, (now - p.born) / p.life)
  const [color, alpha] = colorFor(p, ageRatio)
  if (alpha <= 0) return

  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, p.size))
  gradient.addColorStop(0, `rgba(${color}, ${alpha})`)
  gradient.addColorStop(1, `rgba(${color}, 0)`)
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2)
  ctx.fill()
}

const ADDITIVE_KINDS = new Set<ParticleKind>(['fire', 'spark', 'core'])

function drawKind(kind: ParticleKind, now: number) {
  if (!ctx) return
  ctx.globalCompositeOperation = ADDITIVE_KINDS.has(kind) ? 'lighter' : 'source-over'
  for (const p of particles) {
    if (p.kind === kind) drawParticle(p, now)
  }
  ctx.globalCompositeOperation = 'source-over'
}

function updateAndDraw(canvas: HTMLCanvasElement, now: number, elapsed: number) {
  if (!ctx) return
  const dt = Math.min(0.05, (now - lastFrame) / 1000 || 0.016)
  lastFrame = now

  particles = particles.filter(p => now - p.born < p.life)
  for (const p of particles) {
    stepParticle(p, dt, Math.min(1, (now - p.born) / p.life))
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawKind('dust', now)
  drawShockwave(canvas, elapsed)
  drawMushroomShape(canvas, elapsed)
  drawFireball(canvas, elapsed)
  drawKind('smoke', now)
  drawKind('core', now)
  drawKind('fire', now)
  drawKind('spark', now)
}

function frame() {
  raf = requestAnimationFrame(frame)

  const canvas = canvasEl.value
  if (!canvas || !ctx || stage.value === 'forking') return

  const now = performance.now()
  const elapsed = now - detonatedAt
  if (elapsed < 0) return

  if (!burstFired) {
    spawnBurst(canvas, now)
    burstFired = true
  }

  if (elapsed < 1600 && Math.random() < 0.9) spawnDust(canvas, now)
  spawnShockwaveDust(canvas, elapsed, now)

  spawnCapFluff(canvas, elapsed, now)
  spawnCapFluff(canvas, elapsed, now)
  if (Math.random() < 0.7) spawnCapFluff(canvas, elapsed, now)

  updateAndDraw(canvas, now, elapsed)
}

watch(stage, (value) => {
  if (value === 'flash') {
    detonatedAt = performance.now()
    burstFired = false
  }
})

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

let previousOverflow = ''

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', resizeCanvas)
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  ctx = canvasEl.value?.getContext('2d') ?? null
  resizeCanvas()
  lastFrame = performance.now()
  raf = requestAnimationFrame(frame)

  tick(0)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', resizeCanvas)
  timers.forEach(clearTimeout)
  if (raf) cancelAnimationFrame(raf)
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fork-bomb-overlay fixed inset-0 z-[120] overflow-hidden bg-black font-mono cursor-pointer"
      :class="{ critical, impact: stage !== 'forking' }"
      @click="emit('close')"
    >
      <div
        v-if="stage === 'forking'"
        class="absolute inset-0"
      >
        <div
          v-for="clone in clones"
          :key="clone.id"
          class="clone absolute rounded border border-green-500/50 bg-black/90 text-green-400 overflow-hidden"
          :style="{
            left: `${clone.left}%`,
            top: `${clone.top}%`,
            width: `${clone.size}px`,
            transform: `rotate(${clone.rotate}deg)`,
            animationDelay: `${clone.delay}s`
          }"
        >
          <div class="clone-header flex items-center gap-0.5 px-1 pt-1">
            <span class="size-1 rounded-full bg-red-500/70" />
            <span class="size-1 rounded-full bg-yellow-500/70" />
            <span class="size-1 rounded-full bg-green-500/70" />
          </div>
          <p class="px-1 pb-1 text-[6px] leading-tight whitespace-nowrap">
            :(){ :|:&amp; };:
          </p>
          <p class="px-1 pb-1 text-[5px] leading-tight text-green-500/70 whitespace-nowrap">
            fork: pid {{ clone.pid }}
          </p>
        </div>

        <div
          v-if="critical"
          class="critical-vignette absolute inset-0"
        />
      </div>

      <canvas
        ref="canvasEl"
        class="absolute inset-0 pointer-events-none"
      />

      <template v-if="stage !== 'forking'">
        <div class="condensation-ring absolute rounded-full" />

        <div class="ground-shock absolute rounded-full" />

        <div
          v-if="stage === 'cloud'"
          class="air-shock absolute rounded-full"
        />
      </template>

      <div class="flash absolute inset-0" />
    </div>
  </Teleport>
</template>

<style scoped>
.fork-bomb-overlay {
  opacity: 0;
  animation: overlay-in 0.3s ease-out forwards;
}

@keyframes overlay-in {
  to { opacity: 1; }
}

.clone {
  opacity: 0;
  animation: clone-pop 0.2s ease-out forwards;
}

@keyframes clone-pop {
  0% { opacity: 0; transform: scale(0.4); }
  60% { opacity: 1; }
  100% { opacity: 1; }
}

.critical-vignette {
  background: radial-gradient(ellipse at center, transparent 35%, rgba(255, 20, 20, 0.35) 100%);
  animation: critical-pulse 0.4s ease-in-out infinite;
  mix-blend-mode: screen;
}

@keyframes critical-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.fork-bomb-overlay.critical {
  animation: overlay-in 0.3s ease-out forwards, jitter 0.15s linear infinite;
}

@keyframes jitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(2px, -1px); }
  75% { transform: translate(-1px, -2px); }
  100% { transform: translate(1px, 2px); }
}

.fork-bomb-overlay.impact {
  animation: overlay-in 0.3s ease-out forwards, impact-shake 0.9s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes impact-shake {
  0%, 34% { transform: translate(0, 0) rotate(0deg); }
  38% { transform: translate(-20px, 14px) rotate(-0.9deg); }
  44% { transform: translate(17px, -17px) rotate(1deg); }
  50% { transform: translate(-15px, -12px) rotate(-0.75deg); }
  58% { transform: translate(13px, 13px) rotate(0.7deg); }
  66% { transform: translate(-9px, -7px) rotate(-0.45deg); }
  76% { transform: translate(6px, 6px) rotate(0.3deg); }
  88%, 100% { transform: translate(0, 0) rotate(0deg); }
}

.flash {
  background-color: #fff;
  opacity: 0;
  pointer-events: none;
}

.fork-bomb-overlay.impact .flash {
  animation: flash-pulse 1.1s ease-out forwards;
}

@keyframes flash-pulse {
  0% { opacity: 0; background-color: #fff; }
  8% { opacity: 1; background-color: #fff; }
  24% { opacity: 0.92; background-color: #fff2d8; }
  55% { opacity: 0.3; background-color: #ffb066; }
  100% { opacity: 0; background-color: #ffb066; }
}

.condensation-ring {
  left: 50%;
  bottom: 32%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, 50%);
  border: 2px solid rgba(255, 255, 255, 0.9);
  filter: blur(1px);
  opacity: 0;
  animation: condensation-pulse 0.55s ease-out forwards;
}

@keyframes condensation-pulse {
  0% { transform: translate(-50%, 50%) scale(0.5); opacity: 0; }
  22% { opacity: 0.9; }
  100% { transform: translate(-50%, 50%) scale(6.5); opacity: 0; }
}

.ground-shock {
  left: 50%;
  bottom: 26%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, 50%);
  border: 4px solid rgba(255, 210, 140, 0.95);
  opacity: 0;
  animation: shock-expand 1.5s ease-out 0.05s forwards;
}

@keyframes shock-expand {
  0% { transform: translate(-50%, 50%) scale(0.2); opacity: 1; border-width: 10px; }
  100% { transform: translate(-50%, 50%) scale(11); opacity: 0; border-width: 1px; }
}

.air-shock {
  left: 50%;
  bottom: 58%;
  width: 30px;
  height: 30px;
  transform: translate(-50%, 50%);
  border: 3px solid rgba(255, 240, 210, 0.8);
  opacity: 0;
  animation: shock-expand 1.1s ease-out 0.25s forwards;
}
</style>
