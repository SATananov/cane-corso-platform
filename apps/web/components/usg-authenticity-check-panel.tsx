'use client';

// Step 119 — USG Authenticity Data Foundation & ML-Safe Labels
// Legacy QA marker: Step 118.1 — USG Standard Match bonus clarity

import { useEffect, useMemo, useState } from 'react';
import type { DogLifecycleStatus, DogMeasurementRecord, DogSex } from '@cane-corso-platform/contracts';
import { listDogMeasurements } from '@/lib/api/dog-measurements.client';
import { ApiRequestError } from '@/lib/api/fetcher';
import { buildFciStandardConformityDocument } from '@/lib/fci-standard-conformity';
import type { Locale } from '@/lib/i18n';

interface UsgAuthenticityCheckPanelProps {
  locale: Locale;
  dogId?: string;
  dogName?: string | null;
  sex: DogSex;
  dateOfBirth?: string | null;
  color?: string | null;
  city?: string | null;
  country?: string | null;
  shortDescription?: string | null;
  mainImageUrl?: string | null;
  galleryImageCount: number;
  pedigreeFilledCount: number;
  pedigreePhotoCount: number;
  lifecycleStatus: DogLifecycleStatus;
  hasPublication: boolean;
  hasCertificate: boolean;
}

type AuthenticitySignalKey = 'profile' | 'photos' | 'measurements' | 'standard' | 'pedigree' | 'human_review';

type NextAuthenticityActionKey = 'profile' | 'photos' | 'measurements' | 'pedigree' | 'review';

type AuthenticityQualificationKey = 'insufficient' | 'partial' | 'good' | 'strong' | 'very_strong';

type AuthenticityConfidenceKey = 'low' | 'medium' | 'high';

type AuthenticityReadinessBand = 'not_ready' | 'partial' | 'almost_ready' | 'ready';

type MlSafeLabelKey = 'photo_quality' | 'pose_readiness' | 'standard_signal' | 'review_readiness';

type MlSafeLabel = {
  key: MlSafeLabelKey;
  label: string;
  value: string;
  description: string;
};

type AuthenticitySignal = {
  key: AuthenticitySignalKey;
  label: string;
  value: string;
  description: string;
  score: number;
};

