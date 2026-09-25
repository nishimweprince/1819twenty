import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { PatternStrip } from "@/components/pattern-strip";
import { PhotoNote } from "@/components/photo-note";
import { SocialLinks } from "@/components/site-shell";
import {
  buttonGold,
  ceremonial,
  ceremonialLg,
  goldRule,
  withArrow,
  zoomFrame,
  zoomImage,
} from "@/lib/styles";

const pillars: readonly [BrandIconName, string, string, string][] = [
  ["globe", "Original", "designers", "Curated from across Africa."],
  ["diamond", "Meaningful", "pieces", "Chosen with intention."],
  ["house", "Global", "reach", "Shipped straight to your door."],
  ["people", "A more", "connected world", "People. Places. Pieces. Purpose."],
];

/* The four rooms of the brand. Only Designers has somewhere to go in Phase 1;
   the rest are previews, so they land on the sign-up rather than a dead route. */
const tiles: readonly {
  name: string;
  line: string;
  src: string;
  alt: string;
  href: Route;
  comingSoon: boolean;
}[] = [
  {
    name: "Fashion",
    line: "Wear the story",
    src: "/photos/fashion-portrait.jpg",
    alt: "Woman in a wide straw hat and a geometric print dress",
    href: "/#join",
    comingSoon: true,
  },
  {
    name: "Home",
    line: "Curate a richer space",
    src: "/photos/interior-decor.jpg",
    alt: "Patterned pillow, carved wooden bowls and stacked books on a wood table",
    href: "/#join",
    comingSoon: true,
  },
  {
    name: "Designers",
    line: "Meet the makers",
    src: "/photos/loom.jpg",
    alt: "A weaver's hands working a patterned textile on a frame loom",
    href: "/designers",
    comingSoon: false,
  },
  {
    name: "Journal",
    line: "Stories that inspire",
    src: "/photos/savanna.jpg",
    alt: "Savanna landscape at sunset",
    href: "/#join",
    comingSoon: true,
  },
];

