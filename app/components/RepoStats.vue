<script setup lang="ts">
import type { RepoStats } from '~/composables/useRepoStats'

defineProps<{
  stats?: RepoStats
}>()
</script>

<template>
  <div
    v-if="stats"
    class="flex flex-wrap items-center gap-1.5"
  >
    <UBadge
      color="neutral"
      variant="subtle"
      size="sm"
      icon="i-lucide-star"
    >
      {{ stats.stars }}
    </UBadge>
    <UBadge
      color="neutral"
      variant="subtle"
      size="sm"
      icon="i-lucide-circle-dot"
    >
      {{ stats.openIssues }}
    </UBadge>
    <UBadge
      color="neutral"
      variant="subtle"
      size="sm"
      icon="i-lucide-git-commit-horizontal"
    >
      {{ stats.lastCommit }}
    </UBadge>
  </div>
</template>
