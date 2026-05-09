'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CreateDogMeasurementInput, DogMeasurementRecord } from '@cane-corso-platform/contracts';
import type { DogSex } from '@/lib/dog-form.types';
import type { Locale } from '@/lib/i18n';
import { ApiRequestError } from '@/lib/api/fetcher';
import {
  createDogMeasurement,
  deleteDogMeasurement,
  listDogMeasurements,
} from '@/lib/api/dog-measurements.client';
import {
  evaluateUsgMeasurementAssistant,
  type MeasurementRange,
  type UsgMeasurementCheck,
  type UsgMeasurementInput,
  type UsgMeasurementResult,
} from '@/lib/usg-measurement-assistant';

interface UsgMeasurementAssistantPanelProps {
  locale: Locale;
  dogId?: string;
  dogName?: string;
  sex: DogSex;
  dateOfBirth?: string;
  color?: string;
}

type MeasurementState = {
  measuredAt: string;
  weightKg: string;
  heightWithersCm: string;
  bodyLengthCm: string;
  chestCircumferenceCm: string;
  headLengthCm: string;
  muzzleLengthCm: string;
  skullLengthCm: string;
  note: string;
};

type MeasurementFieldKey = Exclude<keyof MeasurementState, 'measuredAt' | 'note'>;
type ArchiveStatus = 'missing' | 'within' | 'watch' | 'attention';

