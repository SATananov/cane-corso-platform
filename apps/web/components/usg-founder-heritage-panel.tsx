import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

type HeritageVariant = 'full' | 'compact';

type HeritageDog = {
  id: string;
  name: string;
  identity: string;
  imageSrc: string;
  imageAlt: Record<Locale, string>;
  role: Record<Locale, string>;
  note: Record<Locale, string>;
};

const heritageDogs: readonly HeritageDog[] = [
  {
    id: 'mark-i',
    name: 'Mark I',
    identity: 'Mark I di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/mark-i.jpg',
    imageAlt: {
      en: 'Portrait of Mark I, the first Cane Corso in the personal USG heritage archive.',
      bg: 'Портрет на Mark I — първото Cane Corso в личния USG архив.',
      it: 'Ritratto di Mark I, il primo Cane Corso nell’archivio personale USG.',
    },
    role: {
      en: 'The beginning',
      bg: 'Началото',
      it: 'L’inizio',
    },
    note: {
      en: 'The first Cane Corso in the personal path behind USG.',
      bg: 'Първото Cane Corso в личния път зад USG.',
      it: 'Il primo Cane Corso nel percorso personale dietro USG.',
    },
  },
  {
    id: 'hera',
    name: 'Hera',
    identity: 'Hera di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/hera.jpg',
    imageAlt: {
      en: 'Portrait of Hera from the personal USG Cane Corso archive.',
      bg: 'Портрет на Hera от личния USG Cane Corso архив.',
      it: 'Ritratto di Hera dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'The matriarch',
      bg: 'Матриархът',
      it: 'La matriarca',
    },
    note: {
      en: 'A foundational female presence in the personal history of the platform.',
      bg: 'Основно женско присъствие в личната история на платформата.',
      it: 'Una presenza femminile fondante nella storia personale della piattaforma.',
    },
  },
  {
    id: 'thor',
    name: 'Thor',
    identity: 'Thor di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/thor.jpg',
    imageAlt: {
      en: 'Standing portrait of Thor from the personal USG Cane Corso archive.',
      bg: 'Портрет в стойка на Thor от личния USG Cane Corso архив.',
      it: 'Ritratto in posa di Thor dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'The magnificent presence',
      bg: 'Внушителното присъствие',
      it: 'La presenza magnifica',
    },
    note: {
      en: 'A visual reminder of power, outline, and Cane Corso presence.',
      bg: 'Визуален спомен за сила, силует и Cane Corso присъствие.',
      it: 'Un ricordo visivo di forza, profilo e presenza Cane Corso.',
    },
  },
  {
    id: 'reia',
    name: 'Reia',
    identity: 'Reia di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/reia.jpg',
    imageAlt: {
      en: 'Portrait of Reia from the personal USG Cane Corso archive.',
      bg: 'Портрет на Reia от личния USG Cane Corso архив.',
      it: 'Ritratto di Reia dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'The noble one',
      bg: 'Благородното присъствие',
      it: 'La nobile presenza',
    },
    note: {
      en: 'Part of the female character and identity remembered by the archive.',
      bg: 'Част от женския характер и идентичност, запазени в архива.',
      it: 'Parte del carattere femminile e dell’identità ricordati dall’archivio.',
    },
  },
  {
    id: 'mark-ii',
    name: 'Mark II',
    identity: 'Mark II di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/mark-ii.jpg',
    imageAlt: {
      en: 'Portrait of Mark II, son of Mark I and Hera, from the personal USG archive.',
      bg: 'Портрет на Mark II, син на Mark I и Hera, от личния USG архив.',
      it: 'Ritratto di Mark II, figlio di Mark I e Hera, dall’archivio personale USG.',
    },
    role: {
      en: 'The continuation',
      bg: 'Продължението',
      it: 'La continuazione',
    },
    note: {
      en: 'A continuation of Mark I and Hera inside the personal Cane Corso story.',
      bg: 'Продължение на Mark I и Hera в личната Cane Corso история.',
      it: 'Una continuazione di Mark I ed Hera nella storia personale Cane Corso.',
    },
  },
  {
    id: 'ara',
    name: 'Ara',
    identity: 'Ara di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/ara.jpg',
    imageAlt: {
      en: 'Portrait of Ara from the personal USG Cane Corso archive.',
      bg: 'Портрет на Ara от личния USG Cane Corso архив.',
      it: 'Ritratto di Ara dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'The unique one',
      bg: 'Единствената по рода си',
      it: 'L’unica nel suo genere',
    },
    note: {
      en: 'A direct emotional connection to the idea of Unico Suo Genere.',
      bg: 'Директна емоционална връзка с идеята Unico Suo Genere.',
      it: 'Un legame emotivo diretto con l’idea Unico Suo Genere.',
    },
  },
  {
    id: 'broly',
    name: 'Broly',
    identity: 'Broly di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/broly.jpg',
    imageAlt: {
      en: 'Portrait of Broly from the personal USG Cane Corso archive.',
      bg: 'Портрет на Broly от личния USG Cane Corso архив.',
      it: 'Ritratto di Broly dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'The wild spirit',
      bg: 'Живият темперамент',
      it: 'Lo spirito vivo',
    },
    note: {
      en: 'Energy, temperament, and the living side of the Cane Corso experience.',
      bg: 'Енергия, темперамент и живата страна на Cane Corso преживяването.',
      it: 'Energia, temperamento e il lato vivo dell’esperienza Cane Corso.',
    },
  },
] as const;

