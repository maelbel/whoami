export default defineEventHandler(async (event) => {
  const { path, ttl } = getQuery(event) as { path?: string, ttl?: string }

  if (!path || !path.startsWith('/')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing "path" query param' })
  }

  const cacheTtl = Number(ttl) || 3600
  const cacheKey = `gh:${path}`

  const redis = await getRedis()
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  const { githubToken } = useRuntimeConfig()
  const data = await $fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {})
    }
  })

  await redis.set(cacheKey, JSON.stringify(data), { EX: cacheTtl })

  return data
})
