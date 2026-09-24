"use client";

import { useState } from "react";
import Link from "next/link";
import { button, buttonSecondary } from "@/lib/styles";

const heading = "mb-4 text-[clamp(2.6rem,7vw,5rem)]";

export function UnsubscribeConfirm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function confirm() {
    setStatus("working");
    setMessage("");
    try {
      const response = await fetch(
        `/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
        { method: "POST" },
      );
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(result.message ?? "Could not unsubscribe.");
      setStatus("done");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not unsubscribe. Try again.",
      );
      setStatus("error");
    }
  }

  if (status === "done")
    return (
      <div role="status">
        <h1 className={heading}>You&apos;ve been unsubscribed.</h1>
        <p className="mx-auto mb-8 max-w-[52ch]">
          We won&apos;t send any more community emails to{" "}
          <strong className="break-all">{email}</strong>. You can join again
          from the home page at any time.
        </p>
        <Link className={buttonSecondary} href="/">
          Return home
        </Link>
      </div>
    );

  return (
    <div>
      <h1 className={heading}>Unsubscribe from community emails?</h1>
      <p className="mx-auto mb-8 max-w-[52ch]">
        We&apos;ll stop sending updates to{" "}
        <strong className="break-all">{email}</strong>.
      </p>
      <button
        type="button"
        className={button}
        onClick={confirm}
        disabled={status === "working"}
      >
        {status === "working" ? "Unsubscribing" : "Unsubscribe"}
      </button>
      <p
        className="mt-4 min-h-6 text-[0.9rem] font-semibold text-danger"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}
