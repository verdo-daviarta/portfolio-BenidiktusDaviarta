"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
const sections = [
  { id: "home", label: "Home" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function Header({ detail = false }: { detail?: boolean }) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (detail) return;
    const elements = sections.map(({ id }) => document.getElementById(id));
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const activationLine = Math.min(window.innerHeight * 0.28, 220);
      let current = "home";
      for (const element of elements) {
        if (element && element.getBoundingClientRect().top <= activationLine) {
          current = element.id;
        }
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {
        current = "contact";
      }
      setActive(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveSection);
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [detail]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href={detail ? "/" : "#home"}
          className="wordmark"
          aria-label="Benidiktus Daviarta, home"
        >
          <span className="monogram">
            bd<span>.</span>
          </span>
          <span className="wordmark-name">
            Benidiktus
            <br />
            Daviarta
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <ul>
            {sections.map(({ id, label }) => (
              <li key={id}>
                <Link
                  href={`${detail ? "/" : ""}#${id}`}
                  aria-current={
                    !detail && active === id ? "location" : undefined
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
