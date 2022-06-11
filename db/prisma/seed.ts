import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();


async function seed() {
  // only run seed on empty db
 await db.poetry.create({
    data: {
        title: 'My Poetry',
        content: 'This is a sweet poetry'
    }
 })
}

seed();