const copyByLocale = {
  en: {
    eyebrow: 'USG heritage',
    title: 'The personal Cane Corso path behind USG',
    description:
      'USG did not begin as a sales idea. It began from years of living with Cane Corso, observing the breed, and building respect for character, presence, structure, care, and the bond between owner and dog.',
    disclaimerTitle: 'Personal archive, not a kennel page',
    disclaimer:
      'di Casa Tananov is used here as a personal heritage identity. It does not present USG as a breeder, sales channel, pedigree authority, or official kennel record.',
    archiveTitle: 'Personal Cane Corso archive',
    archiveDescription:
      'These dogs are shown as part of a personal memory and identity layer. They explain the human experience behind the platform without replacing official breed systems or documentation.',
    founderTitle: 'From obsession with the breed to a useful platform',
    founderText:
      'The purpose is simple: turn personal passion into a cleaner, more responsible digital home for owners — with profiles, care history, knowledge, verification, and moderated community usefulness.',
    identityLabel: 'Archive identity',
    openFull: 'Open full heritage archive',
    openPlatform: 'Back to platform',
    chips: ['Owner experience', 'Personal archive', 'Cane Corso only'],
  },
  bg: {
    eyebrow: 'USG наследство',
    title: 'Личният Cane Corso път зад USG',
    description:
      'USG не започва като идея за продажби. Започва от години живот с Cane Corso, наблюдение върху породата и уважение към характер, присъствие, структура, грижа и връзката между човек и куче.',
    disclaimerTitle: 'Личен архив, не развъдник',
    disclaimer:
      'di Casa Tananov се използва тук като лична heritage идентичност. Тази секция не представя USG като развъдник, канал за продажби, родословна власт или официален kennel запис.',
    archiveTitle: 'Личен Cane Corso архив',
    archiveDescription:
      'Тези Cane Corso са показани като част от лична памет и идентичност. Те обясняват човешкия опит зад платформата, без да заменят официални породни системи или документи.',
    founderTitle: 'От обсебеност по породата към полезна платформа',
    founderText:
      'Целта е проста: личната страст да се превърне в по-чист, по-отговорен дигитален дом за собственици — с профили, история на грижата, знания, проверка и модерирана общностна полезност.',
    identityLabel: 'Архивна идентичност',
    openFull: 'Отвори целия архив',
    openPlatform: 'Към платформата',
    chips: ['Опит като собственик', 'Личен архив', 'Само Cane Corso'],
  },
  it: {
    eyebrow: 'Eredità USG',
    title: 'Il percorso personale Cane Corso dietro USG',
    description:
      'USG non nasce come idea di vendita. Nasce da anni vissuti con il Cane Corso, osservando la razza e rispettando carattere, presenza, struttura, cura e legame tra persona e cane.',
    disclaimerTitle: 'Archivio personale, non pagina di allevamento',
    disclaimer:
      'di Casa Tananov è usato qui come identità personale di heritage. Questa sezione non presenta USG come allevamento, canale di vendita, autorità genealogica o registro kennel ufficiale.',
    archiveTitle: 'Archivio personale Cane Corso',
    archiveDescription:
      'Questi Cane Corso sono mostrati come memoria e identità personale. Spiegano l’esperienza umana dietro la piattaforma senza sostituire sistemi o documenti ufficiali.',
    founderTitle: 'Dalla passione per la razza a una piattaforma utile',
    founderText:
      'Lo scopo è semplice: trasformare la passione personale in una casa digitale più chiara e responsabile per owner — profili, cura, conoscenza, verifica e community moderata.',
    identityLabel: 'Identità archivio',
    openFull: 'Apri archivio completo',
    openPlatform: 'Torna alla piattaforma',
    chips: ['Esperienza owner', 'Archivio personale', 'Solo Cane Corso'],
  },
} as const;

