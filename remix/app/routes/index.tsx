import type { Poetry, User } from "@prisma/client";
import { db } from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

type LoaderData = {
  poetries: (Poetry & {
    user: User;
  })[];
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const poetries = await db.poetry.findMany({
    include: {
      user: true,
    },
  });

  return {
    poetries,
  };
};

export default function Index() {
  const { poetries } = useLoaderData<LoaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
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
