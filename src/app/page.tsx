import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TechStack } from "@/components/tech-stack";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TechStack />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
