export default defineEventHandler(async (event) => {
  const { path, ttl } = getQuery(event) as { path?: string, ttl?: string }

  if (!path || !path.startsWith('/')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing "path" query param' })
  }

  return cached(`gh:${path}`, Number(ttl) || GITHUB_CACHE_TTL.repo, async () => {
    const { githubToken } = useRuntimeConfig()

    return $fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {})
      }
    })
  })
})
