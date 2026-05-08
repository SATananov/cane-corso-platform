const lanes = [
  {
    title: 'Публикация в Регистъра',
    state: 'Официален публичен слой',
    description:
      'Регистърът показва одобрената публична идентичност на Cane Corso. Публикацията не е автоматичен USG сертификат.',
  },
  {
    title: 'USG сертификат',
    state: 'Отделно админ решение',
    description:
      'Сертификатът се издава отделно след преглед. Verify и certificate документът трябва да останат синхронизирани.',
  },
  {
    title: 'USG Галерия',
    state: 'Подбрано представяне',
    description:
      'Галерията е подбран слой за представяне. Снимките от собственика не влизат автоматично там без администраторски избор.',
  },
  {
    title: 'Данни от собственика',
    state: 'Източник, не публичен финал',
    description:
      'Данните от собственика са база за преглед. Администраторът решава кое става публично и кое остава вътрешно.',
  },
];

const checklist = [
  'Провери дали профилът в Регистъра има ясна идентичност и публична снимка.',
  'Провери дали администраторската оценка обяснява решението преди сертификат.',
  'Провери дали пътят за проверка е логичен само при наличен сертификат или код за проверка.',
  'Провери дали изборът за Галерията е отделен от снимките в Регистъра.',
];

export function AdminRegistryEvidencePolishPanel() {
  return (
    <section className="admin-registry-evidence-polish" aria-label="Яснота на доказателствата в админ Регистъра">
      <div className="admin-registry-evidence-polish__head">
        <div>
          <span className="eyebrow-label">Доказателства в админ Регистъра</span>
          <h2>Контролен слой за Регистър, сертификат и Галерия</h2>
          <p>
            Този панел е визуална защитна рамка за администраторска работа. Той не променя логиката, а напомня
            кои решения са отделни: публикация в Регистъра, USG сертификат, проверка и USG Галерия.
          </p>
        </div>
        <div className="admin-registry-evidence-polish__seal">
          <span>USG</span>
          <strong>Контрол на прегледа</strong>
          <small>само представяне</small>
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
