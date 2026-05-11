'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DogLifecycleStatus, DogMeasurementRecord, DogSex } from '@cane-corso-platform/contracts';
import { listDogMeasurements } from '@/lib/api/dog-measurements.client';
import { ApiRequestError } from '@/lib/api/fetcher';
import { buildFciStandardConformityDocument } from '@/lib/fci-standard-conformity';
import type { Locale } from '@/lib/i18n';

interface UsgAuthenticityCheckPanelProps {
  locale: Locale;
  dogId?: string;
  dogName?: string | null;
  sex: DogSex;
  dateOfBirth?: string | null;
  color?: string | null;
  city?: string | null;
  country?: string | null;
  shortDescription?: string | null;
  mainImageUrl?: string | null;
  galleryImageCount: number;
  pedigreeFilledCount: number;
  pedigreePhotoCount: number;
  lifecycleStatus: DogLifecycleStatus;
  hasPublication: boolean;
  hasCertificate: boolean;
}

type AuthenticitySignalKey = 'profile' | 'photos' | 'measurements' | 'standard' | 'pedigree' | 'human_review';

type NextAuthenticityActionKey = 'profile' | 'photos' | 'measurements' | 'pedigree' | 'review';

type AuthenticityQualificationKey = 'ready' | 'collecting' | 'weak';

type AuthenticityConfidenceKey = 'low' | 'medium' | 'high';

type AuthenticitySignal = {
  key: AuthenticitySignalKey;
  label: string;
  value: string;
  description: string;
  score: number;
};

