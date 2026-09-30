<script setup lang="ts">
import type { AnchorName, ScreenAnchor } from '~/lib/pi-scene'

const { site } = useAppConfig()

const description = 'The Raspberry Pi 5 that runs my home lab, taken apart in 3D as you scroll — case, SoC, memory, NVMe and the Zigbee radio.'

useSeoMeta({
  title: `Pi 5 — ${site.name}`,
  description
})
defineOgImage('Terminal.satori', { title: 'One small box', description })

interface Chapter {
  from: number
  to: number
  side: 'left' | 'right'
  tick: string
  eyebrow: string
  title: string
  body: string
}

const chapters: Chapter[] = [
  {
    from: 0,
    to: 0.12,
    side: 'left',
    tick: 'box',
    eyebrow: 'hw/homelab · node/01',
    title: 'One small box runs all of it.',
    body: 'A Raspberry Pi 5 in an aluminium case. Every self-hosted project, the home lab and the smart home live on this one board. Scroll to take it apart.'
  },
  {
    from: 0.15,
    to: 0.28,
    side: 'right',
    tick: 'case',
    eyebrow: 'case · argon neo',
    title: 'Lid off.',
    body: 'A passively cooled case built for the Pi 5, cut out around every port — including two 5 Gbps USB 3.0 ports and Gigabit Ethernet.'
  },
  {
    from: 0.3,
    to: 0.42,
    side: 'left',
    tick: 'soc',
    eyebrow: 'soc · bcm2712',
    title: 'Four Cortex-A76 cores at 2.4 GHz.',
    body: 'Enough to run the whole stack side by side — Traefik, Home Assistant, Postgres and this site\'s own dev copy.'
  },
  {
    from: 0.44,
    to: 0.55,
    side: 'left',
    tick: 'mem',
    eyebrow: 'mem · lpddr4x',
    title: '16 GB of memory.',
    body: 'The largest Pi 5 there is — so the home lab, the side projects and a hot-reloading dev server never fight over RAM.'
  },
  {
    from: 0.57,
    to: 0.69,
    side: 'right',
    tick: 'disk',
    eyebrow: 'disk · nvme',
    title: 'Boots from NVMe, not an SD card.',
    body: 'A 1 TB drive in the base, on the Pi 5\'s PCIe lane: boot drive and primary storage. A 1 TB external SSD takes the backups.'
  },
  {
    from: 0.74,
    to: 0.86,
    side: 'left',
    tick: 'radio',
    eyebrow: 'radio · zigbee 3.0',
    title: 'Zigbee, in a USB stick.',
    body: 'A SONOFF ZBDongle-E feeds Zigbee2MQTT and Mosquitto, which hand every sensor and lamp over to Home Assistant.'
  },
  {
    from: 0.9,
    to: 1,
    side: 'left',
    tick: 'net',
    eyebrow: 'that\'s the whole datacenter',
    title: 'Reachable from home. Nowhere else.',
    body: 'Only the home network and Tailscale get in, and one Traefik instance routes everything behind them.'
  }
]

const callouts: { anchor: AnchorName, label: string, chapter: number }[] = [
  { anchor: 'usb3', label: '2× USB 3.0', chapter: 1 },
  { anchor: 'eth', label: 'Gigabit Ethernet', chapter: 1 },
  { anchor: 'soc', label: 'BCM2712', chapter: 2 },
  { anchor: 'gpio', label: '40-pin GPIO', chapter: 2 },
  { anchor: 'ram', label: '16 GB LPDDR4X', chapter: 3 },
  { anchor: 'rp1', label: 'RP1 I/O controller', chapter: 3 },
  { anchor: 'nvme', label: '1 TB NVMe', chapter: 4 },
  { anchor: 'dongle', label: 'EFR32MG21 radio', chapter: 5 }
]

const specs = [
  { key: 'board', value: 'Raspberry Pi 5 — 16 GB' },
  { key: 'soc', value: 'Broadcom BCM2712 · 4× Cortex-A76 @ 2.4 GHz' },
  { key: 'memory', value: '16 GB LPDDR4X' },
  { key: 'storage', value: '1 TB NVMe SSD (boot + data) · 1 TB external SSD (backups)' },
  { key: 'case', value: 'Argon NEO, passively cooled' },
  { key: 'radio', value: 'SONOFF ZBDongle-E, Zigbee 3.0' },
  { key: 'os', value: 'Raspberry Pi OS Lite, headless' },
  { key: 'network', value: 'Gigabit Ethernet · Tailscale' }
]

