export function SectionHeading({
  label,
  title,
  description,
  id,
}: {
  label: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <div>
        <h2 id={id}>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
    </div>
  );
}
