/**
 * The brand numerals, set as in the mark: three numbers punctuated by two
 * gold dots. The digits are real text; the dots are decoration, so a screen
 * reader hears "18 19 20" without the separators.
 */
export function Numerals({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline gap-[0.22em] font-display leading-none tracking-[-0.06em] ${className}`}
    >
      <span>18</span>
      <Dot />
      <span>19</span>
      <Dot />
      <span>20</span>
    </span>
  );
}

function Dot() {
  return (
    <span
      className="inline-block size-[0.14em] translate-y-[-0.28em] rounded-full bg-gold"
      aria-hidden="true"
    />
  );
}