const copyByLocale = {
  en: {
    eyebrow: 'USG bonus authenticity check',
    title: 'Compare with the standard Cane Corso profile',
    description:
      'This voluntary bonus check uses the standard template as a comparison model. The percentage shows visual and measurable match against the Cane Corso standard/USG orientation. It does not prove breed identity or pedigree.',
    buttonContext: 'Voluntary bonus check for owners who want deeper clarity',
    score: 'USG Standard Match',
    confidence: 'Evidence confidence',
    bonusBadge: 'Optional owner bonus',
    dataFoundationTitle: 'What is template, what is signal, what is decision',
    dataLayers: {
      standardTemplate: {
        label: 'Template',
        title: 'Standard Match orientation',
        body: 'A rule-based comparison against the Cane Corso standard/USG orientation, built from profile data, measurements and available photos.',
      },
      photoReadiness: {
        label: 'Input',
        title: 'Photo readiness',
        body: 'A structured three-photo set prepares future photo/AI support without saying that a photo proves breed identity.',
      },
      reviewReadiness: {
        label: 'Decision path',
        title: 'USG review readiness',
        body: 'The score prepares the owner for human review; Registry publication and Certificate remain separate USG-controlled decisions.',
      },
    },
    mlSafeTitle: 'ML-safe labels for the future model',
    mlSafeBody: 'The platform stores safe orientation labels such as photo quality, pose readiness, standard signal and review readiness. It never trains on a final breed-proof label.',
    mlLabels: {
      photo_quality: 'Photo quality',
      pose_readiness: 'Pose readiness',
      standard_signal: 'Standard signal',
      review_readiness: 'Review readiness',
    },
    mlDescriptions: {
      photo_quality: 'Whether the available photos are useful enough for human and future model review.',
      pose_readiness: 'Whether the three expected views can support pose and proportion orientation.',
      standard_signal: 'How the measurable profile compares with the standard template.',
      review_readiness: 'Whether the owner should complete data or move toward USG review.',
    },
    readinessValues: {
      not_ready: 'not ready',
      partial: 'partial',
      almost_ready: 'almost ready',
      ready: 'ready',
    },
    authorityTitle: 'Registry and Certificate boundary',
    authorityBody: 'Standard Match can guide the owner inside Owner Center. Registry and Certificate status are never automatic and always require the proper USG review path.',
    resultMeaningTitle: 'How to read the percentage',
    resultMeaningBody: 'The percentage shows standard-template match from available photos, measurements and profile data. It is not a purity or pedigree verdict.',
    scoreGuideTitle: 'Match levels',
    scoreGuideItems: ['0–39%: insufficient data', '40–59%: partial match', '60–74%: good initial match', '75–89%: strong match', '90–100%: very strong match, human confirmation needed'],
    loading: 'Loading measurement archive…',
    loadError: 'Measurement archive is not available right now. The check continues with profile and photo evidence only.',
    noName: 'Unnamed Cane Corso',
    evidence: 'Standard comparison diagram',
    signals: 'Breakdown by evidence',
    proportions: 'Standard-oriented diagrams',
    photoModel: 'Photo comparison status',
    photoModelBody:
      'Photo recognition is prepared as a future layer. Today the platform checks whether the uploaded photos can support comparison with the standard template, not whether the image proves breed identity.',
    nextTitle: 'Best next evidence',
    boundaryTitle: 'Trust boundary',
    boundaryBody:
      'The result is a preliminary standard-match orientation only. Final USG review, Registry publication and Certificate decisions remain human-controlled.',
    qualification: {
      insufficient: 'Insufficient data / weak orientation',
      partial: 'Partial standard match',
      good: 'Good initial standard match',
      strong: 'Strong standard match — needs human review',
      very_strong: 'Very strong standard match — human confirmation needed',
    },
    confidenceValues: {
      low: 'low',
      medium: 'medium',
      high: 'high',
    },
    flow: ['Owner Center', 'Photos', 'Standard Match', 'USG review', 'Registry/Certificate'],
    signalLabels: {
      profile: 'Profile data',
      photos: 'Photo evidence',
      measurements: 'Measurement archive',
      standard: 'Standard Match orientation',
      pedigree: 'Family context',
      human_review: 'Human review boundary',
    },
    signalDescriptions: {
      profile: 'Name, sex, birth date, colour, location and owner description.',
      photos: 'Main image plus owner gallery photos for visual context.',
      measurements: 'Weight, height and proportion records saved by date.',
      standard: 'Uses the existing FCI conformity orientation engine as the measurable standard template.',
      pedigree: 'Known family line and ancestor photos when available.',
      human_review: 'Keeps all official decisions separate from automatic scoring.',
    },
    values: {
      profileReady: 'profile fields ready',
      photoCount: 'photos',
      measurementCount: 'measurement records',
      fciScore: 'standard match score',
      pedigreeCount: 'pedigree fields',
      locked: 'locked',
    },
    diagramLabels: {
      body: 'Body length ≈ height + 11%',
      head: 'Head length ≈ 36% of height',
      muzzle: 'Muzzle / skull ≈ 1:2',
    },
    nextActions: {
      photos: 'Add side-standing, front and head photos.',
      measurements: 'Save dated weight, height, body and head measurements.',
      profile: 'Complete birth date, sex, colour, location and description.',
      pedigree: 'Add parents/ancestors if known, with photos when possible.',
      review: 'Submit for USG review when evidence is clear enough.',
    },
  },
  bg: {
    eyebrow: 'USG бонус проверка за истинско',
    title: 'Сравнение със стандартен Cane Corso профил',
    description:
      'Това е доброволна бонус проверка за потребител, който иска по-дълбока ориентация. Използва образец за сравнение със стандарта, а процентът показва визуално и измеримо съответствие с Cane Corso стандарт/USG ориентир. Не доказва порода или родословие.',
    buttonContext: 'Бонус за собственици, които искат по-ясна ориентация',
    score: 'USG Standard Match',
    confidence: 'Увереност по доказателства',
    bonusBadge: 'Доброволен бонус за потребителя',
    dataFoundationTitle: 'Кое е шаблон, кое е сигнал, кое е решение',
    dataLayers: {
      standardTemplate: {
        label: 'Шаблон',
        title: 'Standard Match ориентация',
        body: 'Правилно сравнение спрямо Cane Corso стандарт/USG ориентир, изградено от профилни данни, измервания и налични снимки.',
      },
      photoReadiness: {
        label: 'Входни данни',
        title: 'Готовност на снимките',
        body: 'Структуриран комплект от три снимки подготвя бъдеща photo/AI помощ, без да твърди, че снимка доказва порода.',
      },
      reviewReadiness: {
        label: 'Път към решение',
        title: 'Готовност за USG преглед',
        body: 'Процентът подготвя собственика за човешки преглед; Регистърът и Сертификатът остават отделни USG решения.',
      },
    },
    mlSafeTitle: 'ML-safe етикети за бъдещия модел',
    mlSafeBody: 'Платформата пази безопасни ориентационни етикети като качество на снимка, готовност на поза, стандартен сигнал и готовност за преглед. Не обучаваме модел с финален етикет за доказана порода.',
    mlLabels: {
      photo_quality: 'Качество на снимки',
      pose_readiness: 'Готовност на поза',
      standard_signal: 'Стандартен сигнал',
      review_readiness: 'Готовност за преглед',
    },
    mlDescriptions: {
      photo_quality: 'Дали наличните снимки са достатъчно полезни за човешки и бъдещ моделен преглед.',
      pose_readiness: 'Дали трите очаквани изгледа могат да помогнат за ориентация на поза и пропорции.',
      standard_signal: 'Как измеримият профил се сравнява със стандартния шаблон.',
      review_readiness: 'Дали собственикът трябва да довърши данни или да се насочи към USG преглед.',
    },
    readinessValues: {
      not_ready: 'не е готово',
      partial: 'частично',
      almost_ready: 'почти готово',
      ready: 'готово',
    },
    authorityTitle: 'Граница към Регистър и Сертификат',
    authorityBody: 'Standard Match може да води собственика в Центъра. Статусът в Регистъра и Сертификатът никога не са автоматични и винаги минават през правилния USG преглед.',
    resultMeaningTitle: 'Как да четеш процента',
    resultMeaningBody: 'Процентът показва визуално и измеримо съответствие според наличните снимки, измервания и профилни данни. Това не е присъда за произход, порода или родословие.',
    scoreGuideTitle: 'Нива на съответствие',
    scoreGuideItems: ['0–39%: недостатъчно данни', '40–59%: частично съответствие', '60–74%: добро начално съответствие', '75–89%: силно съответствие', '90–100%: много силно съответствие, нужно е човешко потвърждение'],
    loading: 'Зареждам архива с измервания…',
    loadError: 'Архивът с измервания не е достъпен в момента. Проверката продължава само с профил и снимки.',
    noName: 'Cane Corso без име',
    evidence: 'Диаграма за сравнение със стандарта',
    signals: 'Разбивка по доказателства',
    proportions: 'Диаграми по стандарт',
    photoModel: 'Статус на снимковото сравнение',
    photoModelBody:
      'Разпознаването от снимка е подготвено като бъдещ слой. Днес платформата проверява дали снимките могат да помогнат за сравнение с образец за сравнение със стандарта, не дали изображението доказва породата.',
    nextTitle: 'Най-добра следваща стъпка',
    boundaryTitle: 'Граница на доверие',
    boundaryBody:
      'Резултатът е само предварителна ориентация за съответствие със стандарта. Финалният USG преглед, публикуването в Регистъра и Сертификатът остават човешки решения.',
    qualification: {
      insufficient: 'Недостатъчно данни / слаб ориентир',
      partial: 'Частично съответствие със стандарта',
      good: 'Добро начално съответствие',
      strong: 'Силно съответствие — нужен е човешки преглед',
      very_strong: 'Много силно съответствие — нужно е човешко потвърждение',
    },
    confidenceValues: {
      low: 'ниска',
      medium: 'средна',
      high: 'висока',
    },
    flow: ['Център', 'Снимки', 'Standard Match', 'USG преглед', 'Регистър/Сертификат'],
    signalLabels: {
      profile: 'Данни в профила',
      photos: 'Снимкови доказателства',
      measurements: 'Архив с измервания',
      standard: 'Ориентир за съответствие',
      pedigree: 'Семеен контекст',
      human_review: 'Човешки преглед',
    },
    signalDescriptions: {
      profile: 'Име, пол, дата на раждане, цвят, локация и описание от собственика.',
      photos: 'Основна снимка плюс галерия от собственика за визуален контекст.',
      measurements: 'Тегло, височина и пропорции, записани по дата.',
      standard: 'Използва вече наличния FCI conformity engine като измерим образец за сравнение със стандарта.',
      pedigree: 'Позната семейна линия и снимки на предци, когато са налични.',
      human_review: 'Държи официалните решения отделени от автоматичната оценка.',
    },
    values: {
      profileReady: 'готови профилни полета',
      photoCount: 'снимки',
      measurementCount: 'записа с измервания',
      fciScore: 'оценка на съответствие',
      pedigreeCount: 'родословни полета',
      locked: 'заключено',
    },
    diagramLabels: {
      body: 'Дължина на тяло ≈ височина + 11%',
      head: 'Дължина на глава ≈ 36% от височината',
      muzzle: 'Муцуна / череп ≈ 1:2',
    },
    nextActions: {
      photos: 'Добави странична снимка в стойка, фронтална снимка и снимка на глава.',
      measurements: 'Запази тегло, височина, дължина на тяло и глава по дата.',
      profile: 'Попълни дата на раждане, пол, цвят, локация и описание.',
      pedigree: 'Добави родители/предци, ако ги знаеш, със снимки когато е възможно.',
      review: 'Подай към USG преглед, когато доказателствата са достатъчно ясни.',
    },
  },
  it: {
    eyebrow: 'Verifica bonus autenticità USG',
    title: 'Confronto con il profilo standard Cane Corso',
    description:
      'È una verifica bonus volontaria per chi desidera più orientamento. Usa un modello standard di confronto e la percentuale indica corrispondenza visiva e misurabile con lo standard Cane Corso/USG. Non prova razza o pedigree.',
    buttonContext: 'Bonus volontario per proprietari che vogliono più chiarezza',
    score: 'USG Standard Match',
    confidence: 'Affidabilità evidenze',
    bonusBadge: 'Bonus volontario per utente',
    dataFoundationTitle: 'Cosa è modello, cosa è segnale, cosa è decisione',
    dataLayers: {
      standardTemplate: {
        label: 'Modello',
        title: 'Orientamento Standard Match',
        body: 'Confronto basato su regole rispetto allo standard Cane Corso/orientamento USG, costruito da dati profilo, misure e foto disponibili.',
      },
      photoReadiness: {
        label: 'Input',
        title: 'Prontezza foto',
        body: 'Un set strutturato di tre foto prepara il supporto foto/AI futuro senza affermare che una foto provi la razza.',
      },
      reviewReadiness: {
        label: 'Percorso decisione',
        title: 'Prontezza revisione USG',
        body: 'La percentuale prepara il proprietario alla revisione umana; Registro e Certificato restano decisioni USG separate.',
      },
    },
    mlSafeTitle: 'Etichette ML-safe per il modello futuro',
    mlSafeBody: 'La piattaforma conserva etichette sicure di orientamento: qualità foto, prontezza posa, segnale standard e prontezza revisione. Non addestra su una label finale che prova la razza.',
    mlLabels: {
      photo_quality: 'Qualità foto',
      pose_readiness: 'Prontezza posa',
      standard_signal: 'Segnale standard',
      review_readiness: 'Prontezza revisione',
    },
    mlDescriptions: {
      photo_quality: 'Se le foto disponibili sono abbastanza utili per revisione umana e modello futuro.',
      pose_readiness: 'Se le tre viste attese possono supportare orientamento di posa e proporzioni.',
      standard_signal: 'Come il profilo misurabile si confronta con il modello standard.',
      review_readiness: 'Se il proprietario deve completare dati o andare verso revisione USG.',
    },
    readinessValues: {
      not_ready: 'non pronto',
      partial: 'parziale',
      almost_ready: 'quasi pronto',
      ready: 'pronto',
    },
    authorityTitle: 'Confine Registro e Certificato',
    authorityBody: 'Standard Match può guidare il proprietario nel Centro. Registro e Certificato non sono mai automatici e richiedono sempre il corretto percorso di revisione USG.',
    resultMeaningTitle: 'Come leggere la percentuale',
    resultMeaningBody: 'La percentuale indica corrispondenza visiva e misurabile in base a foto, misure e dati profilo disponibili. Non è un verdetto su origine, razza o pedigree.',
    scoreGuideTitle: 'Livelli di corrispondenza',
    scoreGuideItems: ['0–39%: dati insufficienti', '40–59%: corrispondenza parziale', '60–74%: buona corrispondenza iniziale', '75–89%: corrispondenza forte', '90–100%: corrispondenza molto forte, conferma umana necessaria'],
    loading: 'Caricamento archivio misure…',
    loadError: 'Archivio misure non disponibile ora. La verifica continua solo con profilo e foto.',
    noName: 'Cane Corso senza nome',
    evidence: 'Diagramma confronto standard',
    signals: 'Dettaglio per evidenze',
    proportions: 'Diagrammi orientati allo standard',
    photoModel: 'Stato confronto foto',
    photoModelBody:
      'Il riconoscimento da foto è preparato come livello futuro. Oggi la piattaforma verifica se le foto possono supportare il confronto con il modello standard, non se l’immagine prova la razza.',
    nextTitle: 'Prossima evidenza migliore',
    boundaryTitle: 'Confine di fiducia',
    boundaryBody:
      'Il risultato è solo orientamento preliminare di corrispondenza allo standard. Revisione USG finale, pubblicazione Registro e Certificato restano decisioni umane.',
    qualification: {
      insufficient: 'Dati insufficienti / orientamento debole',
      partial: 'Corrispondenza parziale allo standard',
      good: 'Buona corrispondenza iniziale',
      strong: 'Forte corrispondenza — serve revisione umana',
      very_strong: 'Corrispondenza molto forte — conferma umana necessaria',
    },
    confidenceValues: {
      low: 'bassa',
      medium: 'media',
      high: 'alta',
    },
    flow: ['Centro', 'Foto', 'Standard Match', 'Revisione USG', 'Registro/Certificato'],
    signalLabels: {
      profile: 'Dati profilo',
      photos: 'Evidenza foto',
      measurements: 'Archivio misure',
      standard: 'Orientamento Standard Match',
      pedigree: 'Contesto familiare',
      human_review: 'Revisione umana',
    },
    signalDescriptions: {
      profile: 'Nome, sesso, data di nascita, colore, luogo e descrizione proprietario.',
      photos: 'Immagine principale più galleria proprietario per contesto visivo.',
      measurements: 'Peso, altezza e proporzioni salvate per data.',
      standard: 'Usa il motore FCI conformity già presente come modello misurabile di confronto standard.',
      pedigree: 'Linea familiare nota e foto antenati quando disponibili.',
      human_review: 'Tiene le decisioni ufficiali separate dal punteggio automatico.',
    },
    values: {
      profileReady: 'campi profilo pronti',
      photoCount: 'foto',
      measurementCount: 'record misure',
      fciScore: 'punteggio corrispondenza standard',
      pedigreeCount: 'campi pedigree',
      locked: 'bloccato',
    },
    diagramLabels: {
      body: 'Lunghezza corpo ≈ altezza + 11%',
      head: 'Lunghezza testa ≈ 36% altezza',
      muzzle: 'Muso / cranio ≈ 1:2',
    },
    nextActions: {
      photos: 'Aggiungi foto laterale in posa, frontale e testa.',
      measurements: 'Salva peso, altezza, lunghezza corpo e testa con data.',
      profile: 'Completa nascita, sesso, colore, luogo e descrizione.',
      pedigree: 'Aggiungi genitori/antenati se conosciuti, con foto quando possibile.',
      review: 'Invia a revisione USG quando le evidenze sono abbastanza chiare.',
    },
  },
} as const;

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function latestRecord(records: DogMeasurementRecord[]) {
  if (!records.length) return null;
  return [...records].sort((a, b) => b.measuredAt.localeCompare(a.measuredAt))[0] ?? null;
}

