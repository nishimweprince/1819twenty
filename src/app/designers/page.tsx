import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { Numerals } from "@/components/numerals";
import { PatternStrip } from "@/components/pattern-strip";
import { PhotoNote } from "@/components/photo-note";
import {
  buttonGold,
  ceremonial,
  goldRule,
  scriptAccent,
  scriptFeature,
  zoomFrame,
  zoomImage,
} from "@/lib/styles";

export const metadata: Metadata = {
  title: "For Designers",
  description:
    "A global platform for African designers, makers, and artisans. Apply to share your fashion and home designs with the world.",
};

const categories = [
  {
    name: "Apparel",
    copy: "Women's, men's and children's wear",
    src: "/photos/fashion-portrait.jpg",
    alt: "Woman wearing an indigo and amber printed dress",
  },
  {
    name: "Shoes",
    copy: "Handcrafted and contemporary footwear",
    src: "/photos/category-shoes.jpg",
    alt: "Cognac leather loafers and a woven mule styled with beads and carved bowls",
  },
  {
    name: "Accessories",
    copy: "Jewelry, bags, scarves, hats and more",
    src: "/photos/category-accessories.jpg",
    alt: "Hand-painted Krobo glass beads strung into necklaces and bracelets",
  },
  {
    name: "Home décor",
    copy: "Textiles, art, furniture and tabletop",
    src: "/photos/interior-decor.jpg",
    alt: "Woven basket and patterned textiles in a warm interior",
  },
  {
    name: "Art & craft",
    copy: "Handmade and heritage pieces",
    src: "/photos/category-art.jpg",
    alt: "Carved wooden figures, patterned vases, a carved bowl, and beads on a rustic table",
  },
] as const;

const reasons: readonly [BrandIconName, string, string][] = [
  [
    "globe",
    "Global Reach",
    "Access customers in the U.S. and beyond through a curated marketplace.",
  ],
  [
    "people",
    "Support for Growth",
    "Resources, storytelling, and marketing support to help your brand thrive.",
  ],
  [
    "bag",
    "Brand Visibility",
    "Showcase your products alongside a community of exceptional African designers.",
  ],
  [
    "leaf",
    "Purpose-Driven",
    "Be part of a platform that celebrates culture, creates economic opportunity, and supports sustainable impact.",
  ],
];

