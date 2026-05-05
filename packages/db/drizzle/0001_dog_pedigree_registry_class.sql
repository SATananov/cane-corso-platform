ALTER TABLE dogs
  ADD COLUMN IF NOT EXISTS registry_class text DEFAULT 'owner_declared_cane_corso';

ALTER TABLE dogs
  ADD COLUMN IF NOT EXISTS pedigree_json jsonb DEFAULT '{}'::jsonb;

UPDATE dogs
SET registry_class = 'owner_declared_cane_corso'
WHERE registry_class IS NULL;

UPDATE dogs
SET pedigree_json = '{}'::jsonb
WHERE pedigree_json IS NULL;
