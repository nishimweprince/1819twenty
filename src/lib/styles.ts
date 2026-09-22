/**
 * Shared utility strings for controls that appear on more than one page.
 *
 * Kept as plain exported constants rather than `@apply` so every occurrence
 * stays greppable and the class list is visible at the call site.
 *
 * Hover rule: an element deepens its own color. Nothing hovers to a different
 * hue, and nothing lifts. Gold is reserved for state, not for hover. The one
 * motion exception is a showcase photo, which eases in slightly inside its
 * frame (`zoomFrame` / `zoomImage`).
 */

const controlBase =
  "inline-flex min-h-[2.9rem] cursor-pointer items-center justify-center gap-2 rounded-md " +
  "px-6 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] no-underline " +
  "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55";

/**
 * Links that act: the comps close every one with an arrow. The glyph is drawn
 * by `.with-arrow::after` in globals.css rather than a Tailwind arbitrary
 * `content-[...]`, whose escaping for a non-ASCII codepoint is brittle.
 */
export const withArrow = "with-arrow";

/**
 * "Launching soon" — a status badge, not a control. It carries buttonGold's
 * look without the pointer, hover or interactive target, because pressing it
 * does nothing, and a control that announces itself and then does nothing is
 * worse than plain text.
 */
export const badgeGold =
  "inline-flex items-center justify-center rounded-md border border-gold bg-gold " +
  "px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink";

/** Primary action on a paper ground. */
export const button = `${controlBase} border border-ink bg-ink text-paper hover:border-ink-deep hover:bg-ink-deep`;

/** Secondary action on a paper ground. Fills with its own color, never gold. */
export const buttonSecondary = `${controlBase} border border-ink/45 bg-transparent text-ink hover:border-ink hover:bg-ink/8`;

/** Action on an ink ground, where gold is legible at 4.98:1. */
export const buttonGold = `${controlBase} border border-gold bg-gold text-ink hover:border-gold-lift hover:bg-gold-lift`;

/**
 * Focus for fields: no outline ring. The border turns ink and an inset shadow
 * doubles it to 2px, so focus stays visible without spilling past the box.
 */
export const fieldFocus =
  "focus-visible:border-ink focus-visible:outline-none " +
  "focus-visible:shadow-[inset_0_0_0_1px_var(--color-ink)]";

/** Text and email fields. `aria-invalid` drives the error border. */
export const input =
  "w-full min-h-[2.75rem] rounded-md border border-ink/34 bg-paper-hi px-3.5 py-2.5 " +
  "text-ink transition-colors duration-150 placeholder:text-ink/75 " +
  `hover:border-ink/55 ${fieldFocus} aria-invalid:border-danger`;

export const textarea = `${input} min-h-[8.5rem] resize-y leading-relaxed`;

export const fieldLabel = "text-[0.9rem] font-semibold";

export const fieldHint = "text-[0.82rem] text-ink/75";

/** Muted body copy. Keep the ink tint above the text contrast threshold. */
export const muted = "text-ink/75";

/**
 * Handwritten brand phrase ("Different places. Shared purpose."). Decorative:
 * every use is either aria-hidden or repeats copy that is already on the page.
 * Color is set at the call site — text-ink on paper, text-paper on ink.
 */
export const scriptAccent =
  "font-script text-[clamp(2rem,3vw,2.75rem)] leading-[1.1] tracking-[0.01em]";

export const scriptFeature =
  "font-script text-[clamp(1.3rem,1rem+1.1vw,1.95rem)] leading-[1.2]";

/**
 * The one tracked-caps style on the site, reserved for text that imitates an
 * object (book spines) or the single ceremonial line under the numerals.
 */
export const ceremonial = "text-[0.72rem] uppercase tracking-[0.24em]";

/**
 * The same tracked caps one step up, for a label that carries a section rather
 * than annotating one — the promise pillars and the category tiles.
 */
export const ceremonialLg =
  "text-[clamp(0.85rem,0.78rem+0.2vw,1rem)] uppercase tracking-[0.18em]";

/** Short gold rule that punctuates a heading or a phrase. */
export const goldRule = "block h-0.5 w-12 bg-gold";

/**
 * Showcase photo pair. The frame clips; the image eases in 4% while the
 * nearest `group` ancestor is hovered, so a whole card can be the hover root.
 * Call sites add aspect ratio and rounding to the frame.
 */
export const zoomFrame = "group relative overflow-hidden";

export const zoomImage =
  "object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "group-hover:scale-[1.04] motion-reduce:group-hover:scale-100";
