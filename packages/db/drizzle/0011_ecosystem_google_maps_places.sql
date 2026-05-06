ALTER TABLE ecosystem_listings
  ADD COLUMN IF NOT EXISTS google_place_id text,
  ADD COLUMN IF NOT EXISTS google_place_name text,
  ADD COLUMN IF NOT EXISTS google_formatted_address text,
  ADD COLUMN IF NOT EXISTS google_maps_url text,
  ADD COLUMN IF NOT EXISTS latitude text,
  ADD COLUMN IF NOT EXISTS longitude text;

CREATE INDEX IF NOT EXISTS ecosystem_listings_google_place_id_idx
  ON ecosystem_listings(google_place_id);

CREATE INDEX IF NOT EXISTS ecosystem_listings_coordinates_idx
  ON ecosystem_listings(latitude, longitude);
