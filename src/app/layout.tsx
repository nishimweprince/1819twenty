import type { Metadata } from "next";
import { Bodoni_Moda, Karla, Pinyon_Script } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import "./globals.css";

const display = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const sans = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

// Handwritten accent for the short brand phrases only; never body or headings.
const script = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Eighteen Nineteen Twenty",
    template: "%s | Eighteen Nineteen Twenty",
  },
  description:
    "Truly original fashion and home, curated from Africa's most compelling designers. Launching soon — sign up to hear first.",
  openGraph: {
    title: "Eighteen Nineteen Twenty",
    description:
      "Launching soon. Truly original fashion and home, curated from Africa's most compelling designers.",
    url: siteUrl,
    siteName: "Eighteen Nineteen Twenty",
    images: [{ url: "/1000171216.png", width: 1200, height: 628 }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${script.variable}`}
    >
      <body>
        <a
          className="fixed left-4.5 top-[-5rem] z-100 bg-ink px-4 py-2.5 text-paper focus:top-4.5"
          href="#main-content"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
