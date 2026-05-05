CREATE TABLE IF NOT EXISTS ecosystem_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  listing_type text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text,
  short_description text,
  long_description text,
  country text,
  city text,
  website_url text,
  phone text,
  email text,
  coverage_note text,
  rules_note text,
  logo_url text,
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft',
  is_featured boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecosystem_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES ecosystem_listings(id) ON DELETE CASCADE,
  reviewer_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  decision text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ecosystem_listings_owner_profile_idx
  ON ecosystem_listings(owner_profile_id);

CREATE INDEX IF NOT EXISTS ecosystem_listings_status_idx
  ON ecosystem_listings(status);

CREATE INDEX IF NOT EXISTS ecosystem_listings_type_idx
  ON ecosystem_listings(listing_type);

CREATE INDEX IF NOT EXISTS ecosystem_reviews_listing_idx
  ON ecosystem_reviews(listing_id);
