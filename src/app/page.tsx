import { SpotlightButton } from "@/components/spotlight-button";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <main id="main-content" className="entry-page">
      <h1 className="sr-only">{profile.name} portfolio</h1>
      <SpotlightButton />
    </main>
  );
}
