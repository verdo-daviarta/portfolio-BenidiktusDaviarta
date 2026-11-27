export function SectionHeading({
  title,
  description,
  id,
  headingLevel: Heading = "h2",
}: {
  title: string;
  description?: string;
  id?: string;
  headingLevel?: "h1" | "h2";
}) {
  return (
    <div className="section-heading">
      <Heading id={id}>{title}</Heading>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
