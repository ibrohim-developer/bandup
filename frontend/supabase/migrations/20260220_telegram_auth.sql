-- Telegram auth codes table for bot-based authentication
CREATE TABLE telegram_auth_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(6) NOT NULL UNIQUE,
  telegram_id BIGINT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  username TEXT,
  phone TEXT,
  photo_url TEXT,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_telegram_auth_codes_code ON telegram_auth_codes(code);
CREATE INDEX idx_telegram_auth_codes_expires ON telegram_auth_codes(expires_at);

-- Add telegram fields to profiles
ALTER TABLE profiles
  ADD COLUMN telegram_id BIGINT UNIQUE,
  ADD COLUMN phone TEXT;

-- RLS for telegram_auth_codes (only service role should access this table)
ALTER TABLE telegram_auth_codes ENABLE ROW LEVEL SECURITY;
