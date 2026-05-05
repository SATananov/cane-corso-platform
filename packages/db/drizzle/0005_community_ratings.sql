CREATE TABLE IF NOT EXISTS registry_entry_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_entry_id uuid NOT NULL REFERENCES registry_entries(id) ON DELETE CASCADE,
  voter_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT registry_entry_ratings_rating_check CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT registry_entry_ratings_unique_vote UNIQUE (registry_entry_id, voter_profile_id)
);

CREATE INDEX IF NOT EXISTS registry_entry_ratings_entry_idx ON registry_entry_ratings (registry_entry_id);
CREATE INDEX IF NOT EXISTS registry_entry_ratings_voter_idx ON registry_entry_ratings (voter_profile_id);

CREATE TABLE IF NOT EXISTS partner_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  voter_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partner_ratings_rating_check CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT partner_ratings_unique_vote UNIQUE (partner_id, voter_profile_id)
);

CREATE INDEX IF NOT EXISTS partner_ratings_partner_idx ON partner_ratings (partner_id);
CREATE INDEX IF NOT EXISTS partner_ratings_voter_idx ON partner_ratings (voter_profile_id);
