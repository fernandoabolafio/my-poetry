import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/db.server";
import { getUserFromSession } from "~/session.server";
// import { getUser, logout } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  return { user };
};

export const action: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  const formdata = await request.formData();
  const title = formdata.get("title");
  const content = formdata.get("content");

  if (typeof title !== "string") {
    throw new Error("Title is not a string");
  }

  if (typeof content !== "string") {
    throw new Error("Content is not a string");
  }

  if (!user) {
    throw new Error("User is not logged in");
  }

  const poetry = await db.poetry.create({
    data: {
      title,
      content,
      userId: user.id,
    },
  });

  return redirect(`/poetry/${poetry.id}`);
};

export default function NewPoetryPage() {
  return (
    <div className="p-5">
      <Form method="post" className="flex flex-col  gap-4">
        <input
          id="title"
          name="title"
          type="text"
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Hertha"
        />
        <textarea
          id="content"
          name="content"
          rows={25}
          cols={80}
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder={`Beside or above me \nNaught is there to go;\nLove or unlove me,\nUnknow me or know,\nI am that which unloves me and loves;\nI am stricken, and I am the blow.`}
        />
        <button
          type="submit"
          className="py-2 px-3 bg-teal-800 text-white shadow-md h-fit inline-flex w-fit self-end"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
