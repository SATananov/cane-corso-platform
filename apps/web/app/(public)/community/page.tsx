import { PageShell } from '@/components/page-shell';
import type { PageShellCard } from '@/components/page-shell';
import { SectionCard } from '@/components/section-card';
import { EcosystemDirectory } from '@/components/ecosystem-directory';
import { CommunityDiscoveryExperience } from '@/components/community-discovery-experience';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPublishedEcosystemDirectoryDocument } from '@/lib/ecosystem.server';

const copyByLocale = {
  en: {
    eyebrow: 'Community hub',
    title: 'Cane Corso is looking for: help, home, match, and places',
    description:
      'Start from the real need: breeding match, new home, puppies, lost or found Cane Corso, friendly places, and trusted services. Every public listing stays reviewed, and sensitive connections go through the administrator.',
    cards: [
      {
        eyebrow: 'Urgent help',
        title: 'Lost / found Cane Corso',
        description: 'Highly visible community signals for lost or found Cane Corso cases, still protected by admin review.',
        href: '#cane-corso-intent-listings',
        meta: 'urgent • city • last seen',
        icon: 'gallery',
      },
      {
        eyebrow: 'Breeding & match',
        title: 'Female seeks male / male seeks female',
        description: 'Owners can publish what they are looking for, while contact and matching remain administrator-mediated.',
        href: '#cane-corso-intent-listings',
        meta: 'match • privacy • admin bridge',
        icon: 'community',
      },
      {
        eyebrow: 'New home',
        title: 'Adoption, puppies, and responsible help',
        description: 'New-home requests and puppy visibility stay separate from the official Registry and become public only after review.',
        href: '#cane-corso-intent-listings',
        meta: 'home • puppies • moderation',
        icon: 'owner',
      },
    ] satisfies readonly PageShellCard[],
    worldsTitle: 'Community worlds worth preserving from the old project',
    worldsDescription:
      'These are the most valuable legacy ideas to keep inside the new architecture so the platform feels human, useful, and revisitable.',
    worlds: [
      {
        eyebrow: 'FUN • media',
        title: 'Media and gallery should feel like a real public layer',
        description: 'Photos, stories, events, and refined Cane Corso visibility give emotional value to the product and help the breed feel present beyond listings.',
        icon: 'gallery',
      },
      {
        eyebrow: 'Breeding Hub',
        title: 'Match logic belongs in community, not in the official trust core',
        description: 'Future match flow can support owners and breeders without confusing it with registry publication or certificate trust.',
        icon: 'community',
      },
      {
        eyebrow: 'New home',
        title: 'Supportive rehoming deserves a dignified place',
        description: 'A new home section helps the platform serve real Cane Corso needs with care, moderation, and humane visibility.',
        icon: 'owner',
      },
      {
        eyebrow: 'Owner guide',
        title: 'Useful community should stay connected to practical owner guidance',
        description: 'Community becomes stronger when it connects directly to owner help, knowledge, FAQ, and clear publication rules.',
        href: '/knowledge',
        meta: 'Owner guide • FAQ • help',
        icon: 'knowledge',
      },
      {
        eyebrow: 'Elite & visibility',
        title: 'Premium highlights can celebrate the best of the breed',
        description: 'A curated editorial layer can spotlight elite Cane Corso presence without replacing the official trust decisions of the registry.',
        href: '/registry',
        meta: 'Editorial • elite presence • premium spotlight',
        icon: 'elite',
      },
      {
        eyebrow: 'Places & services',
        title: 'Useful approved visibility keeps the ecosystem practical',
        description: 'Walk places, transport, boarding, pet-friendly venues, and approved services help the platform become useful in daily life.',
        icon: 'partners',
      },
    ],
    moderationTitle: 'Why this layer still needs moderation',
    moderationDescription:
      'Community does not mean chaos. The old project was strongest when it balanced energy with discipline. The new version keeps that principle: useful visibility should still feel curated, approved, and aligned with the brand.',
    moderationBullets: [
      'Official trust stays in registry, verify, and certificate decisions.',
      'Community layers expand usefulness, activity, and owner value without pretending to be the official source of truth.',
      'Everything public should still pass through review before it becomes visible.',
    ],
  },
  bg: {
    eyebrow: 'Общност',
    title: 'Cane Corso търси: дом, партньор, помощ и места',
    description:
      'Започваме от реалната нужда: разплод, нов дом, малки Cane Corso, загубени или намерени, подходящи места и доверени услуги. Всяка публична обява минава през преглед, а чувствителното свързване става чрез администратор.',
    cards: [
      {
        eyebrow: 'Спешна помощ',
        title: 'Загубени / намерени Cane Corso',
        description: 'Силно видими общностни сигнали за загубен или намерен Cane Corso, защитени чрез админ преглед.',
        href: '#cane-corso-intent-listings',
        meta: 'спешно • град • последно видян',
        icon: 'gallery',
      },
      {
        eyebrow: 'Разплод и подбор',
        title: 'Женско търси мъжко / мъжко търси женско',
        description: 'Собственикът публикува какво търси, а контактът и свързването остават през администратор.',
        href: '#cane-corso-intent-listings',
        meta: 'разплод • поверителност • админ връзка',
        icon: 'community',
      },
      {
        eyebrow: 'Нов дом',
        title: 'Осиновяване, малки и отговорна помощ',
        description: 'Заявките за нов дом и видимостта на малки Cane Corso остават отделени от официалния регистър и се показват само след преглед.',
        href: '#cane-corso-intent-listings',
        meta: 'дом • малки • модерация',
        icon: 'owner',
      },
    ] satisfies readonly PageShellCard[],
    worldsTitle: 'Общностни раздели, които си струва да развием',
    worldsDescription:
      'Това са най-ценните идеи от стария проект, запазени в по-подредена архитектура: човешки, полезни и ясно отделени от официалния регистър.',
    worlds: [
      {
        eyebrow: 'FUN • медия',
        title: 'Медия и галерия като истински публичен слой',
        description: 'Снимки, истории, събития и подбрана Cane Corso видимост дават емоция и живот отвъд сухите записи.',
        icon: 'gallery',
      },
      {
        eyebrow: 'Разплод и свързване',
        title: 'Подборът е общностен, не официален слой',
        description: 'Бъдещият поток за свързване може да помага на собственици и развъдници, без да се смесва с регистъра или сертификатите.',
        icon: 'community',
      },
      {
        eyebrow: 'Нов дом',
        title: 'Новият дом заслужава ясен и достоен път',
        description: 'Секцията за нов дом помага при реални Cane Corso нужди с грижа, модерация и човешка видимост.',
        icon: 'owner',
      },
      {
        eyebrow: 'Насоки за собственици',
        title: 'Практични насоки за по-полезна общност',
        description: 'Общността става по-силна, когато е свързана със знания, помощ, чести въпроси и ясни правила.',
        href: '/knowledge',
        meta: 'Знания • помощ • правила',
        icon: 'knowledge',
      },
      {
        eyebrow: 'Елит и видимост',
        title: 'Премиум акценти за най-доброто от породата',
        description: 'Куриран редакционен слой може да отличава силно Cane Corso присъствие, без да замества регистъра.',
        href: '/registry',
        meta: 'Подбор • елит • премиум видимост',
        icon: 'elite',
      },
      {
        eyebrow: 'Места и услуги',
        title: 'Одобрени места и услуги за практична екосистема',
        description: 'Места за разходка, транспорт, престой и подходящи услуги превръщат платформата в реален помощник.',
        icon: 'partners',
      },
    ],
    moderationTitle: 'Защо този слой остава под модерация',
    moderationDescription:
      'Общността не означава хаос. Публичната видимост трябва да бъде полезна, но и подредена, прегледана и съобразена с премиум идентичността на платформата.',
    moderationBullets: [
      'Официалното доверие остава в регистъра, проверката и сертификатните решения.',
      'Общностните слоеве добавят живот, полезност и стойност за собствениците, без да се представят за официален източник на истина.',
      'Всяко публично съдържание трябва да мине през преглед, преди да стане видимо.',
    ],
  },
  it: {
    eyebrow: 'Community hub',
    title: 'Cane Corso cerca: casa, match, aiuto e luoghi',
    description:
      'Si parte dal bisogno reale: match, nuova casa, cuccioli, Cane Corso smarriti o trovati, luoghi adatti e servizi fidati. Ogni annuncio pubblico resta revisionato e i collegamenti sensibili passano dall’amministratore.',
    cards: [
      {
        eyebrow: 'Media',
        title: 'Galleria, momenti e presenza editoriale',
        description: 'Un layer pubblico premium per momenti Cane Corso, editoriali, eventi e media community che rende viva la piattaforma.',
        href: '#cane-corso-intent-listings',
        meta: 'Galleria • momenti • vita editoriale',
        icon: 'gallery',
      },
      {
        eyebrow: 'Breeding & match',
        title: 'Futura logica match con contesto owner',
        description: 'Un layer curato di match e breeding può esistere come layer community moderato, chiaramente separato dall’official registry trust.',
        href: '#cane-corso-intent-listings',
        meta: 'Match • breeding • visibilità moderata',
        icon: 'community',
      },
      {
        eyebrow: 'New home',
        title: 'Un percorso umano di rehoming e supporto',
        description: 'La logica new home dovrebbe supportare visibilità, cura e moderazione trusted quando un Cane Corso ha bisogno di un ambiente migliore.',
        href: '#cane-corso-intent-listings',
        meta: 'New home • cura • moderazione',
        icon: 'owner',
      },
    ] satisfies readonly PageShellCard[],
    worldsTitle: 'Mondi community da preservare dal vecchio progetto',
    worldsDescription:
      'Queste sono le idee legacy più preziose da tenere nella nuova architettura così la piattaforma resta umana, utile e degna di essere visitata di nuovo.',
    worlds: [
      {
        eyebrow: 'FUN • media',
        title: 'Media e galleria dovrebbero sembrare un vero layer pubblico',
        description: 'Foto, storie, eventi e visibilità raffinata Cane Corso aggiungono valore emotivo al prodotto e aiutano la razza a sentirsi presente oltre gli elenchi.',
        icon: 'gallery',
      },
      {
        eyebrow: 'Breeding Hub',
        title: 'La logica match appartiene al layer community, non al nucleo official trust',
        description: 'Il futuro match flow può aiutare proprietari e allevatori senza essere confuso con la pubblicazione nel registro o la fiducia del certificato.',
        icon: 'community',
      },
      {
        eyebrow: 'New home',
        title: 'Il rehoming di supporto merita un posto dignitoso',
        description: 'La sezione new home aiuta la piattaforma a servire bisogni reali del Cane Corso con cura, moderazione e visibilità umana.',
        icon: 'owner',
      },
      {
        eyebrow: 'Owner guide',
        title: 'La community utile dovrebbe restare collegata alla guida pratica per il proprietario',
        description: 'La community diventa più forte quando si collega direttamente a owner help, knowledge, FAQ e regole di pubblicazione chiare.',
        href: '/knowledge',
        meta: 'Owner guide • FAQ • aiuto',
        icon: 'knowledge',
      },
      {
        eyebrow: 'Elite e visibilità',
        title: 'Gli accenti premium possono celebrare il meglio della razza',
        description: 'Un layer editoriale curato può mettere in luce la presenza elite Cane Corso senza sostituire le decisioni official trust del registro.',
        href: '/registry',
        meta: 'Editoriale • elite presence • premium spotlight',
        icon: 'elite',
      },
      {
        eyebrow: 'Luoghi e servizi',
        title: 'La visibilità approvata rende l’ecosistema pratico',
        description: 'Luoghi per passeggiare, trasporto, boarding, venue pet-friendly e servizi approvati rendono la piattaforma utile nella vita quotidiana.',
        icon: 'partners',
      },
    ],
    moderationTitle: 'Perché anche questo layer ha ancora bisogno di moderazione',
    moderationDescription:
      'Community non significa caos. Il vecchio progetto era più forte quando bilanciava energia e disciplina. La nuova versione mantiene lo stesso principio: la visibilità utile dovrebbe sembrare comunque curata, approvata e allineata al brand.',
    moderationBullets: [
      'L’official trust resta in registry, verify e decisioni sul certificato.',
      'I layer community espandono utilità, attività e valore per il proprietario senza fingersi fonte ufficiale di verità.',
      'Ogni contenuto pubblico dovrebbe comunque passare da review prima di diventare visibile.',
    ],
  },
} as const;

