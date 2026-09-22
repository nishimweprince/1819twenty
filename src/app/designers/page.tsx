import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { Numerals } from "@/components/numerals";
import { PatternStrip } from "@/components/pattern-strip";
import { buttonGold, ceremonial, goldRule, scriptAccent, scriptFeature } from "@/lib/styles";

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
    alt: "A pair of olive leather slides resting on pale stone blocks",
  },
  {
    name: "Accessories",
    copy: "Jewelry, bags, scarves, hats and more",
    src: "/photos/beads-bowl.jpg",
    alt: "Wooden beads and a carved bowl on a stack of books",
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
    alt: "A potter shaping a calabash bowl among rows of finished vessels",
  },
] as const;

const reasons: readonly [BrandIconName, string, string][] = [
  [
    "globe",
    "Global reach",
    "Reach customers in the U.S. and beyond through a curated marketplace.",
  ],
  [
    "people",
    "Support for growth",
    "Resources, storytelling, and marketing support to help your brand thrive.",
  ],
  [
    "bag",
    "Brand visibility",
    "Show your work alongside a community of exceptional African designers.",
  ],
  [
    "leaf",
    "Purpose-driven",
    "Join a platform that celebrates culture, creates economic opportunity, and supports lasting impact.",
  ],
];

export default function DesignersPage() {
  return (
    <>
      <section className="grid min-h-[min(78svh,44rem)] grid-cols-[1fr_1.1fr] max-[900px]:grid-cols-1">
        <div className="flex items-center px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(3rem,7vw,6rem)]">
          <div className="max-w-136">
            <h1 className="mb-6 max-w-[12ch]">
              Designers, let&rsquo;s build together.
            </h1>
            <p className="mb-9 max-w-[42ch] text-[1.05rem] text-ink/75">
              A global platform for African designers, makers, and artisans to
              share their creativity, culture, and craftsmanship with the
              world.
            </p>
            <Link className={buttonGold} href="/designers/apply">
              Apply to join
            </Link>
            <p
              className={`${scriptAccent} mb-0 mt-10 max-w-[18ch] text-ink`}
              aria-hidden="true"
            >
              Different designers. A more connected world.
            </p>
          </div>
        </div>
        <figure className="relative m-0 overflow-hidden max-[900px]:order-first max-[900px]:min-h-88">
          <Image
            className="object-cover"
            src="/photos/designer-studio.jpg"
            alt="Designer measuring patterned cloth in her studio"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 55vw"
          />
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
          <p
            className={`${scriptFeature} m-0 text-paper max-[900px]:order-2`}
            aria-hidden="true"
          >
            African talent.
            <br />
            Global impact.
          </p>
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
          <h2 id="looking-for" className="mb-3">
            What we&rsquo;re looking for
          </h2>
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
              <div className="relative hover:scale-105 transition-transform duration-300 aspect-4/5 overflow-hidden rounded-md">
                <Image
                  className="object-cover transition-transform duration-300"
                  src={category.src}
                  alt={category.alt}
                  fill
                  sizes="(max-width: 1000px) 62vw, 20vw"
                />
              </div>
              <figcaption className="mt-4">
                <h3 className="mb-1 text-[1.3rem]">{category.name}</h3>
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
        <div className="container grid grid-cols-[3fr_1fr] items-start gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1">
          <div>
            <h2 id="why-join" className="mb-9">
              Why join Eighteen Nineteen Twenty?
            </h2>
            <div className="grid grid-cols-4 gap-px bg-ink/12 max-[820px]:grid-cols-2 max-[480px]:grid-cols-1">
              {reasons.map(([icon, title, copy]) => (
                <article
                  className="bg-paper px-6 py-3 max-[820px]:py-6 max-[480px]:px-0"
                  key={title}
                >
                  <span className="mb-5 inline-flex size-14 items-center justify-center rounded-full bg-terracotta text-paper">
                    <BrandIcon className="size-7" name={icon} />
                  </span>
                  <h3 className="mb-2 text-[1.35rem]">{title}</h3>
                  <p className="mb-0 text-[0.95rem] text-ink/75">{copy}</p>
                </article>
              ))}
            </div>
          </div>
          <blockquote
            className={`${scriptAccent} m-0 border-t border-ink/12 pt-6 text-ink max-[900px]:max-w-[22ch]`}
          >
            <p className="mb-0">
              &ldquo;Extraordinary designers. A more connected world.&rdquo;
            </p>
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
        <div aria-hidden="true" className="absolute inset-0 z-1 bg-gradient-to-b from-ink/30 via-ink/74 to-ink/45" />
        <div className="container relative z-2">
          <h2 className="mx-auto mb-6 max-w-[18ch] text-paper">
            Join our community of visionary designers
          </h2>
          <Link className={buttonGold} href="/designers/apply">
            Apply to join
          </Link>
        </div>
      </section>
    </>
  );
}
