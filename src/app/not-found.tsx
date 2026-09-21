import Link from "next/link";
import { button } from "@/lib/styles";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center justify-center py-12 text-center">
      <div className="narrow">
        <div
          className="mb-6 inline-flex size-20 items-center justify-center rounded-full border border-ink/45 font-display text-[2.2rem]"
          aria-hidden="true"
        >
          20
        </div>
        <h1 className="mb-4 text-[clamp(3rem,8vw,6rem)]">
          This path ends here.
        </h1>
        <p className="mx-auto mb-9 max-w-[52ch]">
          The page may have moved, or it may belong to a collection that has not
          launched yet.
        </p>
        <Link className={button} href="/">
          Return home
        </Link>
      </div>
    </section>
  );
}
