import Image from "next/image";
import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { HeroGlow } from "@/components/hero-glow";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  button,
  ceremonial,
  goldRule,
  scriptAccent,
  zoomFrame,
  zoomImage,
} from "@/lib/styles";

const pillars: readonly [BrandIconName, string, string][] = [
  ["globe", "Personally Curated", "Thoughtfully selected by us, for you."],
  ["diamond", "Directly Authentic", "From independent designers across Africa."],
  ["leaf", "Transparent Pricing", "No surprise fees — duties included."],
];

const collections = [
  { name: "Fashion", image: "/photos/fashion-portrait.jpg" },
  { name: "Home", image: "/photos/indigo-throw.jpg" },
  { name: "Décor", image: "/photos/interior-decor.jpg" },
  { name: "Accessories", image: "/photos/beads-bowl.jpg" },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[min(64svh,38rem)] items-center justify-center overflow-hidden py-14 max-[700px]:min-h-136">
        <Image
          src="/photos/home-hero.jpg"
          alt=""
          fill
          preload
          className="object-cover object-center"
          sizes="100vw"
        />
        <HeroGlow />
        <div className="container relative z-1 flex flex-col items-center text-center">
          <Image
            src="/hero-emblem.png"
            alt=""
            width={564}
            height={535}
            loading="eager"
            className="mb-2 h-auto w-[clamp(8rem,13vw,11rem)]"
          />
          <h1 className="mb-4 max-w-[20ch] text-[clamp(2.4rem,4.6vw,4.2rem)]">
            Eighteen Nineteen Twenty
          </h1>
          <p className={`${ceremonial} mb-8 max-w-[44ch] leading-[1.8]`}>
            Fashion and home rooted in heritage — our story, designed for your style.
          </p>
          <Link className={button} href="/about">
            Read our story
          </Link>
        </div>
        {/* Bottom right is the indigo throw, the one dark region of the photo
            where paper script reads. */}
        <p
          className={`${scriptAccent} absolute bottom-8 right-[5vw] z-1 mb-0 max-w-[7ch] text-center text-paper [text-shadow:0_1px_8px_rgba(23,42,58,0.6)] max-[900px]:hidden`}
          aria-hidden="true"
        >
          Global Design. Lasting Impact.
        </p>
      </section>

      <section className="border-y border-ink/12 bg-paper-hi py-9" aria-label="Our promises">
        <div className="container grid grid-cols-3 gap-px bg-ink/12 max-[700px]:grid-cols-1">
          {pillars.map(([icon, title, copy], index) => (
            <div className="flex items-center gap-5 bg-paper-hi px-7 py-3 max-[700px]:px-4" key={title}>
              <BrandIcon name={icon} className={`size-11 flex-none ${index % 2 ? "text-gold" : "text-terracotta"}`} />
              <div>
                <h2 className="mb-1 text-[1.35rem]">{title}</h2>
                <p className="mb-0 text-[0.9rem] text-ink/75">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 max-[700px]:py-16" aria-labelledby="collection-title">
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="collection-title" className="mb-0">Featured Collections</h2>
            <Link
              className="mb-1 whitespace-nowrap text-[0.9rem] font-semibold no-underline underline-offset-4 hover:underline"
              href="/#join"
            >
              Join for first access
            </Link>
          </div>
          {/* Each tile is a link to the join form: the pieces are not for sale
              yet, so the click lands where a visitor can ask to be told first.
              The image is decorative; the caption names the tile. */}
          <div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[700px]:gap-3">
            {collections.map((item) => (
              <Link
                key={item.name}
                className={`${zoomFrame} block cursor-pointer no-underline`}
                href="/#join"
              >
                <figure className="m-0">
                  <div className="relative aspect-4/5 overflow-hidden rounded-md">
                    <Image src={item.image} alt="" fill className={zoomImage} sizes="(max-width: 900px) 50vw, 25vw" />
                  </div>
                  <figcaption className="pt-3">
                    <span className="block font-display text-[1.15rem] leading-tight">{item.name}</span>
                    <span className="mt-1 block text-[0.9rem] text-ink/75">Coming soon</span>
                  </figcaption>
                </figure>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/12 bg-paper-hi py-16 max-[700px]:py-12" aria-labelledby="join-title">
        <div className="narrow flex flex-col items-center text-center">
          <h2 id="join-title" className="mb-3">Join Our Community</h2>
          <span className={`${goldRule} mb-8`} aria-hidden="true" />
          <NewsletterForm />
        </div>
      </section>

      <section className="grid min-h-96 grid-cols-[1fr_1.2fr_1fr] border-t border-ink/12 max-[900px]:grid-cols-1" aria-labelledby="more-than-name">
        <div className={`${zoomFrame} min-h-96 max-[900px]:min-h-64`}>
          <Image src="/photos/savanna.jpg" alt="Savanna landscape at sunset" fill className={`${zoomImage} object-[center_40%]`} sizes="(max-width: 900px) 100vw, 33vw" />
          {/* Ink script on the bright sky, which sits top right of this crop. */}
          <span className={`${scriptAccent} absolute right-7 top-7 max-w-[7ch] text-center text-ink`} aria-hidden="true">Pieces with a Purpose</span>
        </div>
        <div className="flex flex-col items-start justify-center bg-paper-hi px-[clamp(2rem,5vw,5rem)] py-16">
          <h2 id="more-than-name" className="mb-4">More Than a Name</h2>
          <span className={`${goldRule} mb-6`} aria-hidden="true" />
          <p className="max-w-[48ch]">
            Eighteen Nineteen Twenty carries the birthdays of the family behind
            it — a reminder of our shared roots and our belief in a more
            connected, more beautiful world through design.
          </p>
          <Link href="/about" className={`${button} mt-2`}>Read our story</Link>
        </div>
        <div className={`${zoomFrame} min-h-96 max-[900px]:min-h-64`}>
          <Image src="/photos/pattern-indigo.jpg" alt="Indigo tie-dyed cloth with a white diamond grid" fill className={zoomImage} sizes="(max-width: 900px) 100vw, 33vw" />
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-ink/45 to-transparent" />
          <p className={`${ceremonial} absolute bottom-8 right-7 mb-0 grid justify-items-end gap-1.5 text-right leading-[1.9] text-paper`} aria-hidden="true">
            <span>People</span>
            <span>Places</span>
            <span>Pieces</span>
            <span>Purpose</span>
            <span className={`${goldRule} mt-2`} />
          </p>
        </div>
      </section>
    </>
  );
}