export default function HomePage() {
  return (
    <>
      {/* No scrim or wash over this photograph: the light ground the lockup
          and ink copy sit on is part of the picture itself, so the artwork
          has to carry a bright, quiet centre. */}
      <section className="relative flex min-h-[clamp(28rem,38vw,34rem)] items-center justify-center overflow-hidden py-section-sm">
        <Image
          src="/photos/home-hero.png"
          alt=""
          fill
          preload
          className="object-cover object-[center_45%]"
          sizes="100vw"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(44%_86%_at_50%_50%,var(--color-paper)_0%,var(--color-paper)_42%,transparent_100%)]"
        />

        <div className="container relative z-1 flex flex-col items-center text-center">
          <Image
            src="/hero-emblem.png"
            alt=""
            width={564}
            height={535}
            loading="eager"
            className="mb-3 h-auto w-[clamp(6.5rem,10vw,8.5rem)]"
          />
          <h1 id="site-title" className="mb-3 text-display">
            Eighteen Nineteen Twenty
          </h1>
          {/* The one thing a first-time visitor must not miss, so it is set
              one step below the name rather than as a small label. */}
          <p className="mb-5 flex items-center gap-4 font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] leading-tight text-terracotta">
            <span
              className={`${goldRule} max-[520px]:w-6`}
              aria-hidden="true"
            />
            Launching Soon
            <span
              className={`${goldRule} max-[520px]:w-6`}
              aria-hidden="true"
            />
          </p>
          <p className="mb-4 max-w-[34ch] font-display text-[clamp(1.15rem,0.95rem+0.75vw,1.45rem)] leading-[1.35]">
            Truly original fashion and home, curated from Africa&rsquo;s most
            compelling designers.
          </p>
          <p className="mb-7 max-w-[46ch] text-[1.05rem] leading-[1.6] text-ink/75">
            We&rsquo;re building a home for the makers redefining African style
            — pieces chosen with intention, shipped straight to your door.
          </p>

          <Link className={`${buttonGold} ${withArrow} mb-7`} href="/about">
            Read our story
          </Link>

          <p className="mb-3 text-[0.95rem]">
            Follow along:{" "}
            <a
              className="font-semibold underline-offset-4"
              href="https://www.instagram.com/1819twenty"
              rel="noreferrer"
              target="_blank"
            >
              @1819twenty
            </a>
          </p>
          <SocialLinks tone="ink" size={26} />
        </div>

        <PhotoNote className="right-[6vw] top-12 max-[1000px]:hidden">
          Pieces with a Purpose
        </PhotoNote>
      </section>

      <section
        className="border-y border-ink/12 bg-paper-hi py-section-sm"
        aria-label="What we promise"
      >
        <div className="container grid grid-cols-4 gap-px bg-ink/12 max-[820px]:grid-cols-2 max-[460px]:grid-cols-1">
          {pillars.map(([icon, titleA, titleB, copy]) => (
            <div
              className="flex flex-col items-center bg-paper-hi px-5 py-2 text-center max-[820px]:py-5"
              key={titleA + titleB}
            >
              <BrandIcon name={icon} className="mb-3 size-10 text-terracotta" />
              <h2 className={`${ceremonialLg} mb-2 font-display`}>
                {titleA}
                <br />
                {titleB}
              </h2>
              <p className="mb-0 text-[0.88rem] text-ink/75">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full bleed, as in the comp: the row spans the viewport rather than
          sitting inside the page gutter. */}
      <section aria-label="Where to start">
        <div className="grid grid-cols-4 gap-1.5 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          {tiles.map((tile) => (
            <Link
              className={`${zoomFrame} block aspect-[5/7] no-underline max-[520px]:aspect-[4/3]`}
              href={tile.href}
              key={tile.name}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                className={zoomImage}
                sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 25vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/92 via-ink/60 to-transparent"
              />
              {tile.name === "Journal" ? (
                <PhotoNote
                  tone="ink"
                  className="left-1/2 top-7 -translate-x-1/2 [&_p]:max-w-[13ch] [&_p]:text-[clamp(1.25rem,1.8vw,1.75rem)]"
                >
                  A more beautiful, more connected world.
                </PhotoNote>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 z-1 p-5 text-paper max-[520px]:p-4">
                <span className="flex flex-wrap items-center gap-3">
                  <span className={`${ceremonialLg} font-display`}>
                    {tile.name}
                  </span>
                  {tile.comingSoon ? (
                    <span className="rounded-full bg-gold px-2.5 py-0.5 text-[0.78rem] font-semibold text-ink">
                      Coming Soon
                    </span>
                  ) : null}
                </span>
                <span className={`${ceremonial} mt-1.5 block text-paper`}>
                  {tile.line}
                </span>
                <span className={`${goldRule} mt-2.5`} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The header CTA on every page points at /#join, so this id has to live
          here — it used to sit on the hero newsletter form this page dropped. */}
      <section
        id="join"
        data-ground="ink"
        className="grid grid-cols-[7rem_minmax(0,1fr)_7rem] bg-ink text-paper max-[900px]:grid-cols-1"
        aria-labelledby="join-title"
      >
        <div className="max-[900px]:h-12">
          <PatternStrip />
        </div>
        <div className="flex flex-col items-center px-[clamp(1.25rem,4vw,3.5rem)] py-band text-center">
          <h2 id="join-title" className="mb-2.5">
            Be the First to Know
          </h2>
          <p className="mb-6 max-w-[62ch] text-paper/82">
            Sign up for updates on our launch, new arrivals, and the stories
            behind the pieces.
          </p>
          <NewsletterForm variant="footer" />
        </div>
        <div className="max-[900px]:hidden">
          <PatternStrip />
        </div>
      </section>
    </>
  );
}
