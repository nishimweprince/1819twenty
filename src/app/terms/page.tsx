import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="narrow py-18 pb-24 max-[700px]:py-14 max-[700px]:pb-18 [&_h1]:text-[clamp(3rem,7vw,5.5rem)] [&_h2]:mt-9 [&_h2]:text-3xl [&_li]:max-w-[72ch] [&_p]:max-w-[72ch]">
      <h1>Website terms</h1>
      <div className="mb-9 rounded-md border border-gold/45 bg-gold/14 px-6 py-4.5"><strong>Legal review required.</strong> This operational draft must be approved before production launch.</div>
      <p>Last updated: September 18, 2026</p>
      <h2>About this website</h2>
      <p>This Phase 1 website introduces Eighteen Nineteen Twenty and accepts expressions of interest from visitors and independent designers. It does not yet offer products for sale.</p>
      <h2>Designer applications</h2>
      <p>Submitting an application does not create a partnership, guarantee acceptance, or obligate either party to enter into a commercial relationship. Information supplied must be accurate and submitted by someone authorized to represent the brand.</p>
      <h2>Creative rights</h2>
      <p>Applicants retain ownership of submitted materials. By applying, an applicant permits us to review those materials internally for partnership evaluation. We will not publish application materials without separate permission.</p>
      <h2>Contact</h2>
      <p>Questions about these terms can be sent to <a href="mailto:hello@1819twenty.com">hello@1819twenty.com</a>.</p>
    </article>
  );
}
