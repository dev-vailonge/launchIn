import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis environment variables')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Helper functions for common Redis operations
export async function setWithExpiry<T>(key: string, value: T, expirySeconds: number) {
  return redis.set(key, JSON.stringify(value), { ex: expirySeconds })
}

export async function getJson<T>(key: string): Promise<T | null> {
  const value = await redis.get(key)
  if (!value) return null
  return JSON.parse(value as string) as T
}

export async function increment(key: string, expirySeconds?: number) {
  const value = await redis.incr(key)
  if (expirySeconds && value === 1) {
    await redis.expire(key, expirySeconds)
  }
  return value
}

export async function deleteKey(key: string) {
  return redis.del(key)
} 