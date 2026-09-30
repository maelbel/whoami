<script setup lang="ts">
const props = defineProps<{
  compose: string
}>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.compose)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <UCollapsible class="relative z-10 w-full">
    <button
      type="button"
      class="group flex cursor-pointer items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-highlighted"
      @click.stop
    >
      <UIcon
        name="i-lucide-chevron-right"
        class="size-3.5 transition-transform group-data-[state=open]:rotate-90"
      />
      cat docker-compose.yml
    </button>

    <template #content>
      <div class="relative mt-3">
        <pre class="max-h-96 overflow-auto border border-black/40 bg-tty-bg p-4 pr-12 font-mono text-xs leading-relaxed text-tty-muted dark:border-white/10">{{ compose }}</pre>
        <UTooltip :text="copied ? 'Copied!' : 'Copy'">
          <button
            type="button"
            class="absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center text-tty-dim hover:text-tty-text"
            aria-label="Copy docker-compose.yml"
            @click.stop="copy"
          >
            <UIcon
              :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              class="size-3.5"
            />
          </button>
        </UTooltip>
      </div>
    </template>
  </UCollapsible>
</template>
