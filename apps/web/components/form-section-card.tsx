import type { PropsWithChildren } from 'react';

interface FormSectionCardProps extends PropsWithChildren {
  title: string;
  description: string;
  id?: string;
}

export function FormSectionCard({ title, description, id, children }: FormSectionCardProps) {
  return (
    <section className="form-section-card" id={id}>
      <div className="form-section-head">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}
