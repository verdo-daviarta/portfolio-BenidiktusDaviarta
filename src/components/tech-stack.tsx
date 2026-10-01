import { techStack } from "@/data/tech-stack";
import { SectionHeading } from "./section-heading";

export function TechStack() {
  return (
    <section
      id="stack"
      className="section container"
      aria-labelledby="stack-heading"
    >
      <SectionHeading
        id="stack-heading"
        label="Tech stack"
        title="The tools behind the testing."
        description="A practical toolkit for verifying behaviour, automating checks, and keeping quality traceable."
      />
      <div className="stack-table">
        {techStack.map((category) => (
          <div className="stack-row" key={category.name}>
            <div className="stack-category">
              <div>
                <h3>{category.name}</h3>
                <p>{category.context}</p>
              </div>
            </div>
            <ul className="tools-list">
              {category.tools.map((tool) => (
                <li key={tool.name} className="tool" tabIndex={0}>
                  <span className="tool-name">{tool.name}</span>
                  <span className="tool-description">{tool.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
