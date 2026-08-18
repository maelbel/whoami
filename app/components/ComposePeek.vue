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
    <UButton
      color="neutral"
      variant="link"
      size="sm"
      icon="i-simple-icons-docker"
      trailing-icon="i-lucide-chevron-down"
      :ui="{ trailingIcon: 'transition-transform group-data-[state=open]:rotate-180' }"
      class="group"
      @click.stop
    >
      docker-compose.yml
    </UButton>

    <template #content>
      <div class="relative mt-3">
        <pre class="rounded-md bg-elevated/50 p-3 pr-10 text-xs font-mono text-muted overflow-x-auto">{{ compose }}</pre>
        <UTooltip :text="copied ? 'Copied!' : 'Copy'">
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            class="absolute top-2 right-2"
            aria-label="Copy docker-compose.yml"
            @click.stop="copy"
          />
        </UTooltip>
      </div>
    </template>
  </UCollapsible>
</template>
