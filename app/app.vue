<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Mael Belliard — Fullstack Developer'
const description = 'Fullstack developer at LM Control, building self-hosted apps with clean CI/CD pipelines — Vue/Nuxt, NestJS/FastAPI, Docker & Traefik.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const links = [
  { label: 'Skills', to: '#skills' },
  { label: 'Experience', to: '#experience' },
  { label: 'Projects', to: '#projects' },
  { label: 'Pipeline', to: '#pipeline' },
  { label: 'Contact', to: '#contact' }
]
</script>

<template>
  <UApp>
    <UHeader :ui="{ root: 'border-b border-default backdrop-blur bg-default/80' }">
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <template #default>
        <UNavigationMenu :items="links" />
      </template>

      <template #right>
        <UBadge
          color="primary"
          variant="subtle"
          icon="i-lucide-circle-check"
          class="hidden sm:flex font-mono"
          size="sm"
        >
          build: passing
        </UBadge>

        <UButton
          to="/changelog"
          icon="i-lucide-history"
          aria-label="Changelog"
          color="neutral"
          variant="ghost"
        />

        <UColorModeButton />

        <UButton
          to="https://github.com/maelbel"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-lucide-git-commit-vertical" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted font-mono">
          $ echo "built with Nuxt UI" • © {{ new Date().getFullYear() }} Mael Belliard
        </p>
      </template>

      <template #right>
        <UButton
          to="mailto:contact@maelbelliard.fr"
          icon="i-lucide-mail"
          aria-label="Email"
          color="neutral"
          variant="ghost"
        />
        <UButton
          to="https://github.com/maelbel"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
