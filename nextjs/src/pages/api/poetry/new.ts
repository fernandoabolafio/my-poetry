// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Poetry } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { getUserFromSession } from "../../../session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Poetry>
) {
  const { title, content } = JSON.parse(req.body);

  console.log("oi");

  const user = await getUserFromSession({ req, res });

  const poetry = await db.poetry.create({
    data: {
      title,
      content,
      userId: user.id,
    },
  });

  res.status(200).json(poetry);
}
