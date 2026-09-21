"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

/**
 * The stylesheet has always targeted `a[aria-current="page"]`, but nothing set
 * the attribute, so the current-page marker never appeared. This sets it.
 *
 * Hover draws an ink underline, the current page draws a gold one, so the two
 * states stay distinguishable while hovering the link you are already on.
 */
export function NavLink({ href, children }: { href: Route; children: React.ReactNode }) {
  const pathname = usePathname();
  const current = pathname === href;

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={
        "relative text-[0.85rem] font-semibold no-underline " +
        "after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full " +
        "after:origin-left after:scale-x-0 after:transition-transform after:duration-150 " +
        (current
          ? "after:scale-x-100 after:bg-gold"
          : "after:bg-ink/40 hover:after:scale-x-100")
      }
    >
      {children}
    </Link>
  );
}
