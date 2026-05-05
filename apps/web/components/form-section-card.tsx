import type { PropsWithChildren } from 'react';

interface FormSectionCardProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function FormSectionCard({ title, description, children }: FormSectionCardProps) {
  return (
    <section className="form-section-card">
      <div className="form-section-head">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}
