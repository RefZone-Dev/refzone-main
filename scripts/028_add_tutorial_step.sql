-- Add tutorial_step column to track progress across page navigations
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tutorial_step INTEGER DEFAULT 0;

-- tutorial_step meanings:
-- 0 = not started / completed (check tutorial_completed)
-- 1-N = current step in tutorial flow
