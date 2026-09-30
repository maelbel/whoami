<script setup lang="ts">
const { site } = useAppConfig()

const { status: ciStatus } = useCiStatus(`https://github.com/${site.github.repo}`)
const { status: nowStatus } = useNowStatus(site.github.username)
</script>

<template>
  <dl class="grid grid-cols-2 border-t border-default font-mono text-xs lg:grid-cols-4">
    <div class="flex flex-col gap-1.5 border-r border-b border-default px-4 py-4 lg:border-b-0">
      <dt class="label text-dimmed">
        ci/whoami/status
      </dt>
      <dd class="flex items-center gap-2 text-highlighted">
        <StatusLed :color="ciStatus?.color" />
        {{ ciStatus ? ciStatus.label.replace('CI ', '') : 'waiting…' }}
      </dd>
    </div>
    <div class="flex min-w-0 flex-col gap-1.5 border-b border-default px-4 py-4 lg:border-r lg:border-b-0">
      <dt class="label text-dimmed">
        github/last_push
      </dt>
      <dd class="truncate text-highlighted">
        <a
          v-if="nowStatus"
          :href="nowStatus.url"
          target="_blank"
          class="hover:text-primary"
        >{{ nowStatus.repo.split('/')[1] }} <span class="text-muted">· {{ nowStatus.time }}</span></a>
        <span v-else>—</span>
      </dd>
    </div>
    <div class="flex flex-col gap-1.5 border-r border-default px-4 py-4">
      <dt class="label text-dimmed">
        tz/europe_paris
      </dt>
      <dd class="text-highlighted">
        <LiveClock /> <span class="text-muted">Lyon</span>
      </dd>
    </div>
    <div class="flex flex-col gap-1.5 px-4 py-4">
      <dt class="label text-dimmed">
        hw/homelab
      </dt>
      <dd>
        <NuxtLink
          to="/pi5"
          class="text-highlighted hover:text-primary"
        >
          Pi 5 · 16 GB <span class="text-primary">→ 3D</span>
        </NuxtLink>
      </dd>
    </div>
  </dl>
</template>