const copyByLocale = {
  en: {
    eyebrow: 'USG authenticity check',
    title: 'Check visual readiness against the standard',
    description:
      'This is an AI/ML-ready orientation layer. It combines profile data, photos, measurements, FCI proportion checks and review boundaries. It does not prove breed identity or pedigree.',
    buttonContext: 'Model-ready assistant',
    score: 'Readiness score',
    confidence: 'Evidence confidence',
    loading: 'Loading measurement archiveвЂ¦',
    loadError: 'Measurement archive is not available right now. The check continues with profile and photo evidence only.',
    noName: 'Unnamed Cane Corso',
    evidence: 'Evidence diagram',
    signals: 'Signals used by the check',
    proportions: 'Standard-oriented diagrams',
    photoModel: 'Photo model status',
    photoModelBody:
      'Photo recognition is prepared as a future layer. Today the platform checks whether the uploaded photos are enough for a human/AI-assisted review, not whether the image proves breed identity.',
    nextTitle: 'Best next evidence',
    boundaryTitle: 'Trust boundary',
    boundaryBody:
      'The result is a preliminary orientation only. Final USG review, Registry publication and Certificate decisions remain human-controlled.',
    qualification: {
      ready: 'Strong candidate for USG review preparation',
      collecting: 'Good start вЂ” collect more evidence',
      weak: 'Not enough evidence yet',
    },
    confidenceValues: {
      low: 'low',
      medium: 'medium',
      high: 'high',
    },
    flow: ['Profile', 'Photos', 'Measurements', 'Standard', 'USG review'],
    signalLabels: {
      profile: 'Profile data',
      photos: 'Photo evidence',
      measurements: 'Measurement archive',
      standard: 'FCI/USG orientation',
      pedigree: 'Family context',
      human_review: 'Human review boundary',
    },
    signalDescriptions: {
      profile: 'Name, sex, birth date, colour, location and owner description.',
      photos: 'Main image plus owner gallery photos for visual context.',
      measurements: 'Weight, height and proportion records saved by date.',
      standard: 'Uses the existing FCI conformity orientation engine from the latest measurements.',
      pedigree: 'Known family line and ancestor photos when available.',
      human_review: 'Keeps all official decisions separate from automatic scoring.',
    },
    values: {
      profileReady: 'profile fields ready',
      photoCount: 'photos',
      measurementCount: 'measurement records',
      fciScore: 'standard score',
      pedigreeCount: 'pedigree fields',
      locked: 'locked',
    },
    diagramLabels: {
      body: 'Body length в‰€ height + 11%',
      head: 'Head length в‰€ 36% of height',
      muzzle: 'Muzzle / skull в‰€ 1:2',
    },
    nextActions: {
      photos: 'Add side-standing, front and head photos.',
      measurements: 'Save dated weight, height, body and head measurements.',
      profile: 'Complete birth date, sex, colour, location and description.',
      pedigree: 'Add parents/ancestors if known, with photos when possible.',
      review: 'Submit for USG review when evidence is clear enough.',
    },
  },
  bg: {
    eyebrow: 'USG РїСЂРѕРІРµСЂРєР° Р·Р° РёСЃС‚РёРЅСЃРєРѕ',
    title: 'РџСЂРѕРІРµСЂРё РіРѕС‚РѕРІРЅРѕСЃС‚С‚Р° СЃРїСЂСЏРјРѕ СЃС‚Р°РЅРґР°СЂС‚Р°',
    description:
      'РўРѕРІР° Рµ AI/ML-ready РѕСЂРёРµРЅС‚РёСЂ. РљРѕРјР±РёРЅРёСЂР° РґР°РЅРЅРё РѕС‚ РїСЂРѕС„РёР»Р°, СЃРЅРёРјРєРё, РёР·РјРµСЂРІР°РЅРёСЏ, FCI РїСЂРѕРїРѕСЂС†РёРё Рё РіСЂР°РЅРёС†Рё РЅР° РїСЂРµРіР»РµРґ. РќРµ РґРѕРєР°Р·РІР° РїРѕСЂРѕРґР° РёР»Рё СЂРѕРґРѕСЃР»РѕРІРёРµ.',
    buttonContext: 'РњРѕРґРµР»СЉС‚ Рµ РїРѕРґРіРѕС‚РІРµРЅ РєР°С‚Рѕ Р°СЃРёСЃС‚РµРЅС‚',
    score: 'РћС†РµРЅРєР° РЅР° РіРѕС‚РѕРІРЅРѕСЃС‚',
    confidence: 'РЈРІРµСЂРµРЅРѕСЃС‚ РїРѕ РґРѕРєР°Р·Р°С‚РµР»СЃС‚РІР°',
    loading: 'Р—Р°СЂРµР¶РґР°Рј Р°СЂС…РёРІР° СЃ РёР·РјРµСЂРІР°РЅРёСЏвЂ¦',
    loadError: 'РђСЂС…РёРІСЉС‚ СЃ РёР·РјРµСЂРІР°РЅРёСЏ РЅРµ Рµ РґРѕСЃС‚СЉРїРµРЅ РІ РјРѕРјРµРЅС‚Р°. РџСЂРѕРІРµСЂРєР°С‚Р° РїСЂРѕРґСЉР»Р¶Р°РІР° СЃР°РјРѕ СЃ РїСЂРѕС„РёР» Рё СЃРЅРёРјРєРё.',
    noName: 'Cane Corso Р±РµР· РёРјРµ',
    evidence: 'Р”РёР°РіСЂР°РјР° РЅР° РґРѕРєР°Р·Р°С‚РµР»СЃС‚РІР°С‚Р°',
    signals: 'РЎРёРіРЅР°Р»Рё, РёР·РїРѕР»Р·РІР°РЅРё РѕС‚ РїСЂРѕРІРµСЂРєР°С‚Р°',
    proportions: 'Р”РёР°РіСЂР°РјРё РїРѕ СЃС‚Р°РЅРґР°СЂС‚',
    photoModel: 'РЎС‚Р°С‚СѓСЃ РЅР° С„РѕС‚Рѕ РјРѕРґРµР»Р°',
    photoModelBody:
      'Р Р°Р·РїРѕР·РЅР°РІР°РЅРµС‚Рѕ РѕС‚ СЃРЅРёРјРєР° Рµ РїРѕРґРіРѕС‚РІРµРЅРѕ РєР°С‚Рѕ Р±СЉРґРµС‰ СЃР»РѕР№. Р”РЅРµСЃ РїР»Р°С‚С„РѕСЂРјР°С‚Р° РїСЂРѕРІРµСЂСЏРІР° РґР°Р»Рё СЃРЅРёРјРєРёС‚Рµ СЃР° РґРѕСЃС‚Р°С‚СЉС‡РЅРё Р·Р° С‡РѕРІРµС€РєРё/AI-РїРѕРґРїРѕРјРѕРіРЅР°С‚ РїСЂРµРіР»РµРґ, РЅРµ РґР°Р»Рё РёР·РѕР±СЂР°Р¶РµРЅРёРµС‚Рѕ РґРѕРєР°Р·РІР° РїРѕСЂРѕРґР°С‚Р°.',
    nextTitle: 'РќР°Р№-РґРѕР±СЂР° СЃР»РµРґРІР°С‰Р° СЃС‚СЉРїРєР°',
    boundaryTitle: 'Р“СЂР°РЅРёС†Р° РЅР° РґРѕРІРµСЂРёРµ',
    boundaryBody:
      'Р РµР·СѓР»С‚Р°С‚СЉС‚ Рµ СЃР°РјРѕ РїСЂРµРґРІР°СЂРёС‚РµР»РµРЅ РѕСЂРёРµРЅС‚РёСЂ. Р¤РёРЅР°Р»РЅРёСЏС‚ USG РїСЂРµРіР»РµРґ, РїСѓР±Р»РёРєСѓРІР°РЅРµС‚Рѕ РІ Р РµРіРёСЃС‚СЉСЂР° Рё РЎРµСЂС‚РёС„РёРєР°С‚СЉС‚ РѕСЃС‚Р°РІР°С‚ С‡РѕРІРµС€РєРё СЂРµС€РµРЅРёСЏ.',
    qualification: {
      ready: 'РЎРёР»РµРЅ РєР°РЅРґРёРґР°С‚ Р·Р° РїРѕРґРіРѕС‚РѕРІРєР° РєСЉРј USG РїСЂРµРіР»РµРґ',
      collecting: 'Р”РѕР±СЂРѕ РЅР°С‡Р°Р»Рѕ вЂ” СЃСЉР±РµСЂРё РѕС‰Рµ РґРѕРєР°Р·Р°С‚РµР»СЃС‚РІР°',
      weak: 'Р’СЃРµ РѕС‰Рµ РЅСЏРјР° РґРѕСЃС‚Р°С‚СЉС‡РЅРѕ РґРѕРєР°Р·Р°С‚РµР»СЃС‚РІР°',
    },
    confidenceValues: {
      low: 'РЅРёСЃРєР°',
      medium: 'СЃСЂРµРґРЅР°',
      high: 'РІРёСЃРѕРєР°',
    },
    flow: ['РџСЂРѕС„РёР»', 'РЎРЅРёРјРєРё', 'РР·РјРµСЂРІР°РЅРёСЏ', 'РЎС‚Р°РЅРґР°СЂС‚', 'USG РїСЂРµРіР»РµРґ'],
    signalLabels: {
      profile: 'Р”Р°РЅРЅРё РІ РїСЂРѕС„РёР»Р°',
      photos: 'РЎРЅРёРјРєРѕРІРё РґРѕРєР°Р·Р°С‚РµР»СЃС‚РІР°',
      measurements: 'РђСЂС…РёРІ СЃ РёР·РјРµСЂРІР°РЅРёСЏ',
      standard: 'FCI/USG РѕСЂРёРµРЅС‚РёСЂ',
      pedigree: 'РЎРµРјРµРµРЅ РєРѕРЅС‚РµРєСЃС‚',
      human_review: 'Р§РѕРІРµС€РєРё РїСЂРµРіР»РµРґ',
    },
    signalDescriptions: {
      profile: 'РРјРµ, РїРѕР», РґР°С‚Р° РЅР° СЂР°Р¶РґР°РЅРµ, С†РІСЏС‚, Р»РѕРєР°С†РёСЏ Рё РѕРїРёСЃР°РЅРёРµ РѕС‚ СЃРѕР±СЃС‚РІРµРЅРёРєР°.',
      photos: 'РћСЃРЅРѕРІРЅР° СЃРЅРёРјРєР° РїР»СЋСЃ РіР°Р»РµСЂРёСЏ РѕС‚ СЃРѕР±СЃС‚РІРµРЅРёРєР° Р·Р° РІРёР·СѓР°Р»РµРЅ РєРѕРЅС‚РµРєСЃС‚.',
      measurements: 'РўРµРіР»Рѕ, РІРёСЃРѕС‡РёРЅР° Рё РїСЂРѕРїРѕСЂС†РёРё, Р·Р°РїРёСЃР°РЅРё РїРѕ РґР°С‚Р°.',
      standard: 'РР·РїРѕР»Р·РІР° РІРµС‡Рµ РЅР°Р»РёС‡РЅРёСЏ FCI conformity engine РѕС‚ РїРѕСЃР»РµРґРЅРёС‚Рµ РёР·РјРµСЂРІР°РЅРёСЏ.',
      pedigree: 'РџРѕР·РЅР°С‚Р° СЃРµРјРµР№РЅР° Р»РёРЅРёСЏ Рё СЃРЅРёРјРєРё РЅР° РїСЂРµРґС†Рё, РєРѕРіР°С‚Рѕ СЃР° РЅР°Р»РёС‡РЅРё.',
      human_review: 'Р”СЉСЂР¶Рё РѕС„РёС†РёР°Р»РЅРёС‚Рµ СЂРµС€РµРЅРёСЏ РѕС‚РґРµР»РµРЅРё РѕС‚ Р°РІС‚РѕРјР°С‚РёС‡РЅР°С‚Р° РѕС†РµРЅРєР°.',
    },
    values: {
      profileReady: 'РіРѕС‚РѕРІРё РїСЂРѕС„РёР»РЅРё РїРѕР»РµС‚Р°',
      photoCount: 'СЃРЅРёРјРєРё',
      measurementCount: 'Р·Р°РїРёСЃР° СЃ РёР·РјРµСЂРІР°РЅРёСЏ',
      fciScore: 'РѕС†РµРЅРєР° РїРѕ СЃС‚Р°РЅРґР°СЂС‚',
      pedigreeCount: 'СЂРѕРґРѕСЃР»РѕРІРЅРё РїРѕР»РµС‚Р°',
      locked: 'Р·Р°РєР»СЋС‡РµРЅРѕ',
    },
    diagramLabels: {
      body: 'Р”СЉР»Р¶РёРЅР° РЅР° С‚СЏР»Рѕ в‰€ РІРёСЃРѕС‡РёРЅР° + 11%',
      head: 'Р”СЉР»Р¶РёРЅР° РЅР° РіР»Р°РІР° в‰€ 36% РѕС‚ РІРёСЃРѕС‡РёРЅР°С‚Р°',
      muzzle: 'РњСѓС†СѓРЅР° / С‡РµСЂРµРї в‰€ 1:2',
    },
    nextActions: {
      photos: 'Р”РѕР±Р°РІРё СЃС‚СЂР°РЅРёС‡РЅР° СЃРЅРёРјРєР° РІ СЃС‚РѕР№РєР°, С„СЂРѕРЅС‚Р°Р»РЅР° СЃРЅРёРјРєР° Рё СЃРЅРёРјРєР° РЅР° РіР»Р°РІР°.',
      measurements: 'Р—Р°РїР°Р·Рё С‚РµРіР»Рѕ, РІРёСЃРѕС‡РёРЅР°, РґСЉР»Р¶РёРЅР° РЅР° С‚СЏР»Рѕ Рё РіР»Р°РІР° РїРѕ РґР°С‚Р°.',
      profile: 'РџРѕРїСЉР»РЅРё РґР°С‚Р° РЅР° СЂР°Р¶РґР°РЅРµ, РїРѕР», С†РІСЏС‚, Р»РѕРєР°С†РёСЏ Рё РѕРїРёСЃР°РЅРёРµ.',
      pedigree: 'Р”РѕР±Р°РІРё СЂРѕРґРёС‚РµР»Рё/РїСЂРµРґС†Рё, Р°РєРѕ РіРё Р·РЅР°РµС€, СЃСЉСЃ СЃРЅРёРјРєРё РєРѕРіР°С‚Рѕ Рµ РІСЉР·РјРѕР¶РЅРѕ.',
      review: 'РџРѕРґР°Р№ РєСЉРј USG РїСЂРµРіР»РµРґ, РєРѕРіР°С‚Рѕ РґРѕРєР°Р·Р°С‚РµР»СЃС‚РІР°С‚Р° СЃР° РґРѕСЃС‚Р°С‚СЉС‡РЅРѕ СЏСЃРЅРё.',
    },
  },
  it: {
    eyebrow: 'Verifica autenticitГ  USG',
    title: 'Controlla la prontezza rispetto allo standard',
    description:
      'Г€ un livello di orientamento pronto per AI/ML. Combina profilo, foto, misure, proporzioni FCI e confini di revisione. Non prova razza o pedigree.',
    buttonContext: 'Assistente pronto per modello',
    score: 'Punteggio prontezza',
    confidence: 'AffidabilitГ  evidenze',
    loading: 'Caricamento archivio misureвЂ¦',
    loadError: 'Archivio misure non disponibile ora. La verifica continua solo con profilo e foto.',
    noName: 'Cane Corso senza nome',
    evidence: 'Diagramma evidenze',
    signals: 'Segnali usati dalla verifica',
    proportions: 'Diagrammi orientati allo standard',
    photoModel: 'Stato modello foto',
    photoModelBody:
      'Il riconoscimento da foto ГЁ preparato come livello futuro. Oggi la piattaforma verifica se le foto sono sufficienti per revisione umana/assistita da AI, non se lвЂ™immagine prova la razza.',
    nextTitle: 'Prossima evidenza migliore',
    boundaryTitle: 'Confine di fiducia',
    boundaryBody:
      'Il risultato ГЁ solo orientamento preliminare. Revisione USG finale, pubblicazione Registro e Certificato restano decisioni umane.',
    qualification: {
      ready: 'Forte candidato per preparazione revisione USG',
      collecting: 'Buon inizio вЂ” raccogli piГ№ evidenze',
      weak: 'Evidenze ancora insufficienti',
    },
    confidenceValues: {
      low: 'bassa',
      medium: 'media',
      high: 'alta',
    },
    flow: ['Profilo', 'Foto', 'Misure', 'Standard', 'Revisione USG'],
    signalLabels: {
      profile: 'Dati profilo',
      photos: 'Evidenza foto',
      measurements: 'Archivio misure',
      standard: 'Orientamento FCI/USG',
      pedigree: 'Contesto familiare',
      human_review: 'Revisione umana',
    },
    signalDescriptions: {
      profile: 'Nome, sesso, data di nascita, colore, luogo e descrizione proprietario.',
      photos: 'Immagine principale piГ№ galleria proprietario per contesto visivo.',
      measurements: 'Peso, altezza e proporzioni salvate per data.',
      standard: 'Usa il motore FCI conformity giГ  presente dalle ultime misure.',
      pedigree: 'Linea familiare nota e foto antenati quando disponibili.',
      human_review: 'Tiene le decisioni ufficiali separate dal punteggio automatico.',
    },
    values: {
      profileReady: 'campi profilo pronti',
      photoCount: 'foto',
      measurementCount: 'record misure',
      fciScore: 'punteggio standard',
      pedigreeCount: 'campi pedigree',
      locked: 'bloccato',
    },
    diagramLabels: {
      body: 'Lunghezza corpo в‰€ altezza + 11%',
      head: 'Lunghezza testa в‰€ 36% altezza',
      muzzle: 'Muso / cranio в‰€ 1:2',
    },
    nextActions: {
      photos: 'Aggiungi foto laterale in posa, frontale e testa.',
      measurements: 'Salva peso, altezza, lunghezza corpo e testa con data.',
      profile: 'Completa nascita, sesso, colore, luogo e descrizione.',
      pedigree: 'Aggiungi genitori/antenati se conosciuti, con foto quando possibile.',
      review: 'Invia a revisione USG quando le evidenze sono abbastanza chiare.',
    },
  },
} as const;

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function latestRecord(records: DogMeasurementRecord[]) {
  if (!records.length) return null;
  return [...records].sort((a, b) => b.measuredAt.localeCompare(a.measuredAt))[0] ?? null;
}

