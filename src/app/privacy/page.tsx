import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="narrow py-18 pb-24 max-[700px]:py-14 max-[700px]:pb-18 [&_h1]:text-[clamp(3rem,7vw,5.5rem)] [&_h2]:mt-9 [&_h2]:text-3xl [&_li]:max-w-[72ch] [&_p]:max-w-[72ch]">
      <h1>Privacy notice</h1>
      <div className="mb-9 rounded-md border border-gold/45 bg-gold/14 px-6 py-4.5">
        <strong>Legal review required.</strong> This operational draft must be
        approved before production launch.
      </div>
      <p>Last updated: September 18, 2026</p>
      <h2>Information we collect</h2>
      <p>
        We collect an email address when you join our community. Designer
        applicants also provide business contact information, collection
        details, confirmations about their commercial capabilities, and a
        lookbook or product image.
      </p>
      <h2>How we use it</h2>
      <p>
        Newsletter details are used only after marketing consent is confirmed.
        Application details are used to assess potential partnerships,
        communicate about the application, and protect the integrity of our
        submission process.
      </p>
      <h2>Service providers</h2>
      <p>
        We use carefully selected providers for hosting, private application
        storage, transactional email, marketing consent, and bot protection.
        They process information only to deliver those services.
      </p>
      <h2>Retention and requests</h2>
      <p>
        Incomplete applications are removed after seven days. Submitted
        applications are retained for up to twelve months unless a different
        period is required for an active partnership or legal obligation. To
        request access, correction, or deletion, email{" "}
        <a href="mailto:hello@1819twenty.com">hello@1819twenty.com</a>.
      </p>
    </article>
  );
}
