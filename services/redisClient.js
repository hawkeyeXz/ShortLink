import { createClient } from "redis";
import logger from "../utils/logger.js";

const redis = createClient({
  url: process.env.REDIS_URL
});


redis.on('error', (err)=>{
  logger.error("Redis connection error", {error: err.message});
});
await redis.connect()

export default redis;
