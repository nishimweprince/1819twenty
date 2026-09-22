import Image from "next/image";
import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  button,
  buttonGold,
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

/* The first six pieces, named as in the comp. Nothing is buyable in Phase 1,
   so "Coming soon" sits where the price does and the photograph stands in for
   the piece — decorative, with the caption naming it. */
const collections = [
  { name: "Amani Wrap Dress", image: "/photos/fashion-portrait.jpg" },
  { name: "Kigali Tote", image: "/photos/category-shoes.jpg" },
  { name: "Inyambo Pillow", image: "/photos/interior-decor.jpg" },
  { name: "Karibu Bowl (Set of 2)", image: "/photos/beads-bowl.jpg" },
  { name: "Imara Throw", image: "/photos/indigo-throw.jpg" },
  { name: "Urafiki Necklace", image: "/photos/category-accessories.jpg" },
] as const;

export default function HomePage() {
  return (
    <>
      {/* The lockup and copy sit on the photograph, as in the comp. The
          photograph runs to near-black in places, so the type is cream over
          an ink scrim rather than ink over a lightened image — darkening
          keeps the photo's colour where a paper wash bleached it. */}
      <section
        data-ground="ink"
        className="relative flex min-h-[clamp(26rem,42vw,34rem)] items-center justify-center overflow-hidden py-16"
      >
        <Image
          src="/photos/home-hero.png"
          alt=""
          fill
          preload
          className="object-cover object-[center_42%]"
          sizes="100vw"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/34" />
        <div className="container relative z-1 flex flex-col items-center text-center">
          {/* The sand recolor of the lockup, the one made to read on ink. */}
          <Image
            src="/footer-logo.png"
            alt=""
            width={554}
            height={525}
            loading="eager"
            className="mb-4 h-auto w-[clamp(6rem,9vw,8rem)]"
          />
          <h1 id="site-title" className="mb-4 max-w-[20ch] text-[clamp(2.2rem,4.2vw,3.8rem)] text-paper">
            Eighteen Nineteen Twenty
          </h1>
          <p className={`${ceremonial} mb-8 max-w-[44ch] leading-[1.9] text-paper`}>
            Fashion and home rooted in heritage — our story, designed for your style.
          </p>
          <Link className={buttonGold} href="/about">
            Read our story
          </Link>
        </div>
        <p
          className={`${scriptAccent} absolute top-16 right-[4vw] z-1 mb-0 max-w-[7ch] text-center text-paper max-[900px]:hidden`}
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
              The image is decorative; the caption names the piece. */}
          <div className="grid grid-cols-6 gap-4 max-[1100px]:grid-cols-3 max-[700px]:grid-cols-2 max-[700px]:gap-3">
            {collections.map((item) => (
              <Link
                key={item.name}
                className={`${zoomFrame} block cursor-pointer no-underline`}
                href="/#join"
              >
                <figure className="m-0">
                  <div className="relative aspect-square overflow-hidden rounded-md">
                    <Image src={item.image} alt="" fill className={zoomImage} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 17vw" />
                  </div>
                  <figcaption className="pt-3">
                    <span className="block font-display text-[1.05rem] leading-tight">{item.name}</span>
                    <span className="mt-1 block text-[0.85rem] text-ink/75">Coming soon</span>
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
