<script setup lang="ts">
import type { Project } from '~/utils/content'
import type { RepoStats } from '~/composables/useRepoStats'

defineProps<{
  projects: Project[]
  stats?: Record<string, RepoStats | undefined> | null
}>()
</script>

<template>
  <div class="font-mono text-xs">
    <p class="mb-3 text-dimmed">
      <span class="text-primary">$</span> docker ps --all --format "table {{ '{{' }}.Names}}\t{{ '{{' }}.Image}}"
    </p>

    <div class="hidden grid-cols-[10rem_1fr_12rem_5rem] gap-6 border-y border-accented py-2 text-dimmed md:grid">
      <span class="label">name</span>
      <span class="label">description</span>
      <span class="label">stack</span>
      <span class="label text-right">updated</span>
    </div>

    <ul>
      <li
        v-for="project in projects"
        :key="project.name"
        class="border-b border-default"
      >
        <a
          :href="project.repo"
          target="_blank"
          class="group grid gap-x-6 gap-y-1.5 py-4 transition-colors hover:bg-elevated md:grid-cols-[10rem_1fr_12rem_5rem] md:py-3.5"
        >
          <span class="flex items-center gap-2 text-sm font-medium text-highlighted">
            <span class="text-dimmed transition-colors group-hover:text-primary">›</span>
            {{ project.name }}
          </span>
          <span class="font-sans text-sm text-muted">{{ project.description }}</span>
          <span class="text-toned">{{ project.tech.join(', ') }}</span>
          <span class="text-dimmed md:text-right">
            {{ stats?.[project.name]?.lastCommit ?? '—' }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>
