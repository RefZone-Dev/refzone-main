-- First, drop the existing check constraint and add a new one with more requirement types
ALTER TABLE public.achievements DROP CONSTRAINT IF EXISTS achievements_requirement_type_check;

ALTER TABLE public.achievements ADD CONSTRAINT achievements_requirement_type_check 
CHECK (requirement_type IN ('streak', 'points', 'scenarios', 'quizzes', 'accuracy', 'reports', 'decision_lab', 'community', 'lotg', 'special'));
