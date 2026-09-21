"use client";

import Link from "next/link";
import { useEffect } from "react";
import { button, buttonSecondary } from "@/lib/styles";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="flex min-h-[70svh] items-center justify-center py-12 text-center">
      <div className="narrow">
        <div
          className="mb-6 inline-flex size-20 items-center justify-center rounded-full border border-danger font-display text-[2.2rem] text-danger"
          aria-hidden="true"
        >
          !
        </div>
        <h1 className="mb-4 text-[clamp(3rem,8vw,6rem)]">That did not load.</h1>
        <p className="mx-auto mb-9 max-w-[52ch]">
          Try this page again. If the problem continues, return home or email
          hello@1819twenty.com.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className={button} onClick={reset}>
            Try again
          </button>
          <Link className={buttonSecondary} href="/">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
