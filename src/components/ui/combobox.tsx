"use client";

import { useId, useState, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { RemoveScroll } from "react-remove-scroll";
import { fieldFocus } from "@/lib/styles";

/**
 * cmdk's default fuzzy match turns "ken" into Uzbekistan. A plain substring
 * match reads better for names and codes; matches at a word start rank first.
 */
function filterOptions(value: string, search: string) {
  const haystack = value.toLowerCase();
  const needle = search.trim().toLowerCase();
  if (!needle) return 1;
  if (haystack.startsWith(needle)) return 1;
  if (haystack.includes(` ${needle}`) || haystack.includes(`+${needle}`))
    return 0.8;
  return haystack.includes(needle) ? 0.5 : 0;
}

export type ComboboxOption = { value: string; label: string; hint?: string };

/**
 * A searchable select for long option lists. Styled to match `Select`; reach
 * for this one only when there are too many options to scan.
 */
export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search",
  emptyText = "No matches",
  id,
  invalid,
  disabled,
  ariaLabel,
  triggerLabel,
  triggerClassName = "w-full",
  contentClassName = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  /** Replaces the selected option's label in the trigger, for compact controls. */
  triggerLabel?: ReactNode;
  /** Sizing for the trigger; full width unless the caller narrows it. */
  triggerClassName?: string;
  contentClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? contentId : undefined}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          disabled={disabled}
          data-placeholder={selected ? undefined : ""}
          className={
            "group flex min-h-11 cursor-pointer items-center justify-between gap-2 " +
            "rounded-md border border-ink/34 bg-paper-hi px-3.5 py-2.5 text-left text-ink " +
            `tabular-nums transition-colors duration-150 hover:border-ink/55 ${fieldFocus} ` +
            "aria-invalid:border-danger data-placeholder:text-ink/75 " +
            "disabled:cursor-not-allowed disabled:opacity-55 " +
            triggerClassName
          }
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {triggerLabel ?? selected?.label ?? placeholder}
          </span>
          <svg
            className="size-4 flex-none text-ink/75 transition-transform duration-150 group-aria-expanded:rotate-180"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4 6l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          id={contentId}
          align="start"
          sideOffset={6}
          collisionPadding={16}
          className={
            "z-50 w-(--radix-popover-trigger-width) overflow-hidden rounded-md border border-ink/28 " +
            "bg-paper-hi p-1 text-ink shadow-[0_12px_30px_-18px_rgba(44,62,80,0.45)] " +
            contentClassName
          }
        >
          {/* A scroll lock elsewhere on the page swallows wheel events over
              portalled content. Registering the list's own lock exempts it
              without the focus trap Popover's `modal` would add. */}
          <RemoveScroll allowPinchZoom removeScrollBar={false}>
            <Command filter={filterOptions}>
              <div className="mb-1 flex items-center gap-2 border-b border-ink/15 px-2.5 pt-1 pb-2">
                <svg
                  className="size-4 flex-none text-ink/75"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="4.25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M10.2 10.2L13 13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <Command.Input
                  autoFocus
                  placeholder={searchPlaceholder}
                  className="min-h-9 min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink/75"
                />
              </div>
              <Command.List className="max-h-64 overflow-y-auto overscroll-contain">
                <Command.Empty className="px-2.5 py-5 text-center text-[0.9rem] text-ink/75">
                  {emptyText}
                </Command.Empty>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={`${option.label} ${option.value}${option.hint ? ` ${option.hint}` : ""}`}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 outline-none select-none data-[selected=true]:bg-ink/8"
                  >
                    <svg
                      className={`size-4 flex-none ${option.value === value ? "opacity-100" : "opacity-0"}`}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M3.5 8.5l3 3 6-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={`overflow-hidden text-ellipsis whitespace-nowrap ${option.value === value ? "font-semibold" : ""}`}
                    >
                      {option.label}
                    </span>
                    {option.hint ? (
                      <span className="ml-auto flex-none text-ink/75 tabular-nums">
                        {option.hint}
                      </span>
                    ) : null}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </RemoveScroll>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
