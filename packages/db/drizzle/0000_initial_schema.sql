CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider text NOT NULL,
  auth_subject text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  display_name text NOT NULL,
  first_name text,
  last_name text,
  avatar_url text,
  phone text,
  country text,
  city text,
  bio text,
  locale text DEFAULT 'en',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sex text NOT NULL,
  date_of_birth date,
  color text,
  microchip_number text UNIQUE,
  pedigree_number text,
  short_description text,
  long_description text,
  city text,
  country text,
  bloodline_note text,
  main_image_url text,
  visibility text NOT NULL DEFAULT 'private',
  lifecycle_status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dog_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  storage_key text NOT NULL,
  public_url text,
  mime_type text,
  size_bytes integer,
  media_type text NOT NULL DEFAULT 'image',
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  uploaded_by_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dog_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  submitted_by_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'submitted',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  last_reviewed_at timestamptz,
  current_review_note text,
  published_at timestamptz
);

CREATE TABLE IF NOT EXISTS submission_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES dog_submissions(id) ON DELETE CASCADE,
  reviewer_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  decision text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registry_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid NOT NULL UNIQUE REFERENCES dogs(id) ON DELETE CASCADE,
  public_slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  hero_image_url text,
  published_at timestamptz,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  certificate_code text NOT NULL UNIQUE,
  issue_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',
  verification_slug text NOT NULL UNIQUE,
  pdf_storage_key text,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  business_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  short_description text,
  long_description text,
  country text,
  city text,
  website_url text,
  phone text,
  email text,
  logo_url text,
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft',
  is_featured boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  business_name text NOT NULL,
  category text NOT NULL,
  message text,
  contact_email text NOT NULL,
  contact_phone text,
  status text NOT NULL DEFAULT 'pending_review',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  review_note text
);

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  metadata_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
