'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DogProfileForm } from './dog-profile-form';
import type { DogFormErrors, DogFormValues } from '../lib/dog-form.types';
import { DogProfilePreviewCard } from './dog-profile-preview-card';
import {
  createSlugFromName,
  formatPersistedAtLabel,
  mapActionProfileToDogFormValues,
  mapDogFormValuesToActionInput,
  normalizeDogFormValues,
} from '../lib/dog-form.helpers';
import { validateDogForm } from '../lib/dog-form.validation';
import {
  EMPTY_ANCESTOR_PROFILE,
  PEDIGREE_RELATION_ORDER,
  getPedigreeFilledCount,
  getPedigreePhotoCount,
  updatePedigreeAncestor,
} from '../lib/dog-pedigree';
import type { DogAncestorProfile, DogAncestorRelationKey } from '@cane-corso-platform/contracts';
import { mutateDogProfile } from '@/lib/api/dogs.client';
import { ApiRequestError } from '@/lib/api/fetcher';
import { useLocale } from '@/components/locale-provider';
import { OwnerReviewReadinessPanel } from '@/components/owner-review-readiness-panel';
import { OwnerSubmissionHappyPathPanel } from '@/components/owner-submission-happy-path-panel';
import { UsgMeasurementAssistantPanel } from '@/components/usg-measurement-assistant-panel';
import { compactImageDataUrlForPayload } from '@/lib/image-payload.client';

interface MyDogFormWorkspaceProps {
  mode: 'create' | 'edit';
  initialValues: DogFormValues;
  dogId?: string;
}

type EphemeralMediaState = {
  mainImageUrl?: string;
  galleryImageUrls?: string[];
  pedigreePhotoUrls?: Partial<Record<DogAncestorRelationKey, string>>;
};

async function compactDogFormValuesForPayload(values: DogFormValues): Promise<DogFormValues> {
  const [mainImageUrl, galleryImageUrls] = await Promise.all([
    values.mainImageUrl
      ? compactImageDataUrlForPayload(values.mainImageUrl, {
          maxWidth: 900,
          maxHeight: 900,
          mimeType: 'image/webp',
          quality: 0.72,
        })
      : Promise.resolve(values.mainImageUrl),
    Promise.all(
      values.galleryImageUrls.map((imageUrl) =>
        compactImageDataUrlForPayload(imageUrl, {
          maxWidth: 900,
          maxHeight: 900,
          mimeType: 'image/webp',
          quality: 0.72,
        }),
      ),
    ),
  ]);

  const pedigree = { ...values.pedigree };

  await Promise.all(
    PEDIGREE_RELATION_ORDER.map(async (relationKey) => {
      const ancestor = pedigree[relationKey];

      if (!ancestor?.photoUrl) {
        return;
      }

      pedigree[relationKey] = {
        ...ancestor,
        photoUrl: await compactImageDataUrlForPayload(ancestor.photoUrl, {
          maxWidth: 640,
          maxHeight: 640,
          mimeType: 'image/webp',
          quality: 0.68,
        }),
      };
    }),
  );

  return {
    ...values,
    mainImageUrl,
    galleryImageUrls,
    pedigree,
  };
}

const LEGACY_STORAGE_PREFIX = 'usg-dog-gallery:';
const EPHEMERAL_MEDIA_DB_NAME = 'usg-dog-form-media';
const EPHEMERAL_MEDIA_STORE_NAME = 'entries';

function buildGalleryStorageKeys(activeDogId?: string, slug?: string) {
  const keys = [
    activeDogId ? `${LEGACY_STORAGE_PREFIX}${activeDogId}` : null,
    slug ? `${LEGACY_STORAGE_PREFIX}${slug}` : null,
    !activeDogId && !slug ? `${LEGACY_STORAGE_PREFIX}draft` : null,
  ].filter(Boolean) as string[];

  return Array.from(new Set(keys));
}

