"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { buttonSecondary } from "@/lib/styles";

type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** Text on the decorative trigger. The real control is the hidden input. */
  label?: string;
  /** Short line beside the trigger, e.g. "or drop them here". */
  hint?: string;
};

/**
 * Same idiom as Checkbox: the native input is transparent and covers the whole
 * zone, so clicking, tabbing, and dropping files all land on the real control
 * while the frame below draws the state. `aria-invalid` drives the error border.
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput(
    { className, label = "Choose files", hint, onDragOver, onDragLeave, onDrop, ...props },
    ref,
  ) {
    const [dragging, setDragging] = useState(false);
    return (
      <span
        className={
          "file-root relative grid min-h-24 w-full place-items-center rounded-md border border-dashed " +
          "bg-paper px-5 py-6 text-center transition-colors duration-150 " +
          "has-[input[aria-invalid=true]]:border-danger " +
          (dragging ? "border-ink bg-paper-hi" : "border-ink/34 hover:border-ink/55") +
          (className ? ` ${className}` : "")
        }
      >
        <input
          {...props}
          ref={ref}
          type="file"
          className="absolute inset-0 z-1 m-0 size-full cursor-pointer opacity-0"
          onDragOver={(event) => {
            setDragging(true);
            onDragOver?.(event);
          }}
          onDragLeave={(event) => {
            setDragging(false);
            onDragLeave?.(event);
          }}
          onDrop={(event) => {
            setDragging(false);
            onDrop?.(event);
          }}
        />
        <span aria-hidden="true" className="grid justify-items-center gap-2">
          <span className={`${buttonSecondary} pointer-events-none min-h-10`}>
            {label}
          </span>
          {hint ? (
            <span className="text-[0.82rem] text-ink/75">{hint}</span>
          ) : null}
        </span>
      </span>
    );
  },
);
