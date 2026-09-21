"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, ...props },
  ref,
) {
  return (
    <span
      className={`checkbox-root relative inline-grid size-[1.15rem] flex-none place-items-center${className ? ` ${className}` : ""}`}
    >
      <input
        {...props}
        ref={ref}
        type="checkbox"
        className="peer absolute inset-0 z-1 m-0 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        className={
          "flex size-full items-center justify-center rounded-sm border border-ink/34 bg-paper-hi " +
          "text-paper transition-colors duration-150 " +
          "peer-hover:border-ink/55 peer-checked:border-ink peer-checked:bg-ink " +
          "peer-aria-invalid:border-danger " +
          "peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
        }
      >
        <svg
          viewBox="0 0 16 16"
          focusable="false"
          className="size-3.5 scale-60 opacity-0 transition duration-150"
        >
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
});
