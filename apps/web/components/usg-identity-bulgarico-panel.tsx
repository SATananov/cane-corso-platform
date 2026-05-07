import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface UsgIdentityBulgaricoPanelProps {
  locale: Locale;
  variant?: 'platform' | 'knowledge';
}

const copyByLocale = {
  en: {
    eyebrow: 'USG identity',
    title: 'Unico Suo Genere: trust, education, and honest Cane Corso visibility',
    description:
      'USG exists for owners who want a serious place to present a Cane Corso with dignity, evidence, and context. The platform respects official kennel systems, but it also recognizes that not every real family line has complete paperwork.',
    sealTitle: 'ONE OF A KIND',
    sealText: 'A premium platform identity, not a replacement for official kennel authority.',
    surfacesTitle: 'What each USG surface does',
    surfaces: [
      ['Registry', 'The public identity layer for reviewed and published Cane Corso profiles.'],
      ['Certificate', 'A platform trust document showing reviewed information, evidence level, and admin decision.'],
      ['Verify', 'The independent check path for a USG certificate code and public trust state.'],
      ['Gallery', 'A curated showcase for selected profiles; it is not automatic proof of official pedigree.'],
      ['Community', 'Moderated practical help: match requests, adoption, lost/found, places, services, and transport.'],
      ['Knowledge', 'The educational layer that separates official facts, owner guidance, and USG observations.'],
    ],
    certificateTitle: 'USG Certificate boundary',
    certificateDescription:
      'The USG Certificate is not a pedigree, FCI document, club evaluation, judge report, veterinary certificate, or official kennel registration. It is a platform certificate for presentation and trust inside the USG ecosystem.',
    certificateBullets: [
      'It can show that a profile was reviewed by USG and connected to the Registry / Verify path.',
      'It can record available evidence: pedigree documents, family line, owner history, photos, and admin notes.',
      'It should never claim purebred proof when the evidence does not support that claim.',
    ],
    proofTitle: 'Evidence levels, not value levels',
    proofDescription:
      'USG should never say that a Cane Corso without official paperwork is worthless or automatically false. It should show what is documented and what remains observational.',
    proofLevels: [
      ['Officially documented profile', 'Recognized pedigree or formal documents are available for review.'],
      ['Documented family line', 'Known parents, generations, photos, or owner history exist, but the official chain may be incomplete.'],
      ['Observed Cane Corso profile', 'The profile is presented through type, photos, structure, story, and admin observation.'],
      ['Pending / unconfirmed', 'Not enough information yet, or the profile is still waiting for review.'],
    ],
    bulgaricoTitle: 'USG Bulgarico',
    bulgaricoDescription:
      'USG Bulgarico is a Bulgarian observational reading of Cane Corso. It is not a new breed, not an official standard, and not a national replacement for Cane Corso Italiano. It is a respectful research and documentation framework for possible local phenotype directions.',
    bulgaricoBullets: [
      'Officially, Cane Corso remains one breed: Cane Corso Italiano.',
      'Based on nearly ten years of owner observation, USG may document approximately three working phenotype directions in Bulgaria as a hypothesis, not as final fact.',
      'Color, line, origin, structure, and selection can be considered together, but color alone does not prove type, quality, origin, or health.',
      'The framework must avoid blame toward breeders, owners, lines, or countries.',
    ],
    actions: [
      { href: '/knowledge/usg-identity-and-platform-trust', label: 'Read USG identity' },
      { href: '/knowledge/usg-bulgarico-observational-framework', label: 'Read USG Bulgarico' },
      { href: '/guide?topic=usg-identity#usg-identity', label: 'Open guide' },
    ],
  },
  bg: {
    eyebrow: 'USG идентичност',
    title: 'Unico Suo Genere: доверие, знание и честна Cane Corso видимост',
    description:
      'USG съществува за собственици, които искат сериозно място да представят Cane Corso с достойнство, доказуемост и контекст. Платформата уважава официалните киноложки системи, но разбира и реалността, че не всяка истинска семейна линия има пълни документи.',
    sealTitle: 'ЕДИНСТВЕНО ПО РОДА СИ',
    sealText: 'Премиум идентичност на платформата, не заместител на официална киноложка власт.',
    surfacesTitle: 'Какво прави всеки USG слой',
    surfaces: [
      ['Регистър', 'Публичният слой за идентичност на прегледани и публикувани Cane Corso профили.'],
      ['Сертификат', 'Платформен документ за доверие, който показва прегледана информация, ниво на доказуемост и админ решение.'],
      ['Проверка', 'Самостоятелен път за проверка на USG сертификатен код и публично състояние на доверие.'],
      ['Галерия', 'Подбрана витрина за избрани профили; не е автоматично доказателство за официално родословие.'],
      ['Общност', 'Модерирана практическа помощ: заплождане, осиновяване, изгубени/намерени, места, услуги и транспорт.'],
      ['Знания', 'Образователният слой, който разделя официални факти, насоки за собственици и USG наблюдения.'],
    ],
    certificateTitle: 'Граница на USG сертификата',
    certificateDescription:
      'USG сертификатът не е родословие, FCI документ, клубна оценка, съдийски доклад, ветеринарен сертификат или официална киноложка регистрация. Той е платформен сертификат за представяне и доверие вътре в USG екосистемата.',
    certificateBullets: [
      'Може да покаже, че профилът е прегледан от USG и е свързан с Регистър / Проверка.',
      'Може да отбележи наличната доказуемост: родословни документи, семейна линия, история от собственика, снимки и админ бележки.',
      'Не трябва да твърди чистопородно доказване, когато представената информация не го подкрепя.',
    ],
    proofTitle: 'Нива на доказуемост, не нива на стойност',
    proofDescription:
      'USG не трябва да казва, че Cane Corso без официални документи е без стойност или автоматично неистинско. Платформата трябва да показва какво е документирано и какво остава наблюдателно.',
    proofLevels: [
      ['Официално документиран профил', 'Има признато родословие или формални документи за преглед.'],
      ['Документирана семейна линия', 'Има известни родители, поколения, снимки или история от собственика, но официалната верига може да е непълна.'],
      ['Наблюдателен Cane Corso профил', 'Профилът се представя чрез тип, снимки, структура, история и админ наблюдение.'],
      ['Чакащ / непотвърден', 'Все още няма достатъчно информация или профилът чака преглед.'],
    ],
    bulgaricoTitle: 'USG Bulgarico',
    bulgaricoDescription:
      'USG Bulgarico е български наблюдателен прочит на Cane Corso. Това не е нова порода, не е официален стандарт и не е национален заместител на Cane Corso Italiano. Това е уважителна рамка за изследване и документиране на възможни локални фенотипни посоки.',
    bulgaricoBullets: [
      'Официално Cane Corso остава една порода: Cane Corso Italiano.',
      'На база почти десет години лични наблюдения USG може да документира приблизително три работни фенотипни посоки в България като хипотеза, не като окончателен факт.',
      'Цвят, линия, произход, структура и селекция могат да се разглеждат заедно, но цветът сам по себе си не доказва тип, качество, произход или здраве.',
      'Рамката трябва да избягва обвинения към развъдчици, собственици, линии или държави.',
    ],
    actions: [
      { href: '/knowledge/usg-identity-and-platform-trust', label: 'Прочети за USG' },
      { href: '/knowledge/usg-bulgarico-observational-framework', label: 'Прочети USG Bulgarico' },
      { href: '/guide?topic=usg-identity#usg-identity', label: 'Отвори наръчника' },
    ],
  },
  it: {
    eyebrow: 'Identità USG',
    title: 'Unico Suo Genere: fiducia, conoscenza e visibilità Cane Corso onesta',
    description:
      'USG esiste per proprietari che vogliono presentare un Cane Corso con dignità, prove e contesto. La piattaforma rispetta i sistemi cinofili ufficiali, ma riconosce anche che non ogni linea familiare reale ha documentazione completa.',
    sealTitle: 'UNICO SUO GENERE',
    sealText: 'Identità premium della piattaforma, non sostituto dell’autorità cinofila ufficiale.',
    surfacesTitle: 'Cosa fa ogni livello USG',
    surfaces: [
      ['Registro', 'Livello pubblico di identità per profili Cane Corso revisionati e pubblicati.'],
      ['Certificato', 'Documento trust della piattaforma con informazioni revisionate, livello di evidenza e decisione admin.'],
      ['Verifica', 'Percorso indipendente per controllare codice certificato USG e stato pubblico di fiducia.'],
      ['Galleria', 'Showcase curato per profili selezionati; non è prova automatica di pedigree ufficiale.'],
      ['Community', 'Aiuto pratico moderato: match, adozione, smarriti/trovati, luoghi, servizi e trasporto.'],
      ['Conoscenza', 'Layer educativo che separa fatti ufficiali, guida proprietari e osservazioni USG.'],
    ],
    certificateTitle: 'Confine del certificato USG',
    certificateDescription:
      'Il certificato USG non è pedigree, documento FCI, valutazione di club, giudizio ufficiale, certificato veterinario o registrazione cinofila ufficiale. È un certificato di presentazione e fiducia dentro l’ecosistema USG.',
    certificateBullets: [
      'Può mostrare che un profilo è stato revisionato da USG e collegato a Registro / Verifica.',
      'Può registrare le evidenze disponibili: pedigree, linea familiare, storia del proprietario, foto e note admin.',
      'Non deve dichiarare purezza di razza quando le evidenze non lo supportano.',
    ],
    proofTitle: 'Livelli di evidenza, non livelli di valore',
    proofDescription:
      'USG non deve dire che un Cane Corso senza documenti ufficiali non vale o sia automaticamente falso. Deve mostrare cosa è documentato e cosa resta osservativo.',
    proofLevels: [
      ['Profilo ufficialmente documentato', 'Pedigree riconosciuto o documenti formali disponibili per revisione.'],
      ['Linea familiare documentata', 'Genitori, generazioni, foto o storia sono noti, ma la catena ufficiale può essere incompleta.'],
      ['Profilo Cane Corso osservato', 'Il profilo è presentato tramite tipo, foto, struttura, storia e osservazione admin.'],
      ['In attesa / non confermato', 'Informazioni insufficienti o profilo ancora in revisione.'],
    ],
    bulgaricoTitle: 'USG Bulgarico',
    bulgaricoDescription:
      'USG Bulgarico è una lettura osservativa bulgara del Cane Corso. Non è una nuova razza, non è uno standard ufficiale e non sostituisce Cane Corso Italiano. È una cornice rispettosa per documentare possibili direzioni fenotipiche locali.',
    bulgaricoBullets: [
      'Ufficialmente il Cane Corso resta una sola razza: Cane Corso Italiano.',
      'Sulla base di quasi dieci anni di osservazione, USG può documentare circa tre direzioni fenotipiche operative in Bulgaria come ipotesi, non come fatto definitivo.',
      'Colore, linea, origine, struttura e selezione possono essere letti insieme, ma il colore da solo non prova tipo, qualità, origine o salute.',
      'La cornice deve evitare accuse verso allevatori, proprietari, linee o paesi.',
    ],
    actions: [
      { href: '/knowledge/usg-identity-and-platform-trust', label: 'Leggi identità USG' },
      { href: '/knowledge/usg-bulgarico-observational-framework', label: 'Leggi USG Bulgarico' },
      { href: '/guide?topic=usg-identity#usg-identity', label: 'Apri guida' },
    ],
  },
} as const;

