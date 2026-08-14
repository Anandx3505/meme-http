/**
 * Caching Algorithm (Write-Through Interceptor):
 * 1. Intercept incoming GET requests.
 * 2. Generate a unique cache key based on the request URL.
 * 3. Query Redis for the key.
 *    - Cache HIT: Parse the JSON string from Redis and return it immediately. Stop execution.
 *    - Cache MISS: Temporarily override the Express `res.json` method.
 * 4. Pass execution to the original route controller using `next()`.
 * 5. When the controller calls `res.json(data)`, intercept it:
 *    - Serialize `data` to a JSON string and store it in Redis with an expiration time.
 *    - Invoke the original `res.json` to send the data to the client.
 */

import redisClient from '../config/redis.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const cache = (durationInSeconds) => {
  return asyncHandler(async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = await redisClient.get(key);

    if (cachedResponse) {
      console.log(`⚡ Cache HIT for ${key}`);
      return res.json(JSON.parse(cachedResponse));
    }

    console.log(`🐢 Cache MISS for ${key}`);
    const originalSend = res.json;

    res.json = function (body) {
      redisClient.setEx(key, durationInSeconds, JSON.stringify(body));
      originalSend.call(this, body);
    };

    next();
  });
};
