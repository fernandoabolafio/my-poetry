import { User } from "@prisma/client";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export const getUserFromSession = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Pick<User, "id" | "name">> => {
  const cookie = getCookie("userSession", { req, res });

  return JSON.parse((cookie || "{}") as string);
};