const copyByLocale = {
  en: {
    eyebrow: 'USG growth helper',
    title: 'Measurement assistant & private archive',
    description:
      'Enter measurements by date and USG will compare them with age-aware growth ranges and core Cane Corso proportions.',
    safety:
      'Educational orientation only. This is not a veterinary diagnosis, not a DNA test, and not an automatic official judging decision.',
    profile: 'Profile base',
    dog: 'Cane Corso',
    sex: 'Sex',
    age: 'Age',
    color: 'Color',
    male: 'Male',
    female: 'Female',
    notSet: 'Not set yet',
    months: 'months',
    unknownAge: 'Add birth date for age-aware calculation',
    fieldsTitle: 'New measurement record',
    fieldsDescription: 'Save a private dated record so the owner can follow growth, weight, and proportions over time.',
    dateLabel: 'Measurement date',
    noteLabel: 'Owner note',
    notePlaceholder: 'Food, training, health note, morning/evening...',
    fields: {
      weightKg: 'Weight kg',
      heightWithersCm: 'Height at withers cm',
      bodyLengthCm: 'Body length cm',
      chestCircumferenceCm: 'Chest circumference cm',
      headLengthCm: 'Head length cm',
      muzzleLengthCm: 'Muzzle length cm',
      skullLengthCm: 'Skull length cm',
    },
    resultsTitle: 'USG preview for this record',
    score: 'Data confidence',
    enough: 'Enough data for an orientation',
    needsMore: 'Add at least two measurements for a stronger preview',
    current: 'Current',
    expected: 'Expected',
    difference: 'Difference',
    saveRecord: 'Save measurement',
    saving: 'Saving...',
    saved: 'Measurement saved to the private archive.',
    loadError: 'Measurements could not be loaded.',
    saveError: 'Measurement could not be saved.',
    deleteError: 'Measurement could not be deleted.',
    cannotSaveDraft: 'Save the Cane Corso profile first, then the measurement archive becomes available.',
    archiveTitle: 'Private measurement archive',
    archiveDescription: 'Only the owner and authorized admin can use this history. It is not public registry data.',
    noRecords: 'No saved measurements yet.',
    delete: 'Delete',
    trendTitle: 'Latest movement',
    trendEmpty: 'Add at least two records to see movement between dates.',
    statuses: {
      missing: 'Waiting for data',
      below: 'Below orientation range',
      within: 'Within orientation range',
      above: 'Above orientation range',
      watch: 'Near edge / watch',
    },
    archiveStatuses: {
      missing: 'Needs data',
      within: 'Within orientation',
      watch: 'Watch trend',
      attention: 'Needs attention',
    },
    checks: {
      weight: 'Weight development',
      height: 'Height development',
      bodyLength: 'Body proportion',
      headLength: 'Head proportion',
      muzzleSkull: 'Muzzle / skull proportion',
      chest: 'Chest development',
    },
    stage: {
      puppy: 'Puppy growth phase',
      junior: 'Junior growth phase',
      young_adult: 'Young adult transition',
      adult: 'Adult orientation',
      unknown: 'Age unknown',
    },
    table: {
      date: 'Date',
      age: 'Age',
      weight: 'Weight',
      height: 'Height',
      body: 'Body',
      head: 'Head',
      muzzle: 'Muzzle',
      status: 'Status',
      note: 'Note',
    },
    notes: [
      'Body length uses the official reading orientation: height at withers + about 11%.',
      'Head length uses the core proportion: about 36% of height at withers.',
      'Muzzle / skull uses the 1:2 orientation and should be interpreted by a human reviewer.',
    ],
    future: 'This archive supports owner tracking and future admin review context; it does not approve, reject, or certify the dog automatically.',
  },
  bg: {
    eyebrow: 'USG помощник за растеж',
    title: 'Асистент за измервания и личен архив',
    description:
      'Въведи измервания по дата и USG ще ги сравни с ориентировъчни диапазони по възраст и с основни Cane Corso пропорции.',
    safety:
      'Само образователен ориентир. Това не е ветеринарна диагноза, не е ДНК тест и не е автоматично официално съдийско решение.',
    profile: 'Основа на профила',
    dog: 'Cane Corso',
    sex: 'Пол',
    age: 'Възраст',
    color: 'Цвят',
    male: 'Мъжко',
    female: 'Женско',
    notSet: 'Още не е попълнено',
    months: 'месеца',
    unknownAge: 'Добави дата на раждане за сметка по възраст',
    fieldsTitle: 'Нов запис с измервания',
    fieldsDescription: 'Запази личен запис по дата, за да следиш растеж, тегло и пропорции във времето.',
    dateLabel: 'Дата на измерване',
    noteLabel: 'Бележка на собственика',
    notePlaceholder: 'Храна, тренировка, здравна бележка, сутрин/вечер...',
    fields: {
      weightKg: 'Тегло кг',
      heightWithersCm: 'Височина при холката см',
      bodyLengthCm: 'Дължина на тялото см',
      chestCircumferenceCm: 'Гръдна обиколка см',
      headLengthCm: 'Дължина на глава см',
      muzzleLengthCm: 'Дължина на муцуна см',
      skullLengthCm: 'Дължина на череп см',
    },
    resultsTitle: 'USG преглед за този запис',
    score: 'Увереност на данните',
    enough: 'Има достатъчно данни за ориентир',
    needsMore: 'Добави поне две измервания за по-силен преглед',
    current: 'Въведено',
    expected: 'Ориентир',
    difference: 'Разлика',
    saveRecord: 'Запази измерване',
    saving: 'Запазване...',
    saved: 'Измерването е запазено в личния архив.',
    loadError: 'Измерванията не можаха да се заредят.',
    saveError: 'Измерването не можа да се запази.',
    deleteError: 'Измерването не можа да се изтрие.',
    cannotSaveDraft: 'Първо запази профила на Cane Corso, после архивът за измервания става активен.',
    archiveTitle: 'Личен архив с измервания',
    archiveDescription: 'Тази история е за собственика и оторизиран админ. Не е публична информация за регистъра.',
    noRecords: 'Още няма запазени измервания.',
    delete: 'Изтрий',
    trendTitle: 'Последна промяна',
    trendEmpty: 'Добави поне два записа, за да видиш движение между датите.',
    statuses: {
      missing: 'Очаква данни',
      below: 'Под ориентировъчния диапазон',
      within: 'В ориентировъчния диапазон',
      above: 'Над ориентировъчния диапазон',
      watch: 'Близо до граница / наблюдение',
    },
    archiveStatuses: {
      missing: 'Нужни са данни',
      within: 'В ориентир',
      watch: 'Наблюдавай тренда',
      attention: 'Иска внимание',
    },
    checks: {
      weight: 'Развитие на теглото',
      height: 'Развитие на височината',
      bodyLength: 'Пропорция на тялото',
      headLength: 'Пропорция на главата',
      muzzleSkull: 'Пропорция муцуна / череп',
      chest: 'Развитие на гръдния кош',
    },
    stage: {
      puppy: 'Фаза на растеж',
      junior: 'Млада фаза на развитие',
      young_adult: 'Преход към зряло куче',
      adult: 'Ориентир за зряло куче',
      unknown: 'Неясна възраст',
    },
    table: {
      date: 'Дата',
      age: 'Възраст',
      weight: 'Тегло',
      height: 'Височина',
      body: 'Тяло',
      head: 'Глава',
      muzzle: 'Муцуна',
      status: 'Статус',
      note: 'Бележка',
    },
    notes: [
      'Дължината на тялото използва официалния ориентир: височина при холката + около 11%.',
      'Дължината на главата използва основната пропорция: около 36% от височината при холката.',
      'Муцуна / череп използва ориентир 1:2 и трябва да се тълкува от човек, не автоматично.',
    ],
    future: 'Архивът помага за проследяване и бъдещ админ контекст; не одобрява, не отхвърля и не сертифицира автоматично.',
  },
  it: {
    eyebrow: 'Assistente crescita USG',
    title: 'Assistente misurazioni e archivio privato',
    description:
      'Inserisci misurazioni per data e USG le confronta con intervalli orientativi per età e proporzioni principali del Cane Corso.',
    safety:
      'Solo orientamento educativo. Non è diagnosi veterinaria, non è test DNA e non è decisione ufficiale automatica di giudizio.',
    profile: 'Base profilo',
    dog: 'Cane Corso',
    sex: 'Sesso',
    age: 'Età',
    color: 'Colore',
    male: 'Maschio',
    female: 'Femmina',
    notSet: 'Non ancora inserito',
    months: 'mesi',
    unknownAge: 'Aggiungi la data di nascita per il calcolo per età',
    fieldsTitle: 'Nuova registrazione misure',
    fieldsDescription: 'Salva una registrazione privata con data per seguire crescita, peso e proporzioni nel tempo.',
    dateLabel: 'Data misurazione',
    noteLabel: 'Nota proprietario',
    notePlaceholder: 'Alimentazione, allenamento, salute, mattina/sera...',
    fields: {
      weightKg: 'Peso kg',
      heightWithersCm: 'Altezza al garrese cm',
      bodyLengthCm: 'Lunghezza corpo cm',
      chestCircumferenceCm: 'Circonferenza torace cm',
      headLengthCm: 'Lunghezza testa cm',
      muzzleLengthCm: 'Lunghezza muso cm',
      skullLengthCm: 'Lunghezza cranio cm',
    },
    resultsTitle: 'Preview USG per questa registrazione',
    score: 'Affidabilità dati',
    enough: 'Dati sufficienti per un orientamento',
    needsMore: 'Aggiungi almeno due misurazioni per una preview più forte',
    current: 'Inserito',
    expected: 'Orientamento',
    difference: 'Differenza',
    saveRecord: 'Salva misurazione',
    saving: 'Salvataggio...',
    saved: 'Misurazione salvata nell’archivio privato.',
    loadError: 'Impossibile caricare le misurazioni.',
    saveError: 'Impossibile salvare la misurazione.',
    deleteError: 'Impossibile eliminare la misurazione.',
    cannotSaveDraft: 'Salva prima il profilo Cane Corso, poi l’archivio misurazioni diventa disponibile.',
    archiveTitle: 'Archivio privato misurazioni',
    archiveDescription: 'Questa storia è per il proprietario e admin autorizzato. Non è dato pubblico del registro.',
    noRecords: 'Nessuna misurazione salvata ancora.',
    delete: 'Elimina',
    trendTitle: 'Ultimo movimento',
    trendEmpty: 'Aggiungi almeno due registrazioni per vedere il movimento tra date.',
    statuses: {
      missing: 'In attesa di dati',
      below: 'Sotto intervallo orientativo',
      within: 'Dentro intervallo orientativo',
      above: 'Sopra intervallo orientativo',
      watch: 'Vicino al limite / osservare',
    },
    archiveStatuses: {
      missing: 'Servono dati',
      within: 'Dentro orientamento',
      watch: 'Osserva trend',
      attention: 'Richiede attenzione',
    },
    checks: {
      weight: 'Sviluppo peso',
      height: 'Sviluppo altezza',
      bodyLength: 'Proporzione corpo',
      headLength: 'Proporzione testa',
      muzzleSkull: 'Proporzione muso / cranio',
      chest: 'Sviluppo torace',
    },
    stage: {
      puppy: 'Fase crescita cucciolo',
      junior: 'Fase sviluppo giovane',
      young_adult: 'Transizione giovane adulto',
      adult: 'Orientamento adulto',
      unknown: 'Età sconosciuta',
    },
    table: {
      date: 'Data',
      age: 'Età',
      weight: 'Peso',
      height: 'Altezza',
      body: 'Corpo',
      head: 'Testa',
      muzzle: 'Muso',
      status: 'Stato',
      note: 'Nota',
    },
    notes: [
      'La lunghezza del corpo usa l’orientamento ufficiale: altezza al garrese + circa 11%.',
      'La lunghezza della testa usa la proporzione centrale: circa 36% dell’altezza al garrese.',
      'Muso / cranio usa l’orientamento 1:2 e va interpretato da un revisore umano.',
    ],
    future: 'L’archivio aiuta il tracking del proprietario e il futuro contesto admin; non approva, rifiuta o certifica automaticamente.',
  },
} as const;

