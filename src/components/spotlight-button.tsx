"use client";

import Link from "next/link";
import type { PointerEvent } from "react";

// Adapted from https://www.hover.dev/components/buttons#spotlight-button.
export function SpotlightButton() {
  function moveSpotlight(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") return;
    const link = event.currentTarget;
    const bounds = link.getBoundingClientRect();
    link.style.setProperty(
      "--spotlight-x",
      `${((event.clientX - bounds.left) / bounds.width) * 100}%`,
    );
  }

  return (
    <Link
      href="/portfolio"
      transitionTypes={["portfolio-enter"]}
      className="spotlight-button"
      onPointerMove={moveSpotlight}
      onPointerLeave={(event) =>
        event.currentTarget.style.removeProperty("--spotlight-x")
      }
    >
      <span className="spotlight-label">Let&apos;s Test!</span>
      <span className="spotlight-circle" aria-hidden="true" />
    </Link>
  );
}
