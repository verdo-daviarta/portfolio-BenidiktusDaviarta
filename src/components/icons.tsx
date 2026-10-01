import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  name?:
    | "arrow"
    | "external"
    | "check"
    | "copy"
    | "close"
    | "file"
    | "play"
    | "grid"
    | "code"
    | "image";
};
export function Icon({ name = "arrow", ...props }: IconProps) {
  const paths = {
    arrow: (
      <>
        <path d="M4 12h15M13 6l6 6-6 6" />
      </>
    ),
    external: (
      <>
        <path d="M7 17 17 7M7 7h10v10" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="1" />
        <path d="M15 8V4H4v11h4" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    file: (
      <>
        <path d="M14 3H5v18h14V8l-5-5Z" />
        <path d="M14 3v5h5M8 12h8M8 16h6" />
      </>
    ),
    play: <path d="m9 5 10 7-10 7V5Z" />,
    grid: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M4 10h16M4 15h16M10 4v16" />
      </>
    ),
    code: (
      <>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="1" />
        <circle cx="8" cy="9" r="1" />
        <path d="m3 17 5-4 4 3 4-6 5 6" />
      </>
    ),
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
