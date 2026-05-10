CREATE TABLE IF NOT EXISTS "dog_health_records" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "dog_id" uuid NOT NULL REFERENCES "dogs"("id") ON DELETE cascade,
  "recorded_by_profile_id" uuid NOT NULL REFERENCES "profiles"("id") ON DELETE restrict,
  "category" text DEFAULT 'vaccine' NOT NULL,
  "title" text NOT NULL,
  "performed_at" date NOT NULL,
  "next_due_at" date,
  "veterinarian" text,
  "clinic" text,
  "batch_number" text,
  "document_url" text,
  "note" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "dog_health_records_dog_date_idx"
  ON "dog_health_records" ("dog_id", "performed_at" DESC);

CREATE INDEX IF NOT EXISTS "dog_health_records_owner_idx"
  ON "dog_health_records" ("recorded_by_profile_id");

CREATE INDEX IF NOT EXISTS "dog_health_records_next_due_idx"
  ON "dog_health_records" ("next_due_at");
