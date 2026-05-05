const trustLanes = [
  {
    title: 'Verify',
    state: 'Публична проверка',
    description:
      'Verify потвърждава публичния резултат и връзката към официалния Registry / certificate слой.',
  },
  {
    title: 'USG Certificate',
    state: 'Официален документ',
    description:
      'Сертификатът е отделно админ решение и не се появява само защото Cane Corso е в Registry.',
  },
  {
    title: 'Registry',
    state: 'Публикувана идентичност',
    description:
      'Registry профилът показва публично одобрена идентичност, снимки и основни данни.',
  },
  {
    title: 'Trust continuity',
    state: 'Една система',
    description:
      'Потребителят трябва ясно да разбира връзката Registry → Verify → Certificate без смесване на решенията.',
  },
];

export function VerifyCertificateTrustContinuityPanel() {
  return (
    <section className="verify-certificate-trust-continuity" aria-label="Verify and certificate trust continuity">
      <div className="verify-certificate-trust-continuity__head">
        <div>
          <span className="eyebrow-label">Official trust continuity</span>
          <h2>Verify, Registry и USG сертификат — една ясна система</h2>
          <p>
            Този слой помага публичният резултат да се чете правилно: Registry показва одобрена
            идентичност, Verify потвърждава публичната проверка, а USG сертификатът остава отделно
            официално админ решение.
          </p>
        </div>
        <div className="verify-certificate-trust-continuity__mark">
          <span>USG</span>
          <strong>Verified Trust</strong>
          <small>public continuity</small>
        </div>
      </div>

      <div className="verify-certificate-trust-continuity__grid">
        {trustLanes.map((lane) => (
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
