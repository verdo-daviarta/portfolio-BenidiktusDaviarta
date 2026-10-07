import type { Project } from "./projects";

export type ArtifactType =
  "image" | "video" | "document" | "spreadsheet" | "web" | "repository";
export type DocumentExcerpt = {
  heading: string;
  sections: { heading: string; items: string[] }[];
};
export type SpreadsheetExcerpt = {
  heading: string;
  sheetName: string;
  columns: string[];
  rows: string[][];
};
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
  documentPreview?: DocumentExcerpt;
  spreadsheetPreview?: SpreadsheetExcerpt;
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
    id: "bela-negara-lms-dashboard",
    type: "image",
    title: "Learning Management System · Dashboard",
    description:
      "Dashboard with learning module summaries, trainee activity, and recent reports.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail:
      "/projects/pusdiklat-bela-negara/learning-management/image-1.png",
    thumbnailAlt:
      "Learning Management System dashboard showing learning module summaries, trainee activity, and recent reports",
    source: "/projects/pusdiklat-bela-negara/learning-management/image-1.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-lms-modules",
    type: "image",
    title: "Learning Management System · Modules",
    description:
      "Learning module list with submodule links, search, and management actions.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail:
      "/projects/pusdiklat-bela-negara/learning-management/image-2.png",
    thumbnailAlt:
      "Learning Management System module list with search, pagination, and submodule links",
    source: "/projects/pusdiklat-bela-negara/learning-management/image-2.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-ar-marker-scanning",
    type: "image",
    title: "AR Learning · Marker scanning",
    description: "Camera interface for scanning a learning marker or target.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/ar-bn/ar-1.png",
    thumbnailAlt:
      "AR Learning camera interface prompting the user to aim at a marker or target",
    source: "/projects/pusdiklat-bela-negara/ar-bn/ar-1.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-ar-learning-content",
    type: "image",
    title: "AR Learning · Learning content",
    description: "Learning content catalog for the Pancasila module.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/ar-bn/ar-2.png",
    thumbnailAlt:
      "AR Learning content cards and category tabs for the Pancasila module",
    source: "/projects/pusdiklat-bela-negara/ar-bn/ar-2.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-ar-content-preview",
    type: "image",
    title: "AR Learning · Content preview",
    description: "Learning content description dialog with a playback action.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/ar-bn/ar-3.png",
    thumbnailAlt:
      "AR Learning content description dialog displayed over the learning content catalog",
    source: "/projects/pusdiklat-bela-negara/ar-bn/ar-3.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-ar-issue-document",
    type: "document",
    title: "AR_Issue",
    description:
      "Issue documentation from augmented reality checks for the PUSDIKLAT Bela Negara project.",
    projectSlug: "pusdiklat-bela-negara",
    documentUrl:
      "https://docs.google.com/document/d/1HY3UR9OErT7YvaGcMs3tYiWyV2cr2jHf-WLomZ5STB8/edit?usp=sharing",
    // Reviewed excerpt from AR_Issue; this snapshot does not sync with Google Docs.
    documentPreview: {
      heading: "MODUL & SCENARIO Unity Level Design",
      sections: [
        {
          heading: "D1 · SC001 = I-A-1",
          items: [
            "jeda scene 3a ke 4a terlalu lama",
            "clipping di baju npc siswa bagian leher dan lengan, dan tangan siswa clipping ke meja (scene 2a - 4a)",
            "envi sekolah dan bendera tidak double sided (scene 5a-8a)",
          ],
        },
        {
          heading: "SC002",
          items: [
            "jeda antar scene terlalu lama (scene 1a - 5a)",
            "setelah scene 3a ada VO yang tidak sesuai",
            "pita di kaki garuda tidak double sided (scene 2a-5a)",
          ],
        },
      ],
    },
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-admin-dashboard",
    type: "image",
    title: "VR Learning · Admin dashboard",
    description:
      "Desktop VR administration dashboard with module, content, and report summaries.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/admin-panel-1.jpg",
    thumbnailAlt:
      "Desktop VR admin dashboard with module summaries, recent reports, and user activity",
    source: "/projects/pusdiklat-bela-negara/vr-bn/admin-panel-1.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-admin-submodules",
    type: "image",
    title: "VR Learning · Admin submodules",
    description:
      "Desktop VR submodule management with search, filtering, and import controls.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/admin-panel-2.jpg",
    thumbnailAlt:
      "Desktop VR administration submodule list with content counts, search, and import controls",
    source: "/projects/pusdiklat-bela-negara/vr-bn/admin-panel-2.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-classroom-quiz",
    type: "image",
    title: "VR Learning · Classroom quiz",
    description:
      "Virtual classroom quiz with multiple-choice answers and a timer.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/image3.png",
    thumbnailAlt:
      "Virtual classroom quiz displaying multiple-choice answers and a time limit",
    source: "/projects/pusdiklat-bela-negara/vr-bn/image3.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-classroom-character",
    type: "image",
    title: "VR Learning · Classroom character",
    description:
      "Classroom scene with a seated character and interactive learning environment.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/image5.png",
    thumbnailAlt: "Uniformed virtual character seated at a desk in a classroom",
    source: "/projects/pusdiklat-bela-negara/vr-bn/image5.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-training-campus",
    type: "image",
    title: "VR Learning · Training campus",
    description:
      "Outdoor training campus scene with buildings, characters, and the Indonesian flag.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/image6.png",
    thumbnailAlt:
      "Virtual training campus with buildings, outdoor characters, and the Indonesian flag",
    source: "/projects/pusdiklat-bela-negara/vr-bn/image6.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-rendering-issue",
    type: "image",
    title: "VR Learning · Rendering issue",
    description:
      "Captured classroom rendering issue showing displaced furniture.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/image10.png",
    thumbnailAlt:
      "VR classroom screenshot marked ISSUED with displaced desks and chairs",
    source: "/projects/pusdiklat-bela-negara/vr-bn/image10.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-classroom-scene",
    type: "image",
    title: "VR Learning · Classroom scene",
    description:
      "Virtual classroom scene with seated characters and a quiz display.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/image11.png",
    thumbnailAlt:
      "Virtual classroom with seated characters, desks, and a multiple-choice quiz display",
    source: "/projects/pusdiklat-bela-negara/vr-bn/image11.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-character-detail",
    type: "image",
    title: "VR Learning · Character detail",
    description:
      "Close-up view of a seated character in the virtual classroom.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/image12.png",
    thumbnailAlt:
      "Close-up of a uniformed virtual character seated at a classroom desk",
    source: "/projects/pusdiklat-bela-negara/vr-bn/image12.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-logout",
    type: "image",
    title: "VR Learning · Logout confirmation",
    description:
      "Logout confirmation dialog over the VR learning scenario catalog.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/image-16.png",
    thumbnailAlt:
      "Desktop VR scenario catalog with a logout confirmation dialog",
    source: "/projects/pusdiklat-bela-negara/vr-bn/image-16.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-vr-operational-guide",
    type: "image",
    title: "VR Learning · Operational guide",
    description:
      "In-app guide explaining VR learning modes and controller interactions.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/vr-bn/image-17.png",
    thumbnailAlt:
      "VR operational guide with controller diagrams and movement instructions",
    source: "/projects/pusdiklat-bela-negara/vr-bn/image-17.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-e-exam-dashboard",
    type: "image",
    title: "E-Exam · Dashboard",
    description:
      "Examination dashboard with question summaries, exam schedules, and user charts.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail: "/projects/pusdiklat-bela-negara/e-exam/exam-1.jpg",
    thumbnailAlt:
      "E-Exam dashboard showing questions, examination schedules, results, and user charts",
    source: "/projects/pusdiklat-bela-negara/e-exam/exam-1.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-data-archive-dashboard",
    type: "image",
    title: "Data Archive · Dashboard",
    description:
      "Data archive dashboard with file categories, storage summaries, and recent uploads.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail:
      "/projects/pusdiklat-bela-negara/data-archive/data-archive-1.jpg",
    thumbnailAlt:
      "Data Archive dashboard showing file categories, storage usage, and recently uploaded files",
    source: "/projects/pusdiklat-bela-negara/data-archive/data-archive-1.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-data-archive-test-cases",
    type: "spreadsheet",
    title: "Data Archive · Test cases & scenarios",
    description:
      "Test cases and scenarios for the Data Archive admin system, including login and dashboard checks.",
    projectSlug: "pusdiklat-bela-negara",
    documentUrl:
      "https://docs.google.com/spreadsheets/d/1PNT3h3j_aFL7UaqpJPOTVkDDPNO7Xi4v7qiGB7f4LeA/edit?gid=352178411#gid=352178411&range=A1:B1",
    // Approved excerpt from A1:L8 of the linked tab; no live synchronization.
    spreadsheetPreview: {
      heading: "CasesSheet",
      sheetName: "Data Archive System (BN 2025) - Admin",
      columns: ["Case Code", "Title", "Type Testing", "ExpectedResult"],
      rows: [
        [
          "TC - 001",
          "Berhasil login",
          "Positive",
          "Pastikan dapat masuk ke halaman dashboard",
        ],
        [
          "TC - 002",
          "Gagal Login - Salah Password",
          "Negative",
          "Pastikan menampilkan pesan eror",
        ],
        [
          "TC - 003",
          "Gagal Login - Salah Username",
          "Negative",
          "Pastikan menampilkan pesan eror",
        ],
        [
          "TC - 006",
          "Tampilan dashboard",
          "Positive",
          "Pasikan menampilkan summary data fille, user ,server storage dan Latest Uploaded Files",
        ],
      ],
    },
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bela-negara-data-archive-files",
    type: "image",
    title: "Data Archive · My files",
    description: "File management view with folders, search, and file actions.",
    projectSlug: "pusdiklat-bela-negara",
    thumbnail:
      "/projects/pusdiklat-bela-negara/data-archive/data-archive-2.jpg",
    thumbnailAlt:
      "Data Archive My Files view showing folders, a search field, and file management actions",
    source: "/projects/pusdiklat-bela-negara/data-archive/data-archive-2.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-admin-dashboard",
    type: "image",
    title: "Bahasa Admin · Dashboard",
    description:
      "Language learning administration dashboard with module, listening question, exam, course, and user summaries.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-1.png",
    thumbnailAlt:
      "PUSDIKLAT Bahasa admin dashboard showing language, conversation module, listening question, exam, course, and user summaries",
    source: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-1.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-admin-languages",
    type: "image",
    title: "Bahasa Admin · Language catalog",
    description: "Language catalog presented as cards with country flags.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-2.png",
    thumbnailAlt:
      "Language administration catalog showing language cards with country flags",
    source: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-2.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-admin-conversation-modules",
    type: "image",
    title: "Bahasa Admin · Conversation modules",
    description:
      "Conversation module list with language, location, area, and difficulty filters.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-3.png",
    thumbnailAlt:
      "Conversation module administration table with search and language, location, area, and difficulty filters",
    source: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-3.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-admin-listening-question",
    type: "image",
    title: "Bahasa Admin · Listening question",
    description:
      "Listening question detail with answer choices, a video preview, and question settings.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-5.png",
    thumbnailAlt:
      "Listening question administration form showing answer choices, a classroom video preview, and question settings",
    source: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-5.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-admin-exam-reports",
    type: "image",
    title: "Bahasa Admin · Exam reports",
    description: "Examination report list with language and date filters.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-6.png",
    thumbnailAlt:
      "Examination report administration table with language and date filters",
    source: "/projects/pusdiklat-bahasa/admin-panel/admin-panel-6.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-vr-conversation-modes",
    type: "image",
    title: "Bahasa VR · Conversation modes",
    description:
      "Beginner classroom conversation scenario with Exercise and Exam options.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/vr/image-1.png",
    thumbnailAlt:
      "VR classroom conversation selection for Fill the Free Time with Exercise and Exam buttons and two uniformed characters",
    source: "/projects/pusdiklat-bahasa/vr/image-1.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-vr-mandarin-dialogue",
    type: "image",
    title: "Bahasa VR · Mandarin dialogue",
    description:
      "Conversation interface with Mandarin text, Latin transliteration, and a Record Answer control.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/vr/image-10.png",
    thumbnailAlt:
      "VR Mandarin conversation with Chinese text, Latin transliteration, Record Answer control, and uniformed characters",
    source: "/projects/pusdiklat-bahasa/vr/image-10.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-vr-answer-controls",
    type: "image",
    title: "Bahasa VR · Answer controls",
    description:
      "Participant dialogue and recorded answer text with Send Answer and Delete Answer controls.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/vr/image-41.png",
    thumbnailAlt:
      "VR conversation panel showing participant and user answer text, Send Answer and Delete Answer buttons, and two characters",
    source: "/projects/pusdiklat-bahasa/vr/image-41.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-vr-recording-answer",
    type: "image",
    title: "Bahasa VR · Recording an answer",
    description:
      "Voice answer interface captured in the Recording state during a Mandarin conversation.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/vr/image-64.png",
    thumbnailAlt:
      "VR Mandarin conversation panel with participant text, user answer text, and a red Recording indicator",
    source: "/projects/pusdiklat-bahasa/vr/image-64.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-vr-answer-report",
    type: "image",
    title: "Bahasa VR · Answer report",
    description:
      "Conversation report comparing the user answer with the expected answer and displaying assessment feedback.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/vr/image-65.png",
    thumbnailAlt:
      "VR conversation report showing participant text, Your Answer and Right Answer fields, time log, and Incorrect feedback",
    source: "/projects/pusdiklat-bahasa/vr/image-65.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-vr-meeting-room",
    type: "image",
    title: "Bahasa VR · Meeting room scenario",
    description:
      "Intermediate Notable cities conversation in a meeting room with Exercise and Exam options.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/vr/image-67.png",
    thumbnailAlt:
      "VR meeting room with seated characters and the Notable cities conversation selection panel",
    source: "/projects/pusdiklat-bahasa/vr/image-67.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-vr-outdoor-conversation",
    type: "image",
    title: "Bahasa VR · Outdoor conversation",
    description:
      "Advanced Earthquake Disaster language conversation scenario in an outdoor seating area.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/vr/image-72.png",
    thumbnailAlt:
      "VR outdoor seating area with characters and an advanced Earthquake Disaster conversation selection panel",
    source: "/projects/pusdiklat-bahasa/vr/image-72.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "bahasa-vr-scenario-navigation",
    type: "image",
    title: "Bahasa VR · Scenario navigation",
    description:
      "Immersive scenario selection with difficulty labels and a green floor navigation marker.",
    projectSlug: "pusdiklat-bahasa",
    thumbnail: "/projects/pusdiklat-bahasa/vr/image-76.png",
    thumbnailAlt:
      "VR scenario navigation showing Cultural Economic Advantages and Immigration Area labels with a green floor marker",
    source: "/projects/pusdiklat-bahasa/vr/image-76.png",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "tekfunghan-student-dashboard",
    type: "image",
    title: "Tekfunghan · Student management dashboard",
    description:
      "Student management dashboard with training and student summaries and a student count chart.",
    projectSlug: "pusdiklat-tekfunghan",
    thumbnail: "/projects/pusdiklat-tekfunghan/image-2.jpg",
    thumbnailAlt:
      "PUSDIKLAT Tekfunghan student management dashboard showing training and student summaries with a student count chart",
    source: "/projects/pusdiklat-tekfunghan/image-2.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "tekfunghan-student-registration",
    type: "image",
    title: "Tekfunghan · Student registration",
    description:
      "Student information welcome page with campus imagery, student instructions, and an NRP/NIP registration field.",
    projectSlug: "pusdiklat-tekfunghan",
    thumbnail: "/projects/pusdiklat-tekfunghan/image-1.jpg",
    thumbnailAlt:
      "Tekfunghan student information welcome page showing the campus entrance, institutional logos, and an empty NRP/NIP registration field",
    source: "/projects/pusdiklat-tekfunghan/image-1.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "tekfunghan-academic-assessment",
    type: "image",
    title: "Tekfunghan · Academic assessment",
    description:
      "Academic assessment training list with training and year filters, search, status labels, and pagination.",
    projectSlug: "pusdiklat-tekfunghan",
    thumbnail: "/projects/pusdiklat-tekfunghan/image-3.jpg",
    thumbnailAlt:
      "Tekfunghan academic assessment table with training and year filters, cohort search, training status labels, and pagination",
    source: "/projects/pusdiklat-tekfunghan/image-3.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "tekfunghan-alumni-dashboard",
    type: "image",
    title: "Tekfunghan · Alumni management",
    description:
      "Alumni management dashboard showing completed training summaries and a training list.",
    projectSlug: "pusdiklat-tekfunghan",
    thumbnail: "/projects/pusdiklat-tekfunghan/image-4.jpg",
    thumbnailAlt:
      "Tekfunghan alumni management dashboard showing completed training counts and a table of training cohorts, participants, and dates",
    source: "/projects/pusdiklat-tekfunghan/image-4.jpg",
    isPlaceholder: false,
  },
  {
    ...emptyArtifact,
    id: "test-planning",
    type: "spreadsheet",
    title: "Test planning",
    description:
      "A space for a shareable test plan, scenario sheet, or test case preview.",
    // Structure only: no actual test plan or spreadsheet URL has been supplied.
    spreadsheetPreview: {
      heading: "Test planning",
      sheetName: "Template structure · Content pending",
      columns: ["Module", "Scenario", "Priority", "Expected result"],
      rows: [],
    },
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
