const lanes = [
  {
    title: 'Registry публикация',
    state: 'Официален публичен слой',
    description:
      'Registry показва одобрената публична идентичност на Cane Corso. Публикацията не е автоматичен USG сертификат.',
  },
  {
    title: 'USG сертификат',
    state: 'Отделно админ решение',
    description:
      'Сертификатът се издава отделно след преглед. Verify и certificate документът трябва да останат синхронизирани.',
  },
  {
    title: 'USG Gallery',
    state: 'Curated showcase',
    description:
      'Галерията е избран showcase слой. Owner снимките не влизат автоматично там без админ селекция.',
  },
  {
    title: 'Owner source data',
    state: 'Източник, не публичен финал',
    description:
      'Данните от собственика са база за review. Админът решава кое става публично и кое остава вътрешно.',
  },
];

const checklist = [
  'Провери дали Registry профилът има ясна идентичност и публична снимка.',
  'Провери дали admin assessment обяснява решението преди сертификат.',
  'Провери дали Verify пътят е логичен само при наличен certificate/verification code.',
  'Провери дали Gallery изборът е отделен от Registry снимките.',
];

export function AdminRegistryEvidencePolishPanel() {
  return (
    <section className="admin-registry-evidence-polish" aria-label="Admin Registry evidence clarity">
      <div className="admin-registry-evidence-polish__head">
        <div>
          <span className="eyebrow-label">Admin Registry evidence</span>
          <h2>Контролен слой за Registry, сертификат и Gallery</h2>
          <p>
            Този панел е визуален guardrail за админ работа. Той не променя логиката, а напомня
            кои решения са отделни: Registry публикация, USG сертификат, Verify и USG Gallery.
          </p>
        </div>
        <div className="admin-registry-evidence-polish__seal">
          <span>USG</span>
          <strong>Review Control</strong>
          <small>presentation-only</small>
        </div>
      </div>

      <div className="admin-registry-evidence-polish__lanes">
        {lanes.map((lane) => (
          <article className="admin-registry-evidence-polish__lane" key={lane.title}>
            <span>{lane.title}</span>
            <strong>{lane.state}</strong>
            <p>{lane.description}</p>
          </article>
        ))}
      </div>

      <div className="admin-registry-evidence-polish__checklist">
        <h3>Преди финално действие</h3>
        <ul>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