export default async function CommunityPage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const document = await getPublishedEcosystemDirectoryDocument();

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cards={copy.cards}
      actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'}
      accentLabel={copy.eyebrow}
      helpHref="/guide?topic=community#community"
      helpLabel={locale === 'bg' ? 'Помощ' : locale === 'it' ? 'Aiuto' : 'Help'}
      visualSrc="/brand/editorial-member-shadow-eye.jpg"
      visualAlt="Community and FUN editorial visual"
    >
      <EcosystemDirectory document={document} locale={locale} applyHref="/ecosystem" />

      <CommunityDiscoveryExperience
        locale={locale}
        publishedCount={document.summary.total}
        countryCount={document.summary.countries}
        featuredCount={document.summary.featured}
      />

      <section className="section-block section-block--support community-worlds-section" id="community-worlds" aria-label="Community worlds">
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.eyebrow}</div>
          <h2 className="section-block__title">{copy.worldsTitle}</h2>
          <p className="section-block__description">{copy.worldsDescription}</p>
        </div>

        <div className="section-card-grid section-card-grid--three">
          {copy.worlds.map((world) => (
            <SectionCard key={world.title} {...world} actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'} />
          ))}
        </div>
      </section>

      <section className="content-card faq-bullet-panel">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.moderationTitle}</h2>
        <p>{copy.moderationDescription}</p>
        <ul className="platform-help-list">
          {copy.moderationBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
