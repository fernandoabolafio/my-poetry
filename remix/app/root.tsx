import type { MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/react/routeModules";
import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {error.message}
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
};

export function CatchBoundary() {
  const caught = useCatch();

  console.log(caught);

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {caught.status}
        {caught.statusText}
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="flex justify-center">
          <div className="max-w-screen-lg p-12 flex flex-col items-center">
            <Link to="/">
              <img src="/logo.png" className="max-h-48" />
            </Link>
            <Outlet />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
