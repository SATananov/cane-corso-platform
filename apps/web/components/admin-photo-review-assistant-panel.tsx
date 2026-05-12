// Step 121 — Admin Photo Review Assistant & Human Labels Foundation
// Step 122 — Authenticity Dataset Preparation Guardrails
// Step 123 — ML-safe Photo Assistant Prototype

import type { Locale } from '@/lib/i18n';
import { buildUsgPhotoAssistantSuggestion } from '@/lib/usg-photo-review-assistant';
import type { UsgAdminPhotoQuality, UsgAdminPhotoView, UsgAssistantConfidence, UsgHumanPhotoLabel } from '@/lib/usg-photo-review-assistant';

// QA marker for safe stored learning fields: dog_id, media_id, expected_view, assistant_quality, assistant_confidence, admin_final_label, dataset_use, review_status.

interface AdminPhotoReviewMediaItem {
  id: string;
  url?: string | null;
  altText?: string | null;
  isPrimary?: boolean;
  isVisibleInRegistry?: boolean;
  isVisibleInUsgGallery?: boolean;
}

interface AdminPhotoReviewAssistantPanelProps {
  locale: Locale;
  dogName: string;
  media: AdminPhotoReviewMediaItem[];
}

const copyByLocale = {
  en: {
    eyebrow: 'Photo review assistant',
    title: 'Photo guidance with final human decision',
    description:
      'This panel helps the reviewer judge whether owner photos are good, usable, poor, from the wrong angle, or missing an important view. The assistant can suggest photo readiness, but the human label remains the source of truth.',
    noBreedProof: 'No AI or ML result here proves breed, pedigree, Registry approval, or Certificate eligibility.',
    assistant: 'Assistant suggestion',
    confidence: 'Confidence',
    human: 'Final human label',
    dataset: 'Learning use',
    boundaryTitle: 'Human decision boundary',
    boundaryBody:
      'Store the assistant suggestion and the human label separately. Future ML learns from reviewer corrections; it never receives a “true breed” proof label.',
    exportTitle: 'Learning data preparation',
    exportBody:
      'Safe future learning keeps photo view, assistant quality, confidence, final human label, learning use, and review status separate. Personal owner data is excluded from learning exports.',
    prototypeTitle: 'Review support scope',
    prototypeBody:
      'The current assistant is deterministic and review support only. A future model may help with blur, lighting, dog visibility, full-body framing, side/front/head view and wrong angle detection.',
    views: {
      side: 'side standing view',
      front: 'front standing view',
      head: 'head detail view',
      unknown: 'extra/unknown view',
    },
    quality: {
      good: 'good candidate',
      usable: 'usable with review',
      needs_better_photo: 'needs better photo',
      missing: 'missing',
    },
    labels: {
      good: 'good',
      usable: 'usable',
      poor: 'poor',
      wrong_angle: 'wrong angle',
      missing_view: 'missing view',
    },
    confidenceValues: {
      low: 'low',
      medium: 'medium',
      high: 'high',
    },
    datasetUse: {
      training_candidate: 'learning candidate after human confirmation',
      review_only: 'review only',
      needs_admin_label: 'needs human label',
    },
    reasons: {
      main_side_candidate: 'Likely the strongest side/profile candidate. The reviewer still confirms view and quality.',
      front_candidate: 'May support front structure review if chest, legs and head are clear.',
      head_candidate: 'May support head and muzzle proportion orientation if sharp enough.',
      missing_set: 'Expected view is missing or cannot be used yet.',
      unclear_extra: 'Extra photo needs human judgment before any learning use.',
    },
    rowsTitle: 'Photo labels',
    photoFallback: 'Photo',
  },
  bg: {
    eyebrow: 'Асистент за снимки',
    title: 'Насока за снимки с финално човешко решение',
    description:
      'Този панел помага при прегледа дали снимките от собственика са добри, използваеми, слаби, от грешен ъгъл или липсва важен изглед. Асистентът може да предложи готовност на снимка, но крайният човешки етикет остава водещ.',
    noBreedProof: 'Тук няма AI/ML резултат, който доказва порода, родословие, одобрение за Регистър или право на Сертификат.',
    assistant: 'Сигнал от асистента',
    confidence: 'Увереност',
    human: 'Краен човешки етикет',
    dataset: 'Използване за обучение',
    boundaryTitle: 'Граница на човешкото решение',
    boundaryBody:
      'Пази се отделно какво предлага асистентът и какво маркира човекът при преглед. Бъдещият ML учи от човешки корекции; никога не получава етикет “доказана порода”.',
    exportTitle: 'Подготовка на обучителни данни',
    exportBody:
      'Безопасното бъдещо обучение пази отделно изгледа на снимката, качеството от асистента, увереността, крайния човешки етикет, употребата за обучение и статуса на прегледа. Личните данни на собственика не влизат в обучителен експорт.',
    prototypeTitle: 'Обхват на помощника',
    prototypeBody:
      'Сегашният асистент е детерминиран и служи само като помощ при преглед. Бъдещ модел може да помага за размазване, светлина, видимост на кучето, цял кадър, страничен/преден/детайл глава изглед и грешен ъгъл.',
    views: {
      side: 'странична стойка',
      front: 'фронтална стойка',
      head: 'детайл на глава',
      unknown: 'допълнителен/неясен изглед',
    },
    quality: {
      good: 'добър кандидат',
      usable: 'използваема с преглед',
      needs_better_photo: 'иска по-добра снимка',
      missing: 'липсва',
    },
    labels: {
      good: 'добра',
      usable: 'използваема',
      poor: 'слаба',
      wrong_angle: 'грешен ъгъл',
      missing_view: 'липсващ изглед',
    },
    confidenceValues: {
      low: 'ниска',
      medium: 'средна',
      high: 'висока',
    },
    datasetUse: {
      training_candidate: 'кандидат за обучение след човешко потвърждение',
      review_only: 'само за преглед',
      needs_admin_label: 'чака човешки етикет',
    },
    reasons: {
      main_side_candidate: 'Вероятно най-силният страничен кандидат. Човекът пак потвърждава изглед и качество.',
      front_candidate: 'Може да помогне за преглед на предна структура, ако гърди, крайници и глава са ясни.',
      head_candidate: 'Може да помогне за ориентация на глава и муцуна, ако е достатъчно ясна.',
      missing_set: 'Очакваният изглед липсва или още не може да се използва.',
      unclear_extra: 'Допълнителна снимка, която иска човешка преценка преди употреба за обучение.',
    },
    rowsTitle: 'Етикети на снимките',
    photoFallback: 'Снимка',
  },
  it: {
    eyebrow: 'Assistente revisione foto',
    title: 'Segnale assistente + etichetta umana',
    description:
      'Questo pannello aiuta il revisore a valutare se le foto del proprietario sono buone, utilizzabili, deboli, con angolo errato o con vista mancante. L’assistente può suggerire prontezza foto, ma l’etichetta umana finale resta la fonte di verità.',
    noBreedProof: 'Nessun risultato AI/ML qui prova razza, pedigree, approvazione Registro o idoneità Certificato.',
    assistant: 'Suggerimento assistente',
    confidence: 'Affidabilità',
    human: 'Etichetta umana finale',
    dataset: 'Uso per apprendimento',
    boundaryTitle: 'Confine della decisione umana',
    boundaryBody:
      'Il suggerimento dell’assistente e l’etichetta umana restano separati. Il futuro ML impara dalle correzioni del revisore; non riceve mai un’etichetta di “razza provata”.',
    exportTitle: 'Preparazione dati di apprendimento',
    exportBody:
      'L’apprendimento futuro sicuro mantiene separati vista foto, qualità suggerita, affidabilità, etichetta umana finale, uso per apprendimento e stato revisione. I dati personali del proprietario sono esclusi dagli export di apprendimento.',
    prototypeTitle: 'Ambito dell’assistente',
    prototypeBody:
      'L’assistente attuale è deterministico e serve solo come supporto alla revisione. Un modello futuro potrà aiutare su sfocatura, luce, visibilità del cane, corpo intero, viste laterale/frontale/dettaglio testa e angolo errato.',
    views: {
      side: 'vista laterale in posa',
      front: 'vista frontale in posa',
      head: 'dettaglio testa',
      unknown: 'vista extra/non chiara',
    },
    quality: {
      good: 'buon candidato',
      usable: 'utilizzabile con revisione',
      needs_better_photo: 'serve foto migliore',
      missing: 'mancante',
    },
    labels: {
      good: 'buona',
      usable: 'utilizzabile',
      poor: 'debole',
      wrong_angle: 'angolo errato',
      missing_view: 'vista mancante',
    },
    confidenceValues: {
      low: 'bassa',
      medium: 'media',
      high: 'alta',
    },
    datasetUse: {
      training_candidate: 'candidato apprendimento dopo conferma umana',
      review_only: 'solo revisione',
      needs_admin_label: 'richiede etichetta umana',
    },
    reasons: {
      main_side_candidate: 'Probabile candidato laterale più forte. Il revisore conferma comunque vista e qualità.',
      front_candidate: 'Può supportare revisione frontale se petto, arti e testa sono chiari.',
      head_candidate: 'Può supportare orientamento testa/muso se abbastanza nitida.',
      missing_set: 'La vista prevista manca o non è ancora utilizzabile.',
      unclear_extra: 'Foto extra che richiede giudizio umano prima dell’uso per apprendimento.',
    },
    rowsTitle: 'Etichette foto',
    photoFallback: 'Foto',
  },
} as const;

