"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export function PageEntrance() {
  const pathname = usePathname();
  const played = useRef(false);

  useEffect(() => {
    if (pathname !== "/portfolio" || played.current) return;
    const hero = document.getElementById("home");
    if (!hero) return;
    const shell = document.querySelector<HTMLElement>(".site-shell");
    if (shell?.dataset.entryRevealed === "true") {
      delete shell.dataset.entryRevealed;
      played.current = true;
      return;
    }
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let context: gsap.Context | undefined;
    const finish = () => context?.revert();

    const frame = requestAnimationFrame(() => {
      played.current = true;
      const sectionLink = location.hash && location.hash !== "#home";
      if (
        preference.matches ||
        sectionLink ||
        hero.getBoundingClientRect().bottom <= 0
      )
        return;
      context = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power2.out" }, onComplete: finish })
          .fromTo(
            "#hero-title",
            { clipPath: "inset(0 0 100% 0)", y: 28 },
            { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.05 },
            0,
          )
          .fromTo(
            ".hero-role, .hero-text-panel > .button",
            { clipPath: "inset(0 0 100% 0)", y: 16 },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              duration: 0.65,
              stagger: 0.08,
            },
            0.28,
          )
          .fromTo(
            ".hero-profile > *",
            { clipPath: "inset(0 0 100% 0)", y: 16 },
            { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.8, stagger: 0.13 },
            0.4,
          )
          .fromTo(
            ".hero-bottom, .professional-context",
            { clipPath: "inset(0 0 100% 0)", y: 12 },
            { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.65, stagger: 0.1 },
            0.8,
          );
      }, hero);
    });

    hero.addEventListener("focusin", finish);
    hero.addEventListener("pointerdown", finish);
    preference.addEventListener("change", finish);
    return () => {
      cancelAnimationFrame(frame);
      finish();
      hero.removeEventListener("focusin", finish);
      hero.removeEventListener("pointerdown", finish);
      preference.removeEventListener("change", finish);
    };
  }, [pathname]);

  return null;
}
