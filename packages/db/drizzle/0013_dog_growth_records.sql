CREATE TABLE IF NOT EXISTS "dog_measurement_records" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "dog_id" uuid NOT NULL REFERENCES "dogs"("id") ON DELETE cascade,
  "recorded_by_profile_id" uuid NOT NULL REFERENCES "profiles"("id") ON DELETE restrict,
  "measured_at" date NOT NULL,
  "age_months" integer,
  "weight_kg" numeric(6, 2),
  "height_withers_cm" numeric(6, 2),
  "body_length_cm" numeric(6, 2),
  "chest_circumference_cm" numeric(6, 2),
  "head_length_cm" numeric(6, 2),
  "muzzle_length_cm" numeric(6, 2),
  "skull_length_cm" numeric(6, 2),
  "note" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "dog_measurement_records_dog_date_idx"
  ON "dog_measurement_records" ("dog_id", "measured_at" DESC);

CREATE INDEX IF NOT EXISTS "dog_measurement_records_owner_idx"
  ON "dog_measurement_records" ("recorded_by_profile_id");
