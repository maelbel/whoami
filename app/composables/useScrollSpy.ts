const ACTIVE_SECTION_KEY = 'active-section'

export function useActiveSection() {
  return useState<string | null>(ACTIVE_SECTION_KEY, () => null)
}

export function useScrollSpy(sectionIds: string[]) {
  const activeId = useActiveSection()

  function setActive(id: string | null) {
    activeId.value = id
    window.history.replaceState(window.history.state, '', id ? `#${id}` : window.location.pathname)
  }

  onMounted(() => {
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (!elements.length) return

    const intersecting = new Map(elements.map(el => [el.id, false]))

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        intersecting.set(entry.target.id, entry.isIntersecting)
      }

      const current = sectionIds.filter(id => intersecting.get(id))

      if (current.length) {
        setActive(current.at(-1) ?? null)
      } else if (window.scrollY < elements[0]!.offsetTop) {
        setActive(null)
      }
    }, { rootMargin: '-45% 0px -50% 0px' })

    elements.forEach(el => observer.observe(el))

    onUnmounted(() => {
      observer.disconnect()
      activeId.value = null
    })
  })

  return activeId
}
