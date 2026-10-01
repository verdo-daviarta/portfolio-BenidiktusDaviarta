import Link from "next/link";
import { Header } from "@/components/header";
export default function NotFound() {
  return (
    <>
      <Header detail />
      <main id="main-content" className="container not-found">
        <p className="eyebrow">404 / Page not found</p>
        <h1>
          This page isn’t
          <br />
          in the test plan.
        </h1>
        <p>
          The address may have changed, or the project hasn’t been published.
        </p>
        <Link href="/" className="button button-dark">
          Return to the portfolio →
        </Link>
      </main>
    </>
  );
}
