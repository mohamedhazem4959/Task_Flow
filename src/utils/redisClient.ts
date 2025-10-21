import { createClient } from "redis";
import logger from "./logger";
import config from "config";

const redisUrl = config.get<string>("redis_client");

export const redisClient = createClient({
    url: redisUrl,
});

redisClient.on("connect", () => {
    logger.info("🟢 Connected to Redis successfully")
});

redisClient.on("error",(err) => {
    logger.error("🔴 Redis connection error:", err);
});


export async function connectRedis() {
    try {
        await redisClient.connect();
    } catch (err) {
        logger.error("❌ Failed to connect to Redis:", err);
    }
}