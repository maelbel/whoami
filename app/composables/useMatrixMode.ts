const GLITCH_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
const DECODE_TICK_MS = 40
const SKIP_SELECTOR = 'script, style, noscript, textarea, select, .matrix-char, [data-no-matrix]'

interface DecodeItem {
  span: HTMLElement
  target: string
  startAt: number
  duration: number
}

let effectsStarted = false
let observer: MutationObserver | undefined
let decodeTimer: ReturnType<typeof setInterval> | undefined
let queue: DecodeItem[] = []

function shouldSkip(node: Text) {
  return !!node.parentElement?.closest(SKIP_SELECTOR)
}

function wrapTextNode(textNode: Text): HTMLElement[] {
  const original = textNode.data
  const frag = document.createDocumentFragment()
  const created: HTMLElement[] = []

  for (const char of original) {
    if (/\s/.test(char)) {
      frag.appendChild(document.createTextNode(char))
      continue
    }
    const span = document.createElement('span')
    span.className = 'matrix-char'
    span.dataset.ch = char
    span.textContent = char
    frag.appendChild(span)
    created.push(span)
  }

  textNode.parentNode?.replaceChild(frag, textNode)
  return created
}

function wrap(root: Node): HTMLElement[] {
  if (root.nodeType === Node.TEXT_NODE) {
    const textNode = root as Text
    return !textNode.data.trim() || shouldSkip(textNode) ? [] : wrapTextNode(textNode)
  }

  if (!(root instanceof Element) && !(root instanceof DocumentFragment)) return []

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node as Text
      if (!text.data.trim()) return NodeFilter.FILTER_SKIP
      if (shouldSkip(text)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    }
  })

  const nodes: Text[] = []
  let current = walker.nextNode()
  while (current) {
    nodes.push(current as Text)
    current = walker.nextNode()
  }

  return nodes.flatMap(wrapTextNode)
}

function unwrap(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('.matrix-char').forEach((span) => {
    span.replaceWith(document.createTextNode(span.dataset.ch ?? span.textContent ?? ''))
  })
  root.normalize()
}

function decodeTick() {
  const now = performance.now()

  queue = queue.filter((item) => {
    if (now < item.startAt) return true

    item.span.dataset.glitching = '1'

    if (now - item.startAt >= item.duration) {
      item.span.textContent = item.target
      delete item.span.dataset.glitching
      return false
    }

    item.span.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!
    return true
  })

  if (!queue.length) {
    clearInterval(decodeTimer)
    decodeTimer = undefined
  }
}

function enqueueDecode(spans: HTMLElement[]) {
  if (!spans.length) return

  const now = performance.now()
  spans.forEach((span, index) => {
    const progress = spans.length > 1 ? index / spans.length : 0
    queue.push({
      span,
      target: span.dataset.ch ?? '',
      startAt: now + progress * 450 + Math.random() * 120,
      duration: 220 + Math.random() * 320
    })
  })

  if (!decodeTimer) decodeTimer = setInterval(decodeTick, DECODE_TICK_MS)
}

function startGlitch() {
  enqueueDecode(wrap(document.body))

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => enqueueDecode(wrap(node)))
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

function stopGlitch() {
  observer?.disconnect()
  observer = undefined
  clearInterval(decodeTimer)
  decodeTimer = undefined
  queue = []
  unwrap(document.body)
}

export function useMatrixMode() {
  const active = useState('matrix-mode', () => false)

  if (import.meta.client && !effectsStarted) {
    effectsStarted = true
    watch(active, (value) => {
      document.documentElement.classList.toggle('matrix-mode', value)
      if (value) startGlitch()
      else stopGlitch()
    }, { immediate: true })
  }

  function toggle() {
    active.value = !active.value
  }

  return { active, toggle }
}
