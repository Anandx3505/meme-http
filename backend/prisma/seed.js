import fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5433/http_meme?schema=public';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const jsonPath = path.join(__dirname, '..', 'status_codes.json');
  const fileContent = await fs.readFile(jsonPath, 'utf8');
  const statusCodes = JSON.parse(fileContent);

  console.log(`Seeding ${statusCodes.length} status codes from status_codes.json...`);

  for (const item of statusCodes) {
    try {
      await prisma.statusCode.upsert({
        where: { code: item.code },
        update: {
          description: item.description,
          imageUrl: item.imageUrl,
        },
        create: {
          code: item.code,
          description: item.description,
          imageUrl: item.imageUrl,
        },
      });
    } catch (error) {
      console.error(`Failed to seed code ${item.code}:`, error.message);
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
