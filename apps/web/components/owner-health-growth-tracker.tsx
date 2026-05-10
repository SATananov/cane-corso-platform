"use client";

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type {
  CreateDogHealthRecordInput,
  CreateDogMeasurementInput,
  DogHealthRecord,
  DogHealthRecordCategory,
  DogMeasurementRecord,
} from '@cane-corso-platform/contracts';
import {
  createDogMeasurement,
  deleteDogMeasurement,
  listDogMeasurements,
} from '@/lib/api/dog-measurements.client';
import {
  createDogHealthRecord,
  deleteDogHealthRecord,
  listDogHealthRecords,
} from '@/lib/api/dog-health.client';
import type { Locale } from '@/lib/i18n';

interface OwnerHealthGrowthTrackerProps {
  locale: Locale;
  dogId: string;
  dogName: string;
  dateOfBirth?: string | null;
}

type ActivePanel = 'weight' | 'vaccine';

type WeightFormState = {
  measuredAt: string;
  weightKg: string;
  heightWithersCm: string;
  note: string;
};

type HealthFormState = {
  category: DogHealthRecordCategory;
  title: string;
  performedAt: string;
  nextDueAt: string;
  veterinarian: string;
  clinic: string;
  batchNumber: string;
  documentUrl: string;
  note: string;
};

const categories: DogHealthRecordCategory[] = ['vaccine', 'deworming', 'vet_visit', 'medication', 'note'];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyWeightForm(): WeightFormState {
  return {
    measuredAt: todayIso(),
    weightKg: '',
    heightWithersCm: '',
    note: '',
  };
}

function createEmptyHealthForm(): HealthFormState {
  return {
    category: 'vaccine',
    title: '',
    performedAt: todayIso(),
    nextDueAt: '',
    veterinarian: '',
    clinic: '',
    batchNumber: '',
    documentUrl: '',
    note: '',
  };
}

