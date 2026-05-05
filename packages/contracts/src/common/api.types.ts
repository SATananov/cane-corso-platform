import type { ISODateTimeString } from './ids';

export interface ApiMeta {
  generatedAt: ISODateTimeString;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccessEnvelope<TData> {
  ok: true;
  data: TData;
  meta: ApiMeta;
}

export interface ApiErrorEnvelope {
  ok: false;
  error: ApiErrorPayload;
  meta: ApiMeta;
}

export type ApiEnvelope<TData> = ApiSuccessEnvelope<TData> | ApiErrorEnvelope;