function countMeasurementFields(record: DogMeasurementRecord | null) {
  if (!record) return 0;
  return [
    record.weightKg,
    record.heightWithersCm,
    record.bodyLengthCm,
    record.chestCircumferenceCm,
    record.headLengthCm,
    record.muzzleLengthCm,
    record.skullLengthCm,
  ].filter((value) => typeof value === 'number' && Number.isFinite(value) && value > 0).length;
}

function getQualification(score: number): AuthenticityQualificationKey {
  if (score >= 90) return 'very_strong';
  if (score >= 75) return 'strong';
  if (score >= 60) return 'good';
  if (score >= 40) return 'partial';
  return 'insufficient';
}

function getConfidence(signalCount: number, measurementCount: number, score: number): AuthenticityConfidenceKey {
  if (signalCount >= 5 && measurementCount >= 2 && score >= 70) return 'high';
  if (signalCount >= 3 && score >= 45) return 'medium';
  return 'low';
}

function getPhotoReadinessBand(photoCount: number): AuthenticityReadinessBand {
  if (photoCount >= 3) return 'ready';
  if (photoCount === 2) return 'almost_ready';
  if (photoCount === 1) return 'partial';
  return 'not_ready';
}

function getReviewReadinessBand({
  profileScore,
  photoScore,
  measurementScore,
  standardScore,
  lifecycleStatus,
  hasPublication,
}: {
  profileScore: number;
  photoScore: number;
  measurementScore: number;
  standardScore: number;
  lifecycleStatus: DogLifecycleStatus;
  hasPublication: boolean;
}): AuthenticityReadinessBand {
  const reviewStarted = hasPublication || ['submitted', 'approved', 'published'].includes(lifecycleStatus);
  if (reviewStarted && profileScore >= 70 && photoScore >= 74 && standardScore >= 45) return 'ready';
  if (profileScore >= 70 && photoScore >= 74 && (measurementScore >= 40 || standardScore >= 45)) return 'almost_ready';
  if (profileScore >= 45 || photoScore >= 46 || measurementScore >= 30) return 'partial';
  return 'not_ready';
}

