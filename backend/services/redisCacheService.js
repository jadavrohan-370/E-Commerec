import redisClient, { getRedisStatus } from "../config/redis.js";

export const getFromCache = async (key) => {
  if (!getRedisStatus()) return null;
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis Get Error:", error);
    return null;
  }
};

export const setInCache = async (key, value, expiration = 3600) => {
  if (!getRedisStatus()) return;

  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expiration,
    });
  } catch (error) {
    console.error("Redis Set Error:", error);
  }
};

export const deleteFromCache = async (key) => {
  if (!getRedisStatus()) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis Del Error:", error);
  }
};
