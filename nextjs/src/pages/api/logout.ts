// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { removeCookies, setCookies } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  removeCookies("userSession", { req, res });

  res.redirect("/login");
}