function getNextActionKey(signals: AuthenticitySignal[]): NextAuthenticityActionKey {
  const weakest = [...signals].sort((a, b) => a.score - b.score)[0];
  if (!weakest) return 'review';

  switch (weakest.key) {
    case 'profile':
    case 'photos':
    case 'measurements':
    case 'pedigree':
      return weakest.key;
    case 'standard':
      return 'measurements';
    case 'human_review':
    default:
      return 'review';
  }
}

function formatPercent(score: number) {
  return `${clampScore(score)}%`;
}

function ScoreGauge({ score, label, qualification }: { score: number; label: string; qualification: string }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const dash = (clampScore(score) / 100) * circumference;

  return (
    <div className="authenticity-check__gauge" aria-label={`${label}: ${formatPercent(score)}`}>
      <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
        <circle className="authenticity-check__gauge-track" cx="60" cy="60" r={radius} />
        <circle
          className="authenticity-check__gauge-value"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div>
        <span>{label}</span>
        <strong>{formatPercent(score)}</strong>
        <small>{qualification}</small>
      </div>
    </div>
  );
}

function SignalBar({ signal }: { signal: AuthenticitySignal }) {
  return (
    <article className={`authenticity-check-signal authenticity-check-signal--${signal.key}`}>
      <div className="authenticity-check-signal__head">
        <div>
          <strong>{signal.label}</strong>
          <p>{signal.description}</p>
        </div>
        <span>{formatPercent(signal.score)}</span>
      </div>
      <div className="authenticity-check-signal__bar" aria-hidden="true">
        <span style={{ width: `${clampScore(signal.score)}%` }} />
      </div>
      <small>{signal.value}</small>
    </article>
  );
}

