import type { LoaderFunction } from "@remix-run/node";
import { db } from "~/db.server";
import { getUser, logout } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    return logout(request);
  }

  return {
    user: user,
  };
};

export default function NewPoetryPage() {}
