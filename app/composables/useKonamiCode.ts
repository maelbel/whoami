const SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

export function useKonamiCode(onUnlock: () => void) {
  const progress = ref(0)

  function handleKeydown(event: KeyboardEvent) {
    const key = event.key.toLowerCase()
    const expected = SEQUENCE[progress.value]

    if (key === expected) {
      progress.value++
      if (progress.value === SEQUENCE.length) {
        progress.value = 0
        onUnlock()
      }
    } else {
      progress.value = key === SEQUENCE[0] ? 1 : 0
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
