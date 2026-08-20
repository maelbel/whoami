<script setup lang="ts">
const { site } = useAppConfig()
const route = useRoute()

const description = 'Outtakes from shipping this site — the takes that didn\'t make the highlight reel.'

useSeoMeta({
  title: `Blooper reel — ${site.name}`,
  description,
  robots: 'noindex'
})
defineOgImage('Terminal.satori', { title: 'Blooper reel', description })

const justUnlocked = computed(() => route.query.unlocked === '1')

const { pieces: confetti, launch: launchConfetti } = useConfetti()

onMounted(() => {
  if (justUnlocked.value) launchConfetti(32)
})

const takes = [
  {
    take: 'Take 1',
    title: 'release v1.5.0 — deploy hangs, 52 minutes, no survivors',
    log: [
      '$ vercel build --prod',
      '✨ Build complete!',
      '(nothing happens for 52 minutes)',
      '##[error] The operation was canceled.'
    ]
  },
  {
    take: 'Take 2',
    title: 'release v1.5.1, attempt 1 — same trick, bigger stage',
    log: [
      '$ vercel build --prod',
      '✨ Build complete!',
      '(nothing happens for 6 hours)',
      '##[error] The job has exceeded the maximum execution time of 6h0m0s'
    ]
  },
  {
    take: 'Take 3',
    title: 'the fix — don\'t trust a process that says it\'s done and then just sits there',
    log: [
      '$ timeout --signal=TERM --kill-after=15s 180s vercel build --prod',
      '$ test -f .vercel/output/config.json',
      '✓ Build project artifacts',
      '✓ Deploy to Vercel'
    ]
  },
  {
    take: 'Bonus cut',
    title: 'a lint warning that has survived every take so far',
    log: [
      'app/components/MermaidDiagram.vue:30',
      '! \'v-html\' directive can lead to XSS attack',
      '# it\'s trusted, generated markup — still on the list.'
    ]
  },
  {
    take: 'Deleted scene',
    title: 'the terminal command that almost shipped',
    log: [
      '$ sudo rm -rf /',
      'Nice try. This terminal is read-only — and so is your judgment.'
    ]
  }
]
</script>

<template>
  <div>
    <UPageHero
      headline="You found it"
      title="The blooper reel"
      description="Every portfolio shows the highlight reel. Here's what actually happened while shipping this one — real logs, real timestamps, nothing staged."
    />

    <UPageSection>
      <UAlert
        v-if="justUnlocked"
        icon="i-lucide-party-popper"
        color="primary"
        variant="subtle"
        title="Cheat code accepted"
        description="↑ ↑ ↓ ↓ ← → ← → B A — you remembered. Enjoy the outtakes."
        class="mb-8"
      />

      <div class="flex flex-col gap-4">
        <UPageCard
          v-for="entry in takes"
          :key="entry.title"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ entry.take }}
              </UBadge>
              <span class="text-base font-semibold text-highlighted">{{ entry.title }}</span>
            </div>
          </template>
          <pre class="font-mono text-sm text-muted whitespace-pre-wrap">{{ entry.log.join('\n') }}</pre>
        </UPageCard>
      </div>

      <UButton
        to="/"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        class="mt-8"
      >
        Back to the highlight reel
      </UButton>
    </UPageSection>

    <ConfettiOverlay
      :pieces="confetti"
      emoji="🎬"
    />
  </div>
</template>
