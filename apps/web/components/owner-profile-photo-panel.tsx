'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ApiRequestError } from '@/lib/api/fetcher';
import { updateCurrentProfileDocument, uploadCurrentProfileAvatar } from '@/lib/api/profile.client';

interface OwnerProfilePhotoLabels {
  eyebrow: string;
  title: string;
  description: string;
  currentPhotoLabel: string;
  emptyPhotoLabel: string;
  chooseLabel: string;
  replaceLabel: string;
  removeLabel: string;
  saveLabel: string;
  savingLabel: string;
  savedMessage: string;
  removedMessage: string;
  selectedFileLabel: string;
  fileHelp: string;
  fileTooLargeMessage: string;
  unsupportedFileMessage: string;
  previewReadyMessage: string;
  noChangesMessage: string;
}

interface OwnerProfilePhotoPanelProps {
  initialAvatarUrl: string | null;
  displayName: string;
  email: string;
  labels: OwnerProfilePhotoLabels;
}

const MAX_SOURCE_IMAGE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

function getInitials(displayName: string, email: string) {
  const parts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts[0]) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
}

export function OwnerProfilePhotoPanel({ initialAvatarUrl, displayName, email, labels }: OwnerProfilePhotoPanelProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [savedAvatarUrl, setSavedAvatarUrl] = useState(initialAvatarUrl ?? '');
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initials = useMemo(() => getInitials(displayName, email), [displayName, email]);
  const hasPhoto = Boolean(avatarUrl);
  const hasChanges = Boolean(selectedFile) || savedAvatarUrl !== avatarUrl;

  useEffect(() => {
    setSavedAvatarUrl(initialAvatarUrl ?? '');
    setAvatarUrl(initialAvatarUrl ?? '');
    setSelectedFile(null);
    setSelectedFileName(null);
  }, [initialAvatarUrl]);

  useEffect(() => {
    return () => {
      if (avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setMessage(null);
    setError(null);

    if (!file) {
      return;
    }

    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      setSelectedFile(null);
      setSelectedFileName(null);
      setError(labels.unsupportedFileMessage);
      return;
    }

    if (file.size > MAX_SOURCE_IMAGE_BYTES) {
      setSelectedFile(null);
      setSelectedFileName(null);
      setError(labels.fileTooLargeMessage);
      return;
    }

    if (avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl);
    }

    setSelectedFile(file);
    setSelectedFileName(file.name);
    setAvatarUrl(URL.createObjectURL(file));
    setMessage(labels.previewReadyMessage);
  }

  async function handleSave() {
    setMessage(null);
    setError(null);

    if (!hasChanges) {
      setMessage(labels.noChangesMessage);
      return;
    }

    setPending(true);

    try {
      const document = selectedFile
        ? await uploadCurrentProfileAvatar({ file: selectedFile })
        : await updateCurrentProfileDocument({ avatarUrl: avatarUrl || null });
      const nextAvatarUrl = document.profile.avatarUrl ?? '';
      setSavedAvatarUrl(nextAvatarUrl);
      setAvatarUrl(nextAvatarUrl);
      setSelectedFile(null);
      setSelectedFileName(null);
      setMessage(nextAvatarUrl ? labels.savedMessage : labels.removedMessage);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError || err instanceof Error ? err.message : 'Unable to update profile photo.');
    } finally {
      setPending(false);
    }
  }

  function handleRemove() {
    if (avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl);
    }

    setAvatarUrl('');
    setSelectedFile(null);
    setSelectedFileName(null);
    setMessage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <section className="owner-profile-photo-panel" aria-label={labels.title}>
      <div className="owner-profile-photo-panel__preview">
        {hasPhoto ? (
          <img src={avatarUrl} alt={labels.currentPhotoLabel} />
        ) : (
          <div className="owner-profile-photo-panel__initials" aria-label={labels.emptyPhotoLabel}>
            {initials}
          </div>
        )}
      </div>

      <div className="owner-profile-photo-panel__body">
        <span className="eyebrow-label">{labels.eyebrow}</span>
        <h3>{labels.title}</h3>
        <p>{labels.description}</p>

        <input
          ref={fileInputRef}
          className="owner-profile-photo-panel__input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />

        <div className="owner-profile-photo-panel__actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={pending}
          >
            {hasPhoto ? labels.replaceLabel : labels.chooseLabel}
          </button>
          <button type="button" className="button-primary" onClick={handleSave} disabled={pending}>
            {pending ? labels.savingLabel : labels.saveLabel}
          </button>
          {hasPhoto ? (
            <button type="button" className="button-ghost" onClick={handleRemove} disabled={pending}>
              {labels.removeLabel}
            </button>
          ) : null}
        </div>

        <small className="owner-profile-photo-panel__hint">
          {selectedFileName ? `${labels.selectedFileLabel}: ${selectedFileName}` : labels.fileHelp}
        </small>

        {message ? <p className="owner-profile-photo-panel__message">{message}</p> : null}
        {error ? <p className="owner-profile-photo-panel__error">{error}</p> : null}
      </div>
    </section>
  );
}
