export const entryCookie = {
  name: "portfolio-entry-test",
  value: "passed",
  skipValue: "skipped",
};

export function portfolioDestination(value: string | null | undefined) {
  if (!value || /[\\\r\n]/.test(value)) return "/portfolio";
  const path = value.split(/[?#]/)[0];
  return path === "/portfolio" ||
    path.startsWith("/portfolio/") ||
    path.startsWith("/projects/")
    ? value
    : "/portfolio";
}
