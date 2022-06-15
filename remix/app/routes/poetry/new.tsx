import type { LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
// import { db } from "~/db.server";
// import { getUser, logout } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return {};
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
          rows={50}
          cols={100}
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder={`Beside or above me \nNaught is there to go;\nLove or unlove me,\nUnknow me or know,\nI am that which unloves me and loves;\nI am stricken, and I am the blow.`}
        />
      </Form>
    </div>
  );
}
