import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { Numerals } from "@/components/numerals";
import { PatternStrip } from "@/components/pattern-strip";
import { PhotoNote } from "@/components/photo-note";
import {
  buttonGold,
  withArrow,
  ceremonial,
  goldRule,
  scriptAccent,
  zoomFrame,
  zoomImage,
} from "@/lib/styles";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The meaning, purpose, and promise behind Eighteen Nineteen Twenty.",
};

const pillars: readonly [BrandIconName, string, string][] = [
  ["globe", "Personally Curated", "Thoughtfully selected by us, for you."],
  [
    "diamond",
    "Directly Authentic",
    "From independent designers across Africa.",
  ],
  ["bag", "Transparent Pricing", "No surprise fees at checkout."],
  ["sun", "Rooted in Heritage", "Celebrating culture. Supporting communities."],
];

// The comp sets the two journey photographs to a common height and lets their
// widths differ, rather than to a common aspect. Below 1100px the copy spans
// the full row and the photographs keep a 3/2 aspect instead — a fixed height
// would turn them into cropped strips next to a half-empty text row, and the
// loom caption would push the books photograph down off the text.
const figureFrame = `${zoomFrame} h-[clamp(11rem,18vw,14.5rem)] rounded-md max-[1100px]:aspect-3/2 max-[1100px]:h-auto`;
const caption = `${scriptAccent} mt-3.5 text-ink`;

