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
