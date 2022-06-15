import type { Poetry, User } from "@prisma/client";
import { db } from "~/db.server";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/session.server";

type LoaderData = {
  poetries: (Poetry & {
    user: User;
  })[];
  user: Pick<User, "id" | "name">;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("user")) {
    return redirect("/login");
  }

  const user = JSON.parse(session.get("user") as string);

  const poetries = await db.poetry.findMany({
    include: {
      user: true,
    },
  });

  return {
    poetries,
    user,
  };
};

export default function Index() {
  const { poetries, user } = useLoaderData<LoaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="flex justify-between w-full">
        <p className="py-8">
          Hi <b>{user.name}</b>, here are some poetries for you:
        </p>
        <Link
          to="/poetry/new"
          className="py-2 px-3 bg-teal-800 text-white shadow-md h-fit inline-flex"
        >
          Create poetry
        </Link>
      </div>
      <ul className="flex gap-4 flex-col">
        {poetries.map(
          (poetry) =>
            poetry && (
              <li key={poetry.id} className="border gap-4 flex flex-col p-8">
                <a href={`/poetry/${poetry.id}`}>
                  <span className="text-lg font-bold">{poetry.title}</span>
                </a>
                <span className="text-sm font-medium text-gray-500">
                  {poetry.user.name}
                </span>
                <p>{`${poetry.content.split("\n")[0]}...`}</p>
              </li>
            )
        )}
      </ul>
    </div>
  );
}