export function UsgAuthenticityCheckPanel({
  locale,
  dogId,
  dogName,
  sex,
  dateOfBirth,
  color,
  city,
  country,
  shortDescription,
  mainImageUrl,
  galleryImageCount,
  pedigreeFilledCount,
  pedigreePhotoCount,
  lifecycleStatus,
  hasPublication,
  hasCertificate,
}: UsgAuthenticityCheckPanelProps) {
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
  const fciDocument = useMemo(() => buildFciStandardConformityDocument({
    dogId,
    dogName,
    sex,
    dateOfBirth,
    color,
    latestMeasurement,
  }), [dogId, dogName, sex, dateOfBirth, color, latestMeasurement]);

  const signalDocument = useMemo(() => {
    const profileFields = [dogName, sex !== 'unknown' ? sex : null, dateOfBirth, color, city, country, shortDescription].filter((value) => typeof value === 'string' && value.trim()).length;
    const profileScore = clampScore((profileFields / 7) * 100);
    const photoCount = Math.max(galleryImageCount, mainImageUrl ? 1 : 0);
    const photoScore = clampScore(photoCount === 0 ? 0 : photoCount === 1 ? 46 : photoCount === 2 ? 74 : 94);
    const measurementFieldCount = countMeasurementFields(latestMeasurement);
    const measurementScore = clampScore(Math.min(64, records.length * 18) + Math.min(36, measurementFieldCount * 6));
    const standardScore = clampScore(fciDocument.scores.measurable || fciDocument.scores.overall);
    const pedigreeScore = clampScore(Math.min(70, pedigreeFilledCount * 5) + Math.min(30, pedigreePhotoCount * 5));
    const reviewScore = clampScore((hasPublication ? 65 : 35) + (hasCertificate ? 20 : 0) + (['submitted', 'approved', 'published'].includes(lifecycleStatus) ? 15 : 0));
    const photoReadinessBand = getPhotoReadinessBand(photoCount);
    const reviewReadinessBand = getReviewReadinessBand({
      profileScore,
      photoScore,
      measurementScore,
      standardScore,
      lifecycleStatus,
      hasPublication,
    });

    const signals: AuthenticitySignal[] = [
      {
        key: 'profile',
        label: copy.signalLabels.profile,
        value: `${profileFields}/7 ${copy.values.profileReady}`,
        description: copy.signalDescriptions.profile,
        score: profileScore,
      },
      {
        key: 'photos',
        label: copy.signalLabels.photos,
        value: `${photoCount}/3 ${copy.values.photoCount}`,
        description: copy.signalDescriptions.photos,
        score: photoScore,
      },
      {
        key: 'measurements',
        label: copy.signalLabels.measurements,
        value: `${records.length} ${copy.values.measurementCount}`,
        description: copy.signalDescriptions.measurements,
        score: measurementScore,
      },
      {
        key: 'standard',
        label: copy.signalLabels.standard,
        value: `${formatPercent(standardScore)} ${copy.values.fciScore}`,
        description: copy.signalDescriptions.standard,
        score: standardScore,
      },
      {
        key: 'pedigree',
        label: copy.signalLabels.pedigree,
        value: `${pedigreeFilledCount}/14 ${copy.values.pedigreeCount}`,
        description: copy.signalDescriptions.pedigree,
        score: pedigreeScore,
      },
      {
        key: 'human_review',
        label: copy.signalLabels.human_review,
        value: copy.values.locked,
        description: copy.signalDescriptions.human_review,
        score: reviewScore,
      },
    ];

    const overall = clampScore(
      profileScore * 0.18 +
      photoScore * 0.18 +
      measurementScore * 0.18 +
      standardScore * 0.28 +
      pedigreeScore * 0.10 +
      reviewScore * 0.08,
    );
    const usefulSignals = signals.filter((signal) => signal.score >= 45).length;
    const confidence = getConfidence(usefulSignals, records.length, overall);

    const qualification = getQualification(overall);
    const mlSafeLabels: MlSafeLabel[] = [
      {
        key: 'photo_quality',
        label: copy.mlLabels.photo_quality,
        value: copy.readinessValues[photoReadinessBand],
        description: copy.mlDescriptions.photo_quality,
      },
      {
        key: 'pose_readiness',
        label: copy.mlLabels.pose_readiness,
        value: copy.readinessValues[photoReadinessBand],
        description: copy.mlDescriptions.pose_readiness,
      },
      {
        key: 'standard_signal',
        label: copy.mlLabels.standard_signal,
        value: copy.qualification[qualification],
        description: copy.mlDescriptions.standard_signal,
      },
      {
        key: 'review_readiness',
        label: copy.mlLabels.review_readiness,
        value: copy.readinessValues[reviewReadinessBand],
        description: copy.mlDescriptions.review_readiness,
      },
    ];

    return {
      signals,
      overall,
      confidence,
      qualification,
      nextActionKey: getNextActionKey(signals),
      photoReadinessBand,
      reviewReadinessBand,
      mlSafeLabels,
    };
  }, [city, color, copy, country, dateOfBirth, dogName, fciDocument.scores.measurable, fciDocument.scores.overall, galleryImageCount, hasCertificate, hasPublication, lifecycleStatus, latestMeasurement, mainImageUrl, pedigreeFilledCount, pedigreePhotoCount, records.length, sex]);

  const displayName = dogName?.trim() || copy.noName;

  return (
    <section className="content-card authenticity-check-panel" id="usg-authenticity-check" aria-label={copy.title}>
      <div className="authenticity-check-panel__header">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="authenticity-check-panel__mark" aria-hidden="true">USG</div>
      </div>

      <div className="authenticity-check-panel__hero">
        <ScoreGauge
          score={signalDocument.overall}
          label={copy.score}
          qualification={copy.qualification[signalDocument.qualification]}
        />
        <div className="authenticity-check-panel__summary">
          <strong>{displayName}</strong>
          <span>{copy.confidence}: {copy.confidenceValues[signalDocument.confidence]}</span>
          <span className="authenticity-check-panel__bonus-badge">{copy.bonusBadge}</span>
          <p>{copy.buttonContext}</p>
          <small><strong>{copy.resultMeaningTitle}:</strong> {copy.resultMeaningBody}</small>
          {loading ? <small>{copy.loading}</small> : null}
          {!loading && loadError ? <small>{copy.loadError}</small> : null}
        </div>
      </div>

      <div className="authenticity-check-flow" aria-label={copy.evidence}>
        {copy.flow.map((item, index) => (
          <div className="authenticity-check-flow__node" key={item}>
            <span>{index + 1}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>

      <div className="authenticity-check-foundation-strip" aria-label={copy.dataFoundationTitle}>
        {Object.values(copy.dataLayers).map((layer) => (
          <article className="authenticity-check-foundation-card" key={layer.title}>
            <span>{layer.label}</span>
            <strong>{layer.title}</strong>
            <p>{layer.body}</p>
          </article>
        ))}
      </div>

      <div className="authenticity-check-panel__grid">
        <section className="authenticity-check-panel__signals" aria-label={copy.signals}>
          <div className="authenticity-check-panel__section-head">
            <span className="eyebrow-label">{copy.signals}</span>
          </div>
          {signalDocument.signals.map((signal) => <SignalBar signal={signal} key={signal.key} />)}
        </section>

        <aside className="authenticity-check-panel__side">
          <section className="authenticity-check-mini-card">
            <span className="eyebrow-label">{copy.proportions}</span>
            <div className="authenticity-check-proportions">
              <div><span>111%</span><strong>{copy.diagramLabels.body}</strong></div>
              <div><span>36%</span><strong>{copy.diagramLabels.head}</strong></div>
              <div><span>1:2</span><strong>{copy.diagramLabels.muzzle}</strong></div>
            </div>
          </section>

          <section className="authenticity-check-mini-card">
            <span className="eyebrow-label">{copy.photoModel}</span>
            <p>{copy.photoModelBody}</p>
          </section>

          <section className="authenticity-check-mini-card authenticity-check-mini-card--ml-safe">
            <span className="eyebrow-label">{copy.mlSafeTitle}</span>
            <p>{copy.mlSafeBody}</p>
            <div className="authenticity-check-ml-labels">
              {signalDocument.mlSafeLabels.map((label) => (
                <div className="authenticity-check-ml-label" key={label.key}>
                  <span>{label.label}</span>
                  <strong>{label.value}</strong>
                  <small>{label.description}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="authenticity-check-mini-card authenticity-check-mini-card--score-guide">
            <span className="eyebrow-label">{copy.scoreGuideTitle}</span>
            <ul>
              {copy.scoreGuideItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="authenticity-check-mini-card authenticity-check-mini-card--gold">
            <span className="eyebrow-label">{copy.nextTitle}</span>
            <p>{copy.nextActions[signalDocument.nextActionKey]}</p>
          </section>

          <section className="authenticity-check-mini-card authenticity-check-mini-card--authority">
            <span className="eyebrow-label">{copy.authorityTitle}</span>
            <p>{copy.authorityBody}</p>
          </section>

          <section className="authenticity-check-mini-card authenticity-check-mini-card--boundary">
            <span className="eyebrow-label">{copy.boundaryTitle}</span>
            <p>{copy.boundaryBody}</p>
          </section>
        </aside>
      </div>
    </section>
  );
}
