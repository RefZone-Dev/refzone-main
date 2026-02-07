-- Add "None" as a valid experience level option

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;

-- Add new constraint with "None" included
ALTER TABLE profiles ADD CONSTRAINT profiles_experience_level_check 
  CHECK (experience_level IN ('none', 'beginner', 'intermediate', 'advanced', 'professional'));
