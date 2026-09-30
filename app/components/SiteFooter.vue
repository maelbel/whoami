<script setup lang="ts">
const { site } = useAppConfig()

const year = new Date().getFullYear()

const columns = [
  {
    title: 'site',
    links: [
      { label: '/', to: '/' },
      { label: '/infra', to: '/infra' },
      { label: '/uses', to: '/uses' },
      { label: '/pi5', to: '/pi5' },
      { label: '/changelog', to: '/changelog' },
      { label: '/resume', to: '/resume' }
    ]
  },
  {
    title: 'elsewhere',
    links: [
      { label: 'email', to: `mailto:${site.email}` },
      { label: 'github', to: `https://github.com/${site.github.username}`, external: true },
      { label: 'linkedin', to: site.linkedin, external: true },
      { label: 'source', to: `https://github.com/${site.github.repo}`, external: true }
    ]
  }
]
</script>

<template>
  <footer class="border-t border-default print:hidden">
    <div class="container-site grid gap-10 py-12 font-mono text-xs sm:grid-cols-[1fr_auto_auto] sm:gap-16">
      <div class="flex flex-col gap-3">
        <AppLogo />
        <p class="max-w-xs leading-relaxed text-muted">
          Production on Vercel. Dev copy and everything else on a Raspberry Pi 5 in Lyon.
        </p>
        <p class="text-dimmed">
          © {{ year }} {{ site.name }}
        </p>
      </div>

      <div
        v-for="column in columns"
        :key="column.title"
        class="flex flex-col gap-2"
      >
        <span class="label mb-1 text-dimmed">{{ column.title }}</span>
        <NuxtLink
          v-for="link in column.links"
          :key="link.label"
          :to="link.to"
          :target="link.external ? '_blank' : undefined"
          class="text-muted transition-colors hover:text-primary"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
