import type { Metadata } from "next";
import Link from "next/link";
import { UnsubscribeConfirm } from "@/components/unsubscribe-confirm";
import { verifyUnsubscribeToken } from "@/lib/security";
import { buttonSecondary } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

// Unsubscribing takes a click rather than happening on load, because mail
// security scanners open every link in an email.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const email = verifyUnsubscribeToken(token);

  return (
    <section className="flex min-h-[70svh] items-center justify-center py-12 text-center">
      <div className="narrow">
        {email ? (
          <UnsubscribeConfirm token={token} email={email} />
        ) : (
          <>
            <h1 className="mb-4 text-[clamp(2.6rem,7vw,5rem)]">
              This link doesn&apos;t work.
            </h1>
            <p className="mx-auto mb-8 max-w-[52ch]">
              It may have been copied only in part. Use the unsubscribe link
              from the email again, or write to{" "}
              <a href="mailto:hello@1819twenty.com">hello@1819twenty.com</a> and
              we&apos;ll remove you.
            </p>
            <Link className={buttonSecondary} href="/">
              Return home
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
