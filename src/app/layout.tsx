import type { Metadata } from "next";
import { profile, siteUrl } from "@/data/profile";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";
const title = `${profile.name} — ${profile.role}`;
const description =
  "Software Quality Assurance Lead specializing in QA Automation, Software Testing, API Testing, Test Strategy, and Quality Engineering.";
export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  authors: [{ name: profile.name }],
  keywords: [
    "Software Quality Assurance",
    "QA Lead",
    "QA Automation",
    "Benidiktus Daviarta",
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
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
