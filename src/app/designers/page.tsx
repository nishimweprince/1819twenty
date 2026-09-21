import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { button } from "@/lib/styles";

export const metadata: Metadata = {
  title: "For Designers",
  description:
    "Apply to share your fashion and home designs with customers in the United States.",
};

const values = [
  [
    "$",
    "Wholesale purchase per unit",
    "We purchase each item at your agreed wholesale price, without asking you to consign inventory.",
  ],
  [
    "↗",
    "Ship directly to customers",
    "You hold your inventory and ship confirmed orders directly, so there is no separate warehouse handoff.",
  ],
  [
    "7",
    "Paid weekly",
    "Receive regular payment without an upfront fee or consignment risk.",
  ],
  [
    "US",
    "Reach U.S. customers",
    "We support the customer-facing experience so you can focus on design and fulfillment.",
  ],
] as const;

const steps = [
  [
    "01",
    "Apply",
    "Tell us about your brand, collection, production capacity, and story.",
  ],
  [
    "02",
    "Review",
    "Our team reviews complete applications within five business days.",
  ],
  [
    "03",
    "Prepare to launch",
    "Selected designers can be ready for the site within two to three weeks.",
  ],
] as const;

export default function DesignersPage() {
  return (
    <>
      <section className="border-b border-ink/12 py-[clamp(4.5rem,10vw,8.5rem)]">
        <div className="container grid grid-cols-[1.35fr_0.65fr] items-end gap-9 max-[820px]:grid-cols-1">
          <div>
            <h1 className="mb-4 max-w-[12ch]">
              Bring your designs to the world.
            </h1>
            <p className="mb-0 max-w-[46ch] text-[1.05rem]">
              No inventory risk. No upfront cost. A direct path to customers who
              value where a piece comes from.
            </p>
          </div>
          <figure className="relative m-0 aspect-4/5 overflow-hidden rounded-md max-[820px]:aspect-3/2">
            <Image
              className="object-cover"
              src="/photos/maker.jpg"
              alt="A designer at work in traditional dress beside a sewing machine"
              fill
              sizes="(max-width: 820px) 100vw, 40vw"
              priority
            />
          </figure>
        </div>
      </section>

      <section className="py-24 max-[700px]:py-18">
        <div className="container grid grid-cols-2 items-center gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1">
          <div>
            <h2 className="mb-4.5">A practical partnership</h2>
            <p className="max-w-[62ch]">
              We are building a considered marketplace for independent African
              fashion and home design. Our model is straightforward, so the
              commercial relationship remains as clear as the creative one.
            </p>
          </div>
          <figure className="m-0">
            <div className="relative aspect-4/5 overflow-hidden rounded-md max-[900px]:aspect-3/2">
              <Image
                className="object-cover"
                src="/photos/weaving.jpg"
                alt="A weaver working colored threads on a traditional loom"
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
              />
            </div>
          </figure>
        </div>
        <div className="container">
          <div className="mt-9 grid grid-cols-2 gap-px border-y border-ink/12 bg-ink/12 max-[580px]:grid-cols-1">
            {values.map(([mark, title, copy]) => (
              <article
                className="grid grid-cols-[4rem_1fr] gap-4.5 bg-paper px-6 py-9"
                key={title}
              >
                <div
                  className="flex size-14 items-center justify-center rounded-full border border-ink/45 font-display text-2xl"
                  aria-hidden="true"
                >
                  {mark}
                </div>
                <div>
                  <h3 className="mb-2">{title}</h3>
                  <p className="mb-0">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/12 py-24 max-[700px]:py-18">
        <div className="container">
          <h2>Simple onboarding</h2>
          {/* A real sequence — apply, then review, then launch — so the numbering carries information. */}
          <ol className="mt-12 grid list-none grid-cols-3 gap-px border-y border-ink/12 bg-ink/12 p-0 max-[820px]:grid-cols-1">
            {steps.map(([number, title, copy]) => (
              <li className="bg-paper p-6" key={number}>
                <div className="mb-3 pt-3 font-display text-[2.6rem] leading-none">
                  {number}
                </div>
                <h3 className="mb-2">{title}</h3>
                <p className="mb-0">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container py-18">
        <div className="grid grid-cols-[1fr_auto] items-center gap-9 rounded-md border border-ink/28 bg-paper-hi p-12 max-[820px]:grid-cols-1 max-[580px]:px-6 max-[580px]:py-9">
          <div>
            <h2 className="mb-2">Minimum qualifications</h2>
            <p className="mb-0 max-w-[62ch]">
              Your collection must include at least 10 available items. Apparel
              collections must offer at least five sizes for every submitted
              style.
            </p>
          </div>
          <Link className={button} href="/designers/apply">
            Apply to join
          </Link>
        </div>
      </section>
    </>
  );
}
