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

const route = useRoute()
const activeSection = useActiveSection()

const navLinks = computed(() => [
  { label: 'Home', to: '/', active: route.path === '/' && !activeSection.value },
  { label: 'Skills', to: '/#skills', active: activeSection.value === 'skills' },
  { label: 'Experience', to: '/#experience', active: activeSection.value === 'experience' },
  { label: 'Projects', to: '/#projects', active: activeSection.value === 'projects' },
  { label: 'Pipeline', to: '/#pipeline', active: activeSection.value === 'pipeline' },
  { label: 'Contact', to: '/#contact', active: activeSection.value === 'contact' },
  {
    label: 'More',
    active: route.path === '/changelog' || route.path === '/infra',
    children: [
      {
        label: 'Changelog',
        description: 'Every shipped release, straight from GitHub.',
        to: '/changelog',
        icon: 'i-lucide-history',
        active: route.path === '/changelog'
      },
      {
        label: 'Infrastructure',
        description: 'How this site and my self-hosted projects actually run.',
        to: '/infra',
        icon: 'i-lucide-server',
        active: route.path === '/infra'
      }
    ]
  }
])

const socialLinks = [
  { to: `mailto:${site.email}`, icon: 'i-lucide-mail', label: 'Email' },
  { to: `https://github.com/${site.github.username}`, icon: 'i-simple-icons-github', label: 'GitHub', external: true }
]

const headerSocialLinks = socialLinks.filter(link => link.label !== 'Email')
</script>

<template>
  <UApp>
    <UHeader :ui="{ root: 'print:hidden border-b border-default backdrop-blur bg-default/80' }">
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

        <UTooltip text="Toggle theme">
          <UColorModeButton />
        </UTooltip>

        <UTooltip
          v-for="link in headerSocialLinks"
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

    <USeparator
      icon="i-lucide-git-commit-vertical"
      class="print:hidden"
    />

    <UFooter :ui="{ root: 'print:hidden' }">
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
