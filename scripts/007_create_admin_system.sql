-- Add admin role to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('scenario', 'quiz', 'general')),
  related_id UUID,
  feedback_text TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON user_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON user_feedback(feedback_type);

-- Enable RLS
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback
CREATE POLICY "Users can insert their own feedback" ON user_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" ON user_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback" ON user_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Create admin config table for AI prompts and settings
CREATE TABLE IF NOT EXISTS admin_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default AI prompt configurations
INSERT INTO admin_config (config_key, config_value, description)
VALUES
  ('daily_scenario_prompt', 'Generate a realistic football refereeing scenario that tests decision-making skills. Include context, player positions, and a clear decision point.', 'Prompt used to generate daily scenarios'),
  ('weekly_quiz_prompt', 'Generate a comprehensive quiz with 10-15 questions covering Laws of the Game, including multiple choice, true/false, and scenario-based questions.', 'Prompt used to generate weekly quizzes'),
  ('match_report_prompt_prefix', 'You are a professional football referee report writer. Generate formal, detailed reports suitable for submission to football authorities.', 'Prefix added to all match report generation prompts')
ON CONFLICT (config_key) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin config
CREATE POLICY "Admins can view all config" ON admin_config
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update all config" ON admin_config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
