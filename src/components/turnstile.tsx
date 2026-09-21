"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export function Turnstile({
  onToken,
  align = "start",
}: {
  onToken: (token: string) => void;
  /** The widget sits in a centered column in the hero and a left rail in the footer. */
  align?: "start" | "center";
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const id = useId();

  useEffect(() => {
    if (!siteKey || !hostRef.current) return;
    const host = hostRef.current;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || widgetRef.current) return;
      widgetRef.current = window.turnstile.render(host, {
        sitekey: siteKey,
        theme: "light",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-eighteen-turnstile="true"]');
    if (existing) {
      if (window.turnstile) render();
      else existing.addEventListener("load", render, { once: true });
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.eighteenTurnstile = "true";
      script.addEventListener("load", render, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetRef.current && window.turnstile) window.turnstile.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [onToken, siteKey]);

  if (!siteKey) return null;
  return (
    <div
      className={`flex min-h-px ${align === "center" ? "justify-center" : "justify-start"}`}
      id={id}
      ref={hostRef}
    />
  );
}
