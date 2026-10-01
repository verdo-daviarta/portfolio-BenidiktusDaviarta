import { profile } from "@/data/profile";
import { Icon } from "./icons";

export function Hero() {
  return (
    <section id="home" className="hero container" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-intro">
          <h1 id="hero-title">
            Benidiktus
            <br />
            Daviarta<span className="name-period">.</span>
          </h1>
          <p className="hero-role">
            {profile.role}
            <br />
            <span>{profile.secondaryRole}</span>
          </p>
          <a className="button button-dark" href="#projects">
            Explore my work <Icon />
          </a>
        </div>
        <div className="hero-profile">
          <p className="hero-statement">
            Reliable software starts
            <br className="desktop-break" /> with the right questions.
          </p>
          <p className="body-copy">{profile.description}</p>
          <dl className="profile-facts">
            <div>
              <dt>Experience</dt>
              <dd>{profile.experience} in software QA</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Automation & quality engineering</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="hero-bottom">
        <span className="eyebrow">From strategy to release</span>
        <p>
          Test planning <span>/</span> Automation <span>/</span> API validation{" "}
          <span>/</span> Defect management
        </p>
      </div>
      <div className="professional-context">
        <span className="eyebrow">Quality across the lifecycle</span>
        <p>{profile.context}</p>
      </div>
    </section>
  );
}
