import Redis from "ioredis";
import config from "../config/index.js";

const FEED_TTL_SECONDS = 30;

let redis: Redis | null = null;

if (config.redis_url) {
  redis = new Redis(config.redis_url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });

  redis.on("connect", () => console.log("Redis connected."));
  redis.on("error", (err) => {
    console.error("Redis error (falling back to DB):", err.message);
  });
} else {
  console.warn("REDIS_URL not set — feed caching disabled.");
}

export const feedKey = (userId: string, cursor: string, limit: number) =>
  `feed:${userId}:${cursor}:${limit}`;

export const getCache = async (key: string): Promise<string | null> => {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
};

export const setCache = async (key: string, value: string): Promise<void> => {
  if (!redis) return;
  try {
    await redis.setex(key, FEED_TTL_SECONDS, value);
  } catch {
    /* no-op */
  }
};

export const invalidateUserFeed = async (userId: string): Promise<void> => {
  if (!redis) return;
  try {
    const pattern = `feed:${userId}:*`;
    let cursor = "0";

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100,
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch {
    /* no-op */
  }
};

export default redis;
