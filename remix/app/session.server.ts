import type { User } from "@prisma/client";
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
  request: Request,
  redirectToLogin = true
): Promise<Pick<User, "id" | "name"> | null> => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("user")) {
    if (redirectToLogin) throw redirect("/login");

    return null;
  }

  return JSON.parse(session.get("user"));
};
