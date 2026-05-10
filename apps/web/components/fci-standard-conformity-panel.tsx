'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  DogMeasurementRecord,
  FciConformityEvidenceKey,
  FciConformityQualification,
  FciConformitySectionKey,
  FciConformityStatus,
} from '@cane-corso-platform/contracts';
import type { DogSex } from '@/lib/dog-form.types';
import type { Locale } from '@/lib/i18n';
import { ApiRequestError } from '@/lib/api/fetcher';
import { listDogMeasurements } from '@/lib/api/dog-measurements.client';
import { buildFciStandardConformityDocument } from '@/lib/fci-standard-conformity';

interface FciStandardConformityPanelProps {
  locale: Locale;
  dogId?: string;
  dogName?: string;
  sex: DogSex;
  dateOfBirth?: string;
  color?: string;
}

const copyByLocale = {
  en: {
    eyebrow: 'FCI Standard No. 343 orientation',
    title: 'FCI conformity signal, separate from USG certificate',
    description:
      'This panel compares the available profile and latest measurements with measurable parts of the official Cane Corso Italiano standard. It is an orientation layer, not an FCI document.',
    source: 'Source base: FCI Standard No. 343, Cane Corso Italiano, official valid standard 25.09.2023.',
    loading: 'Loading latest measurement archive...',
    loadError: 'Measurements could not be loaded. The FCI orientation is using profile data only.',
    noDog: 'Save the Cane Corso profile first to connect the latest measurement archive.',
    noMeasurement: 'No saved measurement yet. Add height, weight and proportions to make this signal meaningful.',
    latestMeasurement: 'Latest saved measurement',
    score: 'FCI conformity by available data',
    measurable: 'Measurable standard signal',
    evidence: 'Evidence confidence',
    confidence: 'confidence',
    age: 'Age',
    months: 'months',
    unknownAge: 'unknown age',
    pendingScore: 'Not enough data yet',
    confidenceValues: { low: 'low', medium: 'medium', high: 'high' },
    emptyState: {
      title: 'Add data before reading this as a score',
      body: 'The FCI orientation stays calm until there is enough evidence. Fill the basic profile and save measurements before using percentages for review preparation.',
      items: ['Birth date and sex', 'Colour and owner description', 'Height, weight and proportions in the measurement archive'],
    },
    mode: {
      adult_standard_orientation: 'Adult standard orientation',
      young_adult_transition: 'Young adult transition',
      puppy_development_projection: 'Puppy development projection',
      unknown_age_orientation: 'Unknown-age orientation',
    },
    qualification: {
      candidate_for_usg_review: 'May qualify for USG review when a human/admin confirms the evidence.',
      collect_more_data: 'Collect more data before using the score for serious review preparation.',
      development_only: 'Development-only signal. A puppy should not receive a final adult FCI conformity judgment.',
      human_review_needed: 'Human review is needed before any USG decision.',
      not_ready_for_conformity_orientation: 'Not enough data for an FCI conformity orientation yet.',
    },
    statuses: {
      missing_data: 'Missing data',
      within_standard_orientation: 'Within orientation',
      near_standard_watch: 'Near range / watch',
      outside_standard_review: 'Outside range / review',
      human_review_required: 'Human review required',
      not_assessable_from_profile: 'Not assessable from profile',
    },
    sections: {
      height_weight: ['Height & weight', 'Compares height at withers and weight with the adult sex-based FCI orientation.'],
      body_proportion: ['Body proportion', 'Uses the rectangular outline orientation: body length about 11% greater than height.'],
      head_proportion: ['Head proportion', 'Uses the head length orientation: about 36% of height at withers.'],
      muzzle_skull_ratio: ['Muzzle / skull ratio', 'Uses the approximate 1:2 muzzle-to-skull orientation and keeps interpretation human-reviewed.'],
      coat_colour: ['Coat colour', 'Checks whether the selected colour belongs to the standard colour family or needs review.'],
      faults_boundary: ['Faults boundary', 'Severe and disqualifying faults cannot be detected safely from form fields alone.'],
      evidence_confidence: ['Evidence confidence', 'Shows whether enough profile and measurement evidence exists to trust the orientation.'],
    },
    evidenceKeys: {
      fci_standard_343: 'FCI Standard No. 343',
      official_fci_boundary: 'USG does not issue official FCI documents',
      usg_certificate_boundary: 'USG certificate remains a separate platform trust document',
      adult_height_range: 'adult height range by sex',
      adult_weight_range: 'adult weight range by sex',
      height_tolerance_applied: '±2 cm height tolerance orientation',
      body_length_11_percent: 'body length about height + 11%',
      head_length_36_percent: 'head length about 36% of height',
      muzzle_skull_1_to_2: 'muzzle/skull about 1:2',
      accepted_colour_orientation: 'standard colour family orientation',
      colour_needs_review: 'colour needs human review',
      measurement_archive_latest_record: 'latest measurement archive record used',
      measurement_archive_needed: 'measurement archive needed',
      birth_date_needed: 'birth date needed',
      puppy_not_final_standard: 'puppy development is not final adult standard judgment',
      disqualifying_faults_not_auto_detected: 'faults cannot be auto-detected safely',
      human_review_required: 'human review required',
    },
    boundariesTitle: 'Important distinction',
    boundaries: [
      'USG certificate is not an FCI certificate, pedigree, club document, or official show result.',
      'FCI conformity percentage is an orientation from available data, not proof of breed identity.',
      'Final USG qualification remains human/admin controlled and can require better photos, measurements or expert review.',
    ],
  },
  bg: {
    eyebrow: 'Ориентир спрямо FCI Standard No. 343',
    title: 'FCI съответствие, отделно от USG сертификата',
    description:
      'Този панел сравнява наличния профил и последните измервания с измеримите части от официалния стандарт за Cane Corso Italiano. Това е ориентир, не FCI документ.',
    source: 'База източник: FCI Standard No. 343, Cane Corso Italiano, официално валиден стандарт 25.09.2023.',
    loading: 'Зареждане на последния архив с измервания...',
    loadError: 'Измерванията не можаха да се заредят. FCI ориентирът използва само данните от профила.',
    noDog: 'Първо запази профила на Cane Corso, за да се свърже последният архив с измервания.',
    noMeasurement: 'Още няма запазено измерване. Добави височина, тегло и пропорции, за да стане сигналът смислен.',
    latestMeasurement: 'Последно запазено измерване',
    score: 'FCI съответствие по наличните данни',
    measurable: 'Измерим стандартен сигнал',
    evidence: 'Увереност на доказателствата',
    confidence: 'увереност',
    age: 'Възраст',
    months: 'месеца',
    unknownAge: 'неясна възраст',
    pendingScore: 'Още няма достатъчно данни',
    confidenceValues: { low: 'ниска', medium: 'средна', high: 'висока' },
    emptyState: {
      title: 'Добави данни, преди това да се чете като оценка',
      body: 'FCI ориентирът остава спокоен, докато няма достатъчно доказателства. Попълни основния профил и запази измервания, преди процентите да се използват за подготовка за преглед.',
      items: ['Дата на раждане и пол', 'Цвят и описание от собственика', 'Височина, тегло и пропорции в архива с измервания'],
    },
    mode: {
      adult_standard_orientation: 'Ориентир за зряло куче',
      young_adult_transition: 'Преход към зряло куче',
      puppy_development_projection: 'Ориентир за развитие на кученце',
      unknown_age_orientation: 'Ориентир при неясна възраст',
    },
    qualification: {
      candidate_for_usg_review: 'Може да стане кандидат за USG преглед, когато човек/админ потвърди доказателствата.',
      collect_more_data: 'Събери още данни, преди резултатът да се използва за сериозна подготовка за преглед.',
      development_only: 'Само сигнал за развитие. Кученце не трябва да получава финална FCI оценка за зряло куче.',
      human_review_needed: 'Нужен е човешки преглед преди каквото и да е USG решение.',
      not_ready_for_conformity_orientation: 'Още няма достатъчно данни за FCI ориентир.',
    },
    statuses: {
      missing_data: 'Липсват данни',
      within_standard_orientation: 'В ориентир',
      near_standard_watch: 'Близо до диапазон / наблюдение',
      outside_standard_review: 'Извън диапазон / преглед',
      human_review_required: 'Нужен е човешки преглед',
      not_assessable_from_profile: 'Не се оценява само от профил',
    },
    sections: {
      height_weight: ['Височина и тегло', 'Сравнява височина при холката и тегло с FCI ориентир за зряло куче според пола.'],
      body_proportion: ['Пропорция на тялото', 'Използва правоъгълния ориентир: дължина на тялото около 11% над височината.'],
      head_proportion: ['Пропорция на главата', 'Използва ориентира за глава: около 36% от височината при холката.'],
      muzzle_skull_ratio: ['Муцуна / череп', 'Използва приблизителния ориентир 1:2 муцуна към череп и оставя тълкуването за човек.'],
      coat_colour: ['Цвят на козината', 'Проверява дали избраният цвят е в стандартното цветово семейство или иска преглед.'],
      faults_boundary: ['Граница за отклонения', 'Сериозни и дисквалифициращи отклонения не могат да се откриват безопасно само от полета във форма.'],
      evidence_confidence: ['Увереност на доказателствата', 'Показва дали има достатъчно профилни и измервателни данни, за да се вярва на ориентира.'],
    },
    evidenceKeys: {
      fci_standard_343: 'FCI Standard No. 343',
      official_fci_boundary: 'USG не издава официални FCI документи',
      usg_certificate_boundary: 'USG сертификатът остава отделен доверителен документ на платформата',
      adult_height_range: 'височина за зряло куче според пола',
      adult_weight_range: 'тегло за зряло куче според пола',
      height_tolerance_applied: 'ориентир с ±2 см толеранс за височина',
      body_length_11_percent: 'дължина на тялото около височина + 11%',
      head_length_36_percent: 'дължина на глава около 36% от височината',
      muzzle_skull_1_to_2: 'муцуна/череп около 1:2',
      accepted_colour_orientation: 'ориентир за стандартно цветово семейство',
      colour_needs_review: 'цветът иска човешки преглед',
      measurement_archive_latest_record: 'използван е последният запис от архива',
      measurement_archive_needed: 'нужен е архив с измервания',
      birth_date_needed: 'нужна е дата на раждане',
      puppy_not_final_standard: 'развитието на кученце не е финална FCI оценка за зряло куче',
      disqualifying_faults_not_auto_detected: 'отклоненията не се откриват автоматично безопасно',
      human_review_required: 'нужен е човешки преглед',
    },
    boundariesTitle: 'Важна разлика',
    boundaries: [
      'USG сертификатът не е FCI сертификат, родословие, клубен документ или официален изложбен резултат.',
      'Процентът FCI съответствие е ориентир от наличните данни, не доказателство за породна идентичност.',
      'Финалната USG квалификация остава под човешки/админ контрол и може да изисква по-добри снимки, измервания или експертен преглед.',
    ],
  },
  it: {
    eyebrow: 'Orientamento FCI Standard No. 343',
    title: 'Conformità FCI separata dal certificato USG',
    description:
      'Questo pannello confronta profilo e ultime misure disponibili con le parti misurabili dello standard ufficiale del Cane Corso Italiano. È orientamento, non documento FCI.',
    source: 'Base fonte: FCI Standard No. 343, Cane Corso Italiano, standard ufficiale valido 25.09.2023.',
    loading: 'Caricamento ultimo archivio misure...',
    loadError: 'Le misure non possono essere caricate. L’orientamento FCI usa solo i dati del profilo.',
    noDog: 'Salva prima il profilo del Cane Corso per collegare l’ultimo archivio misure.',
    noMeasurement: 'Nessuna misura salvata ancora. Aggiungi altezza, peso e proporzioni per rendere utile il segnale.',
    latestMeasurement: 'Ultima misura salvata',
    score: 'Conformità FCI dai dati disponibili',
    measurable: 'Segnale standard misurabile',
    evidence: 'Affidabilità evidenze',
    confidence: 'affidabilità',
    age: 'Età',
    months: 'mesi',
    unknownAge: 'età sconosciuta',
    pendingScore: 'Dati non ancora sufficienti',
    confidenceValues: { low: 'bassa', medium: 'media', high: 'alta' },
    emptyState: {
      title: 'Aggiungi dati prima di leggere questo come punteggio',
      body: 'L’orientamento FCI resta prudente finché non ci sono evidenze sufficienti. Completa il profilo e salva le misure prima di usare percentuali per preparare la revisione.',
      items: ['Data di nascita e sesso', 'Colore e descrizione del proprietario', 'Altezza, peso e proporzioni nell’archivio misure'],
    },
    mode: {
      adult_standard_orientation: 'Orientamento adulto',
      young_adult_transition: 'Transizione giovane adulto',
      puppy_development_projection: 'Proiezione sviluppo cucciolo',
      unknown_age_orientation: 'Orientamento con età sconosciuta',
    },
    qualification: {
      candidate_for_usg_review: 'Può qualificarsi per revisione USG quando umano/admin conferma le evidenze.',
      collect_more_data: 'Raccogli altri dati prima di usare il punteggio per preparazione seria alla revisione.',
      development_only: 'Solo segnale di sviluppo. Un cucciolo non deve ricevere giudizio FCI adulto finale.',
      human_review_needed: 'Serve revisione umana prima di qualunque decisione USG.',
      not_ready_for_conformity_orientation: 'Non ci sono abbastanza dati per orientamento FCI.',
    },
    statuses: {
      missing_data: 'Dati mancanti',
      within_standard_orientation: 'Nel riferimento',
      near_standard_watch: 'Vicino / osservare',
      outside_standard_review: 'Fuori range / revisione',
      human_review_required: 'Revisione umana richiesta',
      not_assessable_from_profile: 'Non valutabile solo dal profilo',
    },
    sections: {
      height_weight: ['Altezza e peso', 'Confronta altezza al garrese e peso con orientamento FCI adulto per sesso.'],
      body_proportion: ['Proporzione corpo', 'Usa l’orientamento rettangolare: lunghezza corpo circa 11% oltre l’altezza.'],
      head_proportion: ['Proporzione testa', 'Usa l’orientamento testa: circa 36% dell’altezza al garrese.'],
      muzzle_skull_ratio: ['Muso / cranio', 'Usa orientamento approssimativo 1:2 muso-cranio e lascia interpretazione alla revisione umana.'],
      coat_colour: ['Colore mantello', 'Controlla se il colore selezionato appartiene alla famiglia standard o richiede revisione.'],
      faults_boundary: ['Confine difetti', 'Difetti gravi e squalificanti non possono essere rilevati in sicurezza solo da campi modulo.'],
      evidence_confidence: ['Affidabilità evidenze', 'Mostra se profilo e misure sono sufficienti per fidarsi dell’orientamento.'],
    },
    evidenceKeys: {
      fci_standard_343: 'FCI Standard No. 343',
      official_fci_boundary: 'USG non emette documenti ufficiali FCI',
      usg_certificate_boundary: 'Il certificato USG resta documento di fiducia separato della piattaforma',
      adult_height_range: 'altezza adulta per sesso',
      adult_weight_range: 'peso adulto per sesso',
      height_tolerance_applied: 'orientamento tolleranza altezza ±2 cm',
      body_length_11_percent: 'lunghezza corpo circa altezza + 11%',
      head_length_36_percent: 'lunghezza testa circa 36% dell’altezza',
      muzzle_skull_1_to_2: 'muso/cranio circa 1:2',
      accepted_colour_orientation: 'orientamento famiglia colori standard',
      colour_needs_review: 'colore richiede revisione umana',
      measurement_archive_latest_record: 'usato ultimo record archivio misure',
      measurement_archive_needed: 'serve archivio misure',
      birth_date_needed: 'serve data nascita',
      puppy_not_final_standard: 'sviluppo cucciolo non è giudizio FCI adulto finale',
      disqualifying_faults_not_auto_detected: 'difetti non rilevati automaticamente in sicurezza',
      human_review_required: 'revisione umana richiesta',
    },
    boundariesTitle: 'Distinzione importante',
    boundaries: [
      'Il certificato USG non è certificato FCI, pedigree, documento club o risultato ufficiale esposizione.',
      'La percentuale di conformità FCI è orientamento dai dati disponibili, non prova di identità di razza.',
      'La qualifica finale USG resta sotto controllo umano/admin e può richiedere foto, misure o revisione esperta migliori.',
    ],
  },
} as const;

