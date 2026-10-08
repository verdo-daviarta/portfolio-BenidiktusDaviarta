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
  liveUrls: { label: string; url: string }[];
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
  liveUrls: [],
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
    description:
      "Education and training platforms integrated into a centralized command center.",
    products: [],
    role: "Software Quality Assurance Lead",
    testingScope: [
      "Functional testing",
      "Manual Testing",
      "Automated Testing",
      "UAT testing",
    ],
    approach:
      "Created test strategy, test plan, and test cases for functional and non-functional testing. Executed manual and automated tests using Selenium WebDriver. Collaborated with developers to identify and resolve defects. Conducted UAT testing with stakeholders to ensure requirements were met.",
    technologies: [
      "Selenium WebDriver",
      "Katalon Studio",
      "Postman",
      "REST API",
    ],
    outcome:
      "Identified and documented defects, verified fixes, and completed regression testing for key workflows. The results helped the team evaluate release readiness and prioritize remaining issues.",
    thumbnail: "/projects/command-center/command-center-1.png",
    thumbnailAlt:
      "Command Center application launcher with monitoring, account management, cloud storage, virtual collaboration, and building management options",
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
      "Augmented Reality Learning",
      "Virtual Reality Learning",
      "Learning Management System",
      "E-Exam",
      "Data Archive",
    ],
    role: "Software Quality Assurance Lead",
    thumbnail:
      "/projects/pusdiklat-bela-negara/learning-management/image-1.png",
    thumbnailAlt:
      "Learning Management System dashboard showing learning module summaries, trainee activity, and recent reports",
    testingScope: [
      "Functional testing",
      "Manual Testing",
      "Automated Testing",
      "UAT testing",
      "Unity application testing",
      "Cross-platform testing",
    ],
    approach:
      "Created test strategy, test plan, and test cases for functional and non-functional testing across various platforms. Tested Unity applications. Collaborated with developers to identify and resolve defects. Conducted UAT testing with stakeholders to ensure requirements were met.",

    technologies: [
      "Selenium WebDriver",
      "Katalon Studio",
      "Postman",
      "REST API",
      "Unity",
      "Meta Quest",
    ],
    outcome:
      "Identified and documented defects, verified fixes, and completed regression testing for key workflows. The results helped the team evaluate release readiness and prioritize remaining issues.",

    liveUrls: [
      {
        label: "Learning Management System",
        url: "http://ar-bn-frontend.10.70.0.45.nip.io/login",
      },
      {
        label: "E-Exam",
        url: "http://10.70.0.40:18000/login",
      },
      {
        label: "Data Archive",
        url: "http://data-archive.10.70.0.45.nip.io/",
      },
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
      "Training Language and learning management systems for language education.",
    products: ["Training Language System", "Learning Management System"],
    testingScope: [
      "Functional testing",
      "Manual Testing",
      "Automated Testing",
      "UAT testing",
      "Unity application testing",
      "Cross-platform testing",
    ],
    approach:
      "Created test strategy, test plan, and test cases for functional and non-functional testing across various platforms. Tested Unity applications. Collaborated with developers to identify and resolve defects. Conducted UAT testing with stakeholders to ensure requirements were met.",
    technologies: [
      "Selenium WebDriver",
      "Katalon Studio",
      "Postman",
      "REST API",
      "Unity",
    ],
    thumbnail: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-1.png",
    thumbnailAlt:
      "PUSDIKLAT Bahasa admin dashboard showing language, conversation module, listening question, exam, course, and user summaries",

    outcome:
      "Identified and documented defects, verified fixes, and completed regression testing for key workflows. The results helped the team evaluate release readiness and prioritize remaining issues.",

    liveUrls: [
      {
        label: "Training Language System",
        url: "http://192.168.100.127:11301/admin/dashboard",
      },
    ],
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
    testingScope: [
      "Functional testing",
      "Manual Testing",
      "Automated Testing",
      "UAT testing",
      "Security testing",
      "API testing",
      "Database testing",
    ],
    approach:
      "Created test strategy, test plan, and test cases for functional and non-functional testing across various platforms. Testing API integrations and database connections. Collaborated with developers to identify and resolve defects. Conducted UAT testing with stakeholders to ensure requirements were met.",
    technologies: [
      "Selenium WebDriver",
      "Katalon Studio",
      "Postman",
      "REST API",
      "MySQL",
    ],
    thumbnail: "/projects/pusdiklat-tekfunghan/image-2.jpg",
    thumbnailAlt:
      "PUSDIKLAT Tekfunghan student management dashboard showing training and student summaries with a student count chart",
    outcome:
      "Identified and documented defects, verified fixes, and completed regression testing for key workflows. The results helped the team evaluate release readiness and prioritize remaining issues.",
    liveUrls: [
      {
        label: "Learning Information System",
        url: "https://siswa-tf.kemhan.go.id/",
      },
    ],
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
    testingScope: [
      "Functional testing",
      "Manual Testing",
      "Automated Testing",
      "UAT testing",
      "Security testing",
      "API testing",
      "Database testing",
    ],
    approach:
      "Created test strategy, test plan, and test cases for functional and non-functional testing. Testing database integrations. Collaborated with developers to identify and resolve defects. Conducted UAT testing with stakeholders to ensure requirements were met.",
    technologies: [
      "Selenium WebDriver",
      "Katalon Studio",
      "Postman",
      "REST API",
      "MySQL",
    ],
    outcome:
      "Identified and documented defects, verified fixes, and completed regression testing for key workflows. The results helped the team evaluate release readiness and prioritize remaining issues.",
    thumbnail: "/projects/pusdatin/confidential-cover.svg",
    thumbnailAlt:
      "Illustrated PUSDATIN confidential project cover with a closed folder and a Confidential stamp; no project data is shown",
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