const scroller = ref<HTMLElement>()
const progress = ref(0)
const shown = ref(0)
const anchors = shallowRef<Record<AnchorName, ScreenAnchor>>()
const failed = ref(false)
const ready = ref(false)

function scrollRange() {
  const el = scroller.value
  if (!el) return { start: 0, length: 1 }
  const top = el.getBoundingClientRect().top + window.scrollY
  return { start: top - 48, length: Math.max(1, el.offsetHeight - window.innerHeight + 48) }
}

function updateProgress() {
  const { start, length } = scrollRange()
  progress.value = Math.min(1, Math.max(0, (window.scrollY - start) / length))
}

function onFrame(value: number, nextAnchors: Record<AnchorName, ScreenAnchor>) {
  ready.value = true
  shown.value = value
  anchors.value = nextAnchors
}

function jumpTo(chapter: Chapter) {
  const { start, length } = scrollRange()
  const middle = chapter.from === 0 ? 0 : (chapter.from + chapter.to) / 2
  window.scrollTo({ top: start + middle * length, behavior: 'smooth' })
}

const FADE = 0.025

function visibility(chapter: Chapter, value: number) {
  const fadeIn = chapter.from <= 0 ? 1 : Math.min(1, Math.max(0, (value - chapter.from) / FADE))
  const fadeOut = chapter.to >= 1 ? 1 : Math.min(1, Math.max(0, (chapter.to - value) / FADE))
  return Math.min(fadeIn, fadeOut)
}

