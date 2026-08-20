<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

interface Star {
  left: number
  top: number
  size: number
  duration: number
  delay: number
  dx: number
  dy: number
}

const STAR_COUNT = 120

const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
  const left = Math.random() * 100
  const top = Math.random() * 100
  return {
    left,
    top,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3.5 + 1.5,
    delay: Math.random() * 4,
    dx: 50 - left,
    dy: 50 - top
  }
})

const stage = ref<'fade' | 'hole'>('fade')

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

const timers: ReturnType<typeof setTimeout>[] = []
let previousOverflow = ''

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  timers.push(setTimeout(() => {
    stage.value = 'hole'
  }, 700))
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  timers.forEach(clearTimeout)
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <Teleport to="body">
    <div
      class="blackhole-overlay fixed inset-0 z-[120] overflow-hidden bg-black font-mono cursor-pointer"
      @click="emit('close')"
    >
      <span
        v-for="(star, index) in stars"
        :key="index"
        class="star absolute rounded-full bg-white"
        :style="{
          'left': `${star.left}%`,
          'top': `${star.top}%`,
          'width': `${star.size}px`,
          'height': `${star.size}px`,
          '--dx': `${star.dx}vw`,
          '--dy': `${star.dy}vh`,
          'animationDuration': `${star.duration}s`,
          'animationDelay': `${star.delay}s`
        }"
      />

      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="blackhole relative"
          :class="{ 'blackhole--visible': stage !== 'fade' }"
        >
          <div class="jet jet--top absolute" />
          <div class="jet jet--bottom absolute" />
          <div class="shockwave absolute inset-0 rounded-full" />
          <div class="disk-ring-wrap absolute inset-0">
            <div class="disk-ring absolute inset-0 rounded-full" />
          </div>
          <div class="lens-arc lens-arc--top absolute rounded-full" />
          <div class="lens-arc lens-arc--bottom absolute rounded-full" />
          <div class="photon-ring absolute rounded-full" />
          <div class="core absolute rounded-full bg-black" />
        </div>
      </div>

      <div class="flash absolute inset-0" />
    </div>
  </Teleport>
</template>

<style scoped>
.blackhole-overlay {
  opacity: 0;
  animation: overlay-in 0.7s ease-out forwards, shake 0.5s ease-out 0.7s;
}

@keyframes overlay-in {
  to { opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(-10px, 6px) rotate(-0.4deg); }
  40% { transform: translate(9px, -8px) rotate(0.5deg); }
  60% { transform: translate(-7px, -5px) rotate(-0.3deg); }
  80% { transform: translate(6px, 7px) rotate(0.3deg); }
}

.flash {
  background: white;
  opacity: 0;
  pointer-events: none;
  animation: flash-pulse 0.6s ease-out 0.65s forwards;
}

@keyframes flash-pulse {
  0% { opacity: 0; }
  15% { opacity: 0.6; }
  100% { opacity: 0; }
}

.star {
  opacity: 0;
  animation-name: fall-in;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fall-in {
  0% { transform: translate(0, 0) scale(1); opacity: 0.85; }
  80% { opacity: 0.6; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
}

.blackhole {
  width: 0;
  height: 0;
  opacity: 0;
  transition: width 1.4s cubic-bezier(0.2, 0.8, 0.2, 1), height 1.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1s ease-out;
}

.blackhole--visible {
  width: clamp(180px, 42vmin, 340px);
  height: clamp(180px, 42vmin, 340px);
  opacity: 1;
  animation: hole-breathe 3s ease-in-out 1.4s infinite;
}

.disk-ring-wrap {
  transform: rotate(-8deg);
}

.disk-ring {
  inset: -18%;
  background: conic-gradient(
    from 200deg,
    rgba(255, 246, 235, 1) 0deg,
    rgba(255, 190, 120, 0.85) 55deg,
    rgba(190, 80, 35, 0.35) 140deg,
    rgba(90, 30, 15, 0.12) 200deg,
    rgba(190, 80, 35, 0.35) 260deg,
    rgba(255, 190, 120, 0.85) 320deg,
    rgba(255, 246, 235, 1) 360deg
  );
  -webkit-mask-image: radial-gradient(circle, transparent 56%, black 61%, black 78%, transparent 85%);
  mask-image: radial-gradient(circle, transparent 56%, black 61%, black 78%, transparent 85%);
  filter: blur(2px);
  animation: ring-spin 9s linear infinite;
}

.lens-arc {
  left: 50%;
  width: 68%;
  height: 24%;
  transform: translate(-50%, -50%);
  filter: blur(4px);
  background: radial-gradient(ellipse at center, rgba(255, 240, 210, 0.95) 0%, rgba(255, 205, 145, 0.55) 45%, transparent 75%);
}

.lens-arc--top {
  top: 27%;
}

.lens-arc--bottom {
  top: 73%;
}

.photon-ring {
  inset: 26.5%;
  border: 2px solid rgba(255, 246, 230, 0.55);
  filter: blur(1.5px);
  box-shadow: 0 0 14px 3px rgba(255, 232, 195, 0.4);
}

.core {
  inset: 28%;
  box-shadow: 0 0 35px 10px rgba(255, 255, 255, 0.35), 0 0 100px 35px rgba(255, 130, 40, 0.28), 0 0 160px 60px rgba(255, 80, 20, 0.12);
}

.shockwave {
  border: 2px solid rgba(255, 215, 160, 0.85);
  opacity: 0;
}

.blackhole--visible .shockwave {
  animation: shockwave-expand 1.1s ease-out 0.05s forwards;
}

.jet {
  left: 50%;
  width: 4px;
  height: 40vh;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0));
  filter: blur(1px);
  opacity: 0;
}

.jet--top {
  bottom: 100%;
  transform: translateX(-50%);
}

.jet--bottom {
  top: 100%;
  transform: translateX(-50%) rotate(180deg);
}

.blackhole--visible .jet {
  opacity: 0.7;
  animation: jet-flicker 2s ease-in-out infinite;
}

@keyframes ring-spin {
  from { transform: scaleY(0.32) rotate(0deg); }
  to { transform: scaleY(0.32) rotate(360deg); }
}

@keyframes hole-breathe {
  0%, 100% { filter: drop-shadow(0 0 25px rgba(255, 140, 40, 0.3)); }
  50% { filter: drop-shadow(0 0 55px rgba(255, 140, 40, 0.55)); }
}

@keyframes shockwave-expand {
  0% { transform: scale(0.3); opacity: 0.9; border-width: 5px; }
  100% { transform: scale(2.8); opacity: 0; border-width: 1px; }
}

@keyframes jet-flicker {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.85; }
}
</style>
