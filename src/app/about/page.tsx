import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { CityStack } from "@/components/city-stack";
import { Numerals } from "@/components/numerals";
import { PatternStrip } from "@/components/pattern-strip";
import { buttonGold, ceremonial, goldRule, scriptAccent } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The meaning, purpose, and promise behind Eighteen Nineteen Twenty.",
};

const pillars: readonly [BrandIconName, string, string][] = [
  ["globe", "Personally curated", "Thoughtfully selected by us, for you."],
  ["diamond", "Directly authentic", "From independent designers across Africa."],
  ["bag", "Transparent pricing", "No surprise fees. Duties included."],
  ["sun", "Rooted in heritage", "Celebrating culture. Supporting communities."],
];

const figureFrame =
  "relative aspect-4/5 overflow-hidden rounded-md max-[900px]:aspect-3/2";
const caption = `${scriptAccent} mt-4.5 text-ink`;

export default function AboutPage() {
  return (
    <>
      <section className="grid min-h-[min(72svh,40rem)] grid-cols-2 max-[900px]:grid-cols-1">
        <div className="flex items-center px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(2.5rem,6vw,5.5rem)]">
          <div className="max-w-136">
            <Image
              className="mb-6 h-14 w-auto"
              src="/nav-mark.png"
              alt="Eighteen Nineteen Twenty"
              width={400}
              height={450}
              priority
            />
            <h1 className="mb-4.5 max-w-[16ch]">
              A name with meaning. A vision without borders.
            </h1>
            <p className="m-0 max-w-[46ch] text-[1.05rem] text-ink/75">
              Eighteen Nineteen Twenty carries the birthdays of the family
              behind it, and a belief that thoughtful design connects people,
              places, and purpose.
            </p>
          </div>
        </div>
        <figure className="relative m-0 overflow-hidden max-[900px]:order-first max-[900px]:min-h-88">
          <Image
            className="object-cover object-[center_32%]"
            src="/photos/about-hero.jpg"
            alt="A styled interior with handwoven wall baskets and a rattan basket"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </figure>
      </section>

      <section className="border-t border-ink/12 py-24 max-[700px]:py-18">
        <div className="container grid grid-cols-2 items-center gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1">
          <div>
            <h2 className="mb-4.5">More than a name</h2>
            <div className="max-w-[62ch]">
              <p>
                What began as a personal meaning has grown into a wider purpose:
                to celebrate African creativity, craftsmanship, and culture, and
                to bring it into homes and wardrobes around the world.
              </p>
              <p>
                We believe design can connect people, places, and purpose, and
                we are just getting started.
              </p>
            </div>
          </div>
          <figure className="m-0">
            <div className={figureFrame}>
              <Image
                className="object-cover"
                src="/photos/about-story.jpg"
                alt="Indigo-dyed cloth drying in the open air"
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
              />
            </div>
            <figcaption className={caption}>
              Timeless pieces, meaningful impact.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The one bold moment on the page: numerals on ink, framed by the
          mudcloth strip. Everything around it stays on paper and hairlines. */}
      <section
        data-ground="ink"
        className="grid grid-cols-[minmax(0,1fr)_7rem] bg-ink text-paper max-[820px]:grid-cols-1"
        aria-labelledby="why-these-numbers"
      >
        <div className="grid grid-cols-[1fr_1.15fr] items-center gap-[clamp(2rem,5vw,4.5rem)] py-[clamp(4rem,7vw,6rem)] pl-[max(1.5rem,calc((100vw-var(--container))/2))] pr-[clamp(1.5rem,5vw,4.5rem)] max-[820px]:grid-cols-1 max-[820px]:px-[calc((100vw-var(--container))/2)]">
          <div>
            <h2 id="why-these-numbers" className="mb-4">
              Why these numbers?
            </h2>
            <span className={`${goldRule} mb-6`} aria-hidden="true" />
            <p className="mb-0 max-w-[46ch] text-paper/82">
              Eighteen. Nineteen. Twenty. Three birthdays, three people, one
              family. They stand for our past, our present, and the future we
              are building together — a reminder that everything we do is
              rooted in family, guided by purpose, and made to create a more
              connected, more beautiful world.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Numerals className="text-[clamp(4.2rem,9vw,8.5rem)]" />
            <span className={`${goldRule} my-6`} aria-hidden="true" />
            <p className={`${ceremonial} mb-0 text-paper/82`}>
              Three birthdays, three people, one family.
            </p>
          </div>
        </div>
        <div className="max-[820px]:h-12">
          <PatternStrip />
        </div>
      </section>

      <section
        className="py-24 max-[700px]:py-18"
        aria-labelledby="our-journey"
      >
        <div className="container grid grid-cols-[1.1fr_0.9fr_0.9fr_auto] items-center gap-[clamp(1.5rem,3.5vw,3rem)] max-[1100px]:grid-cols-[1fr_1fr] max-[900px]:grid-cols-1">
          <div className="max-[1100px]:col-span-2 max-[900px]:col-span-1">
            <h2 id="our-journey" className="mb-4.5">
              Our journey, from us to the continent
            </h2>
            <div className="max-w-[52ch]">
              <p>
                It began at home, with a deep appreciation for the beauty and
                richness of African design. A love of travel, culture, and
                craftsmanship grew into a commitment: connect exceptional
                African designers with a global audience, starting in the
                United States.
              </p>
              <p className="mb-0">
                We work directly with independent designers across Africa and
                share their stories and creations with the world.
              </p>
            </div>
          </div>
          <CityStack />
          <figure className="m-0">
            <div className={figureFrame}>
              <Image
                className="object-cover"
                src="/photos/weaving.jpg"
                alt="A weaver working colored threads on a traditional loom"
                fill
                sizes="(max-width: 900px) 100vw, 30vw"
              />
            </div>
            <figcaption className={`${caption} min-[1101px]:hidden`}>
              Different places. Shared purpose.
            </figcaption>
          </figure>
          {/* Same vertical side-note idiom as the home hero. Hidden when the
              grid collapses; the figcaption above carries the phrase then. */}
          <p
            className={`${scriptAccent} m-0 self-stretch text-ink [writing-mode:vertical-rl] max-[1100px]:hidden`}
            aria-hidden="true"
          >
            Different places. Shared purpose.
          </p>
        </div>
      </section>

      <section
        className="border-t border-ink/12 py-24 max-[700px]:py-18"
        aria-labelledby="what-we-do"
      >
        <div className="container grid grid-cols-[1fr_3fr] gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1">
          <div>
            <h2 id="what-we-do" className="mb-4.5">
              What we do
            </h2>
            <p className="mb-0 max-w-[32ch]">
              We curate fashion and home from independent African designers and
              make it easy for you to shop with confidence.
            </p>
          </div>
          <div className="border-l border-ink/12 pl-[clamp(2rem,5vw,4.5rem)] max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pl-0 max-[900px]:pt-12">
            <h2 className="mb-9">Our promise</h2>
            {/* gap-px over an ink wash draws the rules, so the grid stays correct
                at every breakpoint without per-child border rules. */}
            <div className="grid grid-cols-4 gap-px bg-ink/12 max-[820px]:grid-cols-2 max-[480px]:grid-cols-1">
              {pillars.map(([icon, title, copy]) => (
                <article className="bg-paper px-6 py-3 max-[820px]:py-6 max-[480px]:px-0" key={title}>
                  <BrandIcon className="mb-4 size-9 text-terracotta" name={icon} />
                  <h3 className="mb-2 text-[1.35rem]">{title}</h3>
                  <p className="mb-0 text-[0.95rem] text-ink/75">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        data-ground="ink"
        className="relative flex min-h-[min(52svh,30rem)] items-center justify-center overflow-hidden text-center"
      >
        <Image
          className="object-cover object-[center_55%]"
          src="/photos/landscape.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        {/* ink/78 keeps the heading at 4.82:1 even over the lightest part of the photo */}
        <div aria-hidden="true" className="absolute inset-0 z-1 bg-ink/78" />
        <div className="container relative z-2">
          <h2 className="mx-auto mb-6 max-w-[20ch] text-paper">
            Fashion and home rooted in heritage. Our story, designed for your
            style.
          </h2>
          <Link className={buttonGold} href="/designers">
            Explore the collection
          </Link>
        </div>
      </section>
    </>
  );
}
