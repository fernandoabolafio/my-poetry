import { User } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "__session",
      secrets: ["r3m1xr0ck5"],
      sameSite: "lax",
    },
  });

export const getUserFromSession = async (
  request: Request
): Promise<Pick<User, "id" | "name">> => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("user")) {
    throw redirect("/login");
  }

  return JSON.parse(session.get("user"));
};
