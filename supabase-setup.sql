-- ================================================================
-- RefZone — Complete database setup
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================================

-- ============================================================
-- 1. CREATE MISSING TABLES
-- ============================================================

-- Admin notifications (for important announcements)
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Track which users have seen important notifications
CREATE TABLE IF NOT EXISTS user_seen_important_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  notification_id uuid REFERENCES admin_notifications(id) ON DELETE CASCADE,
  seen_at timestamptz DEFAULT now(),
  UNIQUE(user_id, notification_id)
);

-- Admin config (key-value store for app settings)
CREATE TABLE IF NOT EXISTS admin_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key text UNIQUE NOT NULL,
  config_value text,
  updated_at timestamptz DEFAULT now()
);

-- Forum reports
CREATE TABLE IF NOT EXISTS forum_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  reporter_id text NOT NULL,
  reason text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- User customization (badges, shop items)
CREATE TABLE IF NOT EXISTS user_customization (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  active_badge text,
  active_badge_name text,
  active_badge_icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  achievement_key text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_key)
);

-- User feedback
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  feedback_type text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 2. ADD MISSING COLUMNS TO PROFILES
-- ============================================================

-- Tutorial columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tutorial_completed boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tutorial_step integer DEFAULT 0;

-- Admin flag
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Display name and user info
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_set_username boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_level text DEFAULT 'beginner';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Stats
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS scenarios_completed integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quizzes_completed integer DEFAULT 0;

-- Activity tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ============================================================
-- 3. ADD MISSING COLUMNS TO OTHER TABLES
-- ============================================================

-- Forum posts
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;

-- Scenarios
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Quizzes
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Notifications
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;

-- ============================================================
-- 4. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_law_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_seen_important_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. RLS POLICIES — Public read, service role writes
-- ============================================================

-- The app uses Clerk (not Supabase auth). Anon key = reads only.
-- Service role key (server-side) bypasses RLS for writes.
-- Strategy: DROP IF EXISTS then CREATE for each policy.

-- For each table: drop old policies, create read-only for anon
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles','quizzes','quiz_questions','quiz_attempts','quiz_answers',
      'scenarios','scenario_responses','scenario_attempts',
      'user_law_performance','user_activity_log','daily_activity_log',
      'notifications','admin_notifications','user_seen_important_notifications',
      'user_feedback','user_achievements','friendships',
      'forum_posts','forum_replies','forum_reports',
      'push_tokens','push_subscriptions','user_customization','admin_config'
    ])
  LOOP
    -- Only process if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      -- Drop any existing policies
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', tbl || '_select', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', tbl || '_insert', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', tbl || '_update', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', tbl || '_delete', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', tbl || '_modify', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'allow_select_' || tbl, tbl);

      -- Create read-only policy for anon/authenticated
      EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (true)', 'allow_select_' || tbl, tbl);
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- Done! All tables created, columns added, RLS enabled.
-- Anon key (client-side) can only SELECT.
-- Service role key (server-side) bypasses RLS completely.
-- ============================================================
