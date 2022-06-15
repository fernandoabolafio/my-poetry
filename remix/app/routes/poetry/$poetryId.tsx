import type { Poetry, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
// import { getUserFromSession } from "~/session.server";

type LoaderData = {
  poetry: Poetry & {
    user: User;
  };
  user?: User;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  // const user = getUserFromSession(request);

  const poetryId = params.poetryId;

  const poetry = await db.poetry.findUnique({
    where: {
      id: poetryId,
    },
    include: {
      user: true,
    },
  });

  if (!poetry) {
    throw new Response("Poetry not found.", {
      status: 404,
    });
  }

  return {
    poetry,
  };
};

export default function PoetryPage() {
  const { poetry } = useLoaderData<LoaderData>();

  const contentFormatted = poetry.content
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  return (
    <div className="flex flex-col gap-5 items-center">
      <h1 className="text-lg ">{poetry.title}</h1>
      <p className="whitespace-pre-wrap border p-4">{contentFormatted}</p>
    </div>
  );
}
