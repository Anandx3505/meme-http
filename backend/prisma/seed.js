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
    "imageUrl": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGlicGc1M3B3aTRzZGFtZ2ZyMGN6MTk2aTVkbGRiem9vOGdoZmkxOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XXdiedv0abxEIZxkQz/giphy.gif"
  },
  {
    "code": 101,
    "description": "Switching Protocols",
    "imageUrl": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm1mbXlsenh2NWQzOXpuZXduNmFxb2pldHNvc2Q3cWluY2lpNWpmdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2i7pL3wA1ARpK/giphy.gif"
  },
  {
    "code": 102,
    "description": "Processing",
    "imageUrl": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXR0M2NqbGp2OTl3dml6ZTBuZnJkYnhlcHp3YXNyd3NhcnV0aXgyMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gIhgev1w5UVjDj25Ul/giphy.gif"
  },
  {
    "code": 103,
    "description": "Early Hints",
    "imageUrl": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTg4dzg2Mng0M25xajAxdndlejA1amIzeDJuNmM2MW10d2RxcTcxcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XCfEnqL6CSekcYJY4m/giphy.gif"
  },
  {
    "code": 200,
    "description": "OK",
    "imageUrl": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRsZWhjZXlnd3hqbTQ3ZTFiOGt5enNiOTU5MHFoanR6eXRxaWJyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a0h7sAqON67nO/giphy.gif"
  },
  {
    "code": 201,
    "description": "Created",
    "imageUrl": ""
  },
  {
    "code": 202,
    "description": "Accepted",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG0yOGdyMjRoeThsYndmaXlqZ2RkbW81M3lmOW44ZHNvdHhydXFxMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/njpterp1OxZOgX7CI4/giphy.gif"
  },
  {
    "code": 204,
    "description": "No Content",
    "imageUrl": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzAzaXlpeW9lMHFvNzR5MzRvMjRydmN1aTJrdXkzNmJmeXUzZTYxdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13d2jHlSlxklVe/giphy.gif"
  },
  {
    "code": 206,
    "description": "Partial Content",
    "imageUrl": ""
  },
  {
    "code": 301,
    "description": "Moved Permanently",
    "imageUrl": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXpqaGp6NXdkcHIxOHRjdHkwemRubG4wdDZlZTRuM2pzODBxbmU4aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YisXb7P5WvQzliihBC/giphy.gif"
  },
  {
    "code": 302,
    "description": "Found",
    "imageUrl": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjU3aXRlNXp4eDQ3MGRldDV4cTN1NHU0bW92b3RobHRmeHdxdnE3diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/elsol3P5Jt2ASsxLva/giphy.gif"
  },
  {
    "code": 304,
    "description": "Not Modified",
    "imageUrl": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDJ0dWJhNnAxa2NhY2Z5cnVjcHRiNjd6cTF6aHBjdTV2Z245ZGVtMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qzSDzDukWLxQWnyB7j/giphy.webp"
  },
  {
    "code": 307,
    "description": "Temporary Redirect",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bHk4ZnV0MGV4ZjRqcjRlaTZwN250dGl4emg1MjEzM2VtMWI5YWo2ayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/k87wlscat2QcWQIqXT/giphy.webp"
  },
  {
    "code": 308,
    "description": "Permanent Redirect",
    "imageUrl": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDY3NDRrcXBmeW44dmZzM2NuNnJ6NGZ0MHlxbnl2bGd0d2FhdnRodSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ddZ2mYhxhh69wEpSVz/giphy.gif"
  },
  {
    "code": 400,
    "description": "Bad Request",
    "imageUrl": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHI1ZGNycXl3cm5nYjhodDhlMW56cTlvYnNucWM5NXM5cWJ5ZjNtZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4meHSobzwZNncjZ7bZ/giphy.webp"
  },
  {
    "code": 401,
    "description": "Unauthorized",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWsydHdmNjMxeWV0MXp2aTkwb2hmMTBhM2Rnc2s5NDBoZGZ3eG9kMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2kRm4LlDGGQlIpzkNk/200.webp"
  },
  {
    "code": 402,
    "description": "Payment Required",
    "imageUrl": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDhzdjlsNWJ3eW50NDZ2eXJnbjFxY3pzb3Zkdnh5djF5aDN4Yzd1NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9HQRIttS5C4Za/200.webp"
  },
  {
    "code": 403,
    "description": "Forbidden",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXN6bDF3dXo0MnA2b2lyNDJoOTI5ZzBzZzAycThiN3dwbHR4d2Y2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41ofhO7rXV9WFECQ/giphy.gif"
  },
  {
    "code": 404,
    "description": "Not Found",
    "imageUrl": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHFwZXlydTVqenF2bXNlOTZ0aDJ5bWxqYzhhb2x5cWNtdnl4dnRsOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/d2jjuAZzDSVLZ5kI/giphy.webp"
  },
  {
    "code": 405,
    "description": "Method Not Allowed",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGs5aGZqam5icHh3czg1NG5semJzMHF1NGdieG5wdnI0NDhjbDN0ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/G2MPcSmq0DZcs/giphy.gif"
  },
  {
    "code": 406,
    "description": "Not Acceptable",
    "imageUrl": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZhbmc3MmE4NXpxajAyeHZqNTVjNHpmMXc1cnRrNml3MmlwcjA2ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5brQzRzT8Pd85WWhFO/giphy.webp"
  },
  {
    "code": 408,
    "description": "Request Timeout",
    "imageUrl": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDB1ZDh0cnF1c29seXN4cHpvc3psM2V0MjI5enhmbXJqb2RxbnE0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oiOR9R8MH1xHuO8dXf/giphy.gif"
  },
  {
    "code": 409,
    "description": "Conflict",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWg0MHcxb293NGd6azBiOXE2MGEwaTRxNzFpY3N5OXhobHVkbngwMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/s7EAoqpqUF8Qg/200.webp"
  },
  {
    "code": 410,
    "description": "Gone",
    "imageUrl": "https://media0.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NThsZ2lwczNyNWdramI2OGR5NDR0ZmxmcnA2MjQ4Y3NseW9kYWt5dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/EW2yotUqGpCnWQI0pF/200.webp"
  },
  {
    "code": 413,
    "description": "Payload Too Large",
    "imageUrl": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm9lNDEwb244bTJubXZrZWJzdGY3bjMybTlucDdwaDNhZXBzam02aSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/M8vBiv9mgpHDGpqL9y/giphy.webp"
  },
  {
    "code": 414,
    "description": "URI Too Long",
    "imageUrl": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDV3OXpjM2F3anczc296Y2V2dGpyOTY0M3Z3dXluOGxubDFrMnU5ayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cx57Bdsxnim7dJ5kkj/giphy.webp"
  },
  {
    "code": 415,
    "description": "Unsupported Media Type",
    "imageUrl": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG1zM2Z2ZzBud2pxc2J0bXkweHA0eXRqMTdydXV3c3c3OTFyOWFzNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8PBuys9pFhbQbd66xC/giphy.gif"
  },
  {
    "code": 418,
    "description": "I'm a Teapot",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHBjdWZsZ3VmcHh1cmhndHphZDg5cGNnZmZ0dHZkOWEzazZucWFzNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GZRs0dT5AtFKlgmndV/giphy.webp"
  },
  {
    "code": 422,
    "description": "Unprocessable Entity",
    "imageUrl": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGhnN3dka2V1bmNoNDltZXh5enE0bWZoeHZwbDluYmFhbHVjN3JuMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Hx5nJBfi8FzFWxztb/giphy.webp"
  },
  {
    "code": 425,
    "description": "Too Early",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWN2OWQ3dmNxbnBnajcxOXFiNTZ4czVlem1oaGtlaWszZTB6NnE4YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LDdl2RYnCl5HknE5Zh/200.webp"
  },
  {
    "code": 429,
    "description": "Too Many Requests",
    "imageUrl": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHZ6cGszNDl5eml1ZGF2NnB2ZWtqOXI0MnV2ZTd1MWU2OHk4NDIxbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qP8y4jojxcT9C/200.webp"
  },
  {
    "code": 451,
    "description": "Unavailable For Legal Reasons",
    "imageUrl": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExamdsdzU3eDZ4cDRmbzE2bGJzNzgxYTBpM3l5dnJhYW1rbXN4cnhmYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/V3yrGcDASx6ifzItQR/200.webp"
  },
  {
    "code": 500,
    "description": "Internal Server Error",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTNyMXljem8wcGYzYm1ieDMxejRramZkMmMzOTAyNWFvZWxoZnJjbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QMHoU66sBXqqLqYvGO/200.webp"
  },
  {
    "code": 501,
    "description": "Not Implemented",
    "imageUrl": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnpydHN0Y2FkNms3NjhoeHduNnNod2V2NmpnbHF5YXczcGJwaWdxaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FQnRcxM79bwVcd14kV/giphy.webp"
  },
  {
    "code": 502,
    "description": "Bad Gateway",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTh6N3pseWdwZGV0M2diMHJieTdkaGJiY2k3dWp5cWNmNGczOGZ4YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/10K9kJqt9Ao15C/200.webp"
  },
  {
    "code": 503,
    "description": "Service Unavailable",
    "imageUrl": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjM2ZHVxc2RiYm1nZnRpaDQ4amxtd3QwdGVnMTY0N2Nib241cDh3OSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3u0BYlfnQiAQfAcbvV/giphy.webp"
  },
  {
    "code": 504,
    "description": "Gateway Timeout",
    "imageUrl": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGxqcnJhaHB0YmYxd3I4MnlpY3JudGhraXp5cXB6aTNqeWdjOTllMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6Zt62PeJeFUDwBUI/giphy.webp"
  },
  {
    "code": 507,
    "description": "Insufficient Storage",
    "imageUrl": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzJ2anp6ejhjb2JuMXRmaWo2cm1ua3hkYTc1OHg0bG04ZXBrZTZsdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/poGLKcqM23BFGknILm/giphy.gif"
  },
  {
    "code": 508,
    "description": "Loop Detected",
    "imageUrl": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzlyaDd4ZmY5Y3pjeXg1Y3p5dWY1cHJ0bzFvcjc4cnYyMmZ0cTNvdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cIrKmnZYjYiOzVTtlA/giphy.webp"
  },
  {
    "code": 511,
    "description": "Network Authentication Required",
    "imageUrl": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjBzdDI0MzN1aDYwMmdvdTgzaHZuanEzdTN3amMxOHdpYng0NXB2ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1094xSp23iiiv6/200.webp"
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
