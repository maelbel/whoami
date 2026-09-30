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
    <PageIntro
      path="~/blooper-reel"
      title="The blooper reel"
      description="Every portfolio shows the highlight reel. Here's what actually happened while shipping this one — real logs, real timestamps, nothing staged."
    >
      <p
        v-if="justUnlocked"
        class="mt-8 inline-flex items-center gap-2 border border-primary px-3 py-2 font-mono text-xs text-primary"
      >
        ↑ ↑ ↓ ↓ ← → ← → B A — cheat code accepted. Enjoy the outtakes.
      </p>
    </PageIntro>

    <section class="container-site flex flex-col gap-8 py-16 sm:py-24">
      <article
        v-for="entry in takes"
        :key="entry.title"
        class="grid gap-x-12 gap-y-3 lg:grid-cols-[11rem_1fr]"
      >
        <p class="label pt-1 text-primary">
          {{ entry.take }}
        </p>
        <div>
          <h2 class="font-medium text-highlighted">
            {{ entry.title }}
          </h2>
          <pre class="mt-3 overflow-x-auto border border-black/40 bg-tty-bg p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-tty-muted dark:border-white/10">{{ entry.log.join('\n') }}</pre>
        </div>
      </article>

      <NuxtLink
        to="/"
        class="font-mono text-sm text-muted hover:text-highlighted lg:pl-[13rem]"
      >
        ← back to the highlight reel
      </NuxtLink>
    </section>

    <ConfettiOverlay
      :pieces="confetti"
      emoji="🎬"
    />
  </div>
</template>
