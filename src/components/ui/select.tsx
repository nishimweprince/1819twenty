"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  name?: string;
  invalid?: boolean;
  ariaDescribedby?: string;
};

export function Select({
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Select an option",
  id,
  name,
  invalid,
  ariaDescribedby,
}: SelectProps) {
  const reactId = useId();
  const baseId = id ?? reactId;
  const listId = `${baseId}-list`;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
        onBlur?.();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, close, onBlur]);

  useEffect(() => {
    if (open && activeIndex >= 0) {
      listRef.current?.querySelector<HTMLElement>(`#${baseId}-opt-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [open, activeIndex, baseId]);

  function openList(startIndex: number) {
    setOpen(true);
    setActiveIndex(startIndex >= 0 ? startIndex : selectedIndex >= 0 ? selectedIndex : 0);
  }

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    close();
    requestAnimationFrame(() => buttonRef.current?.focus());
  }

  function onButtonKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openList(selectedIndex);
        } else {
          setActiveIndex((current) => {
            const next = event.key === "ArrowDown" ? current + 1 : current - 1;
            return Math.max(0, Math.min(options.length - 1, next));
          });
        }
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open && activeIndex >= 0) commit(activeIndex);
        else openList(selectedIndex);
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case "Tab":
        if (open) {
          close();
          onBlur?.();
        }
        break;
    }
  }

  return (
    <div className="relative w-full" ref={rootRef}>
      <button
        type="button"
        ref={buttonRef}
        id={baseId}
        className={
          "group flex w-full min-h-[2.75rem] cursor-pointer items-center justify-between gap-2 " +
          "rounded-md border border-ink/34 bg-paper-hi px-3.5 py-2.5 text-left text-ink " +
          "transition-colors duration-150 hover:border-ink/55 focus-visible:border-ink " +
          "aria-invalid:border-danger data-placeholder:text-ink/75"
        }
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedby}
        data-placeholder={selected ? undefined : ""}
        onClick={() => (open ? close() : openList(selectedIndex))}
        onKeyDown={onButtonKeyDown}
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget as Node)) {
            close();
            onBlur?.();
          }
        }}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{selected ? selected.label : placeholder}</span>
        <svg
          className="size-4 flex-none text-ink/75 transition-transform duration-150 group-aria-expanded:rotate-180"
          viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      {open ? (
        <ul
          className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-60 list-none overflow-y-auto rounded-md border border-ink/28 bg-paper-hi p-1 shadow-[0_12px_30px_-18px_rgba(44,62,80,0.45)]"
          id={listId} role="listbox" ref={listRef} aria-labelledby={baseId} tabIndex={-1}>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${baseId}-opt-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={
                "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2.5 py-2 aria-selected:font-semibold" +
                (index === activeIndex ? " bg-ink/8" : "")
              }
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                commit(index);
              }}
            >
              <span>{option.label}</span>
              {option.value === value ? (
                <svg className="size-4 flex-none" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
