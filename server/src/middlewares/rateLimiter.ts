import { redis } from "../redis";
import { Request, Response, NextFunction } from "express";

export function redisRateLimiter({
    maxRequests = 5,
    windowSec = 60,
}) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const ip = req.ip;
        const key = `rate-limit:${ip}`;

        const current = await redis.incr(key);

        if (current === 1) {
            // SET EXPIRY ON FIRST REQUEST
            await redis.expire(key, windowSec);
        }

        if (current > maxRequests) {
            res.status(429).json({ error: "Too many requests" });
            return;
        }
        next();
    }
}