const copy = {
  en: {
    eyebrow: 'Owner health tracker',
    title: 'Growth, weight and vaccines',
    body: 'Keep a private care history for this Cane Corso: monthly weight, height, vaccines, parasite care and important veterinary notes.',
    privatePill: 'Private owner record',
    vetPill: 'Veterinarian remains the authority',
    archivePill: 'Growth history',
    latestWeight: 'Latest weight',
    latestWeightEmpty: 'No weight yet',
    nextVaccine: 'Next important date',
    nextVaccineEmpty: 'No due date saved',
    healthRecords: 'Health records',
    openWeight: 'Add weight',
    openVaccine: 'Add vaccine / note',
    weightTitle: 'Monthly growth table',
    weightBody: 'Record weight by date. Age by months is calculated from the saved birth date when available.',
    vaccineTitle: 'Vaccines and care notes',
    vaccineBody: 'Record completed care and optional next due date. The platform stores the history; it does not prescribe a vaccination schedule.',
    measuredAt: 'Date',
    weight: 'Weight',
    height: 'Height at withers',
    note: 'Note',
    saveWeight: 'Save weight',
    saving: 'Saving...',
    weightRequired: 'Add at least weight or height before saving.',
    savedWeight: 'Growth record saved.',
    deletedWeight: 'Growth record deleted.',
    category: 'Type',
    titleField: 'Record title',
    performedAt: 'Date completed',
    nextDueAt: 'Next due date',
    veterinarian: 'Veterinarian',
    clinic: 'Clinic',
    batchNumber: 'Batch number',
    documentUrl: 'Document URL',
    saveHealth: 'Save health record',
    titleRequired: 'Add a title before saving the health record.',
    savedHealth: 'Health record saved.',
    deletedHealth: 'Health record deleted.',
    growthChart: 'Weight trend',
    emptyChart: 'Save at least one weight record to start the growth line.',
    growthTable: 'Growth history',
    vaccineTable: 'Vaccines and care history',
    age: 'Age',
    actions: 'Actions',
    remove: 'Remove',
    kg: 'kg',
    cm: 'cm',
    months: 'months',
    noRecords: 'No records yet.',
    safetyTitle: 'Care note',
    safetyBody: 'This is a personal owner diary. For vaccines, reactions, illness, fast growth changes or medication, follow your veterinarian.',
    categories: {
      vaccine: 'Vaccine',
      deworming: 'Deworming',
      vet_visit: 'Vet visit',
      medication: 'Medication',
      note: 'General note',
    } satisfies Record<DogHealthRecordCategory, string>,
  },
  bg: {
    eyebrow: 'Личен здравен дневник',
    title: 'Растеж, тегло и ваксини',
    body: 'Следи личната история на Cane Corso: тегло по месеци, височина, ваксини, обезпаразитяване и важни ветеринарни бележки.',
    privatePill: 'Личен запис за собственика',
    vetPill: 'Ветеринарят остава авторитетът',
    archivePill: 'История на растежа',
    latestWeight: 'Последно тегло',
    latestWeightEmpty: 'Още няма тегло',
    nextVaccine: 'Следваща важна дата',
    nextVaccineEmpty: 'Няма запазена следваща дата',
    healthRecords: 'Здравни записи',
    openWeight: 'Добави тегло',
    openVaccine: 'Добави ваксина / бележка',
    weightTitle: 'Таблица за растеж по месеци',
    weightBody: 'Записвай теглото по дата. Възрастта по месеци се изчислява от датата на раждане, когато е попълнена.',
    vaccineTitle: 'Ваксини и грижа',
    vaccineBody: 'Записвай поставена грижа и по желание следваща дата. Платформата пази историята, но не назначава ваксинационен график.',
    measuredAt: 'Дата',
    weight: 'Тегло',
    height: 'Височина при холката',
    note: 'Бележка',
    saveWeight: 'Запази тегло',
    saving: 'Записване...',
    weightRequired: 'Добави поне тегло или височина преди запис.',
    savedWeight: 'Записът за растеж е запазен.',
    deletedWeight: 'Записът за растеж е изтрит.',
    category: 'Тип',
    titleField: 'Име на записа',
    performedAt: 'Дата на поставяне/преглед',
    nextDueAt: 'Следваща дата',
    veterinarian: 'Ветеринар',
    clinic: 'Клиника',
    batchNumber: 'Партиден номер',
    documentUrl: 'Линк към документ',
    saveHealth: 'Запази здравен запис',
    titleRequired: 'Добави име на здравния запис преди запис.',
    savedHealth: 'Здравният запис е запазен.',
    deletedHealth: 'Здравният запис е изтрит.',
    growthChart: 'Тенденция на теглото',
    emptyChart: 'Запази поне един запис с тегло, за да започне линията на растежа.',
    growthTable: 'История на растежа',
    vaccineTable: 'История на ваксини и грижа',
    age: 'Възраст',
    actions: 'Действия',
    remove: 'Изтрий',
    kg: 'кг',
    cm: 'см',
    months: 'месеца',
    noRecords: 'Още няма записи.',
    safetyTitle: 'Бележка за грижата',
    safetyBody: 'Това е личен дневник на собственика. За ваксини, реакции, заболяване, бързи промени в растежа или лекарства следвай ветеринаря си.',
    categories: {
      vaccine: 'Ваксина',
      deworming: 'Обезпаразитяване',
      vet_visit: 'Ветеринарен преглед',
      medication: 'Лекарство',
      note: 'Обща бележка',
    } satisfies Record<DogHealthRecordCategory, string>,
  },
  it: {
    eyebrow: 'Diario salute proprietario',
    title: 'Crescita, peso e vaccini',
    body: 'Segui la storia privata del Cane Corso: peso mensile, altezza, vaccini, antiparassitari e note veterinarie importanti.',
    privatePill: 'Record privato proprietario',
    vetPill: 'Il veterinario resta l’autorità',
    archivePill: 'Archivio crescita',
    latestWeight: 'Ultimo peso',
    latestWeightEmpty: 'Nessun peso ancora',
    nextVaccine: 'Prossima data importante',
    nextVaccineEmpty: 'Nessuna scadenza salvata',
    healthRecords: 'Record salute',
    openWeight: 'Aggiungi peso',
    openVaccine: 'Aggiungi vaccino / nota',
    weightTitle: 'Tabella crescita mensile',
    weightBody: 'Registra il peso per data. L’età in mesi viene calcolata dalla data di nascita salvata quando disponibile.',
    vaccineTitle: 'Vaccini e cura',
    vaccineBody: 'Registra cure completate e una prossima data facoltativa. La piattaforma conserva la storia; non prescrive un calendario vaccinale.',
    measuredAt: 'Data',
    weight: 'Peso',
    height: 'Altezza al garrese',
    note: 'Nota',
    saveWeight: 'Salva peso',
    saving: 'Salvataggio...',
    weightRequired: 'Aggiungi almeno peso o altezza prima di salvare.',
    savedWeight: 'Record crescita salvato.',
    deletedWeight: 'Record crescita eliminato.',
    category: 'Tipo',
    titleField: 'Titolo record',
    performedAt: 'Data completata',
    nextDueAt: 'Prossima data',
    veterinarian: 'Veterinario',
    clinic: 'Clinica',
    batchNumber: 'Lotto',
    documentUrl: 'URL documento',
    saveHealth: 'Salva record salute',
    titleRequired: 'Aggiungi un titolo prima di salvare il record salute.',
    savedHealth: 'Record salute salvato.',
    deletedHealth: 'Record salute eliminato.',
    growthChart: 'Trend peso',
    emptyChart: 'Salva almeno un record peso per iniziare la linea di crescita.',
    growthTable: 'Storia crescita',
    vaccineTable: 'Storia vaccini e cura',
    age: 'Età',
    actions: 'Azioni',
    remove: 'Elimina',
    kg: 'kg',
    cm: 'cm',
    months: 'mesi',
    noRecords: 'Nessun record ancora.',
    safetyTitle: 'Nota cura',
    safetyBody: 'Questo è un diario privato del proprietario. Per vaccini, reazioni, malattia, crescita rapida o farmaci segui il tuo veterinario.',
    categories: {
      vaccine: 'Vaccino',
      deworming: 'Antiparassitario',
      vet_visit: 'Visita veterinaria',
      medication: 'Farmaco',
      note: 'Nota generale',
    } satisfies Record<DogHealthRecordCategory, string>,
  },
} as const;

