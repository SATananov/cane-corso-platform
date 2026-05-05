ALTER TABLE ecosystem_listings
  ADD COLUMN IF NOT EXISTS submission_channel text;

UPDATE ecosystem_listings
SET submission_channel = CASE
  WHEN listing_type IN ('walk_play_place', 'pet_friendly_place') THEN 'community_listing'
  ELSE 'official_listing'
END
WHERE submission_channel IS NULL;

ALTER TABLE ecosystem_listings
  ALTER COLUMN submission_channel SET DEFAULT 'community_listing';

ALTER TABLE ecosystem_listings
  ALTER COLUMN submission_channel SET NOT NULL;

CREATE INDEX IF NOT EXISTS ecosystem_listings_submission_channel_idx
  ON ecosystem_listings(submission_channel);
