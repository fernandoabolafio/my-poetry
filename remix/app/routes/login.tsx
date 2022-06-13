import { LockClosedIcon } from "@heroicons/react/solid";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { db } from "~/db.server";
import { createUserSession } from "~/session.server";

function validateEmail(email: unknown): email is string {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

  console.log("here?");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  let userId: string | undefined;
  if (intent === "login") {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    userId = user?.id;
  }

  if (intent === "signup") {
    const user = await db.user.create({
      data: {
        email,
        password,
      },
    });

    userId = user.id;
  }

  if (!userId) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export default function LoginPage() {
  const action = useActionData() as ActionData;
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-32 w-auto"
              src="./logo.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <Form className="mt-8 space-y-6" method="post">
            <input type="hidden" name="remember" defaultValue="true" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                {action?.errors?.email && (
                  <p className="text-red-500 text-sm">{action.errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-800 focus:border-indigo-800 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                {action?.errors?.password && (
                  <p className="text-red-500 text-sm">
                    {action.errors.password}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-indigo-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-800"
                name="intent"
                value="login"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Log in
              </button>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-indigo-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-800"
                name="intent"
                value="signup"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                Sign up
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
