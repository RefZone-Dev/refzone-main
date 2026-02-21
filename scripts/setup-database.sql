-- RefZone Database Setup Script
-- Run this in your Supabase SQL Editor to create all required tables
-- This script is idempotent (safe to run multiple times)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  has_set_username BOOLEAN DEFAULT false,
  date_of_birth DATE,
  privacy_agreed BOOLEAN DEFAULT false,
  privacy_agreed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  ai_answer TEXT,
  law_category TEXT,
  law_section TEXT,
  scenario_type TEXT DEFAULT 'foul',
  difficulty TEXT DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  points_value INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenario responses
CREATE TABLE IF NOT EXISTS scenario_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  confidence INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'medium',
  time_limit_minutes INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  options TEXT[],
  correct_answer TEXT,
  explanation TEXT,
  points_value INTEGER DEFAULT 5,
  order_index INTEGER DEFAULT 0,
  law_category TEXT,
  law_section TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER,
  total_possible INTEGER,
  percentage DECIMAL,
  total_questions INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table (legacy, keeping for compatibility)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  confidence INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin config table
CREATE TABLE IF NOT EXISTS admin_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER DEFAULT 0,
  scenarios_completed INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily activity log table
CREATE TABLE IF NOT EXISTS daily_activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  scenarios_completed INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- User law performance table
CREATE TABLE IF NOT EXISTS user_law_performance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  law_category TEXT NOT NULL,
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  accuracy DECIMAL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, law_category)
);

-- Forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  moderation_status TEXT DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum votes table
CREATE TABLE IF NOT EXISTS forum_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_law_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Users can view all profiles, but only update their own
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Scenarios: Everyone can view active scenarios, admins can manage all
DROP POLICY IF EXISTS "Active scenarios are viewable by everyone" ON scenarios;
CREATE POLICY "Active scenarios are viewable by everyone" ON scenarios FOR SELECT USING (
  is_active = true OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Scenario responses: Users can manage their own responses
DROP POLICY IF EXISTS "Users can view own responses" ON scenario_responses;
CREATE POLICY "Users can view own responses" ON scenario_responses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own responses" ON scenario_responses;
CREATE POLICY "Users can insert own responses" ON scenario_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quizzes: Everyone can view active quizzes
DROP POLICY IF EXISTS "Active quizzes are viewable by everyone" ON quizzes;
CREATE POLICY "Active quizzes are viewable by everyone" ON quizzes FOR SELECT USING (
  is_active = true OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Quiz questions: Everyone can view questions for active quizzes
DROP POLICY IF EXISTS "Quiz questions are viewable by everyone" ON quiz_questions;
CREATE POLICY "Quiz questions are viewable by everyone" ON quiz_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.is_active = true) OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Quiz attempts: Users can manage their own attempts
DROP POLICY IF EXISTS "Users can view own attempts" ON quiz_attempts;
CREATE POLICY "Users can view own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON quiz_attempts;
CREATE POLICY "Users can insert own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily activity log: Users can manage their own logs
DROP POLICY IF EXISTS "Users can view own activity" ON daily_activity_log;
CREATE POLICY "Users can view own activity" ON daily_activity_log FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity" ON daily_activity_log;
CREATE POLICY "Users can insert own activity" ON daily_activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own activity" ON daily_activity_log;
CREATE POLICY "Users can update own activity" ON daily_activity_log FOR UPDATE USING (auth.uid() = user_id);

-- User law performance: Users can manage their own performance
DROP POLICY IF EXISTS "Users can view own performance" ON user_law_performance;
CREATE POLICY "Users can view own performance" ON user_law_performance FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own performance" ON user_law_performance;
CREATE POLICY "Users can insert own performance" ON user_law_performance FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own performance" ON user_law_performance;
CREATE POLICY "Users can update own performance" ON user_law_performance FOR UPDATE USING (auth.uid() = user_id);

-- Forum posts: Everyone can view approved posts, users manage their own
DROP POLICY IF EXISTS "Approved posts are viewable by everyone" ON forum_posts;
CREATE POLICY "Approved posts are viewable by everyone" ON forum_posts FOR SELECT USING (moderation_status = 'approved');

DROP POLICY IF EXISTS "Users can insert own posts" ON forum_posts;
CREATE POLICY "Users can insert own posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON forum_posts;
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE USING (auth.uid() = user_id);

-- Forum replies: Everyone can view replies, users manage their own
DROP POLICY IF EXISTS "Replies are viewable by everyone" ON forum_replies;
CREATE POLICY "Replies are viewable by everyone" ON forum_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own replies" ON forum_replies;
CREATE POLICY "Users can insert own replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Forum votes: Users can manage their own votes
DROP POLICY IF EXISTS "Users can view own votes" ON forum_votes;
CREATE POLICY "Users can view own votes" ON forum_votes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own votes" ON forum_votes;
CREATE POLICY "Users can insert own votes" ON forum_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own votes" ON forum_votes;
CREATE POLICY "Users can delete own votes" ON forum_votes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- AUTH TRIGGER
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN NEW.email = 'refzone.office@gmail.com' THEN true
      ELSE false
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default admin config
INSERT INTO admin_config (config_key, config_value) VALUES
  ('daily_scenario_prompt', 'Generate a realistic football refereeing scenario.'),
  ('weekly_quiz_prompt', 'Generate a football refereeing quiz with 5 questions.')
ON CONFLICT (config_key) DO NOTHING;

-- ============================================
-- INDEXES (for better performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_scenario_responses_user_id ON scenario_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_responses_scenario_id ON scenario_responses(scenario_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity_log(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