function scoreClass(score: number) {
  if (score >= 80) return 'is-strong';
  if (score >= 50) return 'is-watch';
  return 'is-low';
}

function sectionStatusClass(status: FciConformityStatus) {
  return `fci-conformity-section fci-conformity-section--${status}`;
}

function latestRecord(records: DogMeasurementRecord[]): DogMeasurementRecord | null {
  if (!records.length) return null;
  return [...records].sort((a, b) => b.measuredAt.localeCompare(a.measuredAt))[0] ?? null;
}

function formatRange(range: { low: number; high: number } | null) {
  return range ? `${range.low}–${range.high}` : '—';
}

function hasMinimumFciEvidence(document: ReturnType<typeof buildFciStandardConformityDocument>) {
  return document.scores.evidenceConfidence >= 35 || document.scores.measurable > 0;
}

function scoreDisplay(value: number, canShowScore: boolean, pendingLabel: string) {
  return canShowScore ? `${value}%` : pendingLabel;
}

export function FciStandardConformityPanel({ locale, dogId, dogName, sex, dateOfBirth, color }: FciStandardConformityPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const [records, setRecords] = useState<DogMeasurementRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(dogId));
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMeasurements() {
      if (!dogId) {
        setRecords([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(false);
      try {
        const document = await listDogMeasurements(dogId);
        if (!ignore) setRecords(document.records);
      } catch (error) {
        if (!ignore) {
          setLoadError(error instanceof ApiRequestError);
          setRecords([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadMeasurements();
    return () => {
      ignore = true;
    };
  }, [dogId]);

  const latestMeasurement = useMemo(() => latestRecord(records), [records]);
  const document = buildFciStandardConformityDocument({
    dogId,
    dogName,
    sex,
    dateOfBirth,
    color,
    latestMeasurement,
  });

  const scoreEntries = [
    ['overall', copy.score, document.scores.overall],
    ['measurable', copy.measurable, document.scores.measurable],
    ['evidence', copy.evidence, document.scores.evidenceConfidence],
  ] as const;
  const canShowScore = hasMinimumFciEvidence(document);

  return (
    <section className="content-card fci-conformity-panel" aria-label={copy.title}>
      <div className="fci-conformity-panel__header">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="fci-conformity-panel__mark" aria-hidden="true">FCI</div>
      </div>

      <div className="fci-conformity-panel__summary">
        <div className="fci-conformity-panel__score">
          <span>{copy.score}</span>
          <strong>{scoreDisplay(document.scores.overall, canShowScore, '—')}</strong>
          <small>{canShowScore ? `${copy.confidence}: ${copy.confidenceValues[document.confidence]}` : copy.pendingScore}</small>
        </div>
        <div className="fci-conformity-panel__mode">
          <strong>{copy.mode[document.mode]}</strong>
          <span>{copy.age}: {document.ageMonths ?? copy.unknownAge}{document.ageMonths != null ? ` ${copy.months}` : ''}</span>
          <p>{copy.qualification[document.qualification as FciConformityQualification]}</p>
        </div>
      </div>

      <div className="fci-conformity-panel__scores">
        {scoreEntries.map(([key, label, value]) => (
          <div className={scoreClass(value)} key={key}>
            <span>{label}</span>
            <strong>{scoreDisplay(value, canShowScore, '—')}</strong>
          </div>
        ))}
      </div>

      <div className="fci-conformity-panel__archive-note">
        {loading ? <span>{copy.loading}</span> : null}
        {!loading && loadError ? <span>{copy.loadError}</span> : null}
        {!loading && !loadError && !dogId ? <span>{copy.noDog}</span> : null}
        {!loading && !loadError && dogId && !latestMeasurement ? <span>{copy.noMeasurement}</span> : null}
        {!loading && !loadError && latestMeasurement ? (
          <span>{copy.latestMeasurement}: {latestMeasurement.measuredAt}</span>
        ) : null}
      </div>

      {!canShowScore ? (
        <div className="fci-conformity-panel__empty-state">
          <strong>{copy.emptyState.title}</strong>
          <p>{copy.emptyState.body}</p>
          <ul>
            {copy.emptyState.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : (
        <div className="fci-conformity-panel__sections">
          {document.sections.map((section) => {
            const [title, description] = copy.sections[section.key as FciConformitySectionKey];
            return (
              <article className={sectionStatusClass(section.status)} key={section.key}>
                <div className="fci-conformity-section__head">
                  <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>
                  <span>{scoreDisplay(section.score, canShowScore, '—')}</span>
                </div>
                <div className="fci-conformity-section__meta">
                  <span>{copy.statuses[section.status]}</span>
                  <span>{copy.confidence}: {copy.confidenceValues[section.confidence]}</span>
                  <span>{section.value ?? '—'} / {formatRange(section.expectedRange)}</span>
                </div>
                <div className="fci-conformity-section__evidence">
                  {section.evidenceKeys.map((key: FciConformityEvidenceKey) => (
                    <span key={`${section.key}-${key}`}>{copy.evidenceKeys[key]}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="fci-conformity-panel__boundaries">
        <strong>{copy.boundariesTitle}</strong>
        <ul>
          {copy.boundaries.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p>{copy.source}</p>
      </div>
    </section>
  );
}
