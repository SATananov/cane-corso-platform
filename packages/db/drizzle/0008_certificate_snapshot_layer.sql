ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS certificate_image_url text;

ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS snapshot_json jsonb;

ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS issued_by_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL;
