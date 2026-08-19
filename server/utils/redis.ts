import { createClient, type RedisClientType } from 'redis'

const CONNECT_TIMEOUT_MS = 2000

let client: RedisClientType | undefined

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_resolve, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    })
  ])
}

export async function getRedis() {
  if (!client) {
    const instance = createClient({
      url: useRuntimeConfig().redisUrl,
      socket: { connectTimeout: CONNECT_TIMEOUT_MS, reconnectStrategy: false }
    })
    instance.on('error', (error: Error) => console.error('[redis]', error))
    client = instance
  }

  if (!client.isOpen) {
    await withTimeout(client.connect(), CONNECT_TIMEOUT_MS, 'redis connect')
  }

  return client
}

export async function cached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  let redis: RedisClientType | undefined

  try {
    redis = await getRedis()
    const hit = await redis.get(key)
    if (hit) return JSON.parse(hit) as T
  } catch (error) {
    console.error('[cache] read failed, fetching without cache:', error)
    redis = undefined
  }

  const value = await fetcher()

  if (redis) {
    try {
      await redis.set(key, JSON.stringify(value), { EX: ttl })
    } catch (error) {
      console.error('[cache] write failed:', error)
    }
  }

  return value
}
