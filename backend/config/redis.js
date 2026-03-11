import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        // Stop retrying after 5 attempts to avoid log spamming
        // Returning false will stop the client from trying to reconnect
        console.warn("Redis reconnection failed after 5 attempts. Cache disabled.");
        return false;
      }
      return Math.min(retries * 100, 3000); // Backoff strategy
    }
  }
});

let isRedisConnected = false;

redisClient.on("error", (err) => {
  if (err.code === 'ECONNREFUSED') {
    // Only log once to avoid spamming the console
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
    // Silent fail since we handle it in 'error' event
  }
};

export const getRedisStatus = () => isRedisConnected;

export default redisClient;
