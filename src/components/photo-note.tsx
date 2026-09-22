import { goldRule, scriptAccent } from "@/lib/styles";

/**
 * A handwritten brand phrase laid over a photograph, with the gold rule
 * beneath it. Every use is aria-hidden: it repeats copy that is already on
 * the page.
 *
 * `tone` picks the ink the phrase is set in. Paper is the default, for a
 * photo at full strength; ink is for a hero whose photo sits under the paper
 * veil, where paper script would disappear.
 */
export function PhotoNote({
  children,
  className = "",
  tone = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "ink";
}) {
  return (
    <div
      className={`absolute z-1 flex flex-col items-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <p
        className={`${scriptAccent} mb-0 max-w-[9ch] text-center ${
          tone === "ink"
            ? "text-ink"
            : "text-paper [text-shadow:0_1px_8px_rgba(23,42,58,0.6)]"
        }`}
      >
        {children}
      </p>
      <span className={goldRule} />
    </div>
  );
}