export function UsgIdentityBulgaricoPanel({ locale, variant = 'platform' }: UsgIdentityBulgaricoPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <section className={`usg-identity-framework usg-identity-framework--${variant}`} aria-label={copy.title}>
      <div className="usg-identity-framework__hero">
        <div className="usg-identity-framework__seal" aria-hidden="true">
          <Image src="/brand/seal/usg-official-seal-compact.png" alt="" width={148} height={148} />
        </div>
        <div className="usg-identity-framework__intro">
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <aside className="usg-identity-framework__seal-note">
          <strong>{copy.sealTitle}</strong>
          <span>{copy.sealText}</span>
        </aside>
      </div>

      <div className="usg-identity-framework__grid usg-identity-framework__grid--surfaces">
        <article className="usg-identity-card usg-identity-card--wide">
          <span className="usg-identity-card__eyebrow">{copy.surfacesTitle}</span>
          <div className="usg-surface-list">
            {copy.surfaces.map(([label, text]) => (
              <div className="usg-surface-item" key={label}>
                <strong>{label}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="usg-identity-card">
          <span className="usg-identity-card__eyebrow">{copy.certificateTitle}</span>
          <h3>{copy.certificateTitle}</h3>
          <p>{copy.certificateDescription}</p>
          <ul>
            {copy.certificateBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="usg-identity-framework__grid">
        <article className="usg-identity-card">
          <span className="usg-identity-card__eyebrow">{copy.proofTitle}</span>
          <h3>{copy.proofTitle}</h3>
          <p>{copy.proofDescription}</p>
          <div className="usg-proof-list">
            {copy.proofLevels.map(([label, text]) => (
              <div key={label}>
                <strong>{label}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="usg-identity-card usg-identity-card--gold">
          <span className="usg-identity-card__eyebrow">{copy.bulgaricoTitle}</span>
          <h3>{copy.bulgaricoTitle}</h3>
          <p>{copy.bulgaricoDescription}</p>
          <ul>
            {copy.bulgaricoBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="usg-identity-framework__actions">
        {copy.actions.map((action) => (
          <Link className="button-ghost small" href={action.href} key={action.href}>
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
