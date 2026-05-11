import type { Locale } from '@/lib/i18n';

interface UsgPhotoEvidenceGuidePanelProps {
  locale: Locale;
  dogName?: string | null;
  mainImageUrl?: string | null;
  galleryImageCount: number;
}

type PhotoEvidenceStatus = 'ready' | 'current' | 'missing';

const copyByLocale = {
  en: {
    eyebrow: 'Step 118 photo evidence flow',
    title: 'Prepare the three photos the model needs',
    description:
      'This guide turns “Check authenticity” into a clear photo evidence flow: side standing, front standing and head detail. It prepares the future AI/ML layer without claiming that a photo proves breed identity.',
    noName: 'This Cane Corso',
    readiness: 'Photo evidence readiness',
    target: 'Target set',
    completed: 'prepared',
    missing: 'missing',
    upload: 'Go to photo upload',
    flowTitle: 'Photo flow for USG review',
    qualityTitle: 'Quality gates before review',
    modelTitle: 'Future model input',
    modelBody:
      'When the recognition layer is added, these views can become the structured input for pose, proportion and quality checks. Until then they guide the owner and the human reviewer.',
    shots: [
      {
        key: 'side',
        label: 'Side standing view',
        hint: 'Full body from the side, dog standing naturally, legs visible, camera at chest height.',
      },
      {
        key: 'front',
        label: 'Front standing view',
        hint: 'Chest, front legs and head visible, no strong top-down angle.',
      },
      {
        key: 'head',
        label: 'Head detail',
        hint: 'Clear head and muzzle profile for visual proportion orientation.',
      },
    ],
    quality: [
      'Use natural light or a bright room.',
      'Avoid filters, heavy shadows and cropped legs.',
      'Keep the Cane Corso standing, not sitting or lying.',
      'Add real measurements separately when possible.',
    ],
    status: {
      ready: 'ready',
      current: 'next',
      missing: 'needed',
    },
  },
  bg: {
    eyebrow: 'Step 118 снимков evidence flow',
    title: 'Подготви трите снимки, които моделът ще използва',
    description:
      'Този guide превръща „Провери за истинско“ в ясен снимков evidence flow: странична стойка, фронтална стойка и детайл на глава. Подготвя бъдещия AI/ML слой, без да твърди, че снимка доказва порода.',
    noName: 'Това Cane Corso',
    readiness: 'Готовност на снимковите доказателства',
    target: 'Целеви комплект',
    completed: 'подготвени',
    missing: 'липсват',
    upload: 'Към качване на снимки',
    flowTitle: 'Снимков flow за USG преглед',
    qualityTitle: 'Quality gates преди преглед',
    modelTitle: 'Вход за бъдещия модел',
    modelBody:
      'Когато добавим recognition слоя, тези изгледи могат да станат структурираният вход за pose, proportion и quality checks. Дотогава водят собственика и човешкия преглед.',
    shots: [
      {
        key: 'side',
        label: 'Странична снимка в стойка',
        hint: 'Цяло тяло отстрани, Cane Corso стои естествено, крайниците са видими, камерата е на височина около гърдите.',
      },
      {
        key: 'front',
        label: 'Фронтална снимка в стойка',
        hint: 'Видими гърди, предни крайници и глава, без силен ъгъл отгоре.',
      },
      {
        key: 'head',
        label: 'Детайл на глава',
        hint: 'Ясна глава и муцуна за визуална ориентация на пропорциите.',
      },
    ],
    quality: [
      'Използвай естествена светлина или добре осветена стая.',
      'Избягвай филтри, тежки сенки и изрязани крайници.',
      'Cane Corso да е изправен, не седнал или легнал.',
      'Добави реални измервания отделно, когато е възможно.',
    ],
    status: {
      ready: 'готово',
      current: 'следващо',
      missing: 'нужно',
    },
  },
  it: {
    eyebrow: 'Step 118 flusso evidenze foto',
    title: 'Prepara le tre foto utili al modello',
    description:
      'Questa guida trasforma “Verifica autenticità” in un flusso chiaro: lato in posa, fronte in posa e dettaglio testa. Prepara il futuro livello AI/ML senza affermare che una foto provi la razza.',
    noName: 'Questo Cane Corso',
    readiness: 'Prontezza evidenze foto',
    target: 'Set obiettivo',
    completed: 'preparate',
    missing: 'mancanti',
    upload: 'Vai al caricamento foto',
    flowTitle: 'Flusso foto per revisione USG',
    qualityTitle: 'Quality gates prima della revisione',
    modelTitle: 'Input per modello futuro',
    modelBody:
      'Quando il livello di riconoscimento sarà aggiunto, queste viste potranno diventare input strutturato per pose, proporzioni e controlli qualità. Fino ad allora guidano proprietario e revisione umana.',
    shots: [
      {
        key: 'side',
        label: 'Vista laterale in posa',
        hint: 'Corpo intero di lato, Cane Corso in piedi naturale, arti visibili, camera ad altezza torace.',
      },
      {
        key: 'front',
        label: 'Vista frontale in posa',
        hint: 'Petto, arti anteriori e testa visibili, senza forte angolo dall’alto.',
      },
      {
        key: 'head',
        label: 'Dettaglio testa',
        hint: 'Testa e muso chiari per orientamento visivo delle proporzioni.',
      },
    ],
    quality: [
      'Usa luce naturale o una stanza ben illuminata.',
      'Evita filtri, ombre pesanti e arti tagliati.',
      'Il Cane Corso deve stare in piedi, non seduto o sdraiato.',
      'Aggiungi misure reali separatamente quando possibile.',
    ],
    status: {
      ready: 'pronto',
      current: 'prossimo',
      missing: 'necessario',
    },
  },
} as const;

