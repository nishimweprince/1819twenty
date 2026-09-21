/**
 * Shared utility strings for controls that appear on more than one page.
 *
 * Kept as plain exported constants rather than `@apply` so every occurrence
 * stays greppable and the class list is visible at the call site.
 *
 * Hover rule: an element deepens its own color. Nothing hovers to a different
 * hue, and nothing lifts. Gold is reserved for state, not for hover.
 */

const controlBase =
  "inline-flex min-h-[2.9rem] cursor-pointer items-center justify-center gap-2 rounded-md " +
  "px-5 py-2.5 text-[0.85rem] font-semibold tracking-[0.01em] no-underline " +
  "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55";

/** Primary action on a paper ground. */
export const button = `${controlBase} border border-ink bg-ink text-paper hover:border-ink-deep hover:bg-ink-deep`;

/** Secondary action on a paper ground. Fills with its own color, never gold. */
export const buttonSecondary = `${controlBase} border border-ink/45 bg-transparent text-ink hover:border-ink hover:bg-ink/8`;

/** Home-page secondary action. Rests as an outline, fills to primary on hover. */
export const buttonHome = `${controlBase} border border-ink/45 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper`;

/** Action on an ink ground, where gold is legible at 4.98:1. */
export const buttonGold = `${controlBase} border border-gold bg-gold text-ink hover:border-gold-lift hover:bg-gold-lift`;

/** Text and email fields. `aria-invalid` drives the error border. */
export const input =
  "w-full min-h-[2.75rem] rounded-md border border-ink/34 bg-paper-hi px-3.5 py-2.5 " +
  "text-ink transition-colors duration-150 placeholder:text-ink/75 " +
  "hover:border-ink/55 focus-visible:border-ink aria-invalid:border-danger";

export const textarea = `${input} min-h-[8.5rem] resize-y leading-relaxed`;

export const fieldLabel = "text-[0.9rem] font-semibold";

export const fieldHint = "text-[0.82rem] text-ink/75";

/** Muted body copy. ink/75 is 4.75:1 on paper — ink/70 falls to 4.15:1. */
export const muted = "text-ink/75";

/**
 * Handwritten brand phrase ("Different places. Shared purpose."). Decorative:
 * every use is either aria-hidden or repeats copy that is already on the page.
 * Color is set at the call site — text-ink on paper, text-paper on ink.
 */
export const scriptAccent =
  "font-script text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[1.15] tracking-[0.01em]";

/**
 * The one tracked-caps style on the site, reserved for text that imitates an
 * object (book spines) or the single ceremonial line under the numerals.
 */
export const ceremonial = "text-[0.72rem] uppercase tracking-[0.24em]";

/** Short gold rule that punctuates a heading or a phrase. */
export const goldRule = "block h-0.5 w-12 bg-gold";
