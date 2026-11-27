import { gallery } from "./gallery";
import { profile } from "./profile";

export const portfolioSections = [
  {
    slug: "work-gallery",
    title: "Work gallery",
    description: "Test plans, screenshots, automation, and release evidence.",
    preview:
      "Test plans, automation demos, and screenshots from the projects I tested.",
  },
  {
    slug: "certifications",
    title: "Certifications",
    description: "Certificates and credentials.",
    preview: "Certificates will be added here.",
  },
  {
    slug: "education",
    title: "Education",
    description: profile.education,
    preview: profile.education,
  },
  {
    slug: "social-media",
    title: "Social media",
    description: "Find my professional profile and source code.",
    preview: "LinkedIn / GitHub",
  },
] as const;

export const workGalleryPreview = {
  screenshots: ["command-center-launcher", "ems-dashboard"]
    .map((id) => gallery.find((item) => item.id === id)?.thumbnail)
    .filter((thumbnail): thumbnail is string => Boolean(thumbnail)),
  repository: gallery.find((item) => item.id === "automation-source")
    ?.repositoryPreview,
};

export const certifications: {
  title: string;
  issuer: string;
  issued: string;
  image: string | null;
  credentialUrl: string | null;
}[] = [];

export const socialProfiles = [
  { name: "LinkedIn", url: profile.linkedin },
  { name: "GitHub", url: profile.github },
];
