CREATE TABLE IF NOT EXISTS ecosystem_match_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES ecosystem_listings(id) ON DELETE CASCADE,
  requester_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  message text NOT NULL,
  contact_preference text,
  phone text,
  email text,
  status text NOT NULL DEFAULT 'pending_review',
  admin_note text,
  reviewed_at timestamp with time zone,
  connected_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ecosystem_match_requests_listing_id_idx
  ON ecosystem_match_requests(listing_id);

CREATE INDEX IF NOT EXISTS ecosystem_match_requests_requester_profile_id_idx
  ON ecosystem_match_requests(requester_profile_id);

CREATE INDEX IF NOT EXISTS ecosystem_match_requests_status_idx
  ON ecosystem_match_requests(status);
