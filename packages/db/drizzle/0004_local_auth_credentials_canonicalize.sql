DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'local_auth_credentials'
  ) THEN
    INSERT INTO auth_local_credentials (user_id, password_hash, created_at, updated_at)
    SELECT legacy.user_id, legacy.password_hash, legacy.created_at, legacy.updated_at
    FROM local_auth_credentials AS legacy
    ON CONFLICT (user_id) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      created_at = LEAST(auth_local_credentials.created_at, EXCLUDED.created_at),
      updated_at = GREATEST(auth_local_credentials.updated_at, EXCLUDED.updated_at);

    DROP TABLE local_auth_credentials;
  END IF;
END
$$;
