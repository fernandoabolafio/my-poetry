import type { Poetry, User } from "@prisma/client";
import { db } from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
// import { Layout } from "shared/components/Layout";

type LoaderData = {
  poetries: Poetry[];
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const poetries = await db.poetry.findMany();

  return {
    poetries,
  };
};

export default function Index() {
  const { poetries } = useLoaderData<LoaderData>();

  console.log({ poetries });
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {/* <Layout> */}
      <h1 className="text-3xl font-bold underline">My Poetry App</h1>

      <ul>
        {poetries.map(
          (poetry) =>
            poetry && (
              <li key={poetry.id}>
                <a href={`/poetry/${poetry.id}`}>{poetry.title}</a>
              </li>
            )
        )}
      </ul>
      {/* </Layout> */}
    </div>
  );
}
