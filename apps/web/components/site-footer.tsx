import Image from 'next/image';
import { getCurrentLocale } from '@/lib/locale.server';
import { getDictionary } from '@/lib/i18n';

export async function SiteFooter() {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__seal">
            <Image src="/brand/seal/usg-official-seal.png" alt="Official UNICO SUO GENERE seal" width={84} height={84} />
          </div>
          <div className="site-footer__brand-copy">
            <p className="site-footer__eyebrow">{t.site.brandEyebrow}</p>
            <p className="site-footer__title">{t.site.footerTitle}</p>
            <p className="site-footer__statement">{t.site.brandStatement}</p>
            <p className="site-footer__text">{t.site.footerText}</p>
          </div>
        </div>

        <div className="site-footer__meta">
          <span>{t.site.footerMetaA}</span>
          <span>{t.site.footerMetaB}</span>
          <span className="site-footer__trademark">{t.site.trademark}</span>
        </div>
      </div>
    </footer>
  );
}