function clampPhotoCount(count: number) {
  if (!Number.isFinite(count)) return 0;
  return Math.max(0, Math.min(3, Math.round(count)));
}

function getShotStatus(index: number, preparedCount: number): PhotoEvidenceStatus {
  if (index < preparedCount) return 'ready';
  if (index === preparedCount) return 'current';
  return 'missing';
}

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

export function UsgPhotoEvidenceGuidePanel({
  locale,
  dogName,
  mainImageUrl,
  galleryImageCount,
}: UsgPhotoEvidenceGuidePanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const preparedCount = clampPhotoCount(Math.max(galleryImageCount, mainImageUrl ? 1 : 0));
  const missingCount = Math.max(0, 3 - preparedCount);
  const readiness = (preparedCount / 3) * 100;
  const displayName = dogName?.trim() || copy.noName;

  return (
    <section className="content-card photo-evidence-guide-panel" id="usg-photo-evidence-flow" aria-label={copy.title}>
      <div className="photo-evidence-guide-panel__header">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <a className="button-secondary" href="#dog-photo-evidence-upload">{copy.upload}</a>
      </div>

      <div className="photo-evidence-guide-panel__summary">
        <div className="photo-evidence-guide-panel__meter" aria-label={`${copy.readiness}: ${formatPercent(readiness)}`}>
          <span style={{ width: `${readiness}%` }} />
        </div>
        <div className="photo-evidence-guide-panel__stats">
          <strong>{displayName}</strong>
          <span>{copy.target}: {preparedCount}/3</span>
          <span>{preparedCount} {copy.completed} · {missingCount} {copy.missing}</span>
        </div>
      </div>

      <div className="photo-evidence-guide-panel__grid" aria-label={copy.flowTitle}>
        {copy.shots.map((shot, index) => {
          const status = getShotStatus(index, preparedCount);
          return (
            <article className={`photo-evidence-shot-card photo-evidence-shot-card--${status}`} key={shot.key}>
              <div className="photo-evidence-shot-card__index">{index + 1}</div>
              <div>
                <span>{copy.status[status]}</span>
                <strong>{shot.label}</strong>
                <p>{shot.hint}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="photo-evidence-guide-panel__footer">
        <section>
          <span className="eyebrow-label">{copy.qualityTitle}</span>
          <ul>
            {copy.quality.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <section className="photo-evidence-model-note">
          <span className="eyebrow-label">{copy.modelTitle}</span>
          <p>{copy.modelBody}</p>
        </section>
      </div>
    </section>
  );
}
