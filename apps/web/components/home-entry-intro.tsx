'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { LocaleSwitcher } from '@/components/locale-switcher';

const INTRO_STORAGE_KEY = 'usg-entry-intro-seen';

interface HomeEntryIntroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  skipLabel: string;
}

export function HomeEntryIntro({ eyebrow, title, subtitle, skipLabel }: HomeEntryIntroProps) {
  const [phase, setPhase] = useState<'intro' | 'revealing' | 'revealed'>('intro');
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (window.sessionStorage.getItem(INTRO_STORAGE_KEY) === '1') {
      setPhase('revealed');
      return undefined;
    }

    timeouts.current = [
      window.setTimeout(() => setPhase('revealing'), 1700),
      window.setTimeout(() => {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
        setPhase('revealed');
      }, 2550),
    ];

    return () => {
      timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
      timeouts.current = [];
    };
  }, []);

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    }

    timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    timeouts.current = [];
    setPhase('revealed');
  };

  if (phase === 'revealed') {
    return null;
  }

  return (
    <div className={`home-intro-overlay${phase === 'revealing' ? ' is-revealing' : ''}`}>
      <div className="home-intro-overlay__veil" />
      <div className="home-intro-overlay__spotlight home-intro-overlay__spotlight--left" />
      <div className="home-intro-overlay__spotlight home-intro-overlay__spotlight--right" />
      <div className="home-intro-overlay__grain" />

      <div className="home-intro-overlay__utility">
        <LocaleSwitcher />
      </div>

      <div className="home-intro-overlay__inner">
        <div className="home-intro-overlay__copy">
          <div className="home-intro-overlay__eyebrow">{eyebrow}</div>
          <h1 className="home-intro-overlay__title">{title}</h1>
          <p className="home-intro-overlay__subtitle">{subtitle}</p>
        </div>

        <div className="home-intro-overlay__seal-wrap" aria-hidden="true">
          <Image
            src="/brand/seal/usg-seal-wide.png"
            alt="UNICO SUO GENERE seal"
            width={860}
            height={300}
            className="home-intro-overlay__seal"
            priority
          />
        </div>
      </div>

      <button type="button" className="home-intro-overlay__skip" onClick={handleSkip}>
        {skipLabel}
      </button>
    </div>
  );
}
