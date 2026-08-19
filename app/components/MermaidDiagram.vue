<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const colorMode = useColorMode()
const svg = ref('')

async function render() {
  const { default: mermaid } = await import('mermaid')

  mermaid.initialize({
    startOnLoad: false,
    theme: colorMode.value === 'dark' ? 'dark' : 'neutral',
    fontFamily: 'inherit'
  })

  const id = `mermaid-${Math.random().toString(36).slice(2)}`
  const result = await mermaid.render(id, props.code)
  svg.value = result.svg
}

watch(() => colorMode.value, render)
onMounted(render)
</script>

<template>
  <div
    class="flex justify-center overflow-x-auto [&_svg]:max-w-full"
    v-html="svg"
  />
</template>
