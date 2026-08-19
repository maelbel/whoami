export const GITHUB_CACHE_TTL = {
  ci: 60,
  repo: 3600,
  releases: 3600,
  events: 60
} as const

export function repoSlug(repoUrl: string) {
  return new URL(repoUrl).pathname.replace(/^\/|\.git$/g, '')
}
