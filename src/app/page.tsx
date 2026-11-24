import { EntryApiTest } from "@/components/entry-api-test";
import { portfolioDestination } from "@/lib/entry-test";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const destination = portfolioDestination(
    typeof next === "string" ? next : null,
  );
  return (
    <main id="main-content" className="entry-page">
      <div className="entry-page-content">
        <EntryApiTest destination={destination} />
        <noscript>
          <p>
            Enable JavaScript to send this API request, or use Skip test to
            enter the portfolio.
          </p>
        </noscript>
      </div>
    </main>
  );
}
