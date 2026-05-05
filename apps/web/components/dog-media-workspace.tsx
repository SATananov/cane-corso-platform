'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { LuxurySelect } from '@/components/luxury-select';
import type { DogMedia, MediaType } from '@cane-corso-platform/contracts';
import { ApiRequestError } from '@/lib/api/fetcher';
import {
  createDogMediaAsset,
  deleteDogMediaAsset,
  updateDogMediaAsset,
  uploadDogMediaAsset,
} from '@/lib/api/dog-media.client';

interface DogMediaWorkspaceLabels {
  eyebrow: string;
  title: string;
  description: string;
  addCardEyebrow: string;
  addCardTitle: string;
  addCardDescription: string;
  urlLabel: string;
  altLabel: string;
  typeLabel: string;
  fileLabel: string;
  selectedFileLabel: string;
  uploadHelp: string;
  primaryLabel: string;
  submitLabel: string;
  submittingLabel: string;
  uploadLabel: string;
  uploadingLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  primaryBadge: string;
  setPrimaryLabel: string;
  deleteLabel: string;
  editProfileLabel: string;
  mediaCountLabel: string;
  backLabel: string;
  formHelp: string;
  noteLabel: string;
  sourceHint: string;
  uploadHint: string;
  urlSavedMessage: string;
  uploadSavedMessage: string;
  removeSuccessMessage: string;
  primarySuccessMessage: string;
}

interface DogMediaWorkspaceProps {
  dogId: string;
  dogName: string;
  initialMedia: DogMedia[];
  labels: DogMediaWorkspaceLabels;
}

const mediaTypeOptions: MediaType[] = ['image', 'video', 'document'];

function sortMediaItems(items: DogMedia[]): DogMedia[] {
  return [...items].sort((left, right) => {
    if (left.isPrimary === right.isPrimary) {
      return left.sortOrder - right.sortOrder;
    }

    return left.isPrimary ? -1 : 1;
  });
}

function formatMessage(template: string, dogName: string) {
  return template.replace('{dogName}', dogName);
}

