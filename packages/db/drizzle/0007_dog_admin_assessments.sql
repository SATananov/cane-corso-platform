CREATE TABLE IF NOT EXISTS dog_admin_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid NOT NULL REFERENCES dogs(id) ON DELETE CASCADE UNIQUE,
  reviewer_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  registry_decision text NOT NULL DEFAULT 'not_reviewed',
  certificate_decision text NOT NULL DEFAULT 'not_reviewed',
  breed_type_score integer,
  temperament_score integer,
  pedigree_score integer,
  health_score integer,
  presentation_score integer,
  overall_score integer,
  public_note text,
  private_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dog_admin_assessments_registry_decision_check CHECK (
    registry_decision IN ('not_reviewed', 'registry_approved', 'needs_changes', 'usg_candidate', 'usg_certified')
  ),
  CONSTRAINT dog_admin_assessments_certificate_decision_check CHECK (
    certificate_decision IN ('not_reviewed', 'registry_approved', 'needs_changes', 'usg_candidate', 'usg_certified')
  ),
  CONSTRAINT dog_admin_assessments_breed_type_score_check CHECK (breed_type_score IS NULL OR breed_type_score BETWEEN 1 AND 5),
  CONSTRAINT dog_admin_assessments_temperament_score_check CHECK (temperament_score IS NULL OR temperament_score BETWEEN 1 AND 5),
  CONSTRAINT dog_admin_assessments_pedigree_score_check CHECK (pedigree_score IS NULL OR pedigree_score BETWEEN 1 AND 5),
  CONSTRAINT dog_admin_assessments_health_score_check CHECK (health_score IS NULL OR health_score BETWEEN 1 AND 5),
  CONSTRAINT dog_admin_assessments_presentation_score_check CHECK (presentation_score IS NULL OR presentation_score BETWEEN 1 AND 5),
  CONSTRAINT dog_admin_assessments_overall_score_check CHECK (overall_score IS NULL OR overall_score BETWEEN 1 AND 5)
);

CREATE INDEX IF NOT EXISTS dog_admin_assessments_dog_idx ON dog_admin_assessments (dog_id);
CREATE INDEX IF NOT EXISTS dog_admin_assessments_reviewer_idx ON dog_admin_assessments (reviewer_profile_id);
CREATE INDEX IF NOT EXISTS dog_admin_assessments_overall_score_idx ON dog_admin_assessments (overall_score);
