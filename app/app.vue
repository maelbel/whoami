<script setup lang="ts">
const { site } = useAppConfig()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = `${site.name} — Fullstack Developer`
const description = 'Fullstack developer at LM Control, building self-hosted apps with clean CI/CD pipelines — Vue/Nuxt, NestJS/FastAPI, Docker & Traefik.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

defineOgImage('Terminal.satori', { title: site.name, description })

const { active: matrixModeActive, toggle: toggleMatrixMode } = useMatrixMode()

const toast = useToast()

useKonamiCode(() => {
  toast.add({
    title: 'Cheat code accepted',
    description: 'Unlocking the blooper reel…',
    icon: 'i-lucide-party-popper',
    color: 'primary'
  })
  navigateTo('/blooper-reel?unlocked=1')
})

if (import.meta.client) {
  console.log('%cLooking for something? Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-weight:bold;color:#EB5517')
}
</script>

<template>
  <UApp>
    <SiteHeader />

    <main>
      <NuxtPage />
    </main>

    <SiteFooter />

    <MatrixRain
      v-if="matrixModeActive"
      @close="toggleMatrixMode"
    />
  </UApp>
</template>
