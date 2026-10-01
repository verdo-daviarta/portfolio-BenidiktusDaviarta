export type StackCategory = {
  name: string;
  context: string;
  tools: { name: string; description: string }[];
};
export const techStack: StackCategory[] = [
  {
    name: "Automation",
    context: "Repeatable browser verification",
    tools: [
      { name: "Playwright", description: "End-to-end browser automation" },
      { name: "Cypress", description: "Web application testing" },
      { name: "Selenium WebDriver", description: "Browser automation" },
      {
        name: "Katalon Studio",
        description: "Automated test authoring & execution",
      },
    ],
  },
  {
    name: "API & performance",
    context: "Beyond the interface",
    tools: [
      { name: "Postman", description: "API validation & integration testing" },
      { name: "REST API", description: "Request & response verification" },
      { name: "JMeter", description: "Performance testing" },
    ],
  },
  {
    name: "Development",
    context: "The foundation for automation",
    tools: [
      { name: "Java", description: "Automation programming" },
      { name: "Python", description: "Scripting & automation" },
      { name: "JavaScript", description: "Web scripting" },
      { name: "SQL", description: "Data validation & queries" },
      { name: "HTML", description: "Web document structure" },
      { name: "CSS", description: "Interface styling" },
    ],
  },
  {
    name: "Workflow",
    context: "Traceable, collaborative delivery",
    tools: [
      { name: "Git", description: "Version control" },
      { name: "GitHub", description: "Code collaboration" },
      { name: "Jira", description: "Defect lifecycle & issue tracking" },
      { name: "Azure DevOps", description: "Planning & delivery workflows" },
    ],
  },
  {
    name: "Testing",
    context: "Coverage across the lifecycle",
    tools: [
      { name: "Manual", description: "Hands-on behaviour validation" },
      { name: "Functional", description: "Requirements verification" },
      { name: "Regression", description: "Existing behaviour verification" },
      { name: "Smoke", description: "Critical functionality checks" },
      { name: "Integration", description: "Connected system verification" },
      { name: "API", description: "Service behaviour validation" },
      { name: "UAT", description: "User acceptance testing" },
      { name: "Black box", description: "Input & output validation" },
      { name: "Performance", description: "System response under load" },
    ],
  },
  {
    name: "Process",
    context: "Structured quality practices",
    tools: [
      { name: "Agile Scrum", description: "Iterative delivery" },
      { name: "SDLC", description: "Software development lifecycle" },
      { name: "STLC", description: "Software testing lifecycle" },
      { name: "Waterfall", description: "Sequential delivery" },
    ],
  },
];