function countMeasurementFields(record: DogMeasurementRecord | null) {
  if (!record) return 0;
  return [
    record.weightKg,
    record.heightWithersCm,
    record.bodyLengthCm,
    record.chestCircumferenceCm,
    record.headLengthCm,
    record.muzzleLengthCm,
    record.skullLengthCm,
  ].filter((value) => typeof value === 'number' && Number.isFinite(value) && value > 0).length;
}

function getQualification(score: number): AuthenticityQualificationKey {
  if (score >= 80) return 'ready';
  if (score >= 55) return 'collecting';
  return 'weak';
}

function getConfidence(signalCount: number, measurementCount: number, score: number): AuthenticityConfidenceKey {
  if (signalCount >= 5 && measurementCount >= 2 && score >= 70) return 'high';
  if (signalCount >= 3 && score >= 45) return 'medium';
  return 'low';
}

function getNextActionKey(signals: AuthenticitySignal[]): NextAuthenticityActionKey {
  const weakest = [...signals].sort((a, b) => a.score - b.score)[0];
  if (!weakest) return 'review';

  switch (weakest.key) {
    case 'profile':
    case 'photos':
    case 'measurements':
    case 'pedigree':
      return weakest.key;
    case 'standard':
      return 'measurements';
    case 'human_review':
    default:
      return 'review';
  }
}

