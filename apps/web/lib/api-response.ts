import { NextResponse } from 'next/server';
import type { ApiEnvelope, ApiErrorEnvelope, ApiSuccessEnvelope } from '@cane-corso-platform/contracts';

function meta() {
  return {
    generatedAt: new Date().toISOString(),
  };
}

export function jsonOk<TData>(data: TData, init?: ResponseInit) {
  const body: ApiSuccessEnvelope<TData> = {
    ok: true,
    data,
    meta: meta(),
  };

  return NextResponse.json(body satisfies ApiEnvelope<TData>, init);
}

export function jsonError(code: string, message: string, init?: ResponseInit, details?: unknown) {
  const body: ApiErrorEnvelope = {
    ok: false,
    error: {
      code,
      message,
      details,
    },
    meta: meta(),
  };

  return NextResponse.json(body, init);
}
