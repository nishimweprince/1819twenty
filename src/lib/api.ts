import { NextResponse } from "next/server";

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = {
  ok: false;
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  retryable?: boolean;
};

export function success<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, { status });
}

export function failure(code: string, message: string, status = 400, options?: Pick<ApiFailure, "fieldErrors" | "retryable">) {
  return NextResponse.json<ApiFailure>({ ok: false, code, message, ...options }, { status });
}

export async function readJson(request: Request) {
  try {
    return await request.json() as unknown;
  } catch {
    return null;
  }
}
