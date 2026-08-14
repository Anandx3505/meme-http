/**
 * Rate Limiting Algorithm (Token Bucket via Redis):
 * 1. Initialize a rate limiter with a strict rule: 100 requests per 60 seconds.
 * 2. On every incoming request, use the client's IP address (`req.ip`) as a unique identifier.
 * 3. Attempt to consume 1 point from that IP's bucket in Redis.
 *    - Success: The IP has points remaining. Call `next()` to allow the request to proceed.
 *    - Failure: The IP has exceeded its 100 points. Catch the error and immediately throw a 429 API Error.
 */

import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../config/redis.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const rateLimiterOptions = {
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 100,
  duration: 60,
};

const rateLimiter = new RateLimiterRedis(rateLimiterOptions);

export const rateLimitMiddleware = asyncHandler(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    throw new ApiError(429, 'Too many requests, please slow down');
  }
});
