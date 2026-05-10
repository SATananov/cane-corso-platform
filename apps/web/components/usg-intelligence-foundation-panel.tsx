import type {
  UsgIntelligenceActionKey,
  UsgIntelligenceBoundaryKey,
  UsgIntelligenceEvidenceKey,
  UsgIntelligenceSignalKey,
  UsgIntelligenceSignalStatus,
} from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import {
  buildUsgIntelligenceDocument,
  type UsgIntelligenceProfileInput,
} from '@/lib/usg-intelligence';

interface UsgIntelligenceFoundationPanelProps extends UsgIntelligenceProfileInput {
  locale: Locale;
}

const copyByLocale = {
  en: {
    eyebrow: 'USG Intelligence foundation',
    title: 'Smart orientation from the profile data',
    description:
      'This layer prepares the platform for future regression and data-assisted orientation. Today it reads the available profile, photos, pedigree context and measurement archive as guidance only.',
    scores: {
      dataCompleteness: 'Data completeness',
      growthEvidence: 'Growth evidence',
      reviewPreparation: 'Review preparation',
    },
    status: {
      missing_data: 'Needs data',
      collecting_data: 'Collecting evidence',
      ready_for_orientation: 'Ready for orientation',
      human_review_required: 'Human review required',
      boundary_locked: 'Trust boundary locked',
    },
    confidence: {
      low: 'low confidence',
      medium: 'medium confidence',
      high: 'high confidence',
    },
    signals: {
      profile_readiness: ['Profile readiness', 'Checks whether the basic owner profile is structured enough for meaningful guidance.'],
      growth_orientation: ['Growth orientation', 'Uses age and measurement archive readiness as the safest first regression-ready direction.'],
      future_regression: ['Future regression readiness', 'Keeps the dataset prepared for a future model without pretending a trained model exists today.'],
      phenotype_observation: ['Phenotype observation', 'Supports USG observational notes, including country/type context, but never replaces a standard or expert review.'],
      admin_review_support: ['Admin review support', 'Summarizes what can help the admin review while leaving all Registry and Certificate decisions human-controlled.'],
    },
    evidence: {
      identity_present: 'identity present',
      birth_date_present: 'birth date present',
      color_present: 'color present',
      location_present: 'location context present',
      description_present: 'owner description present',
      photos_present: 'photo context present',
      pedigree_context_present: 'pedigree context present',
      measurement_archive_available: 'measurement archive available',
      measurement_series_needed: 'measurement series needed',
      authority_boundary_locked: 'authority boundary locked',
      regression_not_trained_yet: 'no trained model yet',
      human_review_required: 'human review remains required',
    },
    actions: {
      complete_profile: 'Complete the core profile before relying on the orientation.',
      add_three_photos: 'Add clear profile photos so visual context is not based on one weak signal.',
      add_measurements: 'Save at least two dated measurements to make growth trend orientation stronger.',
      add_pedigree_context: 'Add family context when available; even partial lineage helps the review.',
      keep_human_review: 'Use this as preparation only; official USG decisions stay with admin review.',
      keep_observational: 'Keep phenotype notes observational and separate from official FCI/USG authority.',
    },
    boundariesTitle: 'Important trust boundaries',
    boundaries: {
      not_certificate: 'This is not a USG certificate.',
      not_breed_proof: 'This does not prove breed identity, pedigree, or bloodline.',
      not_veterinary_diagnosis: 'This is not a veterinary diagnosis or health prediction.',
      not_automatic_admin_decision: 'This never approves Registry, Gallery, Verify, or Certificate automatically.',
    },
  },
  bg: {
    eyebrow: 'USG интелигентен анализ',
    title: 'Умен ориентир от данните в профила',
    description:
      'Този слой подготвя платформата за бъдеща регресия и интелигентен ориентир от данните. Днес той чете наличния профил, снимки, родословен контекст и архив с измервания само като насока.',
    scores: {
      dataCompleteness: 'Пълнота на данните',
      growthEvidence: 'Данни за растеж',
      reviewPreparation: 'Подготовка за преглед',
    },
    status: {
      missing_data: 'Нужни са данни',
      collecting_data: 'Събира се контекст',
      ready_for_orientation: 'Готово за ориентир',
      human_review_required: 'Нужен е човешки преглед',
      boundary_locked: 'Границата на доверие е заключена',
    },
    confidence: {
      low: 'ниска увереност',
      medium: 'средна увереност',
      high: 'висока увереност',
    },
    signals: {
      profile_readiness: ['Готовност на профила', 'Проверява дали основният профил е достатъчно подреден за смислен ориентир.'],
      growth_orientation: ['Ориентир за растеж', 'Използва възрастта и готовността на архива с измервания като най-безопасна първа посока за бъдеща регресия.'],
      future_regression: ['Готовност за бъдеща регресия', 'Подготвя данните за бъдещ модел, без да твърди, че днес има обучен модел.'],
      phenotype_observation: ['Фенотипно наблюдение', 'Подкрепя USG наблюдателни бележки, включително държава/тип контекст, но не заменя стандарт или експертен преглед.'],
      admin_review_support: ['Помощ за админ преглед', 'Обобщава какво може да помогне на администратора, като решенията за Регистър и Сертификат остават човешки.'],
    },
    evidence: {
      identity_present: 'има идентичност',
      birth_date_present: 'има дата на раждане',
      color_present: 'има цвят',
      location_present: 'има контекст по място',
      description_present: 'има описание от собственика',
      photos_present: 'има снимков контекст',
      pedigree_context_present: 'има родословен контекст',
      measurement_archive_available: 'архивът с измервания е наличен',
      measurement_series_needed: 'нужна е серия от измервания',
      authority_boundary_locked: 'границата на доверие е заключена',
      regression_not_trained_yet: 'още няма обучен модел',
      human_review_required: 'човешкият преглед остава задължителен',
    },
    actions: {
      complete_profile: 'Довърши основния профил, преди да разчиташ на ориентира.',
      add_three_photos: 'Добави ясни снимки, за да не се разчита на един слаб визуален сигнал.',
      add_measurements: 'Запази поне две измервания по дата, за да стане ориентирът за растеж по-силен.',
      add_pedigree_context: 'Добави семейна информация, когато я имаш; дори частичната линия помага при преглед.',
      keep_human_review: 'Използвай това само за подготовка; официалните USG решения остават чрез админ преглед.',
      keep_observational: 'Дръж фенотипните бележки като наблюдение, отделно от официалния FCI/USG авторитет.',
    },
    boundariesTitle: 'Важни граници на доверие',
    boundaries: {
      not_certificate: 'Това не е USG сертификат.',
      not_breed_proof: 'Това не доказва порода, родословие или кръвна линия.',
      not_veterinary_diagnosis: 'Това не е ветеринарна диагноза или здравна прогноза.',
      not_automatic_admin_decision: 'Това никога не одобрява автоматично Регистър, Галерия, Проверка или Сертификат.',
    },
  },
  it: {
    eyebrow: 'Analisi intelligente USG',
    title: 'Orientamento intelligente dai dati del profilo',
    description:
      'Questo livello prepara la piattaforma per futura regressione e orientamento assistito dai dati. Oggi legge profilo, foto, contesto pedigree e archivio misure solo come guida.',
    scores: {
      dataCompleteness: 'Completezza dati',
      growthEvidence: 'Evidenza crescita',
      reviewPreparation: 'Preparazione revisione',
    },
    status: {
      missing_data: 'Servono dati',
      collecting_data: 'Raccolta contesto',
      ready_for_orientation: 'Pronto per orientamento',
      human_review_required: 'Revisione umana richiesta',
      boundary_locked: 'Confine di fiducia bloccato',
    },
    confidence: {
      low: 'bassa affidabilita',
      medium: 'affidabilita media',
      high: 'alta affidabilita',
    },
    signals: {
      profile_readiness: ['Prontezza profilo', 'Controlla se il profilo base è abbastanza ordinato per un orientamento utile.'],
      growth_orientation: ['Orientamento crescita', 'Usa età e archivio misure come prima direzione sicura per futura regressione.'],
      future_regression: ['Prontezza per regressione futura', 'Prepara i dati per un futuro modello senza dichiarare che oggi esista un modello addestrato.'],
      phenotype_observation: ['Osservazione fenotipica', 'Supporta note osservative USG, incluso contesto paese/tipo, senza sostituire standard o revisione esperta.'],
      admin_review_support: ['Supporto revisione admin', 'Riassume ciò che aiuta la revisione admin mentre Registro e Certificato restano decisioni umane.'],
    },
    evidence: {
      identity_present: 'identità presente',
      birth_date_present: 'data di nascita presente',
      color_present: 'colore presente',
      location_present: 'contesto luogo presente',
      description_present: 'descrizione proprietario presente',
      photos_present: 'contesto foto presente',
      pedigree_context_present: 'contesto pedigree presente',
      measurement_archive_available: 'archivio misure disponibile',
      measurement_series_needed: 'serve una serie di misure',
      authority_boundary_locked: 'confine autorità bloccato',
      regression_not_trained_yet: 'nessun modello addestrato ancora',
      human_review_required: 'revisione umana resta richiesta',
    },
    actions: {
      complete_profile: 'Completa il profilo base prima di fare affidamento sull’orientamento.',
      add_three_photos: 'Aggiungi foto chiare così il contesto visivo non dipende da un segnale debole.',
      add_measurements: 'Salva almeno due misure datate per rendere più forte il trend di crescita.',
      add_pedigree_context: 'Aggiungi contesto familiare quando disponibile; anche una linea parziale aiuta.',
      keep_human_review: 'Usalo solo come preparazione; le decisioni ufficiali USG restano alla revisione admin.',
      keep_observational: 'Mantieni le note fenotipiche come osservazione separata dall’autorità FCI/USG.',
    },
    boundariesTitle: 'Confini di fiducia importanti',
    boundaries: {
      not_certificate: 'Questo non è un certificato USG.',
      not_breed_proof: 'Questo non prova identità di razza, pedigree o linea di sangue.',
      not_veterinary_diagnosis: 'Questo non è diagnosi veterinaria o previsione sanitaria.',
      not_automatic_admin_decision: 'Questo non approva mai automaticamente Registro, Galleria, Verifica o Certificato.',
    },
  },
} as const;

