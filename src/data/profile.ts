export const profile = {
  name: "Benidiktus Daviarta",
  role: "Software Quality Assurance Lead",
  secondaryRole: "QA Automation Engineer",
  location: "Depok, West Java, Indonesia",
  experience: "4+ years",
  email: "benedictusverdoartha@gmail.com",
  linkedin: "https://www.linkedin.com/in/benidiktus-verdo",
  github: "https://github.com/verdo-daviarta",
  description:
    "I work across the software development lifecycle to identify risk, validate behaviour, and automate repetitive verification. My focus is helping teams release reliable software.",
  context:
    "From test strategy to release validation, I lead quality assurance for enterprise web, desktop, and virtual reality applications. I collaborate with developers, business analysts, designers, and stakeholders to make quality part of the process.",
};

// Set NEXT_PUBLIC_SITE_URL to the real deployment origin. No domain is invented.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
