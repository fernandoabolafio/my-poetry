import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
import { poetries } from "./poetries";
import { uniqBy } from "lodash";

async function seed() {
  // only run seed on empty db

  await Promise.all(
    uniqBy(poetries, "author").map((poetry) => {
      return db.user.create({
        data: {
          name: poetry.author,
          poetries: {
            create: poetries
              .filter((p) => p.author == poetry.author)
              .map((p) => ({
                title: p.title,
                content: p.lines.join(" \n"),
              })),
          },
        },
      });
    })
  );
}

seed();
