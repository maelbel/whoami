import type { BadgeProps } from '@nuxt/ui/components/Badge.vue'

interface WorkflowRun {
  status: string
  conclusion: string | null
  html_url: string
}

interface WorkflowRunsResponse {
  workflow_runs: WorkflowRun[]
}

export interface CiStatus {
  label: string
  color: BadgeProps['color']
  icon: string
  url: string
}

const CI_STATUS_META: Record<string, Omit<CiStatus, 'url'>> = {
  success: { label: 'CI passing', color: 'success', icon: 'i-lucide-circle-check' },
  failure: { label: 'CI failing', color: 'error', icon: 'i-lucide-circle-x' },
  cancelled: { label: 'CI cancelled', color: 'neutral', icon: 'i-lucide-circle-slash' },
  in_progress: { label: 'CI running', color: 'warning', icon: 'i-lucide-loader-circle' }
}

const CI_STATUS_UNKNOWN: Omit<CiStatus, 'url'> = { label: 'CI unknown', color: 'neutral', icon: 'i-lucide-circle-help' }

function repoSlug(repoUrl: string) {
  return new URL(repoUrl).pathname.replace(/^\/|\.git$/g, '')
}

export function useCiStatus(repoUrl: string, workflow = 'ci.yml') {
  const repo = repoSlug(repoUrl)

  const { data, error } = useFetch<WorkflowRunsResponse>('/api/github', {
    key: `gh-ci-${repo}-${workflow}`,
    server: false,
    query: { path: `/repos/${repo}/actions/workflows/${workflow}/runs?per_page=1`, ttl: 60 }
  })

  const status = computed<CiStatus | undefined>(() => {
    const run = data.value?.workflow_runs?.[0]
    if (!run) return undefined

    const key = run.status === 'completed' ? (run.conclusion ?? 'unknown') : 'in_progress'
    return { ...(CI_STATUS_META[key] ?? CI_STATUS_UNKNOWN), url: run.html_url }
  })

  return { status, error }
}
