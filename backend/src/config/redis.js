import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    // Force TLS for Upstash to prevent socket closures, even if URL is slightly misconfigured
    tls: REDIS_URL.includes('upstash.io') || REDIS_URL.startsWith('rediss://'),
    rejectUnauthorized: false,
    family: 4, // Force IPv4
    keepAlive: 10000 // Add keepAlive to prevent idle socket closure
  }
});

redisClient.on('connect', () => {
  console.log('🔗 Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis client error:', err);
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready to accept commands');
});

await redisClient.connect();

export default redisClient;
