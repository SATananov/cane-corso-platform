import { PageShell } from '@/components/page-shell';
import type { PageShellCard } from '@/components/page-shell';
import { SectionCard } from '@/components/section-card';
import { getCurrentLocale } from '@/lib/locale.server';

export default async function FaqPage() {
  const locale = await getCurrentLocale();

  const copyByLocale = {
    en: {
      eyebrow: 'Чести въпроси',
      title: 'Clear answers before a member, partner, or visitor goes deeper',
      description:
        'The strongest early UX idea from the old project was not to leave people guessing. This FAQ keeps that spirit alive: explain access, moderation, trust, publication, and why the platform is structured in layers.',
      cards: [
        {
          eyebrow: 'Official trust',
          title: 'Published in registry is not the same as certified by USG',
          description: 'Registry publication is the official public profile layer. Certificate trust remains a separate decision and a separate signal.',
          href: '/guide?topic=registry#registry',
          meta: 'Registry • certificate • verify',
          icon: 'verify',
        },
        {
          eyebrow: 'Access',
          title: 'Guests, members, partners, reviewers',
          description: 'Users need a simple map of who can browse, who can submit, who can apply, and who decides visibility.',
          href: '/guide?topic=access#access',
          meta: 'Guest • member • partner • review',
          icon: 'guide',
        },
        {
          eyebrow: 'Community layer',
          title: 'Why FUN and community exist at all',
          description: 'The platform is not only for records. It also needs life: media, new home, future match logic, owner usefulness, and approved ecosystem visibility.',
          href: '/community',
          meta: 'FUN • owner life • usefulness',
          icon: 'community',
        },
      ] satisfies readonly PageShellCard[],
      bullets: [
        'Why is moderation necessary even for community content? Because usefulness should still feel trusted and aligned with the platform standards.',
        'Why should members get richer views? Because ownership, profile work, and submission preparation happen in the private workspace first.',
        'Why keep knowledge and manifesto visible? Because the platform must teach the breed and communicate its standards, not only display listings.',
      ],
    },
    bg: {
      eyebrow: 'Чести въпроси',
      title: 'Ясни отговори, преди гостът, членът или партньорът да продължи по-надълбоко',
      description:
        'Една от най-силните ранни UX идеи в стария проект беше да не оставя човека да гадае. Тези чести въпроси пазят точно този дух: обясняват достъпа, модерацията, доверието, публикуването и защо платформата е подредена на слоеве.',
      cards: [
        {
          eyebrow: 'Официално доверие',
          title: 'Публикуван в регистъра не е същото като USG сертифициран',
          description: 'Публикуването в регистъра е официалният публичен профилен слой. Сертификатът остава отделно решение и отделен сигнал на доверие.',
          href: '/guide?topic=registry#registry',
          meta: 'Регистър • сертификат • проверка',
          icon: 'verify',
        },
        {
          eyebrow: 'Достъп',
          title: 'Гости, членове, партньори, модератори',
          description: 'Потребителят има нужда от проста карта кой може да разглежда, кой може да подава, кой може да кандидатства и кой решава видимостта.',
          href: '/guide?topic=access#access',
          meta: 'Гост • член • партньор • преглед',
          icon: 'guide',
        },
        {
          eyebrow: 'Общностен слой',
          title: 'Защо изобщо има FUN и общностен слой',
          description: 'Платформата не е само за записи. Тя има нужда и от живот: медия, нов дом, бъдещ слой за свързване, полезност за собствениците и одобрена видимост в екосистемата.',
          href: '/community',
          meta: 'FUN • живот на собственика • полезност',
          icon: 'community',
        },
      ] satisfies readonly PageShellCard[],
      bullets: [
        'Защо е нужна модерация дори при общностно съдържание? Защото и полезността трябва да се усеща доверена и подредена според стандартите на платформата.',
        'Защо членовете трябва да виждат по-богати изгледи? Защото собствеността, профилната работа и подготовката за подаване започват първо в личната зона.',
        'Защо знанията и манифестът трябва да стоят видими? Защото платформата трябва да учи на породата и да комуникира стандартите си, не само да показва списъци.',
      ],
    },
    it: {
      eyebrow: 'Чести въпроси',
      title: 'Risposte chiare prima che ospite, membro o partner vada più in profondità',
      description:
        'Una delle idee UX più forti del vecchio progetto era non lasciare l’utente a indovinare. Questa FAQ mantiene vivo quello spirito: spiega accesso, moderazione, fiducia, pubblicazione e perché la piattaforma è organizzata in layer.',
      cards: [
        {
          eyebrow: 'Fiducia official',
          title: 'Pubblicato nel registro non è la stessa cosa di certificato da USG',
          description: 'La pubblicazione nel registro è il layer ufficiale del profilo pubblico. Il certificato resta una decisione separata e un segnale separato di fiducia.',
          href: '/guide?topic=registry#registry',
          meta: 'Registro • certificato • verify',
          icon: 'verify',
        },
        {
          eyebrow: 'Accesso',
          title: 'Ospiti, membri, partner, revisori',
          description: 'Gli utenti hanno bisogno di una mappa semplice di chi può esplorare, chi può inviare, chi può candidarsi e chi decide la visibilità.',
          href: '/guide?topic=access#access',
          meta: 'Ospite • membro • partner • review',
          icon: 'guide',
        },
        {
          eyebrow: 'Layer community',
          title: 'Perché esistono FUN e il layer community',
          description: 'La piattaforma non è fatta solo di record. Ha bisogno anche di vita: media, new home, futura logica match, utilità per i proprietari e visibilità approvata dell’ecosistema.',
          href: '/community',
          meta: 'FUN • vita del proprietario • utilità',
          icon: 'community',
        },
      ] satisfies readonly PageShellCard[],
      bullets: [
        'Perché la moderazione è necessaria anche per i contenuti community? Perché anche l’utilità dovrebbe sembrare affidabile e coerente con gli standard della piattaforma.',
        'Perché i membri dovrebbero avere viste più ricche? Perché ownership, lavoro sul profilo e preparazione degli invii iniziano prima nello spazio privato.',
        'Perché knowledge e manifesto devono restare visibili? Perché la piattaforma dovrebbe insegnare la razza e comunicare i propri standard, non solo mostrare elenchi.',
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
      helpHref="/guide?topic=overview#overview"
      helpLabel={locale === 'bg' ? 'Наръчник' : locale === 'it' ? 'Guida' : 'Guide'}
      visualSrc="/brand/icons/brand-icon.png"
      visualAlt="USG FAQ symbol"
      visualFit="contain"
      heroChips={
        locale === 'bg'
          ? ['Ясни отговори', 'По-малко лутане', 'Повече доверие']
          : locale === 'it'
            ? ['Risposte chiare', 'Meno confusione', 'Più fiducia']
            : ['Clear answers', 'Less confusion', 'More trust']
      }
    >
      <div className="content-card faq-bullet-panel">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <ul className="platform-help-list">
          {copy.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
