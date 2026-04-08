-- This script sets up the admin user
-- First, create a trigger that automatically sets is_admin for the specified email

CREATE OR REPLACE FUNCTION set_admin_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user's email matches an admin email
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = NEW.id
    AND email IN ('refzone.office@gmail.com', 'henrytowen@googlemail.com')
  ) THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS set_admin_trigger ON profiles;

CREATE TRIGGER set_admin_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_admin_on_signup();

-- Also update any existing users with admin emails
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email IN ('refzone.office@gmail.com', 'henrytowen@googlemail.com')
);
