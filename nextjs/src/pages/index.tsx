import { HeartIcon } from "@heroicons/react/solid";
import { Poetry, User } from "@prisma/client";
import { getCookie } from "cookies-next";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { db } from "../db";
import { getUserFromSession } from "../session";

type PageData = {
  poetries: (Poetry & {
    user: User;
    likesCount: number;
    userLiked: boolean;
  })[];
  user: Pick<User, "id" | "name"> | null;
};

export const getServerSideProps: GetServerSideProps<PageData> = async ({
  req,
  res,
}) => {
  const user = getUserFromSession({ req, res });

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
    props: {
      poetries: JSON.parse(
        JSON.stringify(poetriesWithLikes)
      ) as PageData["poetries"],
      user,
    },
  };
};

const Home: NextPage<PageData> = (props) => {
  const { poetries, user } = props;

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-between w-full mb-4 items-center">
        {user ? (
          <p className="py-8">
            Hi <b>{user.name}</b>, here are some poetries for you:
          </p>
        ) : (
          <p className="py-8">Latest poetries:</p>
        )}
        <Link href="/poetry/new">
          <a className="py-2 px-3 bg-teal-800 text-white shadow-md h-fit inline-flex self-end">
            Create poetry
          </a>
        </Link>
      </div>
      <ul className="flex gap-4 flex-col">
        {poetries.map(
          (poetry) =>
            poetry && (
              <li key={poetry.id} className="border gap-4 flex flex-col p-8">
                <div className=" gap-4 flex flex-col p-8">
                  <a href={`/poetry/${poetry.id}`}>
                    <span className="text-lg font-bold">{poetry.title}</span>
                  </a>
                  <span className="text-sm font-medium text-gray-500">
                    {poetry.user.name}
                  </span>
                  <p>{`${poetry.content.split("\n")[0]}...`}</p>
                </div>
                <div className="flex justify-end">
                  <HeartIcon
                    className={`h-8 ${
                      poetry.userLiked ? "text-red-600" : "text-gray-400"
                    } `}
                  />
                </div>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default Home;
