<script setup lang="ts">
import type { FeaturedProject } from '~/utils/content'
import type { RepoStats } from '~/composables/useRepoStats'

const props = defineProps<{
  project: FeaturedProject
  index: number
  total: number
  stats?: RepoStats
  tag?: string
}>()

const { status: ciStatus, error: ciError } = useCiStatus(props.project.repo)
</script>

<template>
  <article class="border border-default bg-elevated">
    <header class="flex items-center justify-between border-b border-default px-5 py-2.5">
      <span class="label text-dimmed">{{ tag ?? 'featured' }} · {{ String(index + 1).padStart(2, '0') }}/{{ String(total).padStart(2, '0') }}</span>
      <a
        :href="project.repo"
        target="_blank"
        class="label text-muted transition-colors hover:text-primary"
      >source ↗</a>
    </header>

    <div class="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_17rem]">
      <div class="min-w-0">
        <h3 class="display text-5xl text-highlighted sm:text-6xl">
          <a
            :href="project.repo"
            target="_blank"
            class="transition-colors hover:text-primary"
          >{{ project.name }}</a>
        </h3>
        <p class="mt-4 max-w-2xl text-toned text-pretty">
          {{ project.description }}
        </p>
        <p class="mt-5 font-mono text-xs text-muted">
          {{ project.tech.join(' · ') }}
        </p>
      </div>

      <dl class="grid grid-cols-[auto_1fr] content-start gap-x-5 gap-y-2.5 border-t border-default pt-6 font-mono text-xs lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <dt class="text-dimmed">
          ci
        </dt>
        <dd>
          <CiStatusBadge
            :status="ciStatus"
            :error="ciError"
          />
        </dd>
        <dt class="text-dimmed">
          license
        </dt>
        <dd class="text-toned">
          {{ project.license }}
        </dd>
        <template v-if="stats">
          <dt class="text-dimmed">
            stars
          </dt>
          <dd class="text-toned">
            {{ stats.stars }}
          </dd>
          <dt class="text-dimmed">
            issues
          </dt>
          <dd class="text-toned">
            {{ stats.openIssues }} open
          </dd>
          <dt class="text-dimmed">
            pushed
          </dt>
          <dd class="text-toned">
            {{ stats.lastCommit }}
          </dd>
        </template>
      </dl>
    </div>

    <footer
      v-if="project.compose"
      class="border-t border-default px-5 py-3 sm:px-8"
    >
      <ComposePeek :compose="project.compose" />
    </footer>
  </article>
</template>
