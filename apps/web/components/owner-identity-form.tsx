'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile, UpdateCurrentProfileInput } from '@cane-corso-platform/contracts';
import { ApiRequestError } from '@/lib/api/fetcher';
import { updateCurrentProfileDocument } from '@/lib/api/profile.client';

interface OwnerIdentityFormLabels {
  eyebrow: string;
  title: string;
  description: string;
  privacyNotice: string;
  publicNotice: string;
  fields: {
    displayName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    city: string;
    country: string;
    addressLine: string;
    websiteUrl: string;
    phone: string;
    bio: string;
  };
  placeholders: {
    displayName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    city: string;
    country: string;
    addressLine: string;
    websiteUrl: string;
    phone: string;
    bio: string;
  };
  saveLabel: string;
  savingLabel: string;
  savedMessage: string;
  noChangesMessage: string;
  errorMessage: string;
}

interface OwnerIdentityFormProps {
  profile: Profile;
  labels: OwnerIdentityFormLabels;
}

function normalizeValue(value: string | null | undefined) {
  return value ?? '';
}

function buildInitialState(profile: Profile) {
  return {
    displayName: normalizeValue(profile.displayName),
    firstName: normalizeValue(profile.firstName),
    middleName: normalizeValue(profile.middleName),
    lastName: normalizeValue(profile.lastName),
    city: normalizeValue(profile.city),
    country: normalizeValue(profile.country),
    addressLine: normalizeValue(profile.addressLine),
    websiteUrl: normalizeValue(profile.websiteUrl),
    phone: normalizeValue(profile.phone),
    bio: normalizeValue(profile.bio),
  };
}

function trimOrNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function OwnerIdentityForm({ profile, labels }: OwnerIdentityFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(buildInitialState(profile));
  const [saved, setSaved] = useState(buildInitialState(profile));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = Object.keys(form).some((key) => form[key as keyof typeof form] !== saved[key as keyof typeof saved]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage(null);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!hasChanges) {
      setMessage(labels.noChangesMessage);
      return;
    }

    const displayName = form.displayName.trim();
    if (!displayName) {
      setError(labels.errorMessage);
      return;
    }

    setPending(true);

    try {
      const payload: UpdateCurrentProfileInput = {
        displayName,
        firstName: trimOrNull(form.firstName),
        middleName: trimOrNull(form.middleName),
        lastName: trimOrNull(form.lastName),
        city: trimOrNull(form.city),
        country: trimOrNull(form.country),
        addressLine: trimOrNull(form.addressLine),
        websiteUrl: trimOrNull(form.websiteUrl),
        phone: trimOrNull(form.phone),
        bio: trimOrNull(form.bio),
      };

      const document = await updateCurrentProfileDocument(payload);
      const nextState = buildInitialState(document.profile);
      setForm(nextState);
      setSaved(nextState);
      setMessage(labels.savedMessage);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError || err instanceof Error ? err.message : labels.errorMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="owner-identity-form" onSubmit={handleSubmit}>
      <div className="owner-identity-form__head">
        <div>
          <span className="eyebrow-label">{labels.eyebrow}</span>
          <h3>{labels.title}</h3>
          <p>{labels.description}</p>
        </div>
        <div className="owner-identity-form__privacy-card">
          <strong>{labels.publicNotice}</strong>
          <span>{labels.privacyNotice}</span>
        </div>
      </div>

      <div className="owner-identity-form__grid">
        <label>
          <span>{labels.fields.displayName}</span>
          <input
            value={form.displayName}
            onChange={(event) => updateField('displayName', event.target.value)}
            placeholder={labels.placeholders.displayName}
            required
          />
        </label>
        <label>
          <span>{labels.fields.firstName}</span>
          <input value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} placeholder={labels.placeholders.firstName} />
        </label>
        <label>
          <span>{labels.fields.middleName}</span>
          <input value={form.middleName} onChange={(event) => updateField('middleName', event.target.value)} placeholder={labels.placeholders.middleName} />
        </label>
        <label>
          <span>{labels.fields.lastName}</span>
          <input value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} placeholder={labels.placeholders.lastName} />
        </label>
        <label>
          <span>{labels.fields.city}</span>
          <input value={form.city} onChange={(event) => updateField('city', event.target.value)} placeholder={labels.placeholders.city} />
        </label>
        <label>
          <span>{labels.fields.country}</span>
          <input value={form.country} onChange={(event) => updateField('country', event.target.value)} placeholder={labels.placeholders.country} />
        </label>
        <label className="owner-identity-form__wide">
          <span>{labels.fields.addressLine}</span>
          <input value={form.addressLine} onChange={(event) => updateField('addressLine', event.target.value)} placeholder={labels.placeholders.addressLine} />
        </label>
        <label>
          <span>{labels.fields.websiteUrl}</span>
          <input value={form.websiteUrl} onChange={(event) => updateField('websiteUrl', event.target.value)} placeholder={labels.placeholders.websiteUrl} inputMode="url" />
        </label>
        <label>
          <span>{labels.fields.phone}</span>
          <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder={labels.placeholders.phone} inputMode="tel" />
        </label>
        <label className="owner-identity-form__wide">
          <span>{labels.fields.bio}</span>
          <textarea value={form.bio} onChange={(event) => updateField('bio', event.target.value)} placeholder={labels.placeholders.bio} rows={4} />
        </label>
      </div>

      <div className="owner-identity-form__actions">
        <button type="submit" className="button-primary" disabled={pending}>
          {pending ? labels.savingLabel : labels.saveLabel}
        </button>
        {message ? <span className="owner-identity-form__message">{message}</span> : null}
        {error ? <span className="owner-identity-form__error">{error}</span> : null}
      </div>
    </form>
  );
}
