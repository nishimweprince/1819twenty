import { ceremonial } from "@/lib/styles";

/**
 * The route of the brand's journey, set as a stack of book spines. It is an
 * ordered list because the order is the point: the journey starts in New York
 * and moves across the continent, so each spine carries an arrow.
 */
const route = ["New York", "Kigali", "Nairobi", "Lagos"] as const;

export function CityStack() {
  return (
    <div className="flex flex-col items-stretch bg-paper-hi px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(1.5rem,4vw,2.5rem)]">
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {route.map((city, index) => (
          <li
            className={`flex items-center justify-between border border-ink/34 bg-paper px-5 py-3.5 font-display text-[1.05rem] tracking-[0.18em] uppercase ${
              index % 2 === 1 ? "translate-x-2" : "-translate-x-1"
            }`}
            key={city}
          >
            <span>{city}</span>
            <svg
              className="size-4 shrink-0 text-ink/70"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
            </svg>
          </li>
        ))}
      </ol>
      <p
        className={`${ceremonial} mb-0 mt-4 border-t border-ink/34 pt-3 text-center text-ink/75`}
      >
        A more connected world
      </p>
    </div>
  );
}
