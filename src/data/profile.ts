export const profile = {
  name: "Benidiktus Daviarta",
  role: "Software Quality Assurance Engineer",
  secondaryRole: "QA Automation Engineer, Manual Tester, Test Analyst",
  location: "Depok, West Java, Indonesia",
  experience: "4+ years",
  education: "Magister Management System Information, Gundarma University",
  email: "benedictusverdoartha@gmail.com",
  linkedin: "https://www.linkedin.com/in/benidiktus-verdo",
  github: "https://github.com/verdo-daviarta",
  description:
    "I am a Software Quality Assurance Engineer specializing in QA Automation and Manual Testing. I look for the paths that fail, turn repeat checks into automation, and work with developers to verify the fixes.",
  context:
    "My work covers enterprise web, desktop, and virtual reality applications, from the first test plan to release checks. I work with developers, analysts, designers, and stakeholders to understand what needs testing and follow defects through to a verified fix.",
};

// Set NEXT_PUBLIC_SITE_URL to the real deployment origin. No domain is invented.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
