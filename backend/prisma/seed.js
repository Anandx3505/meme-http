import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectionString = process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/http_meme?schema=public';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultFallbackGif = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTVudmVndDV0cHRwdnE5Zmx6eHpsbmVldnZrcGhzOHJ1ZzdkMmZsOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g01ZnwAUvutuK8GIQn/giphy.gif';

const statusCodes = [
  {
    "code": 100,
    "description": "Continue",
    "imageUrl": ""
  },
  {
    "code": 101,
    "description": "Switching Protocols",
    "imageUrl": ""
  },
  {
    "code": 102,
    "description": "Processing",
    "imageUrl": ""
  },
  {
    "code": 103,
    "description": "Early Hints",
    "imageUrl": ""
  },
  {
    "code": 200,
    "description": "OK",
    "imageUrl": ""
  },
  {
    "code": 201,
    "description": "Created",
    "imageUrl": ""
  },
  {
    "code": 202,
    "description": "Accepted",
    "imageUrl": ""
  },
  {
    "code": 204,
    "description": "No Content",
    "imageUrl": ""
  },
  {
    "code": 206,
    "description": "Partial Content",
    "imageUrl": ""
  },
  {
    "code": 301,
    "description": "Moved Permanently",
    "imageUrl": ""
  },
  {
    "code": 302,
    "description": "Found",
    "imageUrl": ""
  },
  {
    "code": 304,
    "description": "Not Modified",
    "imageUrl": ""
  },
  {
    "code": 307,
    "description": "Temporary Redirect",
    "imageUrl": ""
  },
  {
    "code": 308,
    "description": "Permanent Redirect",
    "imageUrl": ""
  },
  {
    "code": 400,
    "description": "Bad Request",
    "imageUrl": ""
  },
  {
    "code": 401,
    "description": "Unauthorized",
    "imageUrl": ""
  },
  {
    "code": 402,
    "description": "Payment Required",
    "imageUrl": ""
  },
  {
    "code": 403,
    "description": "Forbidden",
    "imageUrl": ""
  },
  {
    "code": 404,
    "description": "Not Found",
    "imageUrl": ""
  },
  {
    "code": 405,
    "description": "Method Not Allowed",
    "imageUrl": ""
  },
  {
    "code": 406,
    "description": "Not Acceptable",
    "imageUrl": ""
  },
  {
    "code": 408,
    "description": "Request Timeout",
    "imageUrl": ""
  },
  {
    "code": 409,
    "description": "Conflict",
    "imageUrl": ""
  },
  {
    "code": 410,
    "description": "Gone",
    "imageUrl": ""
  },
  {
    "code": 413,
    "description": "Payload Too Large",
    "imageUrl": ""
  },
  {
    "code": 414,
    "description": "URI Too Long",
    "imageUrl": ""
  },
  {
    "code": 415,
    "description": "Unsupported Media Type",
    "imageUrl": ""
  },
  {
    "code": 418,
    "description": "I'm a Teapot",
    "imageUrl": ""
  },
  {
    "code": 422,
    "description": "Unprocessable Entity",
    "imageUrl": ""
  },
  {
    "code": 425,
    "description": "Too Early",
    "imageUrl": ""
  },
  {
    "code": 429,
    "description": "Too Many Requests",
    "imageUrl": ""
  },
  {
    "code": 451,
    "description": "Unavailable For Legal Reasons",
    "imageUrl": ""
  },
  {
    "code": 500,
    "description": "Internal Server Error",
    "imageUrl": ""
  },
  {
    "code": 501,
    "description": "Not Implemented",
    "imageUrl": ""
  },
  {
    "code": 502,
    "description": "Bad Gateway",
    "imageUrl": ""
  },
  {
    "code": 503,
    "description": "Service Unavailable",
    "imageUrl": ""
  },
  {
    "code": 504,
    "description": "Gateway Timeout",
    "imageUrl": ""
  },
  {
    "code": 507,
    "description": "Insufficient Storage",
    "imageUrl": ""
  },
  {
    "code": 508,
    "description": "Loop Detected",
    "imageUrl": ""
  },
  {
    "code": 511,
    "description": "Network Authentication Required",
    "imageUrl": ""
  }
];

async function main() {
  console.log(`Seeding ${statusCodes.length} status codes from status_codes.json...`);
  for (const sc of statusCodes) {
    const finalImageUrl = (sc.imageUrl && sc.imageUrl.trim() !== '') ? sc.imageUrl.trim() : defaultFallbackGif;
    await prisma.statusCode.upsert({
      where: { code: sc.code },
      update: { description: sc.description, imageUrl: finalImageUrl },
      create: {
        code: sc.code,
        description: sc.description,
        imageUrl: finalImageUrl,
      },
    });
  }

  console.log('Database seeding complete! 🚀');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
