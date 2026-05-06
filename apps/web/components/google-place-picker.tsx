'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
    __ccpGoogleMapsLoader?: Promise<void>;
  }
}

interface GooglePlaceValues {
  googlePlaceId: string | null;
  googlePlaceName: string | null;
  googleFormattedAddress: string | null;
  googleMapsUrl: string | null;
  latitude: string | null;
  longitude: string | null;
}

interface GooglePlacePickerLabels {
  title: string;
  help: string;
  search: string;
  selected: string;
  address: string;
  coordinates: string;
  openMaps: string;
  manualMode: string;
  clear: string;
}

interface GooglePlacePickerProps {
  apiKey?: string | null;
  labels: GooglePlacePickerLabels;
  defaults?: Partial<GooglePlaceValues>;
  inputId: string;
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.google?.maps?.places) {
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

function buildMapsUrl(placeId: string | null, lat: string | null, lng: string | null, name: string | null) {
  if (placeId && lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}&query_place_id=${encodeURIComponent(placeId)}`;
  }

  if (name) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
  }

  return null;
}

export function GooglePlacePicker({ apiKey, labels, defaults, inputId }: GooglePlacePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<GooglePlaceValues>({
    googlePlaceId: defaults?.googlePlaceId ?? null,
    googlePlaceName: defaults?.googlePlaceName ?? null,
    googleFormattedAddress: defaults?.googleFormattedAddress ?? null,
    googleMapsUrl: defaults?.googleMapsUrl ?? null,
    latitude: defaults?.latitude ?? null,
    longitude: defaults?.longitude ?? null,
  });
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!apiKey || !inputRef.current) {
      return;
    }

    let listener: { remove: () => void } | null = null;
    let disposed = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (disposed || !inputRef.current || !window.google?.maps?.places) {
          return;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['place_id', 'name', 'formatted_address', 'geometry'],
        });

        listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const latValue = place.geometry?.location?.lat?.();
          const lngValue = place.geometry?.location?.lng?.();
          const latitude = typeof latValue === 'number' ? String(latValue) : null;
          const longitude = typeof lngValue === 'number' ? String(lngValue) : null;
          const placeId = typeof place.place_id === 'string' ? place.place_id : null;
          const placeName = typeof place.name === 'string' ? place.name : null;
          const formattedAddress = typeof place.formatted_address === 'string' ? place.formatted_address : null;

          setValues({
            googlePlaceId: placeId,
            googlePlaceName: placeName,
            googleFormattedAddress: formattedAddress,
            googleMapsUrl: buildMapsUrl(placeId, latitude, longitude, placeName),
            latitude,
            longitude,
          });
        });
      })
      .catch(() => setLoadFailed(true));

    return () => {
      disposed = true;
      listener?.remove();
    };
  }, [apiKey]);

  const hasSelectedPlace = Boolean(values.googlePlaceName || values.googleFormattedAddress || values.latitude || values.longitude);
  const coordinateLabel = useMemo(() => {
    if (!values.latitude || !values.longitude) {
      return null;
    }

    return `${values.latitude}, ${values.longitude}`;
  }, [values.latitude, values.longitude]);

  return (
    <div className="google-place-picker">
      <div className="google-place-picker__head">
        <span className="eyebrow-label">Google Maps</span>
        <h3>{labels.title}</h3>
        <p>{labels.help}</p>
      </div>

      <div className="field-group field-group--full">
        <label className="field-label" htmlFor={inputId}>{labels.search}</label>
        <input
          ref={inputRef}
          id={inputId}
          className="field-input"
          type="text"
          autoComplete="off"
          defaultValue={values.googlePlaceName ?? ''}
          placeholder={labels.search}
          disabled={!apiKey || loadFailed}
        />
        {!apiKey || loadFailed ? <p className="field-help-text">{labels.manualMode}</p> : null}
      </div>

      <input type="hidden" name="googlePlaceId" value={values.googlePlaceId ?? ''} />
      <input type="hidden" name="googlePlaceName" value={values.googlePlaceName ?? ''} />
      <input type="hidden" name="googleFormattedAddress" value={values.googleFormattedAddress ?? ''} />
      <input type="hidden" name="googleMapsUrl" value={values.googleMapsUrl ?? ''} />
      <input type="hidden" name="latitude" value={values.latitude ?? ''} />
      <input type="hidden" name="longitude" value={values.longitude ?? ''} />

      {hasSelectedPlace ? (
        <div className="google-place-picker__selection">
          <div>
            <strong>{labels.selected}</strong>
            <span>{values.googlePlaceName ?? labels.selected}</span>
          </div>
          <div>
            <strong>{labels.address}</strong>
            <span>{values.googleFormattedAddress ?? '—'}</span>
          </div>
          {coordinateLabel ? (
            <div>
              <strong>{labels.coordinates}</strong>
              <span>{coordinateLabel}</span>
            </div>
          ) : null}
          <div className="google-place-picker__actions">
            {values.googleMapsUrl ? <a className="button-secondary small" href={values.googleMapsUrl} target="_blank" rel="noreferrer">{labels.openMaps}</a> : null}
            <button
              type="button"
              className="button-ghost small"
              onClick={() => setValues({ googlePlaceId: null, googlePlaceName: null, googleFormattedAddress: null, googleMapsUrl: null, latitude: null, longitude: null })}
            >
              {labels.clear}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