function formatPercent(score: number) {
  return `${clampScore(score)}%`;
}

function ScoreGauge({ score, label, qualification }: { score: number; label: string; qualification: string }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const dash = (clampScore(score) / 100) * circumference;

  return (
    <div className="authenticity-check__gauge" aria-label={`${label}: ${formatPercent(score)}`}>
      <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
        <circle className="authenticity-check__gauge-track" cx="60" cy="60" r={radius} />
        <circle
          className="authenticity-check__gauge-value"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div>
        <span>{label}</span>
        <strong>{formatPercent(score)}</strong>
        <small>{qualification}</small>
      </div>
    </div>
  );
}

function SignalBar({ signal }: { signal: AuthenticitySignal }) {
  return (
    <article className={`authenticity-check-signal authenticity-check-signal--${signal.key}`}>
      <div className="authenticity-check-signal__head">
        <div>
          <strong>{signal.label}</strong>
          <p>{signal.description}</p>
        </div>
        <span>{formatPercent(signal.score)}</span>
      </div>
      <div className="authenticity-check-signal__bar" aria-hidden="true">
        <span style={{ width: `${clampScore(signal.score)}%` }} />
      </div>
      <small>{signal.value}</small>
    </article>
  );
}

export function UsgAuthenticityCheckPanel({
  locale,
  dogId,
  dogName,
  sex,
  dateOfBirth,
  color,
  city,
  country,
  shortDescription,
  mainImageUrl,
  galleryImageCount,
  pedigreeFilledCount,
  pedigreePhotoCount,
  lifecycleStatus,
  hasPublication,
  hasCertificate,
}: UsgAuthenticityCheckPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const [records, setRecords] = useState<DogMeasurementRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(dogId));
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMeasurements() {
      if (!dogId) {
        setRecords([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(false);
      try {
        const document = await listDogMeasurements(dogId);
        if (!ignore) setRecords(document.records);
      } catch (error) {
        if (!ignore) {
          setLoadError(error instanceof ApiRequestError);
          setRecords([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadMeasurements();
    return () => {
      ignore = true;
    };
  }, [dogId]);

  const latestMeasurement = useMemo(() => latestRecord(records), [records]);
  const fciDocument = useMemo(() => buildFciStandardConformityDocument({
    dogId,
    dogName,
    sex,
    dateOfBirth,
    color,
    latestMeasurement,
  }), [dogId, dogName, sex, dateOfBirth, color, latestMeasurement]);

  const signalDocument = useMemo(() => {
    const profileFields = [dogName, sex !== 'unknown' ? sex : null, dateOfBirth, color, city, country, shortDescription].filter((value) => typeof value === 'string' && value.trim()).length;
    const profileScore = clampScore((profileFields / 7) * 100);
    const photoCount = Math.max(galleryImageCount, mainImageUrl ? 1 : 0);
    const photoScore = clampScore(photoCount === 0 ? 0 : photoCount === 1 ? 46 : photoCount === 2 ? 74 : 94);
    const measurementFieldCount = countMeasurementFields(latestMeasurement);
    const measurementScore = clampScore(Math.min(64, records.length * 18) + Math.min(36, measurementFieldCount * 6));
    const standardScore = clampScore(fciDocument.scores.measurable || fciDocument.scores.overall);
    const pedigreeScore = clampScore(Math.min(70, pedigreeFilledCount * 5) + Math.min(30, pedigreePhotoCount * 5));
    const reviewScore = clampScore((hasPublication ? 65 : 35) + (hasCertificate ? 20 : 0) + (['submitted', 'approved', 'published'].includes(lifecycleStatus) ? 15 : 0));

    const signals: AuthenticitySignal[] = [
      {
        key: 'profile',
        label: copy.signalLabels.profile,
        value: `${profileFields}/7 ${copy.values.profileReady}`,
        description: copy.signalDescriptions.profile,
        score: profileScore,
      },
      {
        key: 'photos',
        label: copy.signalLabels.photos,
        value: `${photoCount}/3 ${copy.values.photoCount}`,
        description: copy.signalDescriptions.photos,
        score: photoScore,
      },
      {
        key: 'measurements',
        label: copy.signalLabels.measurements,
        value: `${records.length} ${copy.values.measurementCount}`,
        description: copy.signalDescriptions.measurements,
        score: measurementScore,
      },
      {
        key: 'standard',
        label: copy.signalLabels.standard,
        value: `${formatPercent(standardScore)} ${copy.values.fciScore}`,
        description: copy.signalDescriptions.standard,
        score: standardScore,
      },
      {
        key: 'pedigree',
        label: copy.signalLabels.pedigree,
        value: `${pedigreeFilledCount}/14 ${copy.values.pedigreeCount}`,
        description: copy.signalDescriptions.pedigree,
        score: pedigreeScore,
      },
      {
        key: 'human_review',
        label: copy.signalLabels.human_review,
        value: copy.values.locked,
        description: copy.signalDescriptions.human_review,
        score: reviewScore,
      },
    ];

    const overall = clampScore(
      profileScore * 0.18 +
      photoScore * 0.18 +
      measurementScore * 0.18 +
      standardScore * 0.28 +
      pedigreeScore * 0.10 +
      reviewScore * 0.08,
    );
    const usefulSignals = signals.filter((signal) => signal.score >= 45).length;
    const confidence = getConfidence(usefulSignals, records.length, overall);

    return {
      signals,
      overall,
      confidence,
      qualification: getQualification(overall),
      nextActionKey: getNextActionKey(signals),
    };
  }, [city, color, copy, country, dateOfBirth, dogName, fciDocument.scores.measurable, fciDocument.scores.overall, galleryImageCount, hasCertificate, hasPublication, lifecycleStatus, latestMeasurement, mainImageUrl, pedigreeFilledCount, pedigreePhotoCount, records.length, sex]);

  const displayName = dogName?.trim() || copy.noName;

  return (
    <section className="content-card authenticity-check-panel" id="usg-authenticity-check" aria-label={copy.title}>
      <div className="authenticity-check-panel__header">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="authenticity-check-panel__mark" aria-hidden="true">USG</div>
      </div>

      <div className="authenticity-check-panel__hero">
        <ScoreGauge
          score={signalDocument.overall}
          label={copy.score}
          qualification={copy.qualification[signalDocument.qualification]}
        />
        <div className="authenticity-check-panel__summary">
          <strong>{displayName}</strong>
          <span>{copy.confidence}: {copy.confidenceValues[signalDocument.confidence]}</span>
          <p>{copy.buttonContext}</p>
          {loading ? <small>{copy.loading}</small> : null}
          {!loading && loadError ? <small>{copy.loadError}</small> : null}
        </div>
      </div>

      <div className="authenticity-check-flow" aria-label={copy.evidence}>
        {copy.flow.map((item, index) => (
          <div className="authenticity-check-flow__node" key={item}>
            <span>{index + 1}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>

      <div className="authenticity-check-panel__grid">
        <section className="authenticity-check-panel__signals" aria-label={copy.signals}>
          <div className="authenticity-check-panel__section-head">
            <span className="eyebrow-label">{copy.signals}</span>
          </div>
          {signalDocument.signals.map((signal) => <SignalBar signal={signal} key={signal.key} />)}
        </section>

        <aside className="authenticity-check-panel__side">
          <section className="authenticity-check-mini-card">
            <span className="eyebrow-label">{copy.proportions}</span>
            <div className="authenticity-check-proportions">
              <div><span>111%</span><strong>{copy.diagramLabels.body}</strong></div>
              <div><span>36%</span><strong>{copy.diagramLabels.head}</strong></div>
              <div><span>1:2</span><strong>{copy.diagramLabels.muzzle}</strong></div>
            </div>
          </section>

          <section className="authenticity-check-mini-card">
            <span className="eyebrow-label">{copy.photoModel}</span>
            <p>{copy.photoModelBody}</p>
          </section>

          <section className="authenticity-check-mini-card authenticity-check-mini-card--gold">
            <span className="eyebrow-label">{copy.nextTitle}</span>
            <p>{copy.nextActions[signalDocument.nextActionKey]}</p>
          </section>

          <section className="authenticity-check-mini-card authenticity-check-mini-card--boundary">
            <span className="eyebrow-label">{copy.boundaryTitle}</span>
            <p>{copy.boundaryBody}</p>
          </section>
        </aside>
      </div>
    </section>
  );
}

