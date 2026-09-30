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

  const dark = colorMode.value === 'dark'
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      darkMode: dark,
      background: 'transparent',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '13px',
      primaryColor: dark ? '#1C1C19' : '#F5F3EE',
      primaryTextColor: dark ? '#F4F1E8' : '#0E0D0B',
      primaryBorderColor: dark ? '#4A4840' : '#9D978A',
      secondaryColor: dark ? '#272622' : '#E4E0D6',
      tertiaryColor: dark ? '#171714' : '#ECE9E1',
      lineColor: '#EB5517',
      textColor: dark ? '#B7B2A6' : '#3B3931',
      noteBkgColor: dark ? '#272622' : '#E4E0D6',
      noteTextColor: dark ? '#D8D4C9' : '#23221D',
      noteBorderColor: dark ? '#4A4840' : '#9D978A',
      actorBkg: dark ? '#1C1C19' : '#F5F3EE',
      actorBorder: dark ? '#4A4840' : '#9D978A',
      actorTextColor: dark ? '#F4F1E8' : '#0E0D0B',
      signalColor: dark ? '#D8D4C9' : '#23221D',
      signalTextColor: dark ? '#D8D4C9' : '#23221D',
      edgeLabelBackground: dark ? '#11110F' : '#ECE9E1'
    },
    fontFamily: 'JetBrains Mono, monospace',
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
