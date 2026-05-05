import { createHmac, timingSafeEqual } from 'node:crypto';

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signValue(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function encodeSignedToken<TPayload>(payload: TPayload, secret: string): string {
  const serializedPayload = JSON.stringify(payload);
  const body = toBase64Url(serializedPayload);
  const signature = signValue(body, secret);
  return `${body}.${signature}`;
}

export function decodeSignedToken<TPayload>(token: string, secret: string): TPayload | null {
  const [body, signature] = token.split('.');

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = signValue(body, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(body)) as TPayload;
  } catch {
    return null;
  }
}
