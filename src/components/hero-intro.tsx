"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { Icon } from "./icons";

export function HeroIntro() {
  const [showPortrait, setShowPortrait] = useState(false);
  const nameRef = useRef<HTMLButtonElement>(null);
  const portraitRef = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);

  useEffect(() => {
    if (!interacted.current) return;
    const target = showPortrait ? portraitRef.current : nameRef.current;
    target?.focus({ preventScroll: true });
  }, [showPortrait]);

  function togglePortrait(visible: boolean) {
    interacted.current = true;
    setShowPortrait(visible);
  }

  return (
    <div
      className="hero-intro hero-switch"
      data-view={showPortrait ? "portrait" : "intro"}
    >
      <div
        className="hero-text-panel"
        aria-hidden={showPortrait}
        inert={showPortrait}
      >
        <h1 id="hero-title" aria-label={profile.name}>
          <button
            ref={nameRef}
            type="button"
            className="hero-name-button"
            aria-label="Show portrait of Benidiktus Daviarta"
            aria-controls="hero-portrait-panel"
            aria-expanded={showPortrait}
            title="Show portrait"
            onClick={() => togglePortrait(true)}
          >
            Benidiktus
            <br />
            Daviarta<span className="name-period">.</span>
          </button>
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
      <div
        id="hero-portrait-panel"
        className="hero-portrait-panel"
        aria-hidden={!showPortrait}
        inert={!showPortrait}
      >
        <button
          ref={portraitRef}
          type="button"
          className="hero-portrait-button"
          aria-label="Return to introduction"
          aria-describedby="hero-portrait-slogan"
          title="Return to introduction"
          onClick={() => togglePortrait(false)}
        >
          <span className="hero-portrait-frame">
            <Image
              src="/hero photos.png"
              alt="Portrait of Benidiktus Daviarta"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              loading="eager"
              draggable={false}
              className="hero-portrait-image"
            />
          </span>
          <span id="hero-portrait-slogan" className="hero-portrait-slogan">
            <span>Tested by me, </span>
            <span>trusted by yours.</span>
          </span>
        </button>
      </div>
    </div>
  );
}
