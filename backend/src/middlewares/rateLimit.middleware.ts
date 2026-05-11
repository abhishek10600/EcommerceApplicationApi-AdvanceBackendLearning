import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../lib/redis.js";
import { Request } from "express";
import { getUserById } from "../utils/auth.helper.js";

// ip based fix window rate limiting
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests in 15 minutes
  message: {
    success: false,
    message: "GlobalLimiterMessage: Too many requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "gloabal:",
  }),
});

// ip based fix window rate limiting
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,

  message: {
    success: false,
    message: "AuthLimiterMessage: Too many authentication attempts.",
  },

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "auth:",
  }),
});

// user id based rate limiting
export const userLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,

  // fixed window rate limiting
  //   max: 5,

  // dynamic user rate limiting.
  max: async (req) => {
    const user = await getUserById(req.user.id);

    if (user?.role === "ADMIN") {
      return 6;
    } else if (user?.role === "SELLER") {
      return 5;
    }
    return 4;
  },

  message: {
    success: false,
    message: "UserLimiterMessage: Rate limit exceeded for this account.",
  },

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return (req.user?.id as string) || (req?.ip as string);
  },

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "user:",
  }),
});

// ip based fix window rate limiting
export const productLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,

  message: {
    success: false,
    message: "ProductLimiterMessage: Too many request. Please try again later",
  },

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "product:",
  }),
});
