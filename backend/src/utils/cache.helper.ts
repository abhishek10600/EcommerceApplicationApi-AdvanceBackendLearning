import redis from "../lib/redis.js";

export const invalidateProductCache = async () => {
  const keys = await redis.keys("products:*");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

export const invalidateCategoryCache = async () => {
  const keys = await redis.keys("categories:*");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
