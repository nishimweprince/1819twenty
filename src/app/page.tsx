import Image from "next/image";
import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { button, ceremonial, goldRule, scriptAccent } from "@/lib/styles";

const pillars: readonly [BrandIconName, string, string][] = [
  ["globe", "Personally curated", "Thoughtfully selected by us, for you."],
  ["diamond", "Directly authentic", "From independent designers across Africa."],
  ["leaf", "Transparent pricing", "No surprise fees. Duties included."],
];

const collections = [
  { name: "Fashion", image: "/photos/fashion-portrait.jpg", alt: "Woman wearing an indigo and amber printed dress" },
  { name: "Home", image: "/photos/indigo-throw.jpg", alt: "Indigo throw with handmade vessels and baskets" },
  { name: "Décor", image: "/photos/interior-decor.jpg", alt: "Woven basket and patterned textiles in a warm interior" },
  { name: "Accessories", image: "/photos/beads-bowl.jpg", alt: "Wooden beads and a carved bowl on a stack of books" },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[min(78svh,46rem)] items-center justify-center overflow-hidden py-12 max-[700px]:min-h-[42rem]">
        <Image
          src="/photos/home-hero.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-paper)_10%,rgba(245,236,223,0.95)_38%,rgba(245,236,223,0)_76%)] max-[700px]:bg-paper/84"
        />
        <div className="container relative z-1 flex flex-col items-center text-center">
          <Image
            src="/hero-emblem.png"
            alt=""
            width={564}
            height={535}
            priority
            className="mb-2 h-auto w-[clamp(9rem,16vw,13rem)]"
          />
          <h1 className="mb-3 max-w-[20ch] text-[clamp(2.5rem,5.5vw,5rem)]">
            Eighteen Nineteen Twenty
          </h1>
          <p className={`${ceremonial} mb-7 max-w-[55ch] leading-[1.8]`}>
            Fashion and home rooted in heritage — our story, designed for your style.
          </p>
          <NewsletterForm />
        </div>
        <p className={`${scriptAccent} absolute bottom-8 right-[5vw] z-1 mb-0 max-w-[8ch] text-center text-ink max-[900px]:hidden`} aria-hidden="true">
          Global design. Lasting impact.
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
            <div>
              <h2 id="collection-title" className="mb-3">The collection</h2>
              <span className={goldRule} aria-hidden="true" />
            </div>
            <p className={`${ceremonial} mb-0 text-ink/75`}>Coming soon</p>
          </div>
          <div className="grid grid-cols-4 gap-5 max-[700px]:grid-cols-2 max-[700px]:gap-3">
            {collections.map((item) => (
              <figure key={item.name} className="m-0">
                <div className="relative aspect-4/5 overflow-hidden rounded-md">
                  <Image src={item.image} alt={item.alt} fill className="object-cover" sizes="(max-width: 700px) 50vw, 25vw" />
                </div>
                <figcaption className="pt-3">
                  <h3 className="mb-0.5 text-[1.25rem]">{item.name}</h3>
                  <p className="mb-0 text-[0.9rem] text-ink/75">Coming soon</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-h-96 grid-cols-[1fr_1.2fr_1fr] border-t border-ink/12 max-[900px]:grid-cols-1" aria-labelledby="more-than-name">
        <div className="relative min-h-96 overflow-hidden max-[900px]:min-h-64">
          <Image src="/photos/savanna.jpg" alt="Savanna landscape at sunset" fill className="object-cover" sizes="(max-width: 900px) 100vw, 33vw" />
          <span className={`${scriptAccent} absolute left-7 top-7 max-w-[7ch] text-center text-paper [text-shadow:0_2px_12px_#172a3a]`} aria-hidden="true">Pieces with a purpose</span>
        </div>
        <div className="flex flex-col items-start justify-center bg-paper-hi px-[clamp(2rem,5vw,5rem)] py-16">
          <h2 id="more-than-name" className="mb-4">More than a name</h2>
          <span className={`${goldRule} mb-6`} aria-hidden="true" />
          <p className="max-w-[48ch]">Eighteen Nineteen Twenty carries three family birthdays and a belief in a more connected, more beautiful world through design.</p>
          <Link href="/about" className={`${button} mt-2`}>Read our story</Link>
        </div>
        <div className="relative min-h-96 overflow-hidden max-[900px]:min-h-64">
          <Image src="/photos/fashion-portrait.jpg" alt="Woman in a printed dress and straw hat" fill className="object-cover object-[center_30%]" sizes="(max-width: 900px) 100vw, 33vw" />
          <span className={`${ceremonial} absolute bottom-6 right-5 mb-0 bg-paper/85 px-3 py-4 leading-[1.8] [writing-mode:vertical-rl]`} aria-hidden="true">People. Places. Pieces. Purpose.</span>
        </div>
      </section>
    </>
  );
}
