"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import PhoneInputWithCountry, {
  getCountryCallingCode as getCallingCode,
  type Country,
} from "react-phone-number-input/core";
import type { MetadataJson } from "libphonenumber-js/core";
import defaultMetadata from "libphonenumber-js/metadata.min.json";
import countryLabels from "react-phone-number-input/locale/en.json";
import { input as inputClass } from "@/lib/styles";
import { Combobox } from "./combobox";

/**
 * Many countries (Rwanda, Kenya, Nigeria, the UK) mark their leading 0 as
 * mandatory for national formatting, so `788478652` would stay unformatted
 * until the 0 is typed. Marking it optional formats the number either way;
 * parsing, validation and the stored E.164 value are unaffected.
 */
const metadata: MetadataJson = (() => {
  const copy = structuredClone(defaultMetadata) as unknown as {
    countries: Record<string, unknown[]>;
  };
  for (const country of Object.values(copy.countries)) {
    // Index 4 holds the formats, or 0 for a country without any.
    const formats = country[4];
    if (!Array.isArray(formats)) continue;
    for (const format of formats as unknown[][])
      if (format[3] && !format[4]) format[4] = 1;
  }
  return copy as unknown as MetadataJson;
})();

const getCountryCallingCode = (country: Country) =>
  getCallingCode(country, metadata);

type CountrySelectProps = {
  value?: Country;
  onChange: (country?: Country) => void;
  options: Array<{ value?: Country; label: string; divider?: boolean }>;
  disabled?: boolean;
  readOnly?: boolean;
};

/**
 * The country selector the phone control mounts, narrowed to the calling code
 * so the number itself keeps the room it needs on a phone screen.
 */
function CountryCallingCodeSelect({
  value,
  onChange,
  options,
  disabled,
  readOnly,
}: CountrySelectProps) {
  const countries = options.flatMap((option) =>
    option.value && !option.divider
      ? [
          {
            value: option.value,
            label: option.label,
            hint: `+${getCountryCallingCode(option.value)}`,
          },
        ]
      : [],
  );

  return (
    <Combobox
      value={value ?? ""}
      onValueChange={(next) => onChange((next as Country) || undefined)}
      options={countries}
      disabled={disabled || readOnly}
      ariaLabel="Country calling code"
      placeholder="Country"
      searchPlaceholder="Search countries or codes"
      emptyText="No matching country"
      triggerLabel={
        value ? `${value} +${getCountryCallingCode(value)}` : undefined
      }
      triggerClassName="w-auto min-w-[7.5rem] flex-none"
      contentClassName="w-72 max-w-[calc(100vw-2rem)]"
    />
  );
}

const PhoneNumberField = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(function PhoneNumberField({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`${inputClass} min-w-0 flex-1 tabular-nums ${className}`}
      {...props}
    />
  );
});

/**
 * Phone number with a searchable country code. There is no default country:
 * digits typed before one is chosen are read as an international number, and
 * a typed `+code` selects its country.
 */
export function PhoneInput({
  value,
  onValueChange,
  onBlur,
  id,
  name,
  invalid,
  disabled,
  placeholder = "Phone number",
  ariaDescribedby,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  ariaDescribedby?: string;
}) {
  return (
    <PhoneInputWithCountry
      id={id}
      name={name}
      // A stored number is shown the way a typed one is: the calling code
      // stays in the selector rather than being repeated in the input.
      initialValueFormat="national"
      metadata={metadata}
      labels={countryLabels}
      value={value || undefined}
      onChange={(next) => onValueChange(next ?? "")}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete="tel"
      type="tel"
      aria-invalid={invalid || undefined}
      aria-describedby={ariaDescribedby}
      countrySelectComponent={CountryCallingCodeSelect}
      inputComponent={PhoneNumberField}
      className="flex items-stretch gap-2"
    />
  );
}
