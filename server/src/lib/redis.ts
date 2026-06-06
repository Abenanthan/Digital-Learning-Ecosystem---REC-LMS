/**
 * Redis Client Singleton
 *
 * Provides a shared ioredis instance for refresh-token storage and any
 * future caching needs.  Falls back to a local Redis on port 6379 when
 * REDIS_URL is not set.
 *
 * Exported helpers abstract the refresh-token lifecycle so route handlers
 * never touch raw Redis commands.
 */

import Redis from "ioredis";

// ─── Client ─────────────────────────────────────────────────────────────────

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
  lazyConnect: false,
});

redis.on("connect", () => console.log("✅  Redis connected"));
redis.on("error", (err: Error) =>
  console.error("❌  Redis error:", err.message)
);

// ─── Refresh-Token Helpers ──────────────────────────────────────────────────

/** 7 days in seconds — must match the JWT refresh-token lifetime. */
const REFRESH_TTL = 7 * 24 * 60 * 60; // 604 800 s

/** Redis key convention: `rt:<userId>` */
function rtKey(userId: string): string {
  return `rt:${userId}`;
}

/**
 * Store a refresh token in Redis, keyed by userId.
 * Automatically expires after 7 days.
 */
export async function storeRefreshToken(
  userId: string,
  token: string
): Promise<void> {
  await redis.set(rtKey(userId), token, "EX", REFRESH_TTL);
}

/**
 * Retrieve the stored refresh token for a user.
 * Returns `null` if expired or never set.
 */
export async function getRefreshToken(
  userId: string
): Promise<string | null> {
  return redis.get(rtKey(userId));
}

/**
 * Delete the refresh token for a user (logout / invalidation).
 */
export async function deleteRefreshToken(userId: string): Promise<void> {
  await redis.del(rtKey(userId));
}

export default redis;
