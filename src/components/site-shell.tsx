import Image from "next/image";
import Link from "next/link";
import { ceremonial, goldRule } from "@/lib/styles";
import { NavLink } from "./nav-link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our Story" },
  { href: "/designers", label: "Designers" },
] as const;

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/1819twenty",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/1819twenty",
    icon: "facebook",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/1819twenty",
    icon: "pinterest",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@1819twenty",
    icon: "tiktok",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@1819twenty",
    icon: "youtube",
  },
] as const;

const iconPaths: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.5c0-.8.3-1.3 1.4-1.3H16.4V5.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.2V14h2.3v7z"
      fill="currentColor"
    />
  ),
  pinterest: (
    <path
      d="M12 3.5a8.5 8.5 0 0 0-3.1 16.4c-.1-.7-.1-1.8 0-2.5l1-4.3s-.3-.5-.3-1.3c0-1.2.7-2.1 1.6-2.1.7 0 1.1.6 1.1 1.3 0 .8-.5 2-.8 3.1-.2.9.5 1.6 1.4 1.6 1.6 0 2.8-1.7 2.8-4.1 0-2.2-1.5-3.7-3.7-3.7a3.9 3.9 0 0 0-4 3.9c0 .8.3 1.6.7 2 .1.1.1.2.1.3l-.3 1c0 .2-.1.2-.3.1-1.2-.5-1.9-2.2-1.9-3.5 0-2.8 2.1-5.4 6-5.4 3.1 0 5.5 2.2 5.5 5.2 0 3.1-1.9 5.6-4.7 5.6-.9 0-1.8-.5-2.1-1l-.6 2.2c-.2.8-.7 1.7-1.1 2.3A8.5 8.5 0 1 0 12 3.5z"
      fill="currentColor"
    />
  ),
  tiktok: (
    <path
      d="M14 3.5c.3 1.9 1.4 3.3 3.3 3.6v2.4c-1.1.1-2.2-.2-3.2-.8v5.2c0 2.9-2 4.9-4.7 4.9-2.5 0-4.4-1.8-4.4-4.3 0-2.6 2.1-4.4 4.9-4.1v2.5c-.4-.1-.8-.2-1.2-.1-1 .1-1.7.8-1.6 1.9.1 1 .9 1.6 1.9 1.6 1.1 0 1.9-.8 1.9-2.1V3.5z"
      fill="currentColor"
    />
  ),
  youtube: (
    <>
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M10.5 9.2l4.2 2.8-4.2 2.8z" fill="currentColor" />
    </>
  ),
};

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/12 bg-paper/88 backdrop-blur-md">
      <div className="container flex min-h-14 items-center gap-8 max-[430px]:gap-x-3">
        <Link
          className="inline-flex flex-none items-center no-underline"
          href="/"
          aria-label="Eighteen Nineteen Twenty home"
        >
          <Image
            className="block h-9 w-auto max-[430px]:h-8"
            src="/hero-emblem.png"
            alt="Eighteen Nineteen Twenty"
            width={564}
            height={535}
            // priority
          />
        </Link>
        <nav
          className="flex gap-7 max-[820px]:hidden"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <NavLink href={item.href} key={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-7 max-[820px]:hidden">
          <Link
            className="text-[0.85rem] font-semibold no-underline underline-offset-4 hover:underline"
            href="/#join"
          >
            Join our community
          </Link>
          <p
            className={`${ceremonial} m-0 border-l border-ink/20 pl-7 text-ink/75 max-[1000px]:hidden`}
          >
            People. Places. Pieces. Purpose.
          </p>
        </div>
        <details className="relative ml-auto min-[821px]:hidden">
          <summary className="cursor-pointer list-none font-semibold max-[430px]:text-[0.9rem] [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            className="absolute right-0 top-10 grid min-w-48 rounded-md border border-ink/34 bg-paper-hi p-4 shadow-[0_12px_30px_-18px_rgba(44,62,80,0.35)]"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                className="rounded-sm p-2.5 no-underline hover:bg-ink/8"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="rounded-sm p-2.5 no-underline hover:bg-ink/8"
              href="/#join"
            >
              Join our community
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

/**
 * `tone` follows the same idiom as PhotoNote: paper on an ink ground, ink on
 * paper. `size` is the glyph size — the landing hero sets these larger than
 * the footer does.
 */
export function SocialLinks({
  tone = "paper",
  size = 21,
  className = "",
}: {
  tone?: "paper" | "ink";
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-none gap-0.5 max-[620px]:flex-wrap ${className}`}
      aria-label="Social media"
    >
      {socials.map((social) => (
        <a
          className={`inline-flex items-center justify-center rounded-sm no-underline transition-colors duration-150 ${
            tone === "ink"
              ? "text-ink/85 hover:text-ink"
              : "text-paper/85 hover:text-paper"
          }`}
          style={{ width: size * 1.7, height: size * 1.7 }}
          href={social.href}
          key={social.label}
          aria-label={social.label}
          rel="noreferrer"
          target="_blank"
        >
          <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            aria-hidden="true"
            focusable="false"
          >
            {iconPaths[social.icon]}
          </svg>
        </a>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <>
      {/* The sign-up moved to its own band on the landing page, so the footer
          is just the mark, the channels and the motto. A shade deeper than the
          band above it, as in the comp. */}
      <footer
        data-ground="ink"
        className="bg-ink-deep py-section-sm text-paper"
      >
        <div className="container grid grid-cols-[1fr_auto_1fr] items-center gap-x-9 gap-y-8 max-[820px]:grid-cols-1 max-[820px]:justify-items-center max-[820px]:text-center">
          <div className="flex items-center gap-4">
            <Image
              className="h-14 w-auto flex-none"
              src="/footer-emblem.png"
              alt=""
              width={564}
              height={535}
            />
            <div>
              <div className="font-display text-[1.2rem] leading-tight whitespace-nowrap">
                Eighteen Nineteen Twenty
              </div>
              <p className={`${ceremonial} mb-0 mt-1.5 text-paper/66`}>
                Truly original fashion and home
              </p>
            </div>
          </div>

          <div className="border-x border-paper/16 px-9 max-[820px]:border-x-0 max-[820px]:px-0">
            <SocialLinks />
          </div>

          <p
            className={`${ceremonial} m-0 grid justify-items-end gap-1.5 justify-self-end text-right text-paper/82 max-[820px]:justify-items-center max-[820px]:justify-self-center max-[820px]:text-center`}
          >
            <span>People</span>
            <span>Places</span>
            <span>Pieces</span>
            <span>Purpose</span>
            <span className={`${goldRule} mt-1`} aria-hidden="true" />
          </p>
        </div>
      </footer>

      {/* The page signs off on paper. The comp carries no links here, but the
          privacy notice and terms need a route in from every page, so they sit
          beside the copyright rather than only inside a form. */}
      <div className="bg-paper">
        <div className="container flex min-h-14 items-center justify-between gap-6 py-3 text-[0.8rem] text-ink/75 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3">
          <p className={`${ceremonial} m-0`}>Timeless roots. Modern living.</p>
          <div className="flex items-center gap-5 max-[700px]:flex-wrap">
            <Link className="no-underline hover:underline" href="/privacy">
              Privacy
            </Link>
            <Link className="no-underline hover:underline" href="/terms">
              Terms
            </Link>
            <span className="border-l border-ink/20 pl-5 max-[700px]:border-l-0 max-[700px]:pl-0">
              © {new Date().getFullYear()} Eighteen Nineteen Twenty. All rights
              reserved.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
