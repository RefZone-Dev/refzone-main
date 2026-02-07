-- Migration for dashboard rework features

-- 1. Add daily goal fields and scenario streak to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS daily_scenario_goal integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS daily_quiz_goal integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS scenario_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_scenario_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_set_goals boolean DEFAULT false;

-- 2. Add law_category and law_section to scenarios for tracking performance per law
ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS law_category text,
ADD COLUMN IF NOT EXISTS law_section text;

-- 3. Add law_category and law_section to quiz_questions for tracking performance per law
ALTER TABLE quiz_questions
ADD COLUMN IF NOT EXISTS law_category text,
ADD COLUMN IF NOT EXISTS law_section text;

-- 4. Create user_law_performance table to track user performance per law category
CREATE TABLE IF NOT EXISTS user_law_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  law_category text NOT NULL,
  law_section text,
  total_attempts integer DEFAULT 0,
  correct_attempts integer DEFAULT 0,
  accuracy numeric(5,2) DEFAULT 0,
  last_attempt_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, law_category, law_section)
);

ALTER TABLE user_law_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_law_performance_select_own" ON user_law_performance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_law_performance_insert_own" ON user_law_performance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_law_performance_update_own" ON user_law_performance
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Create daily_activity_log table to track daily goals progress
CREATE TABLE IF NOT EXISTS daily_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  scenarios_completed integer DEFAULT 0,
  quizzes_completed integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

ALTER TABLE daily_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_activity_log_select_own" ON daily_activity_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_activity_log_insert_own" ON daily_activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_activity_log_update_own" ON daily_activity_log
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. Add Laws of the Game document config
INSERT INTO admin_config (config_key, config_value, description)
VALUES (
  'laws_of_the_game_document',
  'Please paste the Laws of the Game document here for AI reference.',
  'The full Laws of the Game document that AI uses to generate accurate scenarios and quizzes'
) ON CONFLICT (config_key) DO NOTHING;

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_law_performance_user_id ON user_law_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_user_law_performance_accuracy ON user_law_performance(user_id, accuracy);
CREATE INDEX IF NOT EXISTS idx_daily_activity_log_user_date ON daily_activity_log(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_scenarios_law_category ON scenarios(law_category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_law_category ON quiz_questions(law_category);
