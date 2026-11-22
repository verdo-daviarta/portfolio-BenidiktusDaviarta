"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { inView } from "motion";
import { animate } from "motion/mini";

const entrances = [
  {
    selector: ".section-heading",
    frames: { opacity: [0.92, 1] },
    duration: 0.22,
  },
  {
    selector: ".project-detail > h1",
    frames: { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] },
    duration: 1.5,
  },
  {
    selector:
      ".hero-grid, .hero-bottom, .professional-context, .stack-table, .project-index, .gallery-filters, .landing-gallery-mobile, .detail-facts, .project-media-layout, .footer, .detail-footer",
    frames: { opacity: [0.92, 1] },
    duration: 1.5,
  },
  {
    selector: ".contact-grid, .detail-section, .detail-description",
    frames: { transform: ["translateY(8px)", "none"] },
    duration: 1.5,
  },
];

export function SectionMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanups: (() => void)[] = [];

    function stop() {
      cleanups.forEach((cleanup) => cleanup());
      cleanups = [];
    }

    function observe() {
      stop();
      if (preference.matches) return;
      for (const { selector, frames, duration } of entrances) {
        cleanups.push(
          inView(selector, (element) => {
            const animation = animate(element, frames, {
              duration,
              ease: [0.22, 1, 0.36, 1],
            });
            cleanups.push(() => animation.cancel());
          }),
        );
      }
    }

    observe();
    preference.addEventListener("change", observe);
    return () => {
      stop();
      preference.removeEventListener("change", observe);
    };
  }, [pathname]);

  return null;
}
