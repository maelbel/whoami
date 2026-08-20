<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const colorMode = useColorMode()
const svg = ref('')

async function render() {
  const [{ default: mermaid }, { default: DOMPurify }] = await Promise.all([
    import('mermaid'),
    import('dompurify')
  ])

  mermaid.initialize({
    startOnLoad: false,
    theme: colorMode.value === 'dark' ? 'dark' : 'neutral',
    fontFamily: 'inherit',
    securityLevel: 'strict',
    flowchart: { htmlLabels: false },
    htmlLabels: false
  })

  const id = `mermaid-${Math.random().toString(36).slice(2)}`
  const result = await mermaid.render(id, props.code)
  svg.value = DOMPurify.sanitize(result.svg, { USE_PROFILES: { svg: true, svgFilters: true } })
}

watch(() => colorMode.value, render)
onMounted(render)
</script>

<template>
  <!-- eslint-disable vue/no-v-html -- svg is DOMPurify-sanitized above -->
  <div
    class="flex justify-center overflow-x-auto [&_svg]:max-w-full"
    v-html="svg"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>
