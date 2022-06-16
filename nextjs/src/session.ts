import { User } from "@prisma/client";
import { getCookie } from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";

export const getUserFromSession = ({
  req,
  res,
}: OptionsType): Pick<User, "id" | "name"> | null => {
  const cookie = getCookie("userSession", { req, res });

  if (!cookie) return null;

  return JSON.parse(cookie as string);
};
