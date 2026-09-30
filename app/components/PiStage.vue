<script setup lang="ts">
import type { AnchorName, PiScene, ScreenAnchor } from '~/lib/pi-scene'

const props = defineProps<{
  progress: number
}>()

const emit = defineEmits<{
  frame: [progress: number, anchors: Record<AnchorName, ScreenAnchor>]
  error: []
}>()

const canvasEl = ref<HTMLCanvasElement>()
let stage: PiScene | undefined
let resizeObserver: ResizeObserver | undefined

watch(() => props.progress, progress => stage?.setProgress(progress))

onMounted(async () => {
  const canvas = canvasEl.value
  if (!canvas) return

  try {
    const { createPiScene } = await import('~/lib/pi-scene')
    stage = createPiScene(canvas, {
      onFrame: (progress, anchors) => emit('frame', progress, anchors)
    })
  } catch {
    emit('error')
    return
  }

  stage.setProgress(props.progress)
  resizeObserver = new ResizeObserver(([entry]) => {
    if (entry) stage?.resize(entry.contentRect.width, entry.contentRect.height)
  })
  resizeObserver.observe(canvas)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  stage?.dispose()
})
</script>

<template>
  <canvas
    ref="canvasEl"
    class="absolute inset-0 size-full"
    aria-hidden="true"
  />
</template>
