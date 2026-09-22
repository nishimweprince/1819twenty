/**
 * Line icons for the promise and why-join rows. Same convention as the social
 * marks in site-shell: a 24-grid, currentColor, decorative by default. Color
 * is set by the parent — terracotta on paper, paper on a terracotta disc.
 */
export type BrandIconName =
  "globe" | "diamond" | "bag" | "sun" | "people" | "leaf";

const paths: Record<BrandIconName, React.ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 2.6 4.2 5.6 4.2 9s-1.4 6.4-4.2 9c-2.8-2.6-4.2-5.6-4.2-9S9.2 5.6 12 3z" />
    </>
  ),
  diamond: (
    <>
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" />
      <path d="M12 7.5 16.5 12 12 16.5 7.5 12Z" />
      <path d="M12 10.5 13.5 12 12 13.5 10.5 12Z" fill="currentColor" />
    </>
  ),
  bag: (
    <>
      <path d="M4.5 8.5h15l-1 12h-13z" />
      <path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  people: (
    <>
      <circle cx="12" cy="8" r="3" />
      <circle cx="5.5" cy="10" r="2.2" />
      <circle cx="18.5" cy="10" r="2.2" />
      <path d="M6.5 20a5.5 5.5 0 0 1 11 0M2 18.5a3.5 3.5 0 0 1 4.5-3.4M22 18.5a3.5 3.5 0 0 0-4.5-3.4" />
    </>
  ),
  leaf: (
    <>
      <path d="M19.5 4.5c-8 0-14 5-14 12.5a2.5 2.5 0 0 0 2.5 2.5C15.5 19.5 20 13 19.5 4.5z" />
      <path d="M5.5 19.5 14 11" />
    </>
  ),
};

export function BrandIcon({
  name,
  className = "",
}: {
  name: BrandIconName;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
