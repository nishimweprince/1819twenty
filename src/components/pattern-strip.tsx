import { useId } from "react";

/**
 * A strip of mudcloth-style geometry — nested lozenges with a chevron row —
 * drawn in paper at low alpha so it sits on any ink ground. Purely decorative.
 *
 * On wide screens it is a full-height column at the edge of a band; below
 * 820px it becomes a short horizontal rule so the band keeps its frame
 * without spending vertical space.
 */
export function PatternStrip({ className = "" }: { className?: string }) {
  // Two strips can frame one band, so the pattern id must not collide.
  const id = `mudcloth-${useId().replace(/:/g, "")}`;
  return (
    <svg
      className={`block h-full w-full ${className}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <g
            fill="none"
            stroke="var(--color-paper)"
            strokeOpacity="0.28"
            strokeWidth="1.5"
          >
            {/* nested lozenges */}
            <path d="M28 4 L52 28 L28 52 L4 28 Z" />
            <path d="M28 14 L42 28 L28 42 L14 28 Z" />
            {/* corner chevrons that meet the neighbouring tile */}
            <path d="M0 8 L8 0 M48 56 L56 48 M0 48 L8 56 M48 0 L56 8" />
          </g>
          <rect
            x="24.5"
            y="24.5"
            width="7"
            height="7"
            transform="rotate(45 28 28)"
            fill="var(--color-gold)"
            fillOpacity="0.55"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
