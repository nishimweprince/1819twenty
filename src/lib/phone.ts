import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

/**
 * Imports from libphonenumber-js directly rather than react-phone-number-input
 * so the shared validation schema can use it on the server without React.
 */

/**
 * Formats a stored number for display. Numbers saved before phone input was
 * normalized are shown as they were entered rather than dropped.
 */
export function formatPhone(value?: string | null) {
  if (!value) return "";
  return parsePhoneNumberFromString(value)?.formatInternational() ?? value;
}

/** A number that can actually be dialled, written with its country code. */
export function isPhoneValid(value: string) {
  return isValidPhoneNumber(value);
}

/**
 * Canonicalizes a number to E.164 so it is stored the same way however it was
 * typed. Values that cannot be parsed are returned trimmed for validation to
 * reject.
 */
export function normalizePhone(value: string) {
  const trimmed = value.trim();
  const parsed = parsePhoneNumberFromString(trimmed);
  return parsed?.isValid() ? parsed.number : trimmed;
}
