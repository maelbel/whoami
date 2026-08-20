<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

interface Point { x: number, y: number }

const GRID_SIZE = 16
const TICK_MS = 130
const START_SNAKE: Point[] = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }]

const snake = ref<Point[]>(START_SNAKE.map(p => ({ ...p })))
const direction = ref<Point>({ x: 1, y: 0 })
const nextDirection = ref<Point>({ x: 1, y: 0 })
const food = ref<Point>(randomFood(snake.value))
const score = ref(0)
const gameOver = ref(false)
const paused = ref(false)

let timer: ReturnType<typeof setInterval> | undefined

function randomFood(occupied: Point[]): Point {
  let point: Point
  do {
    point = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
  } while (occupied.some(p => p.x === point.x && p.y === point.y))
  return point
}

function tick() {
  if (gameOver.value || paused.value) return

  direction.value = nextDirection.value
  const head = snake.value[0]!
  const newHead = { x: head.x + direction.value.x, y: head.y + direction.value.y }

  const hitsWall = newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE
  const hitsSelf = snake.value.some(p => p.x === newHead.x && p.y === newHead.y)

  if (hitsWall || hitsSelf) {
    gameOver.value = true
    return
  }

  snake.value = [newHead, ...snake.value]

  if (newHead.x === food.value.x && newHead.y === food.value.y) {
    score.value++
    food.value = randomFood(snake.value)
  } else {
    snake.value.pop()
  }
}

function setDirection(x: number, y: number) {
  if (direction.value.x === -x && direction.value.y === -y) return
  nextDirection.value = { x, y }
}

function restart() {
  snake.value = START_SNAKE.map(p => ({ ...p }))
  direction.value = { x: 1, y: 0 }
  nextDirection.value = { x: 1, y: 0 }
  food.value = randomFood(snake.value)
  score.value = 0
  gameOver.value = false
  paused.value = false
}

const MOVES: Record<string, Point> = {
  arrowup: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  d: { x: 1, y: 0 }
}

function handleKeydown(event: KeyboardEvent) {
  const key = event.key.toLowerCase()

  if (key === 'escape') {
    emit('close')
    return
  }

  if (key === ' ' || key === 'enter') {
    event.preventDefault()
    if (gameOver.value) restart()
    else paused.value = !paused.value
    return
  }

  const move = MOVES[key]
  if (move) {
    event.preventDefault()
    setDirection(move.x, move.y)
  }
}

const cells = computed(() => {
  const snakeSet = new Set(snake.value.map(p => `${p.x},${p.y}`))
  const headKey = `${snake.value[0]!.x},${snake.value[0]!.y}`
  const foodKey = `${food.value.x},${food.value.y}`
  const grid: Array<'empty' | 'head' | 'body' | 'food'> = []

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const key = `${x},${y}`
      if (key === foodKey) grid.push('food')
      else if (key === headKey) grid.push('head')
      else if (snakeSet.has(key)) grid.push('body')
      else grid.push('empty')
    }
  }

  return grid
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  timer = setInterval(tick, TICK_MS)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearInterval(timer)
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <UCard
        variant="subtle"
        class="font-mono text-sm w-full max-w-sm"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-primary">$ snake</span>
            <UButton
              icon="i-lucide-x"
              size="xs"
              color="neutral"
              variant="ghost"
              aria-label="Close"
              @click="emit('close')"
            />
          </div>
        </template>

        <div class="flex items-center justify-between mb-2 text-muted">
          <span>score: {{ score }}</span>
          <span v-if="gameOver">game over — space to restart</span>
          <span v-else-if="paused">paused</span>
        </div>

        <div
          class="grid gap-px bg-elevated/50 border border-default rounded overflow-hidden mx-auto"
          :style="{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, width: `${GRID_SIZE * 16}px` }"
        >
          <div
            v-for="(cell, index) in cells"
            :key="index"
            class="size-4"
            :class="{
              'bg-primary': cell === 'head' || cell === 'body',
              'bg-red-500': cell === 'food',
              'bg-default': cell === 'empty'
            }"
          />
        </div>

        <p class="text-dimmed text-xs mt-3 text-center">
          arrows / wasd to move · space to pause · esc to quit
        </p>
      </UCard>
    </div>
  </Teleport>
</template>
