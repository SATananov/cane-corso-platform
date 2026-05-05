import { PageShell } from '@/components/page-shell';
import type { PageShellCard } from '@/components/page-shell';
import { SectionCard } from '@/components/section-card';
import { getCurrentLocale } from '@/lib/locale.server';

export default async function ManifestoPage() {
  const locale = await getCurrentLocale();

  const copyByLocale = {
    en: {
      eyebrow: 'Manifesto',
      title: 'Position before aesthetics. Responsibility before visibility.',
      description:
        'UNICO SUO GENERE should not feel like a generic pet platform. It stands for a disciplined Cane Corso identity: quality above quantity, review before public visibility, and a long-term breed culture that respects health, type, and temperament.',
      cards: [
        {
          eyebrow: 'Identity',
          title: 'Cane Corso only',
          description: 'The brand stays focused. It should not drift into a generic all-breed marketplace or dilute the product voice.',
          href: '/knowledge',
          meta: 'Breed focus • identity • discipline',
          icon: 'manifesto',
        },
        {
          eyebrow: 'Trust',
          title: 'Review before public visibility',
          description: 'Profiles, partner presence, and community usefulness should feel curated, not automatic. Moderation is part of the product promise.',
          href: '/guide?topic=review#review',
          meta: 'Moderation • publication • trust',
          icon: 'verify',
        },
        {
          eyebrow: 'Member culture',
          title: 'Owners should feel guided, not lost',
          description: 'The platform should teach, orient, and support the member with clearer help, richer profile depth, and a stronger sense of belonging.',
          href: '/guide?topic=member-workspace#member-workspace',
          meta: 'Help • member area • clarity',
          icon: 'member',
        },
      ] satisfies readonly PageShellCard[],
      blocks: [
        {
          eyebrow: 'What should remain true',
          title: 'USG is a point of view, not only a product shell',
          description:
            'The strongest part of the original project was not only visual style. It was the feeling that the platform had a position: selective, serious, editorial, and breed-responsible. That energy should remain visible in the new architecture.',
        },
        {
          eyebrow: 'What should mature',
          title: 'Emotion and authority must now live inside a stronger system',
          description:
            'The new platform should keep the manifesto tone, but support it with cleaner access rules, better explanation layers, stronger member flows, and clearer separation between official trust and community visibility.',
        },
      ],
    },
    bg: {
      eyebrow: 'Манифест',
      title: 'Позиция преди визия. Отговорност преди видимост.',
      description:
        'UNICO SUO GENERE не трябва да се усеща като обикновена pet платформа. То трябва да стои като дисциплинирана Cane Corso идентичност: качество над количество, преглед преди публичност и дългосрочна култура към породата, която уважава здравето, типа и темперамента.',
      cards: [
        {
          eyebrow: 'Идентичност',
          title: 'Само Cane Corso',
          description: 'Брандът трябва да остане фокусиран. Не бива да се размива в generic all-breed marketplace или неясен product voice.',
          href: '/knowledge',
          meta: 'Фокус върху породата • идентичност • дисциплина',
          icon: 'manifesto',
        },
        {
          eyebrow: 'Доверие',
          title: 'Преглед преди публична видимост',
          description: 'Профили, партньорско присъствие и community полезност трябва да се усещат курирани, а не автоматични. Модерацията е част от обещанието на продукта.',
          href: '/guide?topic=review#review',
          meta: 'Модерация • публикуване • доверие',
          icon: 'verify',
        },
        {
          eyebrow: 'Култура на члена',
          title: 'Собственикът трябва да се чувства воден, не изгубен',
          description: 'Платформата трябва да обучава, ориентира и подкрепя члена чрез по-ясна помощ, по-богат профилен depth и по-силно чувство за принадлежност.',
          href: '/guide?topic=member-workspace#member-workspace',
          meta: 'Помощ • членска зона • яснота',
          icon: 'member',
        },
      ] satisfies readonly PageShellCard[],
      blocks: [
        {
          eyebrow: 'Какво трябва да остане вярно',
          title: 'USG е гледна точка, не само продуктова рамка',
          description:
            'Най-силното в стария проект не беше само визията. Беше усещането, че платформата има позиция: селективна, сериозна, редакционна и отговорна към породата. Тази енергия трябва да остане видима и в новата архитектура.',
        },
        {
          eyebrow: 'Какво трябва да узрее',
          title: 'Емоцията и авторитетът вече трябва да живеят в по-силна система',
          description:
            'Новата платформа трябва да запази манифестния тон, но да го подкрепи с по-чисти правила за достъп, по-добри обяснителни слоеве, по-силни member потоци и по-ясно разделение между official trust и community visibility.',
        },
      ],
    },
    it: {
      eyebrow: 'Manifesto',
      title: 'Posizione prima dell’estetica. Responsabilità prima della visibilità.',
      description:
        'UNICO SUO GENERE non dovrebbe sembrare una generica piattaforma pet. Deve restare un’identità Cane Corso disciplinata: qualità sopra quantità, revisione prima della visibilità pubblica e una cultura di razza a lungo termine che rispetta salute, tipo e temperamento.',
      cards: [
        {
          eyebrow: 'Identità',
          title: 'Solo Cane Corso',
          description: 'Il brand deve restare focalizzato. Non dovrebbe scivolare in un marketplace generico multi-razza o diluire la voce del prodotto.',
          href: '/knowledge',
          meta: 'Focus razza • identità • disciplina',
          icon: 'manifesto',
        },
        {
          eyebrow: 'Fiducia',
          title: 'Revisione prima della visibilità pubblica',
          description: 'Profili, presenza partner e utilità community devono sentirsi curati, non automatici. La moderazione fa parte della promessa del prodotto.',
          href: '/guide?topic=review#review',
          meta: 'Moderazione • pubblicazione • fiducia',
          icon: 'verify',
        },
        {
          eyebrow: 'Cultura membro',
          title: 'Il proprietario deve sentirsi guidato, non perso',
          description: 'La piattaforma dovrebbe insegnare, orientare e sostenere il membro con un aiuto più chiaro, più profondità del profilo e un senso di appartenenza più forte.',
          href: '/guide?topic=member-workspace#member-workspace',
          meta: 'Aiuto • area membro • chiarezza',
          icon: 'member',
        },
      ] satisfies readonly PageShellCard[],
      blocks: [
        {
          eyebrow: 'Cosa deve restare vero',
          title: 'USG è un punto di vista, non solo un contenitore di prodotto',
          description:
            'La parte più forte del vecchio progetto non era solo lo stile visivo. Era la sensazione che la piattaforma avesse una posizione: selettiva, seria, editoriale e responsabile verso la razza. Questa energia dovrebbe restare visibile nella nuova architettura.',
        },
        {
          eyebrow: 'Cosa deve maturare',
          title: 'Emozione e autorevolezza ora devono vivere dentro un sistema più forte',
          description:
            'La nuova piattaforma dovrebbe mantenere il tono manifesto, ma sostenerlo con regole di accesso più pulite, migliori strati di spiegazione, flussi membro più forti e una separazione più chiara tra official trust e visibilità community.',
        },
      ],
    },
  } as const;

  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cards={copy.cards}
      actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'}
      accentLabel={copy.eyebrow}
      helpHref="/guide?topic=official-community#official-community"
      helpLabel={locale === 'bg' ? 'Помощ' : locale === 'it' ? 'Aiuto' : 'Help'}
      visualSrc="/brand/statements/one-of-a-kind.png"
      visualAlt="UNICO SUO GENERE statement"
      visualFit="contain"
      heroChips={
        locale === 'bg'
          ? ['Cane Corso само', 'Преглед преди видимост', 'Качество над количество']
          : locale === 'it'
            ? ['Solo Cane Corso', 'Revisione prima della visibilità', 'Qualità sopra quantità']
            : ['Cane Corso only', 'Review before visibility', 'Quality above quantity']
      }
    >
      <div className="section-card-grid legacy-spirit-grid">
        {copy.blocks.map((block) => (
          <SectionCard
            key={block.title}
            eyebrow={block.eyebrow}
            title={block.title}
            description={block.description}
            icon="manifesto"
          />
        ))}
      </div>
    </PageShell>
  );
}