function createEphemeralMediaState(values: DogFormValues): EphemeralMediaState {
  const pedigreePhotoUrls: Partial<Record<DogAncestorRelationKey, string>> = {};

  for (const relationKey of PEDIGREE_RELATION_ORDER) {
    const photoUrl = values.pedigree[relationKey]?.photoUrl?.trim();
    if (photoUrl) {
      pedigreePhotoUrls[relationKey] = photoUrl;
    }
  }

  return {
    mainImageUrl: values.mainImageUrl,
    galleryImageUrls: values.galleryImageUrls,
    pedigreePhotoUrls,
  };
}

function normalizeEphemeralMediaState(state?: EphemeralMediaState | null): EphemeralMediaState {
  const galleryImageUrls = Array.from(
    new Set((state?.galleryImageUrls ?? []).map((item) => item.trim()).filter(Boolean)),
  ).slice(0, 3);

  const pedigreePhotoUrls: Partial<Record<DogAncestorRelationKey, string>> = {};

  for (const relationKey of PEDIGREE_RELATION_ORDER) {
    const photoUrl = state?.pedigreePhotoUrls?.[relationKey]?.trim();
    if (photoUrl) {
      pedigreePhotoUrls[relationKey] = photoUrl;
    }
  }

  return {
    mainImageUrl: state?.mainImageUrl?.trim() || galleryImageUrls[0] || '',
    galleryImageUrls,
    pedigreePhotoUrls,
  };
}

function serializeComparableMediaState(state?: EphemeralMediaState | null) {
  const normalized = normalizeEphemeralMediaState(state);
  return JSON.stringify({
    mainImageUrl: normalized.mainImageUrl ?? '',
    galleryImageUrls: normalized.galleryImageUrls ?? [],
    pedigreePhotoUrls: PEDIGREE_RELATION_ORDER.reduce<Record<string, string>>((result, relationKey) => {
      const value = normalized.pedigreePhotoUrls?.[relationKey];
      if (value) {
        result[relationKey] = value;
      }
      return result;
    }, {}),
  });
}

function hasMediaStateChanged(current: DogFormValues, next: DogFormValues) {
  return serializeComparableMediaState(createEphemeralMediaState(current)) !== serializeComparableMediaState(createEphemeralMediaState(next));
}

function openEphemeralMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(EPHEMERAL_MEDIA_DB_NAME, 1);

    request.onerror = () => reject(request.error ?? new Error('Unable to open local media storage.'));
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(EPHEMERAL_MEDIA_STORE_NAME)) {
        database.createObjectStore(EPHEMERAL_MEDIA_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function getDatabaseValue<T>(database: IDBDatabase, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(EPHEMERAL_MEDIA_STORE_NAME, 'readonly');
    const store = transaction.objectStore(EPHEMERAL_MEDIA_STORE_NAME);
    const request = store.get(key);

    request.onerror = () => reject(request.error ?? new Error('Unable to read local media cache.'));
    request.onsuccess = () => resolve(request.result as T | undefined);
  });
}

function putDatabaseValue(database: IDBDatabase, key: string, value: EphemeralMediaState): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(EPHEMERAL_MEDIA_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(EPHEMERAL_MEDIA_STORE_NAME);
    const request = store.put(value, key);

    request.onerror = () => reject(request.error ?? new Error('Unable to save local media cache.'));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Local media transaction failed.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Local media transaction aborted.'));
  });
}

async function migrateLegacyLocalStorage(keys: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  const legacyEntries = keys
    .map((key) => ({ key, raw: window.localStorage.getItem(key) }))
    .filter((entry) => Boolean(entry.raw)) as Array<{ key: string; raw: string }>;

  if (!legacyEntries.length) {
    return;
  }

  const database = await openEphemeralMediaDatabase();

  try {
    for (const entry of legacyEntries) {
      try {
        const parsed = JSON.parse(entry.raw) as EphemeralMediaState;
        await putDatabaseValue(database, entry.key, normalizeEphemeralMediaState(parsed));
      } catch {
        // ignore corrupted legacy cache values
      }

      window.localStorage.removeItem(entry.key);
    }
  } finally {
    database.close();
  }
}

