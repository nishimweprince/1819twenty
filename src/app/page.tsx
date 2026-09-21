import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { buttonHome } from "@/lib/styles";

const sideNote = "flex items-center justify-center self-stretch font-display text-[1.05rem] tracking-[0.02em] [writing-mode:vertical-rl] max-[820px]:hidden";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[calc(100svh-6.5rem)] overflow-hidden">
        <div className="container relative z-1 grid min-h-[calc(100svh-6.5rem)] grid-cols-[7rem_minmax(0,1fr)_7rem] items-center py-12 max-[820px]:grid-cols-1">
          <div className={sideNote}>Independent design, directly connected</div>
          <div className="flex flex-col items-center text-center">
            <div className="w-[min(420px,74vw)] animate-settle">
              <Image
                className="h-auto w-full"
                src="/hero-emblem.png"
                alt="Eighteen Nineteen Twenty"
                width={564}
                height={535}
                priority
                sizes="(max-width: 700px) 74vw, 420px"
              />
            </div>
            <p className="mx-auto mb-4.5 mt-6 max-w-[26ch] font-display text-[clamp(1.35rem,2.6vw,2.05rem)] leading-tight">
              Fashion and home rooted in heritage. Our story, designed for your style.
            </p>
            <p className="mb-9 max-w-[48ch] text-ink/75">
              A considered collection from independent African designers is on its way.
            </p>
            <NewsletterForm />
          </div>
          <div className={`${sideNote} rotate-180`}>Timeless roots. Modern living.</div>
        </div>
      </section>

      <section className="grid grid-cols-2 border-t border-ink/12 max-[820px]:grid-cols-1" aria-label="Our purpose">
        <div className="flex min-h-128 flex-col items-start justify-center p-[clamp(3rem,8vw,7rem)] max-[820px]:min-h-auto max-[820px]:px-6 max-[820px]:py-18">
          <h2>A name with meaning.</h2>
          <p className="max-w-[48ch]">
            Eighteen Nineteen Twenty carries three family birthdays and one shared belief: thoughtful design can connect people, places, and purpose.
          </p>
          <Link className={`${buttonHome} mt-2`} href="/about">Read our story</Link>
        </div>
        <div
          data-ground="ink"
          className="relative flex min-h-128 flex-col items-center justify-center overflow-hidden bg-ink p-[clamp(3rem,8vw,7rem)] text-paper max-[820px]:min-h-auto max-[820px]:px-6 max-[820px]:py-18"
        >
          {/* Echoes the open arc that frames the numerals in the mark. */}
          <div aria-hidden="true" className="absolute size-96 rounded-full border border-gold/50" />
          <div className="relative font-display text-[clamp(4rem,10vw,8rem)] leading-none tracking-[-0.08em]">18 · 19 · 20</div>
          <div className="relative mt-6 border-t border-gold pt-4.5 text-center">Three birthdays. Three people. One family.</div>
        </div>
      </section>

      <section className="border-t border-ink/12 py-24 max-[700px]:py-18">
        <div className="container grid grid-cols-2 items-center gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1">
          <figure className="m-0">
            <div className="relative aspect-4/5 overflow-hidden rounded-md max-[900px]:aspect-3/2">
              <Image className="object-cover" src="/photos/textiles.jpg" alt="Handcrafted African textiles in rich patterns" fill sizes="(max-width: 900px) 100vw, 46vw" />
            </div>
          </figure>
          <div>
            <h2 className="mb-4.5">Design that carries a story</h2>
            <p>
              Every piece comes directly from independent designers across Africa, chosen for the craft and the culture it holds. When the collection opens, you will meet the makers behind the work.
            </p>
            <Link className={`${buttonHome} mt-2`} href="/about">Read our story</Link>
          </div>
        </div>
      </section>
    </>
  );
}
