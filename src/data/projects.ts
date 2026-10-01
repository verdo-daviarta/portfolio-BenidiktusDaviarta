export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string | null;
  category: string;
  description: string;
  products: string[];
  role: string | null;
  testingScope: string[];
  approach: string | null;
  technologies: string[];
  outcome: string | null;
  thumbnail: string | null;
  thumbnailAlt: string;
  liveUrl: string | null;
  repositoryUrl: string | null;
};

const unpublished = {
  role: null,
  testingScope: [],
  approach: null,
  technologies: [],
  outcome: null,
  thumbnail: null,
  thumbnailAlt: "",
  liveUrl: null,
  repositoryUrl: null,
};

export const projects: Project[] = [
  {
    ...unpublished,
    slug: "command-center",
    title: "Command Center",
    client: "BADIKLAT · Ministry of Defense",
    year: "2023",
    category: "Enterprise platform",
    description: "Education and training platforms integrated into a centralized command center.",
    products: [],
    role: "Software Quality Assurance Lead",
    testingScope: ["Functional testing", "Manual Testing", "Automated Testing","UAT testing"],
    approach: "Created test strategy, test plan, and test cases for functional and non-functional testing. Executed manual and automated tests using Selenium WebDriver. Collaborated with developers to identify and resolve defects. Conducted UAT testing with stakeholders to ensure requirements were met.",
    technologies: ["Selenium WebDriver", "Katalon Studio", "Postman", "REST API"],
    outcome: "Identified and documented defects, verified fixes, and completed regression testing for key workflows. The results helped the team evaluate release readiness and prioritize remaining issues.",
    thumbnail: "/projects/command-center/command-center-1.png",
    thumbnailAlt: "Command Center application launcher with monitoring, account management, cloud storage, virtual collaboration, and building management options",
    liveUrl: "https://command-center.kemhan.go.id/",
    repositoryUrl: null,

  },
  {
    ...unpublished,
    slug: "pusdiklat-bela-negara",
    title: "PUSDIKLAT Bela Negara",
    client: "Education & training",
    year: "2023 / 2025",
    category: "Learning platforms",
    description:
      "A collection of education and training products, from learning delivery to examinations and data archiving.",
    products: [
      "Training Information System",
      "Learning Management System",
      "E-Exam",
      "Data Archive",
    ],
  },
  {
    ...unpublished,
    slug: "pusdiklat-bahasa",
    title: "PUSDIKLAT Bahasa",
    client: "Language education & training",
    year: "2023 / 2024",
    category: "Learning platforms",
    description:
      "Training information and learning management systems for language education.",
    products: ["Training Information System", "Learning Management System"],
  },
  {
    ...unpublished,
    slug: "pusdiklat-tekfunghan",
    title: "PUSDIKLAT Tekfunghan",
    client: "Education & training",
    year: "2023–2025",
    category: "Web & kiosk applications",
    description:
      "Distance learning and information access through a learning information system and an information kiosk.",
    products: ["Distance Learning Information System", "Information Kiosk"],
  },
  {
    ...unpublished,
    slug: "pusdatin",
    title: "PUSDATIN",
    client: "Ministry of Defense",
    year: "2023",
    category: "Systems integration",
    description: "Server reintegration between PUSDATIN and BADIKLAT.",
    products: [],
  },
  {
    ...unpublished,
    slug: "virtual-reality",
    title: "Virtual reality applications",
    client: "Learning, simulation & museum experiences",
    year: null,
    category: "Virtual reality",
    description:
      "Professional experience across language learning, disaster management, and a standalone museum VR application.",
    products: [
      "Classat Lugha · Interactive Language Learning VR",
      "Disaster Management VR",
      "Museum Bela Negara VR Standalone",
    ],
  },
];
