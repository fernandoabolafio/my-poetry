import type { Poetry } from "~/db.server";
import { db } from "~/db.server";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  poetries: Poetry[];
};

export async function loader() {
  const poetries = await db.poetry.findMany();

  return {
    poetries,
  };
}

export default function Index() {
  const { poetries } = useLoaderData<LoaderData>();

  console.log({ poetries });
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Poetry App</h1>
      <ul>
        {poetries.map((poetry) => (
          <li key={poetry.id}>
            <a href={`/poetry/${poetry.id}`}>{poetry.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
