ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verification_code text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verification_expires_at timestamptz;
