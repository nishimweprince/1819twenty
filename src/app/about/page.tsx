import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonGold } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The meaning, purpose, and promise behind Eighteen Nineteen Twenty.",
};

const pillars = [
  ["◒", "Personally curated", "Thoughtfully selected by us, for you."],
  ["◇", "Directly authentic", "From independent designers across Africa."],
  ["⊙", "Transparent pricing", "Clear prices, with shipping and duties included."],
  ["✦", "Rooted in heritage", "Celebrating culture while supporting communities."],
] as const;

const figureFrame = "relative aspect-4/5 overflow-hidden rounded-md max-[900px]:aspect-3/2";
const caption = "mt-4.5 font-display text-[1.15rem] italic";

export default function AboutPage() {
  return (
    <>
      <section className="grid min-h-[min(72svh,40rem)] grid-cols-2 max-[900px]:grid-cols-1">
        <div className="flex items-center px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(2.5rem,6vw,5.5rem)]">
          <div className="max-w-136">
            <Image className="mb-6 h-14 w-auto" src="/nav-mark.png" alt="Eighteen Nineteen Twenty" width={352} height={402} priority />
            <h1 className="mb-4.5 max-w-[16ch]">A name with meaning. A vision without borders.</h1>
            <p className="m-0 max-w-[46ch] text-[1.05rem] text-ink/75">
              Eighteen Nineteen Twenty carries the birthdays of the family behind it, and a belief that thoughtful design connects people, places, and purpose.
            </p>
          </div>
        </div>
        <figure className="relative m-0 overflow-hidden max-[900px]:order-first max-[900px]:min-h-88">
          <Image className="object-cover object-[center_32%]" src="/photos/about-hero.jpg" alt="A styled interior with handwoven wall baskets and a rattan basket" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
        </figure>
      </section>

      <section className="border-t border-ink/12 py-24 max-[700px]:py-18">
        <div className="container grid grid-cols-2 items-center gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1">
          <div>
            <h2 className="mb-4.5">More than a name</h2>
            <div className="max-w-[62ch]">
              <p>What began as a personal meaning has grown into a wider purpose: to celebrate African creativity, craftsmanship, and culture, and to bring it into homes and wardrobes around the world.</p>
              <p>We believe design can connect people, places, and purpose, and we are just getting started.</p>
            </div>
          </div>
          <figure className="m-0">
            <div className={figureFrame}>
              <Image className="object-cover" src="/photos/about-story.jpg" alt="Indigo-dyed cloth drying in the open air" fill sizes="(max-width: 900px) 100vw, 46vw" />
            </div>
            <figcaption className={caption}>Timeless pieces, meaningful impact.</figcaption>
          </figure>
        </div>
      </section>

      <section data-ground="ink" className="relative overflow-hidden bg-ink py-18 text-paper max-[700px]:py-14">
        <Image className="object-cover object-center opacity-50" src="/photos/pattern-indigo.jpg" alt="" fill sizes="40vw" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[linear-gradient(90deg,var(--color-ink)_42%,rgb(44_62_80/0.55)_100%)]"
        />
        <div className="container relative z-1 grid grid-cols-2 items-center gap-9 max-[820px]:grid-cols-1">
          <div>
            <h2>Why these numbers?</h2>
            <p className="max-w-[50ch]">Eighteen. Nineteen. Twenty. Three birthdays, three people, one family. These numbers represent our past, our present, and the future we are building together.</p>
            <p className="mt-6 border-t border-gold/70 pt-4.5 text-paper/82">Three birthdays, three people, one family.</p>
          </div>
          <p className="relative z-1 m-0 text-center font-display text-[clamp(4.2rem,10vw,9rem)] leading-none tracking-[-0.07em]">18 · 19 · 20</p>
        </div>
      </section>

      <section className="py-24 max-[700px]:py-18">
        <div className="container grid grid-cols-2 items-center gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1">
          <figure className="m-0 max-[900px]:order-2">
            <div className={figureFrame}>
              <Image className="object-cover" src="/photos/weaving.jpg" alt="A weaver working colored threads on a traditional loom" fill sizes="(max-width: 900px) 100vw, 46vw" />
            </div>
            <figcaption className={caption}>Different places, shared purpose.</figcaption>
          </figure>
          <div>
            <h2 className="mb-4.5">From us to the continent</h2>
            <div className="max-w-[62ch]">
              <p>Our journey began at home, with a deep appreciation for the beauty and richness of African design. A love for travel, culture, and craftsmanship grew into a commitment to connect exceptional African designers with a global audience.</p>
              <p>We work directly with independent makers across the continent, sharing their stories and creations with the world.</p>
            </div>
          </div>
        </div>

        <div className="container">
          <h2 className="mt-24 max-[700px]:mt-18">Our promise</h2>
          {/* gap-px over an ink wash draws the rules, so the grid stays correct
              at every breakpoint without per-child border rules. */}
          <div className="mt-12 grid grid-cols-4 gap-px border-y border-ink/12 bg-ink/12 max-[820px]:grid-cols-2 max-[580px]:grid-cols-1">
            {pillars.map(([icon, title, copy]) => (
              <article className="bg-paper p-9" key={title}>
                <span className="mb-3 block font-display text-[2.6rem] leading-none" aria-hidden="true">{icon}</span>
                <h3 className="mb-2.5 text-[1.65rem]">{title}</h3>
                <p className="mb-0">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-ground="ink" className="relative flex min-h-[min(52svh,30rem)] items-center justify-center overflow-hidden text-center">
        <Image className="object-cover object-[center_55%]" src="/photos/landscape.jpg" alt="" fill sizes="100vw" />
        {/* ink/78 keeps the heading at 4.82:1 even over the lightest part of the photo */}
        <div aria-hidden="true" className="absolute inset-0 z-1 bg-ink/78" />
        <div className="container relative z-2">
          <h2 className="mx-auto mb-6 max-w-[20ch] text-paper">Fashion and home rooted in heritage. Our story, designed for your style.</h2>
          <Link className={buttonGold} href="/designers">Explore the collection</Link>
        </div>
      </section>
    </>
  );
}
