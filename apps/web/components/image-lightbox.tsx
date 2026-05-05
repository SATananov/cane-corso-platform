'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

interface ImageLightboxProps {
  src: string;
  alt: string;
  imageClassName?: string;
  triggerClassName?: string;
  openLabel?: string;
}

function getHeaderOffset() {
  if (typeof document === 'undefined') {
    return 18;
  }

  const header = document.querySelector<HTMLElement>('.site-header');

  if (!header) {
    return 18;
  }

  const headerBox = header.getBoundingClientRect();
  return Math.max(12, Math.ceil(headerBox.bottom + 10));
}

export function ImageLightbox({ src, alt, imageClassName, triggerClassName, openLabel }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [topOffset, setTopOffset] = useState(18);
  const titleId = useId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const syncTopOffset = () => {
      setTopOffset(getHeaderOffset());
    };

    syncTopOffset();

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', syncTopOffset);
    window.addEventListener('scroll', syncTopOffset, { passive: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', syncTopOffset);
      window.removeEventListener('scroll', syncTopOffset);
    };
  }, [isOpen]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  const lightboxMarkup = isOpen ? (
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{ '--image-lightbox-top': `${topOffset}px` } as CSSProperties}
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="image-lightbox__backdrop" aria-hidden="true" />
      <div className="image-lightbox__panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="image-lightbox__toolbar">
          <div>
            <span className="eyebrow-label">UNICO SUO GENERE</span>
            <h2 id={titleId}>{alt}</h2>
          </div>
          <button type="button" className="image-lightbox__close" onClick={() => setIsOpen(false)} aria-label="Close image preview">
            ×
          </button>
        </div>
        <div className="image-lightbox__stage">
          <img src={src} alt={alt} className="image-lightbox__image" draggable={false} />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        className={`image-lightbox-trigger${triggerClassName ? ` ${triggerClassName}` : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label={openLabel || alt}
      >
        <img src={src} alt={alt} className={imageClassName} />
        <span className="image-lightbox-trigger__hint" aria-hidden="true">↗</span>
      </button>

      {isMounted && lightboxMarkup ? createPortal(lightboxMarkup, document.body) : null}
    </>
  );
}
