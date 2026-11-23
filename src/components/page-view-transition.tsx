"use client";

import { ViewTransition, useRef, type ReactNode } from "react";

export function PageViewTransition({ children }: { children: ReactNode }) {
  const shell = useRef<HTMLDivElement>(null);

  return (
    <ViewTransition
      default="none"
      update={{ "portfolio-enter": "portfolio-enter", default: "none" }}
      onUpdate={(_, types) => {
        if (types.includes("portfolio-enter") && shell.current) {
          shell.current.dataset.entryRevealed = "true";
          return () => {
            shell.current
              ?.querySelector<HTMLButtonElement>(".hero-name-button")
              ?.focus({ preventScroll: true });
          };
        }
      }}
    >
      <div className="site-shell" ref={shell}>
        {children}
      </div>
    </ViewTransition>
  );
}
