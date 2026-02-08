-- Delete all existing scenarios and their responses
DELETE FROM scenario_responses;
DELETE FROM scenarios;

-- Update scenarios table to support video-based scenarios with AI analysis
ALTER TABLE scenarios
  DROP COLUMN IF EXISTS image_url,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS correct_decision,
  DROP COLUMN IF EXISTS explanation;

-- Add new columns for video scenarios
ALTER TABLE scenarios
  ADD COLUMN IF NOT EXISTS ai_answer TEXT,
  ADD COLUMN IF NOT EXISTS ai_description TEXT,
  ADD COLUMN IF NOT EXISTS ai_analysis_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS video_duration_seconds INTEGER DEFAULT 0;

-- Make video_url required
ALTER TABLE scenarios
  ALTER COLUMN video_url SET NOT NULL;

-- Add comment for clarity
COMMENT ON TABLE scenarios IS 'Video-based match scenarios with AI-generated answers and descriptions';
COMMENT ON COLUMN scenarios.video_url IS 'URL to the uploaded scenario video (required)';
COMMENT ON COLUMN scenarios.ai_answer IS 'AI-generated correct answer/decision for the scenario';
COMMENT ON COLUMN scenarios.ai_description IS 'AI-generated description of what is happening in the video';
COMMENT ON COLUMN scenarios.ai_analysis_date IS 'When the AI analysis was performed';
