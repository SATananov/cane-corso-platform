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
type ActiveInsightPanel = 'overview' | 'weight' | 'height' | 'standard' | 'comparison' | 'deviations' | 'records';
type GrowthMetric = 'weight' | 'height';

type WeightFormState = {
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
    bodyLengthCm: '',
    chestCircumferenceCm: '',
    headLengthCm: '',
    muzzleLengthCm: '',
    skullLengthCm: '',
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
    bodyLength: 'Body length',
    chest: 'Chest circumference',
    head: 'Head length',
    muzzle: 'Muzzle length',
    skull: 'Skull length',
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
    growthChart: 'Growth charts',
    weightTrend: 'Weight trend',
    heightTrend: 'Height trend',
    standardChart: 'Standard orientation',
    standardBody: 'Broad orientation only. Fast changes or large deviations should be checked with a veterinarian.',
    conclusion: 'Conclusion',
    conclusionNormal: 'The latest record is within the broad orientation range for the saved age.',
    conclusionHigh: 'The latest weight is above the broad orientation range for the saved age. Review food quantity, activity and growth pace; if the change is fast, speak with a veterinarian.',
    conclusionLow: 'The latest weight is below the broad orientation range for the saved age. Review appetite, nutrition and condition; if the gap continues, speak with a veterinarian.',
    conclusionMissing: 'Add age and weight records to generate an orientation note.',
    emptyChart: 'Save at least one measurement record to start the growth line.',
    insightSwitchLabel: 'Choose what to inspect',
    overviewPanel: 'Overview',
    weightChartPanel: 'Weight graph',
    heightChartPanel: 'Height graph',
    standardPanel: 'Standard graph',
    comparisonPanel: 'Together',
    deviationsPanel: 'Deviations',
    recordsPanel: 'Records',
    userLineLabel: 'My Cane Corso',
    standardLineLabel: 'Standard midpoint',
    standardRangeLabel: 'Standard range',
    chartHint: 'Bottom numbers are age in months. The vertical scale shows the selected value in kg or cm.',
    chartAgeAxis: 'Age (months)',
    chartWeightAxis: 'Weight (kg)',
    chartHeightAxis: 'Height at withers (cm)',
    chartAgeHeader: 'Age',
    chartActualHeader: 'My Cane Corso record',
    chartStandardHeader: 'Standard midpoint',
    chartRangeHeader: 'Orientation range',
    monthShort: 'mo',
    noComparisonData: 'Add dated measurements with age in months to compare against the orientation range.',
    standardWeightTitle: 'Weight orientation by age',
    standardHeightTitle: 'Height orientation by age',
    combinedWeightTitle: 'Weight: my Cane Corso + orientation',
    combinedHeightTitle: 'Height: my Cane Corso + orientation',
    deviationInRange: 'within orientation',
    deviationAbove: 'above orientation',
    deviationBelow: 'below orientation',
    deviationMissing: 'not enough data',
    growthTable: 'Growth and size history',
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
    bodyLength: 'Дължина на тяло',
    chest: 'Гръдна обиколка',
    head: 'Дължина на глава',
    muzzle: 'Дължина на муцуна',
    skull: 'Дължина на череп',
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
    growthChart: 'Диаграми за растеж',
    weightTrend: 'Тенденция на теглото',
    heightTrend: 'Тенденция на височината',
    standardChart: 'Ориентир спрямо стандарт',
    standardBody: 'Широк ориентир, не медицинска диагноза. При резки промени или големи отклонения се консултирай с ветеринар.',
    conclusion: 'Извод',
    conclusionNormal: 'Последният запис е в широкия ориентировъчен диапазон за запазената възраст.',
    conclusionHigh: 'Последното тегло е над широкия ориентировъчен диапазон за възрастта. Провери количеството храна, активността и темпото на растеж; при рязка промяна говори с ветеринар.',
    conclusionLow: 'Последното тегло е под широкия ориентировъчен диапазон за възрастта. Провери апетита, храненето и общото състояние; ако отклонението продължава, говори с ветеринар.',
    conclusionMissing: 'Добави възраст и тегло, за да се покаже ориентировъчен извод.',
    emptyChart: 'Запази поне един запис с измервания, за да започне линията на растежа.',
    insightSwitchLabel: 'Избери какво да разгледаш',
    overviewPanel: 'Преглед',
    weightChartPanel: 'Графика тегло',
    heightChartPanel: 'Графика височина',
    standardPanel: 'Графика стандарт',
    comparisonPanel: 'Заедно',
    deviationsPanel: 'Отклонения',
    recordsPanel: 'Записи',
    userLineLabel: 'Моето Cane Corso',
    standardLineLabel: 'Среден ориентир',
    standardRangeLabel: 'Ориентировъчен диапазон',
    chartHint: 'Числата долу са възраст в месеци. Вертикалната скала показва избраната стойност в кг или см.',
    chartAgeAxis: 'Възраст (месеци)',
    chartWeightAxis: 'Тегло (кг)',
    chartHeightAxis: 'Височина при холката (см)',
    chartAgeHeader: 'Възраст',
    chartActualHeader: 'Запис на моето Cane Corso',
    chartStandardHeader: 'Среден ориентир',
    chartRangeHeader: 'Ориентировъчен диапазон',
    monthShort: 'м.',
    noComparisonData: 'Добави измервания с дата и възраст в месеци, за да има сравнение с ориентира.',
    standardWeightTitle: 'Ориентир за тегло по възраст',
    standardHeightTitle: 'Ориентир за височина по възраст',
    combinedWeightTitle: 'Тегло: моето Cane Corso + ориентир',
    combinedHeightTitle: 'Височина: моето Cane Corso + ориентир',
    deviationInRange: 'в ориентировъчния диапазон',
    deviationAbove: 'над ориентира',
    deviationBelow: 'под ориентира',
    deviationMissing: 'няма достатъчно данни',
    growthTable: 'История на растеж и размери',
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
    bodyLength: 'Lunghezza corpo',
    chest: 'Circonferenza torace',
    head: 'Lunghezza testa',
    muzzle: 'Lunghezza muso',
    skull: 'Lunghezza cranio',
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
    growthChart: 'Grafici crescita',
    weightTrend: 'Trend peso',
    heightTrend: 'Trend altezza',
    standardChart: 'Orientamento standard',
    standardBody: 'Orientamento ampio, non diagnosi medica. Per cambi rapidi o deviazioni importanti consulta il veterinario.',
    conclusion: 'Conclusione',
    conclusionNormal: 'L’ultimo record è nel range orientativo ampio per l’età salvata.',
    conclusionHigh: 'L’ultimo peso è sopra il range orientativo ampio per l’età. Controlla quantità di cibo, attività e ritmo di crescita; se il cambio è rapido, parla con un veterinario.',
    conclusionLow: 'L’ultimo peso è sotto il range orientativo ampio per l’età. Controlla appetito, nutrizione e condizione generale; se la distanza continua, parla con un veterinario.',
    conclusionMissing: 'Aggiungi età e peso per generare una nota orientativa.',
    emptyChart: 'Salva almeno un record misure per iniziare la linea di crescita.',
    insightSwitchLabel: 'Scegli cosa vedere',
    overviewPanel: 'Panoramica',
    weightChartPanel: 'Grafico peso',
    heightChartPanel: 'Grafico altezza',
    standardPanel: 'Grafico standard',
    comparisonPanel: 'Insieme',
    deviationsPanel: 'Deviazioni',
    recordsPanel: 'Record',
    userLineLabel: 'Il mio Cane Corso',
    standardLineLabel: 'Orientamento medio',
    standardRangeLabel: 'Range orientativo',
    chartHint: 'I numeri in basso sono l’età in mesi. La scala verticale mostra il valore scelto in kg o cm.',
    chartAgeAxis: 'Età (mesi)',
    chartWeightAxis: 'Peso (kg)',
    chartHeightAxis: 'Altezza al garrese (cm)',
    chartAgeHeader: 'Età',
    chartActualHeader: 'Record del mio Cane Corso',
    chartStandardHeader: 'Orientamento medio',
    chartRangeHeader: 'Range orientativo',
    monthShort: 'm',
    noComparisonData: 'Aggiungi misure con data ed età in mesi per confrontare con il range orientativo.',
    standardWeightTitle: 'Orientamento peso per età',
    standardHeightTitle: 'Orientamento altezza per età',
    combinedWeightTitle: 'Peso: il mio Cane Corso + orientamento',
    combinedHeightTitle: 'Altezza: il mio Cane Corso + orientamento',
    deviationInRange: 'nel range orientativo',
    deviationAbove: 'sopra orientamento',
    deviationBelow: 'sotto orientamento',
    deviationMissing: 'dati non sufficienti',
    growthTable: 'Storia crescita e misure',
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

type OrientationRange = {
  weight: [number, number];
  height: [number, number];
};

function getOrientationRange(ageMonths: number | null | undefined): OrientationRange | null {
  if (ageMonths == null) return null;

  if (ageMonths <= 5) return { weight: [14, 24], height: [42, 55] };
  if (ageMonths <= 8) return { weight: [26, 38], height: [53, 63] };
  if (ageMonths <= 12) return { weight: [34, 48], height: [58, 68] };
  if (ageMonths <= 18) return { weight: [38, 54], height: [60, 70] };
  return { weight: [40, 55], height: [60, 70] };
}

function getWeightConclusion(
  latest: DogMeasurementRecord | null,
  t: { conclusionMissing: string; conclusionHigh: string; conclusionLow: string; conclusionNormal: string },
) {
  const range = getOrientationRange(latest?.ageMonths);
  const weight = latest?.weightKg;

  if (!range || weight == null) return t.conclusionMissing;
  if (weight > range.weight[1]) return t.conclusionHigh;
  if (weight < range.weight[0]) return t.conclusionLow;
  return t.conclusionNormal;
}

function formatRange(range: [number, number] | null | undefined, suffix: string) {
  if (!range) return '—';
  return `${range[0]}–${range[1]} ${suffix}`;
}

function getBarWidth(value: number | null | undefined, max: number) {
  if (value == null || max <= 0) return '0%';
  return `${Math.max(6, Math.min(100, (value / max) * 100))}%`;
}


type GrowthChartPoint = {
  key: string;
  label: string;
  ageMonths: number;
  actual: number | null;
  standardMin: number | null;
  standardMax: number | null;
  standardMid: number | null;
};

const standardAgePoints = [4, 8, 12, 18, 24] as const;

function getMetricValue(record: DogMeasurementRecord, metric: GrowthMetric): number | null {
  return metric === 'weight' ? record.weightKg : record.heightWithersCm;
}

function getMetricRange(range: OrientationRange | null, metric: GrowthMetric): [number, number] | null {
  if (!range) return null;
  return metric === 'weight' ? range.weight : range.height;
}

function getMetricSuffix(metric: GrowthMetric, t: { kg: string; cm: string }) {
  return metric === 'weight' ? t.kg : t.cm;
}

function getMetricLabel(metric: GrowthMetric, t: { weight: string; height: string }) {
  return metric === 'weight' ? t.weight : t.height;
}

function buildStandardMetricPoints(metric: GrowthMetric): GrowthChartPoint[] {
  return standardAgePoints.map((age) => {
    const range = getMetricRange(getOrientationRange(age), metric);
    const standardMid = range ? Number(((range[0] + range[1]) / 2).toFixed(1)) : null;

    return {
      key: `standard-${metric}-${age}`,
      label: `${age}`,
      ageMonths: age,
      actual: null,
      standardMin: range?.[0] ?? null,
      standardMax: range?.[1] ?? null,
      standardMid,
    };
  });
}

function buildActualMetricPoints(records: DogMeasurementRecord[], metric: GrowthMetric): GrowthChartPoint[] {
  return sortByDateAsc(records)
    .filter((record) => record.ageMonths != null && getMetricValue(record, metric) != null)
    .map((record) => {
      const age = record.ageMonths ?? 0;
      const range = getMetricRange(getOrientationRange(age), metric);
      const standardMid = range ? Number(((range[0] + range[1]) / 2).toFixed(1)) : null;

      return {
        key: `${record.id}-${metric}`,
        label: `${age}`,
        ageMonths: age,
        actual: getMetricValue(record, metric),
        standardMin: range?.[0] ?? null,
        standardMax: range?.[1] ?? null,
        standardMid,
      };
    });
}

function getDeviationText(
  record: DogMeasurementRecord,
  metric: GrowthMetric,
  t: { deviationMissing: string; deviationAbove: string; deviationBelow: string; deviationInRange: string },
) {
  const value = getMetricValue(record, metric);
  const range = getMetricRange(getOrientationRange(record.ageMonths), metric);

  if (value == null || !range) return t.deviationMissing;
  if (value > range[1]) return t.deviationAbove;
  if (value < range[0]) return t.deviationBelow;
  return t.deviationInRange;
}

function makeChartPolyline(points: readonly GrowthChartPoint[], valueKey: 'actual' | 'standardMid', xAt: (point: GrowthChartPoint) => number, yAt: (value: number) => number) {
  return points
    .filter((point) => point[valueKey] != null)
    .map((point) => `${xAt(point)},${yAt(point[valueKey] ?? 0)}`)
    .join(' ');
}

function GrowthLineChart({
  title,
  points,
  valueSuffix,
  actualLabel,
  standardLabel,
  rangeLabel,
  emptyLabel,
  xAxisLabel,
  yAxisLabel,
  chartHint,
  ageColumnLabel,
  valueColumnLabel,
  rangeColumnLabel,
  monthShortLabel,
  showActual = true,
  showStandard = true,
}: {
  title: string;
  points: readonly GrowthChartPoint[];
  valueSuffix: string;
  actualLabel: string;
  standardLabel: string;
  rangeLabel: string;
  emptyLabel: string;
  xAxisLabel: string;
  yAxisLabel: string;
  chartHint: string;
  ageColumnLabel: string;
  valueColumnLabel: string;
  rangeColumnLabel: string;
  monthShortLabel: string;
  showActual?: boolean;
  showStandard?: boolean;
}) {
  const chartValues = points.flatMap((point) => [point.actual, point.standardMin, point.standardMax, point.standardMid]).filter((value): value is number => value != null);

  if (!chartValues.length) {
    return <p className="owner-health-empty">{emptyLabel}</p>;
  }

  const minChartValue = Math.max(0, Math.min(...chartValues) - 5);
  const maxChartValue = Math.max(...chartValues) + 5;
  const width = 640;
  const height = 260;
  const padding = { top: 26, right: 40, bottom: 52, left: 64 };
  const sortedPoints = [...points].sort((a, b) => a.ageMonths - b.ageMonths);
  const minAge = Math.min(...sortedPoints.map((point) => point.ageMonths));
  const maxAge = Math.max(...sortedPoints.map((point) => point.ageMonths));
  const ageSpan = Math.max(1, maxAge - minAge);
  const xAt = (point: GrowthChartPoint) => padding.left + ((point.ageMonths - minAge) / ageSpan) * (width - padding.left - padding.right);
  const yAt = (value: number) => padding.top + ((maxChartValue - value) / Math.max(1, maxChartValue - minChartValue)) * (height - padding.top - padding.bottom);
  const actualPolyline = makeChartPolyline(sortedPoints, 'actual', xAt, yAt);
  const standardPolyline = makeChartPolyline(sortedPoints, 'standardMid', xAt, yAt);
  const rangePoints = sortedPoints.filter((point) => point.standardMin != null && point.standardMax != null);
  const rangePolygon = rangePoints.length
    ? [
        ...rangePoints.map((point) => `${xAt(point)},${yAt(point.standardMax ?? 0)}`),
        ...[...rangePoints].reverse().map((point) => `${xAt(point)},${yAt(point.standardMin ?? 0)}`),
      ].join(' ')
    : '';

  return (
    <div className="owner-growth-line-chart" aria-label={title}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}. ${chartHint}`}>
        <line className="owner-growth-line-chart__axis" x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} />
        <line className="owner-growth-line-chart__axis" x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} />
        <text className="owner-growth-line-chart__axis-title owner-growth-line-chart__axis-title--x" x={width / 2} y={height - 5}>{xAxisLabel}</text>
        <text className="owner-growth-line-chart__axis-title owner-growth-line-chart__axis-title--y" x={16} y={height / 2} transform={`rotate(-90 16 ${height / 2})`}>{yAxisLabel}</text>
        <text className="owner-growth-line-chart__value-label" x={padding.left - 10} y={padding.top + 5}>{formatValue(maxChartValue, valueSuffix)}</text>
        <text className="owner-growth-line-chart__value-label" x={padding.left - 10} y={height - padding.bottom + 4}>{formatValue(minChartValue, valueSuffix)}</text>
        {rangePolygon && showStandard ? <polygon className="owner-growth-line-chart__range" points={rangePolygon} /> : null}
        {standardPolyline && showStandard ? <polyline className="owner-growth-line-chart__standard" points={standardPolyline} /> : null}
        {actualPolyline && showActual ? <polyline className="owner-growth-line-chart__actual" points={actualPolyline} /> : null}
        {sortedPoints.map((point) => (
          <g key={`${point.key}-dot`}>
            {showActual && point.actual != null ? <circle className="owner-growth-line-chart__actual-dot" cx={xAt(point)} cy={yAt(point.actual)} r="5" /> : null}
            {showStandard && point.standardMid != null ? <circle className="owner-growth-line-chart__standard-dot" cx={xAt(point)} cy={yAt(point.standardMid)} r="4" /> : null}
            <text className="owner-growth-line-chart__label" x={xAt(point)} y={height - 22}>{point.label} {monthShortLabel}</text>
          </g>
        ))}
      </svg>
      <p className="owner-growth-line-chart__hint">{chartHint}</p>
      <div className="owner-growth-line-chart__legend">
        {showActual ? <span className="owner-growth-line-chart__legend-actual">{actualLabel}</span> : null}
        {showStandard ? <span className="owner-growth-line-chart__legend-standard">{standardLabel}</span> : null}
        {showStandard ? <span className="owner-growth-line-chart__legend-range">{rangeLabel}</span> : null}
      </div>
      <div className="owner-growth-line-chart__data" role="table" aria-label={title}>
        <div className="owner-growth-line-chart__data-head" role="row">
          <span role="columnheader">{ageColumnLabel}</span>
          <strong role="columnheader">{valueColumnLabel}</strong>
          <small role="columnheader">{rangeColumnLabel}</small>
        </div>
        {sortedPoints.map((point) => (
          <div role="row" key={`${point.key}-data`}>
            <span role="cell">{point.label} {monthShortLabel}</span>
            <strong role="cell">{point.actual != null ? formatValue(point.actual, valueSuffix) : point.standardMid != null ? formatValue(point.standardMid, valueSuffix) : '—'}</strong>
            <small role="cell">{formatRange(point.standardMin != null && point.standardMax != null ? ([point.standardMin, point.standardMax] as [number, number]) : null, valueSuffix)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OwnerHealthGrowthTracker({ locale, dogId, dogName, dateOfBirth }: OwnerHealthGrowthTrackerProps) {
  const t = copy[locale] ?? copy.en;
  const [activePanel, setActivePanel] = useState<ActivePanel>('weight');
  const [activeInsightPanel, setActiveInsightPanel] = useState<ActiveInsightPanel>('overview');
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
  const heightChartRecords = useMemo(() => sortByDateAsc(measurements).filter((record) => record.heightWithersCm != null), [measurements]);
  const maxWeight = useMemo(() => Math.max(...chartRecords.map((record) => record.weightKg ?? 0), 1), [chartRecords]);
  const maxHeight = useMemo(() => Math.max(...heightChartRecords.map((record) => record.heightWithersCm ?? 0), 1), [heightChartRecords]);
  const latestOrientationRange = useMemo(() => getOrientationRange(latestMeasurement?.ageMonths), [latestMeasurement]);
  const latestConclusion = useMemo(() => getWeightConclusion(latestMeasurement, t), [latestMeasurement, t]);
  const weightMetricPoints = useMemo(() => buildActualMetricPoints(measurements, 'weight'), [measurements]);
  const heightMetricPoints = useMemo(() => buildActualMetricPoints(measurements, 'height'), [measurements]);
  const standardWeightPoints = useMemo(() => buildStandardMetricPoints('weight'), []);
  const standardHeightPoints = useMemo(() => buildStandardMetricPoints('height'), []);
  const comparisonRecords = useMemo(
    () => sortByDateAsc(measurements).filter((record) => record.ageMonths != null && (record.weightKg != null || record.heightWithersCm != null)),
    [measurements],
  );

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
      bodyLengthCm: toOptionalNumber(weightForm.bodyLengthCm),
      chestCircumferenceCm: toOptionalNumber(weightForm.chestCircumferenceCm),
      headLengthCm: toOptionalNumber(weightForm.headLengthCm),
      muzzleLengthCm: toOptionalNumber(weightForm.muzzleLengthCm),
      skullLengthCm: toOptionalNumber(weightForm.skullLengthCm),
      note: weightForm.note.trim() || null,
    };

    const hasMeasurement = [
      input.weightKg,
      input.heightWithersCm,
      input.bodyLengthCm,
      input.chestCircumferenceCm,
      input.headLengthCm,
      input.muzzleLengthCm,
      input.skullLengthCm,
    ].some((value) => value != null);

    if (!hasMeasurement) {
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
        <section className="owner-health-form-card content-card" id="growth" aria-label={t.weightTitle}>
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
            <label>
              <span>{t.bodyLength} ({t.cm})</span>
              <input className={getInputClass(weightForm.bodyLengthCm)} inputMode="decimal" value={weightForm.bodyLengthCm} onChange={(event) => handleWeightChange('bodyLengthCm', event.target.value)} placeholder="60" />
            </label>
            <label>
              <span>{t.chest} ({t.cm})</span>
              <input className={getInputClass(weightForm.chestCircumferenceCm)} inputMode="decimal" value={weightForm.chestCircumferenceCm} onChange={(event) => handleWeightChange('chestCircumferenceCm', event.target.value)} placeholder="70" />
            </label>
            <label>
              <span>{t.head} ({t.cm})</span>
              <input className={getInputClass(weightForm.headLengthCm)} inputMode="decimal" value={weightForm.headLengthCm} onChange={(event) => handleWeightChange('headLengthCm', event.target.value)} placeholder="24" />
            </label>
            <label>
              <span>{t.muzzle} ({t.cm})</span>
              <input className={getInputClass(weightForm.muzzleLengthCm)} inputMode="decimal" value={weightForm.muzzleLengthCm} onChange={(event) => handleWeightChange('muzzleLengthCm', event.target.value)} placeholder="9" />
            </label>
            <label>
              <span>{t.skull} ({t.cm})</span>
              <input className={getInputClass(weightForm.skullLengthCm)} inputMode="decimal" value={weightForm.skullLengthCm} onChange={(event) => handleWeightChange('skullLengthCm', event.target.value)} placeholder="15" />
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
        <section className="owner-health-form-card content-card" id="vaccines" aria-label={t.vaccineTitle}>
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

      <section className="owner-health-progressive content-card" aria-label={t.insightSwitchLabel}>
        <div className="owner-health-section-head">
          <span className="eyebrow-label">{t.growthChart}</span>
          <h3>{t.insightSwitchLabel}</h3>
          <p>{t.standardBody}</p>
        </div>
        <div className="owner-health-insight-switch" role="tablist" aria-label={t.insightSwitchLabel}>
          {([
            ['overview', t.overviewPanel],
            ['weight', t.weightChartPanel],
            ['height', t.heightChartPanel],
            ['standard', t.standardPanel],
            ['comparison', t.comparisonPanel],
            ['deviations', t.deviationsPanel],
            ['records', t.recordsPanel],
          ] as const).map(([panel, label]) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeInsightPanel === panel}
              className={activeInsightPanel === panel ? 'is-active' : ''}
              key={panel}
              onClick={() => setActiveInsightPanel(panel)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="owner-health-progressive__panel" role="tabpanel" aria-live="polite">
          {activeInsightPanel === 'overview' ? (
            <section className="owner-health-dashboard-grid owner-health-dashboard-grid--inside">
              <div className="content-card owner-health-chart-card">
                <div className="owner-health-section-head">
                  <span className="eyebrow-label">{t.growthChart}</span>
                  <h3>{t.weightTrend}</h3>
                </div>
                {chartRecords.length > 0 ? (
                  <div className="owner-health-chart" role="list">
                    {chartRecords.map((record) => {
                      const width = getBarWidth(record.weightKg, maxWeight);
                      return (
                        <div className="owner-health-chart__row" role="listitem" key={record.id}>
                          <span>{record.ageMonths != null ? `${record.ageMonths} ${t.months}` : formatDate(locale, record.measuredAt)}</span>
                          <div className="owner-health-chart__bar-track">
                            <div className="owner-health-chart__bar" style={{ '--bar-width': width } as CSSProperties} />
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

              <div className="content-card owner-health-chart-card">
                <div className="owner-health-section-head">
                  <span className="eyebrow-label">{t.growthChart}</span>
                  <h3>{t.heightTrend}</h3>
                </div>
                {heightChartRecords.length > 0 ? (
                  <div className="owner-health-chart" role="list">
                    {heightChartRecords.map((record) => {
                      const width = getBarWidth(record.heightWithersCm, maxHeight);
                      return (
                        <div className="owner-health-chart__row" role="listitem" key={`${record.id}-height`}>
                          <span>{record.ageMonths != null ? `${record.ageMonths} ${t.months}` : formatDate(locale, record.measuredAt)}</span>
                          <div className="owner-health-chart__bar-track">
                            <div className="owner-health-chart__bar" style={{ '--bar-width': width } as CSSProperties} />
                          </div>
                          <strong>{formatValue(record.heightWithersCm, t.cm)}</strong>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="owner-health-empty">{t.emptyChart}</p>
                )}
              </div>

              <div className="content-card owner-health-chart-card owner-health-chart-card--standard">
                <div className="owner-health-section-head">
                  <span className="eyebrow-label">{t.standardChart}</span>
                  <h3>{t.conclusion}</h3>
                  <p>{t.standardBody}</p>
                </div>
                <div className="owner-health-standard-grid">
                  <div>
                    <span>{t.weight}</span>
                    <strong>{latestMeasurement?.weightKg != null ? formatValue(latestMeasurement.weightKg, t.kg) : '—'}</strong>
                    <small>{formatRange(latestOrientationRange?.weight, t.kg)}</small>
                  </div>
                  <div>
                    <span>{t.height}</span>
                    <strong>{latestMeasurement?.heightWithersCm != null ? formatValue(latestMeasurement.heightWithersCm, t.cm) : '—'}</strong>
                    <small>{formatRange(latestOrientationRange?.height, t.cm)}</small>
                  </div>
                  <div>
                    <span>{t.bodyLength}</span>
                    <strong>{latestMeasurement?.bodyLengthCm != null ? formatValue(latestMeasurement.bodyLengthCm, t.cm) : '—'}</strong>
                    <small>{latestMeasurement?.ageMonths != null ? `${latestMeasurement.ageMonths} ${t.months}` : '—'}</small>
                  </div>
                </div>
                <p className="owner-health-conclusion">{latestConclusion}</p>
              </div>

              <div className="content-card owner-health-safety-card">
                <span className="eyebrow-label">{t.safetyTitle}</span>
                <h3>{t.safetyTitle}</h3>
                <p>{t.safetyBody}</p>
              </div>
            </section>
          ) : null}

          {activeInsightPanel === 'weight' ? (
            <section className="owner-health-graph-panel">
              <div className="owner-health-section-head">
                <span className="eyebrow-label">{t.weightChartPanel}</span>
                <h3>{t.weightTrend}</h3>
                <p>{t.noComparisonData}</p>
              </div>
              <GrowthLineChart
                title={t.weightTrend}
                points={weightMetricPoints}
                valueSuffix={getMetricSuffix('weight', t)}
                actualLabel={t.userLineLabel}
                standardLabel={t.standardLineLabel}
                rangeLabel={t.standardRangeLabel}
                emptyLabel={t.emptyChart}
                xAxisLabel={t.chartAgeAxis}
                yAxisLabel={t.chartWeightAxis}
                chartHint={t.chartHint}
                ageColumnLabel={t.chartAgeHeader}
                valueColumnLabel={t.chartActualHeader}
                rangeColumnLabel={t.chartRangeHeader}
                monthShortLabel={t.monthShort}
                showStandard={false}
              />
            </section>
          ) : null}

          {activeInsightPanel === 'height' ? (
            <section className="owner-health-graph-panel">
              <div className="owner-health-section-head">
                <span className="eyebrow-label">{t.heightChartPanel}</span>
                <h3>{t.heightTrend}</h3>
                <p>{t.noComparisonData}</p>
              </div>
              <GrowthLineChart
                title={t.heightTrend}
                points={heightMetricPoints}
                valueSuffix={getMetricSuffix('height', t)}
                actualLabel={t.userLineLabel}
                standardLabel={t.standardLineLabel}
                rangeLabel={t.standardRangeLabel}
                emptyLabel={t.emptyChart}
                xAxisLabel={t.chartAgeAxis}
                yAxisLabel={t.chartHeightAxis}
                chartHint={t.chartHint}
                ageColumnLabel={t.chartAgeHeader}
                valueColumnLabel={t.chartActualHeader}
                rangeColumnLabel={t.chartRangeHeader}
                monthShortLabel={t.monthShort}
                showStandard={false}
              />
            </section>
          ) : null}

          {activeInsightPanel === 'standard' ? (
            <section className="owner-health-graph-grid">
              <div className="owner-health-graph-panel">
                <div className="owner-health-section-head">
                  <span className="eyebrow-label">{t.standardPanel}</span>
                  <h3>{t.standardWeightTitle}</h3>
                  <p>{t.standardBody}</p>
                </div>
                <GrowthLineChart
                  title={t.standardWeightTitle}
                  points={standardWeightPoints}
                  valueSuffix={getMetricSuffix('weight', t)}
                  actualLabel={t.userLineLabel}
                  standardLabel={t.standardLineLabel}
                  rangeLabel={t.standardRangeLabel}
                  emptyLabel={t.emptyChart}
                  xAxisLabel={t.chartAgeAxis}
                  yAxisLabel={t.chartWeightAxis}
                  chartHint={t.chartHint}
                  ageColumnLabel={t.chartAgeHeader}
                  valueColumnLabel={t.chartStandardHeader}
                  rangeColumnLabel={t.chartRangeHeader}
                  monthShortLabel={t.monthShort}
                  showActual={false}
                />
              </div>
              <div className="owner-health-graph-panel">
                <div className="owner-health-section-head">
                  <span className="eyebrow-label">{t.standardPanel}</span>
                  <h3>{t.standardHeightTitle}</h3>
                  <p>{t.standardBody}</p>
                </div>
                <GrowthLineChart
                  title={t.standardHeightTitle}
                  points={standardHeightPoints}
                  valueSuffix={getMetricSuffix('height', t)}
                  actualLabel={t.userLineLabel}
                  standardLabel={t.standardLineLabel}
                  rangeLabel={t.standardRangeLabel}
                  emptyLabel={t.emptyChart}
                  xAxisLabel={t.chartAgeAxis}
                  yAxisLabel={t.chartHeightAxis}
                  chartHint={t.chartHint}
                  ageColumnLabel={t.chartAgeHeader}
                  valueColumnLabel={t.chartStandardHeader}
                  rangeColumnLabel={t.chartRangeHeader}
                  monthShortLabel={t.monthShort}
                  showActual={false}
                />
              </div>
            </section>
          ) : null}

          {activeInsightPanel === 'comparison' ? (
            <section className="owner-health-graph-grid">
              <div className="owner-health-graph-panel">
                <div className="owner-health-section-head">
                  <span className="eyebrow-label">{t.comparisonPanel}</span>
                  <h3>{t.combinedWeightTitle}</h3>
                  <p>{t.standardBody}</p>
                </div>
                <GrowthLineChart
                  title={t.combinedWeightTitle}
                  points={weightMetricPoints}
                  valueSuffix={getMetricSuffix('weight', t)}
                  actualLabel={t.userLineLabel}
                  standardLabel={t.standardLineLabel}
                  rangeLabel={t.standardRangeLabel}
                  emptyLabel={t.noComparisonData}
                  xAxisLabel={t.chartAgeAxis}
                  yAxisLabel={t.chartWeightAxis}
                  chartHint={t.chartHint}
                  ageColumnLabel={t.chartAgeHeader}
                  valueColumnLabel={t.chartActualHeader}
                  rangeColumnLabel={t.chartRangeHeader}
                  monthShortLabel={t.monthShort}
                />
              </div>
              <div className="owner-health-graph-panel">
                <div className="owner-health-section-head">
                  <span className="eyebrow-label">{t.comparisonPanel}</span>
                  <h3>{t.combinedHeightTitle}</h3>
                  <p>{t.standardBody}</p>
                </div>
                <GrowthLineChart
                  title={t.combinedHeightTitle}
                  points={heightMetricPoints}
                  valueSuffix={getMetricSuffix('height', t)}
                  actualLabel={t.userLineLabel}
                  standardLabel={t.standardLineLabel}
                  rangeLabel={t.standardRangeLabel}
                  emptyLabel={t.noComparisonData}
                  xAxisLabel={t.chartAgeAxis}
                  yAxisLabel={t.chartHeightAxis}
                  chartHint={t.chartHint}
                  ageColumnLabel={t.chartAgeHeader}
                  valueColumnLabel={t.chartActualHeader}
                  rangeColumnLabel={t.chartRangeHeader}
                  monthShortLabel={t.monthShort}
                />
              </div>
            </section>
          ) : null}

          {activeInsightPanel === 'deviations' ? (
            <section className="owner-health-deviation-panel">
              <div className="owner-health-section-head">
                <span className="eyebrow-label">{t.deviationsPanel}</span>
                <h3>{t.deviationsPanel}</h3>
                <p>{t.standardBody}</p>
              </div>
              {comparisonRecords.length ? (
                <div className="owner-health-deviation-list" role="list">
                  {comparisonRecords.map((record) => (
                    <article role="listitem" key={`${record.id}-deviation`} className="owner-health-deviation-card">
                      <span>{record.ageMonths != null ? `${record.ageMonths} ${t.months}` : formatDate(locale, record.measuredAt)}</span>
                      <strong>{formatDate(locale, record.measuredAt)}</strong>
                      <dl>
                        <div>
                          <dt>{getMetricLabel('weight', t)}</dt>
                          <dd>{getDeviationText(record, 'weight', t)}</dd>
                        </div>
                        <div>
                          <dt>{getMetricLabel('height', t)}</dt>
                          <dd>{getDeviationText(record, 'height', t)}</dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="owner-health-empty">{t.noComparisonData}</p>
              )}
            </section>
          ) : null}

          {activeInsightPanel === 'records' ? (
            <section className="owner-health-records-grid">
              <div className="content-card owner-health-table-card" id="growth-table" aria-label={t.growthTable}>
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
                        <th>{t.bodyLength}</th>
                        <th>{t.chest}</th>
                        <th>{t.head}</th>
                        <th>{t.muzzle}</th>
                        <th>{t.skull}</th>
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
                          <td>{formatValue(record.bodyLengthCm, t.cm)}</td>
                          <td>{formatValue(record.chestCircumferenceCm, t.cm)}</td>
                          <td>{formatValue(record.headLengthCm, t.cm)}</td>
                          <td>{formatValue(record.muzzleLengthCm, t.cm)}</td>
                          <td>{formatValue(record.skullLengthCm, t.cm)}</td>
                          <td>{record.note ?? '—'}</td>
                          <td><button type="button" className="button-ghost small" onClick={() => void handleDeleteMeasurement(record.id)}>{t.remove}</button></td>
                        </tr>
                      )) : (
                        <tr><td colSpan={11}>{t.noRecords}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="content-card owner-health-table-card" id="vaccines-table" aria-label={t.vaccineTable}>
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
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
