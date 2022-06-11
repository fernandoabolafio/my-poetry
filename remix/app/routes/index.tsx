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
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
