'use client';

import { useMemo, useState } from 'react';
import type { DogSex } from '@/lib/dog-form.types';
import type { Locale } from '@/lib/i18n';
import {
  evaluateUsgMeasurementAssistant,
  type MeasurementRange,
  type UsgMeasurementCheck,
} from '@/lib/usg-measurement-assistant';

interface UsgMeasurementAssistantPanelProps {
  locale: Locale;
  dogName?: string;
  sex: DogSex;
  dateOfBirth?: string;
  color?: string;
}

type MeasurementState = {
  weightKg: string;
  heightWithersCm: string;
  bodyLengthCm: string;
  chestCircumferenceCm: string;
  headLengthCm: string;
  muzzleLengthCm: string;
  skullLengthCm: string;
};

type MeasurementFieldKey = keyof MeasurementState;

const copyByLocale = {
  en: {
    eyebrow: 'USG growth helper',
    title: 'Measurement assistant',
    description:
      'Enter temporary measurements and USG will compare them with age-aware growth ranges and core Cane Corso proportions.',
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
    fieldsTitle: 'Measurements to test',
    fieldsDescription: 'Nothing is saved yet. This is a local preview for owner confidence and admin-readable direction.',
    fields: {
      weightKg: 'Weight kg',
      heightWithersCm: 'Height at withers cm',
      bodyLengthCm: 'Body length cm',
      chestCircumferenceCm: 'Chest circumference cm',
      headLengthCm: 'Head length cm',
      muzzleLengthCm: 'Muzzle length cm',
      skullLengthCm: 'Skull length cm',
    },
    resultsTitle: 'USG preview',
    score: 'Data confidence',
    enough: 'Enough data for an orientation',
    needsMore: 'Add at least two measurements for a stronger preview',
    expected: 'Expected',
    difference: 'Difference',
    statuses: {
      missing: 'Waiting for data',
      below: 'Below orientation range',
      within: 'Within orientation range',
      above: 'Above orientation range',
      watch: 'Near edge / watch',
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
    notes: [
      'Body length uses the official reading orientation: height at withers + about 11%.',
      'Head length uses the core proportion: about 36% of height at withers.',
      'Muzzle / skull uses the 1:2 orientation and should be interpreted by a human reviewer.',
    ],
    future: 'Next safe layer: these measurements can later become saved profile fields after a database migration.',
  },
  bg: {
    eyebrow: 'USG помощник за растеж',
    title: 'Асистент за измервания',
    description:
      'Въведи временни измервания и USG ще ги сравни с ориентировъчни диапазони по възраст и с основни Cane Corso пропорции.',
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
    fieldsTitle: 'Измервания за проверка',
    fieldsDescription: 'Нищо не се запазва още. Това е локален преглед за увереност на собственика и посока за админ преглед.',
    fields: {
      weightKg: 'Тегло кг',
      heightWithersCm: 'Височина при холката см',
      bodyLengthCm: 'Дължина на тялото см',
      chestCircumferenceCm: 'Гръдна обиколка см',
      headLengthCm: 'Дължина на глава см',
      muzzleLengthCm: 'Дължина на муцуна см',
      skullLengthCm: 'Дължина на череп см',
    },
    resultsTitle: 'USG преглед',
    score: 'Увереност на данните',
    enough: 'Има достатъчно данни за ориентир',
    needsMore: 'Добави поне две измервания за по-силен преглед',
    expected: 'Ориентир',
    difference: 'Разлика',
    statuses: {
      missing: 'Очаква данни',
      below: 'Под ориентировъчния диапазон',
      within: 'В ориентировъчния диапазон',
      above: 'Над ориентировъчния диапазон',
      watch: 'Близо до граница / наблюдение',
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
    notes: [
      'Дължината на тялото използва официалния ориентир: височина при холката + около 11%.',
      'Дължината на главата използва основната пропорция: около 36% от височината при холката.',
      'Муцуна / череп използва ориентир 1:2 и трябва да се тълкува от човек, не автоматично.',
    ],
    future: 'Следващ безопасен слой: тези измервания могат по-късно да станат запазени полета след миграция на базата.',
  },
  it: {
    eyebrow: 'Assistente crescita USG',
    title: 'Assistente misurazioni',
    description:
      'Inserisci misurazioni temporanee e USG le confronta con intervalli orientativi per età e proporzioni principali del Cane Corso.',
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
    fieldsTitle: 'Misurazioni da controllare',
    fieldsDescription: 'Nulla viene ancora salvato. È una preview locale per il proprietario e una direzione leggibile per admin.',
    fields: {
      weightKg: 'Peso kg',
      heightWithersCm: 'Altezza al garrese cm',
      bodyLengthCm: 'Lunghezza corpo cm',
      chestCircumferenceCm: 'Circonferenza torace cm',
      headLengthCm: 'Lunghezza testa cm',
      muzzleLengthCm: 'Lunghezza muso cm',
      skullLengthCm: 'Lunghezza cranio cm',
    },
    resultsTitle: 'Preview USG',
    score: 'Affidabilità dati',
    enough: 'Dati sufficienti per un orientamento',
    needsMore: 'Aggiungi almeno due misurazioni per una preview più forte',
    expected: 'Orientamento',
    difference: 'Differenza',
    statuses: {
      missing: 'In attesa di dati',
      below: 'Sotto intervallo orientativo',
      within: 'Dentro intervallo orientativo',
      above: 'Sopra intervallo orientativo',
      watch: 'Vicino al limite / osservare',
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
    notes: [
      'La lunghezza del corpo usa l’orientamento ufficiale: altezza al garrese + circa 11%.',
      'La lunghezza della testa usa la proporzione centrale: circa 36% dell’altezza al garrese.',
      'Muso / cranio usa l’orientamento 1:2 e va interpretato da un revisore umano.',
    ],
    future: 'Prossimo layer sicuro: queste misurazioni potranno diventare campi salvati dopo una migrazione database.',
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

function formatValue(value: number | null): string {
  if (value == null) return '—';
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function statusClass(status: UsgMeasurementCheck['status']) {
  return `measurement-check-card measurement-check-card--${status}`;
}

export function UsgMeasurementAssistantPanel({ locale, dogName, sex, dateOfBirth, color }: UsgMeasurementAssistantPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const [measurements, setMeasurements] = useState<MeasurementState>({
    weightKg: '',
    heightWithersCm: '',
    bodyLengthCm: '',
    chestCircumferenceCm: '',
    headLengthCm: '',
    muzzleLengthCm: '',
    skullLengthCm: '',
  });

  const result = useMemo(() => evaluateUsgMeasurementAssistant({
    sex,
    dateOfBirth,
    weightKg: parseNumber(measurements.weightKg),
    heightWithersCm: parseNumber(measurements.heightWithersCm),
    bodyLengthCm: parseNumber(measurements.bodyLengthCm),
    chestCircumferenceCm: parseNumber(measurements.chestCircumferenceCm),
    headLengthCm: parseNumber(measurements.headLengthCm),
    muzzleLengthCm: parseNumber(measurements.muzzleLengthCm),
    skullLengthCm: parseNumber(measurements.skullLengthCm),
  }), [dateOfBirth, measurements, sex]);

  const sexLabel = sex === 'male' ? copy.male : copy.female;
  const ageLabel = result.ageMonths == null ? copy.unknownAge : `${result.ageMonths} ${copy.months}`;

  const handleChange = (field: MeasurementFieldKey, value: string) => {
    setMeasurements((current) => ({ ...current, [field]: value }));
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
        </div>
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

      <div className="usg-measurement-assistant__notes">
        {copy.notes.map((note) => <p key={note}>{note}</p>)}
        <strong>{copy.future}</strong>
      </div>
    </section>
  );
}