async function readEphemeralMedia(activeDogId?: string, slug?: string): Promise<EphemeralMediaState | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const keys = buildGalleryStorageKeys(activeDogId, slug);
  await migrateLegacyLocalStorage(keys);

  const database = await openEphemeralMediaDatabase();

  try {
    const merged: EphemeralMediaState = { galleryImageUrls: [], pedigreePhotoUrls: {} };
    let hasData = false;

    for (const key of keys) {
      const parsed = normalizeEphemeralMediaState(await getDatabaseValue<EphemeralMediaState>(database, key));

      if (parsed.mainImageUrl) {
        merged.mainImageUrl = parsed.mainImageUrl;
        hasData = true;
      }

      if (parsed.galleryImageUrls?.length) {
        merged.galleryImageUrls = [...(merged.galleryImageUrls ?? []), ...parsed.galleryImageUrls];
        hasData = true;
      }

      if (parsed.pedigreePhotoUrls && Object.keys(parsed.pedigreePhotoUrls).length > 0) {
        merged.pedigreePhotoUrls = {
          ...(merged.pedigreePhotoUrls ?? {}),
          ...parsed.pedigreePhotoUrls,
        };
        hasData = true;
      }
    }
    return hasData ? normalizeEphemeralMediaState(merged) : null;
  } finally {
    database.close();
  }
}

async function writeEphemeralMedia(payload: EphemeralMediaState, activeDogId?: string, slug?: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const keys = buildGalleryStorageKeys(activeDogId, slug);
  const database = await openEphemeralMediaDatabase();

  try {
    const normalizedPayload = normalizeEphemeralMediaState(payload);

    for (const key of keys) {
      await putDatabaseValue(database, key, normalizedPayload);
      window.localStorage.removeItem(key);
    }
  } finally {
    database.close();
  }
}

function mergeEphemeralValues(current: DogFormValues, next: DogFormValues, cachedMedia?: EphemeralMediaState | null): DogFormValues {
  const galleryCandidates = [
    ...(next.galleryImageUrls ?? []),
    next.mainImageUrl,
    ...(current.galleryImageUrls ?? []),
    current.mainImageUrl,
    ...((cachedMedia?.galleryImageUrls ?? []) as string[]),
    cachedMedia?.mainImageUrl,
  ].filter(Boolean) as string[];

  const galleryImageUrls = Array.from(new Set(galleryCandidates)).slice(0, 3);
  const mainImageUrl = next.mainImageUrl || cachedMedia?.mainImageUrl || galleryImageUrls[0] || '';
  const nextPedigree = { ...next.pedigree };

  for (const relationKey of PEDIGREE_RELATION_ORDER) {
    const cachedPhoto = cachedMedia?.pedigreePhotoUrls?.[relationKey];
    const currentPhoto = current.pedigree[relationKey]?.photoUrl ?? null;
    const nextPhoto = nextPedigree[relationKey]?.photoUrl ?? null;
    const photoUrl = nextPhoto || cachedPhoto || currentPhoto;

    if (photoUrl) {
      nextPedigree[relationKey] = {
        ...(nextPedigree[relationKey] ?? current.pedigree[relationKey] ?? EMPTY_ANCESTOR_PROFILE),
        photoUrl,
      };
    }
  }

  return {
    ...next,
    pedigree: nextPedigree,
    mainImageUrl,
    galleryImageUrls,
    publicationPublicSlug: next.publicationPublicSlug || current.publicationPublicSlug,
    publicationVerificationSlug: next.publicationVerificationSlug || current.publicationVerificationSlug,
    publicationCertificateCode: next.publicationCertificateCode || current.publicationCertificateCode,
    publicationPublishedAt: next.publicationPublishedAt || current.publicationPublishedAt,
  };
}

