// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from "@prisma/client";
import { setCookies } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username } = JSON.parse(req.body);

  let user: User | null = null;

  user = await db.user.findUnique({
    where: { name: username },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        name: username,
      },
    });
  }

  setCookies("userSession", JSON.stringify({ name: user.name, id: user.id }), {
    req,
    res,
    maxAge: 60 * 60 * 24,
  });

  res.status(200).json({ name: username });
}
