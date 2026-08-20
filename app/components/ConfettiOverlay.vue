<script setup lang="ts">
import type { ConfettiPiece } from '~/composables/useConfetti'

defineProps<{
  pieces: ConfettiPiece[]
  emoji?: string
}>()
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <span
        v-for="piece in pieces"
        :key="piece.id"
        class="confetti-piece absolute top-[-10%] text-2xl select-none"
        :style="{
          'left': `${piece.left}%`,
          'animationDuration': `${piece.duration}s`,
          'animationDelay': `${piece.delay}s`,
          '--drift': `${piece.drift}px`,
          '--rotation': `${piece.rotation}deg`
        }"
      >
        {{ emoji ?? '🎉' }}
      </span>
    </div>
  </Teleport>
</template>

<style scoped>
.confetti-piece {
  animation-name: confetti-fall;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rotation));
    opacity: 0;
  }
}
</style>