export function MyDogFormWorkspace({ mode, initialValues, dogId }: MyDogFormWorkspaceProps) {
  const router = useRouter();
  const { locale, dictionary } = useLocale();
  const [activeDogId, setActiveDogId] = useState<string | undefined>(dogId);
  const [values, setValues] = useState<DogFormValues>(() => normalizeDogFormValues(initialValues));
  const [errors, setErrors] = useState<DogFormErrors>({});
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [validationPassed, setValidationPassed] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<'save_draft' | 'submit_for_review' | null>(null);
  const [lastPersistedAtLabel, setLastPersistedAtLabel] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const normalizedInitialValues = normalizeDogFormValues(initialValues);
        const cachedMedia = await readEphemeralMedia(dogId, normalizedInitialValues.slug);
        const mergedValues = mergeEphemeralValues(normalizedInitialValues, normalizedInitialValues, cachedMedia);

        if (!isCancelled) {
          setValues(mergedValues);
        }
      } catch {
        // keep the live form values even if the local media cache cannot be read
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [dogId, initialValues]);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const cachedMedia = await readEphemeralMedia(activeDogId, values.slug);
        if (!cachedMedia || isCancelled) {
          return;
        }

        setValues((current) => {
          const merged = mergeEphemeralValues(current, current, cachedMedia);
          return hasMediaStateChanged(current, merged) ? merged : current;
        });
      } catch {
        // keep the current in-memory gallery if the cache cannot be reopened
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [activeDogId, values.slug]);

  useEffect(() => {
    void writeEphemeralMedia(createEphemeralMediaState(values), activeDogId, values.slug).catch(() => undefined);
  }, [activeDogId, values.slug, values.mainImageUrl, values.galleryImageUrls, values.pedigree]);

  const completionCount = useMemo(() => {
    const importantFields: (keyof DogFormValues)[] = [
      'name',
      'slug',
      'dateOfBirth',
      'color',
      'shortDescription',
      'city',
      'country',
    ];

    return importantFields.filter((field) => String(values[field]).trim().length > 0).length;
  }, [values]);
  const importantFieldsCount = 7;
  const galleryImageCount = Array.from(new Set([values.mainImageUrl, ...values.galleryImageUrls].filter(Boolean))).length;
  const pedigreeFilledCount = getPedigreeFilledCount(values.pedigree);
  const pedigreePhotoCount = getPedigreePhotoCount(values.pedigree);
  const liveValidationErrors = useMemo(() => validateDogForm(
    normalizeDogFormValues({
      ...values,
      slug: values.slug || createSlugFromName(values.name),
    }),
    locale,
  ), [values, locale]);
  const hasBlockingSubmissionIssues = Object.keys(liveValidationErrors).length > 0;

  const handleFieldChange = <K extends keyof DogFormValues>(field: K, value: DogFormValues[K]) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (field === 'pedigree' || field === 'galleryImageUrls') {
        return current;
      }

      const errorField = field as keyof DogFormErrors;

      if (!current[errorField]) {
        return current;
      }

      const nextErrors: DogFormErrors = { ...current };
      delete nextErrors[errorField];
      return nextErrors;
    });

    setValidationPassed(false);
    setSubmitMessage(null);
  };

  const handleAncestorChange = <K extends keyof DogAncestorProfile>(
    relationKey: DogAncestorRelationKey,
    field: K,
    value: DogAncestorProfile[K],
  ) => {
    setValues((current) => ({
      ...current,
      pedigree: updatePedigreeAncestor(current.pedigree, relationKey, field, value),
    }));

    setValidationPassed(false);
    setSubmitMessage(null);
  };

  const handleGenerateSlug = () => {
    setValues((current) => ({
      ...current,
      slug: createSlugFromName(current.name || current.slug),
    }));
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors.slug;
      return nextErrors;
    });
    setSubmitMessage(dictionary.form.workspace.slugGenerated);
  };

  const handleValidateProfile = () => {
    const nextErrors = validateDogForm(values, locale);
    setErrors(nextErrors);

    const isValid = Object.keys(nextErrors).length === 0;
    setValidationPassed(isValid);
    setSubmitMessage(
      isValid ? dictionary.form.workspace.validationPassed : dictionary.form.workspace.validationIssues,
    );
  };

  const runAction = async (intent: 'save_draft' | 'submit_for_review') => {
    const normalizedValues = normalizeDogFormValues({
      ...values,
      slug: values.slug || createSlugFromName(values.name),
    });

    if (intent === 'submit_for_review') {
      const nextErrors = validateDogForm(normalizedValues, locale);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        setValidationPassed(false);
        setSubmitMessage(dictionary.form.workspace.submissionBlocked);
        return;
      }
    }

    setPendingIntent(intent);

    try {
      const payloadValues = await compactDogFormValuesForPayload(normalizedValues);
      const response = await mutateDogProfile(
        mapDogFormValuesToActionInput(payloadValues, intent, activeDogId),
      );
      const result = response.result;
      const cachedMedia = createEphemeralMediaState(payloadValues);
      await writeEphemeralMedia(cachedMedia, result.dogId, payloadValues.slug);
      const mappedProfile = mergeEphemeralValues(
        payloadValues,
        mapActionProfileToDogFormValues(result.profile),
        cachedMedia,
      );

      setActiveDogId(result.dogId);
      setValues(mappedProfile);
      setLastPersistedAtLabel(formatPersistedAtLabel(result.persistedAt));
      setValidationPassed(result.ok && result.lifecycleStatus === 'submitted');
      setSubmitMessage(
        `${result.message} ${completionCount}/${importantFieldsCount} ${dictionary.form.workspace.submitMessageSuffix}`,
      );

      if (result.ok) {
        setErrors({});
        router.refresh();

        if (mode === 'create') {
          router.replace(`/my-dogs/${result.dogId}/edit`);
        }
      }
    } catch (error) {
      if (error instanceof ApiRequestError && error.code === 'DOG_VALIDATION_FAILED' && error.details) {
        setErrors(error.details as DogFormErrors);
      }

      let message = error instanceof Error ? error.message : 'The dog profile action failed.';

      if (error instanceof ApiRequestError && error.code === 'INVALID_API_RESPONSE') {
        message = error.status === 413
          ? dictionary.form.workspace.payloadTooLarge
          : dictionary.form.workspace.unexpectedApiResponse;
      }

      setValidationPassed(false);
      setSubmitMessage(`${dictionary.form.workspace.serverActionFailedPrefix} ${message}`);
    } finally {
      setPendingIntent(null);
    }
  };

  const priorityCopy = {
    en: {
      eyebrow: 'Edit Cane Corso',
      title: values.name ? `Work on ${values.name}` : 'Create the Cane Corso profile',
      description: 'Fill the form first. Photos, pedigree, and the final review stay visible, but the main task starts immediately.',
      essentials: 'Main details',
      photos: 'Photos',
      pedigree: 'Pedigree',
      review: 'Review status',
      ready: 'ready',
      issues: 'items need attention',
    },
    bg: {
      eyebrow: 'Редакция на Cane Corso',
      title: values.name ? `Работа по ${values.name}` : 'Създай Cane Corso профил',
      description: 'Попълни формата първо. Снимките, родословието и финалната проверка остават видими, но основната задача започва веднага.',
      essentials: 'Основни данни',
      photos: 'Снимки',
      pedigree: 'Родословие',
      review: 'Статус на прегледа',
      ready: 'готово',
      issues: 'полета имат нужда от внимание',
    },
    it: {
      eyebrow: 'Modifica Cane Corso',
      title: values.name ? `Lavora su ${values.name}` : 'Crea il profilo Cane Corso',
      description: 'Compila prima il modulo. Foto, pedigree e controllo finale restano visibili, ma il compito principale inizia subito.',
      essentials: 'Dati principali',
      photos: 'Foto',
      pedigree: 'Pedigree',
      review: 'Stato revisione',
      ready: 'pronto',
      issues: 'campi richiedono attenzione',
    },
  }[locale] ?? {
    eyebrow: 'Edit Cane Corso',
    title: values.name ? `Work on ${values.name}` : 'Create the Cane Corso profile',
    description: 'Fill the form first. Photos, pedigree, and the final review stay visible, but the main task starts immediately.',
    essentials: 'Main details',
    photos: 'Photos',
    pedigree: 'Pedigree',
    review: 'Review status',
    ready: 'ready',
    issues: 'items need attention',
  };

  const profileStatusText = hasBlockingSubmissionIssues
    ? `${Object.keys(liveValidationErrors).length} ${priorityCopy.issues}`
    : priorityCopy.ready;

  return (
    <div className="two-column-layout dog-form-layout--simplified dog-form-layout--form-first">
      <div className="form-workspace-main-stack">
        <section className="content-card dog-form-priority-card">
          <div>
            <span className="eyebrow-label">{priorityCopy.eyebrow}</span>
            <h2>{priorityCopy.title}</h2>
            <p>{priorityCopy.description}</p>
          </div>
          <div className="dog-form-priority-card__grid">
            <div>
              <span>{priorityCopy.essentials}</span>
              <strong>{completionCount}/{importantFieldsCount}</strong>
            </div>
            <div>
              <span>{priorityCopy.photos}</span>
              <strong>{galleryImageCount}/3</strong>
            </div>
            <div>
              <span>{priorityCopy.pedigree}</span>
              <strong>{pedigreeFilledCount}/14</strong>
            </div>
            <div>
              <span>{priorityCopy.review}</span>
              <strong>{profileStatusText}</strong>
            </div>
          </div>
        </section>

        <DogProfileForm
          mode={mode}
          values={values}
          errors={errors}
          dogId={activeDogId}
          submitMessage={submitMessage}
          pendingIntent={pendingIntent}
          lastPersistedAtLabel={lastPersistedAtLabel}
          onFieldChange={handleFieldChange}
          onAncestorChange={handleAncestorChange}
          onGenerateSlug={handleGenerateSlug}
          onValidateProfile={handleValidateProfile}
          onSaveDraft={() => void runAction('save_draft')}
          onSubmitForReview={() => void runAction('submit_for_review')}
        />

        <div className="dog-form-guidance-stack">
          <UsgMeasurementAssistantPanel
            locale={locale}
            dogId={activeDogId}
            dogName={values.name}
            sex={values.sex}
            dateOfBirth={values.dateOfBirth}
            color={values.color}
          />

          <OwnerReviewReadinessPanel
            locale={locale}
            context="form"
            dogName={values.name}
            slug={values.slug}
            lifecycleStatus={values.lifecycleStatus}
            visibility={values.visibility}
            hasPublication={Boolean(values.publicationPublicSlug)}
            hasCertificate={Boolean(values.publicationCertificateCode)}
            hasName={Boolean(values.name.trim())}
            hasSlug={Boolean(values.slug.trim())}
            hasDateOfBirth={Boolean(values.dateOfBirth)}
            hasColor={Boolean(values.color.trim())}
            hasShortDescription={Boolean(values.shortDescription.trim())}
            hasCity={Boolean(values.city.trim())}
            hasCountry={Boolean(values.country.trim())}
            hasPrimaryImage={Boolean(values.mainImageUrl || values.galleryImageUrls[0])}
            galleryImageCount={galleryImageCount}
            pedigreeFilledCount={pedigreeFilledCount}
            pedigreePhotoCount={pedigreePhotoCount}
            mediaHref={activeDogId ? `/my-dogs/${activeDogId}/media` : undefined}
            compact
          />

          <OwnerSubmissionHappyPathPanel
            locale={locale}
            mode={mode}
            dogId={activeDogId}
            dogName={values.name}
            lifecycleStatus={values.lifecycleStatus}
            hasBlockingIssues={hasBlockingSubmissionIssues}
            completionCount={completionCount}
            importantFieldsCount={importantFieldsCount}
            galleryImageCount={galleryImageCount}
            pedigreeFilledCount={pedigreeFilledCount}
            isSaving={pendingIntent === 'save_draft'}
            isSubmitting={pendingIntent === 'submit_for_review'}
            lastPersistedAtLabel={lastPersistedAtLabel}
          />

        </div>
      </div>
      <DogProfilePreviewCard
        values={values}
        mode={mode}
        errors={errors}
        validationPassed={validationPassed}
        persistenceStateLabel={
          lastPersistedAtLabel
            ? `${dictionary.form.workspace.persistedTo} ${lastPersistedAtLabel}.`
            : null
        }
      />
    </div>
  );
}
