import type { Locale } from '@/lib/i18n';

type TrustLane = {
  title: string;
  state: string;
  description: string;
};

const copyByLocale: Record<Locale, {
  ariaLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  sealTitle: string;
  sealNote: string;
  lanes: readonly TrustLane[];
}> = {
  en: {
    ariaLabel: 'Verify and certificate trust continuity',
    eyebrow: 'Official trust continuity',
    title: 'Verify, Registry, and USG Certificate — one clear system',
    description:
      'This layer helps visitors read the public result correctly: Registry shows approved public identity, Verify confirms an issued certificate record, and the USG Certificate remains a separate USG review decision.',
    sealTitle: 'Verified Trust',
    sealNote: 'public continuity',
    lanes: [
      {
        title: 'Verify',
        state: 'Public check',
        description: 'Verify confirms the public result and connects it to the Registry and certificate trust layers.',
      },
      {
        title: 'USG Certificate',
        state: 'Official document',
        description: 'The certificate is a separate USG decision and does not appear only because a Cane Corso is visible in the Registry.',
      },
      {
        title: 'Registry',
        state: 'Published identity',
        description: 'The Registry profile shows approved public identity, photos, and core profile information.',
      },
      {
        title: 'Trust continuity',
        state: 'One system',
        description: 'Visitors should clearly understand Registry → Verify → Certificate without mixing the decisions.',
      },
    ],
  },
  bg: {
    ariaLabel: 'Връзка между проверка и сертификатно доверие',
    eyebrow: 'Официална връзка на доверие',
    title: 'Проверка, Регистър и USG сертификат — една ясна система',
    description:
      'Този слой помага публичният резултат да се чете правилно: Регистърът показва одобрена публична идентичност, Проверка потвърждава издаден сертификатен запис, а USG сертификатът остава отделно USG решение за преглед.',
    sealTitle: 'Потвърдено доверие',
    sealNote: 'публична връзка',
    lanes: [
      {
        title: 'Проверка',
        state: 'Публична проверка',
        description: 'Проверката потвърждава публичния резултат и връзката към Регистъра и сертификатния слой.',
      },
      {
        title: 'USG сертификат',
        state: 'Официален документ',
        description: 'Сертификатът е отделно USG решение и не се появява само защото Cane Corso е видимо в Регистъра.',
      },
      {
        title: 'Регистър',
        state: 'Публикувана идентичност',
        description: 'Профилът в Регистъра показва одобрена публична идентичност, снимки и основни данни.',
      },
      {
        title: 'Връзка на доверие',
        state: 'Една система',
        description: 'Посетителят трябва ясно да разбира Регистър → Проверка → Сертификат без смесване на решенията.',
      },
    ],
  },
  it: {
    ariaLabel: 'Continuità tra verifica e fiducia del certificato',
    eyebrow: 'Continuità ufficiale di fiducia',
    title: 'Verifica, Registro e Certificato USG — un sistema chiaro',
    description:
      'Questo livello aiuta a leggere correttamente il risultato pubblico: il Registro mostra identità pubblica approvata, Verifica conferma un record certificato emesso e il Certificato USG resta una decisione separata della revisione USG.',
    sealTitle: 'Fiducia verificata',
    sealNote: 'continuità pubblica',
    lanes: [
      {
        title: 'Verifica',
        state: 'Controllo pubblico',
        description: 'La verifica conferma il risultato pubblico e lo collega ai livelli Registro e certificato.',
      },
      {
        title: 'Certificato USG',
        state: 'Documento ufficiale',
        description: 'Il certificato è una decisione USG separata e non appare solo perché un Cane Corso è visibile nel Registro.',
      },
      {
        title: 'Registro',
        state: 'Identità pubblicata',
        description: 'Il profilo nel Registro mostra identità pubblica approvata, foto e informazioni principali.',
      },
      {
        title: 'Continuità di fiducia',
        state: 'Un sistema',
        description: 'Il visitatore deve capire chiaramente Registro → Verifica → Certificato senza confondere le decisioni.',
      },
    ],
  },
};

export function VerifyCertificateTrustContinuityPanel({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <section className="verify-certificate-trust-continuity" aria-label={copy.ariaLabel}>
      <div className="verify-certificate-trust-continuity__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="verify-certificate-trust-continuity__mark">
          <span>USG</span>
          <strong>{copy.sealTitle}</strong>
          <small>{copy.sealNote}</small>
        </div>
      </div>

      <div className="verify-certificate-trust-continuity__grid">
        {copy.lanes.map((lane) => (
          <article className="verify-certificate-trust-continuity__lane" key={lane.title}>
            <span>{lane.title}</span>
            <strong>{lane.state}</strong>
            <p>{lane.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
