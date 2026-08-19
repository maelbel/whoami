import { createClient, type RedisClientType } from 'redis'

let client: RedisClientType | undefined

export async function getRedis() {
  if (!client) {
    const instance = createClient({ url: useRuntimeConfig().redisUrl })
    instance.on('error', (error: Error) => console.error('[redis]', error))
    client = instance
  }

  if (!client.isOpen) {
    await client.connect()
  }

  return client
}

export async function cached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const redis = await getRedis()

  const hit = await redis.get(key)
  if (hit) {
    return JSON.parse(hit) as T
  }

  const value = await fetcher()
  await redis.set(key, JSON.stringify(value), { EX: ttl })

  return value
}
