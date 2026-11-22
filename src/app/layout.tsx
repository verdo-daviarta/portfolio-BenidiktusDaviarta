import type { Metadata } from "next";
import { profile, siteUrl } from "@/data/profile";
import { SectionMotion } from "@/components/section-motion";
import { AuroraBackground } from "@/components/aurora-background";
import "@fontsource-variable/geist";
import "@fontsource/urbanist/400.css";
import "./globals.css";
const title = `${profile.name} — ${profile.role}`;
const description = `${profile.role} specializing in QA Automation, Software Testing, API Testing, Test Strategy, and Quality Engineering.`;
export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  authors: [{ name: profile.name }],
  keywords: [
    "Software Quality Assurance",
    profile.role,
    "QA Automation",
    profile.name,
    "API Testing",
    "Test Strategy",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: { card: "summary", title, description },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <AuroraBackground />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <SectionMotion />
      </body>
    </html>
  );
}