function scoreClass(score: number) {
  if (score >= 80) return 'is-strong';
  if (score >= 50) return 'is-watch';
  return 'is-low';
}

function signalStatusClass(status: UsgIntelligenceSignalStatus) {
  return `usg-intelligence-signal usg-intelligence-signal--${status}`;
}

export function UsgIntelligenceFoundationPanel({ locale, ...input }: UsgIntelligenceFoundationPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const document = buildUsgIntelligenceDocument(input);
  const scoreEntries = [
    ['dataCompleteness', document.scores.dataCompleteness],
    ['growthEvidence', document.scores.growthEvidence],
    ['reviewPreparation', document.scores.reviewPreparation],
  ] as const;

  return (
    <section className="content-card usg-intelligence-panel" aria-label={copy.title}>
      <div className="usg-intelligence-panel__header">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="usg-intelligence-panel__mark" aria-hidden="true">USG</div>
      </div>

      <div className="usg-intelligence-panel__scores">
        {scoreEntries.map(([key, value]) => (
          <div className={scoreClass(value)} key={key}>
            <span>{copy.scores[key]}</span>
            <strong>{value}%</strong>
          </div>
        ))}
      </div>

      <div className="usg-intelligence-panel__signals">
        {document.signals.map((signal) => {
          const [title, description] = copy.signals[signal.key as UsgIntelligenceSignalKey];
          return (
            <article className={signalStatusClass(signal.status)} key={signal.key}>
              <div className="usg-intelligence-signal__head">
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
                <span>{signal.score}%</span>
              </div>
              <div className="usg-intelligence-signal__meta">
                <span>{copy.status[signal.status]}</span>
                <span>{copy.confidence[signal.confidence]}</span>
              </div>
              <div className="usg-intelligence-signal__evidence">
                {signal.evidenceKeys.map((key: UsgIntelligenceEvidenceKey) => (
                  <span key={`${signal.key}-${key}`}>{copy.evidence[key]}</span>
                ))}
              </div>
              <p className="usg-intelligence-signal__action">{copy.actions[signal.actionKey as UsgIntelligenceActionKey]}</p>
            </article>
          );
        })}
      </div>

      <div className="usg-intelligence-panel__boundaries">
        <strong>{copy.boundariesTitle}</strong>
        <ul>
          {document.boundaryKeys.map((key: UsgIntelligenceBoundaryKey) => <li key={key}>{copy.boundaries[key]}</li>)}
        </ul>
      </div>
    </section>
  );
}
