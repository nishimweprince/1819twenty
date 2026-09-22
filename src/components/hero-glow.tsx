/**
 * The cream glow behind hero copy, as in the mockups. It is sized to the
 * content column rather than the section, so the photo keeps its colour at
 * the edges while the text reads on near-solid paper. Narrow screens get a
 * plain wash instead: there is no photo left to show around a glow.
 */
export function HeroGlow() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[120%] w-[min(72rem,96vw)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,var(--color-paper)_52%,rgba(245,236,223,0.9)_68%,transparent_100%)] max-[700px]:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-paper/86 min-[701px]:hidden"
      />
    </>
  );
}
