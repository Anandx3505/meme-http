import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    // If the URL is secure (Upstash), explicitly enforce TLS and IPv4 to prevent socket closures
    tls: REDIS_URL.startsWith('rediss://'),
    rejectUnauthorized: false,
    family: 4 // Force IPv4 to prevent DNS resolution issues on Render/Upstash
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
