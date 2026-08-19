interface GitHubEvent {
  type: string
  repo: { name: string }
  created_at: string
  payload: {
    commits?: { message: string }[]
  }
}

export interface NowStatus {
  message: string
  repo: string
  time: string
  url: string
}

export function useNowStatus(username: string) {
  const { data, error } = useFetch<GitHubEvent[]>('/api/github', {
    key: `gh-events-${username}`,
    server: false,
    query: { path: `/users/${username}/events/public`, ttl: GITHUB_CACHE_TTL.events }
  })

  const status = computed<NowStatus | undefined>(() => {
    const push = data.value?.find(event => event.type === 'PushEvent' && event.payload.commits?.length)
    const commit = push?.payload.commits?.at(-1)
    if (!push || !commit) return undefined

    return {
      message: commit.message.split('\n')[0]!,
      repo: push.repo.name,
      time: toRelativeTime(push.created_at),
      url: `https://github.com/${push.repo.name}`
    }
  })

  return { status, error }
}
