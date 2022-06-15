import type { Poetry, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { db } from "../../db";

type PageData = {
  poetry: Poetry & {
    user: User;
  };
  user?: User;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // const user = getUserFromSession(request);

  const poetryId = query.poetryId;

  if (!poetryId || typeof poetryId !== "string") {
    throw new Error("Invalid Poetry Id");
  }

  const poetry = await db.poetry.findUnique({
    where: {
      id: poetryId,
    },
    include: {
      user: true,
    },
  });

  if (!poetry) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      poetry: JSON.parse(JSON.stringify(poetry)),
    },
  };
};

export default function PoetryPage({ poetry }: PageData) {
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
