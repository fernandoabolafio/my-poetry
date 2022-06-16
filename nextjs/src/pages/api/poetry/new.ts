// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Poetry } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { getUserFromSession } from "../../../session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Poetry | { error: string }>
) {
  const { title, content } = JSON.parse(req.body);

  console.log("oi");

  const user = await getUserFromSession({ req, res });

  if (!user) {
    res
      .status(401)
      .json({ error: "You must be logged in to create a new poetry" });
    return;
  }

  const poetry = await db.poetry.create({
    data: {
      title,
      content,
      userId: user.id,
    },
  });

  res.status(200).json(poetry);
}