export default function AboutPage() {
  return (
    <>
      {/* The comp lights this hero rather than darkening it: the photographs
          sit under a paper veil, with a cream pool behind the lockup so the
          colour emblem and ink copy read. The home hero keeps its ink scrim. */}
      <section className="relative flex min-h-[clamp(17rem,24vw,22rem)] items-center justify-center overflow-hidden py-10">
        {/* Two candidates for the largest paint, so both load eagerly rather
            than either being preloaded. */}
        <div className="absolute inset-0 grid grid-cols-2 max-[700px]:grid-cols-1">
          <div className="relative">
            <Image
              src="/photos/interior-decor.jpg"
              alt=""
              fill
              loading="eager"
              className="object-cover"
              sizes="(max-width: 700px) 100vw, 50vw"
            />
          </div>
          <div className="relative max-[700px]:hidden">
            <Image
              src="/photos/designer-studio.jpg"
              alt=""
              fill
              loading="eager"
              className="object-cover object-[center_32%]"
              sizes="50vw"
            />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-paper/55" />
        {/* The pool holds paper at full strength across the lockup before it
            falls away, so the ink copy never lands on the photograph. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(44%_86%_at_50%_50%,var(--color-paper)_0%,var(--color-paper)_42%,transparent_100%)]"
        />
        <div className="container relative z-1 flex flex-col items-center text-center">
          <Image
            src="/hero-emblem.png"
            alt="Eighteen Nineteen Twenty"
            width={564}
            height={535}
            loading="eager"
            className="h-auto w-[clamp(9rem,15vw,12rem)]"
          />
          <span className={`${goldRule} my-4`} aria-hidden="true" />
          <p
            id="page-title"
            className={`${ceremonial} mb-0 max-w-[44ch] leading-[1.9] text-ink`}
          >
            Fashion and home rooted in heritage — our story, designed for your
            style.
          </p>
        </div>
        <PhotoNote className="right-6 top-8 max-[900px]:hidden" tone="ink">
          A more beautiful, more connected world.
        </PhotoNote>
      </section>

      {/* The photo bleeds to the right edge as in the mockup; only the text
          column keeps the page gutter. */}
      <section className="border-t border-ink/12">
        <div className="grid grid-cols-[0.85fr_1.15fr] items-stretch gap-[clamp(2rem,5vw,4.5rem)] pl-[max(1.5rem,calc((100vw-var(--container))/2))] max-[760px]:grid-cols-1 max-[760px]:gap-8 max-[760px]:pl-0">
          <div className="flex flex-col justify-center py-section max-[760px]:px-[calc((100vw-var(--container))/2)] max-[760px]:pb-0 max-[760px]:pt-section">
            <h1 className="mb-3">Our Story</h1>
            <span className={`${goldRule} mb-3.5`} aria-hidden="true" />
            <p className={`${ceremonial} mb-6 max-w-[35ch] leading-[1.8]`}>
              A name with meaning.
              <br />A vision without borders.
            </p>
            <div className="max-w-[54ch]">
              <p>
                Eighteen Nineteen Twenty carries the birthdays of the family
                behind it. What began as a personal meaning has grown into a
                brand with a bigger purpose — to celebrate African creativity,
                craftsmanship, and culture, and to bring it to homes and
                wardrobes around the world.
              </p>
              <p className="mb-0">
                We believe in the power of design to connect people, places, and
                purpose — and we&rsquo;re just getting started.
              </p>
            </div>
          </div>
          <div
            className={`${zoomFrame} min-h-[clamp(19rem,26vw,23rem)] max-[760px]:aspect-3/2 max-[760px]:min-h-0`}
          >
            <Image
              className={zoomImage}
              src="/photos/indigo-throw.jpg"
              alt="Indigo throw beside handcrafted vessels and a woven basket"
              fill
              sizes="(max-width: 760px) 100vw, 60vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-ink/78 via-ink/40 to-transparent"
            />
            <PhotoNote className="right-[clamp(1.5rem,5vw,4rem)] top-1/2 -translate-y-1/2">
              Timeless Pieces. Meaningful Impact.
            </PhotoNote>
          </div>
        </div>
      </section>

      {/* The one bold moment on the page: numerals on ink, with the mudcloth
          geometry faint behind and an indigo cloth at the edge. Everything
          around it stays on paper and hairlines. */}
      <section
        data-ground="ink"
        className="relative grid grid-cols-[minmax(0,1fr)_7rem] overflow-hidden bg-ink text-paper max-[820px]:grid-cols-1"
        aria-labelledby="why-these-numbers"
      >
        <PatternStrip className="absolute inset-0 opacity-30" />
        <div className="relative z-1 grid grid-cols-[1fr_1.15fr] items-center gap-[clamp(2rem,5vw,4.5rem)] py-band pl-[max(1.5rem,calc((100vw-var(--container))/2))] pr-[clamp(1.5rem,5vw,4.5rem)] max-[820px]:grid-cols-1 max-[820px]:px-[calc((100vw-var(--container))/2)]">
          <div>
            <h2 id="why-these-numbers" className="mb-3">
              Why These Numbers?
            </h2>
            <span className={`${goldRule} mb-4`} aria-hidden="true" />
            <p className="mb-0 max-w-[46ch] text-paper/82">
              Eighteen. Nineteen. Twenty.
              <br />
              Three birthdays, three people, one family.
              <br />
              These numbers represent our past, our present, and the future we
              are building together — a reminder that everything we do is rooted
              in family, guided by purpose, and designed to create a more
              connected, more beautiful world.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Numerals className="text-[clamp(3.4rem,2.6rem+4.2vw,6.6rem)]" />
            <span className={`${goldRule} my-3`} aria-hidden="true" />
            <p className={`${ceremonial} mb-0 leading-[1.65] text-paper/82`}>
              Three birthdays, three people, one family.
            </p>
          </div>
        </div>
        <div className={`${zoomFrame} z-1 max-[820px]:h-16`}>
          <Image
            className={zoomImage}
            src="/photos/pattern-indigo.jpg"
            alt=""
            fill
            sizes="(max-width: 820px) 100vw, 7rem"
          />
        </div>
      </section>

      <section className="py-section" aria-labelledby="our-journey">
        <div className="container grid grid-cols-[1.5fr_0.85fr_0.95fr] items-center gap-[clamp(1.25rem,3vw,2.5rem)] max-[1100px]:grid-cols-[1fr_1fr] max-[1100px]:items-start max-[1100px]:gap-y-5 max-[900px]:grid-cols-1">
          <div className="max-[1100px]:col-span-2 max-[900px]:col-span-1">
            <h2 id="our-journey" className="mb-3">
              Our Journey From Us to the Continent
            </h2>
            <span className={`${goldRule} mb-4`} aria-hidden="true" />
            <div className="max-w-[52ch]">
              <p>
                Our journey began at home, with a deep appreciation for the
                beauty and richness of African design. What started as a love
                for travel, culture, and craftsmanship has grown into a
                commitment to connect exceptional African designers with a
                global audience — starting in the United States.
              </p>
              <p className="mb-0">
                We work directly with independent designers across Africa,
                sharing their stories and creations with the world.
              </p>
            </div>
          </div>
          <figure className="m-0">
            <div className={figureFrame}>
              <Image
                className={zoomImage}
                src="/photos/cities-books.jpg"
                alt="Stack of books titled New York, Kigali, Nairobi, Lagos, and A more connected world, styled with a woven basket, wooden bowl, and plant"
                fill
                sizes="(max-width: 900px) 100vw, 30vw"
              />
            </div>
            <ol className="sr-only">
              <li>New York</li>
              <li>Kigali</li>
              <li>Nairobi</li>
              <li>Lagos</li>
              <li>A more connected world</li>
            </ol>
          </figure>
          <figure className="m-0">
            <div className={figureFrame}>
              <Image
                className={zoomImage}
                src="/photos/loom.jpg"
                alt="Hands weaving indigo and rust-colored textile on a loom"
                fill
                sizes="(max-width: 900px) 100vw, 30vw"
              />
            </div>
            <figcaption className={caption}>
              Different Places. Shared Purpose.
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="border-t border-ink/12 py-section-sm"
        aria-labelledby="what-we-do"
      >
        <div className="container grid grid-cols-[1fr_3fr] gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1">
          <div>
            <h2 id="what-we-do" className="mb-3">
              What We Do
            </h2>
            <span className={`${goldRule} mb-4`} aria-hidden="true" />
            <p className="mb-0 max-w-[32ch]">
              We curate fashion and home from independent African designers and
              make it easy for you to shop with confidence.
            </p>
          </div>
          <div className="border-l border-ink/12 pl-[clamp(2rem,5vw,4.5rem)] max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pl-0 max-[900px]:pt-section-sm">
            <h2 className="mb-3">Our Promise</h2>
            <span className={`${goldRule} mb-6`} aria-hidden="true" />
            {/* gap-px over an ink wash draws the rules, so the grid stays correct
                at every breakpoint without per-child border rules. */}
            <div className="grid grid-cols-4 gap-px bg-ink/12 max-[820px]:grid-cols-2 max-[480px]:grid-cols-1">
              {pillars.map(([icon, title, copy], index) => (
                <article
                  className="flex flex-col items-center bg-paper px-5 py-3 text-center max-[820px]:py-6"
                  key={title}
                >
                  <BrandIcon
                    className={`mb-4 size-10 ${index % 2 ? "text-gold" : "text-terracotta"}`}
                    name={icon}
                  />
                  <h3 className="mb-2 max-w-[9ch] text-[1.25rem]">{title}</h3>
                  <p className="mb-0 max-w-[20ch] text-[0.95rem] text-ink/75">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        data-ground="ink"
        className="relative flex min-h-[min(28svh,15rem)] items-center justify-center overflow-hidden py-section-sm text-center"
      >
        <Image
          className="object-cover object-[center_35%]"
          src="/photos/savanna.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-linear-to-b from-ink/45 via-ink/78 to-ink/55"
        />
        <div className="container relative z-2">
          <h2 className="mx-auto mb-6 max-w-[22ch] text-paper">
            Fashion and Home Rooted in Heritage — Our Story, Designed for Your
            Style.
          </h2>
          <Link
            className={`${buttonGold} ${withArrow}`}
            href="/designers/apply"
          >
            Join as a Designer
          </Link>
        </div>
      </section>
    </>
  );
}
