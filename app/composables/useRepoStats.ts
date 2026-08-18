interface GitHubRepoResponse {
  stargazers_count: number
  open_issues_count: number
  pushed_at: string
}

export interface RepoStats {
  stars: number
  openIssues: number
  lastCommit: string
}

function repoSlug(repoUrl: string) {
  return new URL(repoUrl).pathname.replace(/^\/|\.git$/g, '')
}

export function useRepoStats(repos: { key: string, repo: string }[]) {
  const { data, error } = useAsyncData('repo-stats', async () => {
    const entries = await Promise.all(repos.map(async ({ key, repo }) => {
      try {
        const res = await $fetch<GitHubRepoResponse>(`https://api.github.com/repos/${repoSlug(repo)}`, {
          headers: { Accept: 'application/vnd.github+json' }
        })

        const stats: RepoStats = {
          stars: res.stargazers_count,
          openIssues: res.open_issues_count,
          lastCommit: toRelativeTime(res.pushed_at)
        }

        return [key, stats] as const
      } catch {
        return [key, undefined] as const
      }
    }))

    return Object.fromEntries(entries) as Record<string, RepoStats | undefined>
  })

  return { stats: data, error }
}
