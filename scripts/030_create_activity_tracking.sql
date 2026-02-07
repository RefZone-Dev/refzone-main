-- Create activity tracking system for comprehensive user analytics

-- Create enum for action types
CREATE TYPE activity_action_type AS ENUM (
  'page_view',
  'quiz_start',
  'quiz_complete',
  'quiz_question_answer',
  'scenario_view',
  'scenario_complete',
  'scenario_choice',
  'decision_lab_analysis',
  'match_report_create',
  'match_report_view',
  'forum_post_create',
  'forum_post_view',
  'forum_reply_create',
  'forum_vote',
  'profile_view',
  'profile_edit',
  'settings_change',
  'achievement_unlock',
  'friend_request',
  'notification_view',
  'leaderboard_view',
  'login',
  'logout',
  'signup'
);

-- Create user activity log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type activity_action_type NOT NULL,
  action_details JSONB DEFAULT '{}'::jsonb,
  page_url TEXT,
  referrer_url TEXT,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_activity_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity_log(created_at DESC);
CREATE INDEX idx_user_activity_action_type ON user_activity_log(action_type);
CREATE INDEX idx_user_activity_session_id ON user_activity_log(session_id);
CREATE INDEX idx_user_activity_user_created ON user_activity_log(user_id, created_at DESC);

-- Create analytics summary table for faster queries
CREATE TABLE IF NOT EXISTS analytics_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  summary_date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_actions INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  avg_session_duration_seconds INTEGER DEFAULT 0,
  quiz_completions INTEGER DEFAULT 0,
  scenario_completions INTEGER DEFAULT 0,
  forum_posts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_summary_date ON analytics_summary(summary_date DESC);

-- Enable RLS
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;

-- Policies for activity log (admin only)
CREATE POLICY "Admins can view all activity logs"
  ON user_activity_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can insert their own activity"
  ON user_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for analytics summary (admin only)
CREATE POLICY "Admins can view analytics summary"
  ON analytics_summary
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Function to update analytics summary
CREATE OR REPLACE FUNCTION update_analytics_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO analytics_summary (
    summary_date,
    total_users,
    active_users,
    new_users,
    total_actions,
    total_sessions,
    avg_session_duration_seconds,
    quiz_completions,
    scenario_completions,
    forum_posts
  )
  SELECT
    CURRENT_DATE,
    (SELECT COUNT(*) FROM profiles),
    (SELECT COUNT(DISTINCT user_id) FROM user_activity_log WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM profiles WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM user_activity_log WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(DISTINCT session_id) FROM user_activity_log WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT AVG(duration_seconds)::INTEGER FROM user_activity_log WHERE DATE(created_at) = CURRENT_DATE AND duration_seconds IS NOT NULL),
    (SELECT COUNT(*) FROM user_activity_log WHERE DATE(created_at) = CURRENT_DATE AND action_type = 'quiz_complete'),
    (SELECT COUNT(*) FROM user_activity_log WHERE DATE(created_at) = CURRENT_DATE AND action_type = 'scenario_complete'),
    (SELECT COUNT(*) FROM user_activity_log WHERE DATE(created_at) = CURRENT_DATE AND action_type = 'forum_post_create')
  ON CONFLICT (summary_date)
  DO UPDATE SET
    total_users = EXCLUDED.total_users,
    active_users = EXCLUDED.active_users,
    new_users = EXCLUDED.new_users,
    total_actions = EXCLUDED.total_actions,
    total_sessions = EXCLUDED.total_sessions,
    avg_session_duration_seconds = EXCLUDED.avg_session_duration_seconds,
    quiz_completions = EXCLUDED.quiz_completions,
    scenario_completions = EXCLUDED.scenario_completions,
    forum_posts = EXCLUDED.forum_posts,
    updated_at = NOW();
END;
$$;

-- Add email_verified column if not exists (for user management)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;
END $$;

COMMENT ON TABLE user_activity_log IS 'Comprehensive tracking of all user activities for analytics';
COMMENT ON TABLE analytics_summary IS 'Daily aggregated analytics for faster dashboard queries';
