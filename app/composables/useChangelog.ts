interface GitHubRelease {
  tag_name: string
  html_url: string
  published_at: string
  body: string | null
}

export interface ChangelogEntry {
  version: string
  date: string
  url: string
  badge?: { label: string, color: 'primary' }
  markdown: string
}

function linkifyReleaseNotes(body: string) {
  return body
    .replace(/^Deployed to (\S+)/m, '**Deployed to:** [$1]($1)')
    .replace(/\*\*Full Changelog\*\*: (\S+)/, '**Full Changelog**: [$1]($1)')
}

function toChangelogEntry(release: GitHubRelease, isLatest: boolean): ChangelogEntry {
  return {
    version: release.tag_name,
    date: new Date(release.published_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }),
    url: release.html_url,
    badge: isLatest ? { label: 'Latest', color: 'primary' } : undefined,
    markdown: linkifyReleaseNotes(release.body ?? '')
  }
}

export async function useChangelog() {
  const { site } = useAppConfig()

  const { data: releases, error } = await useFetch<GitHubRelease[]>(`https://api.github.com/repos/${site.github.repo}/releases`, {
    key: 'gh-releases',
    headers: { Accept: 'application/vnd.github+json' }
  })

  const entries = computed<ChangelogEntry[]>(() => {
    const byNewestFirst = [...(releases.value ?? [])]
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

    return byNewestFirst.map((release, index) => toChangelogEntry(release, index === 0))
  })

  return { entries, error }
}
