import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./nav-link";
import { NewsletterForm } from "./newsletter-form";

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
    <>
      <div
        data-ground="ink"
        className="bg-ink px-4 py-[0.42rem] text-center text-[0.72rem] tracking-[0.03em] text-paper"
      >
        People. Places. Pieces. Purpose.
      </div>
      <header className="sticky top-0 z-40 border-b border-ink/12 bg-paper/88 backdrop-blur-md">
        <div className="container grid min-h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center max-[820px]:grid-cols-[1fr_auto] max-[430px]:min-h-16 max-[430px]:gap-x-3">
          <Link
            className="inline-flex items-center justify-self-start no-underline"
            href="/"
            aria-label="Eighteen Nineteen Twenty home"
          >
            <Image
              className="block h-10 w-auto max-[430px]:h-[2.2rem]"
              src="/nav-mark.png"
              alt="Eighteen Nineteen Twenty"
              width={400}
              height={450}
              priority
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
          <Link
            className="justify-self-end text-[0.85rem] font-semibold no-underline underline-offset-4 hover:underline max-[820px]:hidden"
            href="/#join"
          >
            Join our community
          </Link>
          <details className="relative justify-self-end min-[821px]:hidden">
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
    </>
  );
}

export function SocialLinks() {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5" aria-label="Social media">
      {socials.map((social) => (
        <a
          className="inline-flex size-10 items-center justify-center rounded-full border border-paper/45 text-paper no-underline transition-colors duration-150 hover:border-paper hover:bg-paper/12"
          href={social.href}
          key={social.label}
          aria-label={social.label}
          rel="noreferrer"
          target="_blank"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
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
    <footer
      data-ground="ink"
      className="bg-ink pb-6 pt-18 text-paper max-[700px]:pt-14"
    >
      <div className="container">
        <div className="grid grid-cols-[1fr_1.1fr_auto] items-start gap-9 pb-9 max-[900px]:grid-cols-1 max-[900px]:gap-12">
          <div className="flex items-center gap-4">
            <Image
              className="h-18 w-auto"
              src="/footer-logo.png"
              alt=""
              width={554}
              height={525}
            />
            <div>
              <div className="font-display text-[1.35rem] leading-tight">
                Eighteen Nineteen Twenty
              </div>
              <p className="mb-0 mt-1.5 max-w-72 text-[0.85rem] text-paper/66">
                Fashion and home rooted in heritage.
              </p>
            </div>
          </div>

          <div className="border-x border-paper/16 px-9 max-[900px]:border-x-0 max-[900px]:px-0">
            <h2 className="mb-3.5 font-display text-[1.2rem]">
              Join our community
            </h2>
            <NewsletterForm variant="footer" />
            <SocialLinks />
          </div>

          <p className="m-0 grid justify-items-end gap-0.5 text-right font-display text-[1.15rem] leading-tight text-paper/82 max-[900px]:justify-items-start max-[900px]:text-left">
            <span>Timeless roots</span>
            <span>Modern living</span>
          </p>
        </div>

        <div className="flex justify-between gap-6 border-t border-paper/20 pt-4.5 text-[0.8rem] text-paper/66 max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-2">
          <nav className="flex flex-wrap gap-5" aria-label="Footer navigation">
            <Link
              className="text-paper/80 no-underline hover:text-paper hover:underline"
              href="/about"
            >
              Our Story
            </Link>
            <Link
              className="text-paper/80 no-underline hover:text-paper hover:underline"
              href="/designers"
            >
              Designers
            </Link>
            <Link
              className="text-paper/80 no-underline hover:text-paper hover:underline"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="text-paper/80 no-underline hover:text-paper hover:underline"
              href="/terms"
            >
              Terms
            </Link>
          </nav>
          <span>
            © {new Date().getFullYear()} Eighteen Nineteen Twenty. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
