'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
    __ccpGoogleMapsLoader?: Promise<void>;
  }
}

export interface FriendlyMapPlace {
  id: string;
  title: string;
  slug: string;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  mapsUrl: string | null;
}

interface FriendlyPlacesMapLabels {
  title: string;
  empty: string;
  openDetail: string;
  openMaps: string;
  manualMode: string;
}

interface FriendlyPlacesMapProps {
  apiKey?: string | null;
  places: FriendlyMapPlace[];
  labels: FriendlyPlacesMapLabels;
  className?: string;
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (window.__ccpGoogleMapsLoader) {
    return window.__ccpGoogleMapsLoader;
  }

  window.__ccpGoogleMapsLoader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-ccp-google-maps="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Google Maps failed to load.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.dataset.ccpGoogleMaps = 'true';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Google Maps failed to load.')), { once: true });
    document.head.appendChild(script);
  });

  return window.__ccpGoogleMapsLoader;
}

function toCoordinate(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function FriendlyPlacesMap({ apiKey, places, labels, className }: FriendlyPlacesMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const mappedPlaces = useMemo(
    () => places
      .map((place) => ({ ...place, lat: toCoordinate(place.latitude), lng: toCoordinate(place.longitude) }))
      .filter((place): place is FriendlyMapPlace & { lat: number; lng: number } => place.lat !== null && place.lng !== null),
    [places],
  );

  useEffect(() => {
    if (!apiKey || mappedPlaces.length === 0 || !mapRef.current) {
      return;
    }

    let disposed = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (disposed || !mapRef.current || !window.google?.maps) {
          return;
        }

        const center = { lat: mappedPlaces[0].lat, lng: mappedPlaces[0].lng };
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: mappedPlaces.length === 1 ? 14 : 7,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
        const bounds = new window.google.maps.LatLngBounds();
        const infoWindow = new window.google.maps.InfoWindow();

        mappedPlaces.forEach((place) => {
          const position = { lat: place.lat, lng: place.lng };
          bounds.extend(position);
          const marker = new window.google.maps.Marker({
            map,
            position,
            title: place.title,
          });

          marker.addListener('click', () => {
            infoWindow.setContent(`
              <div style="max-width:220px;font-family:Inter,Arial,sans-serif;color:#1f170f;">
                <strong>${place.title}</strong>
                <p style="margin:6px 0 10px;">${place.address ?? ''}</p>
                <a href="/community/${encodeURIComponent(place.slug)}">${labels.openDetail}</a>
                ${place.mapsUrl ? `<br/><a href="${place.mapsUrl}" target="_blank" rel="noreferrer">${labels.openMaps}</a>` : ''}
              </div>
            `);
            infoWindow.open({ map, anchor: marker });
          });
        });

        if (mappedPlaces.length > 1) {
          map.fitBounds(bounds);
        }
      })
      .catch(() => setLoadFailed(true));

    return () => {
      disposed = true;
    };
  }, [apiKey, labels.openDetail, labels.openMaps, mappedPlaces]);

  if (!apiKey || loadFailed) {
    return (
      <div className={`friendly-places-map friendly-places-map--fallback ${className ?? ''}`.trim()}>
        <strong>{labels.title}</strong>
        <p>{labels.manualMode}</p>
      </div>
    );
  }

  if (mappedPlaces.length === 0) {
    return (
      <div className={`friendly-places-map friendly-places-map--fallback ${className ?? ''}`.trim()}>
        <strong>{labels.title}</strong>
        <p>{labels.empty}</p>
      </div>
    );
  }

  return <div className={`friendly-places-map ${className ?? ''}`.trim()} ref={mapRef} role="img" aria-label={labels.title} />;
}
