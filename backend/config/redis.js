import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  username: process.env.REDIS_USER || "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number.parseInt(process.env.REDIS_PORT, 10) || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.warn("Redis reconnection failed after 5 attempts. Cache disabled.");
        return new Error("Reconnection failed");
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

let isRedisConnected = false;

redisClient.on("error", (err) => {
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    if (isRedisConnected || !redisClient.isOpen) {
      console.warn("Redis server is not reachable. Caching layer is disabled.");
      isRedisConnected = false;
    }
  } else {
    console.error("Redis Client Error", err);
  }
});

redisClient.on("connect", () => {
  console.log("Redis Client Connecting...");
});

redisClient.on("ready", () => {
  isRedisConnected = true;
  console.log("Redis Client Connected & Ready");
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.warn("Redis connection attempt failed:", error.message);
  }
};

export const getRedisStatus = () => isRedisConnected;

export default redisClient;