export function DogMediaWorkspace({ dogId, dogName, initialMedia, labels }: DogMediaWorkspaceProps) {
  const [media, setMedia] = useState<DogMedia[]>(sortMediaItems(initialMedia));
  const [publicUrl, setPublicUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPrimary, setIsPrimary] = useState(initialMedia.length === 0);
  const [pending, setPending] = useState<'create' | 'upload' | `primary:${string}` | `delete:${string}` | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const primaryMedia = useMemo(() => media.find((item) => item.isPrimary) ?? null, [media]);
  const selectedFileSupportsPrimary = !selectedFile || selectedFile.type.startsWith('image/');

  useEffect(() => {
    if (!selectedFileSupportsPrimary && isPrimary) {
      setIsPrimary(false);
    }
  }, [isPrimary, selectedFileSupportsPrimary]);

  const resetForm = () => {
    setPublicUrl('');
    setAltText('');
    setMediaType('image');
    setSelectedFile(null);
    setIsPrimary(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyMutationDocument = (updatedMedia: DogMedia) => {
    setMedia((current) => {
      const withoutCurrent = current.filter((item) => item.id !== updatedMedia.id);
      const normalized = updatedMedia.isPrimary
        ? withoutCurrent.map((item) => ({ ...item, isPrimary: false }))
        : withoutCurrent;

      return sortMediaItems([updatedMedia, ...normalized]);
    });
  };

  const handleCreate = async () => {
    if (selectedFile) {
      setPending('upload');

      try {
        const document = await uploadDogMediaAsset(dogId, {
          file: selectedFile,
          altText: altText.trim() || null,
          isPrimary,
        });

        applyMutationDocument(document.media);
        resetForm();
        setMessage(formatMessage(labels.uploadSavedMessage, dogName));
      } catch (error) {
        const nextMessage =
          error instanceof ApiRequestError || error instanceof Error
            ? error.message
            : 'Unable to upload media.';
        setMessage(nextMessage);
      } finally {
        setPending(null);
      }

      return;
    }

    const normalizedUrl = publicUrl.trim();

    if (!normalizedUrl) {
      setMessage(labels.formHelp);
      return;
    }

    setPending('create');

    try {
      const document = await createDogMediaAsset(dogId, {
        publicUrl: normalizedUrl,
        altText: altText.trim() || null,
        mediaType,
        isPrimary,
      });

      applyMutationDocument(document.media);
      resetForm();
      setMessage(formatMessage(labels.urlSavedMessage, dogName));
    } catch (error) {
      const nextMessage =
        error instanceof ApiRequestError || error instanceof Error
          ? error.message
          : 'Unable to save media.';
      setMessage(nextMessage);
    } finally {
      setPending(null);
    }
  };

  const handleSetPrimary = async (mediaId: string) => {
    setPending(`primary:${mediaId}`);

    try {
      const document = await updateDogMediaAsset(dogId, mediaId, { isPrimary: true });
      applyMutationDocument(document.media);
      setMessage(formatMessage(labels.primarySuccessMessage, dogName));
    } catch (error) {
      const nextMessage =
        error instanceof ApiRequestError || error instanceof Error
          ? error.message
          : 'Unable to update primary media.';
      setMessage(nextMessage);
    } finally {
      setPending(null);
    }
  };

  const handleDelete = async (mediaId: string) => {
    setPending(`delete:${mediaId}`);

    try {
      await deleteDogMediaAsset(dogId, mediaId);
      setMedia((current) => current.filter((item) => item.id !== mediaId));
      setMessage(formatMessage(labels.removeSuccessMessage, dogName));
    } catch (error) {
      const nextMessage =
        error instanceof ApiRequestError || error instanceof Error
          ? error.message
          : 'Unable to delete media.';
      setMessage(nextMessage);
    } finally {
      setPending(null);
    }
  };

  const submitLabel = pending === 'upload'
    ? labels.uploadingLabel
    : pending === 'create'
      ? labels.submittingLabel
      : selectedFile
        ? labels.uploadLabel
        : labels.submitLabel;

  return (
    <div className="member-route-stack">
      <section className="route-hero-card">
        <div>
          <span className="eyebrow-label">{labels.eyebrow}</span>
          <h1 className="route-title">{labels.title}</h1>
          <p className="route-copy">{labels.description}</p>
        </div>
        <div className="route-hero-actions">
          <Link href={`/my-dogs/${dogId}/edit`} className="button-secondary">
            {labels.editProfileLabel}
          </Link>
          <span className="route-pill">{media.length} {labels.mediaCountLabel}</span>
          {primaryMedia ? <span className="route-pill">{labels.primaryBadge}</span> : null}
        </div>
      </section>

      <div className="content-grid two-columns-wide-right">
        <section className="content-card media-workspace-card">
          <div className="section-head-row">
            <div>
              <span className="eyebrow-label">{labels.addCardEyebrow}</span>
              <h2>{labels.addCardTitle}</h2>
            </div>
            <Link href={`/my-dogs/${dogId}/edit`} className="inline-link-action">
              {labels.backLabel}
            </Link>
          </div>

          <p>{labels.addCardDescription}</p>

          <div className="media-form-grid">
            <label className="field-shell file-field-shell">
              <span>{labels.fileLabel}</span>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.rtf"
              />
              <small>{selectedFile ? `${labels.selectedFileLabel}: ${selectedFile.name}` : labels.uploadHelp}</small>
            </label>

            <label className="field-shell">
              <span>{labels.urlLabel}</span>
              <input
                type="url"
                value={publicUrl}
                onChange={(event) => setPublicUrl(event.target.value)}
                placeholder="https://"
                autoComplete="off"
                disabled={Boolean(selectedFile)}
              />
            </label>

            <label className="field-shell">
              <span>{labels.altLabel}</span>
              <input
                type="text"
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                placeholder={dogName}
                autoComplete="off"
              />
            </label>

            <label className="field-shell">
              <span>{labels.typeLabel}</span>
              <LuxurySelect
                value={mediaType}
                onValueChange={(nextValue) => setMediaType(nextValue as MediaType)}
                disabled={Boolean(selectedFile)}
                className="luxury-select--compact"
                options={mediaTypeOptions.map((option) => ({ value: option, label: option }))}
              />
            </label>
          </div>

          <p className="media-source-hint">{selectedFile ? labels.uploadHint : labels.sourceHint}</p>

          <label className="media-primary-toggle">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(event) => setIsPrimary(event.target.checked)}
              disabled={!selectedFileSupportsPrimary}
            />
            <span>{labels.primaryLabel}</span>
          </label>

          <div className="media-form-footer">
            <button
              type="button"
              className="button-primary"
              onClick={() => void handleCreate()}
              disabled={pending === 'create' || pending === 'upload'}
            >
              {submitLabel}
            </button>
            <span className="form-actions-copy">{labels.noteLabel}</span>
          </div>

          {message ? <p className="media-feedback-line">{message}</p> : null}
        </section>

        <aside className="side-stack">
          <section className="side-info-card compact">
            <span className="eyebrow-label">{labels.noteLabel}</span>
            <h3>{dogName}</h3>
            <p>{labels.formHelp}</p>
          </section>
        </aside>
      </div>

      <section className="content-card media-library-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{labels.noteLabel}</span>
            <h2>{labels.title}</h2>
          </div>
          {primaryMedia ? <span className="inline-link-action">{labels.primaryBadge}</span> : null}
        </div>

        {media.length > 0 ? (
          <div className="media-grid">
            {media.map((item) => {
              const previewStyle = item.mediaType === 'image' && item.url ? { backgroundImage: `url(${item.url})` } : undefined;
              const pendingKeyPrimary = `primary:${item.id}`;
              const pendingKeyDelete = `delete:${item.id}`;

              return (
                <article key={item.id} className="media-card">
                  <div className="media-card-preview" style={previewStyle}>
                    {!previewStyle ? <span>{item.mediaType}</span> : null}
                    {item.isPrimary ? <span className="media-card-badge">{labels.primaryBadge}</span> : null}
                  </div>
                  <div className="media-card-body">
                    <h3>{item.altText ?? dogName}</h3>
                    <p>{item.url ?? item.storageKey}</p>
                    <div className="media-card-meta-row">
                      <span>{item.mediaType}</span>
                      <span>{item.mimeType ?? 'n/a'}</span>
                    </div>
                    <div className="dog-card-actions">
                      {!item.isPrimary ? (
                        <button
                          type="button"
                          className="button-secondary small"
                          onClick={() => void handleSetPrimary(item.id)}
                          disabled={pending === pendingKeyPrimary}
                        >
                          {labels.setPrimaryLabel}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="button-ghost small"
                        onClick={() => void handleDelete(item.id)}
                        disabled={pending === pendingKeyDelete}
                      >
                        {labels.deleteLabel}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state-panel">
            <h3>{labels.emptyTitle}</h3>
            <p className="empty-state-panel__description">{labels.emptyDescription}</p>
          </div>
        )}
      </section>
    </div>
  );
}
