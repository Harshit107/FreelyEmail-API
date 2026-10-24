require("dotenv").config();
const IORedis = require("ioredis");

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  lazyConnect: true, // Don't crash app on boot if Redis is unreachable
};

let redisConnection = null;

const getRedisConnection = () => {
  if (!redisConnection) {
    if (process.env.REDIS_URL) {
      redisConnection = new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
      });
    } else {
      redisConnection = new IORedis(redisConfig);
    }

    redisConnection.on("error", (err) => {
      // Suppress repeated unhandled rejections if Redis is not running locally
      if (err.code === "ECONNREFUSED") {
        // Redis connection refused (local Redis not started)
      } else {
        console.error("[Redis Error]:", err.message);
      }
    });

    redisConnection.on("connect", () => {
      console.log("Connected to Redis server for BullMQ");
    });
  }

  return redisConnection;
};

module.exports = {
  redisConfig,
  getRedisConnection,
};
