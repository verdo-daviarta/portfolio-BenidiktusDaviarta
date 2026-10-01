import type { Project } from "./projects";

export type ArtifactType =
  "image" | "video" | "document" | "spreadsheet" | "web" | "repository";
export type GalleryItem = {
  id: string;
  type: ArtifactType;
  title: string;
  description: string;
  year: string | null;
  technologies: string[];
  projectSlug: string | null;
  thumbnail: string | null;
  thumbnailAlt: string;
  source: string | null;
  videoProvider: "file" | "youtube" | "vimeo";
  videoId: string | null;
  captionsSource: string | null;
  projectUrl: string | null;
  repositoryUrl: string | null;
  documentUrl: string | null;
  isPlaceholder: boolean;
};

// These are publishing slots, not claims about completed artifacts.
// Add only reviewed, shareable work. Set isPlaceholder to false when populated.
const emptyArtifact = {
  year: null,
  technologies: [],
  projectSlug: null,
  thumbnail: null,
  thumbnailAlt: "",
  source: null,
  videoProvider: "file" as const,
  videoId: null,
  captionsSource: null,
  projectUrl: null,
  repositoryUrl: null,
  documentUrl: null,
  isPlaceholder: true,
};
export const gallery: GalleryItem[] = [
  {
    ...emptyArtifact,
    id: "command-center-launcher",
    type: "image",
    title: "Command Center · Application launcher",
    description:
      "Application launcher with access to the Command Center systems.",
    projectSlug: "command-center",
    thumbnail: "/projects/command-center/command-center-1.png",
    thumbnailAlt:
      "Command Center application launcher with monitoring, account management, cloud storage, virtual collaboration, and building management options",
    source: "/projects/command-center/command-center-1.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "command-center-monitoring",
    type: "image",
    title: "Command Center · Monitoring system",
    description:
      "Monitoring dashboard with training lists, activity summaries, and a comparison chart.",
    projectSlug: "command-center",
    thumbnail: "/projects/command-center/command-center-2.png",
    thumbnailAlt:
      "Monitoring System dashboard showing active training, yearly training lists, and a bar chart",
    source: "/projects/command-center/command-center-2.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "command-center-account-management",
    type: "image",
    title: "Command Center · Account management",
    description:
      "Account Management System dashboard with an academic calendar summary.",
    projectSlug: "command-center",
    thumbnail: "/projects/command-center/command-center-3.png",
    thumbnailAlt:
      "Account Management System dashboard showing an academic calendar bar chart and account administration menu",
    source: "/projects/command-center/command-center-3.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "command-center-virtual-collaboration",
    type: "image",
    title: "Command Center · Virtual collaboration",
    description:
      "Virtual Collaboration System dashboard with project, task, and notes charts.",
    projectSlug: "command-center",
    thumbnail: "/projects/command-center/command-center-4.png",
    thumbnailAlt:
      "Virtual Collaboration System dashboard showing project and task charts, a notes chart, and a workspace navigation menu",
    source: "/projects/command-center/command-center-4.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "command-center-cloud-storage",
    type: "image",
    title: "Command Center · Cloud storage",
    description:
      "Cloud Storage System file browser with shared folders and a document.",
    projectSlug: "command-center",
    thumbnail: "/projects/command-center/command-center-5.png",
    thumbnailAlt:
      "Cloud Storage System file browser showing folders, a PDF document, and file navigation controls",
    source: "/projects/command-center/command-center-5.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "test-planning",
    type: "spreadsheet",
    title: "Test planning",
    description:
      "A space for a shareable test plan, scenario sheet, or test case preview.",
  },
  {
    ...emptyArtifact,
    id: "automation-demo",
    type: "video",
    title: "Automation demo",
    description:
      "A space for a browser automation recording with a short explanation.",
  },
  {
    ...emptyArtifact,
    id: "qa-documentation",
    type: "document",
    title: "QA documentation",
    description: "A space for a reviewed testing document or API collection.",
  },
  {
    ...emptyArtifact,
    id: "work-screenshot",
    type: "image",
    title: "Work screenshot",
    description:
      "A space for a non-confidential project or testing artifact screenshot.",
  },
  {
    ...emptyArtifact,
    id: "web-project",
    type: "web",
    title: "Web project",
    description: "A space for a small application, prototype, or QA tool.",
  },
  {
    ...emptyArtifact,
    id: "automation-source",
    type: "repository",
    title: "Automation source",
    description:
      "A space for a public repository and its supporting documentation.",
  },
];
export const artifactLabels: Record<ArtifactType, string> = {
  image: "Image",
  video: "Video",
  document: "Document",
  spreadsheet: "Spreadsheet",
  web: "Web project",
  repository: "Repository",
};

// A view record for every project's main image, even before media is supplied.
// It is not added to the published work gallery.
export function getProjectMedia(
  project: Pick<Project, "slug" | "title" | "thumbnail" | "thumbnailAlt">,
): GalleryItem {
  const screenshot = project.thumbnail
    ? gallery.find(
        (item) =>
          item.projectSlug === project.slug &&
          item.type === "image" &&
          (item.source === project.thumbnail ||
            item.thumbnail === project.thumbnail) &&
          !item.isPlaceholder,
      )
    : undefined;
  return (
    screenshot ?? {
      ...emptyArtifact,
      id: `${project.slug}-primary-media`,
      type: "image",
      title: project.title,
      description: project.thumbnail
        ? `${project.title} project screenshot.`
        : "Project media has not been provided yet.",
      projectSlug: project.slug,
      thumbnail: project.thumbnail,
      thumbnailAlt: project.thumbnailAlt,
      source: project.thumbnail,
      isPlaceholder: !project.thumbnail,
    }
  );
}
