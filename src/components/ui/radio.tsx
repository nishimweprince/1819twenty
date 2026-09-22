"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ className, ...props }, ref) {
  return (
    <span className={`choice-root relative inline-grid size-[1.15rem] flex-none place-items-center${className ? ` ${className}` : ""}`}>
      <input {...props} ref={ref} type="radio" className="peer absolute inset-0 z-1 m-0 size-full cursor-pointer opacity-0" />
      <span aria-hidden="true" className="grid size-full place-items-center rounded-full border border-ink/34 bg-paper-hi transition-colors peer-hover:border-ink/55 peer-checked:border-ink peer-aria-invalid:border-danger peer-checked:[&>span]:opacity-100">
        <span className="size-2 rounded-full bg-ink opacity-0" />
      </span>
    </span>
  );
});
