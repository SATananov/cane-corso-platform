interface OverviewStatCardProps {
  label: string;
  value: string;
  detail?: string;
  tone?: "gold" | "ivory";
}

export function OverviewStatCard({
  label,
  value,
  detail,
  tone = "ivory",
}: OverviewStatCardProps) {
  return (
    <article className={`overview-stat overview-stat--${tone}`}>
      <span className="overview-stat__label">{label}</span>
      <strong className="overview-stat__value">{value}</strong>
      {detail ? <span className="overview-stat__detail">{detail}</span> : null}
    </article>
  );
}
