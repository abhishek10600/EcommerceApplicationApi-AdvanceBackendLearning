import Redis from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../config/env.config.js";

const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (error) => {
  console.log("Redis failed to connect: ", error);
});

export default redis;
