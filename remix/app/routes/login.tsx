import { LockClosedIcon } from "@heroicons/react/solid";
import type { User } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useRef } from "react";
import { db } from "~/db.server";
import { commitSession, getSession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formdata = await request.formData();
  const username = formdata.get("username");

  if (typeof username !== "string") {
    throw new Error("username is not a string");
  }

  let user: User | null = null;

  user = await db.user.findUnique({
    where: { name: username },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        name: username,
      },
    });
  }

  const session = await getSession(request.headers.get("Cookie"));

  session.set("user", JSON.stringify({ id: user.id, name: user.name }));

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function LoginPage() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <Form ref={ref} className="mt-8 space-y-6" method="post">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-indigo-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-800"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
