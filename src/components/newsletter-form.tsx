"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "./ui/checkbox";
import { Turnstile } from "./turnstile";
import { button, input } from "@/lib/styles";

const schema = z.object({
  email: z.email("Enter a valid email address."),
  consent: z
    .boolean()
    .refine(
      (value) => value,
      "Please agree to receive updates before joining.",
    ),
  website: z.string().optional(),
});
type NewsletterValues = z.infer<typeof schema>;

export function NewsletterForm({
  variant = "hero",
}: {
  variant?: "hero" | "footer";
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleToken = useCallback(
    (token: string) => setTurnstileToken(token),
    [],
  );
  const emailId = `${variant}-community-email`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", consent: false, website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage("");
    setStatus("idle");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          consent: values.consent,
          consentedAt: new Date().toISOString(),
          consentCopyVersion: "2026-09-18",
          source: variant === "footer" ? "/footer" : "/",
          website: values.website ?? "",
          turnstileToken,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(result.message ?? "Could not join the list.");
      setMessage("Check your inbox to confirm your subscription.");
      setStatus("success");
      reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not join the list. Try again.",
      );
      setStatus("error");
    }
  });

  if (variant === "footer") {
    return (
      <form className="w-full max-w-sm" onSubmit={onSubmit} noValidate>
        <div className="flex items-stretch overflow-hidden rounded-md border border-paper/45 bg-paper/12 focus-within:border-gold">
          <label className="sr-only" htmlFor={emailId}>
            Email address
          </label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            placeholder="Your email address"
            aria-invalid={Boolean(errors.email)}
            className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-2.5 text-paper placeholder:text-paper/66 focus-visible:outline-none"
            {...register("email")}
          />
          <button
            className="flex flex-none cursor-pointer items-center justify-center border-0 bg-gold px-3.5 text-ink transition-colors duration-150 hover:bg-gold-lift disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
            aria-label="Join our community"
          >
            <svg
              viewBox="0 0 20 20"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4 10h11M11 5l5 5-5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <label className="mt-3 grid grid-cols-[auto_1fr] items-center gap-2 text-[0.76rem] leading-snug text-paper/78">
          <Checkbox
            aria-invalid={Boolean(errors.consent)}
            {...register("consent")}
          />
          <span>
            I agree to receive updates. See our{" "}
            <Link className="text-paper" href="/privacy">
              privacy notice
            </Link>
            .
          </span>
        </label>
        <div
          className="absolute left-[-10000px] h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>
        <Turnstile onToken={handleToken} />
        <p
          // The footer sits on a dark ground where --color-danger is too
          // dark to read, so errors use danger lightened for dark grounds.
          className={`mt-2 min-h-4 text-[0.78rem] ${status === "error" || !message ? "font-semibold text-[#d1a095]" : "text-paper/82"}`}
          role="status"
          aria-live="polite"
        >
          {message || (errors.email?.message ?? errors.consent?.message ?? "")}
        </p>
      </form>
    );
  }

  // One centered column, declared once on the form. Every child fills it, so
  // nothing re-states a max-width and nothing drifts left.
  return (
    <form
      className="mx-auto w-full max-w-136"
      id="join"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="flex gap-2 max-[620px]:flex-col max-[620px]:gap-2.5">
        <label className="sr-only" htmlFor={emailId}>
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          placeholder="Email address"
          aria-invalid={Boolean(errors.email)}
          className={`${input} min-h-12`}
          {...register("email")}
        />
        <button
          className={`${button} min-h-12 flex-none whitespace-nowrap max-[620px]:w-full`}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Joining" : "Join our community"}
        </button>
      </div>
      {errors.email ? (
        <p className="mt-2 text-left text-[0.8rem] font-semibold text-danger">
          {errors.email.message}
        </p>
      ) : null}
      <label className="mt-3.5 grid grid-cols-[auto_1fr] items-start gap-2.5 text-left text-[0.8rem] leading-snug [&>span:first-child]:mt-0.5">
        <Checkbox
          aria-invalid={Boolean(errors.consent)}
          {...register("consent")}
        />
        <span>
          I agree to receive email updates and understand I can unsubscribe at
          any time. See our <Link href="/privacy">privacy notice</Link>.
        </span>
      </label>
      {errors.consent ? (
        <p className="mt-2 text-left text-[0.8rem] font-semibold text-danger">
          {errors.consent.message}
        </p>
      ) : null}
      <div
        className="absolute left-[-10000px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>
      <Turnstile onToken={handleToken} align="center" />
      <p
        className={`mt-3 text-center text-[0.85rem] ${status === "error" ? "font-semibold text-danger" : "text-ink/75"}`}
        role="status"
        aria-live="polite"
      >
        {message || "Double opt-in keeps the list useful and permission-based."}
      </p>
    </form>
  );
}
