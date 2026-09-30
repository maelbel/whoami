<script setup lang="ts">
const { site } = useAppConfig()
const route = useRoute()
const activeSection = useActiveSection()

const { status: ciStatus, error: ciError } = useCiStatus(`https://github.com/${site.github.repo}`)

const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))

const sectionLinks = computed(() => [
  { label: 'skills', to: '/#skills', active: route.path === '/' && activeSection.value === 'skills' },
  { label: 'experience', to: '/#experience', active: route.path === '/' && activeSection.value === 'experience' },
  { label: 'projects', to: '/#projects', active: route.path === '/' && activeSection.value === 'projects' },
  { label: 'contact', to: '/#contact', active: route.path === '/' && activeSection.value === 'contact' }
])

const pageLinks = computed(() => [
  { label: 'infra', to: '/infra', active: route.path === '/infra' },
  { label: 'uses', to: '/uses', active: route.path === '/uses' },
  { label: 'pi5', to: '/pi5', active: route.path === '/pi5', hint: '3d' },
  { label: 'changelog', to: '/changelog', active: route.path === '/changelog' }
])

const buildLabel = computed(() => ciStatus.value ? ciStatus.value.label.replace('CI ', '') : (ciError.value ? 'unknown' : 'checking'))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-default bg-default/90 backdrop-blur-sm print:hidden">
    <div class="container-site flex h-12 items-center gap-8">
      <NuxtLink
        to="/"
        aria-label="Home"
      >
        <AppLogo />
      </NuxtLink>

      <nav class="hidden items-center gap-5 font-mono text-xs md:flex">
        <NuxtLink
          v-for="link in sectionLinks"
          :key="link.to"
          :to="link.to"
          class="hidden transition-colors hover:text-highlighted xl:block"
          :class="link.active ? 'text-highlighted' : 'text-muted'"
        >
          <span :class="link.active ? 'text-primary' : 'text-dimmed'">#</span>{{ link.label }}
        </NuxtLink>
        <span
          class="hidden h-3 w-px bg-(--ui-border-accented) xl:block"
          aria-hidden="true"
        />
        <NuxtLink
          v-for="link in pageLinks"
          :key="link.to"
          :to="link.to"
          class="transition-colors hover:text-highlighted"
          :class="link.active ? 'text-highlighted' : 'text-muted'"
        >
          <span :class="link.active ? 'text-primary' : 'text-dimmed'">/</span>{{ link.label }}<sup
            v-if="link.hint"
            class="ml-0.5 text-[9px] text-primary"
          >{{ link.hint }}</sup>
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-4 font-mono text-xs text-muted">
        <a
          :href="ciStatus?.url ?? `https://github.com/${site.github.repo}/actions`"
          target="_blank"
          class="hidden items-center gap-2 hover:text-highlighted sm:flex"
        >
          <StatusLed :color="ciStatus?.color" />
          build:{{ buildLabel }}
        </a>

        <span class="hidden text-dimmed lg:inline">
          LYS <LiveClock class="text-muted" />
        </span>

        <UColorModeButton
          color="neutral"
          variant="ghost"
          size="sm"
        />

        <UButton
          class="md:hidden"
          color="neutral"
          variant="ghost"
          size="sm"
          :icon="menuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          :aria-expanded="menuOpen"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        />
      </div>
    </div>

    <nav
      v-if="menuOpen"
      class="border-t border-default font-mono text-sm md:hidden"
    >
      <div class="container-site grid grid-cols-2 gap-x-6 py-4">
        <div class="flex flex-col gap-2">
          <span class="label text-dimmed mb-1">home</span>
          <NuxtLink
            v-for="link in sectionLinks"
            :key="link.to"
            :to="link.to"
            class="text-muted"
          >
            <span class="text-dimmed">#</span>{{ link.label }}
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-2">
          <span class="label text-dimmed mb-1">pages</span>
          <NuxtLink
            v-for="link in pageLinks"
            :key="link.to"
            :to="link.to"
            :class="link.active ? 'text-highlighted' : 'text-muted'"
          >
            <span class="text-dimmed">/</span>{{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>
