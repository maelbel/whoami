<script setup lang="ts">
const { site } = useAppConfig()

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

const title = `${site.name} — Fullstack Developer`
const description = 'Fullstack developer at LM Control, building self-hosted apps with clean CI/CD pipelines — Vue/Nuxt, NestJS/FastAPI, Docker & Traefik.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const navLinks = [
  { label: 'Skills', to: '/#skills' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Pipeline', to: '/#pipeline' },
  { label: 'Contact', to: '/#contact' }
]

const socialLinks = [
  { to: `mailto:${site.email}`, icon: 'i-lucide-mail', label: 'Email' },
  { to: `https://github.com/${site.github.username}`, icon: 'i-simple-icons-github', label: 'GitHub', external: true }
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
        <UNavigationMenu :items="navLinks" />
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

        <UTooltip text="Changelog">
          <UButton
            to="/changelog"
            icon="i-lucide-history"
            aria-label="Changelog"
            color="neutral"
            variant="ghost"
          />
        </UTooltip>

        <UTooltip text="Toggle theme">
          <UColorModeButton />
        </UTooltip>

        <UTooltip
          v-for="link in socialLinks"
          :key="link.label"
          :text="link.label"
        >
          <UButton
            :to="link.to"
            :target="link.external ? '_blank' : undefined"
            :icon="link.icon"
            :aria-label="link.label"
            color="neutral"
            variant="ghost"
          />
        </UTooltip>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-lucide-git-commit-vertical" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted font-mono">
          $ echo "built with Nuxt UI" • © {{ new Date().getFullYear() }} {{ site.name }}
        </p>
      </template>

      <template #right>
        <UTooltip
          v-for="link in socialLinks"
          :key="link.label"
          :text="link.label"
        >
          <UButton
            :to="link.to"
            :target="link.external ? '_blank' : undefined"
            :icon="link.icon"
            :aria-label="link.label"
            color="neutral"
            variant="ghost"
          />
        </UTooltip>
      </template>
    </UFooter>
  </UApp>
</template>
