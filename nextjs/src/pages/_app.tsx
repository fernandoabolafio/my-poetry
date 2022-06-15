import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg p-12 flex flex-col items-center">
        <Link href="/">
          <a>
            <img src="/logo.png" className="max-h-48" />
          </a>
        </Link>
        <Component {...pageProps} />{" "}
      </div>{" "}
    </main>
  );
}

export default MyApp;
