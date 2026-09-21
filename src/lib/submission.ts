/**
 * Client-safe submission helpers for the designer application form.
 *
 * When the client storage variables are absent (for example a preview without
 * provider credentials), the form simulates the send instead of failing: no
 * request leaves the browser, and the confirmation page says it was simulated.
 */

export function isStorageConfigured(env: { url?: string; anonKey?: string }): boolean {
  return Boolean(env.url && env.anonKey);
}

/** Deterministic simulated reference derived from the idempotency key. */
export function simulatedReference(idempotencyKey: string): string {
  return `SIM-${idempotencyKey.slice(0, 8).toUpperCase()}`;
}
