import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectGallery } from "@/components/project-gallery";
import {
  certifications,
  portfolioSections,
  socialProfiles,
} from "@/data/portfolio-sections";
import { profile } from "@/data/profile";

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return portfolioSections.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const entry = portfolioSections.find(({ slug }) => slug === section);
  if (!entry) notFound();
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: `/portfolio/${entry.slug}` },
  };
}

export default async function PortfolioSection({ params }: Props) {
  const { section } = await params;
  const entry = portfolioSections.find(({ slug }) => slug === section);
  if (!entry) notFound();
  return (
    <>
      <Header detail />
      <main id="main-content" className="container portfolio-section-page">
        <div id="home">
          <Link className="text-link" href="/portfolio#explore">
            Back to portfolio
          </Link>
          {section === "work-gallery" ? (
            <ProjectGallery fullPage />
          ) : (
            <>
              <header className="section-heading portfolio-page-heading">
                <h1>{entry.title}</h1>
                <p className="section-description">{entry.description}</p>
              </header>
              {section === "certifications" &&
                (certifications.length ? (
                  <div className="credential-grid">
                    {certifications.map((certificate) => (
                      <article
                        className="credential-record"
                        key={certificate.title}
                      >
                        {certificate.image && (
                          <Image
                            src={certificate.image}
                            alt={certificate.title}
                            width={800}
                            height={600}
                          />
                        )}
                        <h2>{certificate.title}</h2>
                        <p>{certificate.issuer}</p>
                        <p>{certificate.issued}</p>
                        {certificate.credentialUrl && (
                          <a
                            className="button button-dark"
                            href={certificate.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View credential
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="portfolio-empty">
                    Certificates have not been added yet.
                  </p>
                ))}
              {section === "education" && (
                <article className="education-record">
                  <h2>{profile.education}</h2>
                  <p>{profile.name}</p>
                </article>
              )}
              {section === "social-media" && (
                <div className="social-profile-list">
                  {socialProfiles.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h2>{social.name}</h2>
                      <span>Visit profile</span>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
