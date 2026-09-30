<script setup lang="ts">
import type { RepoStats } from '~/composables/useRepoStats'

defineProps<{
  stats?: RepoStats
}>()
</script>

<template>
  <span
    v-if="stats"
    class="inline-flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted"
  >
    <span title="Stars">★ {{ stats.stars }}</span>
    <span title="Open issues">◌ {{ stats.openIssues }}</span>
    <span title="Last push">↑ {{ stats.lastCommit }}</span>
  </span>
</template>