const fields: MeasurementFieldKey[] = [
  'weightKg',
  'heightWithersCm',
  'bodyLengthCm',
  'chestCircumferenceCm',
  'headLengthCm',
  'muzzleLengthCm',
  'skullLengthCm',
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseNumber(value: string): number | null {
  const normalized = value.replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatRange(range: MeasurementRange | null): string {
  if (!range) return '—';
  return `${range.low}–${range.high}`;
}

function formatValue(value: number | null | undefined, suffix = ''): string {
  if (value == null) return '—';
  const rendered = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return suffix ? `${rendered}${suffix}` : rendered;
}

function formatDelta(value: number | null): string {
  if (value == null) return '—';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatValue(value)}`;
}

function statusClass(status: UsgMeasurementCheck['status']) {
  return `measurement-check-card measurement-check-card--${status}`;
}

function archiveStatusClass(status: ArchiveStatus) {
  return `measurement-archive-status measurement-archive-status--${status}`;
}

function createEmptyMeasurementState(): MeasurementState {
  return {
    measuredAt: todayIso(),
    weightKg: '',
    heightWithersCm: '',
    bodyLengthCm: '',
    chestCircumferenceCm: '',
    headLengthCm: '',
    muzzleLengthCm: '',
    skullLengthCm: '',
    note: '',
  };
}

function toInput(state: MeasurementState): CreateDogMeasurementInput {
  return {
    measuredAt: state.measuredAt,
    weightKg: parseNumber(state.weightKg),
    heightWithersCm: parseNumber(state.heightWithersCm),
    bodyLengthCm: parseNumber(state.bodyLengthCm),
    chestCircumferenceCm: parseNumber(state.chestCircumferenceCm),
    headLengthCm: parseNumber(state.headLengthCm),
    muzzleLengthCm: parseNumber(state.muzzleLengthCm),
    skullLengthCm: parseNumber(state.skullLengthCm),
    note: state.note.trim() || null,
  };
}

function inputFromRecord(record: DogMeasurementRecord): UsgMeasurementInput {
  return {
    sex: 'male',
    measurementDate: record.measuredAt,
    weightKg: record.weightKg,
    heightWithersCm: record.heightWithersCm,
    bodyLengthCm: record.bodyLengthCm,
    chestCircumferenceCm: record.chestCircumferenceCm,
    headLengthCm: record.headLengthCm,
    muzzleLengthCm: record.muzzleLengthCm,
    skullLengthCm: record.skullLengthCm,
  };
}

type MeasurementEvaluationInput = CreateDogMeasurementInput | UsgMeasurementInput;

function withProfileBase(input: MeasurementEvaluationInput, sex: DogSex, dateOfBirth?: string): UsgMeasurementInput {
  return {
    sex,
    dateOfBirth,
    measurementDate: 'measuredAt' in input ? input.measuredAt : input.measurementDate,
    weightKg: input.weightKg,
    heightWithersCm: input.heightWithersCm,
    bodyLengthCm: input.bodyLengthCm,
    chestCircumferenceCm: input.chestCircumferenceCm,
    headLengthCm: input.headLengthCm,
    muzzleLengthCm: input.muzzleLengthCm,
    skullLengthCm: input.skullLengthCm,
  };
}

function getArchiveStatus(result: UsgMeasurementResult): ArchiveStatus {
  const completed = result.checks.filter((check) => check.status !== 'missing');
  if (!completed.length) return 'missing';
  if (completed.some((check) => check.status === 'below' || check.status === 'above')) return 'attention';
  if (completed.every((check) => check.status === 'within')) return 'within';
  return 'watch';
}

function hasAnyMeasurement(input: CreateDogMeasurementInput): boolean {
  return fields.some((field) => typeof input[field] === 'number' && Number.isFinite(input[field]));
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiRequestError) return error.message || fallback;
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

export function UsgMeasurementAssistantPanel({ locale, dogId, dogName, sex, dateOfBirth, color }: UsgMeasurementAssistantPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const [measurements, setMeasurements] = useState<MeasurementState>(() => createEmptyMeasurementState());
  const [records, setRecords] = useState<DogMeasurementRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!dogId) {
      setRecords([]);
      return () => {
        active = false;
      };
    }

    setIsLoadingRecords(true);
    setError(null);

    listDogMeasurements(dogId)
      .then((document) => {
        if (!active) return;
        setRecords(document.records);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(getErrorMessage(loadError, copy.loadError));
      })
      .finally(() => {
        if (!active) return;
        setIsLoadingRecords(false);
      });

    return () => {
      active = false;
    };
  }, [copy.loadError, dogId]);

  const currentInput = useMemo(() => toInput(measurements), [measurements]);
  const result = useMemo(() => evaluateUsgMeasurementAssistant(withProfileBase(currentInput, sex, dateOfBirth)), [currentInput, dateOfBirth, sex]);

  const sexLabel = sex === 'male' ? copy.male : copy.female;
  const ageLabel = result.ageMonths == null ? copy.unknownAge : `${result.ageMonths} ${copy.months}`;
  const canSave = Boolean(dogId) && hasAnyMeasurement(currentInput) && !isSaving;

  const recordRows = useMemo(() => records.map((record) => {
    const recordResult = evaluateUsgMeasurementAssistant(withProfileBase(inputFromRecord(record), sex, dateOfBirth));
    return {
      record,
      result: recordResult,
      status: getArchiveStatus(recordResult),
    };
  }), [dateOfBirth, records, sex]);

  const latestMovement = useMemo(() => {
    if (records.length < 2) return null;

    const [latest, previous] = records;

    return {
      weightKg: latest.weightKg != null && previous.weightKg != null ? Number((latest.weightKg - previous.weightKg).toFixed(1)) : null,
      heightWithersCm: latest.heightWithersCm != null && previous.heightWithersCm != null
        ? Number((latest.heightWithersCm - previous.heightWithersCm).toFixed(1))
        : null,
      bodyLengthCm: latest.bodyLengthCm != null && previous.bodyLengthCm != null
        ? Number((latest.bodyLengthCm - previous.bodyLengthCm).toFixed(1))
        : null,
    };
  }, [records]);

  const handleChange = (field: keyof MeasurementState, value: string) => {
    setMeasurements((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!dogId) {
      setError(copy.cannotSaveDraft);
      return;
    }

    if (!hasAnyMeasurement(currentInput)) {
      setError(copy.needsMore);
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const document = await createDogMeasurement(dogId, currentInput);
      setRecords(document.records);
      setMeasurements(createEmptyMeasurementState());
      setMessage(copy.saved);
    } catch (saveError: unknown) {
      setError(getErrorMessage(saveError, copy.saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!dogId) return;

    setDeletingRecordId(recordId);
    setError(null);
    setMessage(null);

    try {
      const document = await deleteDogMeasurement(dogId, recordId);
      setRecords(document.records);
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError, copy.deleteError));
    } finally {
      setDeletingRecordId(null);
    }
  };

  return (
    <section className="content-card usg-measurement-assistant" aria-label={copy.title}>
      <div className="usg-measurement-assistant__header">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="usg-measurement-assistant__seal" aria-hidden="true">USG</div>
      </div>

      <div className="usg-measurement-assistant__safety">
        {copy.safety}
      </div>

      <div className="usg-measurement-assistant__profile-grid" aria-label={copy.profile}>
        <div>
          <span>{copy.dog}</span>
          <strong>{dogName?.trim() || copy.notSet}</strong>
        </div>
        <div>
          <span>{copy.sex}</span>
          <strong>{sexLabel}</strong>
        </div>
        <div>
          <span>{copy.age}</span>
          <strong>{ageLabel}</strong>
        </div>
        <div>
          <span>{copy.color}</span>
          <strong>{color?.trim() || copy.notSet}</strong>
        </div>
      </div>

      <div className="usg-measurement-assistant__stage-row">
        <span className="route-pill route-pill--glow">{copy.stage[result.lifeStage]}</span>
        <span className="route-pill subtle">{copy.score}: {result.readinessScore}%</span>
        <span className="route-pill subtle">{result.hasEnoughData ? copy.enough : copy.needsMore}</span>
      </div>

      <div className="usg-measurement-assistant__form-block">
        <div className="section-block__header compact">
          <div>
            <div className="section-block__eyebrow">{copy.fieldsTitle}</div>
            <p className="section-block__description">{copy.fieldsDescription}</p>
          </div>
        </div>
        <div className="usg-measurement-assistant__input-grid">
          <label className="measurement-input measurement-input--date">
            <span>{copy.dateLabel}</span>
            <input
              type="date"
              value={measurements.measuredAt}
              onChange={(event) => handleChange('measuredAt', event.target.value)}
            />
          </label>
          {fields.map((field) => (
            <label className="measurement-input" key={field}>
              <span>{copy.fields[field]}</span>
              <input
                inputMode="decimal"
                value={measurements[field]}
                onChange={(event) => handleChange(field, event.target.value)}
                placeholder="0"
              />
            </label>
          ))}
          <label className="measurement-input measurement-input--note">
            <span>{copy.noteLabel}</span>
            <input
              value={measurements.note}
              onChange={(event) => handleChange('note', event.target.value)}
              placeholder={copy.notePlaceholder}
              maxLength={240}
            />
          </label>
        </div>
        <div className="measurement-save-row">
          <button type="button" className="button-primary" onClick={() => void handleSave()} disabled={!canSave}>
            {isSaving ? copy.saving : copy.saveRecord}
          </button>
          {!dogId ? <span>{copy.cannotSaveDraft}</span> : null}
        </div>
        {message ? <p className="measurement-message measurement-message--success">{message}</p> : null}
        {error ? <p className="measurement-message measurement-message--error">{error}</p> : null}
      </div>

      <div className="usg-measurement-assistant__result-head">
        <span className="eyebrow-label">{copy.resultsTitle}</span>
      </div>
      <div className="usg-measurement-assistant__checks">
        {result.checks.map((check) => (
          <article className={statusClass(check.status)} key={check.key}>
            <div className="measurement-check-card__head">
              <strong>{copy.checks[check.key]}</strong>
              <span>{copy.statuses[check.status]}</span>
            </div>
            <dl>
              <div>
                <dt>{copy.current}</dt>
                <dd>{formatValue(check.value)}</dd>
              </div>
              <div>
                <dt>{copy.expected}</dt>
                <dd>{formatRange(check.expectedRange)}</dd>
              </div>
              <div>
                <dt>{copy.difference}</dt>
                <dd>{formatValue(check.difference)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="measurement-archive-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.archiveTitle}</span>
            <h3>{copy.archiveTitle}</h3>
            <p className="section-support-copy">{copy.archiveDescription}</p>
          </div>
          <span className="route-pill subtle">{records.length}</span>
        </div>

        <div className="measurement-trend-card">
          <strong>{copy.trendTitle}</strong>
          {latestMovement ? (
            <div className="measurement-trend-grid">
              <span>{copy.table.weight}: {formatDelta(latestMovement.weightKg)} кг</span>
              <span>{copy.table.height}: {formatDelta(latestMovement.heightWithersCm)} см</span>
              <span>{copy.table.body}: {formatDelta(latestMovement.bodyLengthCm)} см</span>
            </div>
          ) : (
            <p>{copy.trendEmpty}</p>
          )}
        </div>

        {isLoadingRecords ? <p className="section-support-copy">{copy.archiveTitle}...</p> : null}
        {!isLoadingRecords && records.length === 0 ? <p className="section-support-copy">{copy.noRecords}</p> : null}

        {records.length > 0 ? (
          <div className="measurement-archive-table-wrap">
            <table className="measurement-archive-table">
              <thead>
                <tr>
                  <th>{copy.table.date}</th>
                  <th>{copy.table.age}</th>
                  <th>{copy.table.weight}</th>
                  <th>{copy.table.height}</th>
                  <th>{copy.table.body}</th>
                  <th>{copy.table.head}</th>
                  <th>{copy.table.muzzle}</th>
                  <th>{copy.table.status}</th>
                  <th>{copy.table.note}</th>
                  <th aria-label={copy.delete}></th>
                </tr>
              </thead>
              <tbody>
                {recordRows.map(({ record, result: recordResult, status }) => (
                  <tr key={record.id}>
                    <td>{record.measuredAt}</td>
                    <td>{recordResult.ageMonths == null ? '—' : `${recordResult.ageMonths} ${copy.months}`}</td>
                    <td>{formatValue(record.weightKg, ' кг')}</td>
                    <td>{formatValue(record.heightWithersCm, ' см')}</td>
                    <td>{formatValue(record.bodyLengthCm, ' см')}</td>
                    <td>{formatValue(record.headLengthCm, ' см')}</td>
                    <td>{formatValue(record.muzzleLengthCm, ' см')}</td>
                    <td><span className={archiveStatusClass(status)}>{copy.archiveStatuses[status]}</span></td>
                    <td>{record.note || '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="button-ghost small"
                        onClick={() => void handleDelete(record.id)}
                        disabled={deletingRecordId === record.id}
                      >
                        {copy.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <div className="usg-measurement-assistant__notes">
        {copy.notes.map((note) => <p key={note}>{note}</p>)}
        <strong>{copy.future}</strong>
      </div>
    </section>
  );
}