function getToneClass(quality: UsgAdminPhotoQuality) {
  if (quality === 'good') return 'is-good';
  if (quality === 'usable') return 'is-usable';
  return 'is-needs-work';
}

export function AdminPhotoReviewAssistantPanel({ locale, dogName, media }: AdminPhotoReviewAssistantPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const expectedRows = Array.from({ length: Math.max(3, media.length) }, (_, index) => {
    const item = media[index];
    const suggestion = buildUsgPhotoAssistantSuggestion({
      index,
      totalCount: media.length,
      isPrimary: item?.isPrimary,
      isVisibleInRegistry: item?.isVisibleInRegistry,
      isVisibleInUsgGallery: item?.isVisibleInUsgGallery,
      hasUrl: Boolean(item?.url),
    });
    return { item, index, suggestion };
  });

  return (
    <section className="admin-photo-review-assistant" aria-label={copy.title}>
      <div className="admin-photo-review-assistant__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h4>{copy.title}</h4>
          <p>{copy.description}</p>
        </div>
        <strong>{copy.rowsTitle}</strong>
      </div>

      <p className="admin-photo-review-assistant__warning">{copy.noBreedProof}</p>

      <div className="admin-photo-review-assistant__rows">
        {expectedRows.map(({ item, index, suggestion }) => (
          <article className={`admin-photo-review-assistant__row ${getToneClass(suggestion.assistantQuality)}`} key={item?.id ?? `expected-${index}`}>
            <div>
              <span>{copy.photoFallback} {index + 1}</span>
              <strong>{copy.views[suggestion.expectedView as UsgAdminPhotoView]}</strong>
              <p>{copy.reasons[suggestion.reasonKey]}</p>
            </div>
            <dl>
              <div>
                <dt>{copy.assistant}</dt>
                <dd>{copy.quality[suggestion.assistantQuality]}</dd>
              </div>
              <div>
                <dt>{copy.confidence}</dt>
                <dd>{copy.confidenceValues[suggestion.assistantConfidence as UsgAssistantConfidence]}</dd>
              </div>
              <div>
                <dt>{copy.human}</dt>
                <dd>{copy.labels[suggestion.humanLabel as UsgHumanPhotoLabel]}</dd>
              </div>
              <div>
                <dt>{copy.dataset}</dt>
                <dd>{copy.datasetUse[suggestion.datasetUse]}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="admin-photo-review-assistant__footer-grid">
        <article>
          <strong>{copy.boundaryTitle}</strong>
          <p>{copy.boundaryBody}</p>
        </article>
        <article>
          <strong>{copy.exportTitle}</strong>
          <p>{copy.exportBody}</p>
        </article>
        <article>
          <strong>{copy.prototypeTitle}</strong>
          <p>{copy.prototypeBody}</p>
        </article>
      </div>
    </section>
  );
}