function toOptionalNumber(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : null;
}

function formatDate(locale: string, value: string | null | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`));
}

function formatValue(value: number | null | undefined, suffix: string): string {
  if (value == null) return '—';
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${suffix}`;
}

function sortByDateAsc(records: DogMeasurementRecord[]): DogMeasurementRecord[] {
  return [...records].sort((a, b) => a.measuredAt.localeCompare(b.measuredAt));
}

function getLatestMeasurement(records: DogMeasurementRecord[]): DogMeasurementRecord | null {
  return [...records].sort((a, b) => b.measuredAt.localeCompare(a.measuredAt))[0] ?? null;
}

function getNextDue(records: DogHealthRecord[]): DogHealthRecord | null {
  const today = todayIso();
  return records
    .filter((record) => record.nextDueAt && record.nextDueAt >= today)
    .sort((a, b) => (a.nextDueAt ?? '').localeCompare(b.nextDueAt ?? ''))[0] ?? null;
}

function getInputClass(value: string) {
  return value ? 'health-tracker-input has-value' : 'health-tracker-input';
}

export function OwnerHealthGrowthTracker({ locale, dogId, dogName, dateOfBirth }: OwnerHealthGrowthTrackerProps) {
  const t = copy[locale] ?? copy.en;
  const [activePanel, setActivePanel] = useState<ActivePanel>('weight');
  const [weightForm, setWeightForm] = useState<WeightFormState>(() => createEmptyWeightForm());
  const [healthForm, setHealthForm] = useState<HealthFormState>(() => createEmptyHealthForm());
  const [measurements, setMeasurements] = useState<DogMeasurementRecord[]>([]);
  const [healthRecords, setHealthRecords] = useState<DogHealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);

    Promise.all([listDogMeasurements(dogId), listDogHealthRecords(dogId)])
      .then(([measurementDocument, healthDocument]) => {
        if (!alive) return;
        setMeasurements(measurementDocument.records);
        setHealthRecords(healthDocument.records);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (!alive) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load health tracker.');
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [dogId]);

  const latestMeasurement = useMemo(() => getLatestMeasurement(measurements), [measurements]);
  const nextDue = useMemo(() => getNextDue(healthRecords), [healthRecords]);
  const chartRecords = useMemo(() => sortByDateAsc(measurements).filter((record) => record.weightKg != null), [measurements]);
  const maxWeight = useMemo(() => Math.max(...chartRecords.map((record) => record.weightKg ?? 0), 1), [chartRecords]);

  const handleWeightChange = (field: keyof WeightFormState, value: string) => {
    setWeightForm((current) => ({ ...current, [field]: value }));
  };

  const handleHealthChange = (field: keyof HealthFormState, value: string) => {
    setHealthForm((current) => {
      if (field === 'category') {
        return { ...current, category: value as DogHealthRecordCategory };
      }

      return { ...current, [field]: value } as HealthFormState;
    });
  };

  const handleSaveWeight = async () => {
    setMessage(null);
    setError(null);
    const input: CreateDogMeasurementInput = {
      measuredAt: weightForm.measuredAt,
      weightKg: toOptionalNumber(weightForm.weightKg),
      heightWithersCm: toOptionalNumber(weightForm.heightWithersCm),
      note: weightForm.note.trim() || null,
    };

    if (input.weightKg == null && input.heightWithersCm == null) {
      setError(t.weightRequired);
      return;
    }

    setIsSaving(true);
    try {
      const document = await createDogMeasurement(dogId, input);
      setMeasurements(document.records);
      setWeightForm(createEmptyWeightForm());
      setMessage(t.savedWeight);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t.weightRequired);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHealth = async () => {
    setMessage(null);
    setError(null);

    if (!healthForm.title.trim()) {
      setError(t.titleRequired);
      return;
    }

    const input: CreateDogHealthRecordInput = {
      category: healthForm.category,
      title: healthForm.title.trim(),
      performedAt: healthForm.performedAt,
      nextDueAt: healthForm.nextDueAt.trim() || null,
      veterinarian: healthForm.veterinarian.trim() || null,
      clinic: healthForm.clinic.trim() || null,
      batchNumber: healthForm.batchNumber.trim() || null,
      documentUrl: healthForm.documentUrl.trim() || null,
      note: healthForm.note.trim() || null,
    };

    setIsSaving(true);
    try {
      const document = await createDogHealthRecord(dogId, input);
      setHealthRecords(document.records);
      setHealthForm(createEmptyHealthForm());
      setMessage(t.savedHealth);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t.titleRequired);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMeasurement = async (recordId: string) => {
    setMessage(null);
    setError(null);
    try {
      const document = await deleteDogMeasurement(dogId, recordId);
      setMeasurements(document.records);
      setMessage(t.deletedWeight);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete record.');
    }
  };

  const handleDeleteHealthRecord = async (recordId: string) => {
    setMessage(null);
    setError(null);
    try {
      const document = await deleteDogHealthRecord(dogId, recordId);
      setHealthRecords(document.records);
      setMessage(t.deletedHealth);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete record.');
    }
  };

  return (
    <div className="owner-health-tracker">
      <section className="owner-health-tracker__hero content-card">
        <div>
          <span className="eyebrow-label">{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p>{t.body}</p>
          <div className="owner-health-tracker__pills" aria-label={t.eyebrow}>
            <span>{t.privatePill}</span>
            <span>{t.archivePill}</span>
            <span>{t.vetPill}</span>
          </div>
        </div>
        <div className="owner-health-tracker__seal" aria-hidden="true">
          <strong>USG</strong>
          <span>{dogName}</span>
        </div>
      </section>

      <section className="owner-health-tracker__stats" aria-label={t.title}>
        <div className="owner-health-stat-card">
          <span>{t.latestWeight}</span>
          <strong>{latestMeasurement?.weightKg != null ? formatValue(latestMeasurement.weightKg, t.kg) : t.latestWeightEmpty}</strong>
          <small>{latestMeasurement ? formatDate(locale, latestMeasurement.measuredAt) : dateOfBirth ? formatDate(locale, dateOfBirth) : '—'}</small>
        </div>
        <div className="owner-health-stat-card owner-health-stat-card--gold">
          <span>{t.nextVaccine}</span>
          <strong>{nextDue ? nextDue.title : t.nextVaccineEmpty}</strong>
          <small>{nextDue ? formatDate(locale, nextDue.nextDueAt) : '—'}</small>
        </div>
        <div className="owner-health-stat-card">
          <span>{t.healthRecords}</span>
          <strong>{healthRecords.length}</strong>
          <small>{measurements.length} {t.archivePill.toLowerCase()}</small>
        </div>
      </section>

      <section className="owner-health-tracker__switch content-card" aria-label={t.eyebrow}>
        <button
          type="button"
          className={activePanel === 'weight' ? 'is-active' : ''}
          onClick={() => setActivePanel('weight')}
        >
          <strong>{t.openWeight}</strong>
          <span>{t.weightTitle}</span>
        </button>
        <button
          type="button"
          className={activePanel === 'vaccine' ? 'is-active' : ''}
          onClick={() => setActivePanel('vaccine')}
        >
          <strong>{t.openVaccine}</strong>
          <span>{t.vaccineTitle}</span>
        </button>
      </section>

      {activePanel === 'weight' ? (
        <section className="owner-health-form-card content-card" aria-label={t.weightTitle}>
          <div className="owner-health-form-card__head">
            <div>
              <span className="eyebrow-label">{t.openWeight}</span>
              <h3>{t.weightTitle}</h3>
              <p>{t.weightBody}</p>
            </div>
          </div>
          <div className="owner-health-form-grid owner-health-form-grid--weight">
            <label>
              <span>{t.measuredAt}</span>
              <input className={getInputClass(weightForm.measuredAt)} type="date" value={weightForm.measuredAt} onChange={(event) => handleWeightChange('measuredAt', event.target.value)} />
            </label>
            <label>
              <span>{t.weight} ({t.kg})</span>
              <input className={getInputClass(weightForm.weightKg)} inputMode="decimal" value={weightForm.weightKg} onChange={(event) => handleWeightChange('weightKg', event.target.value)} placeholder="24.5" />
            </label>
            <label>
              <span>{t.height} ({t.cm})</span>
              <input className={getInputClass(weightForm.heightWithersCm)} inputMode="decimal" value={weightForm.heightWithersCm} onChange={(event) => handleWeightChange('heightWithersCm', event.target.value)} placeholder="52" />
            </label>
            <label className="owner-health-form-grid__wide">
              <span>{t.note}</span>
              <input className={getInputClass(weightForm.note)} value={weightForm.note} onChange={(event) => handleWeightChange('note', event.target.value)} placeholder={t.note} />
            </label>
          </div>
          <button type="button" className="button-primary" onClick={() => void handleSaveWeight()} disabled={isSaving}>
            {isSaving ? t.saving : t.saveWeight}
          </button>
        </section>
      ) : (
        <section className="owner-health-form-card content-card" aria-label={t.vaccineTitle}>
          <div className="owner-health-form-card__head">
            <div>
              <span className="eyebrow-label">{t.openVaccine}</span>
              <h3>{t.vaccineTitle}</h3>
              <p>{t.vaccineBody}</p>
            </div>
          </div>
          <div className="owner-health-form-grid">
            <label>
              <span>{t.category}</span>
              <select className="health-tracker-input has-value" value={healthForm.category} onChange={(event) => handleHealthChange('category', event.target.value)}>
                {categories.map((category) => (
                  <option value={category} key={category}>{t.categories[category]}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{t.titleField}</span>
              <input className={getInputClass(healthForm.title)} value={healthForm.title} onChange={(event) => handleHealthChange('title', event.target.value)} placeholder="DHPP / Rabies" />
            </label>
            <label>
              <span>{t.performedAt}</span>
              <input className={getInputClass(healthForm.performedAt)} type="date" value={healthForm.performedAt} onChange={(event) => handleHealthChange('performedAt', event.target.value)} />
            </label>
            <label>
              <span>{t.nextDueAt}</span>
              <input className={getInputClass(healthForm.nextDueAt)} type="date" value={healthForm.nextDueAt} onChange={(event) => handleHealthChange('nextDueAt', event.target.value)} />
            </label>
            <label>
              <span>{t.veterinarian}</span>
              <input className={getInputClass(healthForm.veterinarian)} value={healthForm.veterinarian} onChange={(event) => handleHealthChange('veterinarian', event.target.value)} />
            </label>
            <label>
              <span>{t.clinic}</span>
              <input className={getInputClass(healthForm.clinic)} value={healthForm.clinic} onChange={(event) => handleHealthChange('clinic', event.target.value)} />
            </label>
            <label>
              <span>{t.batchNumber}</span>
              <input className={getInputClass(healthForm.batchNumber)} value={healthForm.batchNumber} onChange={(event) => handleHealthChange('batchNumber', event.target.value)} />
            </label>
            <label>
              <span>{t.documentUrl}</span>
              <input className={getInputClass(healthForm.documentUrl)} value={healthForm.documentUrl} onChange={(event) => handleHealthChange('documentUrl', event.target.value)} placeholder="https://" />
            </label>
            <label className="owner-health-form-grid__wide">
              <span>{t.note}</span>
              <input className={getInputClass(healthForm.note)} value={healthForm.note} onChange={(event) => handleHealthChange('note', event.target.value)} />
            </label>
          </div>
          <button type="button" className="button-primary" onClick={() => void handleSaveHealth()} disabled={isSaving}>
            {isSaving ? t.saving : t.saveHealth}
          </button>
        </section>
      )}

      {message ? <p className="owner-health-message owner-health-message--success">{message}</p> : null}
      {error ? <p className="owner-health-message owner-health-message--error">{error}</p> : null}
      {isLoading ? <p className="owner-health-message">{t.saving}</p> : null}

      <section className="owner-health-dashboard-grid">
        <div className="content-card owner-health-chart-card">
          <div className="owner-health-section-head">
            <span className="eyebrow-label">{t.growthChart}</span>
            <h3>{t.growthChart}</h3>
          </div>
          {chartRecords.length > 0 ? (
            <div className="owner-health-chart" role="list">
              {chartRecords.map((record) => {
                const width = Math.max(8, ((record.weightKg ?? 0) / maxWeight) * 100);
                return (
                  <div className="owner-health-chart__row" role="listitem" key={record.id}>
                    <span>{record.ageMonths != null ? `${record.ageMonths} ${t.months}` : formatDate(locale, record.measuredAt)}</span>
                    <div className="owner-health-chart__bar-track">
                      <div className="owner-health-chart__bar" style={{ '--bar-width': `${width}%` } as CSSProperties} />
                    </div>
                    <strong>{formatValue(record.weightKg, t.kg)}</strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="owner-health-empty">{t.emptyChart}</p>
          )}
        </div>

        <div className="content-card owner-health-safety-card">
          <span className="eyebrow-label">{t.safetyTitle}</span>
          <h3>{t.safetyTitle}</h3>
          <p>{t.safetyBody}</p>
        </div>
      </section>

      <section className="content-card owner-health-table-card" aria-label={t.growthTable}>
        <div className="owner-health-section-head">
          <span className="eyebrow-label">{t.growthTable}</span>
          <h3>{t.growthTable}</h3>
        </div>
        <div className="owner-health-table-wrap">
          <table className="owner-health-table">
            <thead>
              <tr>
                <th>{t.measuredAt}</th>
                <th>{t.age}</th>
                <th>{t.weight}</th>
                <th>{t.height}</th>
                <th>{t.note}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {measurements.length > 0 ? measurements.map((record) => (
                <tr key={record.id}>
                  <td>{formatDate(locale, record.measuredAt)}</td>
                  <td>{record.ageMonths != null ? `${record.ageMonths} ${t.months}` : '—'}</td>
                  <td>{formatValue(record.weightKg, t.kg)}</td>
                  <td>{formatValue(record.heightWithersCm, t.cm)}</td>
                  <td>{record.note ?? '—'}</td>
                  <td><button type="button" className="button-ghost small" onClick={() => void handleDeleteMeasurement(record.id)}>{t.remove}</button></td>
                </tr>
              )) : (
                <tr><td colSpan={6}>{t.noRecords}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-card owner-health-table-card" aria-label={t.vaccineTable}>
        <div className="owner-health-section-head">
          <span className="eyebrow-label">{t.vaccineTable}</span>
          <h3>{t.vaccineTable}</h3>
        </div>
        <div className="owner-health-table-wrap">
          <table className="owner-health-table">
            <thead>
              <tr>
                <th>{t.category}</th>
                <th>{t.titleField}</th>
                <th>{t.performedAt}</th>
                <th>{t.nextDueAt}</th>
                <th>{t.clinic}</th>
                <th>{t.batchNumber}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {healthRecords.length > 0 ? healthRecords.map((record) => (
                <tr key={record.id}>
                  <td>{t.categories[record.category]}</td>
                  <td>
                    <strong>{record.title}</strong>
                    {record.note ? <small>{record.note}</small> : null}
                  </td>
                  <td>{formatDate(locale, record.performedAt)}</td>
                  <td>{formatDate(locale, record.nextDueAt)}</td>
                  <td>{record.clinic ?? record.veterinarian ?? '—'}</td>
                  <td>{record.batchNumber ?? '—'}</td>
                  <td><button type="button" className="button-ghost small" onClick={() => void handleDeleteHealthRecord(record.id)}>{t.remove}</button></td>
                </tr>
              )) : (
                <tr><td colSpan={7}>{t.noRecords}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
