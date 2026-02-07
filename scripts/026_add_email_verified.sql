-- Add email_verified column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- Backfill: mark users as verified if their email is confirmed in auth.users
UPDATE public.profiles p
SET email_verified = true
FROM auth.users u
WHERE p.id = u.id
AND u.email_confirmed_at IS NOT NULL;

-- Create a trigger function to sync email_verified when auth.users changes
CREATE OR REPLACE FUNCTION public.sync_email_verified()
RETURNS trigger AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
    UPDATE public.profiles
    SET email_verified = true
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists, then create it
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_email_verified();
