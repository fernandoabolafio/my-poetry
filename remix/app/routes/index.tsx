import type { Poetry, User } from "@prisma/client";
import { db } from "~/db.server";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { getUserFromSession } from "~/session.server";
import { HeartIcon } from "@heroicons/react/solid";

type LoaderData = {
  poetries: (Poetry & {
    user: User;
    likesCount: number;
    userLiked: boolean;
  })[];
  user: Pick<User, "id" | "name"> | null;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await getUserFromSession(request, false);

  const poetries = await db.poetry.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  const poetriesWithLikes = poetries.map(({ _count, likes, ...p }) => ({
    ...p,
    likesCount: _count.likes,
    userLiked: likes.some((l) => l.userId === user?.id),
  }));

  return {
    poetries: poetriesWithLikes,
    user,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  // get intent from form data
  const formdata = await request.formData();
  const intent = formdata.get("intent");

  if (intent === "like" && user) {
    const poetryId = formdata.get("poetryId");

    if (typeof poetryId !== "string")
      throw new Error("PoetryId is not a string");

    const alreadyLiked = await db.like.findFirst({
      where: {
        userId: user.id,
        poetryId,
      },
    });

    if (!alreadyLiked) {
      await db.like.create({
        data: {
          userId: user.id,
          poetryId,
        },
      });
    } else {
      await db.like.delete({
        where: {
          id: alreadyLiked.id,
        },
      });
    }
  }
  // like poetry

  return {};
};

export default function Index() {
  const { poetries, user } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="flex justify-between w-full items-center">
        {user ? (
          <p className="py-8">
            Hi <b>{user.name}</b>, here are some poetries for you:
          </p>
        ) : (
          <p className="py-8">Latest poetries:</p>
        )}
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
              <li
                key={poetry.id}
                className="border flex justify-between items-center p-8"
              >
                <div className="gap-4 flex flex-col">
                  <a href={`/poetry/${poetry.id}`}>
                    <span className="text-lg font-bold">{poetry.title}</span>
                  </a>
                  <span className="text-sm font-medium text-gray-500">
                    {poetry.user.name}
                  </span>
                  <p>{`${poetry.content.split("\n")[0]}...`}</p>
                </div>
                <fetcher.Form method="post">
                  <input type="hidden" id="intent" name="intent" value="like" />
                  <input
                    type="hidden"
                    id="poetryId"
                    name="poetryId"
                    value={poetry.id}
                  />
                  <button className="flex justify-end" type="submit">
                    <HeartIcon
                      className={`h-8 ${
                        poetry.userLiked ? "text-red-600" : "text-gray-400"
                      } `}
                    />
                  </button>
                </fetcher.Form>
              </li>
            )
        )}
      </ul>
    </div>
  );
}