export function UsgFounderHeritagePanel({ locale, variant = 'compact' }: { locale: Locale; variant?: HeritageVariant }) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const dogs = variant === 'compact' ? heritageDogs.slice(0, 4) : heritageDogs;

  return (
    <section className={`usg-founder-heritage usg-founder-heritage--${variant}`} aria-label={copy.title}>
      <div className="usg-founder-heritage__hero">
        <div className="usg-founder-heritage__copy">
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
          <div className="usg-founder-heritage__chips" aria-label={copy.eyebrow}>
            {copy.chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>
        <aside className="usg-founder-heritage__disclaimer">
          <strong>{copy.disclaimerTitle}</strong>
          <span>{copy.disclaimer}</span>
        </aside>
      </div>

      <div className="usg-founder-heritage__archive-head">
        <div>
          <span className="eyebrow-label">di Casa Tananov</span>
          <h3>{copy.archiveTitle}</h3>
          <p>{copy.archiveDescription}</p>
        </div>
        {variant === 'compact' ? (
          <Link href="/heritage" className="button-ghost small">
            {copy.openFull}
          </Link>
        ) : (
          <Link href="/platform" className="button-ghost small">
            {copy.openPlatform}
          </Link>
        )}
      </div>

      <div className="usg-founder-heritage__grid">
        {dogs.map((dog) => (
          <article className="usg-founder-heritage-card" key={dog.id}>
            <div className="usg-founder-heritage-card__media">
              <Image src={dog.imageSrc} alt={dog.imageAlt[locale]} width={1024} height={1024} sizes="(max-width: 760px) 90vw, (max-width: 1200px) 42vw, 310px" />
            </div>
            <div className="usg-founder-heritage-card__body">
              <span className="usg-founder-heritage-card__role">{dog.role[locale]}</span>
              <h4>{dog.name}</h4>
              <p className="usg-founder-heritage-card__identity">
                <span>{copy.identityLabel}</span>
                <strong>{dog.identity}</strong>
              </p>
              <p>{dog.note[locale]}</p>
            </div>
          </article>
        ))}
      </div>

      <article className="usg-founder-heritage__founder-note">
        <span className="eyebrow-label">UNICO SUO GENERE</span>
        <h3>{copy.founderTitle}</h3>
        <p>{copy.founderText}</p>
      </article>
    </section>
  );
}