const activeChapter = computed(() => {
  let index = 0
  chapters.forEach((chapter, i) => {
    if (shown.value >= chapter.from - FADE) index = i
  })
  return index
})

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<template>
  <div>
    <div
      v-if="!failed"
      ref="scroller"
      class="relative h-[750vh] bg-[#0b0b0a] text-[#ebe7dc]"
    >
      <div class="sticky top-12 h-[calc(100svh-3rem)] overflow-hidden">
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_55%_55%,#23201b_0%,#0b0b0a_70%)]"
          aria-hidden="true"
        />

        <ClientOnly>
          <PiStage
            :progress="progress"
            class="transition-opacity duration-700"
            :class="ready ? 'opacity-100' : 'opacity-0'"
            @frame="onFrame"
            @error="failed = true"
          />
        </ClientOnly>

        <div
          v-if="anchors"
          class="pointer-events-none absolute inset-0 hidden sm:block"
          aria-hidden="true"
        >
          <div
            v-for="callout in callouts"
            :key="callout.anchor"
            class="absolute top-0 left-0"
            :style="{
              transform: `translate(${anchors[callout.anchor].x}px, ${anchors[callout.anchor].y}px)`,
              opacity: anchors[callout.anchor].visible ? visibility(chapters[callout.chapter]!, shown) : 0
            }"
          >
            <span class="absolute -top-1 -left-1 size-2 rounded-full border border-orange-400 bg-[#0b0b0a]" />
            <span class="absolute bottom-1 left-0 h-10 w-px bg-[#ebe7dc]/40" />
            <span class="label absolute bottom-11 left-0 -translate-x-1/2 border border-white/15 bg-[#0b0b0a]/80 px-2 py-1 whitespace-nowrap text-[#ebe7dc]">
              {{ callout.label }}
            </span>
          </div>
        </div>

        <div
          class="pointer-events-none absolute inset-y-0 hidden w-1/2 transition-opacity duration-500 lg:block"
          :class="chapters[activeChapter]!.side === 'right' ? 'right-0 bg-linear-to-l' : 'left-0 bg-linear-to-r'"
          style="--tw-gradient-from: rgb(11 11 10 / 0.85); --tw-gradient-to: transparent; --tw-gradient-stops: var(--tw-gradient-from) 25%, var(--tw-gradient-to)"
          aria-hidden="true"
        />

        <div class="pointer-events-none absolute inset-0">
          <div class="container-site relative h-full">
            <article
              v-for="(chapter, index) in chapters"
              :key="chapter.tick"
              class="absolute inset-x-4 bottom-8 max-w-md sm:inset-x-6 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2"
              :class="chapter.side === 'right' ? 'lg:right-6 lg:left-auto lg:text-right' : 'lg:right-auto'"
              :style="{
                opacity: visibility(chapter, shown),
                transform: `translateY(${(1 - visibility(chapter, shown)) * 16}px)`,
                visibility: visibility(chapter, shown) > 0.01 ? 'visible' : 'hidden'
              }"
              :aria-hidden="activeChapter !== index"
            >
              <div class="bg-[#0b0b0a]/75 p-4 backdrop-blur-sm sm:p-0 sm:bg-transparent sm:backdrop-blur-none">
                <p class="label text-orange-400">
                  {{ chapter.eyebrow }}
                </p>
                <component
                  :is="index === 0 ? 'h1' : 'h2'"
                  class="display mt-4 text-5xl text-balance text-white sm:text-7xl"
                >
                  {{ chapter.title }}
                </component>
                <p class="mt-5 text-[15px] leading-relaxed text-[#b9b4a8] text-pretty sm:text-base">
                  {{ chapter.body }}
                </p>
                <div
                  v-if="index === chapters.length - 1"
                  class="pointer-events-auto mt-7 flex flex-wrap gap-3 font-mono text-sm"
                >
                  <NuxtLink
                    to="/infra"
                    class="bg-[#ebe7dc] px-4 py-2.5 text-[#0b0b0a] transition-colors hover:bg-orange-500 hover:text-white"
                  >
                    cd /infra →
                  </NuxtLink>
                  <NuxtLink
                    to="/uses"
                    class="border border-white/25 px-4 py-2.5 transition-colors hover:border-white"
                  >
                    parts list
                  </NuxtLink>
                </div>
              </div>
            </article>
          </div>
        </div>

        <nav
          class="absolute top-1/2 right-4 hidden -translate-y-1/2 flex-col gap-3 font-mono text-[11px] xl:flex"
          aria-label="Chapters"
        >
          <button
            v-for="(chapter, index) in chapters"
            :key="chapter.tick"
            type="button"
            class="flex cursor-pointer items-center justify-end gap-2 transition-colors"
            :class="activeChapter === index ? 'text-[#ebe7dc]' : 'text-[#ebe7dc]/35 hover:text-[#ebe7dc]/70'"
            @click="jumpTo(chapter)"
          >
            {{ chapter.tick }}
            <span
              class="h-px transition-all"
              :class="activeChapter === index ? 'w-6 bg-orange-400' : 'w-3 bg-current'"
            />
          </button>
        </nav>

        <div
          class="label absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[#ebe7dc]/50 transition-opacity sm:flex"
          :class="shown < 0.02 ? 'opacity-100' : 'opacity-0'"
          aria-hidden="true"
        >
          scroll <span class="animate-bounce">↓</span>
        </div>

        <div
          class="absolute bottom-0 left-0 h-px bg-orange-500"
          :style="{ width: `${shown * 100}%` }"
          aria-hidden="true"
        />
      </div>
    </div>

    <div
      v-else
      class="container-site py-16"
    >
      <p class="label text-dimmed">
        webgl unavailable — here's the story without the model
      </p>
      <article
        v-for="chapter in chapters"
        :key="chapter.tick"
        class="border-b border-default py-10"
      >
        <p class="label text-primary">
          {{ chapter.eyebrow }}
        </p>
        <h2 class="display mt-3 text-5xl text-highlighted">
          {{ chapter.title }}
        </h2>
        <p class="mt-4 max-w-xl text-muted">
          {{ chapter.body }}
        </p>
      </article>
    </div>

    <ModuleSection
      index="spec"
      topic="hw/homelab/spec"
      title="Spec sheet"
      description="The same box, as a table. The model above is hand-built from primitives in three.js — close to the real thing, not to scale."
    >
      <dl class="font-mono text-sm">
        <div
          v-for="spec in specs"
          :key="spec.key"
          class="grid grid-cols-[6rem_1fr] gap-4 border-b border-default py-3.5 sm:grid-cols-[10rem_1fr]"
        >
          <dt class="text-dimmed">
            {{ spec.key }}
          </dt>
          <dd class="text-toned">
            {{ spec.value }}
          </dd>
        </div>
      </dl>

      <div class="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
        <NuxtLink
          to="/uses"
          class="text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 hover:text-primary hover:decoration-current"
        >
          /uses — full parts list →
        </NuxtLink>
        <NuxtLink
          to="/infra"
          class="text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 hover:text-primary hover:decoration-current"
        >
          /infra — how it's routed →
        </NuxtLink>
      </div>
    </ModuleSection>
  </div>
</template>
