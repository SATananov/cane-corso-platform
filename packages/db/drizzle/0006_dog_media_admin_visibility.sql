ALTER TABLE dog_media
  ADD COLUMN IF NOT EXISTS visible_in_registry boolean NOT NULL DEFAULT true;

ALTER TABLE dog_media
  ADD COLUMN IF NOT EXISTS visible_in_usg_gallery boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS dog_media_registry_visibility_idx
  ON dog_media (dog_id, visible_in_registry, sort_order);

CREATE INDEX IF NOT EXISTS dog_media_usg_gallery_idx
  ON dog_media (visible_in_usg_gallery, dog_id, sort_order);