export default function DesignersPage() {
  return (
    <>
      <section className="grid min-h-[clamp(24rem,32vw,32rem)] grid-cols-[1fr_1.1fr] max-[900px]:min-h-0 max-[900px]:grid-cols-1">
        <div className="flex items-center px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(3rem,6vw,5rem)]">
          <div className="max-w-136">
            <p className={`${ceremonial} mb-4 text-ink/75`}>
              Eighteen Nineteen Twenty
            </p>
            <h1 className="mb-5 max-w-[12ch]">
              Designers,
              <br />
              Let&rsquo;s Build Together
            </h1>
            <span className={`${goldRule} mb-7`} aria-hidden="true" />
            <p className="mb-8 max-w-[42ch] text-[1.05rem] text-ink/75">
              A global platform for African designers, makers, and artisans to
              share their creativity, culture, and craftsmanship with the world.
            </p>
            <Link className={buttonGold} href="/designers/apply">
              Apply to join
            </Link>
            <p className={`${ceremonial} mb-0 mt-8 text-ink/75`}>
              People. Places. Pieces. Purpose.
            </p>
          </div>
        </div>
        <figure
          className={`${zoomFrame} m-0 max-[900px]:order-first max-[900px]:aspect-4/3`}
        >
          <Image
            className={zoomImage}
            src="/photos/designer-studio.jpg"
            alt="Designer measuring patterned cloth in her studio"
            fill
            preload
            sizes="(max-width: 900px) 100vw, 55vw"
          />
          {/* The studio photo is light at the top right, where the script
              sits, so it needs its own ground to read against. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-ink/72 via-ink/40 to-transparent"
          />
          <PhotoNote className="right-[clamp(1.5rem,4vw,3rem)] top-7 max-[900px]:hidden">
            Different Designers. A More Connected World.
          </PhotoNote>
        </figure>
      </section>

      <section
        data-ground="ink"
        className="grid grid-cols-[7rem_minmax(0,1fr)_7rem] bg-ink text-paper max-[900px]:grid-cols-1"
        aria-label="Eighteen Nineteen Twenty"
      >
        <div className="max-[900px]:h-12">
          <PatternStrip />
        </div>
        <div className="grid grid-cols-[1fr_1.3fr_1fr] items-center gap-[clamp(1.5rem,4vw,3.5rem)] px-[clamp(1.5rem,4vw,3.5rem)] py-[clamp(3.5rem,6vw,5rem)] max-[900px]:grid-cols-1 max-[900px]:text-center">
          <div
            className="flex flex-col items-start gap-5 max-[900px]:order-2 max-[900px]:items-center"
            aria-hidden="true"
          >
            <p className={`${scriptFeature} m-0 text-paper`}>
              African Talent.
              <br />
              Global Impact.
            </p>
            <span className={goldRule} />
          </div>
          <div className="flex flex-col items-center text-center max-[900px]:order-1">
            <Numerals className="text-[clamp(3.6rem,7vw,6.5rem)]" />
            <span className={`${goldRule} my-5`} aria-hidden="true" />
            <p className={`${ceremonial} mb-0 leading-[1.9] text-paper/82`}>
              Eighteen Nineteen Twenty
              <br />
              Fashion and home rooted in heritage
            </p>
          </div>
          <div className="max-[900px]:order-3 max-[900px]:flex max-[900px]:flex-col max-[900px]:items-center">
            <p className="mb-0 max-w-[30ch] text-paper/82">
              We connect exceptional African designers with a global audience,
              celebrating authentic style, cultural heritage, and contemporary
              design.
            </p>
            <span className={`${goldRule} mt-5`} aria-hidden="true" />
          </div>
        </div>
        <div className="max-[900px]:hidden">
          <PatternStrip />
        </div>
      </section>

      <section
        className="py-24 max-[700px]:py-18"
        aria-labelledby="looking-for"
      >
        <div className="container">
          <h2 id="looking-for" className="mb-4">
            What We&rsquo;re Looking For
          </h2>
          <span className={`${goldRule} mb-5`} aria-hidden="true" />
          <p className="mb-10 text-[1.05rem]">
            We welcome independent designers and brands creating:
          </p>
        </div>
        {/* Five tiles do not wrap into 2 or 3 columns without an orphan, so the
            row scrolls sideways on narrower screens instead of stacking. There
            it spans the viewport, with the page gutter as padding so the first
            tile aligns with the heading and the last can bleed off the edge. */}
        <div
          className="mx-auto grid w-(--container) grid-cols-5 gap-4 max-[1000px]:flex max-[1000px]:w-full max-[1000px]:snap-x max-[1000px]:snap-mandatory max-[1000px]:overflow-x-auto max-[1000px]:px-[calc((100vw-var(--container))/2)] max-[1000px]:pb-4 max-[1000px]:scroll-px-[calc((100vw-var(--container))/2)]"
          role="region"
          aria-label="Categories we welcome"
          tabIndex={0}
        >
          {categories.map((category) => (
            <figure
              className="m-0 max-[1000px]:min-w-[min(62vw,20rem)] max-[1000px]:snap-start"
              key={category.name}
            >
              <div className={`${zoomFrame} aspect-square rounded-md`}>
                <Image
                  className={zoomImage}
                  src={category.src}
                  alt={category.alt}
                  fill
                  sizes="(max-width: 1000px) 62vw, 20vw"
                />
              </div>
              <figcaption className="mt-4 text-center">
                <h3 className={`${ceremonial} mb-2 font-sans font-semibold`}>
                  {category.name}
                </h3>
                <p className="mb-0 text-[0.95rem] text-ink/75">
                  {category.copy}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        className="border-t border-ink/12 py-24 max-[700px]:py-18"
        aria-labelledby="why-join"
      >
        <div className="container grid grid-cols-[4fr_1fr] items-start gap-[clamp(2rem,4vw,3rem)] max-[900px]:grid-cols-1">
          <div>
            {/* The comp uses the numeric wordmark in this heading, not the
                spelled-out name. */}
            <h2 id="why-join" className="mb-4">
              Why Join 1819twenty?
            </h2>
            <span className={`${goldRule} mb-9`} aria-hidden="true" />
            <div className="grid grid-cols-4 gap-px bg-ink/12 max-[820px]:grid-cols-2 max-[480px]:grid-cols-1">
              {reasons.map(([icon, title, copy]) => (
                <article
                  className="bg-paper px-5 py-6 max-[820px]:px-6 max-[480px]:px-0"
                  key={title}
                >
                  <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-terracotta text-paper">
                    <BrandIcon className="size-6" name={icon} />
                  </span>
                  <h3 className="mb-2 text-[1.15rem]">{title}</h3>
                  <p className="mb-0 text-[0.88rem] leading-relaxed text-ink/75">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <blockquote className="m-0 max-[900px]:max-w-[26ch]">
            <p className={`${scriptAccent} mb-6 text-ink`}>
              &ldquo;Extraordinary designers. A more connected world.&rdquo;
            </p>
            <span className={goldRule} aria-hidden="true" />
          </blockquote>
        </div>
      </section>

      <section
        data-ground="ink"
        className="relative flex min-h-[min(52svh,30rem)] items-center justify-center overflow-hidden text-center"
      >
        <Image
          className="object-cover object-[center_55%]"
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
          <h2 className="mx-auto mb-6 max-w-[18ch] text-paper">
            Join Our Community of Visionary Designers
          </h2>
          <Link className={buttonGold} href="/designers/apply">
            Apply to join
          </Link>
        </div>
        <p
          className={`${ceremonial} absolute right-[5vw] top-1/2 z-2 mb-0 grid -translate-y-1/2 gap-2.5 text-left leading-[1.9] text-paper max-[900px]:hidden`}
          aria-hidden="true"
        >
          <span>People</span>
          <span>Places</span>
          <span>Pieces</span>
          <span>Purpose</span>
        </p>
      </section>
    </>
  );
}
