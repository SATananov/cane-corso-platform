import type { Locale } from '@/lib/i18n';

// Step 120 — Photo Readiness Action Guidance
// Legacy QA markers: Step 118 photo evidence flow | Step 118 снимков evidence flow | Step 118 flusso evidenze foto

interface UsgPhotoEvidenceGuidePanelProps {
  locale: Locale;
  dogName?: string | null;
  mainImageUrl?: string | null;
  galleryImageCount: number;
}

type PhotoEvidenceStatus = 'ready' | 'current' | 'missing';

const copyByLocale = {
  en: {
    eyebrow: 'Photo evidence for USG review',
    title: 'Prepare the three photos for Standard Match comparison',
    description:
      'This voluntary owner bonus turns “Check authenticity” into a clear photo evidence flow: side standing, front standing and head detail. These photos become the comparison sample for the standard template, without claiming that a photo proves breed identity.',
    noName: 'This Cane Corso',
    readiness: 'Photo evidence readiness',
    target: 'Target set',
    completed: 'prepared',
    missing: 'missing',
    upload: 'Go to photo upload',
    flowTitle: 'Photo set for USG review',
    qualityTitle: 'Quality checks before review',
    modelTitle: 'Future model input',
    modelBody:
      'When the future photo layer is added, these views can become structured input for pose, proportion and quality orientation against the standard template. Until then they guide the owner and the human reviewer.',
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
    actionPlanTitle: 'What to do next',
    actionPlanBody:
      'Use the highlighted “next” card first. A complete three-photo set improves Standard Match confidence and prepares the profile for USG review, but it is still not breed proof.',
    actionLabel: 'Owner action',
    reviewGateTitle: 'Review gate',
    reviewGateBody:
      'Photo readiness helps Owner Center decide what is missing before submission. Registry publication and Certificate remain separate USG review decisions.',
    ownerCenterTitle: 'Owner Center path',
    ownerCenterSteps: ['Complete profile data', 'Upload the three views', 'Add real measurements', 'Open Standard Match', 'Submit for USG review'],
    shotActions: {
      side: {
        ready: 'Keep this view unless you can replace it with a clearer full-body side photo.',
        current: 'Add this first: it is the strongest orientation photo for body length, height and overall silhouette.',
        missing: 'This view will be needed before photo readiness can be considered complete.',
      },
      front: {
        ready: 'Keep this front view if chest, front legs and head are clear.',
        current: 'Add this next so the reviewer can check width, stance and front structure.',
        missing: 'This view remains missing and will reduce photo readiness until added.',
      },
      head: {
        ready: 'Keep this detail if head, skull and muzzle are visible without blur.',
        current: 'Add this next to support head and muzzle proportion orientation.',
        missing: 'This detail is still needed for stronger visual review readiness.',
      },
    },
    status: {
      ready: 'ready',
      current: 'next',
      missing: 'needed',
    },
  },
  bg: {
    eyebrow: 'Снимки за USG преглед',
    title: 'Подготви трите снимки за Standard Match сравнение',
    description:
      'Тази доброволна бонус проверка превръща „Провери за истинско“ в ясен снимков процес: странична стойка, фронтална стойка и детайл на глава. Тези снимки стават пример за сравнение с образец за сравнение със стандарта, без да твърди, че снимка доказва порода.',
    noName: 'Това Cane Corso',
    readiness: 'Готовност на снимковите доказателства',
    target: 'Целеви комплект',
    completed: 'подготвени',
    missing: 'липсват',
    upload: 'Към качване на снимки',
    flowTitle: 'Снимков комплект за USG преглед',
    qualityTitle: 'Проверки за качество преди преглед',
    modelTitle: 'Вход за бъдещия модел',
    modelBody:
      'Когато бъде добавен бъдещият снимков слой, тези изгледи могат да станат структуриран вход за ориентация по поза, пропорции и качество спрямо стандарта. Дотогава водят собственика и човешкия преглед.',
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
    actionPlanTitle: 'Какво да направиш сега',
    actionPlanBody:
      'Първо следвай картата, маркирана като „следващо“. Пълният комплект от три снимки повишава увереността на Standard Match и подготвя профила за USG преглед, но пак не е доказателство за порода.',
    actionLabel: 'Действие за собственика',
    reviewGateTitle: 'Врата към преглед',
    reviewGateBody:
      'Готовността на снимките помага на Owner Center да покаже какво липсва преди подаване. Публикуването в Регистъра и Сертификатът остават отделни решения след USG преглед.',
    ownerCenterTitle: 'Път в Owner Center',
    ownerCenterSteps: ['Попълни профилните данни', 'Качи трите изгледа', 'Добави реални измервания', 'Отвори Standard Match', 'Подай към USG преглед'],
    shotActions: {
      side: {
        ready: 'Запази този изглед, освен ако можеш да го замениш с по-ясна странична снимка на цялото тяло.',
        current: 'Добави това първо: това е най-силната ориентационна снимка за дължина на тяло, височина и силует.',
        missing: 'Този изглед ще е нужен, преди снимковата готовност да се счита за пълна.',
      },
      front: {
        ready: 'Запази тази фронтална снимка, ако гърдите, предните крайници и главата са ясни.',
        current: 'Добави това следващо, за да може прегледът да види ширина, стойка и предна структура.',
        missing: 'Този изглед още липсва и ще намалява снимковата готовност, докато не бъде добавен.',
      },
      head: {
        ready: 'Запази този детайл, ако главата, черепът и муцуната се виждат ясно без размазване.',
        current: 'Добави това следващо, за да помогне за ориентация на пропорциите на глава и муцуна.',
        missing: 'Този детайл още е нужен за по-силна готовност за визуален преглед.',
      },
    },
    status: {
      ready: 'готово',
      current: 'следващо',
      missing: 'нужно',
    },
  },
  it: {
    eyebrow: 'Evidenze foto per revisione USG',
    title: 'Prepara le tre foto per il confronto Standard Match',
    description:
      'Questo bonus volontario trasforma “Verifica autenticità” in un flusso chiaro: lato in posa, fronte in posa e dettaglio testa. Queste foto diventano campione di confronto con il modello standard senza affermare che una foto provi la razza.',
    noName: 'Questo Cane Corso',
    readiness: 'Prontezza evidenze foto',
    target: 'Set obiettivo',
    completed: 'preparate',
    missing: 'mancanti',
    upload: 'Vai al caricamento foto',
    flowTitle: 'Set foto per revisione USG',
    qualityTitle: 'Controlli qualità prima della revisione',
    modelTitle: 'Input per modello futuro',
    modelBody:
      'Quando sarà aggiunto il futuro livello foto, queste viste potranno diventare input strutturato per orientamento di posa, proporzioni e qualità rispetto al modello standard. Fino ad allora guidano proprietario e revisione umana.',
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
    actionPlanTitle: 'Cosa fare adesso',
    actionPlanBody:
      'Segui prima la scheda marcata come “prossimo”. Il set completo di tre foto aumenta l’affidabilità Standard Match e prepara il profilo alla revisione USG, ma non è prova di razza.',
    actionLabel: 'Azione proprietario',
    reviewGateTitle: 'Ingresso revisione',
    reviewGateBody:
      'La prontezza foto aiuta Owner Center a mostrare cosa manca prima dell’invio. Pubblicazione nel Registro e Certificato restano decisioni separate dopo revisione USG.',
    ownerCenterTitle: 'Percorso in Owner Center',
    ownerCenterSteps: ['Completa i dati profilo', 'Carica le tre viste', 'Aggiungi misure reali', 'Apri Standard Match', 'Invia a revisione USG'],
    shotActions: {
      side: {
        ready: 'Mantieni questa vista salvo poterla sostituire con una foto laterale del corpo intero più chiara.',
        current: 'Aggiungila per prima: è la foto più forte per lunghezza corpo, altezza e silhouette generale.',
        missing: 'Questa vista sarà necessaria prima che la prontezza foto sia completa.',
      },
      front: {
        ready: 'Mantieni questa vista frontale se petto, arti anteriori e testa sono chiari.',
        current: 'Aggiungila come prossima per controllare larghezza, postura e struttura frontale.',
        missing: 'Questa vista manca ancora e riduce la prontezza foto finché non viene aggiunta.',
      },
      head: {
        ready: 'Mantieni questo dettaglio se testa, cranio e muso sono visibili senza sfocatura.',
        current: 'Aggiungilo come prossimo per supportare l’orientamento delle proporzioni testa/muso.',
        missing: 'Questo dettaglio serve ancora per una revisione visiva più forte.',
      },
    },
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
                <div className="photo-evidence-shot-card__action">
                  <small>{copy.actionLabel}</small>
                  <p>{copy.shotActions[shot.key][status]}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="photo-evidence-guide-panel__action-strip" aria-label={copy.actionPlanTitle}>
        <section>
          <span className="eyebrow-label">{copy.actionPlanTitle}</span>
          <p>{copy.actionPlanBody}</p>
        </section>
        <section>
          <span className="eyebrow-label">{copy.reviewGateTitle}</span>
          <p>{copy.reviewGateBody}</p>
        </section>
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
        <section className="photo-evidence-owner-bridge">
          <span className="eyebrow-label">{copy.ownerCenterTitle}</span>
          <ol>
            {copy.ownerCenterSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
      </div>
    </section>
  );
}
