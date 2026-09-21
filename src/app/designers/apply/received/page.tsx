import type { Metadata } from "next";
import Link from "next/link";
import { button } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Application Received",
  robots: { index: false, follow: false },
};

export default async function ReceivedPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; simulated?: string }>;
}) {
  const { reference, simulated } = await searchParams;
  return (
    <section className="flex min-h-[70svh] items-center justify-center py-12 text-center">
      <div className="narrow">
        <div
          className="mb-6 inline-flex size-20 items-center justify-center rounded-full border border-ink/45 font-display text-[2.2rem]"
          aria-hidden="true"
        >
          ✓
        </div>
        <h1 className="mb-4 text-[clamp(3rem,8vw,6rem)]">
          Your work is with us.
        </h1>
        <p className="mx-auto max-w-[52ch]">
          We have received your application. Our team reviews complete
          submissions within five business days and will contact you by email.
        </p>
        {simulated ? (
          <p className="mx-auto mt-4 max-w-[52ch] rounded-md border border-gold/45 bg-gold/18 px-4 py-3 text-[0.9rem]">
            Demonstration mode: this submission was simulated, so nothing was
            sent or stored.
          </p>
        ) : null}
        {reference ? (
          <div className="mb-9 mt-4.5 inline-block border-y border-ink px-6 py-3 font-bold tracking-[0.02em]">
            Reference: {reference}
          </div>
        ) : null}
        <div>
          <Link className={button} href="/">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
