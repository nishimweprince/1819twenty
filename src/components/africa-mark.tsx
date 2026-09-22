/**
 * The continent as a single open stroke, the way the comps draw it: a mark
 * sitting beside a handwritten phrase, never a data map. Always decorative —
 * every use pairs it with copy that already carries the meaning, so it stays
 * aria-hidden and the color comes from the parent.
 */
export function AfricaMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M30 12c6-3 14-4 22-3l7 1 6-3 5 2 3 6 9 2 6 5-1 7 4 5-2 6-6 4-3 8-1 10-5 9-4 12-3 14-5 9-7 6-6-2-2-8-5-7-6-10-4-12-7-9-4-11 1-9-3-8 2-9 4-7 5-4 0-6z"
        strokeWidth="2.2"
      />
      <path d="M94 76l9 3 2 7-6 9-5-2" strokeWidth="2" />
    </svg>
  );
}
