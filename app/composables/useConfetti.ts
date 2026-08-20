export interface ConfettiPiece {
  id: number
  left: number
  duration: number
  delay: number
  rotation: number
  drift: number
}

export function useConfetti() {
  const pieces = ref<ConfettiPiece[]>([])
  let nextId = 0

  function launch(count = 28) {
    const batch: ConfettiPiece[] = Array.from({ length: count }, () => ({
      id: nextId++,
      left: Math.random() * 100,
      duration: 2.5 + Math.random() * 1.5,
      delay: Math.random() * 0.3,
      rotation: Math.random() * 720 - 360,
      drift: Math.random() * 200 - 100
    }))

    pieces.value.push(...batch)

    const ids = new Set(batch.map(piece => piece.id))
    setTimeout(() => {
      pieces.value = pieces.value.filter(piece => !ids.has(piece.id))
    }, 4500)
  }

  return { pieces, launch }
}
